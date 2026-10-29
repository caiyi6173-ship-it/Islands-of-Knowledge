/* One persistent workbench: free exploration, committed evidence, then an argument. */
(() => {
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

  const endings = {
    breakthrough: {
      name: "让证据发光",
      label: "完整发现",
      text: "两幕取证连成了完整的解释。你回应了质疑，也把结论的边界写进记录。",
      color: "good",
    },
    discovery: {
      name: "一条新的航路",
      label: "发现成立",
      text: "实验与调查互相支持。还有问题没有解决，但这一份发现已经有了可以检验的依据。",
      color: "good",
    },
    provisional: {
      name: "问题仍在继续",
      label: "保留结论",
      text: "这一次，证据或信任还不够。把没有解决的地方留下来，也是研究的一部分。你可以更换策略再来。",
      color: "neutral",
    },
    overreach: {
      name: "跑在证据前面的宣言",
      label: "过度推断",
      text: "一句漂亮的宣言无法替代证据。你的结论越过了本次实验能支持的范围，在场的人提出了新的反例。",
      color: "risk",
    },
  };

  function create(
    { id, host, record, achievement, onUpdate, onExit, onNext, onLegacy },
    config = {},
  ) {
    const G = config.game || window.AtlasPhysicsScenarios;
    const D = config.data || window.AtlasPhysicsData;
    const A = config.art || window.AtlasPhysicsPixelArt;
    const R = config.research || window.AtlasPhysicsInvestigations;
    const Sandbox = config.sandbox || window.AtlasPhysicsSandbox;
    const Sound = config.sound || window.AtlasPhysicsSound;
    const Intro = config.intro || window.AtlasPhysicsLevelIntro;
    const subject = config.subject || { name: "物理", english: "PHYSICS" };
    const getLiveTelemetry = Sandbox.telemetry;
    const legacyLabel =
      config.legacyLabel?.(id) || (id === "P03" ? "另试一次自由投篮" : "");
    const s = G.byId[id],
      l = D.byId[id],
      theme = A.themes[id],
      index = G.scenarios.indexOf(s);

    let state = G.restore(id, record);
    if (achievement?.complete) {
      state.cleared = true;
      state.bestStars = Math.max(state.bestStars, Math.max(0, Math.min(3, Math.trunc(Number(achievement.bestStars) || 0))));
    }
    let researchRunId = record?.researchRunId || window.AtlasResearchSession.token();
    let roleChoice = state.role || "assistant";

    // 默认进入一体化沙盒工作台
    if (!state.role) {
      state = G.fresh(id, roleChoice, state);
    }

    let view = "scene",
      params = G.cleanParams(id, state.round || 0),
      prediction = null,
      comparisonMode = false,
      argument = { claim: null, scope: null, records: [] },
      notes = false,
      notice = "",
      destroyed = false,
      paused = false,
      inputFrame = 0,
      shakeTimer = 0;
    const observed = new Set();
    const sandbox = Sandbox.create({ host, id });
    if (state.round < 2 && state.last?.result)
      params = { ...state.last.result.params };
    if (state.round === 2) {
      params = {
        ...(state.log.findLast((entry) => entry.round === 1 && entry.result)
          ?.result.params || G.cleanParams(id, 1)),
      };
      argument = state.argument
        ? JSON.parse(JSON.stringify(state.argument))
        : initialArgument();
    }

    host.classList.add("event-console", "physics-level-host");
    const modal = host.closest(".modal");
    modal.classList.add(
      "physics-level-modal",
      "event-modal",
      "pixel-event-modal",
    );
    modal.dataset.physicsTheme = id;
    modal.dataset.subjectTheme = id[0];
    modal.style.setProperty("--event-gold", theme.accent);
    modal.style.setProperty("--event-wash", theme.wash);
    modal.style.setProperty("--event-bg", theme.paper);
    for (const [key, value] of Object.entries({
      bg: theme.paper,
      panel: theme.panel,
      accent: theme.accent,
      muted: theme.muted,
      ink: theme.ink,
      secondary: theme.secondary,
      line: theme.far,
      ground: theme.ground,
    }))
      modal.style.setProperty("--px-" + key, value);

    const emit = () => {
      if (!destroyed) onUpdate({ ...JSON.parse(JSON.stringify(state)), researchRunId });
    };
    const role = () => G.roles.find((r) => r.id === (state.role || roleChoice));
    const points = () => state.evidence.reduce((n, e) => n + e.points, 0);

    function computeStars() {
      return G.rating(state);
    }

    function commit(next) {
      if (!next || destroyed) return;
      cancelAnimationFrame(inputFrame);
      state = next;
      notice = "";
      emit();
      render();
    }

    function header() {
      const soundMuted = Sound ? Sound.isMuted() : false;
      return `
        <header class="event-header">
          <button class="event-back" data-do="exit">← <span>${esc(subject.name)}岛</span></button>
          <div class="event-heading">
            <p>${esc(subject.english)} / SCENARIO ${id.slice(1)} <span>· ${esc(l.concept)}</span></p>
            <h2 id="modal-title">${esc(s.title)}</h2>
          </div>
          <div class="event-stars" aria-label="本关最佳 ${state.bestStars} 星" title="通关后评星：发现成立、亲手验证、对照研究">
            ${[0, 1, 2].map((i) => `<span class="star ${i < state.bestStars ? "earned" : ""}">★</span>`).join("")}
            <small>最佳 ${state.bestStars}/3</small>
          </div>
          <div class="event-header-actions">
            <button class="event-icon event-sound-toggle" data-do="toggle-sound" aria-label="${soundMuted ? "开启音效" : "静音"}" aria-pressed="${soundMuted}" title="音效开关">${soundMuted ? "🔇" : "🔊"}</button>
            <button class="event-icon" data-do="intro" title="重播开场动画">▶ 开场</button>
            <span class="event-save">● 本机存档</span>
            <button id="story-bookmark" class="event-icon" data-do="notes" aria-expanded="${notes}" aria-label="人物与史实">手记</button>
            <button class="event-icon event-close" data-do="exit" aria-label="关闭关卡">×</button>
          </div>
        </header>
      `;
    }

    function historyNote() {
      return `
        <section class="event-history-note">
          <div><span class="event-kicker">HISTORY / FICTION</span><h3>人物、问题与史实</h3></div>
          <p>${esc(l.history)}</p>
          <p>本关人物对白、角色身份与分支结局为教学创作；${id === "P03" ? "山顶炮弹属于思想实验。" : "场景不是历史现场的复原。"}</p>
          ${(l.sources || [l.source]).map(([label, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">查阅原始线索 · ${esc(label)} ↗</a>`).join("")}
          <details><summary>实验模型与适用范围</summary><p>${esc(l.boundary)}</p></details>
          ${l.learningNote ? `<details><summary>为什么成立</summary><p>${esc(l.learningNote)}</p></details>` : ""}
          ${legacyLabel ? `<button data-do="legacy" class="event-link">${esc(legacyLabel)} →</button>` : ""}
        </section>
      `;
    }

    function crew() {
      const r = role();
      const canSwitchRole = state.round === 0 && state.log.length === 0;
      return `
        <aside class="event-crew">
          <div class="event-your-role">
            <span class="event-kicker">YOUR ROLE</span>
            <div>
              ${A.portrait(id, G.roles.indexOf(r))}
              <div>
                <small>由你扮演</small>
                <h3>${esc(s.roleNames[G.roles.indexOf(r)])}</h3>
                <span>${esc(r.skill)}</span>
              </div>
            </div>
            ${
              canSwitchRole
                ? `
              <div class="event-role-quick" title="正式实验前可自由切换分工">
                ${G.roles
                  .map(
                    (ro, idx) => `
                  <button class="event-role-chip ${ro.id === (state.role || roleChoice) ? "selected" : ""}" data-role="${ro.id}">
                    ${esc(s.roleNames[idx])}
                  </button>
                `,
                  )
                  .join("")}
              </div>
            `
                : ""
            }
          </div>
          <section class="event-resources">
            <h4>行动资源 <span>自由探索不消耗资源</span></h4>
            ${[
              ["time", "时间", r.time + (state.supplies ? 4 : 0)],
              ["tools", "器材", r.tools + (state.supplies ? 2 : 0)],
              ["trust", "信任", 5],
            ]
              .map(
                ([key, label, max]) => `
                <div class="event-resource">
                  <div><span>${label}</span><b>${state.resources[key]}<small> / ${max}</small></b></div>
                  <div class="event-resource-bar" role="meter" aria-label="${label}" aria-valuenow="${state.resources[key]}" aria-valuemin="0" aria-valuemax="${max}">
                    <i style="width:${(state.resources[key] / max) * 100}%"></i>
                  </div>
                </div>
              `,
              )
              .join("")}
          </section>
          <section class="event-cast">
            <span class="event-kicker">AT THE SCENE</span>
            <div class="event-cast-person">
              ${A.portrait(id)}
              <div><h4>${esc(l.person)}</h4><p>研究伙伴</p></div>
              <i>同行</i>
            </div>
            <div class="event-cast-person">
              ${A.portrait(id, 1)}
              <div><h4>${esc(s.npc.name)}</h4><p>${esc(s.npc.stance)}</p></div>
              <i class="${state.resources.trust < 2 ? "doubt" : ""}">${state.resources.trust < 2 ? "质疑" : state.resources.trust >= 4 ? "支持" : "观望"}</i>
            </div>
          </section>
          <section class="event-pocket">
            <span class="event-kicker">EVIDENCE BAG</span>
            <h4>${points()} <small>点证据强度</small></h4>
            <p>发表发现需要强度 ≥ 3、至少一次成功实验，以及仍在的信任。</p>
            ${
              state.evidence
                .map(
                  (e, i) => `
              <div class="event-pocket-item">
                <b>0${i + 1}</b>
                <span>${esc(e.title)}<small>${e.kind === "experiment" ? "实验证据" : e.kind === "rush" ? "试探线索" : "调查线索"} +${e.points}</small></span>
              </div>
            `,
                )
                .join("") ||
              '<p class="event-empty">还没有证据。<br>先让现象开口说话。</p>'
            }
          </section>
        </aside>
      `;
    }

    function logPanel() {
      return `
        <aside class="event-log">
          <span class="event-kicker">WORLDLINE LOG</span>
          <h3>发生过的事</h3>
          <div class="event-log-open"><i></i><small>事件开始</small><p>${esc(s.subtitle)}</p></div>
          ${state.log
            .map(
              (e, i) => `
            <div class="event-log-entry ${e.success === false ? "adverse" : ""}">
              <span>${String(i + 1).padStart(2, "0")}</span>
              <div>
                <small>第${e.round + 1}幕 · ${e.action === "experiment" ? "实验" : e.action === "consult" ? "调查" : e.round === 2 ? "结论" : e.action === "skip" ? "保留" : "试探"}</small>
                <h4>${esc(e.title)}</h4>
                <p>${esc(e.text)}</p>
                ${e.cost ? `<b>时间 −${e.cost.time} / 器材 −${e.cost.tools}</b>` : ""}
              </div>
            </div>
          `,
            )
            .join("")}
          <p class="event-log-tip">行动由本地编写的规则结算。人物回应为预设剧情。</p>
        </aside>
      `;
    }

    function canEditSandbox() {
      return (
        !destroyed &&
        !host.inert &&
        !notes &&
        view === "scene" &&
        state.round < 2 &&
        !state.ended
      );
    }

    function stage() {
      const r = Math.min(1, state.round),
        live = getLiveTelemetry(id, r, params);
      return `
        <section class="event-stage">
          <div class="event-stage-top"><span><i></i> ${esc(l.place)}</span><small>${esc(theme.label)}</small></div>
          <div class="event-stage-visual">${A.scene(id, { round: r, params, interactive: canEditSandbox() })}</div>
          <div class="sandbox-stage-toolbar">
            <span><i></i> LIVE LAB <small>自由探索 · 零消耗</small></span>
            <div>${config.stageActions?.(id) || ""}<button data-do="pause" aria-pressed="${paused}">${paused ? "▶ 继续" : "Ⅱ 暂停"}</button><button data-do="replay">↺ 重播现象</button></div>
          </div>
          <div class="event-live-telemetry" aria-label="实时实验读数"><div class="telemetry-metrics">
            ${live.metrics.map(([label, val]) => `<div class="telemetry-item"><span>${esc(label)}</span><strong>${esc(val)}</strong></div>`).join("")}
          </div></div>
          <div class="sandbox-mentor">${A.portrait(id)}<div><small>${esc(l.person)} · 研究伙伴 / 教学对白</small><p>${esc(state.last?.reply || state.last?.text || "先动手观察。正式记录才消耗资源，未达目标的结果也值得留下。")}</p></div></div>
        </section>
      `;
    }

    function nav() {
      return `
        <nav class="event-tabs" aria-label="关卡视角">
          ${[
            ["scene", "事件现场"],
            ["evidence", `证据袋 ${state.evidence.length}`],
            ["history", "事件记录"],
          ]
            .map(
              ([v, label]) => `
            <button data-view="${v}" aria-pressed="${view === v}" class="${view === v ? "active" : ""}">${label}</button>
          `,
            )
            .join("")}
        </nav>
      `;
    }

    function evidenceView() {
      return `
        <section class="event-evidence-view">
          <span class="event-kicker">WHAT CAN WE ACTUALLY SAY?</span>
          <h3>把线索变成证据</h3>
          <p>调查提供方向，实验检验判断。同一幕保留最强支持，其他观察仍留在事件记录里。</p>
          ${
            state.evidence
              .map(
                (e, i) => `
            <article>
              <small>证据 0${i + 1} · ${e.kind === "experiment" ? "实验" : e.kind === "rush" ? "试探" : "调查"} · 强度 +${e.points}</small>
              <h4>${esc(e.title)}</h4>
              <p>${esc(e.detail)}</p>
            </article>
          `,
              )
              .join("") ||
            '<div class="event-empty-card">证据袋是空的。回到现场，选择一次调查或实验。</div>'
          }
          ${researchLedger()}
          <div class="event-science-card">
            <span>本关的知识线索</span>
            <h4>${esc(l.concept)}</h4>
            <code>${esc(l.formula)}</code>
            <p>${esc(l.takeaway)}</p>
          </div>
          <button class="event-secondary" data-view="scene">回到事件现场 →</button>
        </section>
      `;
    }

    function researchLedger() {
      const trials = state.log.filter((entry) => entry.action === "experiment");
      return `
        <section class="research-ledger">
          <span class="event-kicker">LAB NOTEBOOK / 实验记录本</span>
          <h4>达成与未达目标的尝试，都留在这里。</h4>
          ${
            trials
              .map(
                (entry, index) => `
            <details>
              <summary>实验 ${String(index + 1).padStart(2, "0")} · 第 ${entry.round + 1} 幕 · ${esc(entry.observation?.label || entry.title)}</summary>
              <p>${esc(entry.text)}</p>
              <dl>
                ${entry.result.readings
                  .map(
                    ([label, value]) => `
                  <div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>
                `,
                  )
                  .join("")}
              </dl>
              ${entry.observation?.prediction ? `<p>当时的预判：${esc(entry.observation.predictedLabel)} · ${entry.observation.matched ? "与观察一致" : "需要重新考虑"}</p>` : ""}
              ${entry.comparison?.fair ? "<small>本次仅改变一个设置，构成同幕公平比较。</small>" : ""}
            </details>
          `,
              )
              .join("") || "<p>还没有实验读数，回到现场开始一次观察。</p>"
          }
        </section>
      `;
    }

    function labView() {
      const def = G.lab(id, state.round),
        forecast = R.forecast(id, state.round);
      const info = R.comparison(state, params);
      comparisonMode = !!info?.fair;
      const consulted = state.log.some(
        (entry) => entry.round === state.round && entry.action === "consult",
      );
      const duplicate = state.log.some(
        (entry) =>
          entry.round === state.round &&
          entry.action === "experiment" &&
          JSON.stringify(entry.result.params) === JSON.stringify(params),
      );
      const canRun =
        !duplicate &&
        G.canAct(state, "experiment", params, { comparison: comparisonMode });
      const resourceBlocked = !G.canAct(state, "experiment", params, {
        comparison: comparisonMode,
      });
      const cost = G.cost(state, "experiment", params, {
        comparison: comparisonMode,
      });
      return `
        <section class="event-lab">
          <div class="sandbox-mission"><span class="event-kicker">MISSION 0${state.round + 1}</span><h3 id="event-scene-title" tabindex="-1">${esc(s.rounds[state.round].title)}</h3><p>${esc(def.goal)}</p></div>
          <div class="event-lab-controls">
            ${def.controls
              .map(
                (c) => `
              <fieldset data-key="${c.key}">
                <legend>${esc(c.label)} ${c.range ? `<output for="sandbox-${c.key}">${Number(params[c.key]).toFixed(c.range.step < 1 ? Math.max(2, String(c.range.step).split(".")[1]?.length || 0) : 0)}</output>` : ""}</legend>
                ${c.range ? `<input id="sandbox-${c.key}" data-range="${c.key}" type="range" min="${c.range.min}" max="${c.range.max}" step="${c.range.step}" value="${params[c.key]}" aria-label="${esc(c.label)}"><div class="sandbox-range-ticks"><span>${c.range.min}</span><span>拖动即刻观察</span><span>${c.range.max}</span></div>` : ""}
                <div>${c.values.map(([value, label], i) => `<button data-param="${c.key}" data-option="${i}" class="${params[c.key] === value ? "selected" : ""}" aria-pressed="${params[c.key] === value}">${esc(label)}</button>`).join("")}</div>
              </fieldset>
            `,
              )
              .join("")}
          </div>
          ${info ? `<div class="sandbox-reference ${info.fair ? "fair" : ""}"><strong>${info.fair ? "↔ 公平对照已识别" : "参照记录已固定"}</strong><span>${info.fair ? "仅改变" + esc(settingName(info.changes[0])) + (info.discount ? " · 本次仅耗 1 时间，复用器材" : " · 本幕优惠已使用") : info.changes.length > 1 ? "改变了多个条件，按普通实验记录" : "改动一个条件，即可建立对照"}</span></div>` : ""}
          <details class="sandbox-optional"><summary>写下我的预判 <small>可选 · 不影响探索</small></summary><section class="research-prediction"><h4>${esc(forecast.question)}</h4><div>${forecast.options.map((option) => `<button data-prediction="${option.id}" aria-pressed="${prediction === option.id}" class="${prediction === option.id ? "selected" : ""}">${esc(option.label)}</button>`).join("")}</div></section></details>
          <div class="sandbox-commit-bar"><div><strong>正式记录</strong><span>时间 −${cost.time} · 器材 −${cost.tools}</span><small>未达目标扣 1 信任；调参、暂停和重播均免费</small></div><button id="scenario-run" class="event-primary" data-do="run" ${!canRun ? "disabled" : ""}>${duplicate ? "这组设置已记录" : "记录当前实验"} <span>→</span></button></div>
          ${resourceBlocked ? `<div class="event-emergency-card"><div><strong>正式实验资源不足，仍可免费探索</strong><p>${G.canResupply(state) ? "本次可申请一次备用补给：时间 +4、器材 +2，本轮最高 2 星。" : state.supplies ? "本轮补给已使用。可保留记录继续，或重新挑战。" : "仅改变一个条件，可尝试使用本幕的对照优惠。"}</p></div>${G.canResupply(state) ? '<button data-do="emergency-repair">领取一次补给</button>' : '<button data-do="restart">重新挑战</button>'}</div>` : ""}
          <div class="sandbox-secondary-actions">${!consulted ? `<button class="event-link" data-do="consult-lab" ${!G.canAct(state, "consult") ? "disabled" : ""}>向${esc(l.person)}请教 · 时间 −1</button>` : "<span>✓ 调查线索已收录</span>"}${!state.pending ? '<button class="event-link" data-action="skip">保留本幕问题，继续 →</button>' : ""}</div>
        </section>
      `;
    }

    function settingName(key) {
      return (
        G.lab(id, state.round).controls.find((control) => control.key === key)
          ?.label || key
      );
    }

    function settingValue(key, value) {
      return (
        G.lab(id, state.round)
          .controls.find((control) => control.key === key)
          ?.values.find(([v]) => v === value)?.[1] || String(value)
      );
    }

    function observationView(entry) {
      if (!entry.observation) return "";
      const o = entry.observation;
      return `
        <div class="research-observation">
          <span class="event-kicker">OBSERVATION / 现象记录</span>
          <h4>${esc(o.label)}</h4>
          ${
            o.prediction
              ? `
            <p><span>你的预判</span>${esc(o.predictedLabel)}</p>
            <p class="research-reflection">${o.matched ? "观察与预判一致。接下来检验它能否面对新条件。" : "观察与预判不同。这条记录值得保留，可以用对照继续追问。"}</p>
          `
              : '<p class="research-reflection">这次先留下观察，再决定怎样解释。</p>'
          }
        </div>
      `;
    }

    function comparisonView(entry) {
      if (!entry.comparison?.fair) return "";
      const base = state.log[entry.comparison.baseIndex];
      const key = entry.comparison.changes[0];
      const readings = new Map(base.result.readings);
      return `
        <section class="research-comparison">
          <span class="event-kicker">ONE CHANGE / 公平比较</span>
          <h4>只改变了${esc(settingName(key))}</h4>
          <p>${esc(settingValue(key, base.result.params[key]))} → ${esc(settingValue(key, entry.result.params[key]))}</p>
          <div class="research-reading-table" role="table" aria-label="参照与本次读数">
            <div role="row"><b role="columnheader">观察项目</b><b role="columnheader">参照</b><b role="columnheader">本次</b></div>
            ${entry.result.readings
              .map(
                ([label, value]) => `
              <div role="row">
                <span role="rowheader">${esc(label)}</span>
                <span role="cell">${esc(readings.get(label) || "—")}</span>
                <span role="cell">${esc(value)}</span>
              </div>
            `,
              )
              .join("")}
          </div>
          <small>同一幕、同一模型，其余设置保持一致。${entry.comparison.discount ? "本次使用了该幕的对照优惠。" : "本次按普通复验成本结算。"}</small>
        </section>
      `;
    }

    function scientificPlot(result) {
      if (id === "P01") {
        const q = window.AtlasPhysicsModels.evaluate(id, {
          shape: result.params.shape,
          cargo: state.round ? 4 : 0,
        });
        return `
          <div class="event-comparison">
            <div><span>总重 / 对应水重</span><i style="width:${(q.mass / 6.4) * 100}%"></i><b>${q.mass.toFixed(1)} kg</b></div>
            <div><span>进水前最大承载</span><i class="green" style="width:${(q.capacity / 6.4) * 100}%"></i><b>${q.capacity.toFixed(1)} kg</b></div>
            <p>总重超过最大排水重量，船就无法保持漂浮。</p>
          </div>
        `;
      }
      if (id === "P03") {
        const path = result.plot,
          max = Math.max(1, ...path.map(([x, y]) => Math.hypot(x, y))),
          scale = 94 / max;
        return `
          <figure class="event-plot event-orbit">
            <svg viewBox="0 0 540 250" role="img" aria-label="根据中心引力模型计算的炮弹轨迹">
              <circle cx="270" cy="125" r="${0.68 * scale}" fill="#496c58" stroke="#83a385"/>
              <path d="${path.map(([x, y], i) => `${i ? "L" : "M"}${(270 + x * scale).toFixed(2)},${(125 + y * scale).toFixed(2)}`).join(" ")}" fill="none" stroke="var(--event-gold)" stroke-width="2" class="event-orbit-path"/>
              <circle cx="270" cy="${125 - scale}" r="3" fill="#bfa666"/>
              <text x="20" y="235" fill="#7f9479" font-size="10">轨迹由中心引力计算 · 每幅按轨迹范围缩放</text>
            </svg>
          </figure>
        `;
      }
      if (id === "P04") {
        const q = window.AtlasPhysicsModels.evaluate(id, {
          ...result.params,
          heat: 0,
          drops: 0,
        });
        return `
          <div class="event-energy">
            <div><i style="width:${(q.heatAdded / 196) * 100}%"></i></div>
            <p><b>留在水中 ${q.heatAdded.toFixed(1)} J</b><span>其他流向 ${(196 - q.heatAdded).toFixed(1)} J</span></p>
            <small>输入196 J = 水中能量 + 装置与环境中的其他能量</small>
          </div>
        `;
      }
      if (id === "P06") {
        return `
          <div class="event-induction">
            <span>磁通变化 →</span>
            <div class="event-galvanometer ${result.params.motion === "in" ? "alternating" : result.params.motion === "turn" ? "turning" : ""}">
              <i></i><b>−　 0　 +</b>
            </div>
            <span>${result.params.motion === "in" ? "推进 / 拉出，偏转反向" : result.params.motion === "turn" ? "持续机械输入" : "停止以后，指针归零"}</span>
          </div>
        `;
      }
      if (id === "P07") {
        return `
          <div class="event-signal">
            <span>发射 ${result.params.frequency}</span>
            <div class="${result.success ? "matched" : ""}">
              ${Array.from({ length: 22 }, (_, i) => `<i style="height:${8 + Math.sin(i * 0.9) ** 2 * 27}px;animation-delay:${-i * 0.1}s"></i>`).join("")}
            </div>
            <span>接收 ${state.round ? 5 : 3}</span>
          </div>
        `;
      }
      if (id === "P08") {
        return `
          <div class="event-comparison">
            ${(state.round
              ? [
                  ["矿石", 56],
                  ["强信号组分", 94],
                ]
              : result.params.protocol === "control"
                ? [
                    ["背景", 5],
                    ["铀", 30],
                    ["矿石", 56],
                  ]
                : result.params.protocol === "pair"
                  ? [
                      ["铀", 30],
                      ["矿石", 56],
                    ]
                  : [["矿石", 56]]
            )
              .map(
                ([label, v]) => `
              <div><span>${label}</span><i class="green" style="width:${v}%"></i><b>${v}</b></div>
            `,
              )
              .join("")}
            <p>同条件虚拟读数，数值为教学示意。</p>
          </div>
        `;
      }
      if (id === "P10") {
        const q = state.round
          ? window.AtlasPhysicsModels.evaluate(id, result.params, 1)
          : null;
        return `
          <div class="event-photoelectric">
            <div>
              <span>入射光</span><i class="${state.round ? result.params.color : "blue"}"></i><b>金属</b>
              <div class="event-electrons">
                ${Array.from({ length: q ? q.electrons : result.success ? 3 : 0 }, (_, i) => `<i style="animation-delay:${-i * 0.17}s"></i>`).join("")}
              </div>
            </div>
            <p>${q ? (q.electrons ? `电子数量示意：${q.electrons}` : "未跨过逸出功，没有电子逸出") : result.success ? "强红光：0　/　弱蓝光：有电子" : "弱红光：0　/　强红光：0"}</p>
          </div>
        `;
      }
      if (id === "P09") {
        const temp = result.params.temperature === "hot" ? 1.8 : 1;
        const q = window.AtlasPhysicsModels.evaluate(id, {
          model: result.params.model,
          temperature: temp === 1.8 ? "hot" : "warm",
        });
        const scale = 1.25;
        const path = (quantized) =>
          Array.from({ length: 70 }, (_, i) => {
            const x = 0.05 + i * 0.075,
              y = q.spectrum(x, quantized);
            return `${i ? "L" : "M"}${(25 + x * 92).toFixed(1)},${(140 - (y / scale) * 115).toFixed(1)}`;
          }).join(" ");
        return `
          <figure class="event-plot">
            <svg viewBox="0 0 540 165" role="img" aria-label="无量纲热辐射曲线，金色为分份模型，虚线为经典近似">
              <defs><clipPath id="spectrum-area"><rect x="25" y="10" width="495" height="130"/></clipPath></defs>
              <path d="M25 10V140H520" fill="none" stroke="#bac5a4"/>
              <path clip-path="url(#spectrum-area)" d="${path(false)}" fill="none" stroke="#b3ad8c" stroke-width="2" stroke-dasharray="5 5"/>
              <path clip-path="url(#spectrum-area)" d="${path(true)}" fill="none" stroke="var(--event-gold)" stroke-width="3"/>
              <text x="415" y="160" fill="#9ba78a" font-size="10">频率 / 无量纲</text>
            </svg>
            <figcaption>金色：分份模型　虚线：经典低频近似。曲线为无量纲教学示意。</figcaption>
          </figure>
        `;
      }
      if (id === "P02") {
        const layouts = {
          equal: [1, 2, 3],
          square: [1, 4, 9],
          linear: [2, 4, 6],
        };
        const times = layouts[result.params.layout].map((x) =>
          Math.sqrt(x / (state.round ? 2 : 1)),
        );
        return `
          <div class="event-time-track" aria-label="三个到达时刻的比较">
            <span>时间 →</span>
            ${times.map((t, i) => `<i style="left:${12 + (t / times[2]) * 78}%"><b>${i + 1}</b><small>${t.toFixed(2)}</small></i>`).join("")}
          </div>
        `;
      }
      if (id === "P05") {
        const wavelength = state.round ? 450 : 600,
          gap = result.params.gap;
        return `
          <div class="event-interference" aria-label="干涉光强示意">
            ${Array.from({ length: 90 }, (_, i) => `<i style="opacity:${result.params.slits === "two" ? (0.08 + 0.92 * Math.cos((Math.PI * gap * (0.5 + ((i - 44.5) / 44.5) * 0.6) * 600) / wavelength) ** 2).toFixed(3) : 1}"></i>`).join("")}
            <b>目标刻线</b>
          </div>
        `;
      }
      return "";
    }

    function consequence() {
      const e = state.last;
      return `
        <section class="event-consequence sandbox-result ${e.success ? "positive" : "adverse"}" aria-live="polite">
          <div><span class="event-kicker">${e.success ? "RECORD SAVED / 正式记录已保存" : "TRY AGAIN / 观察已保留"}</span><h3 tabindex="-1" id="event-result-title">${e.action === "experiment" ? (e.success ? "目标达成 · 本幕证据强度 2" : "未达本幕目标 · 信任 −1") : e.action === "skip" ? "问题已保留" : "找到新的调查线索"}</h3></div>
          <p>${esc(e.text)}</p>
          <div class="sandbox-result-meta"><span>时间 −${e.cost.time} · 器材 −${e.cost.tools} · 信任 ${Number.isFinite(e.trustDelta) ? (e.trustDelta > 0 ? "+" : "") + e.trustDelta : state.resources.trust}</span><button id="scenario-next" class="event-primary" data-do="next">${state.round === 1 ? "整理发现" : "挑战新条件"} →</button></div>
          <details><summary>查看本次数据与对照</summary>${observationView(e)}${e.result ? scientificPlot(e.result) : ""}${comparisonView(e)}</details>
        </section>
      `;
    }

    function finalDecision() {
      const claims = R.cases[id].claims.map((text, index) => ({
        id: ["supported", "alternative-1", "alternative-2"][index],
        text,
      }));
      const offset = Number(id.slice(1)) % 3;
      const ordered = [...claims.slice(offset), ...claims.slice(0, offset)];
      const ready =
        !!argument.claim && !!argument.scope && argument.records.length > 0;
      const score = R.assess(state, argument);
      return `
        <section class="event-final-decision research-argument">
          <span class="event-kicker">ACT 03 / 让结论接受质疑</span>
          <h3 tabindex="-1" id="event-scene-title">把你的解释，连到实际记录上</h3>
          <p>${esc(s.npc.name)}在等你回应：${esc(s.npc.quote)}</p>
          <section class="research-argument-step">
            <h4><b>01</b>我怎样解释这个现象？</h4>
            <div class="research-hypotheses">
              ${ordered
                .map(
                  (claim) => `
                <button data-hypothesis="${claim.id}" aria-pressed="${argument.claim === claim.id}" class="${argument.claim === claim.id ? "selected" : ""}">
                  ${esc(claim.text)}
                </button>
              `,
                )
                .join("")}
            </div>
          </section>
          <details class="research-argument-step sandbox-proof-details">
            <summary>02 · 已带入 ${argument.records.length} 条支持记录 <small>展开调整</small></summary>
            <h4>我用哪些记录来支持它？<small>选择 1—3 条</small></h4>
            <p class="research-proof-help">参照与新条件都需要支持。同一幕不叠分，至少一条应来自成功的完整实验。</p>
            <div class="research-proof-records">
              ${
                state.log
                  .map((entry, index) =>
                    entry.round < 2
                      ? `
                <button data-proof-record="${index}" aria-pressed="${argument.records.includes(index)}" class="${argument.records.includes(index) ? "selected" : ""}">
                  <span class="research-proof-check">${argument.records.includes(index) ? "◆" : "◇"}</span>
                  <div>
                    <small>记录 ${String(index + 1).padStart(2, "0")} · 第 ${entry.round + 1} 幕 · ${entry.action === "experiment" ? "完整实验" : entry.action === "consult" ? "调查" : entry.action === "rush" ? "试探" : "等待"}</small>
                    <strong>${esc(entry.observation?.label || entry.title)}</strong>
                    <p>${esc(entry.text)}</p>
                    ${entry.result ? `<p class="research-record-readings">${entry.result.readings.map(([label, value]) => esc(label + "：" + value)).join(" · ")}</p>` : ""}
                    <b>${entry.points ? `支持强度 ${entry.points}` : "保留观察 · 尚未支持本幕目标"}</b>
                  </div>
                </button>
              `
                      : "",
                  )
                  .join("") || "<p>目前没有行动记录，可以选择保留结论。</p>"
              }
            </div>
          </details>
          <section class="research-argument-step">
            <h4><b>03</b>这份结论适用于哪里？</h4>
            <div class="research-scope">
              <button data-boundary="tested" aria-pressed="${argument.scope === "tested"}" class="${argument.scope === "tested" ? "selected" : ""}">
                ${esc(s.final.detail)}
              </button>
              <button data-boundary="universal" aria-pressed="${argument.scope === "universal"}" class="${argument.scope === "universal" ? "selected" : ""}">
                把这次结果推广到所有环境、材料与条件，不再说明限制。
              </button>
            </div>
          </section>
          <div class="research-argument-status" role="status">
            已选 ${argument.records.length} 条记录 · 两幕支持 ${score.complete ? "已覆盖" : "待补齐"} · 选中支持强度 ${score.score} / 3
          </div>
          <div class="research-argument-actions">
            <button class="event-secondary" data-action="reserve">暂时保留结论</button>
            <button class="event-primary" data-action="publish" ${!ready ? "disabled" : ""}>提交这份论证 →</button>
          </div>
          <p class="research-proof-help">${ready ? "人物将根据你的解释、实际记录和适用范围回应。" : "选好解释、记录与适用范围后，即可提交。"}</p>
        </section>
      `;
    }

    function researchReport() {
      const report = R.report(state);
      return `
        <section class="research-report">
          <span class="event-kicker">RESEARCH NOTES / 本次研究印记</span>
          <div>
            ${[
              ["先想后试", "在实验前留下预判"],
              ["公平比较", "只改一个条件作对照"],
              ["证据成链", "用两幕记录支持有边界的解释"],
            ]
              .map(
                ([title, detail], index) => `
              <article class="${report.badges[index] ? "earned" : ""}">
                <b>${report.badges[index] ? "◆" : "◇"}</b>
                <strong>${title}</strong>
                <small>${detail}</small>
              </article>
            `,
              )
              .join("")}
          </div>
          <p>${report.experiments} 次实验 · ${report.comparisons} 组公平比较${report.revised ? ` · ${report.revised} 次观察让你重新考虑预判` : ""}</p>
          ${report.argument ? `<p class="research-argument-feedback">${esc(report.argument.reason)}</p>` : ""}
        </section>
      `;
    }

    function game() {
      const content = notes
        ? historyNote()
        : view === "history"
          ? `<div class="event-mobile-log">${logPanel()}</div>`
          : view === "evidence"
            ? evidenceView()
            : state.ended
              ? ending()
              : state.round === 2
                ? finalDecision()
                : `<div class="sandbox-workbench-slot">${labView()}</div><div class="sandbox-result-slot">${state.pending ? consequence() : ""}</div>`;
      return `
        <div class="event-act-strip">${["建立参照", "挑战新条件", "整理发现"].map((title, i) => `<span class="${i === state.round ? "current" : i < state.round ? "complete" : ""}"><b>${i < state.round ? "✓" : "0" + (i + 1)}</b>${title}</span>`).join("")}<small>自由探索 → 正式记录 → 收录发现</small></div>
        <div class="event-game-layout">${crew()}<main class="event-main"><div class="sandbox-stage-slot">${stage()}</div>${nav()}<div class="sandbox-content-slot">${content}</div></main>${logPanel()}</div>
      `;
    }

    function ending() {
      const e = endings[state.ending],
        nextId = G.scenarios[index + 1]?.id;
      return `
        <section class="event-ending">
          <div class="event-ending-content">
            <span class="event-kicker">WORLDLINE ${id} / ${esc(e.label)}</span>
            <h1 tabindex="-1">${esc(e.name)}</h1>
            <p class="event-ending-story">${esc(state.argument && !R.assess(state, state.argument).valid ? R.assess(state, state.argument).reason : state.ending === "overreach" ? s.npc.name + "没有接受这个宣言。一次有限的实验，承担不起一个没有边界的断言。" : state.ending === "provisional" ? e.text : s.final.success)}</p>
            <div class="event-ending-stats">
              <span><b>${points()}</b>证据强度</span>
              <span><b>${state.resources.time}</b>剩余时间</span>
              <span><b>${state.endings.length}<small> / 4</small></b>已收集结局</span>
            </div>
            <section class="sandbox-reward">
              ${A.portrait(id)}
              <div><span class="event-kicker">${["breakthrough", "discovery"].includes(state.ending) ? "DISCOVERY COLLECTED / 发现已收录" : "RESEARCH IN PROGRESS / 研究继续"}</span><h3>${esc(l.person)} · ${["breakthrough", "discovery"].includes(state.ending) ? "人物手记已收录" : "等待你的新证据"}</h3><p>本次 ${computeStars().count} 星 · 历史最佳 ${state.bestStars} 星</p><div class="sandbox-rating">${computeStars()
                .stars.map(
                  (star) =>
                    `<span title="${esc(star.hint)}" class="${star.earned ? "earned" : ""}">${star.earned ? "★" : "☆"} ${esc(star.label)}<small>${esc(star.hint)}</small></span>`,
                )
                .join("")}</div></div>
            </section>
            ${researchReport()}
            <div class="event-science-card">
              <span>这次可以带走的发现</span>
              <h3>${esc(l.concept)}</h3>
              <code>${esc(l.formula)}</code>
              <p>${esc(l.takeaway)}</p>
            </div>
            <details class="event-ending-replay">
              <summary>回看这一次的选择 · ${state.log.length} 条记录</summary>
              ${state.log.map((x, i) => `<p><b>0${i + 1} / ${esc(x.title)}</b><br>${esc(x.text)}</p>`).join("")}
            </details>
            ${
              ["provisional", "overreach"].includes(state.ending)
                ? `
              <div class="research-revise">
                <button class="event-secondary" data-do="revise">用现有记录，修订这份论证 →</button>
                <p>修改解释、证据或范围不再扣资源；需要新数据时，可以重玩实验。</p>
              </div>
            `
                : ""
            }
            <div class="event-ending-actions">
              <button class="event-secondary" data-do="restart">换个身份，再试一条路</button>
              <button id="scenario-next-level" class="event-primary" data-do="next-level">
                ${nextId ? "下一事件 · " + D.byId[nextId].person : "查看全岛发现"} →
              </button>
            </div>
            <div class="event-collected-endings">
              ${Object.entries(endings)
                .map(
                  ([k, v]) => `
                <span class="${state.endings.includes(k) ? "collected" : ""}">${state.endings.includes(k) ? "◆" : "◇"} ${esc(v.label)}</span>
              `,
                )
                .join("")}
            </div>
            ${historyNote()}
          </div>
        </section>
      `;
    }

    function render() {
      if (destroyed) return;
      cancelAnimationFrame(inputFrame);
      Sandbox.patch(
        host,
        header() +
          `<div class="event-body">${game()}</div><footer class="event-footer"><span><i></i> ${state.ended ? "发现已保存" : subject.name + "即时沙盒 · 本机存档"}</span><span>${notice || "调参免费 · 正式失误扣信任 · 公平对照节省器材"}</span></footer>`,
      );
      sandbox.update(Math.min(state.round, 1), params);
    }

    function updateLiveSandbox(key, value) {
      if (!canEditSandbox()) return;
      params = G.cleanParams(id, state.round, { ...params, [key]: value });
      comparisonMode = !!R.comparison(state, params)?.fair;
      Sandbox.patch(host.querySelector(".sandbox-stage-slot"), stage());
      Sandbox.patch(host.querySelector(".sandbox-workbench-slot"), labView());
      sandbox.update(state.round, params);
      const live = getLiveTelemetry(id, state.round, params);
      if (live.isSuccess && !observed.has(state.round)) {
        observed.add(state.round);
        Sound?.playParam();
      }
    }

    function handleInput(event) {
      const input = event.target.closest("input[data-range]");
      if (!input || !canEditSandbox()) return;
      params = G.cleanParams(id, state.round, {
        ...params,
        [input.dataset.range]: Number(input.value),
      });
      cancelAnimationFrame(inputFrame);
      inputFrame = requestAnimationFrame(() => {
        if (!destroyed && input.isConnected)
          updateLiveSandbox(input.dataset.range, Number(input.value));
      });
    }

    function initialArgument() {
      const records = [0, 1]
        .map((round) =>
          state.log.reduce((best, entry, index, log) => {
            if (entry.round !== round || !entry.points) return best;
            if (
              best < 0 ||
              entry.points > log[best].points ||
              (entry.points === log[best].points &&
                entry.action === "experiment")
            )
              return index;
            return best;
          }, -1),
        )
        .filter((index) => index >= 0);
      return { claim: null, scope: "tested", records };
    }

    function handle(event) {
      const button = event.target.closest("button");
      if (!button || !host.contains(button) || button.disabled) return;

      if (Sound && !["toggle-sound"].includes(button.dataset.do)) {
        Sound.playClick();
      }

      // 快速切换角色（仅限第一幕实验提交前）
      if (button.dataset.role) {
        roleChoice = button.dataset.role;
        researchRunId = window.AtlasResearchSession.token();
        state = G.fresh(id, roleChoice, state);
        emit();
        render();
        return;
      }

      if (button.dataset.view) {
        view = button.dataset.view;
        render();
        host.querySelector(`[data-view="${view}"]`)?.focus();
        return;
      }

      if (button.dataset.prediction) {
        prediction =
          prediction === button.dataset.prediction
            ? null
            : button.dataset.prediction;
        render();
        host
          .querySelector(`[data-prediction="${button.dataset.prediction}"]`)
          ?.focus();
        return;
      }

      if (
        button.dataset.hypothesis ||
        button.dataset.boundary ||
        button.dataset.proofRecord !== undefined
      ) {
        let selector;
        if (button.dataset.hypothesis) {
          argument.claim = button.dataset.hypothesis;
          selector = `[data-hypothesis="${argument.claim}"]`;
        } else if (button.dataset.boundary) {
          argument.scope = button.dataset.boundary;
          selector = `[data-boundary="${argument.scope}"]`;
        } else {
          const index = Number(button.dataset.proofRecord);
          if (argument.records.includes(index))
            argument.records = argument.records.filter(
              (value) => value !== index,
            );
          else if (argument.records.length < 3) argument.records.push(index);
          else notice = "最多选择 3 条记录，可以先移除一条再更换。";
          selector = `[data-proof-record="${index}"]`;
        }
        render();
        host.querySelector(selector)?.focus();
        return;
      }

      // 即时沙盒参数点击：执行局部更新，杜绝整屏刷新！
      if (button.dataset.param) {
        const control = G.lab(id, state.round).controls.find(
          (c) => c.key === button.dataset.param,
        );
        updateLiveSandbox(
          control.key,
          control.values[Number(button.dataset.option)][0],
        );
        button.focus();
        return;
      }

      const action = button.dataset.action;
      if (action) {
        const next = G.act(
          state,
          action,
          {},
          action === "publish" ? { argument } : {},
        );
        if (next?.ended && ["breakthrough", "discovery"].includes(next.ending))
          Sound?.playSuccess();
        else if (next?.ended && action === "publish") Sound?.playError();
        commit(next);
        host
          .querySelector(
            "#event-result-title, #event-scene-title, .event-ending h1",
          )
          ?.focus();
        return;
      }

      switch (button.dataset.do) {
        case "exit":
          onExit();
          break;
        case "notes":
          notes = !notes;
          render();
          host.querySelector("#story-bookmark")?.focus();
          break;
        case "toggle-sound":
          if (Sound) {
            const isMuted = Sound.toggleMute();
            const btn = host.querySelector(".event-sound-toggle");
            if (btn) {
              btn.textContent = isMuted ? "🔇" : "🔊";
              btn.setAttribute("aria-label", isMuted ? "开启音效" : "静音");
              btn.setAttribute("aria-pressed", String(isMuted));
            }
          }
          break;
        case "run": {
          const live = getLiveTelemetry(id, state.round, params);
          comparisonMode = !!R.comparison(state, params)?.fair;
          const next = G.act(state, "experiment", params, {
            prediction,
            comparison: comparisonMode,
            followUp: true,
          });
          if (!next) break;

          if (live.isSuccess) {
            if (Sound) Sound.playEureka();
          } else {
            // 错误惩罚：震屏特效与失误蜂鸣音
            modal.classList.add("screen-shake");
            clearTimeout(shakeTimer);
            shakeTimer = setTimeout(
              () => modal.classList.remove("screen-shake"),
              400,
            );
            if (Sound) Sound.playError();
          }

          commit(next);
          host
            .querySelector("#event-result-title")
            ?.focus({ preventScroll: true });
          break;
        }
        case "consult-lab":
          commit(G.act(state, "consult", {}, { followUp: true }));
          break;
        case "emergency-repair":
          commit(G.resupply(state));
          break;
        case "pause":
          paused = !paused;
          sandbox.pause(paused);
          render();
          break;
        case "replay":
          sandbox.replay();
          config.onReplay?.(id, params);
          break;
        case "next":
          comparisonMode = false;
          prediction = null;
          view = "scene";
          if (state.round === 0)
            params = config.nextParams
              ? config.nextParams(state, params)
              : G.cleanParams(id, 1);
          else argument = initialArgument();
          commit(G.next(state));
          host.querySelector("#event-scene-title")?.focus();
          break;
        case "restart":
          researchRunId = window.AtlasResearchSession.token();
          state = G.fresh(id, "assistant", state);
          roleChoice = "assistant";

          comparisonMode = false;
          prediction = null;
          params = G.cleanParams(id, 0);
          argument = { claim: null, scope: null, records: [] };
          view = "scene";
          emit();
          render();
          playIntro();
          break;
        case "revise":
          argument = state.argument
            ? JSON.parse(JSON.stringify(state.argument))
            : { claim: null, scope: null, records: [] };
          view = "scene";

          commit(G.revise(state));
          host.querySelector("#event-scene-title")?.focus();
          break;
        case "intro":
          playIntro();
          break;
        case "next-level":
          onNext(G.scenarios[index + 1]?.id);
          break;
        case "legacy":
          onLegacy();
          break;
        default:
          config.onAction?.(button.dataset.do, {
            host,
            params,
            state,
            render,
            update: changeParams,
          });
      }
    }

    function changeParams(updates) {
      if (!canEditSandbox()) return;
      params = G.cleanParams(id, state.round, { ...params, ...updates });
      const key = Object.keys(updates)[0];
      if (key) updateLiveSandbox(key, params[key]);
    }
    let introInstance = null;
    function playIntro() {
      if (!Intro) return;
      if (introInstance) introInstance.destroy();
      host.inert = true;
      sandbox.pause(true);
      const finish = () => {
        if (destroyed) return;
        introInstance = null;
        host.inert = false;
        sandbox.pause(paused);
        host
          .querySelector("#scenario-run, .event-ending h1, #event-scene-title")
          ?.focus({ preventScroll: true });
      };
      introInstance = Intro.create({
        id,
        host: modal,
        onComplete: finish,
        onSkip: finish,
      });
    }
    const interactions = config.bindInteractions?.({
      host,
      id,
      getState: () => state,
      getParams: () => params,
      canInteract: canEditSandbox,
      update: changeParams,
    });
    host.addEventListener("click", handle);
    host.addEventListener("input", handleInput);
    render();
    playIntro();

    return {
      destroy() {
        destroyed = true;
        host.inert = false;
        interactions?.destroy();
        if (introInstance) introInstance.destroy();
        sandbox.destroy();
        cancelAnimationFrame(inputFrame);
        clearTimeout(shakeTimer);
        modal.classList.remove("screen-shake");
        host.removeEventListener("input", handleInput);
        host.removeEventListener("click", handle);
        modal.classList.remove("event-modal", "pixel-event-modal");
        delete modal.dataset.physicsTheme;
        delete modal.dataset.subjectTheme;
        for (const key of ["--event-gold", "--event-wash", "--event-bg"])
          modal.style.removeProperty(key);
        for (const key of [
          "bg",
          "panel",
          "accent",
          "muted",
          "ink",
          "secondary",
          "line",
          "ground",
        ])
          modal.style.removeProperty("--px-" + key);
      },
    };
  }

  window.AtlasScenarioWorkbench = { create };
  window.AtlasPhysicsLevels = { create };
})();
