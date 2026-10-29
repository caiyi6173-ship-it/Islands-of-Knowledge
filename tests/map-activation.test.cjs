const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createClickPair}=require('../src/map-activation.js');
const point=(time,target,x=200,y=300)=>({time,target,x,y});
test('one click leaves preview handling immediate and does not enter',()=>{
  const pair=createClickPair();assert.equal(pair.click(point(0,{kind:'island',id:'P'})),null);
});
test('the second click enters the first logical place after its marker is rebuilt or moved',()=>{
  const pair=createClickPair(),first={kind:'level',id:'P07'};
  pair.click(point(0,first));assert.equal(pair.click(point(180,null)),first);
  assert.equal(pair.wasHandled(point(181,null)),true);
});
test('an overlay under the old marker cannot redirect the same double gesture',()=>{
  const pair=createClickPair(),first={kind:'level',id:'C06'};
  pair.click(point(0,first));assert.equal(pair.click(point(350,{kind:'already-open',direct:true})),first);
});
test('two clicks on a direct entrance are paired without requesting another entry',()=>{
  const pair=createClickPair(),station={kind:'already-open',direct:true};
  pair.click(point(0,station));assert.equal(pair.click(point(200,null)).direct,true);
});
test('slow clicks and clicks at different positions remain separate previews',()=>{
  const pair=createClickPair(),a={kind:'island',id:'P'},b={kind:'island',id:'M'};
  pair.click(point(0,a));assert.equal(pair.click(point(700,a)),null);
  assert.equal(pair.click(point(710,b,230,300)),null);
});
test('moving away or keyboard/wheel cancellation clears the prior gesture',()=>{
  const pair=createClickPair(),a={kind:'level',id:'M03'};
  pair.click(point(0,a));pair.move(point(30,null,220,300));assert.equal(pair.click(point(100,a)),null);
  pair.reset();assert.equal(pair.click(point(200,a)),null);
});
test('a native double-click is suppressed only after its second click has been handled',()=>{
  const pair=createClickPair(),a={kind:'level',id:'P01'};
  pair.click(point(0,a));assert.equal(pair.wasHandled(point(50,a)),false);
  pair.click(point(150,a));assert.equal(pair.wasHandled(point(151,null)),true);
  assert.equal(pair.wasHandled(point(1000,null)),false);
});
