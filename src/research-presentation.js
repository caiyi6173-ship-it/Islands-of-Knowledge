/* One visual grammar for thirty tables; chapter models remain independent. */
(() => {
  const chapters={
    R01:{name:'第一船信',person:'阿澜',object:'缺角箱',before:'第四箱还在等一个位置。先把眼前这页查清。',after:'四箱已经到岸，缺角也被画进了回条。'},
    R02:{name:'夜班还开着',person:'阿澜',object:'夜窗',before:'窗口要有人接，船也要有人交班。',after:'局部夜班已有人接手，阿澜能按交班表回来。'},
    R03:{name:'对岸看懂了吗',person:'小禾',object:'双面图夹',before:'两岸的旧稿不同，把各自怎么读的一起寄过去。',after:'小禾的补注夹在原页旁，两边的改写都留着。'},
    R04:{name:'图纸背面的那一行',person:'老乔',object:'折角与纸夹',before:'图册要带着用途和条件走，背面那行也要展开。',after:'折角已经展开；图册保留用途，也留着未检验项。'},
    R05:{name:'下一次还成立吗',person:'老乔',object:'桌角与 00',before:'新资料回来了，先留原页，再查这一次。',after:'你的桌位留下来。下一位带来的清单，还能一起查。'},
  };
  const states={preview:['◇','自由试验'],success:['✓','目标有支持'],reference:['▤','参考已保存'],warning:['!','还需核对'],error:['×','正式声明未成立'],archive:['✉','成果已收好']};
  const rect=(x,y,w,h,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
  function keepsake(chapter){
    const paper='#e6dfbf',wood='#b48053',ink='#405b58',gold='#dec27c';let art='';
    if(chapter==='R01')art=rect(9,12,31,28,wood)+rect(22,12,5,28,'#795b44')+rect(9,24,31,4,'#795b44')+rect(35,12,5,6,ink)+rect(6,42,39,3,ink);
    if(chapter==='R02')art=rect(10,5,30,40,ink)+rect(14,9,22,30,gold)+rect(24,9,3,30,ink)+rect(14,23,22,3,ink)+rect(7,43,36,4,wood);
    if(chapter==='R03')art=rect(6,13,24,30,paper)+rect(23,6,23,31,'#c7d7be')+rect(27,4,8,5,wood)+rect(10,20,14,2,ink)+rect(28,15,13,2,ink)+rect(28,22,9,2,ink);
    if(chapter==='R04')art=rect(8,7,33,38,paper)+'<path d="M29 7V19H41" fill="#b8c7a9"/>'+rect(13,23,22,2,ink)+rect(13,30,18,2,ink)+'<path d="M16 17V8q0-5 5-5t5 5v12q0 3-3 3t-3-3V10" fill="none" stroke="#896c4d" stroke-width="2"/>';
    if(chapter==='R05')art=rect(4,29,42,6,wood)+rect(8,35,5,13,ink)+rect(37,35,5,13,ink)+rect(16,11,23,18,paper)+'<text x="27" y="24" text-anchor="middle" fill="#405b58" font-size="9" font-family="monospace">00</text>';
    return `<svg viewBox="0 0 50 52" aria-hidden="true" shape-rendering="crispEdges">${art}</svg>`;
  }
  function portrait(id){
    const original=id[0]==='P'?window.AtlasPhysicsPixelArt.portrait(id):id[0]==='C'?window.AtlasChemistryArt.portrait(id):window.AtlasMathPixelArt.portrait(id);
    // Keep individual pixel traits, with a common frame, scale and baseline.
    return `<svg class="rp-portrait" viewBox="0 0 48 58" aria-hidden="true" shape-rendering="crispEdges">${rect(3,5,42,48,'var(--fv-panel)')}${original.replace('<svg ','<svg x="4" y="7" width="40" height="44" ')}${rect(4,53,40,2,'var(--fv-accent)')}</svg>`;
  }
  function ribbon(chapter,delivered){
    const c=chapters[chapter];
    return `<span class="rp-keepsake">${keepsake(chapter)}</span><div><small>${chapter} / ${c.name} · ${c.object}</small><p>${delivered?c.after:c.before}</p></div><span class="rp-companion" aria-label="${c.person}"><svg viewBox="0 0 44 58" aria-hidden="true" shape-rendering="crispEdges">${window.AtlasFirstVoyageArt.companion(c.person,2,2)}</svg></span>`;
  }
  function status(kind='preview'){const [symbol,label]=states[kind]||states.preview;return `<span aria-hidden="true">${symbol}</span> ${label}`;}
  function label(kind){return (states[kind]||states.preview)[1];}
  function mount(host){
    // Contrast follows the scene palette, avoiding thirty error-color overrides.
    const rgb=getComputedStyle(host.closest('.fv-modal')||host).backgroundColor.match(/[\d.]+/g)?.slice(0,3).map(Number)||[25,54,56];
    host.dataset.surface=rgb.reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0)>150?'light':'dark';
    let animation=null,dead=false;
    return {
      announce(kind,text){
        if(dead)return;
        host.querySelector('.rp-announcement').textContent=`${label(kind)}。${text}`;
        animation?.cancel();
        if(!host.classList.contains('fv-motion-paused')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)animation=host.querySelector('.fv-conversation').animate([{opacity:.65},{opacity:1}],{duration:220,easing:'steps(4,end)'});
      },
      pause(){animation?.cancel();},
      destroy(){dead=true;animation?.cancel();},
    };
  }
  function delivery(host,onReduce){
    let arrived=false;
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const change=event=>{if(event.matches)onReduce();};
    function syncMute(){
      const header=host.querySelector('.fv-delivery-header,.ap-receipt-modal footer');if(!header)return;
      let button=header.querySelector('[data-rp-mute]');
      if(!button){button=document.createElement('button');button.type='button';button.dataset.rpMute='';header.append(button);}
      const muted=window.AtlasPhysicsSound.isMuted(),text=muted?'音效：关':'音效：开';
      if(button.textContent!==text)button.textContent=text;
      button.setAttribute('aria-label',muted?'开启音效':'关闭音效');button.setAttribute('aria-pressed',String(!muted));
      const note=host.querySelector('.fv-delivery-nav>span');
      if(note&&document.body.dataset.saveMode==='session'){
        const text='本次交付留在本次会话，刷新或关闭页面后可能丢失。';
        if(note.textContent!==text)note.textContent=text;
      }
    }
    const click=event=>{if(event.target.closest('[data-rp-mute]'))window.AtlasPhysicsSound.toggleMute();};
    const observer=new MutationObserver(()=>{
      if(!arrived&&host.querySelector('.fv-receipt,.rt-letter-paper,.ap-receipt-modal')){arrived=true;window.AtlasPhysicsSound.playArrival();}
      syncMute();
    });
    observer.observe(host,{childList:true,subtree:true});preference.addEventListener('change',change);
    host.addEventListener('click',click);window.addEventListener('atlas-sound-change',syncMute);
    return {destroy(){observer.disconnect();preference.removeEventListener('change',change);host.removeEventListener('click',click);window.removeEventListener('atlas-sound-change',syncMute);window.AtlasPhysicsSound.stopAll();}};
  }
  window.AtlasResearchPresentation={portrait,ribbon,status,label,mount,delivery,chapters};
})();
