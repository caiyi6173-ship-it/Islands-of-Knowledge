const test = require("node:test");
const assert = require("node:assert/strict");
const G = require("../src/math-scenarios.js");
const R = require("../src/math-investigations.js");

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

const argument = (records) => ({
  argument: { claim: "supported", scope: "tested", records },
});

function prepared() {
  let s = G.act(
    G.fresh("M01", "assistant"),
    "experiment",
    { ratio: "5:7" },
    { prediction: "dissonance" },
  );
  s = G.act(
    s,
    "experiment",
    { ratio: "2:3" },
    { followUp: true, comparison: true, prediction: "harmony" },
  );
  s = G.next(s);
  s = G.act(
    s,
    "experiment",
    { approximation: "7:5" },
    { prediction: "close" },
  );
  return G.next(s);
}

test("every setting in all twenty labs has an observable forecast, independent of the task score", () => {
  for (const { id } of G.scenarios) {
    for (let round = 0; round < 2; round++) {
      const variants = G.lab(id, round).controls.reduce(
        (all, c) =>
          all.flatMap((p) => c.values.map(([v]) => ({ ...p, [c.key]: v }))),
        [{}],
      );
      for (const params of variants) {
        const result = G.test(id, round, params),
          actual = R.observe(id, round, result);
        assert.ok(
          R.forecast(id, round).options.some((o) => o.id === actual.actual),
          `${id} round ${round} missing forecast option ${actual.actual}`,
        );
        assert.equal(R.observe(id, round, result, actual.actual).matched, true);
        assert.equal(actual.matched, null);
      }
    }
  }
  const nonGoal = G.test("M03", 0, { targetX: 2, targetY: 1 });
  assert.equal(nonGoal.success, false);
  assert.equal(R.observe("M03", 0, nonGoal, "miss").matched, true);
});

test("consultation can lead into an experiment and replaces rather than stacks evidence", () => {
  let s = G.act(G.fresh("M01", "skeptic"), "consult");
  assert.equal(s.evidence[0].points, 2);
  s = G.act(s, "experiment", { ratio: "2:3" }, { followUp: true });
  assert.ok(s);
  assert.equal(s.resources.time, 3);
  assert.equal(s.evidence.length, 1);
  assert.equal(s.evidence[0].kind, "experiment");
  assert.equal(s.evidence[0].points, 2);
  assert.equal(G.act(s, "consult", {}, { followUp: true }), null);
  assert.deepEqual(G.restore("M01", s), s);
});

test("a single changed condition gets one discount per act; more repetitions pay normal cost", () => {
  let s = G.act(G.fresh("M01", "assistant"), "experiment", { ratio: "5:7" });
  s = G.act(
    s,
    "experiment",
    { ratio: "2:3" },
    { followUp: true, comparison: true },
  );
  assert.deepEqual(s.last.cost, { time: 1, tools: 0 });
  assert.equal(s.last.comparison.discount, true);
  assert.equal(s.resources.time, 6);
  assert.equal(s.resources.tools, 3);
  s = G.act(
    s,
    "experiment",
    { ratio: "1:2" },
    { followUp: true, comparison: true },
  );
  assert.deepEqual(s.last.cost, { time: 2, tools: 1 });
  assert.equal(s.last.comparison.discount, false);
  assert.equal(s.evidence.length, 1);
  assert.equal(s.evidence[0].points, 2);
  assert.deepEqual(G.restore("M01", s), s);
});

test("zero changes, multiple changes, and absent baselines cannot be submitted as controlled comparisons", () => {
  const start = G.fresh("M03", "assistant");
  assert.equal(
    G.act(start, "experiment", { targetX: 4, targetY: 3 }, { comparison: true }),
    null,
  );
  const s = G.act(start, "experiment", { targetX: 2, targetY: 1 });
  const before = JSON.stringify(s);
  assert.equal(
    G.act(
      s,
      "experiment",
      { targetX: 2, targetY: 1 },
      { comparison: true, followUp: true },
    ),
    null,
  );
  assert.equal(
    G.act(
      s,
      "experiment",
      { targetX: 6, targetY: 5 },
      { comparison: true, followUp: true },
    ),
    null,
  );
  assert.equal(JSON.stringify(s), before);
});

test("incorrect predictions are preserved for reflection and do not change mathematics, cost, trust, or evidence", () => {
  const s = G.fresh("M01", "assistant");
  const wrong = G.act(
    s,
    "experiment",
    { ratio: "2:3" },
    { prediction: "dissonance" },
  );
  const right = G.act(
    s,
    "experiment",
    { ratio: "2:3" },
    { prediction: "harmony" },
  );
  assert.deepEqual(wrong.resources, right.resources);
  assert.deepEqual(wrong.evidence, right.evidence);
  assert.deepEqual(wrong.last.result, right.last.result);
  assert.equal(wrong.last.observation.matched, false);
  assert.equal(R.report(wrong).badges[0], true);
});

test("selected evidence, explanation, and scope actually determine the new argument outcome", () => {
  const s = prepared();
  assert.equal(
    G.act(s, "publish", {}, argument([1, 2])).ending,
    "breakthrough",
  );
  assert.equal(G.act(s, "publish", {}, argument([0, 2])).ending, "provisional");
  assert.equal(G.act(s, "publish", {}, argument([1])).ending, "provisional");
  assert.equal(
    G.act(
      s,
      "publish",
      {},
      {
        argument: { claim: "alternative-1", scope: "tested", records: [1, 2] },
      },
    ).ending,
    "provisional",
  );
  assert.equal(
    G.act(
      s,
      "publish",
      {},
      { argument: { claim: "supported", scope: "universal", records: [1, 2] } },
    ).ending,
    "overreach",
  );
  assert.equal(G.act(s, "reserve").ending, "provisional");
});

test("all ten subjects and all roles can investigate both acts, compare, and defend a supported discovery", () => {
  for (const [id, steps] of Object.entries(solutions)) {
    for (const { id: role } of G.roles) {
      let s = G.fresh(id, role);
      const records = [];
      for (let round = 0; round < 2; round++) {
        const solution = G.cleanParams(id, round, steps[round]);
        const control = G.lab(id, round).controls[0];
        const baseline = {
          ...solution,
          [control.key]: control.values.find(
            ([v]) => v !== solution[control.key],
          )[0],
        };
        const prediction = R.observe(
          id,
          round,
          G.test(id, round, baseline),
        ).actual;
        s = G.act(s, "experiment", baseline, { prediction });
        assert.ok(s, id + " baseline " + role);
        s = G.act(s, "experiment", solution, {
          comparison: true,
          followUp: true,
        });
        assert.ok(s, id + " comparison " + role);
        assert.equal(s.last.result.success, true, id + " round " + round + " should succeed");
        assert.deepEqual(s.last.cost, { time: 1, tools: 0 });
        records.push(s.log.length - 1);
        s = G.next(s);
      }
      s = G.act(s, "publish", {}, argument(records));
      assert.equal(s.ending, "breakthrough", id + " " + role);
      assert.deepEqual(R.report(s).badges, [true, true, true]);
      assert.ok(Object.values(s.resources).every((n) => n >= 0));
      assert.deepEqual(G.restore(id, s), s);
    }
  }
});

test("annotation replay rebuilds trusted derived results and preserves legacy completions", () => {
  const s = G.act(prepared(), "publish", {}, argument([1, 2]));
  const raw = JSON.parse(JSON.stringify(s));
  raw.resources.time = 900;
  raw.log[0].points = 999;
  raw.log[1].comparison.discount = false;
  raw.argument.scope = "universal";
  assert.deepEqual(G.restore("M01", raw), s);
  let old = G.fresh("M01", "assistant");
  for (const p of solutions.M01) old = G.next(G.act(old, "experiment", p));
  old = G.act(old, "publish");
  assert.equal(G.restore("M01", old).ending, "breakthrough");
  assert.equal(G.restore("M01", old).cleared, true);
  assert.equal(
    old.events.some((e) => e.research),
    false,
  );
});

test("argument annotations reject fabricated record indices and unknown option values", () => {
  const s = prepared();
  const end = G.act(
    s,
    "publish",
    {},
    {
      argument: {
        claim: "supported",
        scope: "tested",
        records: [99, -1, "1", null],
      },
    },
  );
  assert.equal(end.ending, "provisional");
  assert.deepEqual(end.argument.records, []);
  assert.doesNotThrow(() =>
    G.act(
      s,
      "publish",
      {},
      { argument: { claim: "<script>", scope: "all", records: "bad" } },
    ),
  );
});

test("a conclusion can be revised without replaying experiments, spending resources, or losing collected endings", () => {
  let s = G.act(
    prepared(),
    "publish",
    {},
    { argument: { claim: "supported", scope: "universal", records: [1, 2] } },
  );
  assert.equal(s.ending, "overreach");
  const resources = { ...s.resources };
  const trials = s.log.filter((entry) => entry.action === "experiment").length;
  s = G.revise(s);
  assert.equal(s.ended, false);
  assert.deepEqual(s.resources, resources);
  s = G.act(s, "publish", {}, argument([1, 2]));
  assert.equal(s.ending, "breakthrough");
  assert.deepEqual(s.endings, ["overreach", "breakthrough"]);
  assert.equal(
    s.log.filter((entry) => entry.action === "experiment").length,
    trials,
  );
  assert.deepEqual(s.resources, resources);
  assert.deepEqual(G.restore("M01", s), s);
  assert.equal(G.revise(G.fresh("M01", "assistant")), null);
});

test("a remaining one-time-unit comparison can reuse exhausted equipment without creating a dead end", () => {
  let s = G.fresh("M01", "assistant");
  for (let i = 0; i < 4; i++) s = G.act(s, "experiment", { ratio: "5:7" });
  assert.equal(s.resources.tools, 0);
  assert.equal(s.resources.time, 1);
  assert.equal(G.canAct(s, "experiment"), false);
  assert.equal(G.comparisonOffer(s).affordable, true);
  s = G.act(
    s,
    "experiment",
    { ratio: "2:3" },
    { comparison: true, followUp: true },
  );
  assert.equal(s.resources.time, 0);
  assert.equal(s.resources.tools, 0);
  s = G.next(s);
  s = G.next(G.act(s, "skip"));
  assert.equal(G.act(s, "reserve").ending, "provisional");
});

test("revising more than the old event limit preserves the latest argument on replay", () => {
  let s = G.act(prepared(), "publish", {}, argument([1, 2]));
  for (let i = 0; i < 20; i++) {
    s = G.revise(s);
    s = G.act(
      s,
      "publish",
      {},
      {
        argument: {
          claim: "supported",
          scope: i % 2 ? "tested" : "universal",
          records: [1, 2],
        },
      },
    );
  }
  assert.ok(s.events.length > 24);
  assert.deepEqual(G.restore("M01", s), s);
});
