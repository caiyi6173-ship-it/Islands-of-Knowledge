/* A reversible presentation layer. Flight never writes a research or discovery. */
(() => {
  const home=document.getElementById('harbor-home'),F=window.AtlasHarborFlight,S=window.AtlasHarborStory;
  if(!home||!F||!S)return;
  const $=selector=>home.querySelector(selector);
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let phase='closed',raf=0,elapsed=0,last=null,touch=null,background=[],map=null,anchor=null,originalStyle=null,originalInert=false,generation=0,resizeFrame=0,fadeTimer=0,loadingTimer=0,preparation=null;
  const status=$('.hf-status'),hero=$('.hf-panorama'),camera=$('.hf-map-camera'),flow=$('.hf-story-scroll');
  const pages=[...home.querySelectorAll('.hs-page')],exit=S.createExitGate();
  let page=-1,storyFrame=0,readyTimer=0;
  home.querySelectorAll('[data-story-art]').forEach(el=>{
    el.innerHTML=S.art(el.dataset.storyArt,window.AtlasFirstVoyageArt);
    // Keep scene coordinates outside the local pivots used by ambient motion.
    el.querySelectorAll('g[transform][class]').forEach(group=>{
      const anchor=document.createElementNS('http://www.w3.org/2000/svg','g');
      anchor.setAttribute('transform',group.getAttribute('transform'));
      group.removeAttribute('transform');group.replaceWith(anchor);anchor.append(group);
    });
  });
  pages.forEach(el=>el.insertAdjacentHTML('afterbegin',S.atmosphere(el.dataset.chapter)));
  pages.forEach(el=>{[...el.querySelector('.hs-copy').children].forEach((child,i)=>child.style.setProperty('--hs-order',i));el.querySelectorAll('.hs-islands>div,.hs-errands>li').forEach((child,i)=>child.style.setProperty('--hs-order',i));});
  function atEnd(){return flow.scrollHeight-flow.clientHeight-flow.scrollTop<=2;}
  function setPage(index){
    if(page===index)return;page=index;home.dataset.storyPage=String(index);home.dataset.tone=S.chapters[index].theme;
    pages.forEach((el,i)=>el.classList.toggle('is-current',i===index));
    $('.hs-current-page').textContent=String(index+1).padStart(2,'0');$('.hs-chapter-name').textContent=S.chapters[index].name;
    $('[data-story-back]').disabled=index===0;
    const next=$('[data-flight=start]');next.querySelector('strong').textContent=index===5?'继续下滑，跟随阿墨启程':index===0?'向下滑动，故事从这里开始':'继续向下，读下一幕';
    next.querySelector('small').textContent=index===5?'TAKE THE FIRST STEP':'SCROLL TO CONTINUE';
    home.querySelectorAll('button[data-story-page]').forEach(button=>{if(Number(button.dataset.storyPage)===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
    $('.hs-reader-status').textContent=`序章第 ${index+1} 幕，共 6 幕：${S.chapters[index].name}`;
  }
  function syncStory(){
    storyFrame=0;if(phase!=='home')return;
    const height=flow.clientHeight,top=flow.scrollTop;
    setPage(S.pageAt(pages.map(el=>el.offsetTop),top,height));
    home.style.setProperty('--hs-read-progress',String(Math.max(0,Math.min(1,top/Math.max(1,flow.scrollHeight-height)))));
    pages.forEach(el=>{const frame=S.sceneMotion(el.offsetTop,top,height,el.offsetHeight);el.classList.toggle('is-visible',frame.visible);el.style.setProperty('--hs-drift',String(motion.matches?0:frame.drift));});
  }
  function scheduleReady(){
    clearTimeout(readyTimer);home.dataset.launchReady='false';
    readyTimer=setTimeout(()=>{if(phase==='home')home.dataset.launchReady=String(exit.ready(performance.now()));},340);
  }
  function onScroll(){
    if(phase!=='home')return;exit.move(atEnd(),performance.now());scheduleReady();
    if(!storyFrame)storyFrame=requestAnimationFrame(syncStory);
  }
  function goPage(index){
    if(phase!=='home')return;const destination=pages[Math.max(0,Math.min(pages.length-1,index))];
    exit.reset();home.dataset.launchReady='false';
    flow.scrollTo({top:destination.offsetTop,behavior:motion.matches?'instant':'smooth'});
    syncStory();
  }
  function next(){
    if(page<pages.length-1){goPage(page+1);return;}
    if(!atEnd()){flow.scrollTo({top:flow.scrollHeight,behavior:motion.matches?'instant':'smooth'});return;}
    start();
  }
  function viewport(){
    home.style.setProperty('--hs-screen',home.clientHeight+'px');
    if(phase==='home'){syncStory();exit.move(atEnd(),performance.now());scheduleReady();}
  }
  function setPhase(value){phase=value;home.dataset.phase=value;document.body.dataset.entryPhase=value;}
  function route(value){try{history.replaceState(history.state,'',value);}catch{/* Local-file and restricted history still support the entrance. */}}
  function lockBackground(){
    background=[...document.body.children].filter(el=>el!==home&&!['SCRIPT','STYLE','NOSCRIPT'].includes(el.tagName)&&el.id!=='save-status').map(el=>({el,inert:el.inert}));
    background.forEach(({el})=>el.inert=true);
  }
  function unlockBackground(){background.forEach(({el,inert})=>el.inert=inert);background=[];}
  function focusStart(){$('[data-flight=start]').focus({preventScroll:true});}
  function open(){
    if(phase!=='closed')return;
    generation++;clearTimeout(fadeTimer);home.classList.remove('hf-fade');document.documentElement.dataset.entry='home';home.hidden=false;setPhase('home');route('#home');
    home.classList.toggle('hf-reduced',motion.matches);home.style.cssText='';elapsed=0;last=null;touch=null;exit.reset();page=-1;clearTimeout(readyTimer);
    home.classList.remove('hf-keyboard');home.dataset.motion=document.hidden?'paused':'active';
    $('[data-flight=start]').disabled=false;status.textContent='准备跟随阿墨启程';
    flow.inert=false;flow.removeAttribute('aria-hidden');$('.hs-chapter-nav').inert=false;$('.hs-bottom').inert=false;flow.scrollTop=0;
    home.dataset.launchReady='false';viewport();setPage(0);
    try{const p=JSON.parse(localStorage.getItem('knowledge-islands-v2')||'null');$('.hs-skip-label').textContent=p&&(p.visited?.length||Object.keys(p.researchRuns||{}).length)?'继续探索':'跳过序章，进入地图';}catch{$('.hs-skip-label').textContent='跳过序章，进入地图';}
    lockBackground();focusStart();
  }
  function prepareMap(){
    if(map)return;
    const live=window.AtlasMapArrival.prepare();map=live.world;
    anchor=document.createComment('world-map-arrival-position');map.before(anchor);
    originalStyle=map.getAttribute('style');originalInert=map.inert;
    map.inert=true;camera.append(map);map.style.left='0';map.style.top='0';map.style.transition='none';map.style.transformOrigin='50% 50%';
  }
  function restoreMap(){
    if(!map)return;
    anchor?.replaceWith(map);anchor=null;
    if(originalStyle===null)map.removeAttribute('style');else map.setAttribute('style',originalStyle);
    map.inert=originalInert;map=null;window.AtlasMapArrival.settle();
  }
  function finish(){
    if(phase==='closed')return;
    generation++;cancelAnimationFrame(raf);cancelAnimationFrame(resizeFrame);cancelAnimationFrame(storyFrame);clearTimeout(readyTimer);clearTimeout(fadeTimer);clearTimeout(loadingTimer);preparation?.abort();preparation=null;raf=0;last=null;touch=null;
    if(!map)window.AtlasMapArrival.prepare();
    restoreMap();home.hidden=true;setPhase('closed');document.documentElement.dataset.entry='map';
    home.classList.remove('hf-fade');
    document.documentElement.style.removeProperty('--arrival-ui');unlockBackground();route('#map');
    window.AtlasMapArrival.focus();
  }
  function paint(){
    if(!map)return;
    const stageRect=window.AtlasMapArrival.stage.getBoundingClientRect(),box=home.getBoundingClientRect();
    const rect={left:stageRect.left-box.left,top:stageRect.top-box.top,width:stageRect.width,height:stageRect.height};
    const v=F.frame(elapsed/F.duration,box.width,box.height,rect),style=home.style;
    map.style.transform=`translate3d(${v.centerX-800}px,${v.centerY-500}px,0) scale(${v.mapScale}) rotateX(${v.pitch}deg) rotateZ(${v.roll}deg)`;
    for(const [key,value] of Object.entries({launch:v.launch,rise:v.rise,'map-opacity':v.mapOpacity,'map-mask-start':v.mapMaskStart+'%','map-mask-end':v.mapMaskEnd+'%','panorama-opacity':v.panoramaOpacity,'panorama-scale':v.panoramaScale,'panorama-y':v.panoramaY+'px','dock-y':v.dockY+'px','dock-scale':v.dockScale,'mist-opacity':v.mist,'mist-travel':v.progress*105+'vw','sky-opacity':v.skyOpacity,'copy-opacity':v.copyOpacity,'ui-opacity':v.uiOpacity,'water-travel':v.waterTravel+'px','flight-progress':v.progress}))style.setProperty('--hf-'+key,String(value));
    document.documentElement.style.setProperty('--arrival-ui',String(v.uiOpacity));
    if(status.textContent!==v.chapter)status.textContent=v.chapter;
    home.dataset.flightProgress=v.progress.toFixed(3);
  }
  function tick(now){
    if(phase!=='flight')return;
    if(document.hidden){last=null;raf=requestAnimationFrame(tick);return;}
    if(last!==null)elapsed+=Math.min(80,Math.max(0,now-last));last=now;
    paint();
    if(elapsed>=F.duration){finish();return;}
    raf=requestAnimationFrame(tick);
  }
  function decoded(image,signal){
    if(!image)return Promise.resolve();
    if(image.complete)return Promise.resolve();
    return new Promise(resolve=>{const done=()=>{image.removeEventListener('load',done);image.removeEventListener('error',done);signal.removeEventListener('abort',done);resolve();};image.addEventListener('load',done);image.addEventListener('error',done);signal.addEventListener('abort',done,{once:true});});
  }
  async function start(){
    if(phase!=='home'||page!==pages.length-1||!atEnd())return;
    const perched=pages.at(-1).querySelector('[aria-label="阿墨"]')?.getBoundingClientRect(),bounds=home.getBoundingClientRect();
    if(perched?.width){home.style.setProperty('--hs-bird-x',perched.left-bounds.left+'px');home.style.setProperty('--hs-bird-y',perched.top-bounds.top+'px');home.style.setProperty('--hs-bird-size',perched.width+'px');}
    clearTimeout(readyTimer);cancelAnimationFrame(storyFrame);storyFrame=0;flow.inert=true;flow.setAttribute('aria-hidden','true');$('.hs-chapter-nav').inert=true;$('.hs-bottom').inert=true;
    if(motion.matches){setPhase('fade');home.classList.add('hf-fade');fadeTimer=setTimeout(finish,420);return;}
    const token=++generation;setPhase('preparing');status.textContent='正在准备航图…';$('[data-flight=start]').disabled=true;
    $('[data-flight=skip]').focus({preventScroll:true});
    const controller=new AbortController();preparation=controller;
    await Promise.race([Promise.all([decoded(hero,controller.signal),decoded(document.getElementById('world-art'),controller.signal)]),new Promise(resolve=>{loadingTimer=setTimeout(resolve,3000);})]);clearTimeout(loadingTimer);controller.abort();
    if(token!==generation||phase!=='preparing')return;
    preparation=null;if(motion.matches){finish();return;}
    prepareMap();setPhase('flight');elapsed=0;last=null;paint();raf=requestAnimationFrame(tick);
  }
  function wheel(event){
    if(phase==='closed'||event.ctrlKey)return;
    home.classList.remove('hf-keyboard');event.stopPropagation();
    if(phase!=='home'){event.preventDefault();return;}
    const unit=event.deltaMode===1?16:event.deltaMode===2?flow.clientHeight:1;
    if(exit.wheel(event.deltaY*unit,performance.now())&&atEnd()){
      event.preventDefault();start();return;
    }
    // Normal reading uses the browser's native scrolling. Only the end boundary is held.
    if(atEnd()&&event.deltaY>0)event.preventDefault();
    scheduleReady();
  }
  function key(event){
    if(phase==='closed')return;
    event.stopImmediatePropagation();
    if(event.key==='Escape'){event.preventDefault();finish();return;}
    if(event.key==='Tab'){
      home.classList.add('hf-keyboard');
      const buttons=[...home.querySelectorAll('button:not(:disabled)')].filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
      const first=buttons[0],lastButton=buttons.at(-1);if(!first)return;
      if(event.shiftKey&&(document.activeElement===first||!home.contains(document.activeElement))){event.preventDefault();lastButton.focus();}
      else if(!event.shiftKey&&(document.activeElement===lastButton||!home.contains(document.activeElement))){event.preventDefault();first.focus();}
      return;
    }
    if(phase!=='home')return;
    if(event.key==='Home'){event.preventDefault();goPage(0);return;}
    if(event.key==='End'){event.preventDefault();goPage(pages.length-1);return;}
    const down=['ArrowDown','PageDown',' '].includes(event.key),up=['ArrowUp','PageUp'].includes(event.key);
    if(!down&&!up||event.key===' '&&event.target.closest('button'))return;
    event.preventDefault();
    if(down&&atEnd()&&exit.ready(performance.now())&&!event.repeat){start();return;}
    const amount=event.key.startsWith('Arrow')?Math.max(80,flow.clientHeight*.15):flow.clientHeight*.88;
    flow.scrollBy({top:(down?1:-1)*amount,behavior:motion.matches?'instant':'smooth'});
  }
  home.addEventListener('click',event=>{
    const chapter=event.target.closest('button[data-story-page]');if(chapter){goPage(Number(chapter.dataset.storyPage));return;}
    if(event.target.closest('[data-story-back]')){goPage(page-1);return;}
    const button=event.target.closest('[data-flight]');if(!button)return;
    if(button.dataset.flight==='start')next();else finish();
  });
  flow.addEventListener('scroll',onScroll,{passive:true});
  home.addEventListener('wheel',wheel,{passive:false});
  home.addEventListener('touchstart',event=>{
    home.classList.remove('hf-keyboard');
    if(phase!=='home'||event.touches.length!==1||event.target.closest('button')){touch=null;return;}
    const p=event.touches[0];touch={x:p.clientX,y:p.clientY,canLaunch:atEnd()&&exit.ready(performance.now())};
  },{passive:true});
  home.addEventListener('touchmove',event=>{
    if(!touch||!touch.canLaunch||phase!=='home')return;
    const p=event.touches[0];if(p&&touch.y-p.clientY>0&&Math.abs(touch.y-p.clientY)>Math.abs(touch.x-p.clientX))event.preventDefault();
  },{passive:false});
  home.addEventListener('touchend',event=>{
    const gesture=touch;touch=null;if(!gesture||phase!=='home')return;
    const p=event.changedTouches[0],dy=gesture.y-p.clientY,dx=gesture.x-p.clientX;
    if(gesture.canLaunch&&dy>70&&dy>Math.abs(dx)*1.2){start();return;}
    exit.move(atEnd(),performance.now());scheduleReady();
  },{passive:true});
  home.addEventListener('touchcancel',()=>touch=null,{passive:true});
  window.addEventListener('keydown',key,true);
  window.addEventListener('resize',()=>{viewport();if(phase==='flight'){cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(paint);}});
  document.addEventListener('visibilitychange',()=>{last=null;home.dataset.motion=document.hidden?'paused':'active';});
  motion.addEventListener('change',event=>{home.classList.toggle('hf-reduced',event.matches);if(event.matches&&['flight','preparing'].includes(phase))finish();else syncStory();});
  hero.addEventListener('error',()=>home.classList.add('hf-image-error'));
  if(hero.complete&&!hero.naturalWidth)home.classList.add('hf-image-error');
  window.addEventListener('pagehide',()=>{generation++;cancelAnimationFrame(raf);cancelAnimationFrame(resizeFrame);cancelAnimationFrame(storyFrame);clearTimeout(readyTimer);clearTimeout(fadeTimer);clearTimeout(loadingTimer);preparation?.abort();restoreMap();unlockBackground();});
  window.addEventListener('pageshow',event=>{if(event.persisted){setPhase('closed');open();}});
  window.addEventListener('hashchange',()=>{if(location.hash==='#home')open();else if(location.hash==='#map')finish();});
  window.AtlasHarborEntry={open,skip:finish,get isOpen(){return phase!=='closed';},get phase(){return phase;},get storyPage(){return page;}};
  // Every new document starts at the harbor, including saved #map URLs and reloads.
  open();
})();
