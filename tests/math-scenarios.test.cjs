const test = require("node:test");
const assert = require("node:assert/strict");
const G = require("../src/math-scenarios.js");

const solutions = {
  M01: [{ ratio: "2:3" }, { approximation: "7:5" }],
  M02: [{ eliminatePouch: 1, eliminateWeight: 3 }, { reduceStep: "done", solvedX: 7 }],
  M03: [{ targetX: 4, targetY: 3 }, { lineSlope: 2 }],
  M04: [{ factorK: 2, offsetB: 1 }, { mappingType: "single" }],
  M05: [{ archA: -0.125, archH: 6, archK: 5 }, { archA: -0.125 }],
  M06: [{ shiftX: 3, shiftY: 2, rotateDeg: 90 }, { scaleS: 2 }],
  M07: [{ shapeType: "triangle" }, { sideA: 3, sideB: 4, sideC: 5 }],
  M08: [{ boatSpeed: 5, boatAngle: 126.87 }, { boatAngle: 90 }],
  M09: [{ deltaT: 0.2 }, { zeroSlopeT: 20 }],
  M10: [{ modelA: 0.05, modelB: -1.2, modelC: 15 }, { predT: 24 }],
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
    assert.ok(s, "failed acting in round " + i + " for " + id);
    s = G.next(s);
  }
  return G.act(s, final);
}

test("all ten mathematical problems have distinct scenario content and a supported discovery path", () => {
  assert.equal(G.scenarios.length, 10);
  assert.equal(new Set(G.scenarios.map((s) => s.title)).size, 10);
  for (const [id, params] of Object.entries(solutions)) {
    params.forEach((p, i) => {
      const r = G.test(id, i, p);
      assert.equal(r.success, true, id + " round " + i + " should succeed");
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

test("math role identity changes starting resources and action costs", () => {
  const a = G.fresh("M01", "assistant"),
    m = G.fresh("M01", "maker"),
    q = G.fresh("M01", "skeptic");
  assert.equal(a.resources.time, 9);
  assert.equal(m.resources.tools, 6);
  assert.equal(q.resources.trust, 3);
  const first = G.act(m, "experiment", solutions.M01[0]);
  assert.equal(first.resources.tools, 6); // Maker gets free tools on first exp
  const second = G.act(G.next(first), "experiment", solutions.M01[1]);
  assert.equal(second.resources.tools, 5);
  const clues = G.act(q, "consult");
  assert.equal(clues.evidence[0].points, 2); // Skeptic gets 2 points on consult
});

test("different strategies in math scenarios lead to four distinct endings", () => {
  assert.equal(complete("M01").ending, "breakthrough");
  assert.equal(
    complete("M01", "assistant", ["experiment", "consult"]).ending,
    "discovery",
  );
  assert.equal(
    complete("M01", "assistant", ["consult", "consult"]).ending,
    "provisional",
  );
  assert.equal(
    complete("M01", "assistant", ["experiment", "experiment"], "reserve").ending,
    "provisional",
  );
  assert.equal(
    complete("M01", "assistant", ["experiment", "experiment"], "claim").ending,
    "overreach",
  );
});

test("failed math experiments cost resources; retry records a new attempt without duplicating evidence", () => {
  let s = G.fresh("M01", "assistant");
  s = G.act(s, "experiment", { ratio: "5:7" });
  assert.equal(s.last.success, false);
  assert.equal(s.resources.time, 7);
  assert.equal(s.resources.trust, 1);
  s = G.act(s, "experiment", solutions.M01[0]);
  assert.equal(s.log.length, 2);
  assert.equal(s.resources.time, 5);
  assert.equal(s.evidence.length, 1);
  assert.deepEqual(G.restore("M01", s), s);
});

test("every math role and action combination reaches a valid ending", () => {
  for (const { id } of G.scenarios.slice(0, 3))
    for (const { id: role } of G.roles)
      for (const a of ["experiment", "consult"])
        for (const b of ["experiment", "consult"])
          for (const f of ["publish", "reserve", "claim"]) {
            const s = complete(id, role, [a, b], f);
            assert.equal(s.ended, true);
            for (const n of Object.values(s.resources)) assert.ok(n >= 0);
          }
});
