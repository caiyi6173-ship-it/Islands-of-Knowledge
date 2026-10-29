const { test } = require("node:test");
const assert = require("node:assert/strict");
const G = require("../src/chemistry-scenarios.js");
const Native = require("../src/chemistry-engine.js");
const P = require("../src/physics-scenarios.js");
const ScenarioEngine = require("../src/scenario-engine.js");
const ResearchEngine = require("../src/research-engine.js");
const solutions = {
  C01: [
    { instrument: "conductivity", identity: "salt" },
    { instrument: "magnet", identity: "iron" },
  ],
  C02: [
    { carbon: 1, oxygen: 1 },
    { carbon: 1, oxygen: 2 },
  ],
  C03: [
    { shells: 3, outer: 1 },
    { shells: 3, outer: 7 },
  ],
  C04: [
    { pairs: 1, lone: 0 },
    { pairs: 2, lone: 4 },
  ],
  C05: [
    { first: 2, second: 1, units: 1 },
    { first: 1, second: 3, units: 1 },
  ],
  C06: [
    { shape: "tetra", angle: 109.5 },
    { shape: "bent", angle: 104.5 },
  ],
  C07: [
    { angle: 180, pull: 1 },
    { angle: 104.5, pull: 1 },
  ],
  C08: [
    { closed: "closed", gas: 4 },
    { hydrogen: 2, oxygen: 1, water: 2 },
  ],
  C09: [
    { donor: "Zn", electrons: 2 },
    { charge: 386, valence: 2 },
  ],
  C10: [
    { wire: "on", bridge: "on" },
    { wire: "on", bridge: "on", direction: "ZnCu", load: 30 },
  ],
};
function complete(id, role = "assistant") {
  let state = G.fresh(id, role);
  for (let round = 0; round < 2; round++) {
    state = G.act(state, "experiment", solutions[id][round], {
      followUp: true,
    });
    assert.ok(state);
    state = G.next(state);
    assert.ok(state);
  }
  const records = state.log.flatMap((e, i) => (e.points ? [i] : []));
  return G.act(
    state,
    "publish",
    {},
    { argument: { claim: "supported", scope: "tested", records } },
  );
}
test("changing an identification answer is not an experiment or a fair comparison", () => {
  let state = G.act(G.fresh("C01", "assistant"), "experiment", {
    instrument: "density",
    identity: "sugar",
  });
  const corrected = { instrument: "density", identity: "salt" };
  const comparison = G.research.comparison(state, corrected);
  assert.deepEqual(comparison.changes, []);
  assert.equal(comparison.fair, false);
  assert.equal(comparison.discount, false);
  assert.deepEqual(
    G.cost(state, "experiment", corrected, { comparison: true }),
    { time: 2, tools: 1 },
  );
  assert.equal(
    G.act(state, "experiment", corrected, { comparison: true }),
    null,
  );
  state = G.act(state, "experiment", corrected, { followUp: true });
  assert.deepEqual(state.log[0].result.readings, state.last.result.readings);
  state = G.next(state);
  state = G.act(state, "experiment", solutions.C01[1]);
  state = G.next(state);
  state = G.act(
    state,
    "publish",
    {},
    {
      argument: { claim: "supported", scope: "tested", records: [1, 2] },
    },
  );
  assert.equal(state.bestStars, 2);
  assert.deepEqual(G.restore("C01", state), state);
});

test("changing a real instrument still qualifies even if the identification answer changes", () => {
  const state = G.act(G.fresh("C01", "assistant"), "experiment", {
    instrument: "density",
    identity: "sugar",
  });
  const comparison = G.research.comparison(state, {
    instrument: "conductivity",
    identity: "salt",
  });
  assert.deepEqual(comparison.changes, ["instrument"]);
  assert.equal(comparison.fair, true);
  assert.equal(comparison.discount, true);
});

test("old chemistry comparison events retain their costs, conclusion and historical stars", () => {
  const legacy = ScenarioEngine.create({
    scenarios: G.scenarios,
    roles: G.roles,
    lab: G.lab,
    cleanParams: G.cleanParams,
    test: G.test,
    research: ResearchEngine.create({
      cases: G.research.cases,
      forecast: G.research.forecast,
      observe: G.research.observe,
    }),
  });
  let old = legacy.act(legacy.fresh("C01", "assistant"), "experiment", {
    instrument: "density",
    identity: "sugar",
  });
  old = legacy.act(
    old,
    "experiment",
    { instrument: "density", identity: "salt" },
    { comparison: true, followUp: true },
  );
  old = legacy.next(old);
  old = legacy.act(old, "experiment", solutions.C01[1]);
  old = legacy.next(old);
  old = legacy.act(old, "publish");
  assert.equal(old.bestStars, 3);
  assert.deepEqual(G.restore("C01", old), old);
});

for (const s of G.scenarios)
  test(`${s.id}: common roles, live results and Physics campaign conclusions`, () => {
    assert.equal(s.rounds.length, 2);
    assert.ok(s.npc.name);
    assert.equal(G.research.cases[s.id].claims.length, 3);
    for (const role of G.roles) {
      const state = complete(s.id, role.id);
      assert.equal(state.ending, "breakthrough");
      assert.equal(state.bestStars, 2);
      assert.equal(G.isCleared(state), true);
      assert.deepEqual(G.restore(s.id, state), state);
    }
    for (let round = 0; round < 2; round++) {
      const result = G.test(s.id, round, solutions[s.id][round]);
      assert.equal(result.success, true);
      const observation = G.research.observe(s.id, round, result);
      assert.ok(
        G.research
          .forecast(s.id, round)
          .options.some((o) => o.id === observation.actual),
      );
    }
  });
test("the shared engine retains Physics action prices, failed trust loss, fair-comparison discount and role perks", () => {
  for (const role of G.roles) {
    const state = G.fresh("C05", role.id),
      physics = P.fresh("P01", role.id);
    assert.deepEqual(state.resources, physics.resources);
    for (const action of ["experiment", "consult", "rush", "skip"])
      assert.deepEqual(G.cost(state, action), P.cost(physics, action));
  }
  let state = G.fresh("C05", "assistant");
  state = G.act(state, "experiment", { first: 1, second: 1, units: 1 });
  assert.equal(state.resources.trust, 1);
  const params = { first: 2, second: 1, units: 1 };
  assert.deepEqual(G.cost(state, "experiment", params, { comparison: true }), {
    time: 1,
    tools: 0,
  });
  state = G.act(state, "experiment", params, {
    comparison: true,
    followUp: true,
  });
  assert.equal(state.last.comparison.fair, true);
  assert.equal(state.last.success, true);
  assert.deepEqual(
    G.cost(state, "experiment", { ...params, units: 2 }, { comparison: true }),
    { time: 2, tools: 1 },
  );
});
test("legacy chemical discoveries retain stars, source records and in-progress evidence", () => {
  let old = Native.fresh("C05");
  for (let round = 0; round < 2; round++) {
    old = Native.act(old, {
      type: "record",
      round,
      params: solutions.C05[round],
    });
    old = Native.act(old, { type: "advance" });
  }
  old = Native.act(old, {
    type: "conclude",
    claim: "supported",
    scope: "tested",
    evidence: [0, 1],
  });
  assert.equal(old.bestStars, 2);
  const current = G.restore("C05", old);
  assert.equal(current.ended, true);
  assert.equal(current.bestStars, old.bestStars);
  assert.equal(G.isCleared(current), true);
  assert.deepEqual(current.legacyChemistry, old);
  assert.deepEqual(G.restore("C05", current), current);
  const restarted = G.fresh("C05", "maker", current);
  assert.equal(restarted.bestStars, 2);
  assert.equal(restarted.cleared, true);
  assert.equal(restarted.round, 0);
  assert.deepEqual(restarted.legacyChemistry, old);
  let partial = Native.act(Native.fresh("C05"), {
    type: "record",
    round: 0,
    params: solutions.C05[0],
  });
  partial = Native.act(partial, { type: "advance" });
  const migrated = G.restore("C05", partial);
  assert.equal(migrated.round, 1);
  assert.equal(migrated.evidence[0].points, 2);
  assert.equal(migrated.ended, false);
});
test("revision and supplementation retain the same common campaign semantics", () => {
  let state = G.fresh("C01", "assistant");
  for (let round = 0; round < 2; round++) {
    state = G.act(state, "experiment", solutions.C01[round]);
    state = G.next(state);
  }
  state = G.act(
    state,
    "publish",
    {},
    { argument: { claim: "alternative-1", scope: "tested", records: [0, 1] } },
  );
  assert.equal(state.ending, "provisional");
  assert.equal(G.isCleared(state), false);
  state = G.revise(state);
  assert.equal(state.ended, false);
  state = G.act(
    state,
    "publish",
    {},
    { argument: { claim: "supported", scope: "tested", records: [0, 1] } },
  );
  assert.equal(state.ending, "breakthrough");
  assert.deepEqual(G.restore("C01", state), state);
});
test("migrating a one-star chemical discovery never upgrades its historical score by replay alone", () => {
  let old = Native.fresh("C05");
  for (const params of [
    { first: 1, second: 1, units: 1 },
    { first: 1, second: 2, units: 1 },
    { first: 3, second: 3, units: 1 },
    solutions.C05[0],
  ])
    old = Native.act(old, { type: "record", round: 0, params });
  old = Native.act(old, { type: "advance" });
  old = Native.act(old, { type: "record", round: 1, params: solutions.C05[1] });
  old = Native.act(old, { type: "advance" });
  old = Native.act(old, {
    type: "conclude",
    claim: "supported",
    scope: "tested",
    evidence: [3, 4],
  });
  assert.equal(old.bestStars, 1);
  const migrated = G.restore("C05", old);
  assert.equal(migrated.bestStars, 1);
  assert.equal(G.rating(migrated).count, 1);
  const reload = G.restore("C05", migrated);
  assert.equal(reload.bestStars, 1);
  assert.deepEqual(reload, migrated);
});
