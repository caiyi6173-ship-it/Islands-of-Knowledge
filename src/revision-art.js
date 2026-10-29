/* R03 illustrations share the pixel research shell, with distinct diagram languages. */
(() => {
  const M=window.AtlasRevisionModels,A=window.AtlasFirstVoyageArt;
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const r=(x,y,w,h,c,a='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" ${a}/>`;
  const t=(x,y,s,c='#e8dfc1',size=12,a='')=>`<text x="${x}" y="${y}" fill="${c}" font-size="${size}" ${a}>${esc(s)}</text>`;
  function signal(c,p,result){
    const m=result.measurement;
    const bars=p.pulses.map((ms,i)=>r(41+i*27,261,Math.max(5,Math.min(24,ms/25)),12,m.sent[i]==='?'?'#c98777':'#d6bb7a')+t(42+i*27,296,m.sent[i]==='.'?'·':m.sent[i]==='-'?'−':'?','#3c474b',18)).join('');
    const angle=(p.tuning-4)*25,arcs=Array.from({length:4},(_,i)=>`<path d="M${141+i*23} ${119-i*15} Q${187+i*23} 91 ${210+i*23} ${118+i*15}" fill="none" stroke="#bfc6ae" stroke-width="2" opacity="${.15+m.strength*.55}"/>`).join('');
    return r(0,0,640,360,'#263943')+r(0,216,640,144,'#665444')+r(20,22,602,8,'#57686b')+t(32,55,'THE RECEIVING ROOM / 收发台','#c8c3a2',11)+r(39,99,88,96,'#596858')+r(56,115,54,59,'#b3b38d')+r(77,66,5,34,'#c9b589')+r(58,64,44,4,'#c9b589')+arcs+r(301,86,178,113,'#354c52')+`<circle cx="390" cy="139" r="42" fill="#c5bb96" stroke="#7a8672" stroke-width="5" data-cr-dial="true"/><path d="M390 139 L${390+32*Math.sin(angle*Math.PI/180)} ${139-32*Math.cos(angle*Math.PI/180)}" stroke="#6d5642" stroke-width="5"/>`+t(366,192,p.tuning.toFixed(1),'#e8dfbd',14)+r(513,99,80,96,'#586a62')+r(530,117,46,37,'#a9b68a')+t(541,142,c?5:3,'#354c52',21)+t(518,181,'对岸','#ddd3ae',11)+r(28,237,584,90,'#e3dac0')+bars+t(39,348,'发送原时序 → 接收纸带；调谐不会改写按键','#e3d5b5',11)+t(391,261,'收到的符号','#687061',10)+t(391,293,m.received.replaceAll('.','·').replaceAll('-','−')||'等待发送','#3a5456',25)+t(391,315,`目标 ${m.target} / ${m.decoded}`,'#6c6551',11);
  }
  const project=([x,y])=>[310+x*22,292-y*22];
  const polygon=(points,color,dash='',attrs='')=>`<polygon points="${points.map(v=>project(v).join(',')).join(' ')}" fill="${color}" fill-opacity=".15" stroke="${color}" stroke-width="3" ${dash?'stroke-dasharray="'+dash+'"':''} ${attrs}/>`;
  function geometry(c,p,result){
    const m=result.measurement,target=M.geometry({order:c?['T','R']:['R','T'],scale:c?2:1});
    let grid='';for(let x=-11;x<=10;x++){const [X]=project([x,0]);grid+=`<path d="M${X} 47V313" stroke="#71836e" stroke-opacity=".25"/>`;}
    for(let y=0;y<=11;y++){const [,Y]=project([0,y]);grid+=`<path d="M48 ${Y}H585" stroke="#71836e" stroke-opacity=".25"/>`;}
    const labels=m.points.map((v,i)=>{const [x,y]=project(v);return r(x-3,y-3,6,6,'#374e45')+t(x+7,y-6,'ABCD'[i],'#2e4e48',11);}).join('');
    return r(0,0,640,360,'#d7ddc8')+t(28,29,'透明图纸 / 固定同一原片','#4b6658',12)+grid+`<path d="M48 292H594 M310 315V39" stroke="#597260" stroke-width="2"/>`+t(317,307,'(0,0)','#4d6658',10)+t(580,282,'x','#4d6658')+t(318,48,'y','#4d6658')+polygon(M.vertices,'#89917d','3 4')+polygon(target.points,'#9a7950','6 4')+m.steps.map((s,i)=>`<g class="cr-transform-step" data-cr-step="${i}" opacity=".3">${polygon(s.points,'#6d8593','3 4')}</g>`).join('')+polygon(m.points,'#3e726b')+labels+t(28,337,'虚线：给定目标 / 灰：原片 / 青：当前结果','#4e6254',11)+t(28,354,`原面积 3 → ${m.area.toFixed(2)}；旋转与反射不改变边长`,'#5d6d56',10)+`<text class="cr-replay-label" x="360" y="29" fill="#587369" font-size="11"></text>`;
  }
  function pair(id,x,y,link=false){return `<g ${link?'data-cr-link':'data-cr-pair'}="${id}" transform="translate(${x} ${y})" class="cr-electron" role="img" aria-label="电子对 e${id+1}">${r(-9,-13,42,34,'transparent')}${r(0,0,6,6,'#b17e5b')}${r(12,0,6,6,'#b17e5b')}${t(-1,23,'e'+(id+1),'#76664f',10)}</g>`;}
  function molecule(c,p,result){
    const m=result.measurement,names={bond:'共享区',left:'左原子周围',right:'右原子周围',pool:'成对电子托盘 · 每对 2 个'};
    let content=r(0,0,640,360,'#e7e3d9')+t(28,31,c?'O₂ / 两边的计数，与全分子账分开':'H₂ / 先把一对放在共同区域','#574f64',12);
    const positions={bond:[],left:[],right:[],pool:[]};p.placements.forEach((v,i)=>positions[v].push(i));
    for(const [zone,x,y,w,h] of [['left',92,72,170,201],['bond',268,105,104,148],['right',378,72,170,201],['pool',24,293,592,60]]){
      content+=`<g data-cr-zone="${zone}">${r(x,y,w,h,zone==='pool'?'#d9cdbd':'#dddbe0','stroke="#ada4b2" stroke-width="1" stroke-dasharray="4 4"')}${t(x+9,y+(zone==='pool'?15:19),names[zone],'#776c7c',10)}`;
      if(zone==='left'||zone==='right')content+=t(zone==='left'?166:452,191,c?'O':'H','#5b5769',48,'text-anchor="middle"');
      positions[zone].forEach((id,i)=>{
        if(zone==='bond'&&p.representation==='lines')return;
        const offsets=[[0,0],[0,123],[-55,32],[55,32],[-55,86],[55,86]],offset=offsets[i];
        const [X,Y]=zone==='pool'?[50+i*89,319]:zone==='bond'?[310+(i>1?(i%2?30:-30):0),147+(i%2)*58]:[(zone==='left'?155:441)+offset[0],112+offset[1]];
        content+=pair(id,X,Y);
      });content+='</g>';
    }
    if(p.representation==='lines'){
      content+=r(18,75,65,148,'#ddd0bb')+positions.bond.map((id,i)=>pair(id,40,90+i*48,true)).join('');
      for(let i=0;i<(c?2:1);i++){const link=p.links.find(l=>l.line===i),y=158+i*43;content+=`<g data-cr-line="${i}">${r(280,y-17,82,34,'#ede5d4','stroke="#afa18a" stroke-dasharray="4 3"')}<path d="M286 ${y}H354" stroke="${link?'#a66e4e':'#b4ac9c'}" stroke-width="${link?4:2}"/>${t(290,y-21,link?'e'+(link.pair+1):'线 '+(i+1),'#89785d',10)}</g>`;}
      content+=t(22,64,'共享参照卡','#88785c',10)+t(24,240,'同一份','#88785c',10)+t(24,255,'不另计数','#88785c',10);
    }
    return content;
  }
  function scene(id,c,p,result){return `<svg class="fv-scene cr-scene" viewBox="0 0 640 360" role="img" aria-label="${esc(M.definitions[id].title)}交互示意">${id==='P07'?signal(c,p,result):id==='M06'?geometry(c,p,result):molecule(c,p,result)}</svg>`;}
  const given={P07:[['潮汐港旧页','接收刻度 3 / S：···','报码点描述时长，接收条件另写。'],['对岸旧页','接收刻度 5 / R：·−·','同一枚收寄章，不能代替逐符核对。']],M06:[['测绘台旧页','R → T / 都朝上','绕原点旋转，再平移。'],['小禾保存页','T → R / 也朝上','先平移再旋转，位置不一定相同。']],C04:[['标本港旧页','O₂ / 孤对 4','没写清“4”指整个分子。'],['对岸补注页','共享 2 / 左 2 + 右 2','电子总数、每侧计数各有范围。']]};
  function context({id}){return `<details class="cr-dossier"><summary>同一枚站章，两份给定旧页 · 展开对照</summary><p>这些是档案中的给定材料；你以前正确取得的成果继续保留。</p><div class="cr-given-pages">${given[id].map(([title,diagram,note])=>`<article><small>给定档案 / ${title}</small><b>${diagram}</b><p>${note}</p><span>已寄 · 仅表示收寄</span></article>`).join('')}</div><p class="cr-disagreement">老乔：“没说清，先别寄。” 阿澜：“对岸就在等。” 阿墨：“把不确定的删掉？”<br>把可核对的说明补上，原页与未核对项一起留着。</p>${id==='P07'?'<p class="cr-history-note">史实旁注：麦克斯韦的理论与赫兹后来的电磁波实验分开记录，本关调谐和报码是现代教学组合。<a href="https://blog.sciencemuseum.org.uk/happy-new-year-of-light/" target="_blank" rel="noopener noreferrer">查看科学博物馆资料 ↗</a></p>':''}</details>`;}
  function delivery(step){return `<svg viewBox="0 0 640 300" role="img" aria-label="两岸共同修订分册">${r(0,0,640,300,'#344842')}${r(28,47,180,168,'#d9d1b1')}${r(230,47,180,168,'#c8d5bf')}${r(432,47,180,168,'#d5c8b5')}${t(46,78,step===2?'小禾寄回的补注':'报码分册','#52645b',13)}${t(246,78,'变换顺序','#52645b',13)}${t(450,78,'电子对图例','#52645b',13)}${t(48,125,step===2?'我这边也少写一行':'··· → ·−·','#7f725a',15)}${t(255,125,'R → T ≠ T → R','#7f725a',15)}${t(456,125,'O = O  / 孤对保留','#7f725a',12)}${[47,249,451].map(x=>r(x,151,139,2,'#b4af95')+t(x,182,'原页 + 核对依据','#647665',11)).join('')}${A.companion('老乔',88,232)}${A.companion('阿澜',231,232)}${A.raven(353,243)}${A.companion('小禾',492,232)}${r(25,287,590,7,'#8a9475')}</svg>`;}
  window.AtlasRevisionArt={scene,context,delivery};
})();
