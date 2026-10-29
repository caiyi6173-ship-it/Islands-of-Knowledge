/* Shared, optional pixel cues. Every cue has a visible text equivalent. */
(() => {
  let context=null,muted=false;
  const voices=new Set();
  try { muted=localStorage.getItem('atlas_physics_sound_muted')==='true'; } catch {}
  function stopAll(){for(const voice of voices){try{voice.stop();}catch{}}voices.clear();}
  function getContext(){
    const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return null;
    context??=new Audio();if(context.state==='suspended')context.resume().catch(()=>{});return context;
  }
  function melody(notes,{wave='triangle',spacing=.075,duration=.15,volume=.045}={}){
    if(muted||document.hidden)return;
    try{
      const c=getContext();if(!c)return;stopAll();
      notes.forEach((frequency,index)=>{
        const oscillator=c.createOscillator(),gain=c.createGain(),start=c.currentTime+index*spacing;
        oscillator.type=wave;oscillator.frequency.setValueAtTime(frequency,start);
        gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(volume,start+.008);
        gain.gain.exponentialRampToValueAtTime(.001,start+duration);
        oscillator.connect(gain);gain.connect(c.destination);voices.add(oscillator);
        oscillator.onended=()=>{voices.delete(oscillator);oscillator.disconnect();gain.disconnect();};
        oscillator.start(start);oscillator.stop(start+duration+.01);
      });
    }catch{stopAll();}
  }
  function setMuted(value){
    muted=value;if(muted)stopAll();
    try{localStorage.setItem('atlas_physics_sound_muted',String(muted));}catch{}
    window.dispatchEvent(new CustomEvent('atlas-sound-change',{detail:{muted}}));return muted;
  }
  window.addEventListener('blur',stopAll);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAll();});
  window.addEventListener('storage',event=>{if(event.key==='atlas_physics_sound_muted')setMuted(event.newValue==='true');});
  window.AtlasPhysicsSound={
    playClick:()=>melody([600],{wave:'square',duration:.035,volume:.025}),
    playParam:()=>melody([440,587.33],{spacing:.025,duration:.04,volume:.02}),
    playReference:()=>melody([440,523.25],{duration:.09}),
    playEureka:()=>melody([523.25,659.25,783.99],{wave:'square',duration:.13,volume:.035}),
    playWarning:()=>melody([330,293.66],{spacing:.12,duration:.11}),
    playError:()=>melody([220,174.61,146.83],{duration:.12}),
    playSuccess:()=>melody([392,523.25,659.25,1046.5],{spacing:.09,duration:.23}),
    playArrival:()=>melody([659.25,783.99,1046.5],{spacing:.13,duration:.25}),
    toggleMute:()=>setMuted(!muted),isMuted:()=>muted,stopAll,
  };
})();
