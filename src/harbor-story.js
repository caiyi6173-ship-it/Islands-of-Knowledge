/* Six introductory scenes. These illustrations never create game progress. */
(() => {
  const chapters=Object.freeze([
    {id:'harbor',name:'海的那边',theme:'light'},
    {id:'islands',name:'三座岛',theme:'light'},
    {id:'messenger',name:'我的桌角',theme:'dark'},
    {id:'companion',name:'搭档阿墨',theme:'dark'},
    {id:'commission',name:'第一份委托',theme:'light'},
    {id:'departure',name:'我想试试',theme:'light'},
  ].map(Object.freeze));
  function pageAt(offsets,top,height){
    const readingLine=top+height*.45;
    let page=0;for(let i=1;i<offsets.length;i++)if(offsets[i]<=readingLine)page=i;
    return page;
  }
  function sceneMotion(offset,top,height,sceneHeight){
    const viewport=Math.max(1,height);
    return {drift:Math.max(-1,Math.min(1,(top-offset)/viewport)),visible:top+viewport>offset&&top<offset+sceneHeight};
  }
  function atmosphere(kind){
    const sea=kind==='harbor'||kind==='departure';
    const dust=kind==='messenger'||kind==='companion';
    if(sea)return `<div class="hs-atmosphere hs-sea-air" aria-hidden="true"><i class="hs-sea-wisp"></i><i class="hs-sea-wisp hs-sea-wisp-far"></i><svg class="hs-distant-birds" viewBox="0 0 240 90"><g class="hs-seabird"><path d="M0 13l12-6 12 6m16 17 10-5 10 5m20-20L96 2l16 8m35 38 12-6 12 6"/></g></svg><span class="hs-water-glint"></span></div>`;
    if(dust)return `<div class="hs-atmosphere hs-dust" aria-hidden="true">${Array.from({length:9},(_,i)=>`<i style="--dust-x:${43+i*6}%;--dust-y:${17+(i*17)%60}%;--dust-time:${7+i%4}s;--dust-delay:${-i*1.3}s"></i>`).join('')}</div>`;
    return '';
  }
  // A gesture which arrived at the last page cannot also launch the flight.
  function createExitGate({quiet=320,threshold=140}={}){
    let atEnd=false,lastMotion=Infinity,lastInput=-Infinity,gesture=false,distance=0;
    function reset(){atEnd=false;lastMotion=Infinity;lastInput=-Infinity;gesture=false;distance=0;}
    function move(end,now){atEnd=end;lastMotion=now;gesture=false;distance=0;}
    function ready(now){return atEnd&&now-Math.max(lastMotion,lastInput)>=quiet;}
    function wheel(delta,now){
      const fresh=now-lastInput>=quiet;lastInput=now;
      if(delta<=0||!atEnd){gesture=false;distance=0;return false;}
      if(!gesture&&fresh&&now-lastMotion>=quiet){gesture=true;distance=0;}
      if(gesture)distance+=Math.min(delta,threshold);
      return gesture&&distance>=threshold;
    }
    return {reset,move,ready,wheel};
  }
  const rect=(x,y,w,h,fill,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
  const paper='#e5e4cf',ink='#3c6172',pale='#91acb8';
  function envelope(x,y,scale=1,stamp=''){
    return `<g transform="translate(${x} ${y}) scale(${scale})">${rect(0,0,146,96,paper)}<path d="M0 0L73 51 146 0M0 96l47-43m99 43-47-43" fill="none" stroke="#9aa9a4" stroke-width="2"/>${rect(111,10,24,29,'#829b9c')}${stamp?`<text x="123" y="30" text-anchor="middle" font-family="Georgia,serif" fill="${paper}" font-size="16">${stamp}</text>`:''}</g>`;
  }
  function bag(x,y,scale=1){
    return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M25 36C-5-68 207-68 184 36" fill="none" stroke="#405e6a" stroke-width="18"/><path d="M18 14H194L211 170Q106 207 0 170Z" fill="#294d60" stroke="#62808a" stroke-width="3"/><path d="M18 14H194L181 85 111 111 28 81Z" fill="#3b6475" stroke="#71929a" stroke-width="3"/>${rect(100,77,22,58,'#b9aa80')}${rect(97,100,28,24,'#294c5d','stroke="#d2c49c" stroke-width="4"')}<path d="M18 155Q110 184 194 156" fill="none" stroke="#67818a" stroke-dasharray="3 5"/>${rect(32,119,43,29,'#c6cfbd')}<text x="53" y="139" text-anchor="middle" font-size="13" fill="#405b62" font-family="serif">临时</text></g>`;
  }
  function crate(x,y,scale=1,chipped=false){
    return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 0l27-16 77 0-27 16Z" fill="#b2aa8b"/><path d="M77 0l27-16v79L77 80Z" fill="#617578"/>${rect(0,0,77,80,'#8c947f')}${[9,30,51].map(v=>rect(2,v,73,2,'#697f7b')).join('')}${rect(12,0,8,80,'#b1ad8c')}${rect(56,0,8,80,'#b1ad8c')}${rect(25,28,27,21,'#dddcc7')}${chipped?'<path d="M64 0h13v13L64 8Z" fill="#426c7e"/>':''}</g>`;
  }
  function grid(width=900,height=700){return Array.from({length:Math.ceil(width/60)},(_,i)=>`<path d="M${i*60} 0V${height}" stroke="#698c9f" stroke-width=".7" opacity=".17"/>`).join('')+Array.from({length:Math.ceil(height/60)},(_,i)=>`<path d="M0 ${i*60}H${width}" stroke="#698c9f" stroke-width=".7" opacity=".17"/>`).join('');}
  function chart(){
    const island=(x,y,scale,kind)=>`<g class="hs-chart-island hs-chart-island-${kind}" transform="translate(${x} ${y}) scale(${scale})"><circle class="hs-port-halo" cx="0" cy="5" r="118" fill="none" stroke="#8bb2b9" stroke-width="2"/><path d="M-127 28l30-79 65-24 50-50 67 44 69 38 17 68-48 45-78 17-52 29-83-31Z" fill="#b0c1bf" stroke="#6e959f" stroke-width="2"/><path d="M-102 20l25-59 52-20 45-37 48 35 60 30 14 49-42 34-56 14-50 21-66-24Z" fill="none" stroke="#849fa3"/><path d="M-80 18l22-44 45-14 34-28 34 29 53 25-21 44-49 12-45 21-49-18Z" fill="#a0b7b7" stroke="#849fa3"/>${kind==='P'?`<path d="M-10-65h32l12 97h-56Z" fill="#e1dfc7" stroke="${ink}" stroke-width="3"/>${rect(-17,-76,46,12,ink)}${rect(-5,-54,22,23,'#8eafb8')}<path d="M-58 43q22-17 44 0t44 0t44 0" fill="none" stroke="${ink}" stroke-width="3"/>`:kind==='M'?`<circle cx="5" cy="-21" r="43" fill="none" stroke="${ink}" stroke-width="2"/><path d="M-48 35L5-72 58 35ZM5-72V35m-53 0 106-55M-48-20 58 35" fill="none" stroke="${ink}" stroke-width="2"/>`:`<path d="M-63 15v-48q68-93 136 0v48ZM-63-33H73M5-92V15m-40-80v80m80-80v80" fill="#cbd4c4" stroke="${ink}" stroke-width="3"/><path d="M-30 29l12-7 13 7v15l-13 7-12-7Zm30 0 12-7 13 7v15l-13 7-12-7Z" fill="none" stroke="${ink}" stroke-width="2"/>`}</g>`;
    return `${rect(66,55,756,567,'#122f42','opacity=".2" transform="rotate(-4 450 350)"')}<g transform="rotate(-4 450 350)">${rect(53,35,756,567,'#dce3da','stroke="#95acb1" stroke-width="2"')}${rect(69,51,724,535,'none','stroke="#9aafb2"')}<g transform="translate(75 67)">${grid(710,510)}<path class="hs-route-dashes" d="M156 160Q370 112 569 157M569 157Q618 348 389 398M389 398Q185 384 156 160" fill="none" stroke="#547f94" stroke-width="2" stroke-dasharray="7 12" opacity=".6"/><path class="hs-route-trace" d="M156 160Q370 112 569 157M569 157Q618 348 389 398M389 398Q185 384 156 160" pathLength="1" fill="none" stroke="#396e88" stroke-width="3"/>${island(156,160,.73,'M')}${island(569,157,.76,'P')}${island(389,398,.82,'C')}<g fill="${ink}" font-family="serif" font-size="19" text-anchor="middle"><text x="156" y="240">数学岛</text><text x="569" y="240">物理岛</text><text x="389" y="488">化学岛</text></g><g class="hs-chart-compass" transform="translate(648 443)" stroke="${ink}" fill="none"><circle r="34"/><path d="M0-45v90m-45-45h90M0-31l8 31-8 31-8-31Z"/><text x="0" y="-51" fill="${ink}" stroke="none" text-anchor="middle" font-size="11">N</text></g><path d="M12 14h88m-88 10h52" stroke="${ink}" stroke-width="2"/><text x="8" y="-5" fill="${ink}" font-family="Georgia,serif" font-size="10" letter-spacing="3">THE ISLAND POST / 旧航图</text></g></g><g class="hs-chart-mist"><ellipse cx="471" cy="244" rx="140" ry="43" fill="#dae4e4" opacity=".7"/><ellipse cx="359" cy="376" rx="150" ry="34" fill="#dae4e4" opacity=".6"/></g><path d="M67 578q-34-6-36 16t36 18q38-1 36-19-3-17-28-15" fill="none" stroke="#839bab" stroke-width="5"/>`;
  }
  function windowView(prefix){
    return `<defs><clipPath id="${prefix}-window"><path d="M115 385V150Q115 15 300 15T485 150v235Z"/></clipPath></defs><g class="hs-window"><path d="M97 400V150Q97-1 300-1t203 151v250Z" fill="#193b4e" stroke="#577789" stroke-width="4"/><g clip-path="url(#${prefix}-window)">${rect(110,0,380,390,'#94b5c6')}<image href="./assets/harbor-arrival-v1.png?v=20261029-scroll-layout-3" x="-86" y="-18" width="778" height="450" preserveAspectRatio="xMidYMid slice" opacity=".8"/><g class="hs-window-clouds" fill="#dbe8e8" opacity=".22">${rect(100,94,115,10,'#dbe8e8')}${rect(338,145,148,7,'#dbe8e8')}</g></g><path d="M300 15v380M115 210h370" stroke="#304f60" stroke-width="12"/>${rect(78,386,442,19,'#657e88')}<path d="M88 407h440" stroke="#1d3b4b" stroke-width="12"/></g>`;
  }
  function desk(people){
    return `${rect(0,0,900,700,'#173649')}${grid()}<g transform="translate(265 -17) scale(.94)">${windowView('hs-desk')}</g><g class="hs-stationmaster" transform="translate(205 304) scale(3.4)">${people?.companion?.('老乔',0,0)||''}</g><path d="M80 453l570-45L900 538 398 720-40 603Z" fill="#3b5864" stroke="#77919a" stroke-width="3"/><path d="M-30 586l920-43M120 457l414 241M229 447l450 224M352 436l432 198" stroke="#2a4656" stroke-width="2" opacity=".6"/><g class="hs-desk-paper" transform="translate(212 460) rotate(-8)">${rect(0,0,204,136,paper)}${Array.from({length:5},(_,i)=>rect(24,32+i*17,140-i*9,1,'#9aaca9')).join('')}<text x="24" y="24" fill="${ink}" font-size="11" letter-spacing="2">见习信使 / 留一页空白</text></g><g class="hs-desk-bag" transform="translate(570 440) rotate(12)">${bag(0,0,.9)}</g><g transform="translate(502 404) rotate(7)">${envelope(0,0,.65,'00')}</g><g class="hs-borrowed-label" transform="translate(92 546) rotate(-14)">${rect(0,0,110,66,'#d3d4be')}<text x="55" y="28" fill="${ink}" font-family="serif" text-anchor="middle" font-size="16">先借这里</text><path d="M22 43h64" stroke="#91a4a3"/></g><g class="hs-desk-pencil" transform="translate(440 564) rotate(-28)">${rect(0,0,7,126,'#8ba7af')}${rect(0,10,2,102,'#bad0cf')}<path d="M0 126l3.5 13L7 126Z" fill="#d3d1bc"/></g><path d="M257 730l54-102 74-9-7 81M589 730l-32-89 65-19 79 78" fill="#284d68" stroke="#72919f" stroke-width="3"/><path d="M312 628l19-28 41-10 20 14-7 27-46 17M557 641l-13-24 26-25 44 13 10 24-24 24" fill="#c4b494"/>`;
  }
  function companion(people){
    return `${rect(0,0,900,700,'#102c40')}<g transform="translate(610 -65) scale(.65)">${windowView('hs-companion')}</g><path d="M-40 526Q430 396 960 499V720H-40Z" fill="#385a68" stroke="#6c8791" stroke-width="3"/>${bag(200,315,1.6)}<g class="hs-raven-perched" transform="translate(425 238) scale(5.4)">${people?.raven?.(0,0)||''}${rect(20,3,3,3,'#304849','class="hs-raven-blink"')}</g><g class="hs-letter" transform="translate(537 403) rotate(9)">${envelope(0,0,1.15)}</g><path class="hs-paperclip" d="M576 290v68q0 25 18 25t18-25v-81q0-15-12-15t-12 15v73" fill="none" stroke="#c7c3a1" stroke-width="6"/><g transform="translate(123 578) rotate(-8)">${rect(0,0,228,90,'#d5ded1')}<text x="19" y="30" fill="${ink}" font-family="serif" font-size="16">潮汐港 → 标本港 → 测绘台</text><path d="M20 48h186m-186 17h129" stroke="#95a9a9"/></g><path d="M616 569l139-13 60 66-145 19Z" fill="#849eaa" stroke="#a6bac0"/><path d="M636 575l25 41 123-8" fill="none" stroke="#54788c"/>`;
  }
  function dock(people){
    return `${rect(0,0,900,700,'#aac1cf')}<image href="./assets/harbor-arrival-v1.png?v=20261029-scroll-layout-3" x="0" y="-35" width="1100" height="700" preserveAspectRatio="xMidYMid slice" opacity=".35"/>${rect(0,298,900,402,'#57849b','opacity=".75"')}${Array.from({length:15},(_,i)=>`<path class="hs-waterline" style="--wave-delay:${-i*.6}s" d="M${i*71-200} ${350+i%5*31}h${80+i%3*33}" stroke="#bed0d4" stroke-width="2" opacity=".5"/>`).join('')}<g class="hs-cargo-boat"><path d="M360 354l420-11-83 121-258-2Z" fill="#325b73" stroke="#8da9b5" stroke-width="4"/><path d="M379 363l373-10" stroke="#d1c8a9" stroke-width="9"/><path d="M568 188v161" stroke="#476c7e" stroke-width="6"/><path d="M577 193v133l129-7Z" fill="#e5e6d3"/>${crate(430,300,.75)}${crate(500,298,.75)}${crate(465,239,.75)}</g><path d="M-90 495l416-58 413 263H-90Z" fill="#8f9e9c" stroke="#bfcac4" stroke-width="3"/><path d="M-50 534l445-51m-420 97 487-55m-408 113 491-69M167 468l315 232M54 485l289 215" stroke="#6c858c" stroke-width="3"/><g class="hs-waiting-crate">${crate(246,437,1.25,true)}</g><g transform="translate(132 303) scale(3.1)">${people?.companion?.('阿澜',0,0)||''}</g><g class="hs-commission-note" transform="translate(529 477) rotate(9)">${rect(0,0,230,148,paper,'stroke="#a4b4b4" stroke-width="2"')}<text x="19" y="33" fill="${ink}" font-family="serif" font-size="18">四箱 · 寄给小禾</text><text x="19" y="57" fill="${ink}" font-size="11">标本港 / 内港窗口</text><path d="M20 75h187m-187 25h127m-127 25h155" stroke="#9badac"/>${rect(72,-8,57,18,'#778e98')}</g>${rect(30,496,27,180,'#355c70')}${rect(21,490,45,18,'#b8c2b7')}`;
  }
  function departure(people){
    return `<g class="hs-departure-walker"><path d="M480 700l66-176h143l69 176" fill="#254d6c" stroke="#86a0af" stroke-width="3"/><path d="M530 585q-2-82 80-79t95 79" fill="#365c78"/><path d="M582 517v-61q31-29 61 0v61" fill="#5c6f74"/><path d="M572 456q-3-66 44-66t45 66Z" fill="#344e62"/><path d="M645 538l-63 162" stroke="#c1b58c" stroke-width="16"/>${bag(627,579,.56)}</g>${rect(360,533,28,167,'#3c6174')}${rect(350,526,48,19,'#afbfb9')}<g class="hs-raven-perched hs-ready-raven" transform="translate(356 481) scale(1.8)">${people?.raven?.(0,0)||''}</g>`;
  }
  function art(kind,people){
    const body={islands:chart,messenger:()=>desk(people),companion:()=>companion(people),commission:()=>dock(people),departure:()=>departure(people)}[kind]?.()||'';
    return `<svg class="hs-illustration hs-illustration-${kind}" viewBox="0 0 900 700" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  }
  const api={chapters,pageAt,sceneMotion,atmosphere,createExitGate,art};
  if(typeof module!=='undefined')module.exports=api;
  if(typeof window!=='undefined')window.AtlasHarborStory=api;
})();
