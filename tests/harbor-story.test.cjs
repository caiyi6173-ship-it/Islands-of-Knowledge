const {test}=require('node:test');
const assert=require('node:assert/strict');
const {chapters,pageAt,sceneMotion,createExitGate}=require('../src/harbor-story.js');

test('six scenes introduce world, messenger, partner and commission before departure',()=>{
  assert.deepEqual(chapters.map(c=>c.id),['harbor','islands','messenger','companion','commission','departure']);
  assert.equal(new Set(chapters.map(c=>c.id)).size,6);
});
test('reading position supports tall scenes and scrolling back to an earlier chapter',()=>{
  const offsets=[0,800,1800,2600,3700,4700];
  assert.equal(pageAt(offsets,0,800),0);
  assert.equal(pageAt(offsets,1700,800),2);
  assert.equal(pageAt(offsets,800,800),1);
  assert.equal(pageAt(offsets,4900,800),5);
});

test('only on-screen scenes animate, including a tall scene being read near its bottom',()=>{
  assert.deepEqual(sceneMotion(800,0,800,800),{drift:-1,visible:false});
  assert.deepEqual(sceneMotion(800,800,800,800),{drift:0,visible:true});
  assert.deepEqual(sceneMotion(800,1600,800,800),{drift:1,visible:false});
  assert.equal(sceneMotion(800,1800,800,1600).visible,true);
  assert.equal(sceneMotion(800,4000,800,1600).visible,false);
  assert.equal(sceneMotion(800,4000,800,1600).drift,1);
  assert.ok(Number.isFinite(sceneMotion(0,0,0,0).drift));
});
test('the gesture arriving at departure and its inertia cannot launch',()=>{
  const gate=createExitGate();gate.move(false,0);gate.wheel(1000,10);gate.move(true,100);
  for(const now of [110,140,190,240,280])assert.equal(gate.wheel(100,now),false);
  assert.equal(gate.ready(500),false);
  assert.equal(gate.ready(610),true);
});
test('only a fresh deliberate downward gesture can accumulate the launch threshold',()=>{
  const gate=createExitGate();gate.move(true,100);
  assert.equal(gate.wheel(30,500),false);
  assert.equal(gate.wheel(50,530),false);
  assert.equal(gate.wheel(60,560),true);
});
test('upward input and leaving the final boundary cancel launch intent',()=>{
  const gate=createExitGate();gate.move(true,0);
  assert.equal(gate.wheel(90,500),false);assert.equal(gate.wheel(-30,550),false);
  assert.equal(gate.wheel(100,600),false);
  gate.move(false,620);assert.equal(gate.wheel(500,1000),false);assert.equal(gate.ready(2000),false);
  gate.move(true,2100);assert.equal(gate.ready(2200),false);assert.equal(gate.ready(2500),true);
  gate.reset();assert.equal(gate.ready(4000),false);
});
