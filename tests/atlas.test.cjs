const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../src/atlas-models.js'),W=require('../src/worldline.js'),Book=require('../src/atlas-delivery.js');
const close=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
function runner(id,role='assistant'){
 const api=M.createSession(id);let state=api.fresh(role,'run-'+id),n=0;
 return {api,get state(){return state;},go(type,extra={}){const r=api.dispatch(state,{type,id:String(++n),runId:state.runId,expectedSequence:state.events.length,...extra});assert.equal(r.changed,true,r.reason);state=r.state;return state;}};
}
function view(yaw){const p=M.normalize('C06',0,{shape:'tetra',yaw,pitch:20,angleLabel:109.5});p.marks=M.molecule(p).depths;return p;}
function complete(id,r){
 if(id==='P03'){r.go('record',{params:{speed:10}});r.go('advance');r.go('record',{params:{ratio:.7},claim:'reference'});r.go('record',{params:{ratio:1},basis:r.state.records.at(-1).id});}
 if(id==='M05'){r.go('record',{params:{a:-.1,h:6,k:4.1}});r.go('advance');r.go('record',{params:{a:-.125,h:6,k:5}});r.go('review',M.reviewCommand(r.state));}
 if(id==='C06'){r.go('record',{params:view(25)});r.go('record',{params:view(115),basis:r.state.records.at(-1).id});r.go('advance');r.go('record',{params:{shape:'bent',yaw:115,pitch:20,angleLabel:104.5}});}
 r.go('archive',{scope:'tested'});
}
test('ground projectile uses its visible height, angle and gravity consistently',()=>{
 const p=M.normalize('P03',0,{speed:10}),result=M.evaluate('P03',0,p),raw=M.ground(10);assert.ok(result.goalSupported);close(raw.path.at(-1).y,0);close(raw.path.at(-1).x,raw.range);assert.ok(raw.range>=8&&raw.range<=12);assert.equal(result.fixed.height,1.5);assert.equal(result.fixed.units,'m,s');
});
test('circular path stays at radius 1.2 with normalized energy and model time',()=>{
 const r=M.orbit(1);assert.equal(r.kind,'circle');assert.ok(r.closed&&r.fullVisible);r.path.forEach(p=>close(Math.hypot(p.x,p.y),1.2));close(r.energy,-1/(2*1.2));close(r.path.at(-1).t,r.period,1e-6);
});
test('low speed intersects the physical sphere, not a fabricated closed curve',()=>{
 const r=M.orbit(.7);assert.equal(r.kind,'impact');assert.equal(r.closed,false);assert.equal(r.hit,true);close(Math.hypot(r.path.at(-1).x,r.path.at(-1).y),1);
});
test('a clipped ellipse remains bound; an escape path is independently classified by energy',()=>{
 const bound=M.orbit(1.3),open=M.orbit(1.5);assert.equal(bound.kind,'ellipse');assert.ok(bound.closed&&bound.clipped&&!bound.fullVisible&&bound.energy<0);assert.equal(open.kind,'open');assert.equal(open.closed,false);assert.ok(open.energy>0&&open.clipped);
});
test('elliptical model time obeys equal-area angular increments rather than uniform drawing speed',()=>{
 const r=M.orbit(1.1);assert.ok(r.fullVisible);const early=r.path[1].t-r.path[0].t,nearApo=r.path[180].t-r.path[179].t;assert.ok(nearApo>early);close(r.path.at(-1).t,r.period,.001);
});
test('purpose labels do not change physical measurements or create comparison discounts',()=>{
 const a=M.evaluate('P03',1,M.normalize('P03',1,{ratio:1,use:'model'})),b=M.evaluate('P03',1,M.normalize('P03',1,{ratio:1,use:'transport'}));assert.deepEqual(a.measurement,b.measurement);assert.ok(a.goalSupported);assert.equal(b.goalSupported,false);
 assert.equal(M.compare('P03',{condition:1,basis:{params:{ratio:1,use:'model'},measurement:a.measurement},params:{ratio:1,use:'transport'},result:b}).eligible,false);
});
for(const id of ['P03','M05','C06'])for(const role of ['assistant','maker','skeptic'])test(`${id} ${role} can afford both goals and optional research`,()=>{
 const r=runner(id,role);complete(id,r);assert.equal(r.state.bestStars,3);assert.equal(r.state.resources.time,role==='assistant'?4:2);assert.equal(r.state.resources.tools,role==='maker'?5:2);
 const forged=structuredClone(r.state);forged.resources.time=999;forged.records[0].fixed.conditions='invented';assert.deepEqual(r.api.restore(forged).state,r.state);
});
test('the bridge stores the curve actually used and both given abutments',()=>{
 const r=M.evaluate('M05',0,M.normalize('M05',0,{a:-.1,h:6,k:4.1}));assert.ok(r.goalSupported);close(r.measurement.left,.5);close(r.measurement.right,.5);assert.deepEqual(r.fixed.abutments,[[0,.5],[12,.5]]);
});
test('new bridge page fixes h and k explicitly and rejects contradictory payloads',()=>{
 const p=M.normalize('M05',1,{a:-.1});assert.deepEqual(p,{a:-.1,h:6,k:5});assert.throws(()=>M.normalize('M05',1,{a:-.1,h:5,k:4.1}));const r=M.evaluate('M05',1,p);assert.equal(r.goalSupported,false);assert.ok(!r.measurement.endsAligned);
});
test('a high vertex does not guarantee full-width clearance',()=>{
 const r=M.evaluate('M05',1,M.normalize('M05',1,{a:-.2}));close(r.measurement.minimum,3.2);assert.equal(r.goalSupported,false);assert.equal(r.measurement.minimumAt,3);assert.ok(r.fixed.notTested.includes('承重与结构安全'));
});
test('concave interval minimum agrees with endpoints and the numerical check',()=>{
 const p=M.normalize('M05',1,{a:-.125}),r=M.evaluate('M05',1,p);assert.ok(r.goalSupported);close(r.measurement.minimum,3.875);close(r.measurement.minimum,r.measurement.scanMinimum);
});
test('bridge proof is optional, source-linked and does not invent another measurement',()=>{
 const r=runner('M05');r.go('record',{params:{a:-.125,h:6,k:5}});r.go('advance');r.go('record',{params:{a:-.125}});r.go('archive',{scope:'tested'});assert.equal(r.state.bestStars,2);
 r.go('review',M.reviewCommand(r.state));r.go('archive',{scope:'tested'});assert.equal(r.state.bestStars,3);assert.equal(r.state.records.length,2);assert.equal(r.state.studies[0].references[0],r.state.records[1].id);assert.equal(M.review(r.state,{references:['foreign'],reasoning:'concave-clearance'}),null);
});
test('camera rotation changes projection but not the tetrahedral angle',()=>{
 const a=M.evaluate('C06',0,view(25)),b=M.evaluate('C06',0,view(115));close(a.measurement.actualAngle,109.47122063449069);close(a.measurement.actualAngle,b.measurement.actualAngle);assert.notEqual(a.measurement.projectedAngle,b.measurement.projectedAngle);assert.notDeepEqual(a.measurement.projections,b.measurement.projections);
});
test('annotating an angle never bends the molecular coordinates',()=>{
 const p=view(25),a=M.evaluate('C06',0,p),b=M.evaluate('C06',0,{...p,angleLabel:90});assert.deepEqual(a.measurement,b.measurement);assert.ok(a.goalSupported);assert.equal(b.goalSupported,false);
});
test('water is a separate bent modern model, with two hydrogens and two lone-pair regions',()=>{
 const p=M.normalize('C06',1,{shape:'bent',angleLabel:104.5}),r=M.evaluate('C06',1,p);assert.ok(r.goalSupported);close(r.measurement.actualAngle,104.5);assert.equal(r.measurement.peripheralAtoms,2);assert.equal(r.fixed.lonePairs,2);assert.equal(r.fixed.molecule,'H2O');
});
test('degenerate projection is reported instead of inventing a planar angle',()=>{
 const p=M.normalize('C06',0,{shape:'flat',yaw:90,pitch:0}),r=M.evaluate('C06',0,p);assert.equal(r.measurement.projectedAngle,null);close(r.measurement.actualAngle,90);
});
test('rotating a camera alone earns no third-star comparison',()=>{
 const a={...view(25),marks:Array(4).fill('')},b={...view(115),marks:Array(4).fill('')},result=M.evaluate('C06',0,b);assert.equal(M.compare('C06',{condition:0,basis:{params:a,goalSupported:true},params:b,result}).eligible,false);
});
test('stale or incorrect vertex marks do not survive as a valid new-view correspondence',()=>{
 const a=view(25),b={...view(115),marks:a.marks},result=M.evaluate('C06',0,b);assert.equal(result.model.mapping,false);assert.equal(M.compare('C06',{condition:0,basis:{params:a,goalSupported:true},params:b,result}).eligible,false);
});
test('invalid physical parameters and vertex mappings are rejected before cost',()=>{
 assert.throws(()=>M.normalize('P03',1,{ratio:NaN}));assert.throws(()=>M.normalize('M05',0,{a:0}));assert.throws(()=>M.normalize('C06',0,{yaw:Infinity}));assert.throws(()=>M.normalize('C06',0,{marks:['front']}));
});
test('formal overclaim pays the displayed cost while free observation stays free',()=>{
 const r=runner('P03'),before=structuredClone(r.state.resources);M.evaluate('P03',0,M.normalize('P03',0,{speed:10,use:'transport'}));assert.deepEqual(r.state.resources,before);r.go('record',{params:{speed:10,use:'transport'}});assert.equal(r.state.resources.time,before.time-2);assert.equal(r.state.resources.trust,before.trust-1);assert.equal(r.state.failures,1);
});
function artifactProgress(id){const r=runner(id);complete(id,r);const state=r.state,ref=state.revisions.at(-1).id;return {...W.fields(),mailArtifacts:{[id]:{id,title:id,complete:true,currentRef:ref,bestStars:3,revisions:[{ref,records:state.records,studies:state.studies,source:'worldline-1'}]}}};}
test('front pages show saved model scope and never turn old completion metadata into invented readings',()=>{
 const p=artifactProgress('P03'),page=Book.pages(p)[0];assert.ok(page.typed);assert.ok(page.purpose.includes('环绕'));assert.ok(page.conditions.includes('r₀=1.2'));assert.ok(page.readings.length);
 const legacy={...W.fields(),mailArtifacts:{P03:{id:'P03',currentRef:'old',revisions:[{ref:'old',records:[]}]}}};const old=Book.pages(legacy)[0];assert.equal(old.typed,false);assert.deepEqual(old.readings,[]);assert.ok(old.conditions.includes('未保留'));
});
test('replayed front pages keep the actually sent revision after a later research revision',()=>{
 const p=artifactProgress('M05'),artifact=p.mailArtifacts.M05,oldRef=artifact.currentRef;p.mailDeliveries.R04={artifacts:{M05:oldRef}};
 const later=structuredClone(artifact.revisions[0]);later.ref='later';later.records[1].fixed.conditions='a later page';artifact.revisions.push(later);artifact.currentRef='later';const sent=Book.pages(p)[1];assert.equal(sent.ref,oldRef);assert.ok(!sent.conditions.includes('a later page'));
});
test('local atlas artifacts cannot skip prior chapter deliveries',()=>{const p=artifactProgress('C06');assert.equal(W.status(p,'R04').ready,false);assert.equal(W.deliver(p,'R04').changed,false);});
