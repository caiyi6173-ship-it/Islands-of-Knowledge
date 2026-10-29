const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../src/nightwatch-models.js'),W=require('../src/worldline.js'),D=require('../src/worldline-data.js');
const ramp=(start,end)=>[...Array.from({length:21},(_,i)=>({t:i*50,value:start+(end-start)*i/20})),...Array.from({length:7},(_,i)=>({t:1050+i*50,value:end}))];
const rotation=()=>Array.from({length:81},(_,i)=>({t:i*50,value:i*4.5}));
const inspections={wire:'on',bridge:'on',checks:[{wire:'on',bridge:'off'},{wire:'off',bridge:'on'},{wire:'on',bridge:'on'}]};
function runner(id,role='assistant'){
 const api=M.createSession(id);let state=api.fresh(role,'test-'+id),n=0;
 return {api,get state(){return state;},go(type,extra={}){const r=api.dispatch(state,{type,id:'cmd'+(++n),runId:state.runId,expectedSequence:state.events.length,...extra});assert.equal(r.changed,true,r.reason);state=r.state;return state;}};
}
test('P06 requires chronological numerical samples and captures stopped zero response',()=>{
 const p=M.normalize('P06',0,{trace:ramp(-2,-.5)}),r=M.evaluate('P06',0,p);
 assert.equal(r.goalSupported,true);assert.equal(r.measurement.series.at(-1).response,0);assert.ok(r.measurement.stopped>=.25);
 assert.equal(M.evaluate('P06',0,M.normalize('P06',0,{trace:ramp(-1,-1)})).goalSupported,false);
 assert.throws(()=>M.normalize('P06',0,{trace:[{t:0,value:-2},{t:0,value:-1}]}));
 assert.throws(()=>M.normalize('P06',0,{trace:[{t:NaN,value:-2}]}));
 assert.throws(()=>M.normalize('P06',0,{trace:Array.from({length:161},(_,i)=>({t:i*50,value:-1}))}));
});
test('a single magnet position jump does not qualify as continuous input',()=>{
 const r=M.evaluate('P06',0,M.normalize('P06',0,{trace:[{t:0,value:-2},{t:50,value:-.5},{t:400,value:-.5}]}));assert.equal(r.goalSupported,false);
});
test('rotation needs an entire turn and both signs',()=>{
 const r=M.evaluate('P06',1,M.normalize('P06',1,{trace:rotation()}));assert.ok(r.goalSupported);assert.ok(r.measurement.positive>=3&&r.measurement.negative>=3);
 assert.equal(M.evaluate('P06',1,M.normalize('P06',1,{trace:rotation().slice(0,41)})).goalSupported,false);
});
for(const role of ['assistant','maker','skeptic'])test(`${role} can complete P06 with affordable same-path reverse research`,()=>{
 const r=runner('P06',role);r.go('record',{params:{trace:ramp(-2,-.5)}});const basis=r.state.records[0].id;
 r.go('record',{params:{trace:ramp(-.5,-2)},basis});r.go('advance');r.go('record',{params:{trace:rotation()}});r.go('archive',{scope:'tested'});
 assert.equal(r.state.bestStars,3);assert.equal(r.state.records[1].quality.kind,'motion-reversal');assert.ok(r.state.resources.time>=0&&r.state.resources.tools>=0);
 assert.deepEqual(r.api.restore(JSON.parse(JSON.stringify(r.state))).state,r.state);
});
test('formal unsupported static claim costs resources and trust; free model evaluation does not',()=>{
 const r=runner('P06');const before=structuredClone(r.state.resources);M.evaluate('P06',0,M.normalize('P06',0));assert.deepEqual(r.state.resources,before);
 r.go('record',{params:{trace:ramp(-1,-1)}});assert.equal(r.state.failures,1);assert.equal(r.state.resources.time,before.time-2);assert.equal(r.state.resources.trust,before.trust-1);
});
test('C10 disconnected paths are physically zero and all inspections matter',()=>{
 for(const [wire,bridge] of [['on','off'],['off','on'],['off','off']])assert.equal(M.evaluate('C10',0,M.normalize('C10',0,{wire,bridge})).measurement.current,0);
 assert.equal(M.evaluate('C10',0,M.normalize('C10',0,{wire:'on',bridge:'on'})).goalSupported,false);
 assert.equal(M.evaluate('C10',0,M.normalize('C10',0,inspections)).goalSupported,true);
});
test('electron direction assertion does not modify electrical measurements or get comparison credit',()=>{
 const params={wire:'on',bridge:'on',load:20,direction:'ZnCu'},a=M.evaluate('C10',1,M.normalize('C10',1,params)),b=M.evaluate('C10',1,M.normalize('C10',1,{...params,direction:'CuZn'}));
 assert.deepEqual(a.measurement,b.measurement);assert.equal(a.goalSupported,true);assert.equal(b.goalSupported,false);
 assert.equal(M.compare('C10',{condition:1,basis:{params,goalSupported:true},params:{...params,direction:'CuZn'},result:b}).eligible,false);
});
for(const role of ['assistant','maker','skeptic'])test(`${role} can afford C10 load comparison and both conditions`,()=>{
 const r=runner('C10',role);r.go('record',{params:inspections});r.go('advance');r.go('record',{params:{wire:'on',bridge:'on',load:45,direction:'ZnCu'}});
 r.go('record',{params:{wire:'on',bridge:'on',load:20,direction:'ZnCu'},basis:r.state.records.at(-1).id});r.go('archive',{scope:'tested'});
 assert.equal(r.state.bestStars,3);assert.equal(r.state.records[1].measurement.current,20);assert.ok(Math.abs(r.state.records[2].measurement.current-36.6666667)<1e-6);
});
test('M08 direct landing and fastest crossing remain separate goals',()=>{
 const direct=M.evaluate('M08',0,M.normalize('M08',0,{angle:126.87})),fast=M.evaluate('M08',1,M.normalize('M08',1,{angle:90}));
 assert.ok(direct.goalSupported&&fast.goalSupported);assert.ok(Math.abs(direct.measurement.drift)<.001);assert.ok(Math.abs(direct.measurement.time-5)<.001);
 assert.equal(fast.measurement.time,4);assert.ok(Math.abs(fast.measurement.drift-12)<1e-10);
 assert.equal(M.evaluate('M08',1,{angle:126.87}).goalSupported,false);assert.equal(M.evaluate('M08',0,{angle:90}).goalSupported,false);
});
for(const role of ['assistant','maker','skeptic'])test(`${role} M08 optional reasoning cites real records without inventing a third measurement`,()=>{
 const r=runner('M08',role);r.go('record',{params:{angle:126.87}});r.go('advance');r.go('record',{params:{angle:90}});r.go('archive',{scope:'tested'});assert.equal(r.state.bestStars,2);
 r.go('review',M.reviewCommand(r.state));assert.equal(r.state.records.length,2);assert.equal(r.state.studies.length,1);r.go('archive',{scope:'tested'});assert.equal(r.state.bestStars,3);assert.equal(r.state.revisions.length,2);
 const forged=structuredClone(r.state);forged.studies[0].measurement.lowerBound=0;forged.records[0].measurement.time=1;const restored=r.api.restore(forged);
 assert.equal(restored.error,null);assert.equal(restored.state.studies[0].measurement.lowerBound,4);assert.ok(restored.state.records[0].measurement.time>4.99);
 const duplicate=r.api.quote(r.state,{type:'review',...M.reviewCommand(r.state)});assert.equal(duplicate.allowed,false);
});
test('foreign, invalid or missing study sources are rejected before charging',()=>{
 const r=runner('M08');const snapshot=structuredClone(r.state);const q=r.api.dispatch(r.state,{id:'bad',runId:r.state.runId,expectedSequence:0,type:'review',references:['foreign','forged'],reasoning:'vertical-component'});
 assert.equal(q.changed,false);assert.deepEqual(q.state,snapshot);
});
test('archived M08 study retains its own source links and does not rewrite prior archive',()=>{
 const api=M.createSession('M08');let p=W.startResearch({...W.fields()},'M08',api).progress,n=0;
 const go=(type,extra={})=>{const state=p.researchRuns.M08;const r=W.commitResearch(p,'M08',api,{type,id:String(++n),runId:state.runId,expectedSequence:state.events.length,...extra});assert.ok(r.changed,r.reason);p=r.progress;};
 go('record',{params:{angle:126.87}});go('advance');go('record',{params:{angle:90}});go('archive',{scope:'tested'});go('review',M.reviewCommand(p.researchRuns.M08));go('archive',{scope:'tested'});
 assert.equal(p.mailArtifacts.M08.revisions[0].studies.length,0);assert.equal(p.mailArtifacts.M08.revisions[1].studies.length,1);assert.equal(W.status(p,'R02').ready,false);
});
test('R02 adapter changes leave all 30 tasks and 15 main roster untouched',()=>{assert.equal(Object.keys(D.tasks).length,30);assert.deepEqual(D.chapters[1].main,['P06','C10','M08']);});

test('a wobbly magnet path does not masquerade as a controlled reverse comparison',()=>{
 const a=M.normalize('P06',0,{trace:ramp(-2,-.5)}),b=M.normalize('P06',0,{trace:ramp(-.5,-2)});b.trace[8].value=-.6;
 const result=M.evaluate('P06',0,b),basis={params:a,goalSupported:true,measurement:M.evaluate('P06',0,a).measurement};
 assert.equal(M.compare('P06',{condition:0,basis,params:b,result}).eligible,false);
});
