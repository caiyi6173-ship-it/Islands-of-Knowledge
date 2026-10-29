const test=require('node:test'),assert=require('node:assert/strict');
const W=require('../src/worldline.js'),D=require('../src/worldline-data.js');
const models=['first-voyage','nightwatch','revision','atlas','return','appendix'].map(name=>require(`../src/${name}-models.js`));
const side=require('./appendix-fixtures.cjs').base;
const ramp=[...Array.from({length:21},(_,i)=>({t:i*50,value:-2+1.5*i/20})),...Array.from({length:7},(_,i)=>({t:1050+i*50,value:-.5}))];
const main={
 P01:[{shape:'bowl'},{shape:'wide'}],C01:[{instrument:'density',identity:'salt'},{instrument:'magnet',identity:'iron'}],M03:[{targetX:4,targetY:3},{lineSlope:2}],
 P06:[{trace:ramp},{trace:Array.from({length:81},(_,i)=>({t:i*50,value:i*4.5}))}],C10:[{wire:'on',bridge:'on',checks:[{wire:'on',bridge:'off'},{wire:'off',bridge:'on'},{wire:'on',bridge:'on'}]},{wire:'on',bridge:'on',direction:'ZnCu',load:45}],M08:[{angle:126.87},{angle:90}],
 P07:[{tuning:3,pulses:[200,200,200]},{tuning:5,pulses:[200,800,200]}],M06:[{order:['R','T']},{order:['T','R'],scale:2}],C04:[{placements:['bond']},{placements:['bond','bond','left','left','right','right']}],
 P03:[{speed:10},{ratio:1}],M05:[{a:-.1,h:6,k:4.1},{a:-.125}],C06:[{shape:'tetra',angleLabel:109.5},{shape:'bent',angleLabel:104.5}],
 P10:[{frequency:7,flux:5,trials:[{frequency:4.5,flux:1},{frequency:4.5,flux:5},{frequency:7,flux:5}]},{frequency:9,flux:5}],M10:[{a:.05,b:-1.2,c:15},{a:.05,b:-1.2,c:15}],C08:[{lid:'open',gas:8,views:[{lid:'open',gas:8},{lid:'closed',gas:8}]},{h2:2,o2:1,h2o:2}],
};
function finish(progress,id,role){
  const api=models.find(m=>m.definitions[id]).createSession(id);
  let next=W.startResearch(progress,id,api,role).progress;
  function go(type,extra={}){const run=next.researchRuns[id],result=W.commitResearch(next,id,api,{id:`${id}-${run.events.length}`,runId:run.runId,expectedSequence:run.events.length,type,...extra});assert.equal(result.changed,true,`${id}: ${type}: ${result.reason}`);next=result.progress;}
  go('record',{params:(main[id]||side[id])[0]});go('advance');go('record',{params:(main[id]||side[id])[1]});go('archive',{scope:'tested'});
  assert.equal(next.mailArtifacts[id].bestStars,2,id);assert.equal(next.researchRuns[id].supplies,0,id);
  return next;
}
for(const role of ['assistant','maker','skeptic'])test(`all thirty commissions form a complete ${role} campaign in reverse order with ordinary two-star records`,()=>{
  let progress=W.fields();
  for(const id of [...D.letterSources].reverse()){progress=finish(progress,id,role);assert.equal(Object.keys(progress.mailDeliveries).length,0);}
  assert.equal(Object.keys(progress.mailArtifacts).length,30);
  assert.equal(W.deliver(progress,'R05').changed,false,'future chapter should still wait for earlier joint deliveries');
  const refs=Object.fromEntries(Object.entries(progress.mailArtifacts).map(([id,a])=>[id,a.currentRef]));
  for(const chapter of D.chapters){const result=W.deliver(progress,chapter.id);assert.equal(result.changed,true);progress=result.progress;for(const id of chapter.side){progress=W.sendAppendix(progress,id).progress;assert.deepEqual(progress.mailAppendices[id].refs,[refs[id]]);}}
  assert.ok(progress.mailFacts.formalDesk);assert.equal(Object.keys(progress.mailAppendices).length,15);
  const delivered=structuredClone(progress.mailDeliveries),letter=structuredClone(progress.mailLetters);
  progress=finish(progress,'P01',role);
  assert.notEqual(progress.mailArtifacts.P01.currentRef,refs.P01);assert.deepEqual(progress.mailDeliveries,delivered);assert.deepEqual(progress.mailLetters,letter);
  for(const chapter of D.chapters)assert.equal(W.deliver(progress,chapter.id).changed,false,'replay is not a new delivery');
  const restored=W.normalize(JSON.parse(JSON.stringify(progress)));assert.deepEqual(restored,progress);
});
test('mixed old and new main artifacts reach the ending without inventing measurements for the old page',()=>{
  const games={P:require('../src/physics-scenarios.js'),M:require('../src/math-scenarios.js'),C:require('../src/chemistry-scenarios.js')};
  let progress=W.reconcile({...W.fields(),expDone:{'story-P01':true}},games);
  const old=structuredClone(progress.mailArtifacts.P01);
  for(const chapter of D.chapters){for(const id of chapter.main)if(id!=='P01')progress=finish(progress,id,'assistant');const result=W.deliver(progress,chapter.id);assert.equal(result.changed,true);progress=result.progress;}
  assert.ok(progress.mailFacts.formalDesk);assert.deepEqual(progress.mailArtifacts.P01,old);assert.equal(old.revisions[0].records.length,0);
  assert.equal(progress.mailDeliveries.R01.artifacts.P01,old.currentRef);
  assert.ok(!W.letter(progress,'P01').text.includes('6.0 kg'));assert.ok(W.letter(progress,'M10').text.includes('15.000'));
});
