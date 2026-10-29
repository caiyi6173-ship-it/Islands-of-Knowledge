/* R03 pure models. Given old pages never overwrite the courier's earlier records. */
(() => {
  const local=typeof module!=='undefined'&&module.exports;
  const Research=local?require('./research-session.js'):window.AtlasResearchSession;
  const codes={S:'...',R:'.-.',O:'---'};
  const vertices=[[0,0],[2,0],[2,1],[0,2]];
  const operations={R:'绕原点逆时针 90°',T:'平移 (3,2)',F:'关于 y 轴反射'};
  const definitions={
    P07:{title:'没有电线的来信',person:'麦克斯韦与收发员',place:'潮汐港 · 收发台',conditions:['先让同一段报码听得清','对岸换成 5，发来 R 模板'],goals:['对岸接收刻度为 3，给定报码 S（···）。亲手按三次短音，调谐后核对收到的纸带。','接收刻度已改为 5，目标 R（·−·）。重新调谐并按出短、长、短；音量不能替代符号核对。'],change:'对岸改了接收条件，目标也换成 R。旧 S 页仍有效；新页要另留实际时序。',quality:'同一接收条件、同一组按键时序，分别记录失谐参考与调谐结果；参考可以勾“只记现象”。',intro:['老乔：两张旧页连收发约定都没写全，先别只看站章。','阿澜：对岸在等。收发员：先把这一小段发清楚，再把约定带过去。'],revisit:'收发员：原纸带都保留着。改变刻度不改变你刚才按出的短长音。',delivered:'小禾读懂了附有码本与接收条件的分册。旧页和原纸带都还在。',boundary:'限定 S / R / O 的教学报码。刻度与质量为无量纲简化；使用宽松按键时长窗，不实现真实无线电或完整摩尔斯时序协议。科学家对白为跨时代创作。',summary:'分册同时留下收发刻度、原始按键时长、码本与接收纸带。失谐和报码错误分别说明，不拿字母标签充当信号。'},
    M06:{title:'转过来的图纸',person:'克莱因与小禾',place:'测绘台 · 透明图纸桌',conditions:['先转，再移，叠回给定目标','交换次序，再做 2 倍放大'],goals:['同一张带缺口原片：绕 (0,0) 逆时针旋转 90°，再平移 (3,2)，比例保持 1。','先平移 (3,2)，再绕原点旋转 90°，最后以原点为中心放大 2 倍。核对中间顶点、最终长度与面积。'],change:'交换两张操作卡，比较未放大时的位置；再调到 2 倍，长度与面积要分开看。',quality:'归档两种次序后，引用两份记录与其中的中间顶点 A，核对为什么位置不同；比例还原后比较同一原片。',intro:['阿澜：两页看起来都朝上，照一张送不行吗？','小禾的便签：我的图先移再转。克莱因：把次序摆出来，我们一起查。'],revisit:'小禾：透明片和步骤都在，先对中心与次序，再看它落在哪里。',delivered:'变换顺序已写进共同分册。旧图是给定档案，不会撤回你以前正确的地址签。',boundary:'同一非对称四边形；旋转中心、缩放中心固定为 (0,0)，角度统一为逆时针 90°。反射保持长度与角度但反转定向；图中坐标可逐点复算。',summary:'保留原片、每一步顶点、旋转中心与比例。两种次序各有用途，不能只凭最终朝向互相替换。'},
    C04:{title:'画错了的两颗点',person:'路易斯与小禾',place:'标本港 · 电子图例台',conditions:['H₂：把一对电子放在共用区','O₂：两对共享，四对孤对'],goals:['把唯一一对电子移到两个 H 之间，分别核对全分子总数与每个 H 周围的计数。','O₂ 共 6 对、12 个价电子。共享 2 对，左、右 O 各留 2 孤对；共享对在每个原子周围都计入，全分子只算一次。'],change:'这次有六对电子。先摆位置，再读总数；“全分子四孤对”不等于每个原子四孤对。',quality:'在正确 O₂ 上切到键线式，把每一共享对实际对应到不同键线，保留两侧孤对，再记录一次。只切显示按钮不算核对。',intro:['阿墨：那把说不准的两颗点删掉？','小禾：先别删，我这张也少写一行。路易斯：先分清共用区和各自周围。'],revisit:'路易斯：电子对的位置和图例都保留着。共享不是把电子在全分子里算两次。',delivered:'小禾也把自己的补注夹回来了。两边都留原页，电子点和报码点各有各的含义。',boundary:'Lewis 教学表示：H₂ 双电子、O₂ 八电子计数与双键。此图不完整解释 O₂ 的磁性与分子轨道；拖动是排布图例，不是真实电子轨迹。',summary:'分册分别注明全分子电子总数、每原子周围的计数、共享对和孤对；键线仍要能对回原来的电子对。'}
  };
  function number(v,min,max){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw new RangeError('Outside model');return v;}
  function one(v,values){if(!values.includes(v))throw new RangeError('Unknown symbol');return v;}
  function normalize(id,condition,p={}){
    if(!definitions[id]||![0,1].includes(condition))throw new RangeError('Unknown task');
    if(id==='P07'){
      const pulses=p.pulses??[];if(!Array.isArray(pulses)||pulses.length>12)throw new RangeError('Invalid tape');
      return {tuning:number(p.tuning??1,1,7),pulses:pulses.map(v=>number(v,20,10000))};
    }
    if(id==='M06'){
      const order=p.order??[];if(!Array.isArray(order)||order.length>3||new Set(order).size!==order.length)throw new RangeError('Invalid operation order');
      return {order:order.map(v=>one(v,Object.keys(operations))),scale:number(p.scale??1,1,2)};
    }
    const placements=p.placements??Array(condition?6:1).fill('pool'),links=p.links??[];
    if(!Array.isArray(placements)||placements.length!==(condition?6:1)||!Array.isArray(links)||links.length>6)throw new RangeError('Invalid electron inventory');
    return {placements:placements.map(v=>one(v,['pool','bond','left','right'])),representation:one(p.representation??'dots',['dots','lines']),links:links.map(link=>({pair:number(link.pair,0,placements.length-1),line:number(link.line,0,condition?1:0)})).map(link=>{if(!Number.isInteger(link.pair)||!Number.isInteger(link.line))throw new RangeError('Discrete mapping required');return link;})};
  }
  function pulseSymbol(ms){return ms>=80&&ms<=420?'.':ms>=600&&ms<=1600?'-':'?';}
  function signal(condition,p){
    const receiver=condition?5:3,target=condition?'R':'S',strength=Math.exp(-3*(p.tuning-receiver)**2),sent=p.pulses.map(pulseSymbol).join('');
    const received=strength>=.8?sent:[...sent].map((s,i)=>strength>=.35&&i%2===0?s:'?').join('');
    const mismatch=[...codes[target]].findIndex((s,i)=>received[i]!==s);
    const matches=received===codes[target],decoded=Object.keys(codes).find(k=>codes[k]===received)||'未识别';
    return {legal:true,goalSupported:matches,referenceValid:p.pulses.length>0,fixed:{receiver,target,codebook:codes,qualityModel:'exp(-3*(tuning-receiver)^2)',threshold:.8},measurement:{receiver,target,strength,sent,received,decoded,mismatch:matches?null:mismatch<0?codes[target].length:mismatch},
      readings:[['发送 / 接收刻度',`${p.tuning.toFixed(1)} / ${receiver}`],['教学接收质量',`${(strength*100).toFixed(1)}%`],['亲手按键 / ms',p.pulses.join(' · ')||'尚未发送'],['发出 / 收到',`${sent||'—'} / ${received||'—'}`],['目标 / 译码',`${target} / ${decoded}`]],
      feedback:matches?'收到的逐符纸带与给定模板相符。把刻度和时序一起夹进分册。':!p.pulses.length?'按住发送键再松开：短按约 200 ms，长按约 800 ms。先玩，再决定要记录哪一组。':strength<.8?'纸带辨识不清。保留相同按键时序，转动调谐盘，单独检查收发条件。':`收发条件成立，但第 ${(mismatch<0?codes[target].length:mismatch)+1} 个符号还不符。改音量不能改正这段报码。`};
  }
  const area=points=>points.reduce((sum,[x,y],i)=>{const [X,Y]=points[(i+1)%points.length];return sum+x*Y-X*y;},0)/2;
  const lengths=points=>points.map(([x,y],i)=>{const [X,Y]=points[(i+1)%points.length];return Math.hypot(x-X,y-Y);});
  function angles(points){
    return points.map(([x,y],i)=>{const a=points[(i+points.length-1)%points.length],b=points[(i+1)%points.length],u=[a[0]-x,a[1]-y],v=[b[0]-x,b[1]-y];return Math.acos(Math.max(-1,Math.min(1,(u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)))))*180/Math.PI;});
  }
  function geometry(p){
    let points=vertices.map(v=>[...v]);const steps=[];
    for(const op of p.order){points=points.map(([x,y])=>op==='R'?[-y,x]:op==='T'?[x+3,y+2]:[-x,y]).map(v=>v.map(n=>n||0));steps.push({op,points:points.map(v=>[...v])});}
    const beforeScale=points.map(v=>[...v]);points=points.map(([x,y])=>[x*p.scale,y*p.scale]);
    return {steps,beforeScale,points,signedArea:area(points),area:Math.abs(area(points)),lengths:lengths(points),angles:angles(points),lengthRatio:p.scale,areaRatio:p.scale*p.scale,orientation:area(points)>0?'逆时针':'顺时针'};
  }
  function transform(condition,p){
    const m=geometry(p),expected=condition?['T','R']:['R','T'],goal=JSON.stringify(p.order)===JSON.stringify(expected)&&Math.abs(p.scale-(condition?2:1))<1e-9;
    const counts=m.lengths.map(v=>v.toFixed(3)).join(' / ');
    return {legal:true,goalSupported:goal,referenceValid:p.order.length>0,fixed:{vertices,rotationCenter:[0,0],rotation:90,translation:[3,2],scaleCenter:[0,0],reflection:'y-axis'},measurement:m,
      readings:[['操作次序',p.order.map(op=>operations[op]).join(' → ')||'还没放操作卡'],['缩放前顶点 A',`(${m.beforeScale[0].join(', ')})`],['最终顶点 A',`(${m.points[0].join(', ')})`],['四条边长',counts],['A / B / C / D 内角',m.angles.map(v=>v.toFixed(2)+'°').join(' / ')],['长度 / 面积倍率',`${m.lengthRatio} / ${m.areaRatio}`],['定向 / 面积',`${m.orientation} / ${m.area.toFixed(2)}`]],
      feedback:goal?'每一步都能按约定复现。不同次序的原页继续保留，不必挑一张擦掉。':p.order.includes('F')?'反射后边长与角度仍保持，定向发生反转；先把它记作参考，再回到本次目标次序。':condition?'先交换成平移→旋转，再以原点为中心放大 2 倍。中间顶点与最终面积分别留下。':'先转再移与先移再转的朝向相同，位置却不同。把两张操作卡按目标顺序叠起来。'};
  }
  function molecule(condition,p){
    const count=zone=>p.placements.filter(v=>v===zone).length,bond=count('bond'),left=count('left'),right=count('right'),pool=count('pool');
    const expected=condition?{bond:2,left:2,right:2}:{bond:1,left:0,right:0};
    const structure=!pool&&bond===expected.bond&&left===expected.left&&right===expected.right;
    const shared=p.placements.flatMap((v,i)=>v==='bond'?[i]:[]);
    const mapping=structure&&p.links.length===shared.length&&new Set(p.links.map(l=>l.pair)).size===shared.length&&new Set(p.links.map(l=>l.line)).size===shared.length&&p.links.every(l=>shared.includes(l.pair));
    const m={total:2*(bond+left+right),budget:condition?12:2,bondPairs:bond,leftLone:left,rightLone:right,pool,aroundLeft:2*(bond+left),aroundRight:2*(bond+right),structure,mapping};
    const goal=structure&&(p.representation==='dots'||mapping);
    return {legal:true,goalSupported:goal,referenceValid:p.placements.some(v=>v!=='pool'),fixed:{molecule:condition?'O2':'H2',valenceBudget:m.budget,expected},measurement:m,
      readings:[['已摆 / 全分子价电子',`${m.total} / ${m.budget}`],['共享对 / 全分子孤对',`${bond} / ${left+right}`],['左 / 右原子孤对',`${left} / ${right}`],['每个原子周围电子',`${m.aroundLeft} / ${m.aroundRight}`],['点线图例',p.representation==='dots'?'电子点式':mapping?'逐对对应已核对':'键线式 · 对应还未完成']],
      feedback:goal?'分子总数与两侧计数分别成立，共享区没有在全分子账里重复加倍。':structure?'结构计数正确。把共享对逐一对应到不同键线；孤对仍留在原子周围。':pool?'把电子对从托盘拖入共享区或原子周围；右侧有等价摆放按钮。':`总数是 ${m.total}，但共享 ${bond} 对、左孤对 ${left}、右孤对 ${right} 还不符合给定分子。只加总不够，要检查每一侧。`};
  }
  function evaluate(id,c,p){return id==='P07'?signal(c,p):id==='M06'?transform(c,p):molecule(c,p);}
  function compare(id,{condition,basis,params,result}){
    if(id==='P07'){
      const sameTape=JSON.stringify(basis.params.pulses)===JSON.stringify(params.pulses),a=basis.measurement.strength,b=result.measurement.strength;
      const eligible=sameTape&&basis.measurement.sent===codes[condition?'R':'S']&&((a<.8&&b>=.8)||(b<.8&&a>=.8));
      return {eligible,verified:eligible,kind:'tuning-comparison'};
    }
    const eligible=id==='C04'&&condition===1&&basis.goalSupported&&basis.params.representation==='dots'&&params.representation==='lines'&&JSON.stringify(basis.params.placements)===JSON.stringify(params.placements)&&result.measurement.mapping&&result.goalSupported;
    return {eligible,verified:eligible,kind:'electron-correspondence'};
  }
  function reviewCommand(state){if(state.id!=='M06')return null;const refs=[0,1].map(c=>state.records.findLast(r=>r.condition===c&&r.recordValid&&r.goalSupported)?.id);return refs.every(Boolean)?{references:refs,reasoning:'order-counterexample'}:null;}
  function review(state,cmd){
    if(state.id!=='M06'||cmd.reasoning!=='order-counterexample'||!Array.isArray(cmd.references)||cmd.references.length!==2)return null;
    const records=cmd.references.map(id=>state.records.find(r=>r.id===id&&r.runId===state.runId&&r.recordValid&&r.goalSupported));
    if(records.some((r,c)=>!r||r.condition!==c))return null;
    const first=geometry(records[0].params),second=geometry(records[1].params),a=first.beforeScale[0],b=second.beforeScale[0];
    return {references:records.map(r=>r.id),reasoning:'order-counterexample',verified:true,measurement:{firstA:a,secondA:b,difference:b.map((v,i)=>v-a[i]),lengthRatio:second.lengthRatio,areaRatio:second.areaRatio},text:`同一原片的 A：先转再移到 (${a.join(',')})，先移再转（放大前）到 (${b.join(',')})，位置不同，次序不能交换。第二张再放大 ${second.lengthRatio} 倍，长度 ×${second.lengthRatio}、面积 ×${second.areaRatio}。这是同一图形的具体反例，不声称所有变换都不交换。`};
  }
  function candidates(id,c,state){
    const records=(state?.records||[]).filter(r=>r.condition===c&&r.recordValid);
    if(id==='P07')return records.flatMap(r=>[1,c?5:3,7].map(tuning=>({tuning,pulses:r.params.pulses})));
    if(id==='C04'&&c)return records.filter(r=>r.goalSupported&&r.params.representation==='dots').map(r=>({...r.params,representation:'lines',links:r.params.placements.flatMap((zone,pair)=>zone==='bond'?[pair]:[]).map((pair,line)=>({pair,line}))}));
    return [];
  }
  function createSession(id){if(!definitions[id])throw new RangeError('Unknown revision level');return Research.create({id,modelVersion:`revision-${id}-1`,normalize:(c,p)=>normalize(id,c,p),evaluate:(c,p)=>evaluate(id,c,p),compare:input=>compare(id,input),candidates:(c,state)=>candidates(id,c,state),review:id==='M06'?review:undefined,reviewCandidate:id==='M06'?reviewCommand:undefined,consult:(c,strong)=>({text:definitions[id].goals[c]+(strong?' '+definitions[id].quality:'')})});}
  const api={codes,vertices,operations,definitions,normalize,evaluate,geometry,pulseSymbol,compare,reviewCommand,review,createSession};
  if(local)module.exports=api;if(typeof window!=='undefined')window.AtlasRevisionModels=api;
})();
