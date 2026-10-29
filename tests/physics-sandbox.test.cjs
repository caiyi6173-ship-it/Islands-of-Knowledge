const test = require("node:test");
const assert = require("node:assert/strict");
const G = require("../src/physics-scenarios.js");

function complete(state, first = { shape: "bowl" }) {
  state = G.act(state, "experiment", first, {
    followUp: true,
    comparison: !!state.last,
  });
  state = G.next(state);
  state = G.act(state, "experiment", { shape: "wide" });
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
  assert.equal(G.cleanParams("P03", 1, { speed: 1.11 }).speed, 1.11);
  assert.equal(G.cleanParams("P03", 1, { speed: 999 }).speed, 1.65);
  assert.equal(G.cleanParams("P03", 1, { speed: NaN }).speed, 0.6);
  assert.equal(G.cleanParams("P03", 1, { speed: "1.1" }).speed, 0.6);
  assert.equal(G.test("P03", 1, { speed: 1.11 }).success, true);
  assert.equal(G.test("P03", 1, { speed: 1.65 }).success, false);
  assert.equal(G.test("P05", 1, { slits: "two", gap: 0.76 }).success, true);
  assert.equal(G.test("P07", 0, { frequency: 2.9 }).success, false);
  assert.equal(
    G.test("P10", 1, { color: "blue", intensity: 5 }).success,
    false,
  );
});
test("free model evaluation cannot consume resources or earn stars; only formal failure is penalized", () => {
  const s = G.fresh("P01", "assistant"),
    before = JSON.stringify(s);
  for (let i = 0; i < 100; i++)
    G.test("P01", 0, { shape: i % 2 ? "bowl" : "lump" });
  assert.equal(JSON.stringify(s), before);
  assert.equal(G.rating(s).count, 0);
  const fail = G.act(s, "experiment", { shape: "lump" });
  assert.deepEqual(fail.resources, { time: 7, tools: 3, trust: 1 });
  assert.equal(fail.evidence.length, 0);
  const pass = G.act(
    fail,
    "experiment",
    { shape: "bowl" },
    { followUp: true, comparison: true },
  );
  assert.deepEqual(pass.resources, { time: 6, tools: 3, trust: 2 });
  assert.equal(pass.evidence[0].points, 2);
});
test("stars require a completed discovery and persist as a best across worse replays", () => {
  const first = complete(G.fresh("P01", "assistant"));
  assert.equal(G.rating(first).count, 2);
  let compare = G.act(G.fresh("P01", "assistant"), "experiment", {
    shape: "lump",
  });
  compare = complete(compare);
  assert.equal(G.rating(compare).count, 3);
  assert.equal(compare.bestStars, 3);
  assert.equal(G.restore("P01", compare).bestStars, 3);
  const replay = complete(G.fresh("P01", "assistant", compare));
  assert.equal(G.rating(replay).count, 2);
  assert.equal(replay.bestStars, 3);
  assert.equal(G.fresh("P01", "assistant", compare).bestStars, 3);
});
test("one bounded emergency supply is replayable, does not restore trust, and limits this run to two stars", () => {
  let s = G.fresh("P01", "assistant");
  assert.equal(G.resupply(s), null);
  for (let i = 0; i < 4; i++)
    s = G.act(s, "experiment", { shape: "lump" }, { followUp: true });
  // A remaining fair-comparison discount can still reuse equipment.
  assert.equal(G.canResupply(s), false);
  s = G.act(
    s,
    "experiment",
    { shape: "bowl" },
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
  const restored = G.restore("P01", s);
  assert.deepEqual(restored.resources, s.resources);
  assert.equal(restored.supplies, 1);
  s = G.next(s);
  s = G.act(s, "experiment", { shape: "wide" });
  s = G.next(s);
  s = G.act(s, "publish");
  assert.equal(s.cleared, true);
  assert.equal(G.rating(s).count, 2);
  assert.equal(s.bestStars, 2);
});
test("replay ignores forged resource amounts and repeated supply events", () => {
  const s = G.fresh("P01", "assistant");
  s.resources.time = 999;
  s.resources.tools = 999;
  s.supplies = 1;
  s.events.push({ type: "supply" });
  const restored = G.restore("P01", s);
  assert.deepEqual(restored.resources, { time: 9, tools: 4, trust: 2 });
  assert.equal(restored.supplies, 0);
  assert.equal(restored.events.length, 0);
});
test("using supply alone limits a flawless controlled run without erasing its evidence", () => {
  let s = G.fresh("P01", "assistant");
  for (let i = 0; i < 4; i++)
    s = G.act(s, "experiment", { shape: "bowl" }, { followUp: true });
  s = G.act(
    s,
    "experiment",
    { shape: "wide" },
    { followUp: true, comparison: true },
  );
  assert.equal(G.canResupply(s), true);
  s = G.resupply(s);
  s = G.next(s);
  s = G.act(s, "experiment", { shape: "wide" });
  s = G.next(s);
  s = G.act(s, "publish");
  const rating = G.rating(s);
  assert.equal(rating.failures, 0);
  assert.equal(rating.fair, true);
  assert.equal(rating.complete, true);
  assert.equal(rating.count, 2);
});
