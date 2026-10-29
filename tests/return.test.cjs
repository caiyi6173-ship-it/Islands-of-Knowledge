const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../src/return-models.js'),W=require('../src/worldline.js'),D=require('../src/worldline-data.js'),Delivery=require('../src/return-delivery.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const lightPack={frequency:7,flux:5,trials:[{frequency:4.5,flux:1},{frequency:4.5,flux:5},{frequency:7,flux:5}]};
const gasPack=gas=>({lid:'open',gas,boundary:'vessel',views:[{lid:'open',gas},{lid:'closed',gas}]});
function runner(id,role='assistant'){
 const api=M.createSession(id);let state=api.fresh(role,'run-'+id),n=0;
 return {api,get state(){return state;},go(type,extra={}){const r=api.dispatch(state,{type,id:String(++n),runId:state.runId,expectedSequence:state.events.length,...extra});assert.equal(r.changed,true,r.reason);state=r.state;return state;}};
}
function complete(id,r,quality=true){
 if(id==='P10'){r.go('record',{params:lightPack});r.go('advance');r.go('record',{params:{frequency:9,flux:1}});if(quality)r.go('record',{params:{frequency:9,flux:5},basis:r.state.records.at(-1).id});}
 if(id==='M10'){r.go('record',{params:{a:.05,b:-1.2,c:15}});if(quality)r.go('record',{params:{a:.051,b:-1.22,c:15}});r.go('advance');r.go('record',{params:{a:.06,b:-1,c:15}});if(quality)r.go('review',M.reviewCommand(r.state));}
 if(id==='C08'){r.go('record',{params:gasPack(8)});if(quality)r.go('record',{params:gasPack(12),basis:r.state.records.at(-1).id});r.go('advance');r.go('record',{params:{h2:2,o2:1,h2o:2}});}
 r.go('archive',{scope:'tested'});
}
test('a low-frequency photon does not emit when its flux is raised',()=>{
 const low=M.photo(0,{frequency:4.5,flux:1}),bright=M.photo(0,{frequency:4.5,flux:8});assert.equal(low.emits,false);assert.equal(bright.count,0);near(low.energy,bright.energy);near(bright.threshold,2.2/.4135667696);
});
test('one variable changes count while maximum kinetic energy stays fixed',()=>{
 const a=M.photo(1,{frequency:9,flux:1}),b=M.photo(1,{frequency:9,flux:5});assert.equal(a.count,1);assert.equal(b.count,5);near(a.kinetic,b.kinetic);near(b.kinetic,.4135667696*9-3.5);
});
test('the same source can emit on A but fail on B',()=>{const p={frequency:7,flux:5};assert.ok(M.photo(0,p).emits);assert.equal(M.photo(1,p).emits,false);});
test('orthogonal preview pack requires both same-frequency flux and same-flux frequency pairs',()=>{
 assert.ok(M.orthogonal(lightPack.trials));assert.equal(M.orthogonal([{frequency:4.5,flux:1},{frequency:7,flux:5}]),false);assert.equal(M.orthogonal([{frequency:4.5,flux:1},{frequency:4.5,flux:5}]),false);
});
test('preview pack readings are recomputed and fake captured outcomes are discarded',()=>{
 const p=M.normalize('P10',0,{...lightPack,trials:lightPack.trials.map(v=>({...v,emits:true,kinetic:999}))});const result=M.evaluate('P10',0,p);assert.ok(result.goalSupported);assert.equal(result.measurement.trials[0].emits,false);assert.equal(result.measurement.trials[0].kinetic,0);
});
test('changing frequency together with flux is not an intensity comparison',()=>{
 const r=runner('P10');r.go('record',{params:lightPack});r.go('advance');r.go('record',{params:{frequency:9,flux:1}});assert.equal(r.api.quote(r.state,{type:'record',params:{frequency:10,flux:5},basis:r.state.records.at(-1).id}).discount,false);
});
for(const id of ['P10','M10','C08'])for(const role of ['assistant','maker','skeptic'])test(`${id} ${role} can complete optional research within starting resources`,()=>{
 const r=runner(id,role);complete(id,r);assert.equal(r.state.bestStars,3);assert.ok(r.state.resources.time>=0&&r.state.resources.tools>=0);assert.equal(r.state.supplies,0);assert.equal(r.state.failures,0);
 const forged=structuredClone(r.state);forged.records[0].measurement={prediction:999};forged.resources.time=999;assert.deepEqual(r.api.restore(forged).state,r.state);
});
for(const id of ['P10','M10','C08'])test(`${id} two ordinary goal records suffice for two-star main completion`,()=>{const r=runner(id);complete(id,r,false);assert.equal(r.state.bestStars,2);assert.equal(r.state.records.length,2);assert.equal(r.state.studies.length,0);});
test('fit and prediction use only three disclosed points',()=>{
 const p=M.normalize('M10',0,{a:.05,b:-1.2,c:15});const result=M.evaluate('M10',0,p);near(result.measurement.maxError,.2);near(result.measurement.prediction,15);assert.ok(result.goalSupported);assert.equal('observation' in result.measurement,false);assert.equal(JSON.stringify(result).includes('15.000 /'),false);
});
test('disclosure uses the actual first saved prediction, never the caller supplied cache',()=>{
 const r=runner('M10');r.go('record',{params:{a:.051,b:-1.22,c:15}});const original=structuredClone(r.state.records[0]);r.go('advance');r.go('record',{params:{a:.08,b:-.8,c:16,originalPrediction:999,observation:999}});const m=r.state.records.at(-1).measurement;near(m.originalPrediction,15.096);near(m.observation,15);near(m.error,.096);assert.deepEqual(r.state.records[0],original);assert.ok(m.revisedPrediction!==m.originalPrediction);
});
test('a fit made after disclosure cannot become another prior prediction',()=>{
 const r=runner('M10');r.go('record',{params:{a:.05,b:-1.2,c:15}});r.go('advance');r.go('record',{params:{a:.05,b:-1.2,c:15}});r.go('supplement',{condition:0});r.go('record',{params:{a:.051,b:-1.22,c:15}});assert.equal(r.state.records.at(-1).recordValid,false);assert.equal(M.sealed(r.state).length,1);assert.equal(M.reviewCommand(r.state),null);
});
test('post-disclosure reference is allowed without laundering it as an independent forecast',()=>{
 const r=runner('M10');r.go('record',{params:{a:.05,b:-1.2,c:15}});r.go('advance');r.go('record',{params:{a:.05,b:-1.2,c:15}});r.go('supplement',{condition:0});r.go('record',{params:{a:.051,b:-1.22,c:15},claim:'reference'});assert.equal(r.state.records.at(-1).recordValid,true);assert.equal(r.state.records.at(-1).goalSupported,false);assert.equal(M.sealed(r.state).length,1);
});
test('changing an unused claim before disclosure does not create a second forecast',()=>{
 const r=runner('M10');r.go('record',{params:{a:.05,b:-1.2,c:15}});assert.equal(r.api.quote(r.state,{type:'record',params:{a:.05,b:-1.2,c:15,claim:'accurate'}}).reason,'duplicate-record');
});
test('poor independent precision is valid if reported honestly, and an unsupported precision claim costs resources',()=>{
 const r=runner('M10');r.go('record',{params:{a:.055,b:-1.3,c:15.3}});assert.ok(r.state.records[0].goalSupported);assert.ok(Math.abs(r.state.records[0].measurement.prediction-15)>.5);r.go('advance');r.go('record',{params:{claim:'accurate'}});assert.equal(r.state.failures,1);assert.equal(r.state.records.at(-1).recordValid,false);r.go('record',{params:{claim:'honest'}});r.go('archive',{scope:'tested'});assert.equal(r.state.bestStars,2);
});
test('prediction comparison requires two real undisclosed source records and completed observation check',()=>{
 const r=runner('M10');r.go('record',{params:{a:.05,b:-1.2,c:15}});r.go('record',{params:{a:.051,b:-1.22,c:15}});assert.equal(M.reviewCommand(r.state),null);r.go('advance');r.go('record',{params:{}});const cmd=M.reviewCommand(r.state);assert.ok(cmd);assert.equal(r.api.quote(r.state,{type:'review',...cmd,references:['invented']}).allowed,false);r.go('review',cmd);near(r.state.studies[0].measurement.errors[1],.096);assert.equal(r.state.records.length,3);
});
test('mass stays in the total account while the chosen scale boundary changes',()=>{
 const open=M.mass({lid:'open',gas:8,boundary:'vessel'}),wide=M.mass({lid:'open',gas:8,boundary:'all'}),closed=M.mass({lid:'closed',gas:8,boundary:'vessel'});assert.deepEqual(open,{inside:92,escaped:8,total:100,scale:92});assert.equal(wide.scale,100);assert.equal(closed.inside,100);assert.equal(closed.escaped,0);
});
test('paired mass pack requires the same current gas amount in both open and closed views',()=>{
 assert.equal(M.evaluate('C08',0,M.normalize('C08',0,gasPack(8))).goalSupported,true);assert.equal(M.evaluate('C08',0,M.normalize('C08',0,{...gasPack(8),gas:12})).goalSupported,false);assert.equal(M.boundaryPack([{lid:'open',gas:8},{lid:'closed',gas:12}]),false);
});
test('interpretation does not change measured mass and false disappearance is penalized',()=>{
 const r=runner('C08');const a=M.normalize('C08',0,gasPack(8)),b={...a,claim:'vanished'};assert.deepEqual(M.evaluate('C08',0,a).measurement,M.evaluate('C08',0,b).measurement);r.go('record',{params:b});assert.equal(r.state.failures,1);r.go('record',{params:a});assert.equal(r.state.records.at(-1).factRef,r.state.records[0].id);
});
test('changing only the boundary or judgement does not earn gas comparison',()=>{
 const r=runner('C08');r.go('record',{params:gasPack(8)});for(const params of [{...gasPack(8),boundary:'all'},{...gasPack(8),claim:'vanished'}])assert.equal(r.api.quote(r.state,{type:'record',params,basis:r.state.records[0].id}).discount,false);
});
test('independent equation retains molecular formulas and demands smallest integer coefficients',()=>{
 const good=M.evaluate('C08',1,M.normalize('C08',1,{h2:2,o2:1,h2o:2})),doubled=M.evaluate('C08',1,M.normalize('C08',1,{h2:4,o2:2,h2o:4}));assert.ok(good.goalSupported);assert.deepEqual(good.measurement.left,{H:4,O:2});assert.equal(doubled.measurement.balanced,true);assert.equal(doubled.goalSupported,false);assert.equal(M.evaluate('C08',1,M.normalize('C08',1,{h2:1.5})).legal,false);assert.equal(good.fixed.source,'independent symbolic equation');
});
test('invalid numeric values and oversized preview packs cannot be charged as experiments',()=>{
 for(const [id,c,p] of [['P10',0,{frequency:NaN}],['P10',0,{trials:Array(9).fill({frequency:4.5,flux:1})}],['M10',0,{a:Infinity}],['C08',0,{gas:-1}],['C08',1,{o2:0}]]){const r=runner(id);assert.throws(()=>M.normalize(id,c,p));assert.equal(r.api.quote({...r.state,activeCondition:c},{type:'record',params:p}).allowed,false);assert.equal(r.state.events.length,0);}
});
function artifacts(){let p={...W.fields()};for(const id of ['P10','M10','C08']){const r=runner(id);complete(id,r);const rev=r.state.revisions[0];p.mailArtifacts[id]={id,title:D.tasks[id].title,complete:true,currentRef:rev.id,revisions:[{ref:rev.id,source:'worldline-1',records:r.state.records,studies:r.state.studies}]};}return p;}
test('fifteen main results can all provide a real-sourced letter, while side references stay optional',()=>{assert.equal(D.letterSources.length,30);assert.ok(D.letterSources.includes('P09'));const p=artifacts();assert.ok(W.letter(p,'M10').text.includes('15.000'));assert.ok(W.letter(p,'P10').text.includes('3.5 eV'));assert.ok(W.letter(p,'C08').text.includes('2∶1∶2'));});
test('legacy completion has no fabricated new-model values in letter or final pages',()=>{
 const p={...W.fields()};for(const id of ['P10','M10','C08'])p.mailArtifacts[id]={id,complete:true,currentRef:'old-'+id,revisions:[{ref:'old-'+id,records:[],source:'legacy-completion'}]};assert.equal(Delivery.pages(p).every(p=>!p.typed&&p.readings.length===0),true);assert.ok(!W.letter(p,'M10').text.includes('15.000'));
});
test('final pages and selected letter retain their actual revision after later research',()=>{
 let p=artifacts();for(const chapter of D.chapters)for(const id of chapter.main)if(!p.mailArtifacts[id])p.mailArtifacts[id]={id,complete:true,currentRef:'old-'+id,revisions:[{ref:'old-'+id,records:[]}]};for(const chapter of D.chapters)p=W.deliver(p,chapter.id).progress;p=W.selectLetter(p,'M10').progress;const before=JSON.stringify(p),pages=Delivery.pages(p),letter=W.letter(p);assert.equal(JSON.stringify(p),before);const a=p.mailArtifacts.M10;a.revisions.push({...a.revisions[0],ref:'later'});a.currentRef='later';assert.deepEqual(Delivery.pages(p),pages);assert.deepEqual(W.letter(p),letter);
});
