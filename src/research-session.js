/* New research rules. Legacy scenario events remain in their original engines. */
(() => {
  const RULES = "worldline-1";
  const roles = {
    assistant: { time: 9, tools: 4, trust: 2 },
    maker: { time: 7, tools: 6, trust: 2 },
    skeptic: { time: 7, tools: 4, trust: 3 },
  };
  Object.values(roles).forEach(Object.freeze);
  Object.freeze(roles);
  const clone = v => JSON.parse(JSON.stringify(v));
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const token = () => globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const clamp = v => Math.max(0, Math.min(5, v));
  function create(adapter) {
    if (!adapter?.id || !adapter.modelVersion || !adapter.normalize || !adapter.evaluate)
      throw new TypeError("Research requires an identified, versioned model adapter");
    function fresh(role = "assistant", runId = token()) {
      if (!roles[role]) throw new RangeError("Unknown research role");
      if (typeof runId !== "string" || !runId || runId.length > 160) throw new RangeError("Invalid research run ID");
      return {
        version: 1, rules: RULES, modelVersion: adapter.modelVersion, id: adapter.id,
        runId, role, resources: { ...roles[role] }, activeCondition: 0,
        returnCondition: null, records: [], consultations: [], events: [], failures: 0, supplies: 0,
        studies: [], revisions: [], bestStars: 0,
      };
    }
    function prepare(state, command) {
      const condition = state.activeCondition;
      const params = adapter.normalize(condition, clone(command.params || {}), state);
      const result = adapter.evaluate(condition, params, state);
      if (!result || result.legal !== true) return { allowed: false, reason: "invalid-parameters" };
      const claim = command.claim || "goal";
      if (!["goal", "reference"].includes(claim)) return { allowed: false, reason: "invalid-claim" };
      const basis = state.records.find(r => r.id === command.basis && r.condition === condition && r.recordValid);
      const quality = basis && adapter.compare ? adapter.compare({ condition, basis, params, result, records: state.records }) : null;
      const used = state.records.some(r => r.condition === condition && r.quality?.discount);
      const discount = quality?.eligible === true && !used;
      const cost = discount ? { time: 1, tools: 0 } : {
        time: 2, tools: state.role === "maker" && !state.records.length ? 0 : 1,
      };
      const duplicate = state.records.some(r => r.condition === condition && r.claim === claim && equal(r.params, params));
      return {
        allowed: !duplicate && state.resources.time >= cost.time && state.resources.tools >= cost.tools,
        reason: duplicate ? "duplicate-record" : "insufficient-resources",
        condition, params, result, claim, basis, quality, cost, discount,
      };
    }
    const supports = (state, condition) => state.records.some(r => r.condition === condition && r.recordValid && r.goalSupported);
    function rating(state) {
      const complete = [0, 1].every(c => supports(state, c));
      const quality = state.records.some(r => r.recordValid && r.quality?.verified) || state.studies.some(s => s.verified);
      const archived = state.revisions.length > 0;
      return archived ? 1 + Number(complete) + Number(complete && quality && state.failures <= 1 && !state.supplies) : 0;
    }
    function canSupply(state) {
      if (state.supplies || (state.resources.time >= 2 && state.resources.tools >= (state.role === "maker" && !state.records.length ? 0 : 1))) return false;
      const candidates = adapter.candidates?.(state.activeCondition, state) || [];
      const review = adapter.reviewCandidate?.(state);
      if (review && quote(state, { type: "review", ...review }).allowed) return false;
      return !state.records.some(basis => basis.condition === state.activeCondition && basis.recordValid &&
        candidates.some(params => prepare(state, { params, basis: basis.id }).allowed));
    }
    function quote(state, command) {
      if (command.type === "review") {
        try {
          const study = adapter.review?.(state, command);
          if (!study || state.studies.some(s => equal(s.references, study.references))) return { allowed: false, reason: "invalid-review" };
          return { allowed: state.resources.time >= 1, reason: "insufficient-resources", study, cost: { time: 1, tools: 0 } };
        } catch { return { allowed: false, reason: "invalid-review" }; }
      }
      if (command.type !== "record") return { allowed: false, reason: "not-record" };
      try { return prepare(state, command); }
      catch { return { allowed: false, reason: "invalid-parameters" }; }
    }
    function execute(state, command) {
      if (command.type === "review") {
        const plan = quote(state, command);
        if (!plan.allowed) return plan.reason;
        state.resources.time--;
        state.studies.push({ ...clone(plan.study), id: `${state.runId}:${command.id}`, cost: plan.cost, source: "player-reasoning" });
        return null;
      }
      if (command.type === "consult") {
        if (state.resources.time < 1 || !adapter.consult) return "consult-unavailable";
        const strong = state.role === "skeptic" && !state.consultations.length;
        const guidance = adapter.consult(state.activeCondition, strong);
        if (!guidance) return "consult-unavailable";
        state.resources.time--;
        state.consultations.push({ id: `${state.runId}:${command.id}`, condition: state.activeCondition,
          source: "given", strong, guidance: clone(guidance), cost: { time: 1, tools: 0 } });
        return null;
      }
      if (command.type === "record") {
        const plan = quote(state, command);
        if (!plan.allowed) return plan.reason;
        const { result, params, condition, claim, cost, basis, quality, discount } = plan;
        const recordValid = claim === "reference" ? result.referenceValid === true : result.goalSupported === true;
        const fact = { condition, params: result.factParams || params, fixed: result.fixed || {}, measurement: result.measurement || result.readings };
        const repeatedFact = state.records.some(r => equal(r.fact, fact));
        const record = {
          id: `${state.runId}:${command.id}`, runId: state.runId, levelId: state.id,
          condition, rules: RULES, modelVersion: state.modelVersion, source: "player",
          sequence: state.events.length, params, fixed: clone(result.fixed || {}),
          readings: clone(result.readings || []), measurement: clone(result.measurement || null),
          claim, recordValid, goalSupported: recordValid && result.goalSupported === true,
          fact, factRef: repeatedFact ? state.records.find(r => equal(r.fact, fact)).id : null,
          cost, quality: quality?.eligible ? {
            kind: quality.kind, basis: basis.id, discount,
            verified: recordValid && quality.verified === true,
          } : null,
        };
        state.resources.time -= cost.time; state.resources.tools -= cost.tools;
        state.resources.trust = clamp(state.resources.trust + (recordValid ? repeatedFact ? 0 : 1 : -1));
        if (!recordValid) state.failures++;
        state.records.push(record);
        return null;
      }
      if (command.type === "advance") {
        if (state.returnCondition !== null || state.activeCondition !== 0 || !supports(state, 0)) return "condition-not-supported";
        state.activeCondition = 1;
        return null;
      }
      if (command.type === "supplement") {
        if (state.returnCondition !== null || ![0, 1].includes(command.condition) || !supports(state, command.condition)) return "invalid-supplement";
        state.returnCondition = state.activeCondition;
        state.activeCondition = command.condition;
        return null;
      }
      if (command.type === "return") {
        if (state.returnCondition === null) return "not-supplementing";
        state.activeCondition = state.returnCondition; state.returnCondition = null;
        return null;
      }
      if (command.type === "supply") {
        if (!canSupply(state)) return "supply-unavailable";
        state.resources.time += 4; state.resources.tools += 2; state.supplies++;
        return null;
      }
      if (command.type === "archive") {
        if (![0, 1].every(c => supports(state, c)) || state.resources.trust <= 0 || command.scope !== "tested") return "unsupported-archive";
        const refs = [...state.records.filter(r => r.recordValid).map(r => r.id), ...state.studies.filter(s => s.verified).map(s => s.id)];
        if (adapter.validateArchive && !adapter.validateArchive(state, refs)) return "missing-reasoning";
        if (equal(state.revisions.at(-1)?.records, refs)) return "duplicate-archive";
        state.revisions.push({ id: `${state.runId}:artifact:${state.revisions.length + 1}`, records: refs, scope: "tested" });
        state.bestStars = Math.max(state.bestStars, rating(state));
        return null;
      }
      return "unknown-command";
    }
    function dispatch(state, command) {
      if (state.rules !== RULES || state.id !== adapter.id || state.modelVersion !== adapter.modelVersion) return { state, changed: false, reason: "rules-mismatch" };
      if (command?.runId !== state.runId) return { state, changed: false, reason: "wrong-attempt" };
      if (!command || typeof command.id !== "string" || !command.id || command.id.length > 160) return { state, changed: false, reason: "invalid-command" };
      if (state.events.some(e => e.id === command.id)) return { state, changed: false, reason: "duplicate-command" };
      if (command.expectedSequence !== state.events.length) return { state, changed: false, reason: "stale-command" };
      if (state.events.length >= 1024) return { state, changed: false, reason: "attempt-limit" };
      const next = clone(state);
      let error;
      try { error = execute(next, command); }
      catch { error = "invalid-command"; }
      if (error) return { state, changed: false, reason: error };
      // Store commands, not caller-supplied outcomes. Restore calculates again.
      const event = { id: command.id, runId: state.runId, type: command.type, expectedSequence: state.events.length };
      if (command.type === "record") Object.assign(event, { params: clone(next.records.at(-1).params), claim: next.records.at(-1).claim, ...(command.basis ? { basis: command.basis } : {}) });
      if (command.type === "supplement") event.condition = command.condition;
      if (command.type === "archive") event.scope = command.scope;
      if (command.type === "review") Object.assign(event, { references: clone(command.references), reasoning: command.reasoning });
      next.events.push(event);
      return { state: next, changed: true, reason: "committed" };
    }
    function restore(record) {
      if (record?.version !== 1 || record.rules !== RULES || record.id !== adapter.id || record.modelVersion !== adapter.modelVersion || !roles[record.role] || typeof record.runId !== "string" || !record.runId || record.runId.length > 160 || !Array.isArray(record.events) || record.events.length > 1024)
        return { state: null, error: "incompatible-record" };
      let state = fresh(record.role, record.runId);
      for (const event of record.events) {
        const result = dispatch(state, event);
        if (!result.changed) return { state, error: result.reason };
        state = result.state;
      }
      return { state, error: null };
    }
    return { fresh, quote, dispatch, restore, rating, canSupply };
  }
  const api = { RULES, roles, create, token };
  if (typeof window !== "undefined") window.AtlasResearchSession = api;
  if (typeof module !== "undefined") module.exports = api;
})();
