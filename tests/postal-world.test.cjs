const test=require('node:test');
const assert=require('node:assert/strict');
const World=require('../src/postal-world.js');
const W=require('../src/worldline.js');
const D=require('../src/worldline-data.js');
const Exploration=require('../src/exploration.js');
const games={P:require('../src/physics-scenarios.js'),M:require('../src/math-scenarios.js'),C:require('../src/chemistry-scenarios.js')};
const empty=()=>({...W.fields(),enteredIslands:[],expDone:{}});
function artifacts(ids) {
  return W.reconcile({...empty(),expDone:Object.fromEntries(ids.map(id=>['story-'+id,true]))},games);
}
function through(chapter) {
  let p=artifacts(D.chapters.flatMap(c=>c.main));
  for(const c of D.chapters.slice(0,chapter))p=W.deliver(p,c.id).progress;
  return p;
}
test('three named stations remain distinct from the chemistry entrance lab',()=>{
  assert.deepEqual(Object.keys(World.stations),['P','C','M']);
  assert.equal(World.stations.C.name,'标本港观测窗口');assert.equal(World.stations.C.level,'C01');
  assert.equal(new Set(Object.values(World.stations).map(s=>[s.x,s.y].join())).size,3);
  for(const s of Object.values(World.stations))assert.ok(s.x>0&&s.x<1600&&s.y>0&&s.y<1000);
});
test('station visits and companion greetings reveal arrival but never produce research or shipping',()=>{
  const original=empty();let p=World.visit(original,'C').progress;p=World.meet(p,'xiaohe').progress;
  assert.deepEqual(p.enteredIslands,['C']);assert.ok(p.postalVisits.C&&p.postalVisits['companion-xiaohe']);
  assert.deepEqual(p.mailArtifacts,{});assert.deepEqual(p.mailDeliveries,{});assert.deepEqual(original.postalVisits,{});
  assert.equal(World.snapshot(p).phase,0);assert.equal(Exploration.colorAreas('world','ALL',[]).full,false);
  assert.equal(World.visit(p,'C').changed,false);assert.equal(World.meet(p,'xiaohe').changed,false);
});
test('precompleted research enables an errand without prelighting the postal route',()=>{
  const p=artifacts(['P01','C01','M03']),s=World.snapshot(p);
  assert.equal(s.ready,true);assert.equal(s.phase,0);assert.equal(s.tasks.filter(t=>t.complete).length,3);
  assert.ok(s.places.every(p=>p.localComplete));assert.ok(s.routes.every(r=>r.state==='planned'));
  assert.equal(s.owned.length,1);assert.equal(s.receipts.length,0);assert.equal(s.formalDesk,false);
});
test('daytime delivery, partial night watch and the final circuit are separate world facts',()=>{
  for(let n=0;n<=5;n++) {
    const s=World.snapshot(through(n));assert.equal(s.phase,n);assert.equal(s.receipts.length,n);
    assert.equal(s.nightWatch,n>=2);assert.equal(s.fullCircuit,n===5);assert.equal(s.formalDesk,n===5);
    assert.equal(s.places.find(p=>p.id==='M').night,n===5);
    assert.equal(s.routes[0].state,n===0?'planned':n===1?'day':n===5?'circuit':'night');
    assert.ok(s.routes.slice(1).every(r=>r.state===(n===5?'circuit':n>=3?'exchange':'planned')));
  }
});
test('invalid future receipts, visit flags and a forged formal desk do not make a circuit',()=>{
  const p=through(0);p.mailFacts={formalDesk:true,'delivered-R05':true};
  p.postalVisits={P:true,C:true,M:true};p.mailDeliveries.R05={id:'mail-v1:R05',chapter:'R05',artifacts:{}};
  const s=World.snapshot(p);assert.equal(s.phase,0);assert.equal(s.formalDesk,false);assert.equal(s.fullCircuit,false);
});
test('only actually received keepsakes can be placed and the choice persists into later chapters',()=>{
  let p=through(1);const original=JSON.stringify(p);
  assert.equal(World.decorate(p,'return-box').changed,false);assert.equal(JSON.stringify(p),original);
  p=World.decorate(p,'box-sketch').progress;assert.equal(World.snapshot(p).decoration.id,'box-sketch');
  p=W.deliver(p,'R02').progress;assert.equal(World.snapshot(p).decoration.id,'box-sketch');
  assert.equal(World.decorate(p,'box-sketch').changed,false);assert.equal(World.snapshot(p).owned.length,3);
  p.postalDesk.item='unearned';assert.equal(World.snapshot(p).decoration.id,'shift-tag');
});
test('first greetings and revisits retain the actual chapter state without asking for imaginary failures',()=>{
  let p=empty();assert.equal(World.dialogue(p,'alan').first,true);
  p=World.meet(p,'alan').progress;assert.equal(World.dialogue(p,'alan').first,false);
  p={...through(1),postalVisits:p.postalVisits};
  assert.ok(World.dialogue(p,'alan').text.includes('早送到了'));assert.ok(World.dialogue(p,'alan').action.includes('四箱已经送到'));
  p.physicsScenarios={P01:games.P.fresh('P01','assistant')};p=W.reconcile(p,games);
  assert.ok(World.dialogue(p,'alan').text.includes('早送到了'));assert.equal(World.snapshot(p).phase,1);
  const ending=World.dialogue(through(5),'alan');assert.ok(ending.text.includes('吃饭'));assert.ok(ending.action.includes('回家'));
  assert.ok(!World.dialogue(through(5),'joe').text.includes('先借这个桌角'));
});
test('all four companions have initial, returning and post-chapter daily life',()=>{
  for(const id of Object.keys(World.companions)) {
    const actions=new Set();
    for(let n=0;n<=5;n++) {
      const d=World.dialogue(through(n),id);assert.ok(d.name&&d.role&&d.text&&d.action);actions.add(d.action);
    }
    assert.equal(actions.size,6);
  }
});
test('completed night mail does not restore unexplored land and all discoveries do not auto-deliver',()=>{
  const main=D.chapters.flatMap(c=>c.main),end=World.snapshot(through(5));
  assert.equal(end.fullCircuit,true);assert.equal(Exploration.colorAreas('world','ALL',main).full,false);
  const all=World.snapshot(artifacts(Object.keys(D.tasks)));
  assert.equal(all.phase,0);assert.equal(all.receipts.length,0);assert.equal(all.ready,true);
  assert.equal(Exploration.colorAreas('world','ALL',Object.keys(D.tasks)).full,true);
});
test('bare old completions leave neutral source text and never invent a comparison in letter 00',()=>{
  const s=World.snapshot(through(1));assert.ok(s.letter);assert.ok(!s.letter.text.includes('6.0'));
  assert.ok(!s.letter.text.includes('换过原点'));assert.ok(Object.values(s.artifacts).every(a=>a.revisions[0].records.length===0));
});
test('optional research and world visits do not award later chapter keepsakes',()=>{
  let p=artifacts(D.chapters.flatMap(c=>c.side));
  for(const id of Object.keys(World.stations))p=World.visit(p,id).progress;
  const s=World.snapshot(p);assert.equal(s.owned.length,1);assert.equal(s.phase,0);assert.equal(s.ready,false);
});
test('malformed optional visit and desk fields can fall back without changing world progress',()=>{
  const p={...empty(),postalVisits:null,postalDesk:'bad'};
  assert.equal(World.snapshot(p).decoration.id,'paperclip');assert.equal(World.visit(p,'?').changed,false);
  assert.equal(World.meet(p,'?').changed,false);assert.equal(World.dialogue(p,'?'),null);
  assert.deepEqual(World.visit(p,'M').progress.enteredIslands,['M']);
});
