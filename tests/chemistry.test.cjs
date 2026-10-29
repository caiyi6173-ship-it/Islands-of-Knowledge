const { test } = require("node:test");
const assert = require("node:assert/strict");
const D = require("../src/chemistry-data.js");
const G = require("../src/chemistry-engine.js");
const A = require("../src/chemistry-art.js");
const E = require("../src/exploration.js");
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
    { first: 1, second: 3, units: 2 },
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
const variations = {
  C01: { instrument: "density" },
  C02: { oxygen: 2 },
  C03: { outer: 2 },
  C04: { pairs: 2 },
  C05: { units: 2 },
  C06: { angle: 110 },
  C07: { pull: 1.2 },
  C08: { gas: 5 },
  C09: { electrons: 1 },
  C10: { bridge: "off" },
};
function complete(id, compare = false, record = G.fresh(id)) {
  let s = record;
  for (let round = 0; round < 2; round++) {
    s = G.act(s, { type: "record", round, params: solutions[id][round] });
    if (compare && !round)
      s = G.act(s, {
        type: "record",
        round,
        params: { ...solutions[id][0], ...variations[id] },
      });
    s = G.act(s, { type: "advance" });
  }
  return G.act(s, {
    type: "conclude",
    claim: "supported",
    scope: "tested",
    evidence: s.records.flatMap((r, i) => (r.success ? [i] : [])),
  });
}
for (const level of D.levels) {
  for (let round = 0; round < 2; round++)
    test(`${level.id} task ${round + 1}: genuine model accepts supported conditions and rejects starting setup`, () => {
      const good = G.evaluate(level.id, round, solutions[level.id][round]);
      assert.equal(good.success, true);
      assert.equal(G.evaluate(level.id, round, {}).success, false);
      assert.equal(good.readings.length, 3);
      assert.ok(good.detail.length > 12);
    });
  test(`${level.id}: evidence, stars and archive survive replay and restarting`, () => {
    const s = complete(level.id, true);
    assert.equal(s.phase, "complete");
    assert.equal(s.stars, 3);
    assert.deepEqual(G.restore(level.id, JSON.parse(JSON.stringify(s))), s);
    assert.equal(G.isCleared(s), true);
    const restarted = G.fresh(level.id, s);
    assert.equal(restarted.phase, "lab");
    assert.equal(restarted.records.length, 0);
    assert.equal(restarted.bestStars, 3);
    assert.equal(G.isCleared(restarted), true);
    const replay = G.restore(level.id, restarted);
    assert.equal(replay.bestStars, 3);
    assert.equal(G.isCleared(replay), true);
  });
}
test("one-variable comparison is free once per round; duplicate settings never manufacture evidence", () => {
  let s = G.act(G.fresh("C05"), {
    type: "record",
    round: 0,
    params: solutions.C05[0],
  });
  assert.equal(s.reagents, 5);
  assert.equal(G.offer(s, solutions.C05[0]).allowed, false);
  const changed = { ...solutions.C05[0], units: 2 };
  assert.equal(G.offer(s, changed).cost, 0);
  s = G.act(s, { type: "record", round: 0, params: changed });
  assert.equal(s.reagents, 5);
  assert.deepEqual(s.comparisons, [0]);
  assert.equal(G.offer(s, { ...changed, units: 3 }).cost, 1);
  assert.equal(
    G.act(s, { type: "record", round: 0, params: changed }).records.length,
    2,
  );
});
test("two rounds of successful actual evidence and bounded claim are all necessary", () => {
  let s = G.fresh("C04");
  assert.equal(G.act(s, { type: "advance" }).round, 0);
  s = complete("C04");
  const unfinished = G.restore("C04", { ...s, events: s.events.slice(0, -1) });
  assert.equal(unfinished.phase, "conclusion");
  for (const event of [
    { claim: "unsupported", scope: "tested", evidence: [0, 1] },
    { claim: "supported", scope: "universal", evidence: [0, 1] },
    { claim: "supported", scope: "tested", evidence: [0, 0, 999] },
  ]) {
    const bad = G.act(unfinished, { type: "conclude", ...event });
    assert.equal(bad.cleared, false);
    assert.equal(bad.failures, 1);
    assert.equal(bad.trust, unfinished.trust - 1);
  }
});
test("supplement is once only, costs stars, and cannot overwrite a previous best", () => {
  let s = G.fresh("C05");
  // Distinct wrong settings consume real trial allowances, including one free comparison.
  const wrong = [];
  for (let a = 1; a <= 4; a++)
    for (let b = 1; b <= 4; b++)
      if (a !== 2 || b !== 1) wrong.push({ first: a, second: b, units: 1 });
  for (const params of wrong) {
    if (s.reagents === 0) break;
    s = G.act(s, { type: "record", round: 0, params });
  }
  assert.equal(s.reagents, 0);
  assert.equal(s.trust, 0);
  s = G.act(s, { type: "supply" });
  assert.equal(s.reagents, 4);
  assert.equal(s.supplied, true);
  assert.equal(G.act(s, { type: "supply" }).reagents, 4);
  s = complete("C05", false, s);
  assert.equal(s.cleared, true);
  assert.equal(s.stars, 1);
  const best = complete("C05", true);
  let restart = G.fresh("C05", best);
  restart = complete("C05", false, restart);
  assert.equal(restart.stars, 2);
  assert.equal(restart.bestStars, 3);
  assert.equal(G.restore("C05", restart).bestStars, 3);
});
test("saved booleans, stars, fabricated results and out-of-order events do not count as discoveries", () => {
  assert.equal(
    G.isCleared({ version: 1, id: "C01", cleared: true, bestStars: 3 }),
    false,
  );
  const malformed = {
    version: 1,
    id: "C01",
    events: [
      { type: "advance" },
      {
        type: "conclude",
        claim: "supported",
        scope: "tested",
        evidence: [0, 1],
      },
      {
        type: "record",
        round: 0,
        params: { instrument: "eye", identity: "salt" },
        success: true,
      },
      { type: "record", round: 1, params: solutions.C01[1] },
    ],
    archive: [
      {
        type: "conclude",
        claim: "supported",
        scope: "tested",
        evidence: [0, 1],
      },
    ],
  };
  const s = G.restore("C01", malformed);
  assert.equal(s.round, 0);
  assert.equal(s.records.length, 1);
  assert.equal(s.records[0].success, false);
  assert.equal(G.isCleared(s), false);
});
test("chemistry laws preserve scale, charge and explicit model boundaries", () => {
  assert.equal(G.evaluate("C02", 1, { carbon: 4, oxygen: 8 }).success, true);
  assert.equal(G.evaluate("C04", 1, { pairs: 1, lone: 5 }).success, false);
  assert.equal(G.evaluate("C07", 0, { angle: 180, pull: 0 }).success, false);
  assert.equal(
    G.evaluate("C07", 0, { angle: 180, pull: 2 }).model.net < 1e-8,
    true,
  );
  assert.equal(
    G.evaluate("C08", 0, { closed: "open", gas: 6 }).model.retained,
    94,
  );
  assert.equal(
    G.evaluate("C08", 0, { closed: "closed", gas: 6 }).model.retained,
    100,
  );
  assert.equal(
    G.evaluate("C08", 1, { hydrogen: 4, oxygen: 2, water: 4 }).success,
    true,
  );
  const a = G.evaluate("C09", 1, { charge: 386, valence: 2 }).model.mass,
    b = G.evaluate("C09", 1, { charge: 772, valence: 2 }).model.mass;
  assert.ok(Math.abs(b / a - 2) < 1e-12);
  assert.ok(Math.abs(a - 127.1) < 0.1);
  for (const p of [
    { wire: "off", bridge: "on" },
    { wire: "on", bridge: "off" },
  ])
    assert.equal(G.evaluate("C10", 0, p).model.current, 0);
  assert.equal(
    G.evaluate("C10", 1, {
      wire: "on",
      bridge: "on",
      direction: "ZnCu",
      load: 45,
    }).model.current,
    20,
  );
});
test("each chemical island landmark has its own geography, portrait and instrument", () => {
  assert.equal(Object.keys(E.chemistry.positions).length, 10);
  assert.equal(
    new Set(Object.values(E.chemistry.positions).map(String)).size,
    10,
  );
  assert.equal(E.nextLandmark([], "C"), "C01");
  assert.equal(E.nextLandmark(E.chemistry.order, "C"), null);
  assert.deepEqual(E.colorAreas("island", "C", []), { full: false, areas: [] });
  assert.equal(
    E.colorAreas("island", "C", ["C06"]).areas[0].x,
    E.chemistry.positions.C06[0],
  );
  assert.equal(E.colorAreas("island", "C", E.chemistry.order).full, true);
  assert.equal(
    E.isRevealed({ x: 1320, y: 710 }, E.fogAreas("island", "C", [])),
    false,
  );
  assert.equal(
    E.isRevealed({ x: 1320, y: 710 }, E.fogAreas("island", "C", ["C10"])),
    true,
  );
  assert.equal(new Set(D.levels.map((l) => A.landmark(l.id))).size, 10);
  for (const l of D.levels) {
    assert.ok(A.portrait(l.id).includes('viewBox="0 0 40 44"'));
    assert.ok(l.history.length > 50);
    assert.ok(l.sources.every(([, url]) => url.startsWith("https://")));
    assert.ok(A.scene(l.id).includes("<title>"));
  }
  assert.equal(
    A.scene("C06", 0, solutions.C06[0]).includes("data-chem-angle"),
    false,
  );
  assert.equal(
    A.scene("C06", 0, solutions.C06[0], { live: true }).includes(
      "data-chem-angle",
    ),
    true,
  );
});
test("invalid parameter payloads fall back without inventing successful records", () => {
  for (const malformed of [null, [], false, "salt"]) {
    assert.deepEqual(G.params("C01", 0, malformed), G.params("C01", 0));
    assert.equal(G.evaluate("C01", 0, malformed).success, false);
  }
  const s = G.restore("C01", {
    version: 1,
    id: "C01",
    events: [{ type: "record", round: 0, params: null }],
  });
  assert.equal(s.records.length, 1);
  assert.equal(s.records[0].success, false);
  assert.equal(s.reagents, 5);
});
