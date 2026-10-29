/* Code-native pixel scenery. Props appear only after the corresponding receipt. */
(() => {
  const people=window.AtlasFirstVoyageArt;
  const rect=(x,y,w,h,fill,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
  const text=(x,y,value,fill='#ddd2ae',size=12)=>`<text x="${x}" y="${y}" fill="${fill}" font-size="${size}">${value}</text>`;
  const svg=(body,label,view='0 0 800 480')=>`<svg viewBox="${view}" role="img" aria-label="${label}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const box=(x,y,chipped=true)=>`<g class="post-box" data-chipped="${chipped}">`+rect(x,y,44,36,'#977044')+rect(x+4,y+4,36,28,'#c9a265')+rect(x+19,y,5,36,'#725536')+rect(x,y+15,44,5,'#725536')+(chipped?rect(x+37,y,7,7,'#537e78'):'')+'</g>';
  function stationIcon(id,place={}) {
    const light=place.night?'#e9d58c':'#9abbb8';
    const roof=id==='P'?'#647f8c':id==='C'?'#698c83':'#7c8595';
    let body=rect(20,102,160,10,'#4c6476')+rect(34,45,132,58,'#a1b0b2')+rect(26,36,148,13,roof)+rect(37,25,126,12,roof);
    if(id==='P')body+=rect(56,68,26,35,'#4a6575')+rect(98,62,45,26,light)+rect(117,62,5,26,'#6a7d83')+rect(63,46,75,12,'#d9d5bd')+text(76,56,'POST','#4a6677',8);
    if(id==='C')body+=rect(49,58,103,36,light)+rect(80,58,5,36,'#627e81')+rect(116,58,5,36,'#627e81')+rect(44,94,112,9,'#798b83')+(place.localComplete?rect(62,75,12,16,'#cdddc9')+rect(124,75,10,16,'#cedac1'):'');
    if(id==='M')body+=rect(49,55,104,43,'#3c605f')+rect(55,60,92,31,'#c2cebb')+'<path d="M68 85L88 65L109 80L133 64M80 60V91M110 60V91" stroke="#6c8a81" stroke-width="2" fill="none"/>';
    return svg(body,window.AtlasPostalWorld.stations[id].name,'0 0 200 120');
  }
  function wall(night) {
    let body=rect(0,0,800,480,'#31494a')+rect(16,16,768,304,'#4d6860')+rect(16,317,768,147,'#867153');
    for(let x=16;x<784;x+=64)body+=rect(x,320,2,144,'#6c5d48');
    for(let y=348;y<464;y+=37)body+=rect(16,y,768,2,'#79664d');
    body+=rect(16,16,768,14,'#a68d61')+rect(16,306,768,14,'#a68d61');
    return body;
  }
  function windowScene(x,y,w,h,night) {
    return rect(x-8,y-8,w+16,h+16,'#b39c70')+rect(x,y,w,h,night?'#203b50':'#aac8b9')+
      rect(x,y+h*.5,w,h*.5,night?'#315e68':'#6c9e94')+rect(x,y+h*.6,w,3,night?'#56818a':'#97bbb0')+
      rect(x+w*.54,y,w*.03,h,'#b39c70')+rect(x,y+h*.5,w,6,'#b39c70')+
      (night?rect(x+w-37,y+19,13,13,'#dcd7a4')+rect(x+23,y+21,3,3,'#c3d2c2'):rect(x+18,y+19,44,6,'#e2ead3'));
  }
  function envelope(x,y,w=34,fill='#ded5b6') {
    return rect(x,y,w,w*.65,fill)+`<path d="M${x} ${y}L${x+w/2} ${y+w*.4}L${x+w} ${y}" stroke="#8b9177" stroke-width="2" fill="none"/>`;
  }
  function hangingReceipts(s) {
    let body='<path d="M293 71Q500 110 754 71" fill="none" stroke="#c2ac7b" stroke-width="3"/>';
    for(let i=0;i<5;i++) {
      const x=303+i*88,y=84+Math.abs(2-i)*-3;
      body+=rect(x+28,y-4,5,13,'#baa170');
      if(i<s.receipts.length) {
        body+=rect(x,y+8,63,76,'#d9d5b6')+rect(x+7,y+15,49,3,'#a4af93');
        body+=i===0?`<g transform="translate(${x+12} ${y+29}) scale(.85)">${box(0,0)}</g>`:
          i===1?rect(x+22,y+25,19,30,'#718d78')+rect(x+27,y+29,9,17,'#e5d99a'):
          `<path d="M${x+10} ${y+62}L${x+23} ${y+34}L${x+39} ${y+55}L${x+51} ${y+29}" stroke="#729382" stroke-width="3" fill="none"/>`;
        body+=text(x+16,y+77,`0${i+1}`,'#596f66',9);
      }else body+=rect(x+20,y+15,21,2,'#6e8272');
    }
    return body;
  }
  function deskItem(id) {
    if(id==='box-sketch'||id==='return-box')return rect(419,277,70,47,'#ddd3ae')+`<g transform="translate(435 284) scale(.65)">${box(0,0)}</g>`;
    if(id==='paperclip'||id==='front-clip')return '<path d="M441 302V279Q451 264 460 279V305Q448 320 438 305V282" stroke="#ccc8a0" stroke-width="4" fill="none"/>';
    return rect(424,275,72,43,'#ddd6b4')+rect(430,282,54,3,'#8d9e81')+rect(430,291,43,3,'#8d9e81')+rect(429,273,6,11,'#ae8d53');
  }
  function postOffice(s) {
    let body=wall(s.nightWatch)+windowScene(48,67,213,168,s.nightWatch)+hangingReceipts(s);
    body+=rect(56,215,205,12,'#997e55')+rect(80,225,10,74,'#6d634d')+rect(224,225,10,74,'#6d634d');
    body+=s.phase<5?`<g data-post-prop="alan-on-dock" transform="translate(177 167) scale(.85)">${people.companion('阿澜',0,0)}</g>`:envelope(195,203,28);
    body+=rect(282,268,444,22,'#c1a36c')+rect(292,290,422,68,'#92774f')+rect(308,358,18,78,'#6a5a43')+rect(672,358,18,78,'#6a5a43');
    body+=rect(316,310,245,3,'#ae9565')+rect(577,304,110,40,'#78664b')+rect(622,320,21,4,'#c6af76');
    body+=rect(558,198,119,62,'#d1d1ad')+'<path d="M568 243L593 211L617 235L658 210" stroke="#6b8b7f" stroke-width="3" fill="none"/>'+rect(608,193,8,18,'#bd9760');
    body+=rect(360,251,29,17,'#4b635b')+rect(368,239,13,14,'#b39b68')+rect(299,225,9,43,'#c0aa75')+rect(290,215,28,13,'#d9c78b');
    body+=rect(623,364,66,62,'#50727a')+rect(637,350,40,17,'#486572')+rect(631,385,50,6,'#b4b087')+rect(653,378,8,22,'#b4b087');
    body+=rect(505,277,54,35,'#e5dec0')+text(516,300,'00','#49695f',16)+deskItem(s.decoration.id);
    body+=people.companion('老乔',325,212)+`<g class="post-idle-bird">${people.raven(465,239)}</g>`;
    body+=rect(76,357,164,31,'#d9cfac')+text(89,378,s.formalDesk?'信使 · 正式收信格':'信使 · 先借这个桌角','#4f675a',12);
    if(s.phase>=2)body+=envelope(87,268,42)+text(92,285,'交班','#5b7768',9);
    if(s.phase===5)body+=`<g data-post-prop="returned-box">${box(90,403)}${envelope(101,406,23)}</g>`;
    return body;
  }
  function observationWindow(s) {
    const place=s.places.find(p=>p.id==='C');
    let body=wall(place.night)+windowScene(63,55,419,176,place.night);
    body+=rect(514,51,216,149,'#918563')+rect(525,62,194,127,'#708b77');
    for(let i=0;i<5;i++)body+=rect(540+i*33,95+(i%2)*13,18,57-(i%2)*13,'#c7d1b3')+rect(544+i*33,86+(i%2)*13,10,10,'#a39872');
    body+=rect(56,249,686,23,'#c5aa77')+rect(70,272,657,68,'#a08a61')+rect(85,340,18,85,'#6a614a')+rect(680,340,18,85,'#6a614a');
    body+=people.companion('小禾',383,195)+people.raven(110,223);
    body+='<path d="M104 93H407" stroke="#e0d7b5" stroke-width="3"/>'+envelope(134,98,44)+envelope(233,98,44)+envelope(331,98,44);
    body+=rect(554,225,124,20,'#5c7568')+text(566,240,place.night?'夜班有人接信':'标本港观测窗口','#e5dcba',10);
    if(s.phase) {
      body+=`<g data-post-prop="delivered-cargo">${[0,1,2,...(s.phase<5?[3]:[])].map(i=>box(100+i*50,354,i===3)).join('')}</g>`;
      body+=rect(172,245,74,27,'#d4d7bb')+rect(177,250,63,3,'#7f9b88')+rect(263,234,6,36,'#c7cbac');
    } else body+=rect(95,362,225,3,'#b7ad83')+text(108,384,'收信格给四箱留着','#d9d1af',12);
    if(place.night)body+=rect(495,209,10,40,'#c2a66b')+rect(481,186,39,25,'#e6d392');
    return body;
  }
  function mapDesk(s) {
    let body=wall(s.phase===5)+windowScene(610,62,125,143,s.phase===5);
    body+=rect(60,53,508,207,'#b8a47b')+rect(71,64,486,184,'#d6d5b6');
    for(let x=91;x<550;x+=42)body+=rect(x,70,1,169,'#acbfa4');
    for(let y=81;y<245;y+=28)body+=rect(78,y,473,1,'#acbfa4');
    body+='<path d="M121 205L261 127L451 207Z" fill="none" stroke="#7b9a87" stroke-width="4" stroke-dasharray="9 7"/>';
    body+=rect(114,198,14,14,'#759b87')+rect(254,120,14,14,'#759b87')+rect(444,200,14,14,'#759b87');
    body+=rect(54,293,686,23,'#bfa473')+rect(74,316,646,35,'#8d7756')+rect(91,351,16,88,'#6e6048')+rect(677,351,16,88,'#6e6048');
    body+=rect(192,277,249,25,'#ddd7b4')+rect(204,284,155,3,'#839a80')+rect(204,291,192,3,'#839a80')+rect(186,274,10,34,'#c2b286');
    body+=people.raven(474,266)+rect(597,314,63,66,'#52757a')+rect(619,309,19,13,'#b0b38c');
    body+='<path d="M580 235H743" stroke="#c9b58b" stroke-width="3"/>'+envelope(590,241,41);
    if(s.phase>=3)body+=envelope(648,241,41,'#c4d5bf')+text(207,297,'原页 / 对岸补注','#5b7768',10);
    if(s.phase>=4)body+=rect(445,273,103,27,'#d9ddc0')+text(452,291,'用途 · 条件','#607c6e',10);
    if(s.artifacts.M03)body+=text(105,229,'原点 / 方向 / 单位 / 次序','#587b69',11);
    return body;
  }
  const hotspots={
    P:[['receipts','回条绳',66,24],['folio','图夹',78,46],['letter','00 回信',67,60],['desk','桌角',53,67],['bag','信袋',82,83],['joe','老乔',43,46],['amo','阿墨',61,49],['alan','阿澜',24,33]],
    C:[['xiaohe','小禾',51,39],['receipts','窗边回条',30,18],['folio','留样记录',76,36],['bag','收寄格',26,79],['amo','阿墨',15,42]],
    M:[['folio','原页与补注',39,35],['letter','00 回信',40,64],['bag','信袋',79,81],['amo','阿墨',64,51]],
  };
  function room(id,s) {
    return svg(id==='P'?postOffice(s):id==='C'?observationWindow(s):mapDesk(s),`${window.AtlasPostalWorld.stations[id].name}，${s.routeTitle}`);
  }
  window.AtlasPostalArt={stationIcon,room,hotspots};
})();
