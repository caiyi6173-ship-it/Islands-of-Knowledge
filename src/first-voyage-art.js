/* Pixel scenes are illustrations of the model, with no independent verdicts. */
(() => {
  const esc = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const r = (x,y,w,h,c,attrs='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" ${attrs}/>`;
  const t = (x,y,txt,c='#314c50',size=12,attrs='') => `<text x="${x}" y="${y}" fill="${c}" font-size="${size}" ${attrs}>${esc(txt)}</text>`;
  const crate = (x,y,chipped=false) => `<g class="fv-crate">${r(x,y,27,24,'#ba8149')}${r(x+3,y+3,21,18,'#d4a86d')}${r(x+11,y,4,24,'#805c40')}${r(x,y+10,27,3,'#805c40')}${chipped?r(x+23,y,4,5,'#4b756f'):''}</g>`;
  function companion(name,x,y) {
    const coat=name==='老乔'?'#a29b78':name==='阿澜'?'#6fa7a1':'#c6b97b';
    const hair=name==='小禾'?r(5,4,7,27,'#695743')+r(29,8,7,24,'#695743')+r(24,4,9,4,'#e5c57c'):'';
    const keepsake=name==='小禾'?r(25,30,13,18,'#d5dfbb')+r(28,35,7,2,'#7f9a86'):
      name==='老乔'?r(32,36,8,7,'#4e675a'):r(6,34,7,8,'#d1c395')+r(8,36,3,4,coat);
    return `<g aria-label="${name}" transform="translate(${x} ${y})">${r(8,0,22,8,name==='阿澜'?'#42777b':'#695743')}${r(5,6,28,8,name==='阿澜'?'#42777b':'#695743')}${r(10,9,20,16,'#e5be8b')}${r(14,15,3,3,'#444c43')}${r(24,15,3,3,'#444c43')}${name==='老乔'?r(12,21,16,8,'#d7d4b9'):''}${hair}${r(7,28,27,16,coat)}${r(2,29,6,15,coat)}${r(34,29,6,15,coat)}${r(10,44,8,10,'#465b55')}${r(25,44,8,10,'#465b55')}${keepsake}</g>`;
  }
  function raven(x,y) {
    return `<g aria-label="阿墨" transform="translate(${x} ${y})">${r(0,8,22,12,'#304849')}${r(12,0,12,12,'#304849')}${r(24,5,9,4,'#c9b67d')}${r(20,3,3,3,'#e1d7b4')}${r(-7,14,9,5,'#304849')}${r(9,19,3,7,'#6c6751')}${r(17,19,3,7,'#6c6751')}</g>`;
  }
  function shore() {
    return r(0,0,640,360,'#d7e6d8')+r(0,68,640,125,'#a9c8b9')+
      '<path d="M0 130H45V100H85V76H122V106H162V136H213V110H255V90H299V120H340V153H640V202H0Z" fill="#7fa69a"/>'+
      r(0,187,640,173,'#4b8882')+r(0,215,640,145,'#3c7575')+
      [24,76,130,205,280,355,440,530,595].map((x,i)=>r(x,245+(i%3)*25,28,3,'#6ba29b','class="fv-wave"')).join('')+
      r(496,87,38,103,'#e6d8b5')+r(492,83,46,11,'#826c53')+r(506,100,15,19,'#61828a')+r(506,135,15,19,'#61828a')+
      r(480,178,160,18,'#a28661')+r(497,195,13,67,'#78654c')+r(594,195,13,67,'#78654c')+
      r(40,29,59,8,'#edf1da')+r(52,21,32,8,'#edf1da')+r(315,38,83,8,'#edf1da')+r(332,29,40,9,'#edf1da');
  }
  function boat(p, condition, model) {
    const widths={lump:120,bowl:200,wide:280}, w=widths[p.shape];
    const hull=64, waterline=268;
    const immersion=model.floats?12+44*Math.min(1,model.mass/model.capacity):Math.round(hull*.94);
    const y=waterline-hull+immersion, x=330-w/2;
    const cratesOnBoat=condition?[0,1,2,3].map(i=>crate(w/2-29+(i%2)*30,-25-Math.floor(i/2)*25,i===3)).join(''):'';
    const hullSvg=p.shape==='lump'
      ? r(0,0,w,hull,'#a26c4a')+r(6,5,w-12,10,'#c08f63')+r(0,hull-8,w,8,'#7a4e36')
      : `<path d="M0 0H${w}L${w-16} ${hull}H16Z" fill="#865c42"/><path d="M8 0H${w-8}L${w-26} ${hull-12}H26Z" fill="${model.floats?'#e5d9b6':'#4b8882'}"/>${r(0,0,w,8,'#c99d6a')}${r(0,hull-6,w,6,'#6f4832')}`;
    return `<g data-live-key="boat-model" class="fv-boat" transform="translate(${x} ${y})">${hullSvg}${cratesOnBoat}${model.floats?'':r(0,8,w,10,'#4b8882','opacity=".55"')}</g>`;
  }
  function shoreScene() {
    const clouds=r(36,18,62,9,'#edf1da')+r(50,9,34,9,'#edf1da')+r(352,22,86,9,'#edf1da')+r(370,13,42,10,'#edf1da');
    const ridge='<path d="M0 96H58V78H118V58H196V84H252V64H322V90H392V72H458V94H520V76H640V126H0Z" fill="#7fa69a"/>';
    const waves=[40,96,158,214,286,344,412,480,548,606].map((x,i)=>r(x,286+(i%3)*22,34,4,'#6ba29b','class="fv-wave"')).join('');
    const tower=r(556,40,42,82,'#e6d8b5')+r(551,35,52,12,'#826c53')+r(568,54,16,18,'#61828a')+r(568,86,16,18,'#61828a')+r(600,14,6,26,'#826c53');
    return r(0,0,640,360,'#d7e6d8')+r(0,36,640,96,'#a9c8b9')+ridge+r(0,122,640,238,'#4b8882')+r(0,158,640,202,'#3c7575')+waves+tower+clouds;
  }
  function physics(condition,p,result) {
    const rail=r(452,226,9,44,'#755b43')+r(446,222,21,7,'#a28661');
    const quay=r(0,240,204,22,'#a28661')+r(0,262,204,98,'#8a6f52')+r(0,240,204,5,'#c2a377')+
      r(18,262,13,60,'#755b43')+r(172,262,13,60,'#755b43');
    const staged=crate(24,216)+crate(58,216)+crate(41,192);
    const fourth=`<g class="fv-last-crate">${crate(150,216,true)}</g>`+t(146,208,'第四箱 · 缺角','#f0e2c0',10);
    return shoreScene()+quay+staged+fourth+
      `<path d="M204 268H600" stroke="#d8f2d6" stroke-width="2" stroke-dasharray="10 6" opacity=".8"/>`+
      rail+raven(458,200)+boat(p,condition,result.model)+
      r(206,30,308,52,'#0e1a2b','opacity=".32"')+t(212,50,'同一份材料 · 形状改变，质量不变','#f2f7ea',13)+
      t(212,72,condition?'四箱已计入 · 6.0 kg':'空载 · 1.2 kg','#c9dccb',12)+
      t(566,262,'水线','#e1f0d9',11)+
      companion('阿澜',86,186);
  }
  function chemistry(condition,p,result) {
    let scene=r(0,0,640,360,'#eee7d0')+r(0,0,640,18,'#9a7659')+r(0,18,640,140,'#d8d9bf');
    for(let i=0;i<6;i++)scene+=r(22+i*108,42,82,4,'#c2c8ad');
    scene+=r(28,36,139,110,'#8b7461')+r(35,43,125,96,'#a8c7bb')+r(93,43,6,96,'#d9d7b6')+r(35,86,125,5,'#d9d7b6')+
      r(480,40,132,112,'#97775b')+r(490,51,112,89,'#6b7465');
    for(let i=0;i<4;i++)scene+=r(502+i*24,86-(i%2)*15,14,45,'#b6c6a8')+r(505+i*24,80-(i%2)*15,8,8,'#ddd5ab');
    scene+=r(0,250,640,110,'#8b6c51')+r(0,250,640,12,'#ba956a')+r(0,278,640,3,'#765b47');
    const jar=r(271,122,88,122,'#8aaca2')+r(277,128,76,110,'#d0e0cf')+r(276,116,78,13,'#6b7f72');
    scene+=`<g data-live-key="sample">${jar}${condition?r(292,181,43,43,'#85968d')+r(298,185,26,8,'#b8c5ba'):[0,1,2,3,4,5,6].map(i=>r(285+(i%3)*20,188+Math.floor(i/3)*14,14,10,'#f7f1d7')).join('')}${t(299,165,condition?'B':'A','#3c5c56',21)}</g>`;
    if(p.instrument==='density') scene+=r(228,244,176,14,'#626e60')+r(285,258,62,23,'#455e56')+t(292,274,'2.16','#e8efcf',12);
    if(p.instrument==='conductivity')scene+=r(216,139,17,78,'#b7925a')+r(403,139,17,78,'#b7925a')+'<path d="M224 139V94H412V139" fill="none" stroke="#677a68" stroke-width="5"/>'+r(303,82,39,24,'#45675e')+t(311,99,condition?'通':'15','#e9f0d1',12);
    if(p.instrument==='magnet')scene+='<path d="M390 160V224H435V160" fill="none" stroke="#b4634d" stroke-width="16"/>'+r(382,149,16,21,'#d5d5bb')+r(427,149,16,21,'#d5d5bb')+'<path d="M346 193H374" stroke="#b7884d" stroke-dasharray="5 4" stroke-width="3"/>';
    scene+=t(194,46,condition?'另一份留样 · 铁 / 铜':'限定候选 · 盐 / 糖','#52665b',12)+t(193,66,'封装完好，外部标签受潮','#6e7d68',10)+
      r(259,298,162,35,'#e9dbb7')+t(273,320,({salt:'身份签：盐',sugar:'身份签：糖',iron:'身份签：铁',copper:'身份签：铜'})[p.identity]||'把身份签夹在这里','#62533e',12)+
      t(22,326,'入口留样台','#e7dabc',11)+t(22,343,'最终收货窗口仍在内港','#dcc9a7',10);
    return scene;
  }
  const grid={x:96,y:312,cell:48};
  function mathematics(condition,p,result) {
    let s=r(0,0,640,360,'#bfa77a')+r(58,4,540,340,'#725d43')+r(68,14,520,320,'#273f3b')+r(76,22,504,304,'#304d46');
    for(let x=0;x<=8;x++)s+=`<path d="M${96+x*48} 24V312" stroke="#527065" stroke-width="1"/>`;
    for(let y=0;y<=6;y++)s+=`<path d="M96 ${312-y*48}H480" stroke="#527065" stroke-width="1"/>`;
    const origin=condition?0:p.origin, ox=96+origin*48, oy=312-origin*48;
    s+=`<path d="M${ox} 24V312M96 ${oy}H486" stroke="#d0dac0" stroke-width="2"/>`;
    for(let x=0;x<=8;x++)s+=t(92+x*48,329,String(x-origin),'#c5d1b6',10);
    for(let y=0;y<=6;y++)s+=t(79,316-y*48,String(y-origin),'#c5d1b6',10);
    s+=t(503,314,'东 +x','#d3dcc4',11)+t(92,18,'北 +y','#d3dcc4',10)+r(ox-5,oy-5,10,10,'#e5d59a')+t(ox+10,oy-8,'原点','#e5d59a',10);
    const wx=96+4*48,wy=312-3*48;
    s+=r(wx-17,wy-16,34,30,'#a7c5ae')+r(wx-11,wy-11,22,20,'#dfda9a')+r(wx-2,wy-11,3,20,'#6b826e')+t(wx-43,wy-25,'小禾内港窗口','#e1d7a7',11);
    if(!condition){
      const x=96+result.model.worldX*48,y=312-result.model.worldY*48;
      s+=`<path d="M${ox} ${oy}H${x}V${y}" stroke="#d9a35f" stroke-width="2" stroke-dasharray="6 4"/>`+
        `<g data-fv-handle="point" tabindex="0" role="button" aria-label="投递标记，地址 ${p.targetX},${p.targetY}，方向键移动" transform="translate(${x} ${y})"><circle r="20" fill="transparent"/><path d="M0 9V-21H19V-5H0" fill="#e1a25e" stroke="#f3d398" stroke-width="2"/><circle r="4" fill="#f5d39a"/></g>`;
    }else{
      const slope=p.lineSlope, endX=slope>0?Math.min(8,6/slope):8;
      s+=`<path d="M96 312L${96+endX*48} ${312-endX*slope*48}" stroke="#94c89b" stroke-width="3"/>`;
      for(const q of result.model.residuals)s+=`<g><circle cx="${96+q.x*48}" cy="${312-q.y*48}" r="8" fill="${Math.abs(q.residual)<=.01?'#e9da9d':'#db997c'}"/>${t(107+q.x*48,316-q.y*48,`(${q.x},${q.y})`,'#eee4bf',11)}</g>`;
      s+=`<g data-fv-handle="slope" tabindex="0" role="slider" aria-label="斜率控制点，方向键调节" aria-valuenow="${slope}" aria-valuemin="0" aria-valuemax="4" transform="translate(168 ${312-1.5*slope*48})"><circle r="17" fill="transparent"/><rect x="-7" y="-7" width="14" height="14" fill="#83bdaa" stroke="#ecedc5" stroke-width="2"/></g>`;
    }
    return s+t(503,75,'一格 =','#b7c9b7',10)+t(503,92,'1 单位','#b7c9b7',10)+t(502,129,condition?'y = mx':'先横再纵','#d9cba1',11);
  }
  function scene(id,condition,params,result) {
    const body=id==='P01'?physics(condition,params,result):id==='C01'?chemistry(condition,params,result):mathematics(condition,params,result);
    const box='0 0 640 360',fit=id==='P01'?'xMidYMid slice':'xMidYMid meet';
    return `<svg class="fv-scene" viewBox="${box}" preserveAspectRatio="${fit}" role="${id==='M03'?'group':'img'}" aria-label="${id==='P01'?'承载水槽':id==='C01'?'入口样品台':'窗口坐标与航标'}" shape-rendering="crispEdges">${body}</svg>`;
  }
  function shipping(step) {
    const cratesOnDock=step===0?r(0,193,220,19,'#ab8860')+[0,1,2,3].map(i=>crate(27+i*35,167,i===3)).join(''):'';
    const cratesOnBoat=step>0?[0,1,2,3].map(i=>crate(35+(i%2)*31,-24-Math.floor(i/2)*25,i===3)).join(''):'';
    const receipt=step===2?`<g transform="translate(70 67)">${r(0,0,140,98,'#f0e5c5')}${crate(49,29,true)}${t(23,85,'最后那箱也在','#5e6954',10)}</g>`:'';
    const people=step===0?companion('老乔',175,139)+companion('阿澜',548,124)+raven(123,141):step===1?raven(295,45):companion('小禾',548,124)+raven(214,75);
    return `<svg class="fv-shipping-scene" viewBox="0 0 640 360" role="img" aria-label="${step===0?'四箱在潮汐港备航':step===1?'邮船驶往标本港':'小禾画下缺角箱子的回条'}" shape-rendering="crispEdges">${shore()}${cratesOnDock}<g class="${step===1?'fv-sailing':''}" transform="translate(205 226)"><path d="M0 0H198L173 54H28Z" fill="#795c43"/>${r(8,0,182,9,'#cfad71')}${r(95,-118,5,118,'#7e6850')}<path d="M104 -112V-12H171Z" fill="#e7e1bd"/>${cratesOnBoat}${step===1?companion('阿澜',155,-54):''}</g>${receipt}${people}</svg>`;
  }
  window.AtlasFirstVoyageArt={scene,shipping,grid,companion,raven};
})();
