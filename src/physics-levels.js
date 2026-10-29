/* Story state machine: encounter -> observe -> transfer -> write -> post. */
(() => {
  const D = window.AtlasPhysicsData,
    M = window.AtlasPhysicsModels,
    A = window.AtlasPhysicsArt,
    S = window.AtlasPhysicsScenes;
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
  function create({ id, host, record, onUpdate, onExit, onNext, onLegacy }) {
    const level = D.byId[id],
      index = D.levels.indexOf(level),
      state = M.sanitize(id, record, level),
      $ = (s) => host.querySelector(s),
      $$ = (s) => [...host.querySelectorAll(s)];
    let mode =
        state.steps.length === 2 ? "letter" : state.started ? "play" : "intro",
      running = false,
      paused = false,
      phase = 0,
      frame = 0,
      prev = 0,
      last = null,
      run = null,
      destroyed = false,
      drag = null,
      pulse = 0,
      sound = false,
      audio = null,
      heard = new Set();
    function emit() {
      onUpdate(M.clone(state));
    }
    host.innerHTML = `<header class="story-header"><button id="story-leave" class="story-back">← 物理岛</button><div class="story-heading"><span>LETTER ${String(index + 1).padStart(2, "0")} / 10 · ${esc(level.act)}</span><h2 id="modal-title">${esc(level.title)}</h2></div><button id="story-sound" aria-pressed="false" title="开启声音">♫ <span>声音关</span></button><button id="story-bookmark" title="展开人物与科学手记" aria-expanded="false">⌑ <span>手记</span></button><button id="story-close" aria-label="离开故事">×</button></header><div class="story-layout"><section class="story-set"><div class="story-location"><span>✧ ${esc(level.place)}</span><small>${esc(level.era)}</small></div><div id="story-canvas" class="story-canvas"></div><div id="story-observations" class="story-observations" aria-live="off"></div><div id="story-controls" class="story-controls"></div><div id="story-overlay" class="story-overlay"></div></section><aside class="story-companion"><div class="companion-intro"><div class="companion-portrait">${A.portrait(id)}</div><div class="companion-name"><small>此刻，与你同行</small><h3>${esc(level.person)}</h3><span>${esc(level.english)}</span><p>${esc(level.concept)}</p></div></div><div class="companion-speech"><span class="speech-quote">“</span><p id="story-dialogue" role="status"></p><small id="story-dialogue-caption">游戏创作对白</small></div><div class="story-request"><span id="story-beat-label"></span><h3 id="story-goal-title"></h3><p id="story-goal"></p></div><div class="story-actions"><button id="story-action" class="story-primary"></button><button id="story-pause" class="story-pause" hidden>暂停观察</button><button id="story-continue" class="story-continue" hidden></button><div class="story-small-actions"><button id="story-hint">请他给一点线索</button><button id="story-reset">重玩这一幕</button></div></div><details id="story-notes" class="story-notes"><summary>人物与科学手记</summary><p class="story-takeaway">${esc(level.takeaway)}</p><code>${esc(level.formula)}</code><h4>这段记忆的来处</h4><p>${esc(level.history)}</p><a href="${level.source[1]}" target="_blank" rel="noopener noreferrer">${esc(level.source[0])} ↗</a><h4>模型与现实</h4><p>${esc(level.boundary)}</p>${id === "P03" ? '<button id="legacy-shoot" class="story-freeplay">另试一次自由投篮 ↗</button>' : ""}</details><p class="story-fiction-note">人物与科学问题有历史依据；信使、岛屿与剧情为游戏创作。</p></aside></div><footer class="story-footer"><span class="satchel-icon">✉</span><span class="story-footer-label">信使的行囊</span><div class="story-postmarks">${D.levels.map((l, i) => `<span class="${l.id === id ? "current" : ""}">${String(i + 1).padStart(2, "0")}</span>`).join("")}</div><span id="story-footer-state"></span></footer>`;
    host.style.setProperty("--story-accent", level.color);
    function say(message, caption = "游戏创作对白") {
      $("#story-dialogue").textContent = message;
      $("#story-dialogue-caption").textContent = caption;
    }
    function options(key, label, values) {
      return `<div class="story-control-group"><span>${label}</span><div class="story-choice-row">${values.map(([v, text]) => `<button data-story-set="${key}" data-value="${v}" aria-pressed="${state.params[key] === v}" class="${state.params[key] === v ? "chosen" : ""}">${text}</button>`).join("")}</div></div>`;
    }
    function slider(key, label, min, max, step, value, extra = "") {
      return `<label class="story-slider"><span>${label}<output id="out-${key}">${value}${extra}</output></span><input id="story-${key}" data-story-range="${key}" aria-label="${label}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
    }
    function toggle(key, label) {
      return `<button class="story-toggle ${state.params[key] ? "chosen" : ""}" data-story-toggle="${key}" aria-pressed="${state.params[key]}"><span>${state.params[key] ? "✓" : "＋"}</span>${label}</button>`;
    }
    function controls() {
      const p = state.params;
      let html = "";
      switch (id) {
        case "P01":
          html =
            options("shape", "捏一捏，同一块材料", [
              ["lump", "实心团"],
              ["bowl", "中空小船"],
              ["wide", "宽口货船"],
            ]) +
            `<div class="cargo-counter"><span>器材 ${p.cargo}/4 箱</span><button data-story-action="unload" aria-label="卸下一箱">−</button><button data-story-action="load" aria-label="装上一箱">＋ 装船</button></div>`;
          break;
        case "P02":
          html =
            options("slope", "轨道", [
              ["gentle", "缓坡"],
              ["steep", "陡坡"],
            ]) +
            `<details class="bell-adjust"><summary>⌖ 拖动场景小钟，也可在这里微调</summary>${p.bells.map((v, i) => slider("bell-" + i, "第" + (i + 1) + "只钟", 0.5, 10, 0.25, v)).join("")}</details>`;
          break;
        case "P03":
          html =
            slider(
              "speed",
              "投递的水平初速度",
              0.4,
              1.65,
              0.01,
              p.speed.toFixed(2),
            ) +
            `<span class="control-footnote">刻度 1.00 是发射高度处的圆轨道速度</span>`;
          break;
        case "P04":
          html =
            toggle("connected", "连接绳轮与搅拌桨") +
            toggle("insulated", "包上隔热层");
          break;
        case "P05":
          html =
            options("slits", "通光的狭缝", [
              ["one", "一道缝"],
              ["two", "两道缝"],
            ]) +
            options("color", "同一光源的颜色", [
              ["warm", "暖色 · 600 nm"],
              ["blue", "蓝光 · 450 nm"],
            ]) +
            slider("gap", "移动缝距", 0.5, 3, 0.05, p.gap.toFixed(2));
          break;
        case "P06":
          html =
            state.step === 0
              ? `<span class="story-gesture">↔ 拖动磁铁，或按右侧按钮，留意指针的方向</span>`
              : toggle("crank", "接上摇柄");
          break;
        case "P07":
          html =
            slider("frequency", "发射频段", 1, 5, 1, p.frequency) +
            (state.step
              ? options("code", "要寄出的电报码", [
                  ["S", "S　· · ·"],
                  ["R", "R　· — ·"],
                  ["O", "O　— — —"],
                ])
              : '<span class="control-footnote">麦克斯韦的理论 · 赫兹的实验接力</span>');
          break;
        case "P08":
          html = options("sample", "从样本柜取出", [
            ["background", "空白背景"],
            ["uranium", "铀参考"],
            ["ore", "矿石"],
            ["fraction", "强信号组分"],
          ]);
          break;
        case "P09":
          html =
            options("model", "能量怎样交换", [
              ["continuous", "连续交换"],
              ["quanta", "按频率分份"],
            ]) +
            options("temperature", "炉光记录", [
              ["warm", "较低温"],
              ["hot", "高温"],
            ]) +
            options("packet", "选一份能量，再点场景中的振子", [
              [1, "1份"],
              [2, "2份"],
              [3, "3份"],
            ]);
          break;
        case "P10":
          html =
            options("color", "照射这块金属的光", [
              ["red", "红光"],
              ["blue", "蓝光"],
              ["uv", "紫外光"],
            ]) + slider("intensity", "光的强弱", 1, 5, 1, p.intensity);
          break;
      }
      $("#story-controls").innerHTML = html;
      sync();
    }
    function sync() {
      const beat = level.steps[state.step],
        done = state.steps.includes(state.step);
      $("#story-beat-label").textContent = state.step
        ? "追问 · 把发现带到新情况"
        : "初见 · 留心反常的现象";
      $("#story-goal-title").textContent = beat.title;
      $("#story-goal").textContent = beat.goal;
      $("#story-action").textContent = running
        ? "正在观察…"
        : id === "P06" && !state.step
          ? state.params.magnetX >= 50
            ? "把磁铁拉出来"
            : "把磁铁推进去"
          : beat.action;
      $("#story-action").disabled = running || mode !== "play";
      $("#story-pause").hidden = !running;
      $("#story-pause").textContent = paused ? "继续观察" : "暂停观察";
      $("#story-continue").hidden = !done || mode !== "play";
      $("#story-continue").textContent = state.step
        ? "展开这封未寄出的信 →"
        : "他还有一个问题 →";
      $("#story-footer-state").textContent = state.letterSent
        ? "✓ 这封信已经寄出"
        : state.steps.length === 2
          ? "✉ 信已写好，等待寄出"
          : `留下 ${state.steps.length}/2 段发现`;
      $("#story-reset").disabled = running;
      $$("#story-controls button,#story-controls input").forEach(
        (b) => (b.disabled = running || mode !== "play"),
      );
      $("#story-hint").textContent =
        id === "P08" ? "请她给一点线索" : "请他给一点线索";
    }
    function paint() {
      if (destroyed) return;
      const p = run?.params || state.params,
        v = S.render(id, p, {
          phase,
          running,
          step: state.step,
          clues: state.clues,
          pulse,
          result: run?.result,
          last,
          from: run?.from,
          completed: state.steps.includes(1),
        });
      $("#story-canvas").innerHTML = v.svg;
      $("#story-observations").innerHTML = v.readout
        .map(
          ([a, b]) =>
            `<div><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`,
        )
        .join("");
    }
    function overlay() {
      const el = $("#story-overlay");
      el.hidden = mode === "play";
      if (mode === "intro") {
        el.innerHTML = `<article class="encounter-card"><span class="encounter-eyebrow">一封未寄出的信 · ${String(index + 1).padStart(2, "0")}</span><div class="encounter-envelope">✉</div><h3>在${esc(level.place)}，遇见${esc(level.person)}</h3><p>${esc(level.opening)}</p><button id="story-begin" class="story-primary">走近${esc(level.person)} →</button><small>建议戴上耳机 · 随时离开，发现会保留</small></article>`;
        $("#story-begin").onclick = () => {
          state.started = true;
          mode = "play";
          say(level.greeting);
          emit();
          overlay();
          controls();
          paint();
        };
      } else if (mode === "letter") {
        el.innerHTML = `<article class="letter-card"><div class="letter-topline"><span>TO THE FUTURE</span><span>LETTER ${String(index + 1).padStart(2, "0")}</span></div><div class="letter-stamp">${A.portrait(id)}</div><span class="letter-eyebrow">${esc(level.place)}寄来的信</span><h3>写给后来的人</h3><p class="letter-words">${esc(level.letter)}</p><div class="letter-discovery"><span>我们一起留下的发现</span><p>${esc(level.takeaway)}</p></div><p class="letter-next-question">${esc(level.nextQuestion)}</p><div class="letter-signature">${esc(level.person)} <small>游戏创作信件</small></div><button id="story-post" class="story-primary">${state.letterSent ? "✓ 已寄出 · " + (index === 9 ? "查看十封信" : "前往下一段记忆") + " →" : "封好信，寄给未来 →"}</button><button id="story-revisit" class="letter-revisit">回到现场，再试一次</button></article>`;
        $("#story-post").onclick = () => {
          if (!state.steps.includes(0) || !state.steps.includes(1)) return;
          if (!state.letterSent) {
            state.letterSent = true;
            emit();
            sync();
            overlay();
            tone(660);
            return;
          }
          onNext(index === 9 ? null : D.levels[index + 1].id);
        };
        $("#story-revisit").onclick = () => {
          mode = "play";
          overlay();
          controls();
          paint();
        };
      }
      sync();
    }
    function tone(freq = 600) {
      if (!sound || !audio) return;
      try {
        const o = audio.createOscillator(),
          g = audio.createGain();
        o.type = "sine";
        o.frequency.value = freq;
        o.connect(g);
        g.connect(audio.destination);
        g.gain.setValueAtTime(0.0001, audio.currentTime);
        g.gain.exponentialRampToValueAtTime(0.075, audio.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.5);
        o.start();
        o.stop(audio.currentTime + 0.55);
      } catch {}
    }
    function setParam(key, value) {
      if (running || mode !== "play") return;
      const p = M.clone(state.params);
      if (key.startsWith("bell-"))
        p.bells[Number(key.slice(5))] = Number(value);
      else p[key] = typeof p[key] === "number" ? Number(value) : value;
      state.params = M.sanitize(id, { ...state, params: p }, level).params;
      phase = 0;
      last = null;
      run = null;
      emit();
      paint();
      if (key.startsWith("bell-") || typeof value === "number") {
        $("#out-" + key)?.replaceChildren(
          document.createTextNode(
            key === "speed" || key === "gap"
              ? Number(value).toFixed(2)
              : String(value),
          ),
        );
      }
      sync();
    }
    function stop() {
      cancelAnimationFrame(frame);
      running = false;
      paused = false;
      prev = 0;
    }
    function finish() {
      if (destroyed || !run) return;
      running = false;
      const trial = run.params;
      if (id === "P08") state.params.readings = M.clone(trial.readings);
      const answer = M.outcome(id, state.step, trial, state.clues);
      if (id === "P04") {
        state.params.heat = answer.result.heat;
        state.params.drops = answer.result.drops;
      }
      last = { ok: answer.ok };
      run = null;
      phase = 1;
      pulse = 0;
      if (answer.ok) {
        if (!state.steps.includes(state.step)) state.steps.push(state.step);
        say(level.steps[state.step].success, "一起留下的新发现");
        tone(740);
      } else say(answer.message, "来自这次操作的线索");
      if (id === "P08" && !answer.ok) {
        const value = state.params.readings[state.params.sample].at(-1);
        say(`这次读到 ${value}。${answer.message}`, "测量记录 · 教学示意");
      }
      emit();
      paint();
      controls();
    }
    function tick(ts) {
      if (destroyed || !running || paused) return;
      if (prev)
        phase = Math.min(
          1,
          phase + Math.min(0.1, (ts - prev) / 1000) / run.duration,
        );
      prev = ts;
      if (id === "P02") {
        const t =
          phase * Math.sqrt(10 / (run.params.slope === "steep" ? 2 : 1));
        run.result.times.forEach((v, i) => {
          if (t >= v && !heard.has(i)) {
            heard.add(i);
            tone(620 + i * 120);
          }
        });
      }
      paint();
      if (phase >= 1) finish();
      else frame = requestAnimationFrame(tick);
    }
    function act() {
      if (running || mode !== "play") return;
      stop();
      const p = M.clone(state.params),
        from = p.magnetX;
      if (id === "P06" && !state.step) {
        const inward = p.magnetX < 50;
        p.magnetX = inward ? 90 : 15;
        state.params.magnetX = p.magnetX;
        pulse = inward ? 1 : -1;
        if (!state.clues.includes(inward ? "in" : "out"))
          state.clues.push(inward ? "in" : "out");
      }
      if (id === "P08") {
        const base = { background: 10, uranium: 100, ore: 180, fraction: 300 }[
            p.sample
          ],
          n = p.readings[p.sample].length;
        p.readings[p.sample].push(base + [-2, 2, 0][n % 3]);
        p.readings[p.sample] = p.readings[p.sample].slice(-20);
      }
      if (
        id === "P09" &&
        p.model === "continuous" &&
        !state.clues.includes("mismatch")
      )
        state.clues.push("mismatch");
      if (
        id === "P10" &&
        !state.step &&
        p.color === "red" &&
        p.intensity >= 4 &&
        !state.clues.includes("red-blocked")
      )
        state.clues.push("red-blocked");
      run = {
        params: p,
        from,
        result: M.evaluate(id, p, state.step),
        duration:
          id === "P02" ? 3.2 : id === "P03" ? 3 : id === "P04" ? 1.8 : 1.3,
      };
      running = true;
      phase = 0;
      last = null;
      heard.clear();
      prev = 0;
      sync();
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        phase = 1;
        paint();
        finish();
      } else frame = requestAnimationFrame(tick);
    }
    function sceneAction(action) {
      if (running || mode !== "play") return;
      if (action === "load" || action === "unload") {
        setParam(
          "cargo",
          Math.max(
            0,
            Math.min(4, state.params.cargo + (action === "load" ? 1 : -1)),
          ),
        );
        controls();
      } else if (action.startsWith("cargo:")) {
        const n = Number(action.split(":")[1]);
        setParam("cargo", state.params.cargo === n ? n - 1 : n);
        controls();
      } else if (action.startsWith("feed:")) {
        const n = Number(action.split(":")[1]);
        if (state.params.packet !== n) {
          say(
            "这份能量没有匹配这个振子的交换刻度。换一份，再试试。",
            "能量包是交换规则的类比",
          );
          return;
        }
        if (!state.params.fed.includes(n)) state.params.fed.push(n);
        say(
          `这一份接上了${n === 1 ? "低" : n === 2 ? "中" : "高"}频振子。频率越高，每份交换能量也越大。`,
        );
        emit();
        paint();
      } else if (action === "magnet") act();
    }
    $("#story-controls").addEventListener("click", (e) => {
      const set = e.target.closest("[data-story-set]"),
        toggle = e.target.closest("[data-story-toggle]"),
        action = e.target.closest("[data-story-action]");
      if (set) {
        setParam(set.dataset.storySet, set.dataset.value);
        controls();
      }
      if (toggle) {
        setParam(
          toggle.dataset.storyToggle,
          !state.params[toggle.dataset.storyToggle],
        );
        controls();
      }
      if (action) sceneAction(action.dataset.storyAction);
    });
    $("#story-controls").addEventListener("input", (e) => {
      const range = e.target.closest("[data-story-range]");
      if (range) setParam(range.dataset.storyRange, Number(range.value));
    });
    $("#story-canvas").addEventListener("click", (e) => {
      if (drag?.moved) return;
      const b = e.target.closest("[data-story-action]");
      if (b && !b.dataset.drag) sceneAction(b.dataset.storyAction);
    });
    $("#story-canvas").addEventListener("keydown", (e) => {
      const b = e.target.closest("[data-story-action]");
      if (!b) return;
      if (["Enter", " "].includes(e.key)) {
        e.preventDefault();
        sceneAction(b.dataset.storyAction);
        $("#story-canvas")
          .querySelector(`[data-story-action="${b.dataset.storyAction}"]`)
          ?.focus();
      }
      if (
        id === "P02" &&
        b.dataset.drag &&
        ["ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
        const i = Number(b.dataset.drag.split(":")[1]);
        setParam(
          "bell-" + i,
          Math.max(
            0.5,
            Math.min(
              10,
              state.params.bells[i] + (e.key === "ArrowRight" ? 0.25 : -0.25),
            ),
          ),
        );
        controls();
        $(`[data-story-action="bell:${i}"]`)?.focus();
      }
    });
    const point = (e) => {
      const svg = $("#story-canvas svg");
      return svg
        ? new DOMPoint(e.clientX, e.clientY).matrixTransform(
            svg.getScreenCTM().inverse(),
          )
        : { x: 0, y: 0 };
    };
    const canvas = $("#story-canvas");
    canvas.addEventListener("pointerdown", (e) => {
      if (running || mode !== "play") return;
      const b = e.target.closest("[data-drag]");
      if (!b) return;
      e.preventDefault();
      drag = {
        kind: b.dataset.drag,
        start: point(e).x,
        last: point(e).x,
        moved: false,
        from: state.params.magnetX,
      };
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const x = point(e).x;
      drag.moved ||= Math.abs(x - drag.start) > 3;
      if (drag.kind === "magnet") {
        const v = Math.max(0, Math.min(100, (x - 150) / 3.2)),
          direction = v - state.params.magnetX;
        if (Math.abs(direction) > 2) {
          const key = direction > 0 ? "in" : "out";
          if (!state.clues.includes(key)) state.clues.push(key);
          pulse = direction > 0 ? 1 : -1;
        }
        state.params.magnetX = v;
        phase = 0;
        paint();
      } else {
        const i = Number(drag.kind.split(":")[1]);
        state.params.bells[i] =
          Math.round(Math.max(0.5, Math.min(10, (x - 170) / 58)) * 4) / 4;
        paint();
      }
      drag.last = x;
    });
    function release(e) {
      if (!drag) return;
      const moved = drag.moved,
        kind = drag.kind;
      drag = null;
      if (canvas.hasPointerCapture(e.pointerId))
        canvas.releasePointerCapture(e.pointerId);
      pulse = 0;
      emit();
      paint();
      controls();
      if (kind === "magnet" && moved) {
        const a = M.outcome(id, 0, state.params, state.clues);
        if (a.ok) {
          if (!state.steps.includes(0)) state.steps.push(0);
          say(level.steps[0].success, "一起留下的新发现");
          emit();
          sync();
        } else say(a.message, "来自磁铁移动的线索");
      }
    }
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);
    $("#story-action").onclick = act;
    $("#story-pause").onclick = () => {
      paused = !paused;
      prev = 0;
      sync();
      cancelAnimationFrame(frame);
      if (!paused) frame = requestAnimationFrame(tick);
    };
    $("#story-continue").onclick = () => {
      if (!state.steps.includes(state.step)) return;
      stop();
      run = null;
      phase = 0;
      last = null;
      if (state.step === 0) {
        state.step = 1;
        say(level.nextQuestion);
        emit();
        controls();
        paint();
      } else {
        mode = "letter";
        say("把今天的发现，留给下一位提问的人。");
        overlay();
      }
    };
    $("#story-reset").onclick = () => {
      stop();
      run = null;
      phase = 0;
      last = null;
      state.params = M.clone(level.defaults);
      state.step = 0;
      mode = "play";
      say(level.greeting);
      emit();
      overlay();
      controls();
      paint();
    };
    $("#story-hint").onclick = () =>
      say(level.steps[state.step].hint, "给你的一点线索");
    $("#story-bookmark").onclick = () => {
      const notes = $("#story-notes");
      notes.open = !notes.open;
      $("#story-bookmark").setAttribute("aria-expanded", notes.open);
      if (notes.open)
        notes.scrollIntoView({ block: "nearest", behavior: "smooth" });
    };
    $("#story-sound").onclick = () => {
      sound = !sound;
      if (sound && !audio) {
        try {
          audio = new (window.AudioContext || window.webkitAudioContext)();
        } catch {
          sound = false;
        }
      }
      if (sound) {
        audio?.resume();
        tone(600);
      }
      $("#story-sound").setAttribute("aria-pressed", sound);
      $("#story-sound").title = sound ? "关闭声音" : "开启声音";
      $("#story-sound span").textContent = sound ? "声音开" : "声音关";
    };
    $("#story-close").onclick = onExit;
    $("#story-leave").onclick = onExit;
    $("#legacy-shoot")?.addEventListener("click", onLegacy);
    const visibility = () => {
      if (document.hidden && running && !paused) {
        paused = true;
        prev = 0;
        cancelAnimationFrame(frame);
        sync();
      }
    };
    document.addEventListener("visibilitychange", visibility);
    say(
      state.steps.includes(state.step)
        ? level.steps[state.step].success
        : level.greeting,
    );
    controls();
    paint();
    overlay();
    return {
      id,
      destroy() {
        destroyed = true;
        stop();
        audio?.close();
        document.removeEventListener("visibilitychange", visibility);
      },
    };
  }
  window.AtlasPhysicsLevels = { create };
})();
