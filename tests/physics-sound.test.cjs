const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');

function fixture(initial=false){
  const window=new EventTarget(),document=new EventTarget(),voices=[],storage=new Map([['atlas_physics_sound_muted',String(initial)]]);
  let contexts=0;
  document.hidden=false;
  const parameter={setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}};
  window.AudioContext=class{
    constructor(){contexts++;this.currentTime=10;this.state='running';this.destination={};}
    createGain(){return {gain:parameter,connect(){},disconnect(){}};}
    createOscillator(){const voice={frequency:parameter,start(at){this.startAt=at;},stop(at){if(at===undefined){this.cancelled=true;this.onended?.();}else this.stopAt=at;},connect(){},disconnect(){this.disconnected=true;}};voices.push(voice);return voice;}
  };
  vm.runInNewContext(fs.readFileSync(require.resolve('../src/physics-sound.js'),'utf8'),{window,document,CustomEvent,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}});
  return {sound:window.AtlasPhysicsSound,window,document,voices,storage,contexts:()=>contexts};
}
test('audio stays lazy, saved mute blocks synthesis, and reference/success/arrival have different scores',()=>{
  const f=fixture(true);f.sound.playArrival();assert.equal(f.contexts(),0);
  f.sound.toggleMute();f.sound.playReference();const reference=f.voices.map(v=>v.startAt);
  f.sound.playEureka();assert.ok(f.voices.slice(0,2).every(v=>v.cancelled&&v.disconnected));
  assert.equal(reference.length,2);assert.equal(f.voices.length,5);
  f.sound.playArrival();assert.equal(f.voices.length,8);assert.ok(f.voices.slice(5).every(v=>v.stopAt>v.startAt));
});
test('muting cancels active and future notes immediately and notifies instrument runtimes',()=>{
  const f=fixture();let events=0;f.window.addEventListener('atlas-sound-change',()=>events++);
  f.sound.playSuccess();assert.equal(f.voices.length,4);assert.ok(f.voices.at(-1).startAt>10);
  assert.equal(f.sound.toggleMute(),true);assert.ok(f.voices.every(v=>v.cancelled));
  assert.equal(f.storage.get('atlas_physics_sound_muted'),'true');assert.equal(events,1);
  f.sound.playError();assert.equal(f.voices.length,4);
});
test('blur, hidden documents and explicit exit dispose cues without changing preferences',()=>{
  const f=fixture();f.sound.playEureka();f.window.dispatchEvent(new Event('blur'));assert.ok(f.voices.every(v=>v.cancelled));
  f.sound.playWarning();f.document.hidden=true;f.document.dispatchEvent(new Event('visibilitychange'));assert.ok(f.voices.every(v=>v.cancelled));
  const count=f.voices.length;f.sound.playArrival();assert.equal(f.voices.length,count);
  f.document.hidden=false;f.sound.playSuccess();f.sound.stopAll();assert.ok(f.voices.every(v=>v.cancelled));assert.equal(f.sound.isMuted(),false);
});
test('a mute preference from another tab stops queued notes',()=>{
  const f=fixture();f.sound.playArrival();const event=new Event('storage');event.key='atlas_physics_sound_muted';event.newValue='true';f.window.dispatchEvent(event);
  assert.equal(f.sound.isMuted(),true);assert.ok(f.voices.every(v=>v.cancelled));
});
