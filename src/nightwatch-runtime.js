/* Free manipulation never dispatches a paid research command. */
(() => {
  function create({host,id,getParams,getCondition,change}){
    let frame=0,dead=false,drive=0,drag=null,pointer=null,last=0,clock=0,tail=0,collect=false,paused=id==='M08'&&matchMedia('(prefers-reduced-motion: reduce)').matches,boatTime=0,position=getParams().trace?.at(-1).value??0;
    let condition=getCondition(),trace=[];
    function reset(){drive=0;drag=null;collect=false;tail=0;last=0;clock=0;trace=[];position=getParams().trace?.at(-1).value??0;boatTime=0;}
    function begin(){if(!collect){position=getParams().trace?.at(-1).value??position;trace=[{t:0,value:position}];clock=0;tail=0;collect=true;}last=0;}
    function point(event){const svg=host.querySelector('.nw-scene');if(!svg)return null;const p=svg.createSVGPoint();p.x=event.clientX;p.y=event.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}
    function move(event){
      if(!drag)return;const p=point(event);if(!p)return;
      if(drag==='magnet')position=Math.max(-2,Math.min(-.5,(p.x-120)/125-2));
      if(drag==='rotor'){
        const angle=Math.atan2(p.y-160,p.x-320)*180/Math.PI;let delta=angle-pointer;if(delta>180)delta-=360;if(delta< -180)delta+=360;position+=delta;pointer=angle;
      }
      if(drag==='heading'){const angle=Math.atan2(269-p.y,p.x-470)*180/Math.PI;change({angle:Math.max(30,Math.min(150,Math.round(angle*100)/100))});}
    }
    function down(event){
      const button=event.target.closest('[data-nw-drive]'),handle=event.target.closest('[data-nw-handle], [data-nw-port]');if(!button&&!handle)return;
      event.preventDefault();if(button){button.focus();begin();drive=Number(button.dataset.nwDrive);return;}
      drag=handle.dataset.nwHandle||handle.dataset.nwPort;
      if(id==='P06'){begin();drag=handle.dataset.nwHandle||handle.dataset.nwPort;const p=point(event);if(drag==='rotor'&&p)pointer=Math.atan2(p.y-160,p.x-320)*180/Math.PI;}
      if(drag==='wire'||drag==='bridge')pointer={x:event.clientX,y:event.clientY};
      move(event);
    }
    function up(event){
      if(drag==='wire'||drag==='bridge'){
        const port=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-nw-port]');
        if(pointer&&Math.hypot(event.clientX-pointer.x,event.clientY-pointer.y)<6)change({[drag]:getParams()[drag]==='on'?'off':'on'});
        else if(port?.dataset.nwPort===drag)change({[drag]:'on'});
      }
      drive=0;drag=null;pointer=null;
    }
    function keydown(event){
      const button=event.target.closest('[data-nw-drive]');if(!button||![' ','Enter','ArrowLeft','ArrowRight'].includes(event.key))return;
      event.preventDefault();if(event.repeat)return;begin();drive=event.key==='ArrowLeft'?-1:event.key==='ArrowRight'?1:Number(button.dataset.nwDrive);
    }
    function keyup(event){if([' ','Enter','ArrowLeft','ArrowRight'].includes(event.key))drive=0;}
    function click(event){if(event.target.closest('[data-nw-action=clear]')){reset();change({trace:[{t:0,value:position}]});}}
    function visibility(){last=0;drive=0;drag=null;collect=false;}
    function tick(now){
      if(dead)return;frame=requestAnimationFrame(tick);
      if(condition!==getCondition()){condition=getCondition();reset();}
      if(document.hidden||paused){last=0;return;}
      const dt=last?Math.min(60,now-last):0;last=now;
      if(id==='M08'){
        boatTime+=dt/1000*2;const boat=host.querySelector('.nw-boat');if(boat){const duration=Number(boat.dataset.duration),ratio=(boatTime%(duration+1))/duration;boat.style.transform=`translate(${Number(boat.dataset.endX)*Math.min(1,ratio)}px,${-180*Math.min(1,ratio)}px)`;}
      }
      if(id!=='P06'||!collect||!dt)return;
      clock+=dt;
      if(drive)position=condition?position+drive*180*dt/1000:Math.max(-2,Math.min(-.5,position+drive*1.2*dt/1000));
      const previous=trace.at(-1);if(clock-previous.t<45)return;
      const moving=Math.abs(previous.value-position)>.0002;tail=moving?0:tail+(clock-previous.t);
      trace.push({t:Math.round(clock),value:Number(position.toFixed(4))});
      if(trace.length>155){trace=trace.slice(-140);const base=trace[0].t;trace=trace.map(s=>({...s,t:s.t-base}));clock-=base;}
      change({trace:trace.map(s=>({...s}))});
      if(!drive&&!drag&&tail>=450)collect=false;
    }
    const events={pointerdown:down,keydown,click};Object.entries(events).forEach(([k,fn])=>host.addEventListener(k,fn));
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);window.addEventListener('keyup',keyup);window.addEventListener('blur',visibility);document.addEventListener('visibilitychange',visibility);
    frame=requestAnimationFrame(tick);
    return {reset,pause(value){if(id==='M08'){paused=value;last=0;}},destroy(){dead=true;cancelAnimationFrame(frame);Object.entries(events).forEach(([k,fn])=>host.removeEventListener(k,fn));window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',visibility);document.removeEventListener('visibilitychange',visibility);}};
  }
  window.AtlasNightwatchRuntime={create};
})();
