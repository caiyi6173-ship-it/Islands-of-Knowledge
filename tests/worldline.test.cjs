const test = require('node:test');
const assert = require('node:assert/strict');
const W = require('../src/worldline.js');
const D = require('../src/worldline-data.js');
const Store = require('../src/progress-store.js');
const games = { P: require('../src/physics-scenarios.js'), M: require('../src/math-scenarios.js'), C: require('../src/chemistry-scenarios.js') };
const fresh = () => ({ version:2, ...W.fields(), physicsScenarios:{}, mathScenarios:{}, chemistryScenarios:{}, expDone:{}, visited:[] });
const markers = ids => W.reconcile({ ...fresh(), expDone:Object.fromEntries(ids.map(id=>['story-'+id,true])) }, games);
function complete(id, params) {
  const game = games[id[0]];
  let state = game.fresh(id, 'assistant');
  params.forEach(p=>{ state=game.next(game.act(state,'experiment',p)); });
  return game.act(state,'publish');
}
test('postal roster has all thirty tasks, five ordered chapters and fifteen main tasks',()=>{
  assert.equal(Object.keys(D.tasks).length,30);
  assert.equal(new Set(D.chapters.flatMap(c=>[...c.main,...c.side])).size,30);
  for(const c of D.chapters) {
    assert.equal(c.main.length,3); assert.equal(c.side.length,3);
    assert.deepEqual(c.main.map(id=>id[0]).sort(),['C','M','P']);
  }
  assert.ok(Object.isFrozen(D.chapters[0].main));
});
test('visits and quiz verification do not manufacture research artifacts',()=>{
  let p={...fresh(), verified:{P01:true}};
  assert.equal(W.encounter(p,'P01'),'first');
  p=W.visit(p,'P01'); assert.equal(W.encounter(p,'P01'),'revisit');
  p=W.reconcile(p,games);
  assert.deepEqual(p.mailArtifacts,{}); assert.equal(W.status(p,'R01').ready,false);
});
test('bare old completion is respected without numbers, stars or automatic delivery',()=>{
  const p=markers(['P01','C01','M03']);
  assert.equal(W.status(p,'R01').ready,true);
  assert.equal(p.mailArtifacts.P01.revisions[0].source,'legacy-completion');
  assert.deepEqual(p.mailArtifacts.P01.revisions[0].records,[]);
  assert.equal(p.mailArtifacts.P01.bestStars,0);
  assert.deepEqual(p.mailDeliveries,{});
  assert.deepEqual(W.reconcile(p,games),p);
});
test('earlier Physics and Math completion containers retain their valid achievements',()=>{
  const p=W.reconcile({...fresh(),
    physicsLevels:{P01:{version:3,steps:[0,1],letterSent:true},P02:{version:3,steps:[0],letterSent:true}},
    mathStories:{M03:{version:4,steps:[0,1],cleared:true}}},games);
  assert.equal(p.mailArtifacts.P01.complete,true);assert.equal(p.mailArtifacts.M03.complete,true);
  assert.equal(p.mailArtifacts.P02,undefined);
  assert.deepEqual(p.mailArtifacts.M03.revisions[0].records,[]);
});
test('current scenario artifacts keep actual records and their legacy scoring semantics',()=>{
  const record=complete('P01',[{shape:'bowl'},{shape:'wide'}]);
  const p=W.reconcile({...fresh(),physicsScenarios:{P01:record}},games);
  const r=p.mailArtifacts.P01.revisions[0];
  assert.equal(r.records.length,2); assert.deepEqual(r.records[1].params,{shape:'wide'});
  assert.equal(r.records[0].recordValid,null); // new validity was not retroactively assigned
  assert.deepEqual(r.records[1].readings,record.log[1].result.readings);
  assert.deepEqual(W.reconcile(JSON.parse(JSON.stringify(p)),games),p);
});
test('restart and failed replay preserve the valid archived page and delivery references',()=>{
  const good=complete('P01',[{shape:'bowl'},{shape:'wide'}]);
  let p=markers(['C01','M03']); p.physicsScenarios.P01=good;
  p=W.reconcile(p,games); p=W.deliver(p,'R01').progress;
  const artifact=JSON.stringify(p.mailArtifacts.P01), delivery=JSON.stringify(p.mailDeliveries.R01);
  p=W.rememberAttempt(p,'P01',{...good,researchRunId:'old-attempt'});
  p.physicsScenarios.P01=games.P.act(games.P.fresh('P01','assistant',good),'experiment',{shape:'lump'});
  p=W.reconcile(p,games);
  assert.equal(JSON.stringify(p.mailArtifacts.P01),artifact);
  assert.equal(JSON.stringify(p.mailDeliveries.R01),delivery);
  assert.equal(p.researchHistory['old-attempt'].record.ending,'breakthrough');
  assert.equal(W.encounter(p,'P01'),'delivered');
});
test('premature and duplicate deliveries have no effect; all five can use precompleted main work',()=>{
  let p=markers(D.chapters.flatMap(c=>c.main));
  const premature=W.deliver(p,'R05'); assert.equal(premature.changed,false); assert.equal(premature.progress,p);
  for(const c of D.chapters) {
    assert.equal(W.current(p).id,c.id); assert.equal(W.status(p,c.id).ready,true);
    p=W.deliver(p,c.id).progress;
    const duplicate=W.deliver(p,c.id); assert.equal(duplicate.changed,false); assert.equal(duplicate.progress,p);
    assert.equal(Object.keys(p.mailDeliveries[c.id].artifacts).length,3);
  }
  assert.equal(W.current(p),null); assert.equal(p.mailFacts.formalDesk,true);
  assert.equal(Object.keys(p.mailArtifacts).length,15);
});
test('late optional work does not replay the chapter or change its receipt',()=>{
  let p=W.deliver(markers(['P01','C01','M03']),'R01').progress;
  const receipt=JSON.stringify(p.mailDeliveries.R01);
  p.expDone['story-C05']=true; p=W.reconcile(p,games);
  assert.equal(p.mailArtifacts.C05.complete,true);
  assert.equal(JSON.stringify(p.mailDeliveries.R01),receipt);
});
test('malformed postal fields and future receipts cannot bypass ordered delivery',()=>{
  const p=markers(['P01','C01','M03']);
  p.mailArtifacts.corrupt=null;p.mailArtifacts.M02={complete:true};
  p.mailDeliveries.R05={id:'mail-v1:R05',chapter:'R05',artifacts:{}};
  const normalized=W.normalize(p);
  assert.equal(Object.keys(normalized.mailArtifacts).length,3);
  assert.deepEqual(normalized.mailDeliveries,{});assert.equal(W.current(normalized).id,'R01');
  assert.doesNotThrow(()=>W.reconcile({...p,mailFacts:[],researchRuns:null},games));
});
test('independent postal artifacts merge, duplicate chapter delivery coalesces and reset wins',()=>{
  const key='test', data=new Map(), storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};
  const initial=fresh(); data.set(key,JSON.stringify(initial));
  const page=()=>{const raw=data.get(key),p=JSON.parse(raw);return{p,store:Store.create({storage,key,raw,initial:p})};};
  const a=page(),b=page(); a.p=markers(['P01']); b.p=markers(['C01','M03']);
  a.store.save(a.p); const merged=b.store.save(b.p);
  assert.deepEqual(merged.conflicts,[]); assert.equal(Object.keys(merged.record.mailArtifacts).length,3);
  const c=page(),d=page(); c.p=W.deliver(c.p,'R01').progress;d.p=W.deliver(d.p,'R01').progress;
  c.store.save(c.p); const same=d.store.save(d.p); assert.deepEqual(same.conflicts,[]);
  assert.equal(Object.keys(same.record.mailDeliveries).length,1);
  const stale=page(),reset=page();reset.store.save(fresh(),{replace:true});
  stale.p.mailFacts['visited-P02']=true;
  assert.deepEqual(stale.store.save(stale.p).conflicts,['reset']);
  assert.deepEqual(JSON.parse(data.get(key)).mailArtifacts,{});
});
