/* One source of truth for live instruments, assessment and saved evidence. */
(() => {
  const D =
    typeof module !== "undefined" && module.exports
      ? require("./chemistry-data.js")
      : window.AtlasChemistryData;
  const clone = (value) => JSON.parse(JSON.stringify(value));
  function task(id, round = 0) {
    return D.byId[id]?.tasks[round === 1 ? 1 : 0];
  }
  function params(id, round, input = {}) {
    if (!input || typeof input !== "object" || Array.isArray(input)) input = {};
    return Object.fromEntries(
      task(id, round).controls.map((c) => {
        if (c.type === "choice")
          return [
            c.key,
            c.options.some(([v]) => v === input[c.key])
              ? input[c.key]
              : c.value,
          ];
        const value =
          typeof input[c.key] === "number" && Number.isFinite(input[c.key])
            ? input[c.key]
            : c.value;
        const bounded = Math.max(c.min, Math.min(c.max, value));
        return [
          c.key,
          Number(
            (c.min + Math.round((bounded - c.min) / c.step) * c.step).toFixed(
              6,
            ),
          ),
        ];
      }),
    );
  }
  function evaluate(id, round = 0, input = {}) {
    const p = params(id, round, input),
      t = task(id, round);
    let success = false,
      readings = [],
      model = {};
    switch (id) {
      case "C01": {
        const first = round === 0,
          measured = first ? p.instrument !== "eye" : p.instrument === "magnet";
        success = measured && p.identity === (first ? "salt" : "iron");
        model = {
          first,
          measured,
          attracted: p.instrument === "magnet",
          conductivity: first ? 15 : 95,
        };
        readings = first
          ? [
              ["外观", "白色晶体"],
              [
                "本次测量",
                p.instrument === "eye"
                  ? "颜色不足以区分"
                  : p.instrument === "density"
                    ? "2.16 g/cm³"
                    : "电导 15（相对）",
              ],
              [
                "参考对照",
                p.instrument === "density"
                  ? "糖 1.59 / 盐 2.16"
                  : p.instrument === "conductivity"
                    ? "糖 0.2 / 盐 15"
                    : "两者外观近似",
              ],
            ]
          : [
              ["样品 B", "银灰金属"],
              [
                "本次观察",
                p.instrument === "magnet"
                  ? "明显被吸引"
                  : p.instrument === "conductivity"
                    ? "可导电"
                    : "轮廓不能定性",
              ],
              ["参考对照", "铁有明显磁性；铜无"],
            ];
        break;
      }
      case "C02": {
        const massC = 12 * p.carbon,
          massO = 16 * p.oxygen,
          ratio = massO / massC;
        success = p.oxygen === p.carbon * (round ? 2 : 1);
        model = { massC, massO, ratio };
        readings = [
          ["碳的相对质量", massC],
          ["氧的相对质量", massO],
          ["氧 / 碳", ratio.toFixed(3)],
        ];
        break;
      }
      case "C03": {
        const total = (p.shells === 2 ? 2 : p.shells === 3 ? 10 : 18) + p.outer,
          target = round ? 17 : 11;
        success = p.shells === 3 && p.outer === (round ? 7 : 1);
        model = {
          total,
          target,
          group: p.outer === 8 ? 18 : p.outer <= 2 ? p.outer : p.outer + 10,
        };
        readings = [
          ["占用电子层", p.shells],
          ["最外层电子", p.outer],
          ["本模型总电子", `${total} / 目标 ${target}`],
        ];
        break;
      }
      case "C04": {
        const total = 2 * (p.pairs + p.lone),
          perAtom = 2 * p.pairs + p.lone;
        success = p.pairs === (round ? 2 : 1) && p.lone === (round ? 4 : 0);
        model = { total, perAtom, symmetric: p.lone % 2 === 0 };
        readings = [
          ["总价电子", `${total} / 应有 ${round ? 12 : 2}`],
          ["每个原子周围", p.lone % 2 ? "孤对无法均分" : `${perAtom} 个电子`],
          ["共享 / 孤对", `${p.pairs} / ${p.lone} 对`],
        ];
        break;
      }
      case "C05": {
        success = p.first === (round ? 1 : 2) && p.second === (round ? 3 : 1);
        model = {
          first: round ? "N" : "H",
          second: round ? "H" : "O",
          totalFirst: p.first * p.units,
          totalSecond: p.second * p.units,
        };
        readings = [
          [
            "当前每份",
            `${model.first}${p.first > 1 ? p.first : ""}${model.second}${p.second > 1 ? p.second : ""}`,
          ],
          ["分子份数", p.units],
          [
            "总原子数",
            `${model.first}: ${model.totalFirst} · ${model.second}: ${model.totalSecond}`,
          ],
        ];
        break;
      }
      case "C06": {
        const target = round ? 104.5 : 109.5,
          error = Math.abs(p.angle - target);
        success = p.shape === (round ? "bent" : "tetra") && error <= 0.5;
        model = { target, error };
        readings = [
          [
            "选定构型",
            {
              flat: "平面十字",
              tetra: "四面体支架",
              bent: "折线形",
              linear: "直线形",
            }[p.shape],
          ],
          ["参考键角", `${p.angle}°`],
          ["目标近似角", `${target}°`],
        ];
        break;
      }
      case "C07": {
        const net = 2 * p.pull * Math.cos((p.angle * Math.PI) / 360);
        success =
          p.pull >= 0.5 &&
          (round ? Math.abs(p.angle - 104.5) <= 0.5 : p.angle === 180);
        model = { net };
        readings = [
          ["两键夹角", `${p.angle}°`],
          ["单键偶极", p.pull.toFixed(1)],
          ["合偶极 · 示意", Math.abs(net) < 1e-8 ? "0 · 抵消" : net.toFixed(3)],
        ];
        break;
      }
      case "C08": {
        if (!round) {
          const escaped = p.closed === "open" ? p.gas : 0,
            retained = 100 - escaped;
          model = { escaped, retained, gas: p.gas };
          success = p.closed === "closed" && p.gas >= 2;
          readings = [
            ["起始总质量", "100 g"],
            ["天平内质量", `${retained} g`],
            ["越过边界的质量", `${escaped} g`],
          ];
        } else {
          const leftH = 2 * p.hydrogen,
            leftO = 2 * p.oxygen,
            rightH = 2 * p.water,
            rightO = p.water;
          model = {
            leftH,
            leftO,
            rightH,
            rightO,
            diffH: leftH - rightH,
            diffO: leftO - rightO,
          };
          success = leftH === rightH && leftO === rightO;
          readings = [
            ["H 原子 · 左/右", `${leftH} / ${rightH}`],
            ["O 原子 · 左/右", `${leftO} / ${rightO}`],
            ["差额 H / O", `${model.diffH} / ${model.diffO}`],
          ];
        }
        break;
      }
      case "C09": {
        if (!round) {
          success = p.donor === "Zn" && p.electrons === 2;
          model = {
            direction: p.donor === "Zn" ? 1 : -1,
            electrons: p.electrons,
          };
          readings = [
            ["失电子方", p.donor],
            ["转移数", `${p.electrons} e⁻`],
            ["每次应配平", "2 e⁻ / Zn 与 Cu²⁺"],
          ];
        } else {
          const mass = ((63.546 * p.charge) / (p.valence * 96485)) * 1000;
          success = p.valence === 2 && p.charge >= 386;
          model = { mass };
          readings = [
            ["通过电量", `${p.charge} C`],
            ["沉积铜 · 理想", `${mass.toFixed(1)} mg`],
            ["电荷模型", p.valence === 2 ? "与 Cu²⁺ 一致" : "与 Cu²⁺ 不一致"],
          ];
        }
        break;
      }
      case "C10": {
        const connected = p.wire === "on" && p.bridge === "on",
          current = connected ? 1100 / ((p.load || 50) + 10) : 0;
        model = { connected, current };
        success =
          connected && (!round || (p.direction === "ZnCu" && current >= 20));
        readings = [
          ["示意电动势", "1.10 V"],
          ["外路电流", `${current.toFixed(1)} mA`],
          [
            "回路状态",
            connected
              ? "电子外路 + 离子内路"
              : p.wire !== "on"
                ? "导线断开"
                : "离子通路缺失",
          ],
        ];
        break;
      }
    }
    return {
      params: p,
      success,
      readings,
      model,
      detail: success ? t.success : t.failure,
    };
  }
  function empty(id) {
    return {
      version: 1,
      id,
      round: 0,
      phase: "lab",
      reagents: 6,
      trust: 3,
      failures: 0,
      records: [],
      comparisons: [],
      events: [],
      supplied: false,
      cleared: false,
      bestStars: 0,
      stars: 0,
      archive: [],
    };
  }
  const signature = (p) => JSON.stringify(p);
  function offer(state, input) {
    if (state.phase !== "lab")
      return {
        allowed: false,
        cost: 1,
        comparison: false,
        reason: "先返回实验台。",
      };
    const p = params(state.id, state.round, input),
      previous = state.records.filter((r) => r.round === state.round),
      last = previous.at(-1);
    if (previous.some((r) => signature(r.params) === signature(p)))
      return {
        allowed: false,
        cost: 1,
        comparison: false,
        reason: "这组参数已记录，改变一个条件再比较。",
      };
    const changed = last
      ? Object.keys(p).filter((k) => p[k] !== last.params[k])
      : [];
    const comparison =
      changed.length === 1 && !state.comparisons.includes(state.round);
    const cost = comparison ? 0 : 1;
    return {
      allowed: state.reagents >= cost,
      cost,
      comparison,
      changed,
      reason: comparison
        ? "单变量对照 · 本轮首次免费"
        : state.reagents < cost
          ? "试剂不足，可免费观察或领取补给。"
          : "正式记录 · 消耗 1 份试剂",
    };
  }
  function apply(state, event) {
    if (!event || state.events.length >= 128) return false;
    const id = state.id;
    if (event.type === "record") {
      if (event.round !== state.round) return false;
      const o = offer(state, event.params);
      if (!o.allowed) return false;
      const result = evaluate(id, state.round, event.params);
      state.reagents -= o.cost;
      state.trust = Math.max(
        0,
        Math.min(5, state.trust + (result.success ? 1 : -1)),
      );
      if (!result.success) state.failures++;
      if (o.comparison) state.comparisons.push(state.round);
      state.records.push({
        round: state.round,
        ...result,
        comparison: o.comparison,
      });
      event = { type: "record", round: state.round, params: result.params };
    } else if (event.type === "advance") {
      if (
        state.phase !== "lab" ||
        !state.records.some((r) => r.round === state.round && r.success)
      )
        return false;
      if (state.round === 0) state.round = 1;
      else state.phase = "conclusion";
    } else if (event.type === "supply") {
      if (state.supplied || state.reagents > 0 || state.phase !== "lab")
        return false;
      state.supplied = true;
      state.reagents += 4;
    } else if (event.type === "conclude") {
      if (state.phase !== "conclusion" || !Array.isArray(event.evidence))
        return false;
      const evidence = [...new Set(event.evidence)].filter(
        (i) => Number.isInteger(i) && i >= 0 && i < state.records.length,
      );
      const supported = [0, 1].every((round) =>
        evidence.some(
          (i) => state.records[i].round === round && state.records[i].success,
        ),
      );
      const correct =
        event.claim === "supported" && event.scope === "tested" && supported;
      if (!correct) {
        state.trust = Math.max(0, state.trust - 1);
        state.failures++;
        state.feedback =
          "结论还缺证据或边界。每轮选一条成功记录，并选择本模型内的解释。";
      } else {
        state.phase = "complete";
        state.cleared = true;
        state.feedback = "两份证据已归档，地图恢复了一片色彩。";
        state.stars =
          1 +
          (state.failures <= 1 && !state.supplied ? 1 : 0) +
          (state.failures <= 1 && !state.supplied && state.comparisons.length
            ? 1
            : 0);
        state.bestStars = Math.max(state.bestStars, state.stars);
      }
      event = {
        type: "conclude",
        claim: event.claim === "supported" ? "supported" : "unsupported",
        scope: event.scope === "tested" ? "tested" : "universal",
        evidence,
      };
    } else return false;
    state.events.push(clone(event));
    return true;
  }
  function replay(id, events) {
    const s = empty(id);
    if (Array.isArray(events))
      for (const event of events.slice(0, 128)) apply(s, event);
    return s;
  }
  function restore(id, raw) {
    if (!D.byId[id]) throw new Error("Unknown chemistry level: " + id);
    if (!raw || raw.version !== 1 || raw.id !== id) return empty(id);
    const s = replay(id, raw.events),
      past = replay(id, raw.archive);
    if (past.cleared) {
      s.archive = clone(past.events);
      s.bestStars = Math.max(s.bestStars, past.stars);
    }
    return s;
  }
  function fresh(id, previous) {
    const old = restore(id, previous),
      s = empty(id);
    if (old.cleared && old.stars >= old.bestStars) {
      s.archive = clone(old.events);
      s.bestStars = old.stars;
    } else {
      s.archive = clone(old.archive);
      s.bestStars = old.bestStars;
    }
    return s;
  }
  function act(record, event) {
    const s = restore(record.id, record);
    apply(s, event);
    return s;
  }
  function isCleared(record) {
    if (!record || !D.byId[record.id]) return false;
    const s = restore(record.id, record);
    return s.cleared || s.bestStars > 0;
  }
  const api = { task, params, evaluate, offer, restore, fresh, act, isCleared };
  if (typeof module !== "undefined") module.exports = api;
  if (typeof window !== "undefined") window.AtlasChemistryGame = api;
})();
