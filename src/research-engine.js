/* Shared evidence, prediction and argument rules from Physics Island. */
(() => {
  function create({ cases, forecast, observe, experimentKeys }) {
    function comparison(state, params) {
      const baseIndex = state.log.findLastIndex(
        (entry) => entry.round === state.round && entry.action === "experiment",
      );
      if (baseIndex < 0) return null;
      const base = state.log[baseIndex];
      const keys = experimentKeys
        ? experimentKeys(state.id, state.round)
        : Object.keys(base.result.params);
      const changes = keys.filter(
        (key) => base.result.params[key] !== params[key],
      );
      const used = state.log.some(
        (entry) => entry.round === state.round && entry.comparison?.discount,
      );
      return {
        baseIndex,
        changes,
        fair: changes.length === 1,
        discount: !used && changes.length === 1,
      };
    }
    function sanitize(meta, id, round, logLength) {
      if (!meta || typeof meta !== "object") return {};
      const clean = {};
      if (
        round < 2 &&
        forecast(id, round).options.some(
          (option) => option.id === meta.prediction,
        )
      )
        clean.prediction = meta.prediction;
      if (meta.followUp === true) clean.followUp = true;
      if (meta.comparison === true) clean.comparison = true;
      if (round === 2 && meta.argument && typeof meta.argument === "object") {
        const a = meta.argument;
        clean.argument = {
          claim: ["supported", "alternative-1", "alternative-2"].includes(
            a.claim,
          )
            ? a.claim
            : null,
          scope: ["tested", "universal"].includes(a.scope) ? a.scope : null,
          records: [
            ...new Set(
              Array.isArray(a.records)
                ? a.records.filter(
                    (n) => Number.isInteger(n) && n >= 0 && n < logLength,
                  )
                : [],
            ),
          ].slice(0, 3),
        };
      }
      return clean;
    }
    function assess(state, argument) {
      const selected = argument.records
        .map((index) => state.log[index])
        .filter((entry) => entry && entry.round < 2);
      const best = [0, 1].map((round) =>
        Math.max(
          0,
          ...selected
            .filter((entry) => entry.round === round)
            .map((entry) => entry.points || 0),
        ),
      );
      const score = best[0] + best[1],
        proof = selected.some(
          (entry) => entry.action === "experiment" && entry.success,
        );
      const complete = best.every((points) => points > 0);
      const valid =
        argument.claim === "supported" &&
        argument.scope === "tested" &&
        score >= 3 &&
        proof &&
        complete &&
        state.resources.trust > 0;
      const reason =
        argument.scope === "universal"
          ? "实验只覆盖了有限条件，结论却被推广到了所有情况。"
          : argument.claim !== "supported"
            ? "选中的解释与这次观察的关系还没有成立。回看读数，区分现象和原因。"
            : !proof
              ? "选中的记录里缺少一次成功的完整实验，调查与试探还不能代替直接检验。"
              : !complete
                ? "证据链缺少一个阶段：参照和新条件需要各有记录支持。"
                : score < 3
                  ? "选中记录的支持强度还不够，同一幕的多次尝试不会重复叠分。"
                  : state.resources.trust <= 0
                    ? "记录已有支持，但还需要恢复在场人物的信任。"
                    : "两幕记录支持同一个解释，结论也保留了实验的适用范围。";
      return { valid, score, proof, complete, reason };
    }
    function report(state) {
      const experiments = state.log.filter(
        (entry) => entry.action === "experiment",
      );
      const predicted = experiments.filter(
        (entry) => entry.observation?.prediction,
      );
      const comparisons = experiments.filter((entry) => entry.comparison?.fair);
      const argument = state.argument ? assess(state, state.argument) : null;
      return {
        experiments: experiments.length,
        predicted: predicted.length,
        revised: predicted.filter(
          (entry) => entry.observation.matched === false,
        ).length,
        comparisons: comparisons.length,
        argument,
        badges: [
          predicted.length > 0,
          comparisons.length > 0,
          argument?.valid === true,
        ],
      };
    }
    const api = {
      cases,
      forecast,
      observe,
      comparison,
      sanitize,
      assess,
      report,
    };
    return api;
  }
  const api = { create };
  if (typeof window !== "undefined") window.AtlasResearchEngine = api;
  if (typeof module !== "undefined") module.exports = api;
})();
