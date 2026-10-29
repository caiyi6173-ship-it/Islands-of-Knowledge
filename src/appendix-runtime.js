(() => {
  function create({host,id,getParams,getCondition,change}){
    let dead=false,drag=null,frame=0,start=0,elapsed=0,paused=false,audio=null;const notes=new Set();
    const p=()=>getParams(),c=()=>getCondition(),M=window.AtlasAppendixModels;
    const point=e=>{const svg=host.querySelector('.ap-scene'),v=svg.createSVGPoint();v.x=e.clientX;v.y=e.clientY;return v.matrixTransform(svg.getScreenCTM().inverse());};
    function link(source,target){if(source===6)return;const links=p().links,found=links.findIndex(([a,b])=>a===source&&b===target);change({links:found<0?[...links,[source,target]]:links.filter((_,i)=>i!==found)});}
    function down(e){const h=e.target.closest('[data-ap-handle]'),source=e.target.closest('[data-ap-source]');if(source){e.preventDefault();drag={kind:'wire',source:Number(source.dataset.apSource)};change({source:drag.source});}else if(h){e.preventDefault();h.focus();drag={kind:h.dataset.apHandle};move(e);}}
    function move(e){if(!drag||dead||drag.kind==='wire')return;const q=point(e),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
      if(drag.kind.startsWith('bell-')){const bells=[...p().bells];bells[Number(drag.kind.slice(5))]=clamp(Math.round(((q.x-45)*Math.cos((c()?30:15)*Math.PI/180)+(q.y+28-90)*Math.sin((c()?30:15)*Math.PI/180))/45*10)/10,.3,9);change({bells});}
      if(drag.kind==='string')change({length:clamp(Math.round((q.x-65)/200*1000)/1000,.5,2)});
      if(drag.kind==='cursor')change({cursor:clamp(Math.round((q.x-55)/105*10)/10,.2,5)});
      if(drag.kind==='slit')change({distance:clamp(Math.round((q.x-60)/350*100)/100,.15,1.5)});
      if(drag.kind==='dipole')change({angle:clamp(Math.round(Math.atan2(219-q.y,q.x-228)*180/Math.PI*2)/2,0,180)});
    }
    function up(e){if(drag?.kind==='wire'&&e){const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-ap-target]');if(target)link(drag.source,Number(target.dataset.apTarget));}drag=null;}
    function key(e){const source=e.target.closest('[data-ap-source]');if(source&&['Enter',' '].includes(e.key)){e.preventDefault();change({source:Number(source.dataset.apSource)});return;}const h=e.target.closest('[data-ap-handle]');if(!h||!e.key.startsWith('Arrow'))return;e.preventDefault();const d=['ArrowUp','ArrowRight'].includes(e.key)?1:-1,key=h.dataset.apHandle;
      if(key.startsWith('bell-')){const bells=[...p().bells],i=Number(key.slice(5));bells[i]=Math.max(.3,Math.min(9,Number((bells[i]+d*.1).toFixed(1))));change({bells});}
      const setting={string:['length',.01,.5,2],cursor:['cursor',.1,.2,5],slit:['distance',.01,.15,1.5],dipole:['angle',.5,0,180]}[key];if(setting){const [name,step,min,max]=setting;change({[name]:Math.max(min,Math.min(max,Number((p()[name]+d*step).toFixed(3))))});}
    }
    function stopAudio(){notes.forEach(n=>{try{n.stop();}catch{}});notes.clear();}
    function pluck(){if(window.AtlasPhysicsSound.isMuted())return;const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audio??=new Audio();audio.resume().catch(()=>{});stopAudio();[220,220/p().length].forEach((f,i)=>{const osc=audio.createOscillator(),gain=audio.createGain(),at=audio.currentTime+i*.4;osc.type='triangle';osc.frequency.value=f;gain.gain.setValueAtTime(.045,at);gain.gain.exponentialRampToValueAtTime(.001,at+.35);osc.connect(gain);gain.connect(audio.destination);notes.add(osc);osc.onended=()=>{notes.delete(osc);osc.disconnect();gain.disconnect();};osc.start(at);osc.stop(at+.37);});}
    function replay(){
      cancelAnimationFrame(frame);start=0;elapsed=0;
      if(paused||matchMedia('(prefers-reduced-motion:reduce)').matches){
        // The static final state conveys the same result without a timed animation.
        if(id==='P02'){const ball=host.querySelector('.ap-ball');ball?.setAttribute('cx',45+405*Math.cos((c()?30:15)*Math.PI/180));ball?.setAttribute('cy',82+405*Math.sin((c()?30:15)*Math.PI/180));host.querySelectorAll('[data-ap-handle]').forEach(el=>el.setAttribute('data-rung','true'));}
        if(id==='P04')host.querySelector('.ap-hammer')?.setAttribute('transform','translate(0 48)');
        return;
      }
      frame=requestAnimationFrame(tick);
    }
    function tick(now){if(dead||paused||document.hidden)return;if(!start)start=now;elapsed=(now-start)/1000;const m=M.evaluate(id,c(),p()).measurement;if(id==='P02'){const x=Math.min(9,.5*m.acceleration*elapsed*elapsed),ball=host.querySelector('.ap-ball');ball?.setAttribute('cx',45+x*45*Math.cos((c()?30:15)*Math.PI/180));ball?.setAttribute('cy',82+x*45*Math.sin((c()?30:15)*Math.PI/180));host.querySelectorAll('[data-ap-handle]').forEach((el,i)=>el.setAttribute('data-rung',elapsed>=m.times[i]?'true':'false'));if(x>=9)return;}if(id==='P04'){const hammer=host.querySelector('.ap-hammer');hammer?.setAttribute('transform',`translate(0 ${Math.min(1,elapsed)*48})`);if(elapsed>=1)return;}frame=requestAnimationFrame(tick);}
    function click(e){const b=e.target.closest('button,[data-ap-wire]');if(!b||dead)return;
      if(b.dataset.apChoice)change({[b.dataset.apChoice]:b.dataset.apValue});
      if(b.dataset.apNumeric)change({[b.dataset.apNumeric]:Number(b.dataset.apNumber)});
      if(b.dataset.apLink)link(p().source,Number(b.dataset.apLink));
      if(b.dataset.apWire!==undefined)change({links:p().links.filter((_,i)=>i!==Number(b.dataset.apWire))});
      if(b.dataset.apProof&&p().proof.length<8)change({proof:[...p().proof,b.dataset.apProof]});
      if(b.dataset.apOp&&p().ops.length<8)change({ops:[...p().ops,{kind:b.dataset.apOp,amount:Number(b.dataset.apAmount),side:b.dataset.apSide}]});
      if(b.dataset.apClassify!==undefined){const slots=[...p().slots];slots[Number(b.dataset.apClassify)]=Number(b.dataset.apGroup);change({slots});}
      if(b.dataset.apAtom)change({[b.dataset.apAtom]:Math.min(5,p()[b.dataset.apAtom]+1)});
      if(b.dataset.apElectron)change({[b.dataset.apElectron]:Math.min(4,p()[b.dataset.apElectron]+1)});
      if(b.dataset.fvAction==='mute'&&window.AtlasPhysicsSound.isMuted())stopAudio();
      switch(b.dataset.apAction){case 'replay':replay();break;case 'pluck':pluck();break;case 'undo-proof':change({proof:p().proof.slice(0,-1)});break;case 'clear-proof':change({proof:[]});break;case 'undo-op':change({ops:p().ops.slice(0,-1)});break;case 'clear-op':change({ops:[]});break;case 'clear-links':change({links:[]});break;case 'copy':change({copies:Math.min(3,p().copies+1)});break;case 'double':change({carbon:p().carbon*2,oxygen:p().oxygen*2});break;}
    }
    function input(e){if(e.target.dataset.apBell!==undefined){const bells=[...p().bells];bells[Number(e.target.dataset.apBell)]=e.target.valueAsNumber;change({bells});}}
    function dragStart(e){const b=e.target.closest('[data-ap-proof]');if(b)e.dataTransfer.setData('text/x-appendix-proof',b.dataset.apProof);}
    function over(e){if(e.target.closest('[data-ap-proof-tray]')&&e.dataTransfer.types.includes('text/x-appendix-proof'))e.preventDefault();}
    function drop(e){const value=e.dataTransfer.getData('text/x-appendix-proof');if(e.target.closest('[data-ap-proof-tray]')&&window.AtlasAppendixMath.proofText[value]&&p().proof.length<8){e.preventDefault();change({proof:[...p().proof,value]});}}
    function blur(){up();cancelAnimationFrame(frame);stopAudio();}
    function soundChanged(){if(window.AtlasPhysicsSound.isMuted())stopAudio();}
    const events={pointerdown:down,keydown:key,click,input,dragstart:dragStart,dragover:over,drop};Object.entries(events).forEach(([k,fn])=>host.addEventListener(k,fn));window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);window.addEventListener('blur',blur);document.addEventListener('visibilitychange',blur);
    window.addEventListener('atlas-sound-change',soundChanged);
    return {reset(){up();cancelAnimationFrame(frame);stopAudio();},pause(v){paused=v;if(v){cancelAnimationFrame(frame);stopAudio();}},destroy(){dead=true;blur();audio?.close().catch(()=>{});window.removeEventListener('atlas-sound-change',soundChanged);Object.entries(events).forEach(([k,fn])=>host.removeEventListener(k,fn));window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',blur);}};
  }
  window.AtlasAppendixRuntime={create};
})();
