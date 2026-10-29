const {test}=require('node:test');
const assert=require('node:assert/strict');
const {duration,frame}=require('../src/harbor-flight.js');
const {worldFit}=require('../src/map-camera.js');
const screens=[{w:1440,h:960,rect:{left:0,top:64,width:1440,height:852}},{w:390,h:844,rect:{left:0,top:110,width:390,height:692}},{w:844,h:390,rect:{left:0,top:60,width:844,height:288}},{w:1440,h:904,rect:{left:0,top:64,width:1440,height:796}}];
test('arrival camera lands at the live map rectangle across desktop, phone, landscape and save-warning layouts',()=>{
  for(const {w,h,rect} of screens){
    const end=frame(1,w,h,rect);
    assert.equal(end.centerX,rect.left+rect.width/2);assert.equal(end.centerY,rect.top+rect.height/2);
    assert.equal(end.mapScale,worldFit(rect.width,rect.height));
    assert.equal(end.pitch,0);assert.ok(Math.abs(end.roll)<1e-12);
    assert.equal(end.mapOpacity,1);assert.equal(end.uiOpacity,1);assert.equal(end.panoramaOpacity,0);assert.equal(end.skyOpacity,0);
    assert.ok(Math.abs(end.mist)<1e-12);assert.ok(end.mapMaskStart>=100);
  }
});
test('every sampled frame is finite and camera/visibility changes remain continuous',()=>{
  for(const {w,h,rect} of screens){
    let prev=frame(0,w,h,rect);
    for(let i=1;i<=2000;i++){
      const current=frame(i/2000,w,h,rect);
      for(const [key,value] of Object.entries(current))if(typeof value==='number')assert.ok(Number.isFinite(value),key);
      assert.ok(current.mapScale>0);assert.ok(current.mapScale<=prev.mapScale+1e-10);
      assert.ok(Math.abs(current.centerX-prev.centerX)<w*.01);assert.ok(Math.abs(current.centerY-prev.centerY)<h*.01);
      for(const key of ['mapOpacity','panoramaOpacity','skyOpacity','uiOpacity','copyOpacity'])assert.ok(current[key]>=0&&current[key]<=1,key);
      assert.ok(Math.abs(current.pitch-prev.pitch)<1);prev=current;
    }
  }
});
test('camera eases to a stop before the live map regains input',()=>{
  const {w,h,rect}=screens[0],end=frame(1,w,h,rect),near=frame(.999,w,h,rect);
  assert.ok(Math.abs(end.centerX-near.centerX)<.1);assert.ok(Math.abs(end.centerY-near.centerY)<.1);
  assert.ok(Math.abs(end.mapScale-near.mapScale)<1e-6);assert.equal(near.pitch,0);
  assert.equal(duration,7000);
});
test('out-of-range progress clamps to stable start and end frames',()=>{
  const {w,h,rect}=screens[0];assert.deepEqual(frame(-3,w,h,rect),frame(0,w,h,rect));assert.deepEqual(frame(8,w,h,rect),frame(1,w,h,rect));
});
