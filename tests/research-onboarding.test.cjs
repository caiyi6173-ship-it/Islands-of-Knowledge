const assert=require('node:assert/strict');
const {test}=require('node:test');
const {guides,operationNotes,readyStep,modeOf}=require('../src/research-onboarding.js');
test('all thirty tables explain their controls and running behavior for both conditions',()=>{
  assert.equal(Object.keys(guides).length,30);
  for(const [id,guide] of Object.entries(guides)){
    assert.ok(operationNotes[id],id);
    assert.equal(guide.lessons.length,2,id);
    for(const steps of guide.lessons)for(const step of steps){assert.ok(step.target&&step.title&&step.text&&step.watch,id);assert.ok(['choose','adjust','hold','assemble','replay','capture'].includes(modeOf(step)),id);}
  }
});
test('unchanged physical settings do not complete an operation',()=>{
  const step=guides.P01.lessons[0][0];
  assert.equal(readyStep(step,{shape:'lump'},{shape:'lump'},{shape:'lump'}),false);
  assert.equal(readyStep(step,{shape:'bowl'},{shape:'bowl'},{shape:'lump'}),true);
});
test('source selection may reaffirm an input but excludes the explicitly out-of-domain source',()=>{
  const step=guides.M04.lessons[0][0];
  assert.equal(readyStep(step,{source:1},{source:1},{source:1}),true);
  assert.equal(readyStep(step,{source:6},{source:6},{source:1}),false);
});
test('continuous input requires actual movement and the rotation instruction requires a full turn',()=>{
  const trace=[0,1,2,3].map(t=>({t:t*100,value:-2}));
  assert.equal(readyStep(guides.P06.lessons[0][0],{trace},{trace},{trace:[]}),false);
  trace[3].value=-1.8;
  assert.equal(readyStep(guides.P06.lessons[0][0],{trace},{trace},{trace:[]}),true);
  trace[3].value=180;
  assert.equal(readyStep(guides.P06.lessons[1][0],{trace},{trace},{trace:[]}),false);
  trace[3].value=360;
  assert.equal(readyStep(guides.P06.lessons[1][0],{trace},{trace},{trace:[]}),true);
});
test('replay and preview capture instructions are distinct from adjusting a setting',()=>{
  assert.equal(modeOf(guides.P02.lessons[0][1]),'replay');
  const capture=guides.P10.lessons[0][0];
  assert.equal(modeOf(capture),'capture');
  assert.equal(readyStep(capture,{flux:2},{flux:2,trials:[]},{flux:1,trials:[]}),false);
  assert.equal(readyStep(capture,{trials:[{flux:2}]},{trials:[{flux:2}]},{trials:[]}),true);
});
test('circuit comparison guidance waits for all three genuinely visited connections',()=>{
  const step=guides.C10.lessons[0][1],checks=[{wire:'on',bridge:'off'}];
  assert.equal(readyStep(step,{bridge:'on'},{bridge:'on',checks},{bridge:'off'}),false);
  checks.push({wire:'off',bridge:'on'},{wire:'on',bridge:'on'});
  assert.equal(readyStep(step,{bridge:'on'},{bridge:'on',checks},{bridge:'off'}),true);
});
