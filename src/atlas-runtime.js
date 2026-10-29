/* Pointer manipulation and model-time playback never spend research resources. */
(() => {
  function create({host,id,getParams,getCondition,change}){
    const M=window.AtlasAtlasModels,A=window.AtlasAtlasArt;
    let dead=false,drag=null,frame=0,paused=id==='P03'&&matchMedia('(prefers-reduced-motion: reduce)').matches,last=0,elapsed=0,cacheKey='',path=[];
    function point(e){const svg=host.querySelector('.at-scene');if(!svg)return null;const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}
    function down(e){
      const handle=e.target.closest('[data-at-handle]'),rotate=e.target.closest('[data-at-rotate]');
      if(handle){e.preventDefault();handle.focus();drag={kind:handle.dataset.atHandle};move(e);}
      else if(rotate){e.preventDefault();rotate.focus?.();drag={kind:'camera',x:e.clientX,y:e.clientY,yaw:getParams().yaw,pitch:getParams().pitch};}
    }
    function move(e){
      if(!drag||dead)return;const p=getParams();
      if(drag.kind==='camera'){change({yaw:Math.max(-180,Math.min(180,Math.round((drag.yaw+(e.clientX-drag.x)*.65)/5)*5)),pitch:Math.max(-65,Math.min(65,Math.round((drag.pitch-(e.clientY-drag.y)*.45)/5)*5))});return;}
      const pos=point(e);if(!pos)return;const x=(pos.x-44)/46,y=(312-pos.y)/36;
      if(drag.kind==='vertex'&&!getCondition())change({h:Math.max(4,Math.min(8,Math.round(x*10)/10)),k:Math.max(2.5,Math.min(6.5,Math.round(y*10)/10))});
      if(drag.kind==='opening')change({a:Math.max(-.25,Math.min(-.04,Math.round(((y-p.k)/9)/.005)*.005))});
    }
    function up(){drag=null;}
    function key(e){
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
      const handle=e.target.closest('[data-at-handle]'),rotate=e.target.closest('[data-at-rotate]');if(!handle&&!rotate)return;e.preventDefault();const p=getParams(),direction=['ArrowRight','ArrowUp'].includes(e.key)?1:-1;
      if(rotate){const key=['ArrowLeft','ArrowRight'].includes(e.key)?'yaw':'pitch',max=key==='yaw'?180:65;change({[key]:Math.max(-max,Math.min(max,p[key]+direction*5))});}
      else if(handle.dataset.atHandle==='opening')change({a:Math.max(-.25,Math.min(-.04,Number((p.a+direction*.005).toFixed(3))))});
      else if(!getCondition()){const key=['ArrowLeft','ArrowRight'].includes(e.key)?'h':'k',min=key==='h'?4:2.5,max=key==='h'?8:6.5;change({[key]:Math.max(min,Math.min(max,Number((p[key]+direction*.1).toFixed(1))))});}
    }
    function click(e){const b=e.target.closest('button');if(!b||b.disabled||dead)return;
      if(b.dataset.atAction==='angle')change({angleLabel:Number(b.dataset.atValue)});
      if(b.dataset.atAction==='mark'){const marks=[...getParams().marks];marks[Number(b.dataset.atIndex)]=b.dataset.atValue;change({marks});}
      if(b.dataset.atAction==='replay'){elapsed=0;last=0;}
    }
    function tick(now){
      if(dead)return;frame=requestAnimationFrame(tick);if(document.hidden||paused){last=0;return;}
      const p=getParams(),c=getCondition(),key=JSON.stringify([c,p]);if(key!==cacheKey){cacheKey=key;path=c?M.orbit(p.ratio).path:M.ground(p.speed).path;elapsed=0;last=0;}
      const dt=last?Math.min(80,now-last)/1000:0;last=now;elapsed+=dt;
      const end=path.at(-1)?.t||1,time=elapsed%(end+1),index=Math.max(0,path.findIndex(v=>v.t>=Math.min(time,end))),before=path[Math.max(0,index-1)],after=path[index];
      if(!before||!after)return;const f=after.t===before.t?0:(Math.min(time,end)-before.t)/(after.t-before.t),pos=A.physicalPoint(c,{x:before.x+(after.x-before.x)*f,y:before.y+(after.y-before.y)*f}),marker=host.querySelector('.at-moving');
      if(marker){marker.setAttribute('cx',pos[0]);marker.setAttribute('cy',pos[1]);}
    }
    function reset(){drag=null;elapsed=0;last=0;cacheKey='';}
    function visibility(){if(document.hidden){drag=null;last=0;}}
    const events={pointerdown:down,keydown:key,click};Object.entries(events).forEach(([event,fn])=>host.addEventListener(event,fn));window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);window.addEventListener('blur',up);document.addEventListener('visibilitychange',visibility);
    if(id==='P03')frame=requestAnimationFrame(tick);
    return {reset,pause(value){paused=value;last=0;},destroy(){dead=true;cancelAnimationFrame(frame);drag=null;Object.entries(events).forEach(([event,fn])=>host.removeEventListener(event,fn));window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);window.removeEventListener('blur',up);document.removeEventListener('visibilitychange',visibility);}};
  }
  window.AtlasAtlasRuntime={create};
})();
