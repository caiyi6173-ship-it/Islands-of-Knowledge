const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../src/first-voyage-models.js');
const R = require('../src/research-session.js');
const W = require('../src/worldline.js');
const games = {P:require('../src/physics-scenarios.js'),M:require('../src/math-scenarios.js'),C:require('../src/chemistry-scenarios.js')};
const paths = {
  P01:[{shape:'bowl'},{shape:'wide'},{shape:'wide'}],
  C01:[{instrument:'density',identity:'salt'},{instrument:'conductivity',identity:'salt'},{instrument:'magnet',identity:'iron'}],
  M03:[{origin:0,targetX:4,targetY:3},{origin:1,targetX:3,targetY:2},{lineSlope:2}],
};
function command(api,s,type,extra={}) {
  const result=api.dispatch(s,{id:R.token(),runId:s.runId,expectedSequence:s.events.length,type,...extra});
  assert.equal(result.changed,true,result.reason);return result.state;
}
function finish(id,role='assistant',quality=true) {
  const api=M.createSession(id),p=paths[id];let s=api.fresh(role);
  s=command(api,s,'record',{params:p[0]});
  if(quality)s=command(api,s,'record',{params:p[1],basis:s.records[0].id});
  s=command(api,s,'advance');s=command(api,s,'record',{params:p[2]});
  return {api,state:command(api,s,'archive',{scope:'tested'})};
}
for(const role of Object.keys(R.roles))for(const id of Object.keys(paths))test(`${id}/${role}: three useful records earn three stars within the starting budget`,()=>{
  const {api,state:s}=finish(id,role);
  assert.equal(s.failures,0);assert.equal(s.bestStars,3);assert.equal(s.supplies,0);
  assert.equal(R.roles[role].time-s.resources.time,5);
  assert.equal(R.roles[role].tools-s.resources.tools,role==='maker'?1:2);
  assert.deepEqual(api.restore(JSON.parse(JSON.stringify(s))),{state:s,error:null});
});
test('P01 keeps mass fixed, distinguishes maximum capacity from displacement, and requires a real empty-load comparison',()=>{
  const bowl=M.evaluate('P01',0,{shape:'bowl'}),wide=M.evaluate('P01',0,{shape:'wide'});
  assert.equal(bowl.model.mass,1.2);assert.equal(wide.model.mass,1.2);
  assert.equal(bowl.model.displacement,wide.model.displacement);assert.notEqual(bowl.model.capacity,wide.model.capacity);
  assert.equal(M.evaluate('P01',1,{shape:'bowl'}).goalSupported,false);
  const loaded=M.evaluate('P01',1,{shape:'wide'});
  assert.equal(loaded.model.mass,6);assert.ok(Math.abs(loaded.model.reserve-.4)<1e-8);
  const api=M.createSession('P01');let s=api.fresh();
  s=command(api,s,'record',{params:{shape:'lump'},claim:'reference'});
  assert.equal(s.failures,0);assert.equal(s.records[0].recordValid,true);assert.equal(s.records[0].goalSupported,false);
  s=command(api,s,'record',{params:{shape:'wide'},basis:s.records[0].id});
  assert.equal(s.records[1].quality.discount,true);assert.equal(s.records[1].quality.verified,false);
});
test('C01 identity corrections retain the same measured fact and do not qualify for a bonus',()=>{
  const api=M.createSession('C01');let s=api.fresh();
  s=command(api,s,'record',{params:{instrument:'density',identity:'sugar'}});
  s=command(api,s,'record',{params:{instrument:'density',identity:'salt'},basis:s.records[0].id});
  assert.deepEqual(s.records[0].measurement,s.records[1].measurement);
  assert.deepEqual(s.records[0].fact,s.records[1].fact);assert.equal(s.records[1].factRef,s.records[0].id);
  assert.equal(s.records[1].quality,null);assert.deepEqual(s.records[1].cost,{time:2,tools:1});
  s=command(api,s,'advance');s=command(api,s,'record',{params:{instrument:'conductivity',identity:'iron'},claim:'reference'});
  s=command(api,s,'record',{params:{instrument:'magnet',identity:'iron'},basis:s.records.at(-1).id});
  assert.equal(s.records.at(-1).quality,null);
});
test('M03 rebases actual world coordinates, permits negative local coordinates, and never silently clamps',()=>{
  assert.equal(M.evaluate('M03',0,{origin:1,targetX:4,targetY:3}).goalSupported,false);
  assert.deepEqual(M.evaluate('M03',0,{origin:1,targetX:4,targetY:3}).measurement,{worldX:5,worldY:4,origin:[1,1],local:[4,3]});
  assert.equal(M.evaluate('M03',0,{origin:1,targetX:3,targetY:2}).goalSupported,true);
  assert.equal(M.evaluate('M03',0,{origin:1,targetX:-1,targetY:-1}).legal,true);
  const api=M.createSession('M03'),s=api.fresh();
  assert.equal(api.quote(s,{type:'record',params:{origin:1,targetX:8,targetY:6}}).allowed,false);
  assert.equal(s.resources.time,9);
  assert.deepEqual(M.evaluate('M03',1,{lineSlope:2}).measurement.residuals,[{x:1,y:2,residual:0},{x:3,y:6,residual:0}]);
  assert.deepEqual(M.evaluate('M03',1,{lineSlope:1.9}).measurement.residuals.map(r=>r.residual),[.1,.3]);
});
test('a formal error is recoverable for every role without making free previews consume resources',()=>{
  for(const role of Object.keys(R.roles))for(const id of Object.keys(paths)) {
    const api=M.createSession(id),p=paths[id];let s=api.fresh(role);
    const bad={P01:{shape:'lump'},C01:{instrument:'eye',identity:'salt'},M03:{origin:0,targetX:0,targetY:0}}[id];
    const before=JSON.stringify(s);for(let i=0;i<20;i++)api.quote(s,{type:'record',params:bad});assert.equal(JSON.stringify(s),before);
    s=command(api,s,'record',{params:bad});assert.equal(s.failures,1);assert.equal(s.resources.trust,R.roles[role].trust-1);
    s=command(api,s,'record',{params:p[0]});
    s=command(api,s,'record',{params:p[1],basis:s.records.at(-1).id});
    s=command(api,s,'advance');s=command(api,s,'record',{params:p[2]});s=command(api,s,'archive',{scope:'tested'});
    assert.equal(s.bestStars,3);assert.equal(R.roles[role].time-s.resources.time,7);
  }
});
test('optional work can revise the same attempt after archive and preserves the delivered revision',()=>{
  const {api,state}=finish('M03','assistant',false);
  let p={...W.fields(),researchRuns:{M03:state}};
  // Rebuild an actual archive in the application service, not from cached stars.
  p={...W.fields()};p=W.startResearch(p,'M03',api).progress;
  const commit=(type,extra={})=>{const s=p.researchRuns.M03;const r=W.commitResearch(p,'M03',api,{id:R.token(),runId:s.runId,expectedSequence:s.events.length,type,...extra});assert.equal(r.changed,true,r.reason);p=r.progress;};
  commit('record',{params:paths.M03[0]});commit('advance');commit('record',{params:paths.M03[2]});commit('archive',{scope:'tested'});
  const first=p.mailArtifacts.M03.currentRef,letter=p.mailLetters['00'];assert.equal(p.mailArtifacts.M03.bestStars,2);
  commit('supplement',{condition:0});assert.equal(p.researchRuns.M03.returnCondition,1);
  commit('record',{params:paths.M03[1],basis:p.researchRuns.M03.records[0].id});commit('return');commit('archive',{scope:'tested'});
  assert.equal(p.mailArtifacts.M03.bestStars,3);assert.equal(p.mailArtifacts.M03.revisions.length,2);
  assert.ok(p.mailArtifacts.M03.revisions.some(r=>r.ref===first));
  assert.deepEqual(W.letter(p),letter); // A sent line keeps its actual source until explicitly selected again.
  p=W.selectLetter(p,'M03').progress;assert.ok(W.letter(p).text.includes('换过原点'));
  const run=p.researchRuns.M03.runId;p=W.startResearch(p,'M03',api).progress;
  assert.ok(p.researchHistory[run]);assert.equal(p.mailArtifacts.M03.bestStars,3);assert.equal(p.researchRuns.M03.records.length,0);
  assert.equal(api.quote(p.researchRuns.M03,{type:'record',params:paths.M03[1],basis:state.records[0].id}).discount,false);
});
test('all six island orders make one real joint delivery, with a grounded letter and stable receipt',()=>{
  for(const order of [['P01','C01','M03'],['P01','M03','C01'],['C01','P01','M03'],['C01','M03','P01'],['M03','P01','C01'],['M03','C01','P01']]) {
    let p={...W.fields()};
    for(const id of order) {
      const {api,state}=finish(id);p.researchRuns[id]={...state,events:state.events.slice(0,-1)};
      const r=W.commitResearch(p,id,api,{id:R.token(),runId:state.runId,expectedSequence:state.events.length-1,type:'archive',scope:'tested'});
      assert.equal(r.changed,true,r.reason);p=r.progress;
      if(id!==order[2])assert.equal(W.deliver(p,'R01').changed,false);
    }
    assert.equal(Object.keys(p.mailDeliveries).length,0);
    const delivered=W.deliver(p,'R01');assert.equal(delivered.changed,true);p=delivered.progress;
    const receipt=JSON.stringify(p.mailDeliveries.R01);assert.equal(W.deliver(p,'R01').changed,false);
    p=W.reconcile(JSON.parse(JSON.stringify(p)),games);assert.equal(JSON.stringify(p.mailDeliveries.R01),receipt);
    assert.equal(W.letter(p).artifactId,order[0]);
    for(const id of order) {
      const chosen=W.selectLetter(p,id).progress;assert.equal(W.letter(chosen).artifactId,id);
      assert.ok(chosen.mailArtifacts[id].revisions.some(r=>r.ref===W.letter(chosen).ref));
    }
  }
});
test('legacy completions never invent modern measurements or replace a current new artifact',()=>{
  let p=W.reconcile({...W.fields(),expDone:{'story-P01':true}},games);
  assert.ok(!W.letter(p).text.includes('6.0'));assert.equal(W.selectLetter(p,'M03').changed,false);
  const {api,state}=finish('P01');p.researchRuns.P01={...state,events:state.events.slice(0,-1)};
  p=W.commitResearch(p,'P01',api,{id:R.token(),runId:state.runId,expectedSequence:state.events.length-1,type:'archive',scope:'tested'}).progress;
  const current=p.mailArtifacts.P01.currentRef;
  let old=games.P.fresh('P01','assistant');
  for(const shape of ['bowl','wide'])old=games.P.next(games.P.act(old,'experiment',{shape}));
  p.physicsScenarios={P01:games.P.act(old,'publish')};p=W.reconcile(p,games);
  assert.equal(p.mailArtifacts.P01.currentRef,current);
  assert.ok(p.mailArtifacts.P01.revisions.some(r=>r.source==='scenario-v4'));
});
