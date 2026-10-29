/* Free actions record inputs; paid statements remain in the shared research session. */
(() => {
  function create({host,id,getParams,getCondition,change}){
    let dead=false,pressed=null,pressKind=null,pressPointerId=null,frame=0,drag=null,audio=null,tone=null;
    const timers=new Set();
    const note=text=>{const el=host.querySelector('.cr-playback-note');if(el)el.textContent=text;};
    function later(fn,ms){const timer=setTimeout(()=>{timers.delete(timer);if(!dead)fn();},ms);timers.add(timer);}
    function stopTone(){if(tone){try{tone.stop();}catch{}tone=null;}}
    function startTone(){
      stopTone();if(window.AtlasPhysicsSound.isMuted())return;
      try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audio??=new Audio();audio.resume().catch(()=>{});tone=audio.createOscillator();const gain=audio.createGain();tone.type='square';tone.frequency.value=620;gain.gain.value=.025;tone.connect(gain);gain.connect(audio.destination);tone.start();tone.onended=()=>gain.disconnect();}catch{tone=null;}
    }
    function stopReplay(){for(const timer of timers)clearTimeout(timer);timers.clear();stopTone();host.querySelectorAll('[data-cr-step]').forEach(el=>el.style.opacity='');const label=host.querySelector('.cr-replay-label');if(label)label.textContent='';}
    function cancelPress(){pressed=null;pressKind=null;pressPointerId=null;cancelAnimationFrame(frame);frame=0;stopTone();host.querySelector('[data-cr-action=key]')?.classList.remove('is-down');}
    function inputTime(event){const now=performance.now(),stamp=event?.timeStamp;return Number.isFinite(stamp)&&stamp>=0&&Math.abs(stamp-now)<60000?stamp:now;}
    function tick(){if(dead||pressed===null)return;const el=host.querySelector('.cr-key-time');if(el)el.textContent=`${Math.round(performance.now()-pressed)} ms · 松开记一音`;if(window.AtlasPhysicsSound.isMuted())stopTone();frame=requestAnimationFrame(tick);}
    function begin(kind,event){if(dead||pressed!==null)return;stopReplay();pressed=inputTime(event);pressKind=kind;pressPointerId=event.pointerId??null;host.querySelector('[data-cr-action=key]')?.classList.add('is-down');startTone();tick();}
    function finish(event){if(pressed===null||dead)return;const duration=Math.round(inputTime(event)-pressed);cancelPress();if(duration<20||duration>10000){note('这一按太短或超过 10 秒，未写入纸带；可以免费重来。');return;}const p=getParams();if(p.pulses.length>=12){note('纸带已满；先撤回或清空再试。');return;}change({pulses:[...p.pulses,duration]});}
    function replay(){
      stopReplay();if(id==='P07'){
        const pulses=getParams().pulses;if(!pulses.length){note('先亲手按一段，再回放。');return;}
        let offset=0;for(const [i,ms] of pulses.entries()){later(()=>{note(`回放第 ${i+1} 音 / ${ms} ms（原始时长）`);startTone();},offset);later(stopTone,offset+ms);offset+=ms+200;}later(()=>note('回放结束。时序未被改写，预听不扣费。'),offset);
      }else if(id==='M06'){
        const count=getParams().order.length;if(!count){note('先放操作卡。');return;}
        const show=i=>{host.querySelectorAll('[data-cr-step]').forEach(el=>el.style.opacity=Number(el.dataset.crStep)===i?'1':'.12');const label=host.querySelector('.cr-replay-label');if(label)label.textContent=`第 ${i+1} 步 / ${window.AtlasRevisionModels.operations[getParams().order[i]]}`;note(`第 ${i+1} 步保留对应顶点。最后再按给定中心缩放。`);};
        if(host.classList.contains('fv-motion-paused')||matchMedia('(prefers-reduced-motion: reduce)').matches){show(count-1);note('减少动态效果：直接显示最后一步；全部步骤已列在读数与手记。');}else{for(let i=0;i<count;i++)later(()=>show(i),i*800);later(()=>{stopReplay();note('回放完成。最终青色轮廓包含缩放。');},count*800+500);}
      }
    }
    function place(pair,zone){if(!Number.isInteger(pair)||!getParams().placements?.[pair])return;const p=getParams(),placements=[...p.placements];placements[pair]=zone;change({placements,links:p.links.filter(l=>placements[l.pair]==='bond')});}
    function map(pair,line){const p=getParams();if(p.placements[pair]!=='bond')return;change({links:[...p.links.filter(l=>l.pair!==pair),{pair,line}]});}
    function click(event){
      const b=event.target.closest('button');if(!b||!host.contains(b)||b.disabled||dead)return;
      const p=getParams(),action=b.dataset.crAction;
      if(action&&action!=='key')stopReplay();
      if(action==='undo-pulse')change({pulses:p.pulses.slice(0,-1)});
      if(action==='clear-pulses')change({pulses:[]});
      if(action==='add-op'&&!p.order.includes(b.dataset.crOp))change({order:[...p.order,b.dataset.crOp]});
      if(action==='remove-op')change({order:p.order.filter((_,i)=>i!==Number(b.dataset.crIndex))});
      if(action==='up-op'){const order=[...p.order],i=Number(b.dataset.crIndex);if(i>0){[order[i-1],order[i]]=[order[i],order[i-1]];change({order});}}
      if(action==='clear-order')change({order:[]});
      if(action==='place')place(Number(host.querySelector('[data-cr-pick]').value),b.dataset.crZone);
      if(action==='map')map(Number(b.dataset.crPair),Number(b.dataset.crLine));
      if(action==='replay')replay();
    }
    function down(event){
      if(event.target.closest('[data-cr-action=key]')){event.preventDefault();event.target.closest('button').focus();begin('pointer',event);return;}
      const pair=event.target.closest('[data-cr-pair], [data-cr-link]'),dial=event.target.closest('[data-cr-dial]');
      if(pair){event.preventDefault();stopReplay();drag={kind:pair.hasAttribute('data-cr-link')?'link':'pair',pair:Number(pair.dataset.crPair??pair.dataset.crLink)};}
      if(dial){event.preventDefault();stopReplay();drag={kind:'dial'};move(event);}
    }
    function move(event){if(drag?.kind!=='dial')return;const svg=host.querySelector('.cr-scene'),p=svg.createSVGPoint();p.x=event.clientX;p.y=event.clientY;const point=p.matrixTransform(svg.getScreenCTM().inverse());const angle=Math.atan2(point.x-390,139-point.y)*180/Math.PI;change({tuning:Math.max(1,Math.min(7,Math.round((4+angle/25)*10)/10))});}
    function up(event){
      if(pressKind==='pointer'&&event.pointerId===pressPointerId)finish(event);
      const target=document.elementFromPoint(event.clientX,event.clientY);
      if(drag?.kind==='pair'){const zone=target?.closest('[data-cr-zone]')?.dataset.crZone;if(zone)place(drag.pair,zone);}
      if(drag?.kind==='link'){const line=target?.closest('[data-cr-line]')?.dataset.crLine;if(line!==undefined)map(drag.pair,Number(line));}
      drag=null;
    }
    function keydown(event){if(event.target.closest('[data-cr-action=key]')&&[' ','Enter'].includes(event.key)){event.preventDefault();if(!event.repeat)begin('keyboard',event);}}
    function keyup(event){if([' ','Enter'].includes(event.key)&&pressKind==='keyboard'){event.preventDefault();finish(event);}}
    function dragstart(event){const card=event.target.closest('[data-cr-op], [data-cr-move]');if(!card)return;event.dataTransfer.setData('application/x-revision',JSON.stringify(card.dataset.crMove!==undefined?{from:Number(card.dataset.crMove)}:{op:card.dataset.crOp}));event.dataTransfer.effectAllowed='move';}
    function dragover(event){if(event.target.closest('[data-cr-order]')&&event.dataTransfer.types.includes('application/x-revision'))event.preventDefault();}
    function drop(event){
      const target=event.target.closest('[data-cr-index]');if(!target)return;
      let payload;try{payload=JSON.parse(event.dataTransfer.getData('application/x-revision'));}catch{return;}
      event.preventDefault();stopReplay();const order=[...getParams().order],index=Number(target.dataset.crIndex);
      if(Number.isInteger(payload.from)&&payload.from>=0&&payload.from<order.length){const [op]=order.splice(payload.from,1);order.splice(Math.min(index,order.length),0,op);}
      else if(Object.hasOwn(window.AtlasRevisionModels.operations,payload.op)&&!order.includes(payload.op))order.splice(index,0,payload.op);
      change({order});
    }
    function reset(){cancelPress();stopReplay();drag=null;}
    function visibility(){if(document.hidden)reset();}
    function soundChanged(){if(window.AtlasPhysicsSound.isMuted())stopTone();}
    const listeners={click,pointerdown:down,keydown,dragstart,dragover,drop};Object.entries(listeners).forEach(([event,fn])=>host.addEventListener(event,fn));
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',reset);window.addEventListener('keyup',keyup);window.addEventListener('blur',reset);document.addEventListener('visibilitychange',visibility);
    window.addEventListener('atlas-sound-change',soundChanged);
    return {reset,pause(value){if(value)stopReplay();},destroy(){dead=true;reset();audio?.close().catch(()=>{});window.removeEventListener('atlas-sound-change',soundChanged);Object.entries(listeners).forEach(([event,fn])=>host.removeEventListener(event,fn));window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',reset);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',reset);document.removeEventListener('visibilitychange',visibility);}};
  }
  window.AtlasRevisionRuntime={create};
})();
