/* All subjects use the actual Physics Island workbench and cutscene player. */
(() => {
  const P = window.AtlasPhysicsPixelArt;
  const esc = (v) =>
    String(v).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const mathCore = window.AtlasMathScenarios;
  const mathScenarios = mathCore.scenarios.map((s) => ({
    ...s,
    subtitle: s.crisis,
    npc: {
      name: s.companion.name,
      stance: s.companion.title,
      quote: s.companion.quote,
    },
    rounds: s.acts.map((a) => ({
      ...a,
      actions: Object.entries(a.actions).map(([id, action]) => ({
        id,
        ...action,
      })),
    })),
    final: {
      publish: s.conclusion.title,
      detail: s.conclusion.description,
      success: s.conclusion.scopeGood,
      overreach: s.conclusion.scopeBad,
    },
  }));
  const mathGame = {
    ...mathCore,
    scenarios: mathScenarios,
    byId: Object.fromEntries(mathScenarios.map((s) => [s.id, s])),
    roles: mathCore.roles.map((r) => ({
      ...r,
      title: r.name,
      skill: r.perk,
      ...r.resources,
    })),
    lab(id, round) {
      const lab = mathCore.lab(id, round);
      return {
        ...lab,
        goal: lab.prompt,
        hint: mathCore.byId[id].acts[round].description,
      };
    },
  };
  function dataFor(raw) {
    const levels = raw.levels.map((l) => ({
      ...l,
      source: l.source || l.sources[0],
      steps: l.steps || l.tasks,
      greeting: l.greeting || l.quote,
    }));
    return { levels, byId: Object.fromEntries(levels.map((l) => [l.id, l])) };
  }
  const mathData = dataFor(window.AtlasMathData),
    chemData = dataFor(window.AtlasChemistryData),
    chemGame = window.AtlasChemistryScenarios;
  const reasoning = {
    M01: "假设 √2=p/q 且 p、q 互质。p²=2q² 迫使 p 为偶数；写 p=2k，又得到 q²=2k²，q 也为偶数，与互质矛盾。因此 √2 不是有理数。有限小数逼近本身不能完成这个证明。",
    M02: "等式两端同时加减相同的量，或同乘除相同的非零数，解集不变。求解后代回原式检查；实物天平不能移走盘上不存在的砝码。",
    M03: "坐标需要先约定原点、方向与单位。在这份直线模型中，把 (1,2)、(3,6) 代入 y=mx，都得到 m=2。",
    M04: "函数允许不同输入拥有相同输出；要求是定义域内每个输入只有一个确定输出。对应关系也不自动意味着因果关系。",
    M05: "检查 x=0、12 处的桥基，再检查 x=3、9 处的净空。向下开口的抛物线在该区间的最小值位于端点；几何尺寸并不等于真实承重能力。",
    M06: "本关先旋转再平移。刚体变换保持长度与角度；相似放大 s 倍，面积成为 s² 倍。变换顺序会影响最后的位置。",
    M07: "在欧氏平面中，直角三角形两条直角边的平方和等于斜边平方。先检查三边能否组成非退化三角形，不能把勾股关系用于所有三角形。",
    M08: "船相对岸的速度等于船相对水的速度加水相对岸的速度。抵达正对岸须抵消横漂；允许漂移、河宽和船速固定时，垂直对岸可使时间最短。",
    M09: "给定 h(t)=100−8t+0.2t²，在 t=10 处割线斜率为 −4+0.2Δt；Δt 趋于 0 时极限为 −4。这是示意函数，不是真实滴漏的流体模型。",
    M10: "残差平方和只衡量拟合数据上的误差。第 24 天的 15° 观测没有参与拟合，应用它检验预报。这份二次曲线不是谷神星真实轨道解算。",
  };
  mathData.levels.forEach((l) => (l.learningNote = reasoning[l.id]));
  const themeFor = (id, raw) => {
    const base = P.themes["P" + id.slice(1)];
    return {
      ...base,
      ...raw,
      ink: raw.ink || "#fff3dd",
      secondary: raw.secondary || base.secondary,
      wash: raw.panel,
    };
  };
  const mathThemes = Object.fromEntries(
    mathData.levels.map((l) => [
      l.id,
      themeFor(l.id, window.AtlasMathPixelArt.themes[l.id]),
    ]),
  );
  const chemThemes = Object.fromEntries(
    chemData.levels.map((l) => [
      l.id,
      themeFor(l.id, {
        label: l.place,
        paper: l.bg,
        panel: l.panel,
        accent: l.color,
        muted: "#d4cbb7",
      }),
    ]),
  );
  function portrait(id, variant) {
    if (id.startsWith("M"))
      return window.AtlasMathPixelArt.portrait(id, variant).replace(
        'class="px-portrait"',
        'class="px-portrait atlas-portrait"',
      );
    if (variant !== undefined) return P.portrait("P" + id.slice(1), variant);
    return window.AtlasChemistryArt.portrait(id).replace(
      "<svg ",
      '<svg class="px-portrait atlas-portrait" ',
    );
  }
  function framedScene(id, theme, instrument) {
    // The same terrain renderer, stage proportions, architecture and sprites as Physics.
    const n = Number(id.slice(1)),
      night = [3, 5, 6, 8, 9, 10].includes(n);
    const back =
      P.backdrop(theme, n) +
      P.house(8, 100, 69, 100, theme) +
      P.tree(565, 149, theme, 0.8) +
      P.house(572, 95, 54, 111, theme, false);
    const body = instrument
      .replace(/(<text\b[^>]*\bfill=")#483d35("[^>]*>)/g, `$1${theme.ink}$2`)
      .replace("<svg ", '<svg x="78" y="-3" width="484" height="266" ');
    const sprite = portrait(id).replace(
      "<svg ",
      '<svg x="36" y="192" width="34" height="38" ',
    );
    return `<svg class="px-scene atlas-scene subject-pixel-scene" viewBox="0 0 640 256" role="img" aria-label="${esc(theme.label)}" shape-rendering="crispEdges"><title>${esc(theme.label)}</title>${back}<rect x="79" y="24" width="480" height="218" fill="${theme.paper}" opacity="${night ? 0.7 : 0.82}"/>${body}${sprite}<path d="M79 242h480" stroke="${theme.secondary}" stroke-width="2"/></svg>`;
  }
  function introFor(data, art, game, english) {
    return {
      create(options) {
        const l = data.byId[options.id],
          s = game.byId[options.id],
          steps = l.steps;
        return window.AtlasLevelIntro.create(options, {
          data,
          art,
          subject: english,
          info: {
            title: l.title,
            roleTitle: l.concept + " · 问题的探索者",
            eraLocation: l.era,
            prologueText: l.history + "\n\n" + l.opening,
            quote: l.greeting,
            story: l.opening,
            challenge: s.rounds.map((r) => r.description).join(" "),
            missionStep1: steps[0].goal,
            missionStep2: steps[1].goal,
            law: l.formula,
            ...options.info,
          },
        });
      },
    };
  }
  function bindMath({ host, getState, getParams, update, canInteract }) {
    let drag = null;
    const down = (e) => {
      const handle = e.target.closest("[data-drag]");
      if (!handle || !canInteract()) return;
      const svg = handle.closest("svg");
      drag = { key: handle.dataset.drag, svg, id: e.pointerId };
      svg.setPointerCapture(e.pointerId);
      e.preventDefault();
      move(e);
    };
    const move = (e) => {
      if (!drag || drag.id !== e.pointerId || !canInteract()) return;
      const matrix = drag.svg.getScreenCTM();
      if (!matrix) return;
      const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(
          matrix.inverse(),
        ),
        x = point.x,
        y = point.y;
      const changes = {
        coordinate: () => ({
          targetX: Math.round((x - 225) / 36),
          targetY: Math.round((352 - y) / 36),
        }),
        vertex: () => ({
          archH: Math.round((x - 150) / 42),
          archK: (370 - y) / 40,
        }),
        transform: () => ({
          shiftX: Math.round((x - 300) / 30),
          shiftY: Math.round((260 - y) / 30),
        }),
        heading: () => ({
          boatAngle: Math.max(
            0,
            Math.min(180, (Math.atan2(330 - y, x - 340) * 180) / Math.PI),
          ),
        }),
      }[drag.key];
      if (changes) update(changes());
    };
    const up = (e) => {
      if (drag?.id !== e.pointerId) return;
      if (drag.svg.hasPointerCapture(e.pointerId))
        drag.svg.releasePointerCapture(e.pointerId);
      drag = null;
    };
    const key = (e) => {
      const handle = e.target.closest("[data-drag]");
      if (!handle || !canInteract()) return;
      const names = {
        coordinate: ["targetX", "targetY"],
        vertex: ["archH", "archK"],
        transform: ["shiftX", "shiftY"],
        heading: ["boatAngle", "boatAngle"],
      }[handle.dataset.drag];
      if (!names) return;
      if (e.key === "Enter") {
        e.preventDefault();
        host.querySelector("#sandbox-" + names[0])?.focus();
        return;
      }
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key))
        return;
      e.preventDefault();
      e.stopPropagation();
      const vertical = ["ArrowUp", "ArrowDown"].includes(e.key),
        name = names[vertical ? 1 : 0],
        step = handle.dataset.drag === "vertex" && vertical ? 0.1 : 1,
        sign = ["ArrowUp", "ArrowRight"].includes(e.key) ? 1 : -1;
      update({ [name]: Number(getParams()[name]) + step * sign });
    };
    return bind(host, down, move, up, key);
  }
  function bindChemistry({ host, getState, update, canInteract }) {
    let drag = null;
    const down = (e) => {
      const handle = e.target.closest("[data-chem-angle]");
      if (!handle || !canInteract()) return;
      const svg = handle.closest("svg");
      drag = {
        svg,
        id: e.pointerId,
        scale: Number(handle.dataset.scale),
        yaw: Number(handle.dataset.yaw),
      };
      svg.setPointerCapture(e.pointerId);
      e.preventDefault();
    };
    const move = (e) => {
      if (!drag || drag.id !== e.pointerId || !canInteract()) return;
      const matrix = drag.svg.getScreenCTM();
      if (!matrix) return;
      const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(
          matrix.inverse(),
        ),
        id = getState().id,
        x = (point.x - 400) / drag.scale,
        y =
          point.y -
          (id === "C07" ? 225 : 235) +
          (id === "C06" ? 0.22 * x * drag.yaw : 0);
      update({
        angle:
          Math.round(
            Math.max(
              90,
              Math.min(180, (Math.atan2(Math.abs(x), y) * 360) / Math.PI),
            ) * 2,
          ) / 2,
      });
    };
    const up = (e) => {
      if (drag?.id !== e.pointerId) return;
      if (drag.svg.hasPointerCapture(e.pointerId))
        drag.svg.releasePointerCapture(e.pointerId);
      drag = null;
    };
    const key = (e) => {
      const handle = e.target.closest("[data-chem-angle]");
      if (
        !handle ||
        !canInteract() ||
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
      )
        return;
      e.preventDefault();
      e.stopPropagation();
      update({
        angle:
          Number(handle.getAttribute("aria-valuenow")) +
          (["ArrowLeft", "ArrowDown"].includes(e.key) ? -0.5 : 0.5),
      });
    };
    return bind(host, down, move, up, key);
  }
  function bind(host, down, move, up, key) {
    const events = [
      ["pointerdown", down],
      ["pointermove", move],
      ["pointerup", up],
      ["pointercancel", up],
      ["keydown", key],
    ];
    events.forEach(([name, fn]) => host.addEventListener(name, fn));
    return {
      destroy() {
        events.forEach(([name, fn]) => host.removeEventListener(name, fn));
      },
    };
  }
  function soundMath() {
    const s = window.AtlasMathSound;
    return { ...s, playSuccess: s.playStamp, playError: s.playFail };
  }
  function createMath(options) {
    const art = {
      themes: mathThemes,
      portrait,
      scene(id, opts = {}) {
        return framedScene(
          id,
          mathThemes[id],
          window.AtlasMathPixelArt.scene(id, { ...opts, instrumentOnly: true }),
        );
      },
    };
    return window.AtlasScenarioWorkbench.create(options, {
      game: mathGame,
      data: mathData,
      art,
      research: window.AtlasMathInvestigations,
      sandbox: window.AtlasMathSandbox,
      sound: soundMath(),
      intro: introFor(mathData, art, mathGame, "MATHEMATICS"),
      subject: { name: "数学", english: "MATHEMATICS" },
      bindInteractions: bindMath,
      legacyLabel: (id) => (id === "M06" ? "另试一次自由函数工坊" : ""),
      nextParams(state) {
        return mathCore.cleanParams(
          state.id,
          1,
          state.id === "M10"
            ? state.log.findLast((e) => e.round === 0 && e.success && e.result)
                ?.result.params || {}
            : {},
        );
      },
      onReplay(id, params) {
        if (id === "M01") window.AtlasMathSound.playRatio(params.ratio);
      },
    });
  }
  function createChemistry(options) {
    let view = 35;
    const art = {
      themes: chemThemes,
      portrait,
      scene(id, opts = {}) {
        return framedScene(
          id,
          chemThemes[id],
          window.AtlasChemistryArt.scene(
            id,
            opts.round || 0,
            opts.params || {},
            { live: opts.interactive === true, view, instrumentOnly: true },
          ),
        );
      },
    };
    const sandbox = {
      patch: window.AtlasPhysicsSandbox.patch,
      telemetry(id, round, params) {
        const r = chemGame.test(id, round, params);
        return {
          metrics: r.readings,
          statusText: r.detail,
          isSuccess: r.success,
          result: r,
        };
      },
      create({ host }) {
        return {
          update() {},
          pause(paused) {
            host.classList.toggle("sandbox-paused", paused);
          },
          replay() {
            host
              .querySelectorAll(".subject-instrument *")
              .forEach((el) =>
                el.getAnimations().forEach((a) => (a.currentTime = 0)),
              );
          },
          destroy() {
            host.classList.remove("sandbox-paused");
          },
        };
      },
    };
    return window.AtlasScenarioWorkbench.create(options, {
      game: chemGame,
      data: chemData,
      art,
      research: chemGame.research,
      sandbox,
      intro: introFor(chemData, art, chemGame, "CHEMISTRY"),
      subject: { name: "化学", english: "CHEMISTRY" },
      bindInteractions: bindChemistry,
      legacyLabel: (id) =>
        ["C05", "C06"].includes(id) ? "另试一次自由分子工坊" : "",
      stageActions: (id) =>
        id === "C06" ? '<button data-do="rotate">↻ 旋转模型</button>' : "",
      onAction(action, ui) {
        if (action === "rotate") {
          view = view === 35 ? -35 : 35;
          ui.render();
        }
      },
    });
  }
  function createIntro(options, subject) {
    const math = subject === "M",
      data = math ? mathData : chemData,
      game = math ? mathGame : chemGame,
      themes = math ? mathThemes : chemThemes;
    const art = {
      themes,
      portrait,
      scene(id, opts = {}) {
        return framedScene(
          id,
          themes[id],
          math
            ? window.AtlasMathPixelArt.scene(id, {
                ...opts,
                instrumentOnly: true,
              })
            : window.AtlasChemistryArt.scene(
                id,
                opts.round || 0,
                opts.params || {},
                { instrumentOnly: true, view: 35 },
              ),
        );
      },
    };
    return introFor(data, art, game, math ? "MATHEMATICS" : "CHEMISTRY").create(
      options,
    );
  }
  window.AtlasSubjectLevels = {
    createMath,
    createChemistry,
    createIntro,
    mathGame,
    mathData,
    chemData,
  };
})();
