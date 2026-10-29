/* The atlas uses three different visual instruments, all driven by saved model parameters. */
(() => {
  const M=window.AtlasAtlasModels,A=window.AtlasFirstVoyageArt;
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const r=(x,y,w,h,c,a='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" ${a}/>`;
  const t=(x,y,s,c='#e8dfc1',size=12,a='')=>`<text x="${x}" y="${y}" fill="${c}" font-size="${size}" ${a}>${esc(s)}</text>`;
  const physicalPoint=(c,p)=>c?[300+p.x*45,190-p.y*45]:[40+p.x*20,310-p.y*30];
  const bridgePoint=(x,y)=>[44+x*46,312-y*36];
  const path=(points,project)=>points.map((p,i)=>`${i?'L':'M'}${project(p).join(',')}`).join('');
  function physics(c,p,result,run){
    const project=v=>physicalPoint(c,v),ghosts=run.records.filter(rec=>rec.condition===c).slice(-3).map(rec=>c?M.orbit(rec.params.ratio).path:M.ground(rec.params.speed).path);
    let body=r(0,0,640,360,c?'#263b3b':'#d5c8ad')+t(26,29,c?'理想球形世界 / R=1 · μ=1':'地面页 / 理想落点','#'+(c?'c7c6a6':'5a614c'),12);
    if(c){body+=`<circle cx="300" cy="190" r="45" fill="#6f8e70"/>`+r(278,160,24,17,'#b4b08a')+r(305,178,30,14,'#b4b08a')+r(282,209,19,17,'#a4aa78')+`<circle cx="300" cy="190" r="146" stroke="#688378" stroke-dasharray="4 5" fill="none"/>`+t(21,68,'r₀=1.2','#b4c2aa',11)+t(21,91,'切向初速度','#b4c2aa',11)+t(440,71,result.measurement.label,'#e3c68a',12)+t(440,92,result.measurement.clipped?'图像已裁切':'轨迹完整可见','#b3c0a8',10);}
    else{
      for(let x=0;x<=28;x+=2)body+=`<path d="M${40+x*20} 53V310" stroke="#9c9d82" stroke-opacity=".3"/>`;
      for(let y=0;y<=7;y++)body+=`<path d="M40 ${310-y*36}H608" stroke="#9c9d82" stroke-opacity=".3"/>`;
      body+=r(0,310,640,50,'#7d8b68')+r(200,309,80,15,'#c4a65f')+t(200,342,'收集区 8—12 m','#f4e6c5',11)+r(22,264,24,46,'#9c7952')+t(29,65,'35° / 1.5 m / 无空气','#5d654e',11);
    }
    body+=ghosts.map(g=>`<path d="${path(g,project)}" fill="none" stroke="${c?'#a4b7a1':'#868b73'}" stroke-width="1.5" opacity=".45" stroke-dasharray="4 4"/>`).join('');
    const start=project(result.model.path[0]);body+=`<path d="${path(result.model.path,project)}" fill="none" stroke="${c?'#e5c68b':'#a66f40'}" stroke-width="3"/><circle class="at-moving" cx="${start[0]}" cy="${start[1]}" r="5" fill="${c?'#f5dd9f':'#77553b'}"/>`+t(21,c?344:358,c?'模型时间回放 · 灰虚线为近期正式记录':'恒定 g 与平面；下一页将换模型','#'+(c?'b6c6ae':'f1e6ce'),10);
    return body;
  }
  function mathematics(c,p,result,run){
    const at=x=>p.a*(x-p.h)**2+p.k,curve=Array.from({length:121},(_,i)=>{const x=i/10;return {x,y:at(x)};});
    const project=point=>bridgePoint(point.x,point.y);
    let body=r(0,0,640,360,'#e3d9be')+t(24,27,c?'全船宽度 [3,9] / 最低处才决定净空':'两端都接上，再谈通行','#5c6350',12)+`<defs><clipPath id="at-bridge-clip"><rect x="40" y="42" width="558" height="273"/></clipPath></defs>`;
    for(let x=0;x<=12;x++)body+=`<path d="M${44+x*46} 44V313" stroke="#b0af91" stroke-opacity=".45"/>`;
    for(let y=0;y<=7;y++)body+=`<path d="M44 ${312-y*36}H596" stroke="#b0af91" stroke-opacity=".45"/>`;
    body+=`<path d="M44 42V312H600" fill="none" stroke="#7e8e6e" stroke-width="2"/>`;
    if(c){const previous=run.records.findLast(rec=>rec.condition===0&&rec.goalSupported);if(previous)body+=`<path d="${path(Array.from({length:121},(_,i)=>({x:i/10,y:previous.params.a*(i/10-previous.params.h)**2+previous.params.k})),project)}" stroke="#94977c" stroke-width="2" stroke-dasharray="4 5" fill="none" clip-path="url(#at-bridge-clip)"/>`;
      body+=r(44+3*46,312-3.5*36,6*46,3.5*36,'#7c9a8b','fill-opacity=".25" stroke="#728e7f" stroke-width="2"')+t(238,287,'船体轮廓 / 高 3.5','#4f6f67',12);
      const [x,y]=bridgePoint(result.measurement.minimumAt,result.measurement.minimum);body+=`<path d="M${x} ${312-3.5*36}V${y}" stroke="${result.measurement.minimum<3.5?'#b86f52':'#5d8976'}" stroke-width="8"/><circle cx="${x}" cy="${y}" r="6" fill="#bb8154"/>`;
    }
    body+=`<path d="${path(curve,project)}" fill="none" stroke="#67806a" stroke-width="4" clip-path="url(#at-bridge-clip)"/>`;
    for(const x of [0,12]){const [X,Y]=bridgePoint(x,.5);body+=r(X-5,Y-5,10,10,'#b08659')+t(X===44?47:545,333,`(${x},0.5)`,'#6a7155',10);}
    const [vx,vy]=bridgePoint(p.h,p.k),[ox,oy]=bridgePoint(p.h+3,at(p.h+3));
    body+=`<g ${c?'':'data-at-handle="vertex" tabindex="0" role="slider" aria-label="拖动顶点"'}>${r(vx-7,vy-7,14,14,'#9c7952')}${t(vx+12,vy-9,`(${p.h.toFixed(1)},${p.k.toFixed(1)})`,'#695d45',10)}</g><g data-at-handle="opening" tabindex="0" role="slider" aria-label="拖动开口控制点">${r(ox-6,oy-6,12,12,'#548b83')}${t(ox+12,oy+4,'开口 a','#4c786c',10)}</g>`+t(23,354,c?'凹向下曲线：两端求值与区间理由分别保留':'拖棕色顶点、青色开口；滑条与方向键等价','#6d7559',10);
    return body;
  }
  const xy=(projection,cx,cy,scale)=>[cx+projection.x*scale,cy-projection.y*scale];
  function chemistry(c,p,result){
    const m=result.measurement,points=m.projections,depths=result.model.depths;
    let body=r(0,0,640,360,'#dadde0')+r(20,51,346,252,'#bdc9c7','data-at-rotate="true" tabindex="0" role="group" aria-label="拖动旋转空间模型，方向键也可旋转"')+r(387,51,233,252,'#eeeadc')+t(27,30,`${c?'H₂O 现代说明':'CH₄'} / 候选构型与观察方向分开`,'#4c5e63',12)+t(34,73,'空间模型 · 拖动旋转','#536d6b',10)+t(400,73,'同一镜头的正交投影','#76775f',10);
    const bonds=(cx,cy,scale,paper)=>points.map((v,i)=>{
      const [X,Y]=xy(v,cx,cy,scale),kind=depths[i],color=paper?'#8e7b61':'#526f73';
      return `<g data-at-bond="${i}" data-depth="${kind}" ${paper?'':'data-at-rotate="true"'}><path d="M${cx} ${cy}L${X} ${Y}" stroke="${color}" stroke-width="${kind==='front'?paper?5:8:3}" ${kind==='back'?'stroke-dasharray="3 5"':''}/><circle cx="${X}" cy="${Y}" r="${paper?8:kind==='front'?15:11}" fill="${paper?'#d2c7a6':kind==='back'?'#cbd4cf':'#f0e8cc'}" stroke="${color}" stroke-width="2"/>${t(X+(paper?10:17),Y+4,v.id,paper?'#716958':'#3f5b5c',10)}</g>`;
    }).join('');
    body+=bonds(191,174,91,false)+`<circle data-at-rotate="true" cx="191" cy="174" r="20" fill="${c?'#ac786b':'#53646c'}"/>`+t(185,180,c?'O':'C','#f0e9d0',16)+bonds(497,174,64,true)+t(491,179,c?'O':'C','#695d4c',14);
    if(c&&p.shape==='bent'){
      for(const [i,point] of [[0,[-.55,.75,-.5]],[1,[.55,.75,-.5]]]){const v=M.project(point,p.yaw,p.pitch),[X,Y]=xy(v,191,174,91);body+=`<ellipse cx="${X}" cy="${Y}" rx="19" ry="12" fill="#8e829c" fill-opacity=".42" data-at-lone="${i}"/>`;}
      body+=t(36,282,'紫色：孤对区域示意，不是外围原子','#71647d',10);
    }else body+=t(35,282,'粗线：前 / 虚线：后 / 细线：近平面','#597371',10);
    body+=t(403,274,`投影角 ${m.projectedAngle===null?'退化':m.projectedAngle.toFixed(1)+'°'}`,'#8e7755',12)+t(29,330,`三维角 ${m.actualAngle.toFixed(2)}° · 标注 ${p.angleLabel.toFixed(1)}°`,'#55646a',12)+t(29,351,'改标注不会掰动模型；转镜头不会改变三维键角','#6e7976',10);
    return body+r(20,51,346,252,'transparent','data-at-rotate="true" tabindex="-1" aria-label="拖动整个空间模型旋转"');
  }
  function scene(id,c,p,result,{run}){return `<svg class="fv-scene at-scene" viewBox="0 0 640 360" role="img" aria-label="${esc(M.definitions[id].title)}交互示意">${id==='P03'?physics(c,p,result,run):id==='M05'?mathematics(c,p,result,run):chemistry(c,p,result)}</svg>`;}
  function context(){return '<details class="at-dossier"><summary>图纸背面的那一行 · 小禾与阿墨的便签</summary><p>小禾：这几页看起来能照着做。能用来做什么，还缺几行。</p><p>阿墨抬起折角。老乔：先别忙着誊漂亮，翻回来，看它原来回答什么。</p><p>本页的模型条件在操作区直接可见，不需要读完便签才能实验。旧页、先前成果与未验证项都会保留。</p></details>';}
  function delivery(step){return `<svg viewBox="0 0 640 300" role="img" aria-label="把图册条件放到正面">${r(0,0,640,300,'#3d5146')}${[44,242,440].map((x,i)=>r(x,39,158,170,['#d8c8a4','#c9d3b3','#c7d0ce'][i])+t(x+16,66,['轨迹页','净空页','构型页'][i],'#576752',12)+t(x+16,102,'用途 · 条件 · 待查','#71775d',10)+r(x+14,119,128,2,'#a6af92')+t(x+16,154,step?'放在正面':'翻开折角','#67765d',12)+(step? '':`<path d="M${x+129} 39L${x+158} 68H${x+129}Z" fill="#b09d7a"/>`)).join('')}${A.raven(311,225)}${A.companion('老乔',93,235)}${A.companion('小禾',470,235)}${r(28,289,581,6,'#96a083')}</svg>`;}
  window.AtlasAtlasArt={scene,context,delivery,physicalPoint,bridgePoint};
})();
