/* Three instruments share the postal workbench, with subject-specific pixel scenes. */
(() => {
  const M=window.AtlasReturnModels,A=window.AtlasFirstVoyageArt;
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const r=(x,y,w,h,c,a='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" ${a}/>`;
  const t=(x,y,s,c='#e9ddbc',size=12)=>`<text x="${x}" y="${y}" fill="${c}" font-size="${size}">${esc(s)}</text>`;
  function physics(c,p,result){
    const m=result.measurement,color=p.frequency<5?'#d48b72':p.frequency<8?'#7ba7c7':'#b99dcd';
    let b=r(0,0,640,360,'#263c41')+r(18,18,604,277,'#304b4e')+t(30,40,`光电检测片 ${c?'B':'A'} / φ=${m.work} eV`)+r(36,106,72,109,'#b9a17d')+r(100,119,18,80,color)+r(270,91,19,164,'#adc2b8')+r(289,91,13,164,'#708f88')+r(464,80,128,184,'#526b62')+r(478,94,100,153,'#2b4240')+t(488,118,'示教回信柜','#c8d0b1',11);
    for(let i=0;i<p.flux;i++)b+=`<path class="rt-photon" d="M120 ${118+i*10}l18 -6 18 12 18 -12 18 12 18 -12 18 12 18 -6" fill="none" stroke="${color}" stroke-width="3" style="animation-delay:${i*.1}s"/>`;
    if(m.emits){for(let i=0;i<p.flux;i++)b+=`<circle class="rt-electron" cx="${318+i*15}" cy="${137+i%3*25}" r="4" fill="#e6cd81" style="animation-delay:${i*.15}s"/>`;b+=r(493,143,70,83,'#b4c396')+t(500,189,'有响应','#41584b',12);}else b+=t(496,188,'未响应','#c1bc9b',12);
    b+=r(0,295,640,65,'#9e896a')+t(24,321,`每个光子 ${m.energy.toFixed(3)} eV`,'#faf0d5',12)+t(24,344,m.emits?`最大动能 ${m.kinetic.toFixed(3)} eV · 相对发射数 ${m.count}`:'没有发射电子 · 不是“动能为零的电子”','#f0e6cb',11)+t(329,286,'数量与单个电子的能量分开记','#c6d0b2',10);
    return b;
  }
  function mathematics(c,p,result,run){
    const X=x=>51+x*21,Y=y=>310-y*14,clip='rt-fit-clip';
    let b=r(0,0,640,360,'#e4dfc9')+t(25,28,c?'已拆信 / 原预测与修订并排保留':'只拟合三个已知点 / 信封还未拆','#52665c',12)+`<defs><clipPath id="${clip}"><rect x="45" y="42" width="557" height="270"/></clipPath></defs>`;
    for(let x=0;x<=24;x+=4)b+=`<path d="M${X(x)} 43V310" stroke="#c0c4ab"/>`+t(X(x)-5,330,String(x),'#7b826c',10);
    for(let y=0;y<=18;y+=3)b+=`<path d="M50 ${Y(y)}H600" stroke="#c0c4ab"/>`+t(27,Y(y)+4,String(y),'#7b826c',9);
    b+=`<path d="M50 43V310H601" fill="none" stroke="#7c8b77" stroke-width="2"/>`;
    const curve=q=>Array.from({length:121},(_,i)=>`${i?'L':'M'}${X(i/5)},${Y(M.polynomial(q,i/5))}`).join('');
    const original=M.sealed(run)[0];if(c&&original)b+=`<path d="${curve(original.params)}" fill="none" stroke="#b69368" stroke-dasharray="5 4" stroke-width="3" clip-path="url(#${clip})"/>`;
    b+=`<path d="${curve(p)}" fill="none" stroke="#5b867b" stroke-width="3" clip-path="url(#${clip})"/>`;
    M.training.forEach(([x,y])=>{const fit=M.polynomial(p,x);b+=`<path d="M${X(x)} ${Y(y)}V${Y(fit)}" stroke="#c28c6e" stroke-width="3"/><circle cx="${X(x)}" cy="${Y(y)}" r="5" fill="#8f7656"/><rect data-rt-handle="${x}" tabindex="0" role="slider" aria-valuemin="-10" aria-valuemax="32" aria-valuenow="${fit.toFixed(3)}" aria-label="拖动 t=${x} 的曲线控制点" x="${X(x)-5}" y="${Y(fit)-5}" width="10" height="10" fill="#4f8074"/>`;});
    if(c){b+=`<circle data-rt-observation="true" cx="${X(24)}" cy="${Y(15)}" r="7" fill="#c18464"/>`+t(392,65,'独立观测 (24,15)','#986e53',11)+t(338,89,`封存预测 ${result.measurement.originalPrediction?.toFixed(3)??'—'}`,'#8b7958',11)+t(338,111,'虚线原模型 / 实线修订','#71836c',10);}
    else b+=r(366,61,205,91,'#b7bda3')+r(375,70,187,73,'#f1ead0')+`<path d="M375 70l94 45 93-45" fill="none" stroke="#a7ab90" stroke-width="2"/>`+t(397,137,'t=24 / 待核对观测','#797e63',11);
    return b+t(24,352,c?'打开后调参只算修订 · 不覆盖封存数字':'绿色方块可拖 · 橙色短线为残差 · 正式记录即封存','#687d6c',10);
  }
  function chemistry(c,p,result){
    if(c){let b=r(0,0,640,360,'#ded7c9')+t(25,29,'独立原子账 / H₂ + O₂ → H₂O','#616b61',12)+t(25,53,'这里没有产气反应装置；只核对固定分子式的份数','#858171',10);
      const atom=(x,y,kind)=>`<circle cx="${x}" cy="${y}" r="${kind==='O'?11:7}" fill="${kind==='O'?'#b88071':'#f1e8cd'}" stroke="#7e8e81" stroke-width="2"/>`;
      for(let k=0;k<p.h2;k++)b+=atom(49+k%3*63,108+Math.floor(k/3)*41,'H')+atom(68+k%3*63,108+Math.floor(k/3)*41,'H');
      for(let k=0;k<p.o2;k++)b+=atom(270+k%3*45,108+Math.floor(k/3)*41,'O')+atom(289+k%3*45,108+Math.floor(k/3)*41,'O');
      for(let k=0;k<p.h2o;k++){const x=470+k%3*54,y=108+Math.floor(k/3)*41;b+=atom(x,y,'O')+atom(x-13,y+15,'H')+atom(x+13,y+15,'H');}
      b+=t(211,128,'＋','#727c6a',22)+t(409,128,'→','#727c6a',22)+r(28,220,584,109,'#f0e8d3');
      for(const [i,key] of ['H','O'].entries()){const l=result.measurement.left[key],rgt=result.measurement.right[key];b+=t(46,249+i*43,`${key} 原子`,'#687966',12)+t(166,249+i*43,`左 ${l}`,'#687966',14)+t(340,249+i*43,`右 ${rgt}`,'#687966',14)+t(506,249+i*43,l===rgt?'相等':'待核对',l===rgt?'#5f8a72':'#a56e56',12);}
      return b+t(26,351,'只改系数；下标固定 · 最简整数比才收好','#77806a',10);
    }
    const m=result.measurement,all=p.boundary==='all';let b=r(0,0,640,360,'#d5d4c0')+t(25,28,'初始 100 g / 给定产气模型','#5e6d5d',12)+r(43,55,320,224,'#e9e3cc')+r(113,94,178,163,'#9fb4a5','fill-opacity=".5" stroke="#738e7c" stroke-width="3"')+r(119,201,166,50,'#bdaf8a');
    b+=r(p.lid==='open'?310:108,p.lid==='open'?63:83,p.lid==='open'?171:188,12,'#687e6e')+t(132,188,`容器内 ${m.inside} g`,'#586e5e',15);
    for(let i=0;i<Math.ceil(p.gas);i++){const x=p.lid==='open'?413+i%5*32:132+i%5*29,y=p.lid==='open'?120+Math.floor(i/5)*28:112+Math.floor(i/5)*19;b+=r(x,y,12,12,'#a6bda8','class="rt-gas"');}
    if(p.lid==='open')b+=`<path d="M294 128H392" stroke="#8a9f87" stroke-width="3" stroke-dasharray="5 4"/>`+t(397,106,`逸出 ${m.escaped} g`,'#6c826a',12);
    b+=`<rect x="69" y="67" width="${all?523:262}" height="214" rx="1" fill="none" stroke="#ab8658" stroke-width="3" stroke-dasharray="7 4"/><rect data-rt-handle="boundary" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="1" aria-valuenow="${all?1:0}" aria-valuetext="${all?'包含逸出气体':'仅容器'}" aria-label="拖动称量边界，方向键切换范围" x="${all?584:323}" y="264" width="16" height="25" fill="#ab8658"/>`+r(83,294,261,35,'#5f796c')+t(103,318,`天平 ${m.scale} g`,'#f0e8cb',16)+t(378,310,`总账 ${m.inside} + ${m.escaped} = 100 g`,'#65795e',12)+t(25,351,'拖边界把手圈入气体 · 绿色方块表去向，克数以读数为准','#6e7e63',10);
    return b;
  }
  function scene(id,c,p,result,{run}){return `<svg class="fv-scene rt-scene" viewBox="0 0 640 360" role="img" aria-label="${esc(M.definitions[id].title)}交互示意">${id==='P10'?physics(c,p,result):id==='M10'?mathematics(c,p,result,run):chemistry(c,p,result)}</svg>`;}
  function delivery(step){
    const coords=[[344,79],[533,180],[110,180],[110,180]],at=coords[Math.min(step,3)];
    return `<svg viewBox="0 0 640 300" role="img" aria-label="信袋沿潮汐港、标本港、测绘台返回"><rect width="640" height="300" fill="#243e4b"/><path d="M110 180L344 79 533 180 110 180" fill="none" stroke="#9fb49a" stroke-width="3" stroke-dasharray="8 6"/>${[[110,180,'潮汐港'],[344,79,'标本港'],[533,180,'测绘台']].map(([x,y,name])=>r(x-38,y-27,76,54,'#577e78')+r(x-31,y-21,62,37,'#b6c5a2')+t(x-28,y+52,name,'#d1d7b5',12)).join('')}${r(at[0]-13,at[1]-13,26,22,'#d9b178')}${t(24,31,step<3?'THE RETURN / 每一站都有人接':'00 / 下一位愿意试试的人','#d2cead',12)}${A.raven(278,239)}${A.companion(step===3?'老乔':'阿澜',89,236)}${step===3?r(344,264,233,8,'#9f8b66')+r(383,228,58,35,'#ddd5b5')+t(390,250,'00','#6c795f',14)+A.companion('新信使',578,235)+r(542,274,20,17,'#b9a17b')+t(353,292,'多了一箱的清单，放在新桌角','#c2ceb3',10):step===0?A.companion('小禾',458,239):''}</svg>`;
  }
  window.AtlasReturnArt={scene,delivery};
})();
