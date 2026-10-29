/* Code-native pixel stages. Numerical verdicts belong to nightwatch-models. */
(() => {
  const A=window.AtlasFirstVoyageArt;
  const rect=(x,y,w,h,c,a='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" ${a}/>`;
  const text=(x,y,s,c='#e8e1c7',size=12)=>`<text x="${x}" y="${y}" fill="${c}" font-size="${size}">${s}</text>`;
  const line=(x,y,X,Y,c,width=3)=>`<path d="M${x},${y}L${X},${Y}" stroke="${c}" stroke-width="${width}" fill="none"/>`;
  function scene(id,c,p,result,context={}){
    let body='',bg='#273d36';
    if(id==='P06'){
      const trace=p.trace,last=trace.at(-1).value,series=result.measurement.series,needle=Math.max(-1,Math.min(1,series.at(-1).response/2));
      const responseScale=Math.max(1,...series.map(s=>Math.abs(s.response)));
      const inputMin=Math.min(...trace.map(s=>s.value)),inputSpan=Math.max(.01,result.measurement.span);
      const inputGraph=trace.map((s,i)=>`${i?'L':'M'}${340+(s.t-trace[0].t)/Math.max(1000,trace.at(-1).t-trace[0].t)*255},${308-(s.value-inputMin)/inputSpan*15}`).join('');
      const graph=series.map((s,i)=>`${i?'L':'M'}${340+(s.t-trace[0].t)/Math.max(1000,trace.at(-1).t-trace[0].t)*255},${261-s.response/responseScale*23}`).join('');
      const magnetX=120+(last+2)*125;
      body=rect(0,0,640,220,'#344d3f')+rect(0,220,640,140,'#654a37')+rect(24,27,190,104,'#223b36')+line(116,27,116,131,'#55785a')+line(24,78,214,78,'#55785a')+text(37,51,'工坊 / INPUT → RESPONSE','#bad09c',10)+rect(26,202,574,18,'#ae8553');
      if(!c)body+=Array.from({length:7},(_,i)=>`<ellipse cx="${298+i*6}" cy="159" rx="13" ry="44" fill="none" stroke="#db9a5d" stroke-width="5"/>`).join('');
      if(c)body+=rect(218,137,36,45,'#b96f58')+text(228,164,'N')+rect(388,137,36,45,'#7eaba2')+text(398,164,'S')+line(256,160,386,160,'#9cb28e',2);
      body+=c?`<g transform="translate(320 160) rotate(${last%360})">${rect(-48,-28,96,56,'none','stroke="#e3b777" stroke-width="6"')}${line(0,0,66,0,'#d8d6a9',6)}<circle cx="66" cy="0" r="12" fill="#efd991" data-nw-handle="rotor" style="cursor:grab"/></g>`:`<g transform="translate(${magnetX} 144)" data-nw-handle="magnet" style="cursor:grab">${rect(-44,0,44,30,'#bb6e58')}${rect(0,0,44,30,'#88a7a0')}${text(-30,20,'N')}${text(13,20,'S')}</g>`;
      body+=rect(430,72,161,116,'#1f302c')+rect(441,83,139,77,'#e7dfbf')+`<path d="M461 140 A51 51 0 0 1 560 140" stroke="#69766b" stroke-width="2" fill="none"/>`+line(510,143,510+needle*45,98,'#b6684b',3)+text(482,178,'ε / 相对量','#d0c49a',10)+text(24,251,c?'旋转输入 θ':'磁铁位置 x','#edd5ad')+text(24,278,last.toFixed(2)+(c?'°':' 格'),'#fff1cc',20)+text(24,305,'停住后看指针回零','#d5c3a4',11)+rect(331,231,274,103,'#21362f')+line(340,261,595,261,'#6c8b75',1)+`<path d="${graph}" fill="none" stroke="#e4bf72" stroke-width="2"/><path d="${inputGraph}" fill="none" stroke="#a0bba0" stroke-width="2"/>`+text(346,326,'黄：响应 / 绿：输入 · 各轴归一','#b1c4a3',10);
    }else if(id==='C10'){
      bg='#ded9c9';const closed=result.measurement.closed;
      body=rect(0,0,640,360,bg)+rect(0,250,640,110,'#8a7593')+rect(25,29,590,6,'#c0b6b0')+rect(70,137,174,151,'#dce5df','stroke="#6a7e7a" stroke-width="3"')+rect(396,137,174,151,'#dce5df','stroke="#6a7e7a" stroke-width="3"')+rect(73,202,168,83,'#b5c7bd')+rect(399,202,172,83,'#9bc1cf')+rect(115,111,26,147,'#889a96')+rect(493,111,26,147,'#b88161')+text(110,318,'Zn / 锌','#443b50')+text(488,318,'Cu / 铜','#443b50');
      body+=`<path d="M128 112 V68 H267 M373 68 H506 V112" stroke="#66586c" stroke-width="5" fill="none"/>`;
      body+=p.wire==='on'?line(267,68,373,68,'#b86d4c',5):line(267,68,310,39,'#a78f87',5);
      body+=`<g data-nw-handle="wire" style="cursor:grab">${rect(280,p.wire==='on'?49:21,80,26,'#b86d4c')}${text(285,p.wire==='on'?67:39,'外导线','#fff5df',10)}</g><rect x="264" y="51" width="112" height="33" fill="transparent" stroke="#a59a92" stroke-dasharray="4" data-nw-port="wire"/>`;
      body+=`<path d="M189 214 V158 H451 V214" fill="none" stroke="${p.bridge==='on'?'#e8dba5':'#c4c2b6'}" stroke-width="18" opacity="${p.bridge==='on'?1:.25}"/>`;
      body+=`<g data-nw-handle="bridge" style="cursor:grab">${rect(281,p.bridge==='on'?143:331,78,25,'#b4a36f')}${text(287,p.bridge==='on'?160:348,'盐桥','#fffbea',11)}</g><rect x="264" y="136" width="112" height="41" fill="transparent" stroke="#a59a92" stroke-dasharray="4" data-nw-port="bridge"/>`;
      if(closed)body+=`<g class="nw-current">${text(196,57,'e⁻ →','#7b4938',15)}${text(402,57,'e⁻ →','#7b4938',15)}${text(249,196,'离子 ⇄ 离子','#6a603b',11)}</g>`;
      body+=rect(268,219,104,74,'#4a4158')+text(280,242,'电流 / mA','#cdc6dc',10)+text(278,275,result.measurement.current.toFixed(2),'#e7d59f',21)+text(31,347,c?'负载改变电流，方向签只表达判断':'两路缺一不可 · 拖动接头，或使用右侧开关','#fff4df',11);
    }else{
      bg='#9bbdbd';const m=result.measurement,x0=215,y0=291,scale=9,px=x0+m.drift*scale,top=111;
      body=rect(0,0,640,360,bg)+rect(0,0,640,107,'#cbb38a')+rect(0,301,640,59,'#6e8d70')+rect(0,107,640,8,'#e2d2a9')+rect(0,297,640,8,'#dfd0a7');
      for(let y=132;y<290;y+=38)for(let x=20;x<640;x+=102)body+=line(x,y,x+36,y,'#c3ddce',2);
      const previous=context.run?.records.findLast(r=>r.condition===0&&r.goalSupported);
      if(c&&previous)body+=`<path d="M${x0} ${y0} L${x0+previous.measurement.drift*scale} ${top}" fill="none" stroke="#e5d6a5" stroke-width="3" stroke-dasharray="5 5"/>`;
      body+=`<path d="M${x0} ${y0} L${px} ${top}" stroke="#315e65" stroke-width="3" stroke-dasharray="7 5"/><g class="nw-boat" data-end-x="${m.drift*scale}" data-duration="${m.time}">${rect(x0-16,y0-7,32,14,'#664c41')}${rect(x0-8,y0-18,16,13,'#ecd5a3')}</g>`;
      const ox=470,oy=269,bx=5*Math.cos(p.angle*Math.PI/180)*16,by=-m.vy*16;
      body+=`<defs>${[['boat','#f7df8f'],['water','#527e89'],['result','#a66550']].map(([name,color])=>`<marker id="nw-${name}-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8Z" fill="${color}"/></marker>`).join('')}</defs><path d="M${ox} ${oy}L${ox+bx} ${oy+by}" stroke="#f7df8f" stroke-width="4" marker-end="url(#nw-boat-arrow)"/><path d="M${ox+bx} ${oy+by}L${ox+bx+48} ${oy+by}" stroke="#527e89" stroke-width="4" marker-end="url(#nw-water-arrow)"/><path d="M${ox} ${oy}L${ox+bx+48} ${oy+by}" stroke="#a66550" stroke-width="3" marker-end="url(#nw-result-arrow)"/>`+`<circle cx="${ox+bx}" cy="${oy+by}" r="10" fill="#fff1b7" stroke="#6b6747" stroke-width="2" data-nw-handle="heading" style="cursor:grab"/>`+text(395,325,'船速 5 + 水流 3 = 合速度','#263f44',11)+text(25,39,c?'目标 02 / 最短时间':'目标 01 / 正对岸','#503f32',15)+text(25,64,'河宽 20 · 模型长度单位','#685b45',11)+text(300,39,'水流 → 3','#503f32',12)+rect(202,78,28,28,'#745d44')+text(204,98,'岸','#f6e4bf')+A.companion('阿澜',40,296)+text(277,346,'航行动画 ×2 · 数值采用模型时间','#243f3c',10);
    }
    return `<svg class="fv-scene nw-scene" viewBox="0 0 640 360" role="img" aria-label="${window.AtlasNightwatchModels.definitions[id].title}交互示意" style="background:${bg}">${body}</svg>`;
  }
  function delivery(step){return `<svg viewBox="0 0 640 300" role="img" aria-label="夜班交接">${rect(0,0,640,300,'#203b44')}${rect(28,34,240,202,'#405554')}${rect(52,63,191,133,'#b7b08a')}${rect(64,77,166,107,'#eadcad')}${text(87,104,step===0?'工坊操作卡':step===1?'今夜接信 · 有人值班':'两张旧图 · 同一枚章','#4e584c',13)}${rect(64,123,166,3,'#b7ad88')}${text(83,152,step===2?'↗ ？ ↘':'下一班：小禾与同伴','#4e584c',12)}${A.companion('小禾',176,195)}${A.companion('阿澜',342,217)}${A.companion('老乔',452,217)}${A.raven(296,194)}${rect(20,270,600,10,'#8c8060')}${Array.from({length:5},(_,i)=>rect(310+i*58,91,5,5,'#b6c4aa')).join('')}${text(324,46,'P ↔ C / 局部夜邮','#e0cd98',12)}</svg>`;}
  window.AtlasNightwatchArt={scene,delivery};
})();
