/* Versioned bridges to existing calculations. New gameplay gets new adapters. */
(() => {
  const local = typeof module !== "undefined" && module.exports;
  const S = local ? require("./research-session.js") : window.AtlasResearchSession;
  function create(id, game) {
    const controls = condition => game.lab(id, condition).controls;
    const candidates = condition => {
      if (id === "P01") return ["lump", "bowl", "wide"].map(shape => ({ shape }));
      if (id === "C01") return (condition ? ["eye", "conductivity", "magnet"] : ["eye", "density", "conductivity"])
        .map(instrument => ({ instrument, identity: condition ? "iron" : "salt" }));
      return [];
    };
    return S.create({
      id, modelVersion: `p3-existing-${id}-1`, candidates,
      consult(condition, strong) {
        const scene = game.byId[id];
        const round = scene.rounds?.[condition] || scene.acts?.[condition];
        const action = Array.isArray(round?.actions) ? round.actions.find(a => a.id === "consult") : round?.actions?.consult;
        const guidance = { text: action?.reply || round?.description || "先核对给定条件与参考，再留下自己的操作记录。" };
        if (strong) guidance.controls = controls(condition).map(c => ({ key: c.key, label: c.label }));
        return guidance;
      },
      normalize(condition, input) {
        const known = controls(condition).map(c => c.key);
        if (Object.keys(input).some(k => !known.includes(k))) throw new RangeError("Unknown model parameter");
        const clean = game.cleanParams(id, condition, input);
        for (const key of Object.keys(input)) if (clean[key] !== input[key]) throw new RangeError("Parameter outside the model range");
        return clean;
      },
      evaluate(condition, params) {
        const result = game.test(id, condition, params);
        let fixed = { condition, sourceModel: "existing-scenario" };
        let measurement = { readings: result.readings };
        let factParams = params;
        if (id === "P01") fixed = { cargo: condition ? 4 : 0, bodyMass: 1.2, crateMass: 1.2, waterDensity: 1 };
        if (id === "C01") {
          fixed = { sample: condition ? "B" : "A", reference: "c01-reference-1", conditions: "same-as-reference" };
          factParams = { instrument: params.instrument };
          measurement = condition ? { response: params.instrument === "magnet" ? "attracted" : params.instrument === "conductivity" ? "conductive" : "similar-appearance" }
            : params.instrument === "density" ? { value: 2.16, unit: "g/cm3" }
            : params.instrument === "conductivity" ? { value: 15, unit: "relative-conductivity" } : { response: "white-crystals" };
        }
        return { legal: true, goalSupported: result.success === true, referenceValid: true, readings: result.readings, measurement, factParams, fixed };
      },
      compare({ condition, basis, params, result }) {
        if (id === "P01") {
          const eligible = basis.params.shape !== params.shape;
          return { eligible, verified: eligible, kind: "controlled-comparison" };
        }
        if (id === "C01") {
          const methods = [basis.params.instrument, params.instrument];
          const eligible = condition === 0 && basis.goalSupported && methods.includes("density") && methods.includes("conductivity");
          return { eligible, verified: eligible && result.goalSupported, kind: "cross-check" };
        }
        // M03 origin changes and other P2 quality rules need their actual new models.
        return null;
      },
    });
  }
  const api = { create };
  if (typeof window !== "undefined") window.AtlasResearchAdapters = api;
  if (local) module.exports = api;
})();
