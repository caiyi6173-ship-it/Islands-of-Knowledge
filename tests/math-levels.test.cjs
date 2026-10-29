const { test } = require("node:test");
const assert = require("node:assert/strict");
const D = require("../src/math-level-data.js");
const M = require("../src/math-models.js");

const params = (id, patch = {}) => ({
  ...M.clone(D.byId[id].defaults),
  ...patch,
});

test("ten distinct mathematical companions have two story beats, letters and history sources", () => {
  assert.equal(D.levels.length, 10);
  assert.equal(new Set(D.levels.map((l) => l.person)).size, 10);
  for (const l of D.levels) {
    assert.equal(l.steps.length, 2);
    for (const key of [
      "opening",
      "greeting",
      "letter",
      "takeaway",
      "boundary",
      "history",
    ]) {
      assert.ok(l[key], `level ${l.id} missing ${key}`);
    }
    assert.match(l.source[1], /^https:\/\//);
  }
});

test("Pythagorean ratios and irrational diagonal approximation", () => {
  const p1 = params("M01", { ratio: "2:3" });
  assert.equal(M.evaluate("M01", p1).harmonious, true);
  const pBad = params("M01", { ratio: "5:7" });
  assert.equal(M.evaluate("M01", pBad).harmonious, false);
  const pApprox = params("M01", { approximation: "7:5" });
  assert.equal(M.evaluate("M01", pApprox).closeEnough, true);
  assert.equal(M.outcome("M01", 1, pApprox).ok, true);
});

test("Al-Khwarizmi balance scale and two-step reduction", () => {
  const p0 = params("M02", { eliminatePouch: 1, eliminateWeight: 3 });
  assert.equal(M.evaluate("M02", p0).balanced1, true);
  assert.equal(M.outcome("M02", 0, p0).ok, true);

  const p1 = params("M02", { reduceStep: "done", solvedX: 7 });
  assert.equal(M.evaluate("M02", p1).solved, true);
  assert.equal(M.outcome("M02", 1, p1).ok, true);
});

test("Descartes coordinate targeting and linear ray equation", () => {
  const p0 = params("M03", { targetX: 4, targetY: 3 });
  assert.equal(M.evaluate("M03", p0).targeted, true);
  assert.equal(M.outcome("M03", 0, p0).ok, true);

  const p1 = params("M03", { lineSlope: 2 });
  assert.equal(M.evaluate("M03", p1).onLine, true);
  assert.equal(M.outcome("M03", 1, p1).ok, true);
});

test("Euler function mapping and single-valued contract", () => {
  const p0 = params("M04", { factorK: 2, offsetB: 1 });
  assert.equal(M.evaluate("M04", p0).linearMatch, true);
  assert.equal(M.outcome("M04", 0, p0).ok, true);

  const p1 = params("M04", { mappingType: "single" });
  assert.equal(M.evaluate("M04", p1).singleValued, true);
  assert.equal(M.outcome("M04", 1, p1).ok, true);
});

test("Fermat parabolic arch and vehicle safety clearance", () => {
  const p0 = params("M05", { archA: -0.125, archH: 6, archK: 5 });
  const r0 = M.evaluate("M05", p0);
  assert.equal(r0.endsAligned, true);
  assert.equal(M.outcome("M05", 0, p0).ok, true);

  const r1 = M.evaluate("M05", p0);
  assert.equal(r1.safeClearance, true);
  assert.equal(M.outcome("M05", 1, p0).ok, true);
});

test("Klein rigid transformations and scaling area square law", () => {
  const p0 = params("M06", { shiftX: 3, shiftY: 2, rotateDeg: 90 });
  assert.equal(M.evaluate("M06", p0).rigidAligned, true);
  assert.equal(M.outcome("M06", 0, p0).ok, true);

  const p1 = params("M06", { scaleS: 2 });
  assert.equal(M.evaluate("M06", p1).areaRatio, 4);
  assert.equal(M.outcome("M06", 1, p1).ok, true);
});

test("Euclid triangle rigidity and Pythagorean area puzzle", () => {
  const p0 = params("M07", { shapeType: "triangle" });
  assert.equal(M.evaluate("M07", p0).rigid, true);
  assert.equal(M.evaluate("M07", p0).angleSum, 180);
  assert.equal(M.outcome("M07", 0, p0).ok, true);

  const p1 = params("M07", { sideA: 3, sideB: 4, sideC: 5 });
  assert.equal(M.evaluate("M07", p1).pythagorean, true);
  assert.equal(M.outcome("M07", 1, p1).ok, true);
});

test("Hamilton vector addition and minimum crossing time", () => {
  const p0 = params("M08", { boatSpeed: 5, boatAngle: 126.87 });
  assert.equal(M.evaluate("M08", p0).straightAcross, true);
  assert.equal(M.outcome("M08", 0, p0).ok, true);

  const p1 = params("M08", { boatAngle: 90 });
  assert.equal(M.evaluate("M08", p1).minTimeAngle, true);
  assert.equal(M.outcome("M08", 1, p1).ok, true);
});

test("Leibniz secant convergence and stationary extreme value", () => {
  const p0 = params("M09", { deltaT: 0.2 });
  assert.equal(M.evaluate("M09", p0).tangentClose, true);
  assert.equal(M.outcome("M09", 0, p0).ok, true);

  const p1 = params("M09", { zeroSlopeT: 20 });
  assert.equal(M.evaluate("M09", p1).isStationary, true);
  assert.equal(M.outcome("M09", 1, p1).ok, true);
});

test("Gauss least-squares orbit fitting and Ceres prediction", () => {
  const p0 = params("M10", { modelA: 0.05, modelB: -1.2, modelC: 15 });
  assert.equal(M.evaluate("M10", p0).fitted, true);
  assert.equal(M.outcome("M10", 0, p0).ok, true);

  const p1 = params("M10", { ...p0, predT: 24 });
  assert.equal(M.evaluate("M10", p1).verified, true);
  assert.equal(M.outcome("M10", 1, p1).ok, true);
});
