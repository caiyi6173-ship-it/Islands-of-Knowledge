const test=require('node:test');
const assert=require('node:assert/strict');
const S=require('../src/research-session.js');
const A=require('../src/research-adapters.js');
const W=require('../src/worldline.js');
const P=require('../src/physics-scenarios.js');
const C=require('../src/chemistry-scenarios.js');
const session=(id='P01')=>A.create(id,id[0]==='C'?C:P);
const send=(api,state,type,extra={})=>{
  const r=api.dispatch(state,{id:`cmd-${state.events.length}`,runId:state.runId,expectedSequence:state.events.length,type,...extra});
  assert.equal(r.changed,true,r.reason);return r.state;
};
for(const role of Object.keys(S.roles))test(`${role}: no-failure P01 and C01 research is affordable and replayable`,()=>{
  for(const id of ['P01','C01']) {
    const api=session(id);let s=api.fresh(role,`${id}-${role}`);
    const first=id==='P01'?{shape:'bowl'}:{instrument:'density',identity:'salt'};
    const second=id==='P01'?{shape:'wide'}:{instrument:'conductivity',identity:'salt'};
    s=send(api,s,'record',{params:first});
    s=send(api,s,'record',{params:second,basis:s.records[0].id});
    assert.equal(s.records[1].quality.verified,true);
    assert.equal(s.activeCondition,0); // success does not force a scene transition
    s=send(api,s,'advance');
    s=send(api,s,'record',{params:id==='P01'?{shape:'wide'}:{instrument:'magnet',identity:'iron'}});
    s=send(api,s,'archive',{scope:'tested'});
    assert.equal(s.bestStars,3);assert.equal(s.failures,0);
    assert.equal(s.resources.time,S.roles[role].time-5);
    assert.equal(s.resources.tools,S.roles[role].tools-(role==='maker'?1:2));
    assert.deepEqual(api.restore(JSON.parse(JSON.stringify(s))),{state:s,error:null});
  }
});
test('formal unsupported claims cost resources; free quotes, honest negative references and duplicates do not create failures',()=>{
  const api=session();let s=api.fresh('assistant','penalties');
  const before=JSON.stringify(s);for(let i=0;i<20;i++)api.quote(s,{type:'record',params:{shape:'lump'}});
  assert.equal(JSON.stringify(s),before);
  s=send(api,s,'record',{params:{shape:'lump'}});
  assert.equal(s.failures,1);assert.equal(s.resources.trust,1);
  s=send(api,s,'record',{params:{shape:'lump'},claim:'reference'});
  assert.equal(s.failures,1);assert.equal(s.records[1].recordValid,true);assert.equal(s.records[1].goalSupported,false);
  const duplicate=api.dispatch(s,{id:'other',runId:s.runId,expectedSequence:s.events.length,type:'record',params:{shape:'lump'},claim:'reference'});
  assert.equal(duplicate.reason,'duplicate-record');assert.equal(duplicate.state,s);
  assert.equal(api.dispatch(s,{id:'advance',runId:s.runId,type:'advance',expectedSequence:s.events.length}).changed,false);
});
test('answer edits retain one measurement fact and get no research discount',()=>{
  const api=session('C01');let s=send(api,api.fresh('assistant','identity'),'record',{params:{instrument:'density',identity:'sugar'}});
  const command={type:'record',params:{instrument:'density',identity:'salt'},basis:s.records[0].id};
  assert.deepEqual(api.quote(s,command).cost,{time:2,tools:1});
  s=send(api,s,'record',command);
  assert.equal(s.records[1].quality,null);
  assert.equal(s.records[1].factRef,s.records[0].id);
  assert.deepEqual(s.records[0].measurement,s.records[1].measurement);
});
test('paid consultation is marked as given material and cannot replace personal evidence',()=>{
  const api=session();let s=send(api,api.fresh('skeptic','consult'),'consult');
  assert.equal(s.resources.time,6);assert.equal(s.records.length,0);
  assert.equal(s.consultations[0].source,'given');assert.equal(s.consultations[0].strong,true);
  assert.ok(s.consultations[0].guidance.controls.length);
  s=send(api,s,'consult');assert.equal(s.consultations[1].strong,false);
  assert.equal(api.dispatch(s,{id:'archive',runId:s.runId,type:'archive',expectedSequence:s.events.length,scope:'tested'}).changed,false);
  assert.deepEqual(api.restore(s).state,s);
});
test('a previous attempt or another condition cannot provide a comparison basis',()=>{
  const api=session();let s=send(api,api.fresh('assistant','basis'),'record',{params:{shape:'bowl'}});
  const old=s.records[0].id;s=send(api,s,'advance');
  assert.equal(api.quote(s,{type:'record',params:{shape:'wide'},basis:old}).discount,false);
  const fresh=api.fresh('assistant','fresh-basis');
  assert.equal(api.quote(fresh,{type:'record',params:{shape:'wide'},basis:old}).discount,false);
});
test('view edits, another sample and nondiscriminating methods cannot manufacture cross-checks',()=>{
  const api=session('C01');let s=send(api,api.fresh('assistant','cross'),'record',{params:{instrument:'eye',identity:'salt'},claim:'reference'});
  assert.equal(api.quote(s,{type:'record',params:{instrument:'density',identity:'salt'},basis:s.records[0].id}).discount,false);
  assert.equal(api.quote(s,{type:'record',params:{instrument:'density',identity:'salt',camera:20}}).allowed,false);
});
test('idempotent commands, stale sequence and bad parameters are rejected before charging',()=>{
  const api=session();const original=api.fresh('assistant','transaction');
  const command={id:'once',runId:original.runId,expectedSequence:0,type:'record',params:{shape:'bowl'}};
  const s=api.dispatch(original,command).state;
  assert.equal(api.dispatch(s,command).reason,'duplicate-command');
  assert.equal(api.dispatch(s,{...command,id:'late'}).reason,'stale-command');
  assert.equal(api.dispatch(s,{id:'invalid',runId:s.runId,type:'record',expectedSequence:1,params:{shape:'imaginary'}}).changed,false);
  assert.equal(api.dispatch(api.fresh('assistant','replacement'),command).reason,'wrong-attempt');
  assert.equal(original.resources.time,9);assert.equal(s.resources.time,7);
});
test('supplementary work preserves the main condition and can revise an archive without replaying delivery',()=>{
  const api=session();let s=send(api,api.fresh('assistant','supplement'),'record',{params:{shape:'bowl'}});
  s=send(api,s,'advance');s=send(api,s,'record',{params:{shape:'wide'}});
  s=send(api,s,'archive',{scope:'tested'});assert.equal(s.bestStars,2);
  s=send(api,s,'supplement',{condition:0});assert.equal(s.returnCondition,1);
  s=send(api,s,'record',{params:{shape:'wide'},basis:s.records[0].id});
  s=send(api,s,'return');assert.equal(s.activeCondition,1);
  s=send(api,s,'archive',{scope:'tested'});assert.equal(s.bestStars,3);assert.equal(s.revisions.length,2);
  assert.equal(api.dispatch(s,{id:'same-archive',runId:s.runId,type:'archive',scope:'tested',expectedSequence:s.events.length}).reason,'duplicate-archive');
  assert.deepEqual(api.restore(s).state,s);
});
test('replay recalculates outcomes and rejects truncated, reordered or incompatible rules',()=>{
  const api=session();const s=send(api,api.fresh('assistant','replay'),'record',{params:{shape:'lump'}});
  const forged=JSON.parse(JSON.stringify(s));forged.resources.time=999;forged.records[0].recordValid=true;forged.bestStars=3;
  assert.deepEqual(api.restore(forged).state,s);
  assert.equal(api.restore({...s,modelVersion:'different'}).error,'incompatible-record');
  assert.equal(api.restore({...s,events:[{...s.events[0],expectedSequence:2}]}).error,'stale-command');
  assert.equal(api.restore({...s,events:Array(1025).fill(s.events[0])}).error,'incompatible-record');
});
test('supply is once, unavailable when a cheap qualified comparison is affordable, and affects only third star',()=>{
  const api=session();let s=send(api,api.fresh('assistant','supply'),'record',{params:{shape:'bowl'}});
  // Build a real legal stream until only a comparison remains affordable.
  s=send(api,s,'record',{params:{shape:'lump'},claim:'reference'});
  s=send(api,s,'advance');s=send(api,s,'record',{params:{shape:'lump'}});
  s=send(api,s,'record',{params:{shape:'bowl'},claim:'reference'});
  assert.equal(s.resources.time,1);assert.equal(api.canSupply(s),false);
  s=send(api,s,'record',{params:{shape:'wide'},basis:s.records.at(-1).id});
  assert.equal(api.canSupply(s),true);s=send(api,s,'supply');assert.equal(s.supplies,1);
  assert.equal(api.canSupply(s),false);
  s=send(api,s,'archive',{scope:'tested'});assert.equal(s.bestStars,2);
});
test('worldline commits new research atomically, preserves previous attempts, and never mixes evidence',()=>{
  const api=session();let p={...W.fields(),physicsScenarios:{},expDone:{}};
  p=W.startResearch(p,'P01',api).progress;
  function step(type,extra={}) {
    const s=p.researchRuns.P01;
    const result=W.commitResearch(p,'P01',api,{id:`c-${s.events.length}`,runId:s.runId,expectedSequence:s.events.length,type,...extra});
    assert.equal(result.changed,true,result.reason);p=result.progress;
  }
  step('record',{params:{shape:'bowl'}});step('advance');step('record',{params:{shape:'wide'}});step('archive',{scope:'tested'});
  const old=p.researchRuns.P01.runId,ref=p.mailArtifacts.P01.currentRef;
  p=W.startResearch(p,'P01',api).progress;
  assert.ok(p.researchHistory[old]);assert.equal(p.mailArtifacts.P01.currentRef,ref);
  assert.equal(p.researchRuns.P01.records.length,0);
  assert.equal(W.commitResearch(p,'P01',api,{id:'bad',runId:p.researchRuns.P01.runId,expectedSequence:0,type:'archive',scope:'tested'}).changed,false);
});
test('a new model can start a fresh attempt while retaining an older model record verbatim',()=>{
  const old=session();let p=W.startResearch(W.fields(),'P01',old).progress;
  const before=p.researchRuns.P01;
  p=W.commitResearch(p,'P01',old,{id:'first',runId:before.runId,expectedSequence:0,type:'record',params:{shape:'bowl'}}).progress;
  const original=JSON.parse(JSON.stringify(p.researchRuns.P01));
  const newer=S.create({id:'P01',modelVersion:'future-model',normalize:(_,p)=>p,evaluate:()=>({legal:true,goalSupported:true})});
  const next=W.startResearch(p,'P01',newer);
  assert.equal(next.changed,true);
  assert.deepEqual(next.progress.researchHistory[original.runId].record,original);
  assert.equal(next.progress.researchHistory[original.runId].replayStatus,'incompatible-record');
  assert.equal(next.progress.researchRuns.P01.records.length,0);
});
