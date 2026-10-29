const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const {
  flight,
  matchesCurve,
  validateMolecule,
  templates,
} = require("../src/science.js");

test("projectile satisfies launch, ground, and descending hoop intersection", () => {
  const f = flight({ v0: 11.8, angle: 55, g: 9.8 });
  assert.deepEqual(f.at(0), { x: 0, y: 1.5 });
  assert.ok(Math.abs(f.at(f.duration).y) < 1e-10);
  assert.ok(Math.abs(f.at(f.crossingTime).y - 3) < 1e-10);
  assert.ok(f.vy - 9.8 * f.crossingTime < 0);
  assert.equal(f.hit, true);
  assert.equal(flight({ v0: 4, angle: 10, g: 9.8 }).hit, false);
});
test("lower gravity increases maximum height and flight duration", () => {
  const earth = flight({ v0: 12, angle: 50, g: 9.8 }),
    moon = flight({ v0: 12, angle: 50, g: 1.62 });
  assert.ok(moon.peak > earth.peak);
  assert.ok(moon.duration > earth.duration);
  assert.throws(() => flight({ v0: 12, angle: 50, g: 0 }), RangeError);
});
test("curve matching includes degenerate and invalid parameter cases", () => {
  assert.equal(matchesCurve({ a: 0.5, h: 2, k: 1 }), true);
  assert.equal(matchesCurve({ a: 0, h: 2, k: 1 }), false);
  assert.equal(matchesCurve({ a: NaN, h: 2, k: 1 }), false);
  assert.equal(matchesCurve({ a: 0.5, h: -2, k: 1 }), false);
});
test("molecule validation checks chemistry graph rather than placement order", () => {
  templates.forEach((template, index) => {
    const atoms = [
      { id: 18, el: template.center },
      ...Array.from({ length: template.hydrogens }, (_, i) => ({
        id: i + 1,
        el: "H",
      })),
    ];
    const bonds = atoms.slice(1).map((a) => [a.id, 18]);
    assert.equal(validateMolecule(atoms, bonds, index).ok, true);
    assert.equal(
      validateMolecule([...atoms, { id: 99, el: "H" }], bonds, index).ok,
      false,
    );
    assert.equal(validateMolecule(atoms, bonds.slice(1), index).ok, false);
    const wrong = [...bonds];
    wrong[0] = [1, 2];
    assert.equal(validateMolecule(atoms, wrong, index).ok, false);
  });
});
test("content has thirty unique nodes, complete quiz coverage, valid relations and routes", () => {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(
    fs.readFileSync(require.resolve("../src/content.js"), "utf8"),
    sandbox,
  );
  const { NODES, EDGES, QUIZ, ROUTES } = sandbox.window.AtlasContent;
  const ids = new Set(NODES.map((n) => n.id));
  assert.equal(ids.size, 30);
  for (const subject of ["P", "M", "C"]) {
    assert.equal(NODES.filter((n) => n.s === subject).length, 10);
    assert.ok(
      EDGES.filter(
        (e) => e.from.startsWith(subject) && e.to.startsWith(subject),
      ).length >= 10,
    );
  }
  assert.ok(EDGES.filter((e) => e.cross).length >= 6);
  for (const node of NODES) assert.ok(QUIZ[node.id]);
  for (const edge of EDGES) {
    assert.ok(ids.has(edge.from));
    assert.ok(ids.has(edge.to));
    assert.ok(edge.label);
  }
  for (const route of ROUTES)
    for (const id of route.path) assert.ok(ids.has(id));
});
