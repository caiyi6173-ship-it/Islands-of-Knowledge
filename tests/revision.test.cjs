const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../src/revision-models.js'),W=require('../src/worldline.js'),D=require('../src/worldline-data.js');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const oxygen={placements:['bond','bond','left','left','right','right'],representation:'dots',links:[]};
function runner(id,role='assistant'){
 const api=M.createSession(id);let state=api.fresh(role,'run-'+id),seq=0;
 return {api,get state(){return state;},go(type,extra={}){const r=api.dispatch(state,{type,id:String(++seq),runId:state.runId,expectedSequence:state.events.length,...extra});assert.equal(r.changed,true,r.reason);state=r.state;return state;}};
}
function finish(id,r){
 if(id==='P07'){r.go('record',{params:{tuning:1,pulses:[187,215,208]},claim:'reference'});r.go('record',{params:{tuning:3,pulses:[187,215,208]},basis:r.state.records[0].id});r.go('advance');r.go('record',{params:{tuning:5,pulses:[193,812,211]}});}
 if(id==='M06'){r.go('record',{params:{order:['R','T'],scale:1}});r.go('advance');r.go('record',{params:{order:['T','R'],scale:2}});r.go('review',M.reviewCommand(r.state));}
 if(id==='C04'){r.go('record',{params:{placements:['bond']}});r.go('advance');r.go('record',{params:oxygen});r.go('record',{params:{...oxygen,representation:'lines',links:[{pair:0,line:0},{pair:1,line:1}]},basis:r.state.records.at(-1).id});}
 r.go('archive',{scope:'tested'});
}
test('P07 stores numerical duration windows, codebook and separately tuned reception',()=>{
 assert.deepEqual([80,420,421,599,600,1600,1601].map(M.pulseSymbol),['.','.','?','?','-','-','?']);
 const p={tuning:3,pulses:[200,200,200]},a=M.evaluate('P07',0,M.normalize('P07',0,p)),b=M.evaluate('P07',0,M.normalize('P07',0,{...p,tuning:1}));
 assert.ok(a.goalSupported);assert.equal(a.measurement.decoded,'S');assert.equal(b.goalSupported,false);assert.equal(a.measurement.sent,b.measurement.sent);assert.notEqual(a.measurement.received,b.measurement.received);
});
test('P07 cannot auto-correct a wrong code when tuning is correct',()=>{
 const a=M.evaluate('P07',1,M.normalize('P07',1,{tuning:5,pulses:[200,200,200]}));assert.equal(a.goalSupported,false);assert.equal(a.measurement.mismatch,1);assert.equal(a.measurement.decoded,'S');
 const b=M.evaluate('P07',1,M.normalize('P07',1,{tuning:5,pulses:[200,800,200],letter:'O'}));assert.ok(b.goalSupported);assert.equal(b.measurement.decoded,'R');
});
test('P07 changed timing is not a controlled tuning comparison',()=>{
 const basis={params:{tuning:1,pulses:[200,200,200]},measurement:{strength:0,sent:'...'}};
 const params={tuning:3,pulses:[210,210,210]},result=M.evaluate('P07',0,params);
 assert.equal(M.compare('P07',{condition:0,basis,params,result}).eligible,false);
});
test('invalid tapes, repeated operations, fractional pair IDs and impossible inventories are rejected',()=>{
 assert.throws(()=>M.normalize('P07',0,{pulses:[NaN]}));assert.throws(()=>M.normalize('P07',0,{pulses:Array(13).fill(200)}));
 assert.throws(()=>M.normalize('M06',0,{order:['R','R']}));assert.throws(()=>M.normalize('M06',0,{scale:Infinity}));
 assert.throws(()=>M.normalize('C04',1,{placements:['bond']}));assert.throws(()=>M.normalize('C04',1,{...oxygen,links:[{pair:.5,line:0}]}));
});
for(const id of ['P07','M06','C04'])for(const role of ['assistant','maker','skeptic'])test(`${id} ${role}: full main path and optional research fit the original budget`,()=>{
 const r=runner(id,role);finish(id,r);assert.equal(r.state.bestStars,3);assert.equal(r.state.resources.time,role==='assistant'?4:2);assert.equal(r.state.resources.tools,role==='maker'?5:2);
 const cached=structuredClone(r.state);cached.records[0].goalSupported=false;cached.resources.time=999;
 assert.deepEqual(r.api.restore(cached).state,r.state);
});
test('P07 a last affordable comparison uses the actual recorded durations before offering supply',()=>{
 const r=runner('P07','skeptic');r.go('record',{params:{tuning:1,pulses:[183,231,199]},claim:'reference'});for(let i=0;i<4;i++)r.go('consult');
 assert.equal(r.state.resources.time,1);assert.equal(r.api.canSupply(r.state),false);
 const q=r.api.quote(r.state,{type:'record',params:{tuning:3,pulses:[183,231,199]},basis:r.state.records[0].id});assert.ok(q.allowed&&q.discount);
});
test('M06 operation order changes positions while preserving lengths and angles',()=>{
 const rt=M.geometry({order:['R','T'],scale:1}),tr=M.geometry({order:['T','R'],scale:1});
 assert.deepEqual(rt.points[0],[3,2]);assert.deepEqual(tr.points[0],[-2,3]);assert.deepEqual(rt.lengths,tr.lengths);rt.angles.forEach((v,i)=>close(v,tr.angles[i]));
 assert.equal(M.evaluate('M06',0,{order:['T','R'],scale:1}).goalSupported,false);
});
test('M06 uniform scaling doubles lengths, quadruples area and preserves angles',()=>{
 const a=M.geometry({order:['T','R'],scale:1}),b=M.geometry({order:['T','R'],scale:2});
 a.lengths.forEach((v,i)=>close(v*2,b.lengths[i]));a.angles.forEach((v,i)=>close(v,b.angles[i]));close(b.area,a.area*4);assert.deepEqual(b.beforeScale,a.points);
});
test('M06 reflection reverses orientation and preserves lengths and angles',()=>{
 const a=M.geometry({order:[],scale:1}),b=M.geometry({order:['F'],scale:1});assert.notEqual(a.orientation,b.orientation);a.lengths.forEach((v,i)=>close(v,b.lengths[i]));a.angles.forEach((v,i)=>close(v,b.angles[i]));
});
test('M06 two goal records can archive without a reasoning gate; optional study revises the artifact',()=>{
 const r=runner('M06');r.go('record',{params:{order:['R','T'],scale:1}});r.go('advance');r.go('record',{params:{order:['T','R'],scale:2}});r.go('archive',{scope:'tested'});assert.equal(r.state.bestStars,2);
 const count=r.state.records.length;r.go('review',M.reviewCommand(r.state));r.go('archive',{scope:'tested'});assert.equal(r.state.records.length,count);assert.equal(r.state.bestStars,3);assert.deepEqual(r.state.studies[0].measurement.difference,[-5,1]);
});
test('M06 study cannot use foreign or unsupported records',()=>{
 const r=runner('M06');assert.equal(M.review(r.state,{references:['other','forged'],reasoning:'order-counterexample'}),null);assert.equal(r.api.quote(r.state,{type:'review',references:[],reasoning:'order-counterexample'}).allowed,false);
});
test('C04 shared pair is counted once globally and once around each atom',()=>{
 const h=M.evaluate('C04',0,M.normalize('C04',0,{placements:['bond']}));assert.equal(h.measurement.total,2);assert.equal(h.measurement.aroundLeft,2);assert.equal(h.measurement.aroundRight,2);
 const o=M.evaluate('C04',1,M.normalize('C04',1,oxygen));assert.ok(o.goalSupported);assert.equal(o.measurement.total,12);assert.equal(o.measurement.aroundLeft,8);assert.equal(o.measurement.aroundRight,8);assert.equal(o.measurement.leftLone+o.measurement.rightLone,4);
});
test('C04 a correct total without correct distribution does not pass',()=>{
 const result=M.evaluate('C04',1,M.normalize('C04',1,{placements:['bond','bond','left','left','left','left']}));assert.equal(result.measurement.total,12);assert.equal(result.goalSupported,false);assert.equal(result.measurement.aroundLeft,12);assert.equal(result.measurement.aroundRight,4);
});
test('C04 switching a display button alone earns neither a goal record nor comparison credit',()=>{
 const params=M.normalize('C04',1,{...oxygen,representation:'lines'}),result=M.evaluate('C04',1,params),basis={params:oxygen,goalSupported:true};
 assert.equal(result.goalSupported,false);assert.equal(M.compare('C04',{condition:1,basis,params,result}).eligible,false);
});
test('C04 point-line mapping must be bijective and must not erase lone pairs',()=>{
 const duplicate={...oxygen,representation:'lines',links:[{pair:0,line:0},{pair:1,line:0}]};assert.equal(M.evaluate('C04',1,M.normalize('C04',1,duplicate)).goalSupported,false);
 const good={...oxygen,representation:'lines',links:[{pair:0,line:1},{pair:1,line:0}]},r=M.evaluate('C04',1,M.normalize('C04',1,good));assert.ok(r.goalSupported&&r.measurement.mapping);assert.equal(r.measurement.leftLone,2);assert.equal(r.measurement.rightLone,2);
});
test('formal wrong code costs time, tools and trust; preview and reference keep their distinction',()=>{
 const r=runner('P07'),before=structuredClone(r.state.resources);M.evaluate('P07',0,{tuning:3,pulses:[800,800,800]});assert.deepEqual(r.state.resources,before);
 r.go('record',{params:{tuning:3,pulses:[800,800,800]}});assert.equal(r.state.failures,1);assert.equal(r.state.resources.time,before.time-2);assert.equal(r.state.resources.trust,before.trust-1);
});
function archiveProgress(id){
 const api=M.createSession(id);let p=W.startResearch({...W.fields()},id,api).progress;
 const r=runner(id);finish(id,r);for(const e of r.state.events){const run=p.researchRuns[id];const result=W.commitResearch(p,id,api,{...e,runId:run.runId,...(e.basis?{basis:e.basis.replace(r.state.runId,run.runId)}:{}),...(e.references?{references:e.references.map(v=>v.replace(r.state.runId,run.runId))}:{})});assert.ok(result.changed,result.reason);p=result.progress;}
 return p;
}
for(const id of ['P07','M06','C04'])test(`00 can explicitly cite real ${id} with stable versions and honest legacy fallback`,()=>{
 const p=archiveProgress(id),letter=W.letter(p,id);assert.ok(letter?.text);assert.equal(letter.artifactId,id);assert.equal(letter.ref,p.mailArtifacts[id].currentRef);
 const selected=W.selectLetter(p,id).progress;assert.deepEqual(W.letter(selected),letter);
 const legacy={...p,mailLetters:{},mailArtifacts:{[id]:{...p.mailArtifacts[id],revisions:[{ref:'old',source:'legacy-completion',records:[]}],currentRef:'old'}}};const text=W.letter(legacy,id).text;
 assert.ok(!text.includes('12 个')&&!text.includes('(3,2)')&&!text.includes('刻度 5'));
});
test('R03 artifact alone never skips prior chapters, and all thirty sources remain optional letter choices',()=>{
 const p=archiveProgress('M06');assert.equal(W.status(p,'R03').ready,false);assert.equal(Object.keys(D.tasks).length,30);assert.deepEqual(D.chapters[2].main,['P07','M06','C04']);assert.equal(D.letterSources.length,30);assert.ok(Object.isFrozen(D.letterSources));
});
