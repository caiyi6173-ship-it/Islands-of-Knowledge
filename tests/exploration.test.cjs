const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  physics,
  math,
  fogAreas,
  isRevealed,
  nextLandmark,
  colorAreas,
} = require("../src/exploration.js");

test("physics has ten unique landmarks placed inside its own map", () => {
  assert.equal(Object.keys(physics.positions).length, 10);
  assert.equal(
    new Set(Object.values(physics.positions).map((p) => p.join(","))).size,
    10,
  );
  for (const [id, [x, y]] of Object.entries(physics.positions)) {
    assert.ok(x > 0 && x < 1600 && y > 0 && y < 1000);
    assert.ok(physics.landmarks[id]);
  }
});

test("math has ten unique landmarks placed inside its own map", () => {
  assert.equal(Object.keys(math.positions).length, 10);
  assert.equal(
    new Set(Object.values(math.positions).map((p) => p.join(","))).size,
    10,
  );
  for (const [id, [x, y]] of Object.entries(math.positions)) {
    assert.ok(x > 0 && x < 1600 && y > 0 && y < 1000);
    assert.ok(math.landmarks[id]);
  }
});

test("unexplored maps have no color, while earned discoveries restore local terrain", () => {
  assert.deepEqual(colorAreas("island", "P", []), { full: false, areas: [] });
  const one = colorAreas("island", "P", ["P01", "P01", "M06", "bad"]);
  assert.equal(one.full, false);
  assert.equal(one.areas.length, 1);
  assert.equal(one.areas[0].x, physics.positions.P01[0]);
  assert.equal(one.areas[0].y, physics.positions.P01[1]);
  assert.equal(
    colorAreas("island", "P", physics.order.slice(0, 9)).full,
    false,
  );
  assert.equal(colorAreas("island", "P", physics.order).full, true);

  // Test math color areas
  assert.deepEqual(colorAreas("island", "M", []), { full: false, areas: [] });
  const mathOne = colorAreas("island", "M", ["M01"]);
  assert.equal(mathOne.full, false);
  assert.equal(mathOne.areas.length, 1);
  assert.equal(colorAreas("island", "M", math.order).full, true);
});

test("world color grows within the discovered subject and completes only after all subjects", () => {
  const first = colorAreas("world", "ALL", ["P01"]);
  const more = colorAreas("world", "ALL", physics.order);
  assert.deepEqual(
    first.areas.map((a) => a.id),
    ["P"],
  );
  assert.ok(more.areas[0].rx > first.areas[0].rx);
  assert.equal(more.full, false);
  const all = ["P", "M", "C"].flatMap((s) =>
    Array.from({ length: 10 }, (_, i) => s + String(i + 1).padStart(2, "0")),
  );
  assert.equal(colorAreas("world", "ALL", all).full, true);
});

test("initial physics fog reveals the trial harbor while keeping other experiments hidden", () => {
  const areas = fogAreas("island", "P", []);
  assert.equal(
    isRevealed({ x: physics.entry.x, y: physics.entry.y }, areas),
    true,
  );
  const [harborX, harborY] = physics.positions.P01;
  assert.equal(isRevealed({ x: harborX, y: harborY }, areas), true);
  for (const id of ["P03", "P07", "P08", "P10"]) {
    const [x, y] = physics.positions[id];
    assert.equal(isRevealed({ x, y }, areas), false, id);
  }
});

test("initial math fog reveals arrival cove and keeps distant landmarks hidden", () => {
  const areas = fogAreas("island", "M", []);
  assert.equal(isRevealed({ x: math.entry.x, y: math.entry.y }, areas), true);
  assert.equal(
    isRevealed({ x: math.positions.M10[0], y: math.positions.M10[1] }, areas),
    false,
  );
});

test("exploring reveals local territory without changing unrelated knowledge records", () => {
  const visited = ["P08"];
  const areas = fogAreas("island", "P", visited);
  const [x, y] = physics.positions.P08;
  assert.equal(isRevealed({ x, y }, areas), true);
  assert.deepEqual(visited, ["P08"]);
  const [farX, farY] = physics.positions.P03;
  assert.equal(isRevealed({ x: farX, y: farY }, areas), false);
  assert.equal(fogAreas("island", "C", ["C01"]).length, 2);
  assert.equal(fogAreas("island", "M", ["M01"]).length, 2);
});

test("world discovery and next landmark use durable discovery records", () => {
  const initial = fogAreas("world", "ALL", []);
  const discovered = fogAreas("world", "ALL", ["M06"], ["C"]);
  assert.equal(discovered.length, initial.length + 2);
  assert.equal(nextLandmark([]), "P01");
  assert.equal(nextLandmark(["P01", "P02"]), "P03");
  assert.equal(nextLandmark(physics.order), null);
  assert.equal(nextLandmark([], "M"), "M01");
  assert.equal(nextLandmark(["M01", "M02"], "M"), "M03");
  assert.equal(nextLandmark(math.order, "M"), null);
});
