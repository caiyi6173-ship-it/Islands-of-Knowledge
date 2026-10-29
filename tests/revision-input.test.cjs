const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function fixture(){
  const window=new EventTarget(),document=new EventTarget(),host=new EventTarget();let now=0,params={pulses:[]};
  window.AtlasPhysicsSound={isMuted:()=>true};document.hidden=false;
  document.elementFromPoint=()=>null;
  const key={classList:{add(){},remove(){}},focus(){}};
  host.closest=()=>key;host.querySelector=selector=>selector==='[data-cr-action=key]'?key:null;host.querySelectorAll=()=>[];
  vm.runInNewContext(fs.readFileSync(require.resolve('../src/revision-runtime.js'),'utf8'),{window,document,performance:{now:()=>now},matchMedia:()=>({matches:false}),requestAnimationFrame:()=>1,cancelAnimationFrame(){},setTimeout,clearTimeout});
  const runtime=window.AtlasRevisionRuntime.create({host,id:'P07',getParams:()=>params,getCondition:()=>0,change:updates=>params={...params,...updates}});
  function event(type,stamp,handlerTime,extra={}){now=handlerTime;const event=new Event(type,{cancelable:true});Object.defineProperties(event,Object.fromEntries(Object.entries({timeStamp:stamp,key:' ',...extra}).map(([k,v])=>[k,{value:v}])));(['keyup','pointerup'].includes(type)?window:host).dispatchEvent(event);}
  return {event,window,runtime,params:()=>params};
}
test('telegraph measures native input timestamps instead of handler/render delay',()=>{
  const f=fixture();f.event('keydown',100,500);f.event('keyup',300,1000);assert.deepEqual(Array.from(f.params().pulses),[200]);f.runtime.destroy();
});
test('repeated keydown does not restart the original physical press',()=>{
  const f=fixture();f.event('keydown',100,100);f.event('keydown',250,250,{repeat:true});f.event('keyup',900,950);assert.deepEqual(Array.from(f.params().pulses),[800]);f.runtime.destroy();
});
test('blur cancels an unfinished press without writing a phantom pulse',()=>{
  const f=fixture();f.event('keydown',100,100);f.window.dispatchEvent(new Event('blur'));f.event('keyup',300,300);assert.equal(f.params().pulses.length,0);f.runtime.destroy();
});
test('incompatible epoch timestamps fall back to the monotonic clock',()=>{
  const f=fixture();f.event('keydown',1700000000000,100);f.event('keyup',1700000000200,300);assert.deepEqual(Array.from(f.params().pulses),[200]);f.runtime.destroy();
});
test('a pointer press only finishes on the matching pointer and retains its input timestamps',()=>{
  const f=fixture();f.event('pointerdown',100,500,{pointerId:4});f.event('pointerup',200,700,{pointerId:5});assert.equal(f.params().pulses.length,0);f.event('pointerup',300,900,{pointerId:4});assert.deepEqual(Array.from(f.params().pulses),[200]);f.runtime.destroy();
});
