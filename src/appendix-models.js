(() => {
  const local=typeof module!=='undefined'&&module.exports;
  const get=(file,key)=>local?require(file):window[key],D=get('./appendix-data.js','AtlasAppendixData'),Research=get('./research-session.js','AtlasResearchSession');
  const subjects={P:get('./appendix-physics.js','AtlasAppendixPhysics'),M:get('./appendix-math.js','AtlasAppendixMath'),C:get('./appendix-chemistry.js','AtlasAppendixChemistry')};
  function normalize(id,c,p={}){if(!D.definitions[id]||![0,1].includes(c)||!p||typeof p!=='object'||Array.isArray(p))throw new RangeError('Unknown appendix parameters');return subjects[id[0]].normalize(id,c,p);}
  function evaluate(id,c,p){return subjects[id[0]].evaluate(id,c,p);}
  function reviewCommand(state){const records=state.records.filter(r=>r.recordValid&&r.goalSupported);if(![0,1].every(c=>records.some(r=>r.condition===c)))return null;const study=subjects[state.id[0]].study(state.id,records);return study?{references:records.map(r=>r.id),reasoning:'appendix-'+state.id}:null;}
  function review(state,command){const expected=reviewCommand(state);if(!expected||command.reasoning!==expected.reasoning||JSON.stringify(command.references)!==JSON.stringify(expected.references))return null;return {...subjects[state.id[0]].study(state.id,state.records.filter(r=>expected.references.includes(r.id))),references:expected.references,reasoning:expected.reasoning,verified:true};}
  function candidates(id,c,state){return state.records.filter(r=>r.condition===c&&r.recordValid).flatMap(r=>{
    const p=r.params;if(id==='P05'){const dark=c ? .45 : .6;return [{...p,distance:p.distance===dark?dark*2:dark}];}if(id==='P09')return [{...p,model:p.model==='planck'?'classical':'planck'}];
    if(id==='M02')return [{ops:[...p.ops].reverse()}];if(id==='M04'&&c)return [{...p,links:p.links.map(([x,y])=>[x,x===2?(y===1?2:1):y])}];if(id==='M07')return [{...p,scale:p.scale===2?3:2}];if(id==='M09')return [{...p,dt:p.dt===.5?.1:.5}];
    if(id==='C05')return [{...p,copies:p.copies===1?3:1}];if(id==='C09'&&c)return [{...p,charge:p.charge===193?386:193}];if(id==='C07')return [{...p,angle:p.angle===180?120:180,mode:'abstract'}];if(id==='C02')return [{...p,carbon:p.carbon*2,oxygen:p.oxygen*2}];return [];
  });}
  function createSession(id){if(!D.definitions[id])throw new RangeError('Unknown appendix level');return Research.create({id,modelVersion:`appendix-${id}-1`,normalize:(c,p)=>normalize(id,c,p),evaluate:(c,p)=>evaluate(id,c,p),compare:input=>subjects[id[0]].compare(id,input),candidates:(c,state)=>candidates(id,c,state),review,reviewCandidate:reviewCommand,consult:c=>({text:D.definitions[id].goals[c]+' '+D.definitions[id].quality})});}
  const api={definitions:D.definitions,ids:D.ids,subjects,normalize,evaluate,reviewCommand,review,createSession};if(local)module.exports=api;if(typeof window!=='undefined')window.AtlasAppendixModels=api;
})();
