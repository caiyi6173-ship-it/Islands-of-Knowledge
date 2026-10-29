const test = require("node:test");
const assert = require("node:assert/strict");
const G = require("../src/physics-scenarios.js");
const solutions = {
  P01: [{ shape: "bowl" }, { shape: "wide" }],
  P02: [{ layout: "square" }, { layout: "square" }],
  P03: [{ speed: 0.6 }, { speed: 1 }],
  P04: [
    { connected: true, insulated: false },
    { connected: true, insulated: true },
  ],
  P05: [
    { slits: "two", gap: 1 },
    { slits: "two", gap: 0.75 },
  ],
  P06: [{ motion: "in" }, { motion: "turn" }],
  P07: [{ frequency: 3 }, { frequency: 5, code: "R" }],
  P08: [{ protocol: "control" }, { repeats: 3 }],
  P09: [{ model: "quanta" }, { model: "quanta", temperature: "hot" }],
  P10: [{ protocol: "frequency" }, { color: "uv", intensity: 1 }],
};
function complete(
  id,
  role = "assistant",
  actions = ["experiment", "experiment"],
  final = "publish",
) {
  let s = G.fresh(id, role);
  for (let i = 0; i < 2; i++) {
    s = G.act(s, actions[i], solutions[id][i]);
    assert.ok(s);
    s = G.next(s);
  }
  return G.act(s, final);
}
test("all ten scientific problems have distinct scenario content and a supported discovery path", () => {
  assert.equal(G.scenarios.length, 10);
  assert.equal(new Set(G.scenarios.map((s) => s.title)).size, 10);
  for (const [id, params] of Object.entries(solutions)) {
    params.forEach((p, i) => {
      const r = G.test(id, i, p);
      assert.equal(r.success, true, id + " round " + i);
      assert.ok(r.readings.length);
    });
    const s = complete(id);
    assert.equal(s.ending, "breakthrough", id);
    assert.equal(s.evidence.length, 2);
    assert.equal(G.isCleared(s), true);
    const restored = G.restore(id, JSON.parse(JSON.stringify(s)));
    assert.deepEqual(restored, s);
  }
});
test("identity changes starting resources and actual action costs", () => {
  const a = G.fresh("P01", "assistant"),
    m = G.fresh("P01", "maker"),
    q = G.fresh("P01", "skeptic");
  assert.equal(a.resources.time, 9);
  assert.equal(m.resources.tools, 6);
  assert.equal(q.resources.trust, 3);
  const first = G.act(m, "experiment", { shape: "bowl" });
  assert.equal(first.resources.tools, 6);
  const second = G.act(G.next(first), "experiment", { shape: "wide" });
  assert.equal(second.resources.tools, 5);
  const clues = G.act(q, "consult");
  assert.equal(clues.evidence[0].points, 2);
});
test("different strategies lead to four materially different endings", () => {
  assert.equal(complete("P01").ending, "breakthrough");
  assert.equal(
    complete("P01", "assistant", ["experiment", "consult"]).ending,
    "discovery",
  );
  assert.equal(
    complete("P01", "assistant", ["consult", "consult"]).ending,
    "provisional",
  );
  assert.equal(
    complete("P01", "assistant", ["experiment", "experiment"], "reserve")
      .ending,
    "provisional",
  );
  assert.equal(
    complete("P01", "assistant", ["experiment", "experiment"], "claim").ending,
    "overreach",
  );
  assert.equal(complete("P01", "assistant", ["rush", "rush"]).cleared, false);
});
test("failed experiments cost resources; retry records a new attempt without duplicating evidence", () => {
  let s = G.fresh("P01", "assistant");
  s = G.act(s, "experiment", { shape: "lump" });
  assert.equal(s.last.success, false);
  assert.equal(s.resources.time, 7);
  assert.equal(s.resources.trust, 1);
  assert.equal(G.act(s, "consult"), null);
  s = G.act(s, "experiment", { shape: "bowl" });
  assert.equal(s.log.length, 2);
  assert.equal(s.resources.time, 5);
  assert.equal(s.evidence.length, 1);
  assert.equal(G.act(s, "experiment", { shape: "wide" }), null);
  assert.deepEqual(G.restore("P01", s), s);
});
test("exhausting resources never prevents a free decision or ending", () => {
  let s = G.fresh("P01", "maker");
  while (G.canAct(s, "experiment"))
    s = G.act(s, "experiment", { shape: "lump" });
  assert.equal(G.act(s, "experiment", { shape: "wide" }), null);
  s = G.next(s);
  s = G.act(s, "skip");
  assert.ok(s);
  s = G.next(s);
  s = G.act(s, "reserve");
  assert.equal(s.ending, "provisional");
  assert.ok(s.resources.time >= 0);
  assert.ok(s.resources.tools >= 0);
});
test("every role and strategy combination reaches a valid ending with bounded resources", () => {
  for (const { id } of G.scenarios)
    for (const { id: role } of G.roles)
      for (const a of ["experiment", "consult", "rush"])
        for (const b of ["experiment", "consult", "rush"])
          for (const f of ["publish", "reserve", "claim"]) {
            const s = complete(id, role, [a, b], f);
            assert.equal(s.ended, true);
            for (const n of Object.values(s.resources)) assert.ok(n >= 0);
            assert.deepEqual(G.restore(id, s), s);
          }
});
test("new edition keeps its own save schema and rebuilds derived state from valid events", () => {
  assert.equal(
    G.restore("P01", { version: 3, letterSent: true, steps: [0, 1] }).role,
    null,
  );
  const s = complete("P01");
  s.resources.time = 999;
  s.round = 90;
  s.log = [];
  const fixed = G.restore("P01", s);
  assert.equal(fixed.resources.time, 5);
  assert.equal(fixed.round, 2);
  assert.equal(fixed.log.length, 3);
  assert.doesNotThrow(() =>
    G.restore("P01", {
      version: 4,
      id: "P01",
      role: "maker",
      endings: "bad",
      events: [{ type: "action", action: "experiment", params: null }],
    }),
  );
  assert.deepEqual(G.cleanParams("P01", 0, { shape: "javascript" }), {
    shape: "lump",
  });
  assert.deepEqual(G.fresh("P01", null, s).endings, ["breakthrough"]);
});
test("models expose both positive and negative experimental evidence", () => {
  for (const { id } of G.scenarios)
    for (let round = 0; round < 2; round++) {
      const controls = G.lab(id, round).controls;
      const variants = controls.reduce(
        (arr, c) =>
          arr.flatMap((p) => c.values.map(([v]) => ({ ...p, [c.key]: v }))),
        [{}],
      );
      assert.ok(
        variants.some((p) => G.test(id, round, p).success),
        id + round + " no success",
      );
      assert.ok(
        variants.some((p) => !G.test(id, round, p).success),
        id + round + " no failure",
      );
    }
});
test("quick probes trade equipment for time and need a maker or an existing clue", () => {
  let maker = G.fresh("P01", "maker");
  maker = G.act(maker, "rush");
  assert.equal(maker.resources.time, 7);
  assert.equal(maker.resources.tools, 4);
  assert.equal(maker.evidence[0].points, 1);
  assert.equal(maker.last.trustDelta, 0);
  let assistant = G.act(G.fresh("P01", "assistant"), "rush");
  assert.equal(assistant.evidence.length, 0);
  assert.equal(assistant.last.success, false);
  assert.equal(assistant.resources.trust, 1);
  let s = G.act(G.fresh("P01", "assistant"), "experiment", solutions.P01[0]);
  s = G.next(s);
  s = G.act(s, "rush");
  assert.equal(s.last.success, true);
  assert.equal(s.evidence[1].kind, "rush");
  s = G.act(G.next(s), "publish");
  assert.equal(s.ending, "discovery");
});
