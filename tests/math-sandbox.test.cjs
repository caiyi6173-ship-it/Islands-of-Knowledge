const test = require("node:test");
const assert = require("node:assert/strict");
const G = require("../src/math-scenarios.js");

function complete(state, first = { ratio: "2:3" }) {
  state = G.act(state, "experiment", first, {
    followUp: true,
    comparison: !!state.last,
  });
  state = G.next(state);
  state = G.act(state, "experiment", { approximation: "7:5" });
  state = G.next(state);
  const records = [0, 1].map((round) =>
    state.log.findLastIndex((e) => e.round === round && e.success),
  );
  return G.act(
    state,
    "publish",
    {},
    { argument: { claim: "supported", scope: "tested", records } },
  );
}

test("continuous controls retain actual values, clamp bounds and reject malformed input", () => {
  assert.equal(G.cleanParams("M05", 0, { archA: -0.125 }).archA, -0.125);
  assert.equal(G.cleanParams("M05", 0, { archA: -99 }).archA, -0.5);
  assert.equal(G.cleanParams("M05", 0, { archA: NaN }).archA, -0.125);
  assert.equal(G.cleanParams("M08", 0, { boatSpeed: 99 }).boatSpeed, 10);
  assert.equal(G.cleanParams("M08", 0, { boatSpeed: -5 }).boatSpeed, 1);
  assert.equal(G.cleanParams("M09", 0, { deltaT: 0.2 }).deltaT, 0.2);
  assert.equal(G.cleanParams("M09", 0, { deltaT: 0.001 }).deltaT, 0.05);
  assert.equal(G.cleanParams("M09", 0, { deltaT: 99 }).deltaT, 5);
  assert.equal(G.cleanParams("M10", 0, { modelA: 0.05 }).modelA, 0.05);
  assert.equal(G.cleanParams("M10", 0, { modelA: NaN }).modelA, 0.05);
  assert.equal(
    G.test("M08", 0, { boatSpeed: 5, boatAngle: 126.87 }).success,
    true,
  );
  assert.equal(
    G.test("M08", 0, { boatSpeed: 5, boatAngle: 90 }).success,
    false,
  );
  assert.equal(G.test("M09", 0, { deltaT: 0.2 }).success, true);
  assert.equal(G.test("M09", 0, { deltaT: 4 }).success, false);
});

test("free model evaluation cannot consume resources or earn stars; only formal failure is penalized", () => {
  const s = G.fresh("M01", "assistant"),
    before = JSON.stringify(s);
  for (let i = 0; i < 100; i++)
    G.test("M01", 0, { ratio: i % 2 ? "2:3" : "5:7" });
  assert.equal(JSON.stringify(s), before);
  assert.equal(G.rating(s).count, 0);
  const fail = G.act(s, "experiment", { ratio: "5:7" });
  assert.deepEqual(fail.resources, { time: 7, tools: 3, trust: 1 });
  assert.equal(fail.evidence.length, 0);
  const pass = G.act(
    fail,
    "experiment",
    { ratio: "2:3" },
    { followUp: true, comparison: true },
  );
  assert.deepEqual(pass.resources, { time: 6, tools: 3, trust: 2 });
  assert.equal(pass.evidence[0].points, 2);
});

test("stars require a completed discovery and persist as a best across worse replays", () => {
  const first = complete(G.fresh("M01", "assistant"));
  assert.equal(G.rating(first).count, 2);
  let compare = G.act(G.fresh("M01", "assistant"), "experiment", {
    ratio: "5:7",
  });
  compare = complete(compare);
  assert.equal(G.rating(compare).count, 3);
  assert.equal(compare.bestStars, 3);
  assert.equal(G.restore("M01", compare).bestStars, 3);
  const replay = complete(G.fresh("M01", "assistant", compare));
  assert.equal(G.rating(replay).count, 2);
  assert.equal(replay.bestStars, 3);
  assert.equal(G.fresh("M01", "assistant", compare).bestStars, 3);
});

test("one bounded emergency supply is replayable, does not restore trust, and limits this run to two stars", () => {
  let s = G.fresh("M01", "assistant");
  assert.equal(G.resupply(s), null);
  for (let i = 0; i < 4; i++)
    s = G.act(s, "experiment", { ratio: "5:7" }, { followUp: true });
  // A remaining fair-comparison discount can still reuse equipment.
  assert.equal(G.canResupply(s), false);
  s = G.act(
    s,
    "experiment",
    { ratio: "2:3" },
    { followUp: true, comparison: true },
  );
  assert.equal(G.canResupply(s), true);
  const trust = s.resources.trust,
    before = { ...s.resources };
  s = G.resupply(s);
  assert.deepEqual(s.resources, {
    time: before.time + 4,
    tools: before.tools + 2,
    trust,
  });
  assert.equal(G.resupply(s), null);
  const restored = G.restore("M01", s);
  assert.deepEqual(restored.resources, s.resources);
  assert.equal(restored.supplies, 1);
  s = G.next(s);
  s = G.act(s, "experiment", { approximation: "7:5" });
  s = G.next(s);
  s = G.act(s, "publish");
  assert.equal(s.cleared, true);
  assert.equal(G.rating(s).count, 2);
  assert.equal(s.bestStars, 2);
});

test("replay ignores forged resource amounts and repeated supply events", () => {
  const s = G.fresh("M01", "assistant");
  s.resources.time = 999;
  s.resources.tools = 999;
  s.supplies = 1;
  s.events.push({ type: "supply" });
  const restored = G.restore("M01", s);
  assert.deepEqual(restored.resources, { time: 9, tools: 4, trust: 2 });
  assert.equal(restored.supplies, 0);
  assert.equal(restored.events.length, 0);
});

test("using supply alone limits a flawless controlled run without erasing its evidence", () => {
  let s = G.fresh("M01", "assistant");
  for (let i = 0; i < 4; i++)
    s = G.act(s, "experiment", { ratio: "2:3" }, { followUp: true });
  s = G.act(
    s,
    "experiment",
    { ratio: "1:2" },
    { followUp: true, comparison: true },
  );
  assert.equal(G.canResupply(s), true);
  s = G.resupply(s);
  s = G.next(s);
  s = G.act(s, "experiment", { approximation: "7:5" });
  s = G.next(s);
  s = G.act(s, "publish");
  const rating = G.rating(s);
  assert.equal(rating.failures, 0);
  assert.equal(rating.fair, true);
  assert.equal(rating.complete, true);
  assert.equal(rating.count, 2);
});
