/* Pair navigation clicks by pointer position: a preview may rebuild or move its marker. */
(() => {
  function createClickPair({interval=600,radius=8}={}){
    let first=null,handled=null;
    const nearby=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)<=radius;
    const recent=(a,b)=>b.time>=a.time&&b.time-a.time<=interval;
    function reset(){first=null;handled=null;}
    function click(point){
      if(first&&recent(first,point)&&nearby(first,point)){
        const target=first.target;first=null;handled=point;return target;
      }
      first=point.target?point:null;handled=null;return null;
    }
    function move(point){if(first&&!nearby(first,point))reset();}
    function wasHandled(point){return !!handled&&recent(handled,point)&&nearby(handled,point);}
    return {click,move,wasHandled,reset};
  }
  function bind(root,{resolve,enter}){
    const pair=createClickPair();let pointerType='mouse';
    const position=event=>({x:event.clientX,y:event.clientY,time:performance.now()});
    function mouseClick(event){
      return event.button===0&&event.detail>0&&pointerType==='mouse'&&
        (!event.pointerType||event.pointerType==='mouse')&&!event.sourceCapabilities?.firesTouchEvents&&
        !event.ctrlKey&&!event.metaKey&&!event.altKey&&!event.shiftKey;
    }
    function consume(event){event.preventDefault();event.stopImmediatePropagation();}
    function click(event){
      if(!mouseClick(event)){pair.reset();return;}
      const point=position(event);
      if(pair.wasHandled(point)){consume(event);return;}
      const target=pair.click({...point,target:resolve(event.target)});
      if(!target)return;
      consume(event);
      if(!target.direct)enter(target);
    }
    function doubleClick(event){
      if(!mouseClick(event))return;
      if(pair.wasHandled(position(event))){consume(event);return;}
      const target=resolve(event.target);
      if(target&&!target.direct){consume(event);pair.reset();enter(target);}
    }
    function pointerDown(event){pointerType=event.pointerType||'mouse';if(pointerType!=='mouse')pair.reset();}
    function move(event){if(event.pointerType==='mouse')pair.move(position(event));}
    function touch(){pointerType='touch';pair.reset();}
    root.addEventListener('click',click,true);
    root.addEventListener('dblclick',doubleClick,true);
    root.addEventListener('pointerdown',pointerDown,true);
    root.addEventListener('pointermove',move,true);
    root.addEventListener('touchstart',touch,{capture:true,passive:true});
    root.addEventListener('keydown',pair.reset,true);
    root.addEventListener('wheel',pair.reset,{capture:true,passive:true});
    window.addEventListener('blur',pair.reset);
    window.addEventListener('pagehide',pair.reset);
    return {reset:pair.reset,destroy(){
      pair.reset();root.removeEventListener('click',click,true);root.removeEventListener('dblclick',doubleClick,true);
      root.removeEventListener('pointerdown',pointerDown,true);root.removeEventListener('pointermove',move,true);
      root.removeEventListener('touchstart',touch,true);root.removeEventListener('keydown',pair.reset,true);root.removeEventListener('wheel',pair.reset,true);
      window.removeEventListener('blur',pair.reset);window.removeEventListener('pagehide',pair.reset);
    }};
  }
  const api={createClickPair,bind};
  if(typeof module!=='undefined')module.exports=api;
  if(typeof window!=='undefined')window.AtlasMapActivation=api;
})();
