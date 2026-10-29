const test = require("node:test");
const assert = require("node:assert/strict");
const M = require("../src/math-models.js");
const G = require("../src/math-scenarios.js");
const D = require("../src/math-level-data.js");

test("equation options distinguish partial transformations from a complete solution", () => {
  const controls = G.lab("M02", 1).controls[0];
  for (const [reduceStep, label] of controls.values) {
    const result = G.test("M02", 1, { reduceStep });
    if (reduceStep === "done") {
      assert.match(label, /先减去 5，再除以 3/);
      assert.equal(result.success, true);
      assert.deepEqual(result.readings[1], ["解得重量", "7 磅"]);
    } else {
      assert.doesNotMatch(label, /x = 7/);
      assert.equal(result.success, false);
      assert.doesNotMatch(result.readings[0][1], /均分解出/);
    }
  }
  assert.match(
    G.test("M02", 1, { reduceStep: "divide" }).readings[0][1],
    /5\/3/,
  );
});

test("the water-level stationary point is a minimum, not a peak or an inflection", () => {
  const h = (t) => 100 - 8 * t + 0.2 * t * t;
  assert.ok(h(19) > h(20) && h(21) > h(20));
  const result = G.test("M09", 1, { zeroSlopeT: 20 });
  assert.equal(result.success, true);
  assert.match(result.detail, /最低值/);
  assert.match(result.detail, /极小值而非拐点/);
  const text = JSON.stringify([D.byId.M09, G.byId.M09]);
  assert.doesNotMatch(text, /最高峰值|最大安全蓄水量|蓄水峰值|涨到最高/);
  assert.match(D.byId.M09.steps[1].hint, /驻点不一定是极值/);
});

test("zero is a real coordinate, direction, time or coefficient, not a missing value", () => {
  assert.equal(M.evaluate("M03", { targetX: 0, targetY: 0 }).x, 0);
  assert.equal(M.evaluate("M05", { archA: 0, archH: 0, archK: 0 }).a, 0);
  const river = M.evaluate("M08", { boatSpeed: 5, boatAngle: 0, riverFlow: 0 });
  assert.equal(river.angle, 0);
  assert.equal(river.flow, 0);
  assert.equal(river.vy, 0);
  assert.equal(M.evaluate("M09", { zeroSlopeT: 0 }).isStationary, false);
  assert.equal(M.evaluate("M10", { modelA: 0, modelB: 0, modelC: 0 }).predY, 0);
});
test("equal removal preserves balance but cannot remove nonexistent physical tokens", () => {
  const unchanged = M.evaluate("M02", {
    eliminatePouch: 0,
    eliminateWeight: 0,
  });
  assert.equal(unchanged.validRemoval, true);
  assert.equal(unchanged.balanced1, false);
  const invalid = M.evaluate("M02", { eliminatePouch: 2, eliminateWeight: 3 });
  assert.equal(invalid.validRemoval, false);
  assert.equal(invalid.rightPouches, -1);
  assert.equal(invalid.balanced1, false);
  assert.equal(
    G.test("M02", 0, { eliminatePouch: 1, eliminateWeight: 3 }).success,
    true,
  );
});
test("a degenerate triangle never qualifies as a Pythagorean construction", () => {
  const q = M.evaluate("M07", { sideA: 0, sideB: 4, sideC: 4 });
  assert.equal(q.validTriangle, false);
  assert.equal(q.pythagorean, false);
});
test("rational approximation supplies a residual, not a proof of irrationality", () => {
  for (const approximation of ["3:2", "7:5", "17:12", "41:29"]) {
    const q = M.evaluate("M01", { approximation });
    assert.equal(q.exact, false);
    assert.ok(q.err > 0);
  }
});
test("Gauss holdout compares the right date and retains the fitted coefficients in its replay", () => {
  assert.equal(M.evaluate("M10", { predT: 23 }).verified, false);
  const second = G.cleanParams("M10", 1, {
    predT: 24,
    modelA: 0.051,
    modelB: -1.21,
  });
  assert.equal(second.modelA, 0.051);
  assert.equal(second.modelB, -1.21);
  let s = G.fresh("M10", "assistant");
  s = G.act(s, "experiment", { modelA: 0.05, modelB: -1.2 });
  s = G.next(s);
  s = G.act(s, "experiment", second);
  assert.equal(s.last.result.params.modelA, 0.051);
  assert.equal(G.restore("M10", s).last.result.params.modelA, 0.051);
});
