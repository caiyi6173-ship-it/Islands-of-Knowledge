const M=require('../src/appendix-models.js');
const proofs=M.subjects.M.proofs;
const op=(kind,amount)=>({kind,amount,side:'both'});
const base={
 P02:[{bells:[1,4,9]},{bells:[1,4,9]}],P04:[{coupled:'yes',retained:117.6},{coupled:'yes',retained:176.4}],
 P05:[{slits:'two',distance:.6},{slits:'two',distance:.45}],P08:[{subtract:'yes',scope:'anomaly'},{subtract:'yes',scope:'anomaly',batch:'B'}],P09:[{model:'planck',scope:'all'},{model:'planck',scope:'all'}],
 M01:[{length:2/3},{fraction:'17/12',proof:proofs.irrational}],M02:[{ops:[op('x',1),op('number',3)]},{ops:[op('number',5),op('divide',3)]}],
 M04:[{links:[[1,3],[3,7],[5,11]]},{links:[[1,3],[2,3],[3,7],[4,9],[5,11]]}],
 M07:[{a:3,b:4,c:5,proof:proofs.triangle},{a:3,b:4,c:5,scale:2,proof:proofs.triangle}],M09:[{dt:.5,proof:proofs.limit},{t:20,dt:.5,proof:proofs.minimum}],
 C05:[{a:2,b:1,copies:1},{a:1,b:3,copies:3}],C09:[{lost:2,gained:2},{charge:193,valence:2}],C03:[{slots:[1,1,2,2,0]},{na:1,cl:7,held:'open',eGroup:1}],C07:[{p:1,angle:180},{p:1,angle:104.5}],C02:[{carbon:1,oxygen:1,ratioClaim:1.33},{carbon:1,oxygen:2,ratioClaim:2.67}]
};
function complete(r,id,quality=true){
 if(id==='P09'&&quality)r.go('record',{params:{model:'classical'},claim:'reference'});
 r.go('record',{params:base[id][0],...(id==='P09'&&quality?{basis:r.state.records.at(-1).id}:{})});
 const extra={P05:{slits:'two',distance:1.2},M02:{ops:[op('number',3),op('x',1)]},M09:{dt:.1,proof:proofs.limit},C05:{a:2,b:1,copies:3},C02:{carbon:2,oxygen:2,ratioClaim:1.33}}[id];
 if(quality&&extra)r.go('record',{params:extra,basis:r.state.records.at(-1).id,...(id==='P05'?{claim:'reference'}:{})});
 if(quality&&id==='C07'){r.go('record',{params:{p:1,angle:180,mode:'abstract'},claim:'reference'});r.go('record',{params:{p:1,angle:120,mode:'abstract'},claim:'reference',basis:r.state.records.at(-1).id});}
 r.go('advance');r.go('record',{params:base[id][1]});
 if(quality&&id==='M04')r.go('record',{params:{links:[[1,3],[2,9],[3,7],[4,9],[5,11]]},basis:r.state.records.at(-1).id});
 if(quality&&id==='M07')r.go('record',{params:{...base.M07[1],scale:3},basis:r.state.records.at(-1).id});
 if(quality&&id==='C09')r.go('record',{params:{charge:386,valence:2},basis:r.state.records.at(-1).id});
 const review=M.reviewCommand(r.state);if(quality&&review)r.go('review',review);
 r.go('archive',{scope:'tested'});
}
module.exports={base,complete};
