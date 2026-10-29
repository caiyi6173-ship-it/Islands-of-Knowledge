/* R04: conditions belong to the model and its records, not a hidden disclaimer gate. */
(() => {
  const local=typeof module!=='undefined'&&module.exports;
  const Research=local?require('./research-session.js'):window.AtlasResearchSession;
  const definitions={
    P03:{title:'绕过世界的信筒',person:'牛顿与图册编辑',place:'潮汐港 · 轨迹模型柜',conditions:['地面页：把信筒落进示意收集区','球形世界页：比较落下与环绕'],goals:['给定高度 1.5 m、仰角 35°、g = 9.8 m/s²，无空气。调速度，让模型落点位于 8—12 m；这页只解释理想落点。','已切换 R = 1、μ = 1、起点 r₀ = 1.2 的无空气球形世界。寻找不碰球面、完整可见的闭合轨道；图页用于解释环绕。'],change:'下一页换成逆平方引力的球形世界，不把地面 m/s 数字直接搬过去。起点、速度单位和假设都重新列出。',quality:'在同一球形世界保留两种速度的不同轨迹分类。碰地或开放轨迹可以勾“只记现象”作参考，不必提交错误声明。',intro:['小禾：这页能解释什么？我把用途留了空。','牛顿：先看假设下的轨迹。老乔：算出的模型落点，别直接写成实际运输指令。'],revisit:'编辑：轨迹与原假设都保留着。换页面时，先看这一页使用的量。',delivered:'带假设的轨道页已放进图册正面。你可以继续比较，之前的邮路不会倒退。',boundary:'地面页用恒定 g；球形页用无空气、球对称中心引力的二体模型，无发动机、地形与其他天体。归一化圆锥曲线不提供真实发射或邮船运输指令。',summary:'记录速度、轨迹分类与假设，把“解释环绕”写在正面。球形世界中的轨道不充当真实物流方案。'},
    M05:{title:'邮船能不能过的桥洞',person:'费马与阿澜',place:'测绘台 · 桥洞图纸',conditions:['先让曲线接上两端','固定顶点，检查整条船宽'],goals:['调 y = a(x−h)²+k，两端 (0,0.5)、(12,0.5) 的误差均不超过 0.05。先看两端，不只看顶点。','新页把顶点固定为 (6,5)，保留 a；两端仍需对齐。船占 x∈[3,9]，整个区间的净空至少 3.5，不能只查最高点。'],change:'下一页顶点明确固定为 h = 6、k = 5，原来的 h、k 不再沿用，开口 a 保留。旧曲线仍留在记录中；再检查船宽 [3,9]。',quality:'引用完整通行记录，把 a < 0 的凹性、两端求值与区间最小值连起来。数值扫点只作核对，不代替区间理由。',intro:['阿澜：最高处看着够高，可船的两边也要过去。','费马：把透明船宽叠上去。小禾：这页先只写几何净空，别把承重也算进结论。'],revisit:'阿澜：端点、船宽与原曲线都在。先看全宽最矮的地方。',delivered:'图册注明了整段船宽的几何条件，承重、潮位与真实航行评估没有被冒充为已完成。',boundary:'给定凹向下抛物线与矩形船体轮廓，距离为模型长度单位。净空相对同一基准线；不包含承重、波浪、潮位、船体运动或实际航行评估。',summary:'把两端、顶点、船宽、最低净空与未检查项目放在正面。几何通过只回答这张给定轮廓能否放入。'},
    C06:{title:'从纸上立起来的模型',person:'范特霍夫与图册读者',place:'标本港 · 空间模型架',conditions:['甲烷：转模型，对回四个顶点','换成现代水分子说明页'],goals:['选择能表示 CH₄ 的四面体候选，标注约 109.5° 的参考键角。转动镜头，分清前键、后键和纸上投影。','对象换成 H₂O 的现代教学模型：折线形、参考角约 104.5°，两侧 H 与两处孤对示意分开。角度标注不改变模型本身。'],change:'下一页对象换成水，现代说明另标。保留镜头方向，构型与参考角需重新核对；不是把甲烷随手掰成水。',quality:'在甲烷同一四面体上保留两个明显不同的视角，各自把 H1—H4 与前/后/近平面图例对应。参考角不变；只转镜头不算额外研究。',intro:['阿墨把折角抬起一点：这张纸原来还有前后。','范特霍夫：先转模型，对着顶点看。小禾：水的说明是后来补的，不把它写成同一段历史原实验。'],revisit:'读者：镜头位置、顶点身份和角度都留下了。纸上看着变了，模型里的角未必变。',delivered:'投影约定已经夹在正面，原稿与现代附页都保留。继续换视角不会撤回图册。',boundary:'正交投影的球棍教学模型；CH₄ 正四面体角 arccos(−1/3)≈109.47°，H₂O 参考角 104.5°。孤对区只是示意。镜头和角度标注都不改变真实分子的平衡构型。',summary:'把分子、候选构型、实际三维角、参考标注和观察方向分开写。二维投影可以用，但要带着前后约定。'}
  };
  const labels={impact:'碰到球面',circle:'圆形环绕',ellipse:'椭圆环绕',open:'开放轨迹'};
  function number(v,min,max){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw new RangeError('Outside model');return v;}
  function one(v,list){if(!list.includes(v))throw new RangeError('Unknown parameter');return v;}
  function normalize(id,c,p={}){
    if(!definitions[id]||![0,1].includes(c))throw new RangeError('Unknown atlas page');
    if(id==='P03')return c?{ratio:number(p.ratio??.7,.45,1.65),use:one(p.use??'model',['model','transport'])}:{speed:number(p.speed??6,4,16),use:one(p.use??'model',['model','transport'])};
    if(id==='M05'){
      if(c&&(p.h!==undefined&&p.h!==6||p.k!==undefined&&p.k!==5))throw new RangeError('The new page fixes its vertex');
      return {a:number(p.a??-.1,-.25,-.04),h:c?6:number(p.h??4,4,8),k:c?5:number(p.k??4,2.5,6.5)};
    }
    const marks=p.marks??Array(4).fill('');if(!Array.isArray(marks)||marks.length!==4)throw new RangeError('Invalid vertex mapping');
    return {shape:one(p.shape??'flat',['flat','tetra','bent']),yaw:number(p.yaw??25,-180,180),pitch:number(p.pitch??20,-65,65),angleLabel:number(p.angleLabel??90,90,115),marks:marks.map(v=>one(v,['','front','back','plane']))};
  }
  function ground(speed){
    const angle=35*Math.PI/180,vx=speed*Math.cos(angle),vy=speed*Math.sin(angle),time=(vy+Math.sqrt(vy*vy+2*9.8*1.5))/9.8,range=vx*time;
    const path=Array.from({length:81},(_,i)=>{const t=time*i/80;return {x:vx*t,y:Math.max(0,1.5+vy*t-4.9*t*t),t};});
    return {time,range,path};
  }
  function orbit(ratio){
    const r0=1.2,u2=ratio*ratio,e=Math.abs(u2-1),energy=(u2/2-1)/r0,angularMomentum=Math.sqrt(r0)*ratio;
    const bound=energy< -1e-10,peri=u2<1?r0*u2/(2-u2):r0,apo=bound?(u2<1?r0:r0*u2/(2-u2)):null;
    const kind=peri<1-1e-9?'impact':!bound?'open':Math.abs(ratio-1)<1e-9?'circle':'ellipse';
    const path=[{x:0,y:r0,t:0}],limit=3.25;let clipped=false,hit=false;
    for(let i=1;i<=360;i++){
      const phi=i*Math.PI/180,denom=1+(u2-1)*Math.cos(phi);if(denom<=0){clipped=true;break;}
      const r=r0*u2/denom,prev=path.at(-1),prevR=Math.hypot(prev.x,prev.y);
      const dt=(prevR*prevR+r*r)/2/angularMomentum*Math.PI/180;
      if(r<1){const fraction=(prevR-1)/(prevR-r),prevPhi=(i-1)*Math.PI/180,impactPhi=prevPhi+(phi-prevPhi)*fraction;path.push({x:Math.sin(impactPhi),y:Math.cos(impactPhi),t:prev.t+dt*fraction});hit=true;break;}
      if(r>limit){clipped=true;break;}
      path.push({x:r*Math.sin(phi),y:r*Math.cos(phi),t:prev.t+dt});
    }
    const closed=bound&&peri>=1-1e-9,fullVisible=closed&&!clipped;
    return {kind,label:labels[kind],energy,eccentricity:e,peri,apo,closed,fullVisible,clipped,hit,period:bound?2*Math.PI*(r0/(2-u2))**1.5:null,path};
  }
  function physics(c,p){
    const raw=c?orbit(p.ratio):ground(p.speed),{path,...measurement}=raw;
    const fixed=c?{radius:1,mu:1,launchRadius:1.2,launch:'tangential',air:false,otherBodies:false,units:'normalized',viewRadius:3.25}:{height:1.5,angle:35,g:9.8,air:false,ground:'flat',target:[8,12],units:'m,s'};
    const goal=(c?raw.fullVisible:raw.range>=8&&raw.range<=12)&&p.use==='model';
    return {legal:true,goalSupported:goal,referenceValid:true,fixed,measurement,factParams:c?{ratio:p.ratio}:{speed:p.speed},model:{path},
      readings:c?[['速度 / 圆轨道速度',p.ratio.toFixed(2)],['轨迹分类',raw.label],['比能量 / 偏心率',`${raw.energy.toFixed(4)} / ${raw.eccentricity.toFixed(4)}`],['近心距 / 球半径',`${raw.peri.toFixed(3)} / 1`],['数学闭合 / 完整绘出',`${raw.closed?'是':'否'} / ${raw.fullVisible?'是':'否'}`],['绘图区裁切',raw.clipped?'是；不等于已经逃逸':'否']]:[['发射速度',`${p.speed.toFixed(1)} m/s`],['理想落点',`${raw.range.toFixed(3)} m`],['理想飞行时间',`${raw.time.toFixed(3)} s`],['收集区','8—12 m']],
      feedback:p.use==='transport'?'轨迹读数没有改变。这些假设只支持模型解释，不能归档成实际运输或发射指令。':goal?'轨迹支持本页目标。把假设、速度和用途一起保存，下一位能知道这页回答什么。':!c?'在给定高度与角度下调整速度，看落点是否进入示意收集区。':raw.kind==='impact'?'这条轨迹会碰到球面，可以如实记为参考。增加切向速度，继续观察。':raw.clipped?'轨迹越出绘图区。数学上是否闭合要看能量和近心距，不能凭画面消失就说逃逸。':'这是开放轨迹，不是闭合环绕。保持假设，只换速度再比较。'};
  }
  function bridge(p){
    const at=x=>p.a*(x-p.h)**2+p.k,left=at(0),right=at(12),edgeLeft=at(3),edgeRight=at(9),minimum=Math.min(edgeLeft,edgeRight),minimumAt=edgeLeft<=edgeRight?3:9;
    const samples=Array.from({length:101},(_,i)=>({x:3+6*i/100,y:at(3+6*i/100)}));
    return {left,right,edgeLeft,edgeRight,minimum,minimumAt,scanMinimum:Math.min(...samples.map(s=>s.y)),endsAligned:Math.abs(left-.5)<=.05+1e-9&&Math.abs(right-.5)<=.05+1e-9,samples};
  }
  function mathematics(c,p){
    const raw=bridge(p),{samples,...measurement}=raw,goal=raw.endsAligned&&(!c||raw.minimum>=3.5-1e-9);
    return {legal:true,goalSupported:goal,referenceValid:true,fixed:{family:'a(x-h)^2+k',aNegative:true,abutments:[[0,.5],[12,.5]],tolerance:.05,...(c?{vertex:[6,5],boatInterval:[3,9],required:3.5}:{}),units:'model length'},measurement,model:{samples},
      readings:[['实际参数',`a=${p.a.toFixed(3)}, h=${p.h.toFixed(1)}, k=${p.k.toFixed(1)}`],['两端 y(0) / y(12)',`${raw.left.toFixed(3)} / ${raw.right.toFixed(3)}`],['船侧 y(3) / y(9)',`${raw.edgeLeft.toFixed(3)} / ${raw.edgeRight.toFixed(3)}`],['[3,9] 最低净空',`${raw.minimum.toFixed(3)}，在 x=${raw.minimumAt}`],['顶点高度',p.k.toFixed(3)]],
      feedback:goal?'本页的几何条件有依据。通行范围和未检查项目会一起放进图册。':c&&raw.minimum<3.5?'顶点高不代表全船能过。高亮船侧最低处；先检查整个 [3,9]，再核对两端。':'两端还没有同时接上 (0,0.5)、(12,0.5)。先调顶点与开口，再看船宽。'};
  }
  const s=1/Math.sqrt(3),tetra=[[s,s,s],[s,-s,-s],[-s,s,-s],[-s,-s,s]],flat=[[1,0,0],[0,1,0],[-1,0,0],[0,-1,0]];
  const waterAngle=104.5*Math.PI/360,bent=[[Math.sin(waterAngle),-Math.cos(waterAngle),0],[-Math.sin(waterAngle),-Math.cos(waterAngle),0]];
  function project(point,yaw,pitch){const y=yaw*Math.PI/180,p=pitch*Math.PI/180,[x,Y,z]=point,X=Math.cos(y)*x+Math.sin(y)*z,Z=-Math.sin(y)*x+Math.cos(y)*z;return {x:X,y:Math.cos(p)*Y-Math.sin(p)*Z,z:Math.sin(p)*Y+Math.cos(p)*Z};}
  const depth=z=>Math.abs(z)<.04?'plane':z>0?'front':'back';
  function molecule(p){
    const points=p.shape==='tetra'?tetra:p.shape==='flat'?flat:bent;
    const projections=points.map((v,i)=>({id:'H'+(i+1),...project(v,p.yaw,p.pitch)}));
    const a=points[0],b=points[1],actualAngle=Math.acos(Math.max(-1,Math.min(1,a.reduce((sum,v,i)=>sum+v*b[i],0))))*180/Math.PI;
    const u=projections[0],v=projections[1],denom=Math.hypot(u.x,u.y)*Math.hypot(v.x,v.y),projectedAngle=denom<1e-8?null:Math.acos(Math.max(-1,Math.min(1,(u.x*v.x+u.y*v.y)/denom)))*180/Math.PI;
    const depths=projections.map(v=>depth(v.z));
    const mapping=p.shape==='tetra'&&depths.every((v,i)=>p.marks[i]===v)&&depths.includes('front')&&depths.includes('back');
    return {points,projections,depths,actualAngle,projectedAngle,mapping};
  }
  function chemistry(c,p){
    const m=molecule(p),target=c?104.5:109.5,goal=p.shape===(c?'bent':'tetra')&&Math.abs(p.angleLabel-target)<=.15;
    return {legal:true,goalSupported:goal,referenceValid:true,fixed:{molecule:c?'H2O':'CH4',referenceAngle:target,projection:'orthographic',viewPositiveZ:'towards viewer',lonePairs:c?2:0},
      factParams:{shape:p.shape,yaw:p.yaw,pitch:p.pitch},measurement:{points:m.points,projections:m.projections,actualAngle:m.actualAngle,projectedAngle:m.projectedAngle,peripheralAtoms:m.points.length},model:{depths:m.depths,mapping:m.mapping},
      readings:[['给定分子 / 候选',`${c?'H₂O':'CH₄'} / ${{flat:'平面十字',tetra:'四面体',bent:'折线形'}[p.shape]}`],['模型三维角 H1—中心—H2',`${m.actualAngle.toFixed(2)}°`],['当前纸上投影角',m.projectedAngle===null?'投影退化，换视角':`${m.projectedAngle.toFixed(2)}°`],['你的参考角标注',`${p.angleLabel.toFixed(1)}°`],['观察方向',`水平 ${p.yaw.toFixed(0)}° / 俯仰 ${p.pitch.toFixed(0)}°`],['顶点与前后图例',c?'水分子孤对区另画示意':m.mapping?'H1—H4 对应成立':'可选：逐顶点标前 / 后 / 近平面']],
      feedback:goal?'候选构型与参考标注成立。纸上角度随镜头变，三维角由所选模型本身决定。':p.shape!==(c?'bent':'tetra')?'先核对外围原子与候选构型。旋转镜头不会把平面十字变成立体四面体。':'角度标注没有改变模型。用三维参考角标注这一页，不把投影上看似直角当作实际键角。'};
  }
  function pageScope(id,c){
    if(id==='P03')return {purpose:c?'解释给定理想世界中的环绕':'解释给定地面条件下的落点',conditions:c?'无空气、球对称中心引力；R=μ=1，r₀=1.2，切向初速':'平地、无空气；高 1.5 m，仰角 35°，g=9.8 m/s²',notTested:['真实发射与动力装置','实际运输与地形']};
    if(id==='M05')return {purpose:'核对给定船体轮廓的几何净空',conditions:c?'a<0；h=6、k=5；两端高 0.5，船宽 [3,9]、高 3.5':'a<0；两端 (0,0.5)、(12,0.5)，同一长度基准',notTested:['承重与结构安全','潮位、波浪和真实航行']};
    return {purpose:'说明分子候选构型与二维投影的关系',conditions:c?'现代 H₂O 模型：折线形，参考角 104.5°；孤对另示意':'CH₄ 正四面体，参考角约 109.5°；顶点身份固定',notTested:['真实合成与动态运动','孤对的实际空间分布']};
  }
  function evaluate(id,c,p){const result=id==='P03'?physics(c,p):id==='M05'?mathematics(c,p):chemistry(c,p);Object.assign(result.fixed,pageScope(id,c));return result;}

  function compare(id,{condition,basis,params,result}){
    if(id==='P03'){
      const eligible=condition===1&&basis.params.ratio!==params.ratio&&basis.measurement.kind!==result.measurement.kind&&basis.params.use==='model'&&params.use==='model';
      return {eligible,verified:eligible,kind:'orbit-comparison'};
    }
    if(id==='C06'){
      const before=molecule(basis.params),after=molecule(params),delta=Math.hypot(params.yaw-basis.params.yaw,params.pitch-basis.params.pitch);
      const eligible=condition===0&&basis.goalSupported&&result.goalSupported&&before.mapping&&after.mapping&&delta>=30&&before.depths.some((v,i)=>v!==after.depths[i]);
      return {eligible,verified:eligible,kind:'spatial-correspondence'};
    }
    return {eligible:false};
  }
  function reviewCommand(state){if(state.id!=='M05')return null;const r=state.records.findLast(r=>r.condition===1&&r.recordValid&&r.goalSupported);return r?{references:[r.id],reasoning:'concave-clearance'}:null;}
  function review(state,cmd){
    if(state.id!=='M05'||cmd.reasoning!=='concave-clearance'||!Array.isArray(cmd.references)||cmd.references.length!==1)return null;
    const r=state.records.find(r=>r.id===cmd.references[0]&&r.runId===state.runId&&r.condition===1&&r.recordValid&&r.goalSupported);if(!r)return null;
    const m=bridge(r.params);if(r.params.a>=0)return null;
    return {references:[r.id],reasoning:'concave-clearance',verified:true,measurement:{a:r.params.a,left:m.edgeLeft,right:m.edgeRight,minimum:m.minimum,scanMinimum:m.scanMinimum},text:`a=${r.params.a.toFixed(3)}<0，曲线凹向下。区间内函数值不低于两端连线，因此不低于较小端点。y(3)=${m.edgeLeft.toFixed(3)}、y(9)=${m.edgeRight.toFixed(3)}，整个 [3,9] 的最低净空 ${m.minimum.toFixed(3)}≥3.5。101 点计算核对为 ${m.scanMinimum.toFixed(3)}，扫点不代替上述区间理由。`};
  }
  function candidates(id,c,state){
    const records=(state?.records||[]).filter(r=>r.condition===c&&r.recordValid);
    if(id==='P03'&&c)return [.7,1,1.5].map(ratio=>({ratio,use:'model'}));
    if(id==='C06'&&!c)return records.filter(r=>r.goalSupported).flatMap(r=>[25,115].map(yaw=>{const p={...r.params,yaw,marks:Array(4).fill('')};return {...p,marks:molecule(p).depths};}));
    return [];
  }
  function createSession(id){if(!definitions[id])throw new RangeError('Unknown atlas level');return Research.create({id,modelVersion:`atlas-${id}-1`,normalize:(c,p)=>normalize(id,c,p),evaluate:(c,p)=>evaluate(id,c,p),compare:input=>compare(id,input),candidates:(c,state)=>candidates(id,c,state),review:id==='M05'?review:undefined,reviewCandidate:id==='M05'?reviewCommand:undefined,consult:(c,strong)=>({text:definitions[id].goals[c]+(strong?' '+definitions[id].quality:'')})});}
  const api={definitions,labels,pageScope,normalize,evaluate,ground,orbit,bridge,project,molecule,compare,reviewCommand,review,createSession};
  if(local)module.exports=api;if(typeof window!=='undefined')window.AtlasAtlasModels=api;
})();
