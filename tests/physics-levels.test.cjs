const { test } = require("node:test"),
  assert = require("node:assert/strict");
const D = require("../src/physics-level-data.js"),
  M = require("../src/physics-models.js");
const params = (id, patch = {}) => ({
  ...M.clone(D.byId[id].defaults),
  ...patch,
});
test("ten distinct historical companions have two story beats, letters and history sources", () => {
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
    ])
      assert.ok(l[key]);
    assert.match(l.source[1], /^https:\/\//);
  }
});
test("buoyancy retains mass while changing maximum displacement; full cargo requires capacity", () => {
  const lump = M.evaluate("P01", params("P01")),
    bowl = M.evaluate("P01", params("P01", { shape: "bowl" }));
  assert.equal(lump.mass, bowl.mass);
  assert.equal(lump.floats, false);
  assert.equal(bowl.floats, true);
  assert.equal(
    M.outcome("P01", 1, params("P01", { shape: "bowl", cargo: 4 })).ok,
    false,
  );
  assert.equal(
    M.outcome("P01", 1, params("P01", { shape: "wide", cargo: 4 })).ok,
    true,
  );
});
test("bell intervals follow square-root time and transfer to a steeper plane", () => {
  assert.equal(M.evaluate("P02", params("P02")).even, false);
  for (const slope of ["gentle", "steep"]) {
    const r = M.evaluate("P02", params("P02", { bells: [1, 4, 9], slope }));
    assert.equal(r.even, true);
    assert.ok(r.gaps.every((t) => t > 0));
  }
  assert.equal(
    M.outcome("P02", 1, params("P02", { bells: [1, 4, 9] })).ok,
    false,
  );
  assert.equal(
    M.outcome("P02", 1, params("P02", { bells: [1, 4, 9], slope: "steep" })).ok,
    true,
  );
});
test("central gravity separates impact, closed orbits and escape without a wide-orbit cutoff", () => {
  assert.equal(M.orbit(0.6).kind, "ground");
  assert.equal(M.orbit(1).kind, "orbit");
  assert.equal(M.orbit(1.65).kind, "escape");
  for (const speed of [1, 1.1, 1.3, 1.39]) {
    const r = M.orbit(speed);
    assert.equal(r.kind, "orbit");
    assert.ok(Math.hypot(r.path.at(-1)[0], r.path.at(-1)[1] + 1) < 1e-6);
  }
  assert.ok(
    M.orbit(1).path.every(([x, y]) => Math.abs(Math.hypot(x, y) - 1) < 1e-8),
  );
  assert.throws(() => M.orbit(NaN), RangeError);
});
test("Joule accumulates heat per drop without retroactively changing insulation losses", () => {
  let p = params("P04", { connected: true });
  const a = M.evaluate("P04", p);
  assert.equal(a.work, 196);
  assert.equal(a.heatAdded, 127.4);
  p = { ...p, heat: a.heat, drops: a.drops, insulated: true };
  const b = M.evaluate("P04", p);
  p = { ...p, heat: b.heat, drops: b.drops };
  const c = M.outcome("P04", 1, p);
  assert.equal(c.ok, false);
  assert.ok(c.result.temperature < 0.12);
  const fourth = M.outcome("P04", 1, {
    ...p,
    heat: c.result.heat,
    drops: c.result.drops,
  });
  assert.equal(fourth.ok, true);
  const unconnected = M.evaluate("P04", params("P04"));
  assert.equal(unconnected.heatAdded, 0);
  assert.equal(unconnected.drops, 0);
});
test("interference depends on two slits, wavelength and geometry", () => {
  assert.equal(M.evaluate("P05", params("P05")).dark, false);
  assert.equal(M.outcome("P05", 0, params("P05", { slits: "two" })).ok, true);
  assert.equal(M.outcome("P05", 1, params("P05", { slits: "two" })).ok, false);
  assert.equal(
    M.outcome(
      "P05",
      1,
      params("P05", { slits: "two", color: "blue", gap: 0.75 }),
    ).ok,
    true,
  );
});
test("induction requires observing both directions, then mechanical connection", () => {
  const p = params("P06");
  assert.equal(M.outcome("P06", 0, p, ["in"]).ok, false);
  assert.equal(M.outcome("P06", 0, p, ["in", "out"]).ok, true);
  assert.equal(M.outcome("P06", 1, p).ok, false);
  assert.equal(M.outcome("P06", 1, { ...p, crank: true }).ok, true);
});
test("radio transmission requires receiver matching as well as the correct message", () => {
  assert.equal(M.outcome("P07", 0, params("P07", { frequency: 3 })).ok, true);
  assert.equal(
    M.outcome("P07", 1, params("P07", { frequency: 3, code: "R" })).ok,
    false,
  );
  assert.equal(
    M.outcome("P07", 1, params("P07", { frequency: 5, code: "S" })).ok,
    false,
  );
  assert.equal(
    M.outcome("P07", 1, params("P07", { frequency: 5, code: "R" })).ok,
    true,
  );
});
test("Curie evidence requires a blank, reference, ore and repeated sample comparisons", () => {
  const readings = {
      background: [10],
      uranium: [100],
      ore: [180],
      fraction: [],
    },
    p = params("P08", { readings });
  assert.equal(M.outcome("P08", 0, p).ok, true);
  assert.equal(M.outcome("P08", 1, p).ok, false);
  assert.equal(
    M.outcome(
      "P08",
      0,
      params("P08", { readings: { ...readings, background: [] } }),
    ).ok,
    false,
  );
  assert.equal(
    M.outcome(
      "P08",
      1,
      params("P08", {
        readings: { ...readings, ore: [180, 182], fraction: [298, 302] },
      }),
    ).ok,
    true,
  );
});
test("Planck comparison requires old-model mismatch and frequency-dependent packets", () => {
  const p = params("P09", { model: "quanta", fed: [1, 3] });
  assert.equal(M.outcome("P09", 0, p).ok, false);
  assert.equal(M.outcome("P09", 0, p, ["mismatch"]).ok, true);
  assert.equal(M.outcome("P09", 1, p).ok, false);
  assert.equal(M.outcome("P09", 1, { ...p, temperature: "hot" }).ok, true);
  const warm = M.evaluate("P09", p),
    hot = M.evaluate("P09", { ...p, temperature: "hot" });
  assert.ok(hot.spectrum(2, true) > warm.spectrum(2, true));
});
test("photoelectric threshold depends on frequency and material, not brightness alone", () => {
  assert.equal(M.evaluate("P10", params("P10")).electrons, 0);
  const blue = params("P10", { color: "blue", intensity: 1 });
  assert.ok(M.evaluate("P10", blue).electrons > 0);
  assert.equal(M.evaluate("P10", blue, 1).electrons, 0);
  assert.equal(M.outcome("P10", 0, blue).ok, false);
  assert.equal(M.outcome("P10", 0, blue, ["red-blocked"]).ok, true);
  assert.equal(M.outcome("P10", 1, { ...blue, color: "uv" }).ok, true);
  const bright = M.evaluate("P10", { ...blue, intensity: 5 });
  assert.equal(bright.kinetic, M.evaluate("P10", blue).kinetic);
  assert.equal(bright.electrons, 5 * M.evaluate("P10", blue).electrons);
});
test("posting requires two story beats; legacy test achievements do not post letters", () => {
  for (const r of [
    null,
    {},
    { missions: [0, 1], verified: true },
    { version: 3, steps: [1], letterSent: true },
    { version: 3, steps: [0, 1], letterSent: false },
  ])
    assert.equal(M.isCleared(r), false);
  assert.equal(
    M.isCleared({ version: 3, steps: [0, 1], letterSent: true }),
    true,
  );
});
test("saved state sanitizes enums, bounded parameters, reading arrays and sequence", () => {
  const r = M.sanitize(
    "P01",
    {
      version: 3,
      params: { shape: "script", cargo: 999 },
      steps: [1],
      letterSent: true,
    },
    D.byId.P01,
  );
  assert.deepEqual(r.params, D.byId.P01.defaults);
  assert.equal(r.letterSent, false);
  assert.equal(r.step, 0);
  const old = M.sanitize(
    "P03",
    { missions: [0, 1], verified: true, params: { speed: 1 } },
    D.byId.P03,
  );
  assert.equal(old.params.speed, 0.6);
  assert.equal(old.letterSent, false);
  const bad = M.sanitize(
    "P08",
    {
      version: 3,
      params: {
        readings: { ore: [180, NaN, "bad", Infinity], fraction: null },
      },
    },
    D.byId.P08,
  );
  assert.deepEqual(bad.params.readings.ore, [180]);
  assert.deepEqual(bad.params.readings.fraction, []);
});
