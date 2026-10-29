const test = require("node:test");
const assert = require("node:assert/strict");
const Store = require("../src/progress-store.js");
const key = "knowledge-islands-v2";
test('unreadable initial JSON is protected even when storage has not changed since page load',()=>{
  const raw='{unfinished-record',records=new Map([[key,raw]]),storage={getItem:k=>records.get(k)??null,setItem:(k,v)=>records.set(k,v)};
  const initial={version:2,visited:[]},store=Store.create({storage,key,initial,raw});
  assert.throws(()=>store.save({...initial,visited:['P01']}));assert.equal(records.get(key),raw);assert.equal(records.size,1);
});
test('an explicit reset preserves one unreadable recovery copy and becomes a valid new baseline',()=>{
  const raw='{unfinished-record',records=new Map([[key,raw]]),storage={getItem:k=>records.get(k)??null,setItem:(k,v)=>records.set(k,v)};
  const initial={version:2,visited:[]},store=Store.create({storage,key,initial,raw});
  const result=store.save(initial,{replace:true});assert.equal(records.get(`${key}-unreadable`),raw);assert.ok(result.record.storageReset);
  assert.deepEqual(JSON.parse(records.get(key)).visited,[]);
  store.save({...result.record,visited:['M03']});assert.deepEqual(JSON.parse(records.get(key)).visited,['M03']);
});
test('ordinary saves cannot replace an unrecognized schema, but a confirmed reset can',()=>{
  for(const raw of ['[]','42','null','{"version":999,"important":"keep"}']){
    const records=new Map([[key,raw]]),storage={getItem:k=>records.get(k)??null,setItem:(k,v)=>records.set(k,v)},initial={version:2,visited:[]},store=Store.create({storage,key,initial,raw});
    assert.throws(()=>store.save(initial));assert.equal(records.get(key),raw);store.save(initial,{replace:true});assert.equal(records.get(`${key}-unreadable`),raw);assert.equal(JSON.parse(records.get(key)).version,2);
  }
});
test('a failed write can be retried without acknowledging or losing the pending session',()=>{
  const records=new Map([[key,JSON.stringify({version:2,visited:[]})]]);let full=true;
  const storage={getItem:k=>records.get(k)??null,setItem:(k,v)=>{if(full)throw new Error('quota');records.set(k,v);}},initial={version:2,visited:[]},store=Store.create({storage,key,initial,raw:records.get(key)}),pending={version:2,visited:['P01','M03']};
  assert.throws(()=>store.save(pending));assert.deepEqual(JSON.parse(records.get(key)).visited,[]);full=false;
  assert.deepEqual(store.save(pending).record.visited,['P01','M03']);
});
const fresh = () => ({
  version: 2,
  visited: [],
  storyVisited: [],
  enteredIslands: [],
  physicsScenarios: {},
  mathScenarios: {},
  chemistryScenarios: {},
  verified: {},
  experiments: {},
  fogEnabled: true,
});
function fixture(initial = fresh()) {
  const records = new Map([[key, JSON.stringify(initial)]]);
  let writes = 0;
  const storage = {
    getItem: (name) => records.get(name) ?? null,
    setItem: (name, value) => {
      records.set(name, value);
      writes++;
    },
  };
  const page = () => {
    const raw = storage.getItem(key),
      progress = JSON.parse(raw);
    return {
      progress,
      store: Store.create({ storage, key, initial: progress, raw }),
    };
  };
  return {
    storage,
    page,
    read: () => JSON.parse(storage.getItem(key)),
    writes: () => writes,
  };
}

test("closing an unchanged old page never replaces a newer experiment", () => {
  const f = fixture(),
    a = f.page(),
    b = f.page();
  a.progress.visited.push("P03");
  a.progress.physicsScenarios.P03 = { events: [{ action: "experiment" }] };
  a.store.save(a.progress);
  const written = f.writes(),
    expected = f.read();
  assert.deepEqual(b.store.save(b.progress).record, expected);
  assert.deepEqual(f.read(), expected);
  assert.equal(f.writes(), written);
});

test("pending edits in independent levels merge without losing either page", () => {
  const f = fixture(),
    a = f.page(),
    b = f.page();
  a.progress.physicsScenarios.P03 = { events: ["physics"] };
  a.progress.visited.push("P03");
  b.progress.mathScenarios.M03 = { events: ["math"] };
  b.progress.visited.push("M03");
  a.store.save(a.progress);
  const result = b.store.save(b.progress);
  assert.deepEqual(result.conflicts, []);
  assert.deepEqual(result.record.visited, ["P03", "M03"]);
  assert.deepEqual(f.read().physicsScenarios.P03.events, ["physics"]);
  assert.deepEqual(f.read().mathScenarios.M03.events, ["math"]);
  assert.equal(f.read().storageRevision, 2);
});

test("conflicting runs are not concatenated and the losing page has a recovery copy", () => {
  const f = fixture(),
    a = f.page(),
    b = f.page();
  a.progress.physicsScenarios.P03 = { events: ["newer"] };
  b.progress.physicsScenarios.P03 = { events: ["stale"] };
  a.store.save(a.progress);
  const expected = f.read(),
    result = b.store.save(b.progress);
  assert.deepEqual(result.conflicts, ["physicsScenarios.P03"]);
  assert.deepEqual(result.record, expected);
  assert.deepEqual(f.read(), expected);
  const backup = JSON.parse(f.storage.getItem(`${key}-conflict`));
  assert.deepEqual(backup.progress.physicsScenarios.P03.events, ["stale"]);
  assert.ok(backup.savedAt);
});

test("a simultaneous write at the same revision rebases both independent edits", () => {
  const f = fixture(),
    a = f.page(),
    b = f.page();
  a.progress.physicsScenarios.P03 = { events: ["physics"] };
  b.progress.mathScenarios.M03 = { events: ["math"] };
  const write = f.storage.setItem;
  let interleave = true;
  f.storage.setItem = (name, value) => {
    if (name === key && interleave) {
      interleave = false;
      b.store.save(b.progress);
    }
    write(name, value);
  };
  a.store.save(a.progress);
  assert.equal(f.read().mathScenarios.M03, undefined);
  // The storage notification observes the other writer's same-revision value.
  const result = b.store.save(b.progress);
  assert.deepEqual(result.conflicts, []);
  assert.deepEqual(f.read().physicsScenarios.P03.events, ["physics"]);
  assert.deepEqual(f.read().mathScenarios.M03.events, ["math"]);
});

test("an explicit reset clears records, while a stale reset cannot erase newer work", () => {
  const initial = fresh();
  initial.visited = ["P01"];
  initial.physicsScenarios.P01 = { bestStars: 3 };
  const f = fixture(initial),
    a = f.page(),
    b = f.page();
  a.progress.physicsScenarios.P02 = { events: ["experiment"] };
  a.store.save(a.progress);
  assert.deepEqual(b.store.save(fresh(), { replace: true }).conflicts, [
    "reset",
  ]);
  assert.ok(f.read().physicsScenarios.P02);
  const current = f.page();
  assert.deepEqual(
    current.store.save(fresh(), { replace: true }).conflicts,
    [],
  );
  assert.deepEqual(f.read().visited, []);
  assert.deepEqual(f.read().physicsScenarios, {});
});

test("a failed write does not advance the baseline and can be retried", () => {
  const f = fixture(),
    page = f.page();
  page.progress.visited.push("C01");
  const write = f.storage.setItem;
  f.storage.setItem = () => {
    throw new Error("quota");
  };
  assert.throws(() => page.store.save(page.progress), /quota/);
  f.storage.setItem = write;
  page.store.save(page.progress);
  assert.deepEqual(f.read().visited, ["C01"]);
});

test("an explicit reset cannot be undone by another page's pending experiment", () => {
  const f = fixture(),
    a = f.page(),
    b = f.page();
  a.progress.physicsScenarios.P03 = { events: ["pending"] };
  b.store.save(fresh(), { replace: true });
  const result = a.store.save(a.progress);
  assert.equal(result.resetChanged, true);
  assert.deepEqual(result.conflicts, ["reset"]);
  assert.deepEqual(f.read().physicsScenarios, {});
  assert.deepEqual(
    JSON.parse(f.storage.getItem(`${key}-conflict`)).progress.physicsScenarios
      .P03.events,
    ["pending"],
  );
});
