/* The Physics Island rules, shared by all subject campaigns. */
(() => {
  function create({
    scenarios,
    roles,
    lab,
    cleanParams,
    test,
    research: Research,
    researchVersion = 1,
    legacyComparison = null,
  }) {
    const byId = Object.fromEntries(scenarios.map((s) => [s.id, s]));
    const clone = (value) => JSON.parse(JSON.stringify(value));
    function fresh(id, role = null, archive = {}) {
      const selected = roles.find((r) => r.id === role);
      return {
        version: 4,
        id,
        role: selected?.id || null,
        round: 0,
        resources: selected
          ? {
              time: selected.time,
              tools: selected.tools,
              trust: selected.trust,
            }
          : { time: 0, tools: 0, trust: 0 },
        evidence: [],
        log: [],
        events: [],
        pending: false,
        ended: false,
        ending: null,
        cleared: archive.cleared === true,
        endings: [
          ...new Set(
            (Array.isArray(archive.endings) ? archive.endings : []).filter(
              (x) =>
                [
                  "breakthrough",
                  "discovery",
                  "provisional",
                  "overreach",
                ].includes(x),
            ),
          ),
        ],
        last: null,
        argument: null,
        supplies: 0,
        bestStars: Math.max(
          0,
          Math.min(3, Math.trunc(Number(archive.bestStars) || 0)),
        ),
      };
    }
    function cost(
      state,
      action,
      params = {},
      meta = {},
      compare = Research.comparison,
    ) {
      if (action === "experiment" && meta.comparison === true) {
        const comparison = compare(
          state,
          cleanParams(state.id, state.round, params),
        );
        if (comparison?.discount) return { time: 1, tools: 0 };
      }
      return {
        time: action === "experiment" ? 2 : action === "consult" ? 1 : 0,
        tools:
          action === "rush"
            ? 2
            : action === "experiment" &&
                !(
                  state.role === "maker" &&
                  !state.log.some((l) => l.action === "experiment")
                )
              ? 1
              : 0,
      };
    }
    function canAct(
      state,
      action,
      params = {},
      meta = {},
      compare = Research.comparison,
    ) {
      const c = cost(state, action, params, meta, compare);
      return (
        !!state.role &&
        !state.ended &&
        state.resources.time >= c.time &&
        state.resources.tools >= c.tools
      );
    }
    function comparisonOffer(state) {
      if (
        !state.role ||
        state.ended ||
        state.round >= 2 ||
        !state.log.some(
          (entry) =>
            entry.round === state.round && entry.action === "experiment",
        )
      )
        return null;
      const used = state.log.some(
        (entry) => entry.round === state.round && entry.comparison?.discount,
      );
      const c = used ? cost(state, "experiment") : { time: 1, tools: 0 };
      return {
        ...c,
        discounted: !used,
        affordable:
          state.resources.time >= c.time && state.resources.tools >= c.tools,
      };
    }
    function resolve(
      state,
      action,
      params,
      rawMeta = {},
      compare = Research.comparison,
    ) {
      if (!byId[state.id]) return false;
      const meta = Research.sanitize(
        rawMeta,
        state.id,
        state.round,
        state.log.length,
      );
      if (!canAct(state, action, params, meta, compare)) return false;
      if (state.round === 2) {
        if (state.pending || !["publish", "reserve", "claim"].includes(action))
          return false;
        // Unannotated version-4 events retain their original ending on replay.
        const verdict = meta.argument
          ? Research.assess(state, meta.argument)
          : null;
        if (meta.argument) state.argument = clone(meta.argument);
        const points =
            verdict?.score ?? state.evidence.reduce((n, e) => n + e.points, 0),
          proof = state.evidence.some((e) => e.kind === "experiment"),
          strong = verdict
            ? verdict.valid
            : points >= 3 && proof && state.resources.trust > 0;
        const ending =
          action === "claim" ||
          (action === "publish" && meta.argument?.scope === "universal")
            ? "overreach"
            : action === "reserve" || !strong
              ? "provisional"
              : points >= 4
                ? "breakthrough"
                : "discovery";
        state.ending = ending;
        state.ended = true;
        if (["breakthrough", "discovery"].includes(ending))
          state.cleared = true;
        state.endings = [...new Set([...state.endings, ending])];
        state.bestStars = Math.max(state.bestStars, rating(state).count);
        state.log.push({
          round: 2,
          action,
          title:
            action === "publish"
              ? byId[state.id].final.publish
              : action === "reserve"
                ? "保留结论，申请继续研究"
                : "宣称问题已经彻底解决",
          text:
            ending === "overreach"
              ? "结论超出了证据能够支持的范围。"
              : action === "reserve"
                ? "你选择暂缓发表，留下已有记录，继续研究未解决的问题。"
                : verdict && !verdict.valid
                  ? verdict.reason
                  : strong
                    ? byId[state.id].final.success
                    : "证据或信任还不足以说服在场的人，问题被保留下来。",
        });
        return true;
      }
      if (!["experiment", "consult", "rush", "skip"].includes(action))
        return false;
      if (
        state.pending &&
        !(
          (action === "experiment" &&
            state.last?.action === "experiment" &&
            !state.last.success) ||
          (meta.followUp &&
            ((action === "experiment" &&
              ["experiment", "consult", "rush"].includes(state.last?.action)) ||
              (action === "consult" &&
                ["experiment", "rush"].includes(state.last?.action) &&
                !state.log.some(
                  (entry) =>
                    entry.round === state.round && entry.action === "consult",
                ))))
        )
      )
        return false;
      const experimentParams =
        action === "experiment"
          ? cleanParams(state.id, state.round, params)
          : null;
      const comparison = experimentParams
        ? compare(state, experimentParams)
        : null;
      if (meta.comparison && (action !== "experiment" || !comparison?.fair))
        return false;
      const c = cost(state, action, params, meta, compare);
      state.resources.time -= c.time;
      state.resources.tools -= c.tools;
      const a =
        action === "skip"
          ? {
              title: "暂不行动，保留资源",
              reply: "你把未能回答的问题留在记录里，没有为它编造解释。",
            }
          : byId[state.id].rounds[state.round].actions.find(
              (a) => a.id === action,
            );
      let result = null,
        points = 0;
      if (action === "experiment") {
        result = test(state.id, state.round, params);
        points = result.success ? 2 : 0;
      }
      if (action === "consult")
        points =
          state.role === "skeptic" &&
          !state.log.some((l) => l.action === "consult")
            ? 2
            : 1;
      const probeReady = state.role === "maker" || state.evidence.length > 0;
      if (action === "rush" && probeReady) points = 1;
      const success =
        action === "rush"
          ? probeReady
          : action !== "skip" && (action !== "experiment" || result.success);
      const oldTrust = state.resources.trust;
      const duplicate =
        action === "experiment" &&
        state.log.some(
          (entry) =>
            entry.round === state.round &&
            entry.action === "experiment" &&
            JSON.stringify(entry.result.params) ===
              JSON.stringify(result.params),
        );
      state.resources.trust = Math.max(
        0,
        Math.min(
          5,
          state.resources.trust +
            (action === "skip" ||
            (action === "rush" && success) ||
            (duplicate && success)
              ? 0
              : success
                ? 1
                : -1),
        ),
      );
      const existing = state.evidence.findIndex((e) => e.round === state.round);
      if (
        points &&
        (existing < 0 ||
          points > state.evidence[existing].points ||
          (points === state.evidence[existing].points &&
            action === "experiment" &&
            state.evidence[existing].kind !== "experiment"))
      ) {
        const evidence = {
          round: state.round,
          kind: action,
          points,
          title: byId[state.id].rounds[state.round].title,
          detail: result?.detail || a.reply,
        };
        if (existing < 0) state.evidence.push(evidence);
        else state.evidence[existing] = evidence;
      }
      const entry = {
        round: state.round,
        action,
        title: a.title,
        text: result
          ? result.detail
          : action === "rush" && !success
            ? "你节省了时间，但试探缺少可比较的基准，消耗的器材没有留下可解释的线索。可以先调查，或用完整实验建立参照。"
            : a.reply,
        success,
        points,
        observation: result
          ? Research.observe(state.id, state.round, result, meta.prediction)
          : null,
        comparison: comparison
          ? {
              ...comparison,
              discount: comparison.discount && meta.comparison === true,
            }
          : null,
        trustDelta: state.resources.trust - oldTrust,
        reply:
          action === "experiment"
            ? success
              ? a.reply
              : "先留下这次失败的记录。我们还有机会换一种方法，但时间和器材不会自动回来。"
            : action === "rush"
              ? success
                ? "这条路线省了时间。把它记为初步线索，还需要完整实验来支持最后的结论。"
                : "没有参照，我没法判断这次试探说明了什么。下一幕先让比较站得住脚。"
              : a.reply,
        result,
        cost: c,
      };
      state.log.push(entry);
      state.last = entry;
      state.pending = true;
      return true;
    }
    function advance(state) {
      if (!state.pending || state.ended || state.round >= 2) return false;
      state.round++;
      state.pending = false;
      state.last = null;
      return true;
    }
    function act(state, action, params = {}, rawMeta = {}) {
      const next = clone(state);
      const meta = Research.sanitize(
        rawMeta,
        next.id,
        next.round,
        next.log.length,
      );
      if (!resolve(next, action, params, meta)) return null;
      next.events.push({
        type: "action",
        action,
        ...(researchVersion > 1 ? { researchVersion } : {}),
        params:
          next.round < 2 && action === "experiment"
            ? cleanParams(next.id, next.round, params)
            : {},
        ...(Object.keys(meta).length ? { research: meta } : {}),
      });
      return next;
    }
    function next(state) {
      const result = clone(state);
      if (!advance(result)) return null;
      result.events.push({ type: "advance" });
      return result;
    }
    function reopenArgument(state) {
      if (!state.ended || state.round !== 2) return false;
      state.ended = false;
      state.ending = null;
      state.argument = null;
      state.last = null;
      state.pending = false;
      return true;
    }
    function revise(state) {
      const result = clone(state);
      if (!reopenArgument(result)) return null;
      result.events.push({ type: "revise" });
      return result;
    }
    // Free previews never enter this ledger. Only committed actions affect a run.
    function rating(state) {
      const cleared =
        state.ended && ["breakthrough", "discovery"].includes(state.ending);
      const trials = state.log.filter((entry) => entry.action === "experiment");
      const failures = state.log.filter(
        (entry) => entry.success === false,
      ).length;
      const complete = [0, 1].every((round) =>
        trials.some((entry) => entry.round === round && entry.success),
      );
      const fair = trials.some((entry) => entry.comparison?.fair);
      const stars = [
        {
          label: "发现成立",
          earned: !!cleared,
          hint: "用证据支持结论，完成关卡",
        },
        {
          label: "亲手验证",
          earned: !!cleared && complete,
          hint: "两幕都留下成功的正式实验",
        },
        {
          label: "对照研究",
          earned:
            !!cleared && complete && fair && failures <= 1 && !state.supplies,
          hint: "完成公平对照，正式失误不超过 1 次，且未使用补给",
        },
      ];
      return {
        stars,
        count: stars.filter((star) => star.earned).length,
        failures,
        fair,
        complete,
      };
    }
    function canResupply(state) {
      if (!state.role || state.ended || state.round >= 2 || state.supplies)
        return false;
      const ordinary = cost(state, "experiment");
      if (
        state.resources.time >= ordinary.time &&
        state.resources.tools >= ordinary.tools
      )
        return false;
      return !comparisonOffer(state)?.affordable;
    }
    function supply(state) {
      if (!canResupply(state)) return false;
      state.resources.time += 4;
      state.resources.tools += 2;
      state.supplies = 1;
      return true;
    }
    function resupply(state) {
      const result = clone(state);
      if (!supply(result)) return null;
      result.events.push({ type: "supply" });
      return result;
    }
    function restore(id, record) {
      if (record?.version !== 4 || record.id !== id || !byId[id])
        return fresh(id);
      const state = fresh(id, record.role, record);
      if (!state.role) return state;
      for (const e of (Array.isArray(record.events) ? record.events : []).slice(
        0,
        512,
      )) {
        if (!e || typeof e !== "object") break;
        const ok =
          e.type === "advance"
            ? advance(state)
            : e.type === "revise"
              ? reopenArgument(state)
              : e.type === "supply"
                ? supply(state)
                : e.type === "action"
                  ? resolve(
                      state,
                      e.action,
                      e.params,
                      e.research,
                      // Old chemistry actions retain their original costs and awards.
                      legacyComparison && e.researchVersion === undefined
                        ? legacyComparison
                        : Research.comparison,
                    )
                  : false;
        if (!ok) break;
        state.events.push(clone(e));
      }
      return state;
    }
    const api = {
      scenarios,
      byId,
      roles,
      lab,
      cleanParams,
      test,
      fresh,
      cost,
      canAct,
      comparisonOffer,
      rating,
      canResupply,
      resupply,
      act,
      next,
      revise,
      restore,
      isCleared: (r) => r?.version === 4 && r.cleared === true,
    };
    return api;
  }
  const api = { create };
  if (typeof window !== "undefined") window.AtlasScenarioEngine = api;
  if (typeof module !== "undefined") module.exports = api;
})();
