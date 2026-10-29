/* R05 keeps predictions before disclosure, and observations separate from interpretations. */
(() => {
  const local=typeof module!=='undefined'&&module.exports;
  const Research=local?require('./research-session.js'):window.AtlasResearchSession;
  const definitions={
    P10:{title:'亮着却不开的回信柜',person:'爱因斯坦与窗口值班员',place:'潮汐港 · 光电柜',conditions:['材料 A：做两组单变量核对','换材料 B，再查阈值'],goals:['分别调频率与相对光子通量，免费夹住至少三次预览：同一低频改通量仍不发射；同通量改频率跨阈值才发射。合成一份正式核对包。','材料功函数从 2.2 eV 换成 3.5 eV。保留光源，重新调频率使材料 B 发射电子。柜门仅为教学联动。'],change:'现在换材料 B（3.5 eV），光源设置保留。原先够用的频率未必够，先看新阈值。',quality:'在材料 B、同一足够高频率下，正式比较两种光子通量：相对发射数改变，最大动能相同。',intro:['值班员：灯亮着，检测片却没响应。上张签写的是材料 A，这次来了 B。','爱因斯坦：先把光子的数量和每个光子的能量分开。阿墨：这回把检查过程也夹进去。'],revisit:'值班员：材料签与光源记录都在。先前的条件签不会因换材料失效。',delivered:'检测条件签已随信袋返回。继续核对光源，不会把已完成的夜邮退回去。',boundary:'理想单光子光电效应；h=4.135667696×10⁻¹⁵ eV·s，材料功函数为给定教学量。通量是相对光子数，不是同辐照功率；相对发射数忽略效率。不是实际探测器或锁具设计。',summary:'材料、频率、通量和单电子最大动能分别记录。换检测片后重新核对阈值。'},
    M10:{title:'先别拆开的观测信',person:'高斯与测绘台记录员',place:'测绘台 · 封存桌',conditions:['只用三点拟合，先封存预测','揭开观测，核对原预测'],goals:['给定 (0,15.2)、(10,8.1)、(20,11)。调 y=at²+bt+c，让三点最大误差≤0.35。正式记录会封存参数与 t=24 的预测；信封内观测尚不公开。','打开了未用于拟合的观测信。核对封存预测和实际观测，诚实保留误差。拆信后调参只能登记为修订，不能冒充原预测。'],change:'继续即打开 t=24 的独立观测。已经封存的模型和预测保持不变；此后新拟合只能叫修订。',quality:'可选：拆信前封存第二组符合训练容差的参数。拆信后引用两份原预测，比较独立误差；不要求某份预测故意失败。',intro:['小禾：这封观测信还没拆。先写下会看到什么，再一起开。','高斯：三点只是拟合资料。阿墨把信压在纸夹下面：记录前，先别偷看下一行。'],revisit:'记录员：封存顺序和原预测还在。拆信后的新曲线另列为修订。',delivered:'预报页和独立核对已经寄回，封存的数字不会被后来的调参覆盖。',boundary:'虚构教学数据与二次拟合，不复现历史天体轨道。训练最大误差容差 0.35；独立误差≤0.5 才能宣称本次精度合格。一次检验不保证所有未来数据。',summary:'保存拆信前的模型、预测、公开后的独立误差和后续修订，留下各自取得的顺序。'},
    C08:{title:'少掉的质量去了哪里',person:'拉瓦锡与三站记录员',place:'标本港 · 边界天平',conditions:['开口与封闭：追踪同一份气体','独立方程卡：只调份数'],goals:['初始总质量 100 g。开闭虚拟容器，圈选称量范围，免费夹住同产气量的开口与封闭预览，再正式提交质量去向核对包。','这里明确换成另一张原子账本：H₂+O₂→H₂O。只调系数，逐元素配平为最简整数比；这不是上页产气实验的反应。'],change:'现在离开产气称量模型，切换到独立方程卡 H₂+O₂→H₂O。气体克数不转成这张卡的反应物。',quality:'在开口条件下换一个产气量，补齐新的开口/封闭预览，比较留存与逸出之和。独立方程卡不参与这份比较。',intro:['小禾：给定示例里少了几克。先别改总账，看看天平称到了哪里。','拉瓦锡：把边界圈出来。阿墨盯住气体筹码：跑到圈外，也还在图上。'],revisit:'记录员：容器内、边界外和合计各有一栏。方程卡单独夹着。',delivered:'称量边界与独立原子账已交付。后面的新样品继续另开一页，不覆盖这次记录。',boundary:'虚拟质量账：初始 100 g，给定产气量，不提供真实化学操作。开口气体离开容器边界但仍在总账；封闭无物质交换。H₂/O₂ 方程是独立符号任务，不声称该装置发生此反应。',summary:'把称量边界和物质去向写清，另外用固定分子式、可变系数核对原子账。'}
  };
  function num(v,min,max){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw new RangeError('Outside return model');return v;}
  function choice(v,list){if(!list.includes(v))throw new RangeError('Unknown return choice');return v;}
  function array(v,convert){if(!Array.isArray(v)||v.length>8)throw new RangeError('Invalid preview pack');return v.map(convert);}
  const value=(p,key,fallback)=>p[key]===undefined?fallback:p[key];
  const light=p=>({frequency:num(value(p,'frequency',4.5),3,12),flux:num(value(p,'flux',1),1,8)});
  const vessel=p=>({lid:choice(value(p,'lid','open'),['open','closed']),gas:num(value(p,'gas',8),1,25)});
  function normalize(id,c,p={}){
    if(!p||typeof p!=='object'||Array.isArray(p))throw new RangeError('Invalid parameters');
    if(!definitions[id]||![0,1].includes(c))throw new RangeError('Unknown return condition');
    if(id==='P10')return {...light(p),trials:c?[]:array(value(p,'trials',[]),light)};
    if(id==='M10')return {a:num(value(p,'a',.04),.02,.08),b:num(value(p,'b',-1),-1.6,-.8),c:num(value(p,'c',15),14,16),claim:c?choice(value(p,'claim','honest'),['honest','accurate']):'honest'};
    if(c)return {h2:num(value(p,'h2',1),1,6),o2:num(value(p,'o2',1),1,6),h2o:num(value(p,'h2o',1),1,6)};
    return {...vessel(p),boundary:choice(value(p,'boundary','vessel'),['vessel','all']),claim:choice(value(p,'claim','accounted'),['accounted','vanished']),views:array(value(p,'views',[]),vessel)};
  }
  const PLANCK=.4135667696;
  function photo(c,p){const work=c?3.5:2.2,energy=PLANCK*p.frequency,emits=energy>work;return {work,energy,threshold:work/PLANCK,emits,count:emits?p.flux:0,kinetic:emits?energy-work:0};}
  function orthogonal(trials){
    const low=trials.filter(p=>!photo(0,p).emits),high=trials.filter(p=>photo(0,p).emits);
    return low.some(a=>low.some(b=>a.frequency===b.frequency&&a.flux!==b.flux)&&high.some(b=>a.flux===b.flux&&a.frequency!==b.frequency));
  }
  function physics(c,p){
    const m=photo(c,p),trials=p.trials.map(v=>({...v,...photo(c,v)})),complete=orthogonal(p.trials);
    return {legal:true,goalSupported:c?m.emits:complete,referenceValid:true,fixed:{material:c?'B':'A',work:m.work,planckEV14:PLANCK,units:'frequency ×10^14 Hz; relative photon flux'},factParams:c?light(p):{trials:p.trials},measurement:{...m,frequency:p.frequency,flux:p.flux,trials:c?[]:trials,orthogonal:!c&&complete},
      readings:[['材料 / 功函数',`${c?'B':'A'} / ${m.work} eV`],['频率 / 相对光子通量',`${p.frequency.toFixed(2)} ×10¹⁴ Hz / ${p.flux}`],['光子能量 / 阈值频率',`${m.energy.toFixed(3)} eV / ${m.threshold.toFixed(3)} ×10¹⁴ Hz`],['相对发射数',String(m.count)],['最大动能',m.emits?`${m.kinetic.toFixed(3)} eV`:'无发射电子'],...(!c?[['核对包',complete?'两组单变量核对齐备':`${p.trials.length} 次预览；待补齐正交检查`]]:[])],
      feedback:c?(m.emits?'材料 B 有电子发射。固定频率再改通量，可检查数量与最大动能的区别。':'材料换了，阈值也换了。增大低频通量不会补足单个光子的能量。'):complete?'三次预览已说明两件事：低频加通量无效，同通量跨阈值才发射。可以正式保存核对包。':'先夹住低频的两种通量，再保持其中一种通量换到阈值以上。免费预览不扣研究资源。'};
  }
  const training=Object.freeze([[0,15.2],[10,8.1],[20,11]].map(Object.freeze)),forecastTime=24,observation=15;
  const polynomial=(p,t)=>p.a*t*t+p.b*t+p.c;
  function sealed(state){const reveal=state?.events.findIndex(e=>e.type==='advance')??-1;return (state?.records||[]).filter(r=>r.condition===0&&r.recordValid&&r.goalSupported&&(reveal<0||r.sequence<reveal));}
  function fitting(p){const residuals=training.map(([t,y])=>polynomial(p,t)-y);return {residuals,maxError:Math.max(...residuals.map(Math.abs)),prediction:polynomial(p,forecastTime)};}
  function mathematics(c,p,state){
    const fit=fitting(p),reveal=state?.events.some(e=>e.type==='advance')===true,original=sealed(state),source=original[0],predicted=source?.measurement.prediction,error=predicted===undefined?null:predicted-observation;
    const goal=c?!!source&&(p.claim==='honest'||Math.abs(error)<=.5+1e-9):!reveal&&fit.maxError<=.35+1e-9;
    const measurement=c?{sealed:original.map(r=>({ref:r.id,params:r.params,prediction:r.measurement.prediction,error:r.measurement.prediction-observation})),observation,time:forecastTime,originalPrediction:predicted,error,revisedParams:{a:p.a,b:p.b,c:p.c},revisedPrediction:fit.prediction}: {...fit,time:forecastTime,disclosure:'sealed-before-observation'};
    return {legal:!c||!!source,goalSupported:goal,referenceValid:!c||!!source,fixed:{training,forecastTime,trainingTolerance:.35,validationTolerance:.5,dataSource:'fictional teaching data',...(!c?{disclosure:reveal?'already disclosed; revision only':'observation concealed'}:{predictionRef:source?.id,disclosure:'held-out observation revealed'})},measurement,factParams:{a:p.a,b:p.b,c:p.c},
      readings:[['三点最大拟合误差',fit.maxError.toFixed(3)],['当前曲线在 t=24',fit.prediction.toFixed(3)],...(c?[['拆信前原预测',predicted?.toFixed(3)??'没有封存记录'],['独立观测 / 原预测误差',`${observation.toFixed(3)} / ${error?.toFixed(3)??'—'}`],['调参后的用途','新数据后的修订；不覆盖原预测']]:[['封存目标','t=24；观测尚未公开'],['模型状态',reveal?'已拆信，只能补充修订':'拆信前；正式记录即封存']])],
      feedback:c?(goal?'原预测、独立观测和误差一起保留。误差如实记下就有价值；新曲线单独叫修订。':'本次独立误差超过 0.5，不能宣称精度合格。可选择如实保留误差，原预测仍保留。'):reveal?'信已打开。此后补调的曲线只能是参考修订，不能再封存成拆信前预测。':goal?'训练容差内。正式记录会封存这组参数与预测；可先封存第二组再拆信。':'调 a、b、c，看三点残差。只有训练资料符合容差，才封存成待检验的预测。'};
  }
  function mass(p){const escaped=p.lid==='open'?p.gas:0,inside=100-escaped;return {inside,escaped,total:100,scale:p.boundary==='all'?100:inside};}
  function boundaryPack(views){return views.some(a=>a.lid==='open'&&views.some(b=>b.lid==='closed'&&b.gas===a.gas));}
  function chemistry(c,p){
    if(c){const integral=[p.h2,p.o2,p.h2o].every(Number.isInteger),left={H:2*p.h2,O:2*p.o2},right={H:2*p.h2o,O:p.h2o},balanced=left.H===right.H&&left.O===right.O,goal=integral&&balanced&&p.h2===2&&p.o2===1&&p.h2o===2;
      return {legal:integral,goalSupported:goal,referenceValid:integral,fixed:{formulas:['H2','O2','H2O'],source:'independent symbolic equation',units:'molecular counts'},measurement:{left,right,balanced,simplest:goal},readings:[['固定分子式',`${p.h2}H₂ + ${p.o2}O₂ → ${p.h2o}H₂O`],['H 原子 / 左右',`${left.H} / ${right.H}`],['O 原子 / 左右',`${left.O} / ${right.O}`],['账本状态',goal?'配平，且为最简整数比':balanced?'已配平，还需约成最简整数比':'左右元素数尚不相等']],feedback:goal?'两边每种原子数相同，系数为最简整数比。分子式下标始终没有改变。':balanced?'总账相等，但这张卡要求最简整数比。把系数同时约小。':'只能改份数，不能改下标。逐行看 H 与 O，补齐各自的原子数。'};
    }
    const m=mass(p),complete=boundaryPack(p.views.filter(v=>v.gas===p.gas)),views=p.views.map(v=>({...v,...mass({...v,boundary:'vessel'})}));
    return {legal:true,goalSupported:complete&&p.claim==='accounted',referenceValid:true,fixed:{initial:100,units:'g',gasSource:'given virtual gas amount',reaction:'unspecified; not the next equation'},measurement:{...m,gas:p.gas,views,paired:complete},factParams:{lid:p.lid,gas:p.gas,boundary:p.boundary,views:p.views},
      readings:[['容器 / 称量范围',`${p.lid==='open'?'开口':'封闭'} / ${p.boundary==='all'?'容器与逸出气体':'仅容器'}`],['容器内 / 已逸出',`${m.inside.toFixed(1)} / ${m.escaped.toFixed(1)} g`],['天平读数',`${m.scale.toFixed(1)} g`],['容器内 + 逸出',`${m.total.toFixed(1)} g`],['边界核对包',complete?'同产气量的开口、封闭齐备':`${p.views.length} 次预览；待补齐开闭对照`]],
      feedback:p.claim==='vanished'?'气体在边界外仍有去向，不能声明质量消失。改称量范围不会消灭筹码。':complete?'开口少的部分在容器外，封闭仍全在容器内。两种范围的总账都能追到 100 g。':'夹住同一产气量的开口和封闭预览，比较天平范围与总账；正式提交才扣资源。'};
  }
  function evaluate(id,c,p,state){return id==='P10'?physics(c,p):id==='M10'?mathematics(c,p,state):chemistry(c,p);}
  function compare(id,{condition,basis,params,result}){
    let eligible=false,kind='';
    if(id==='P10'){eligible=condition===1&&basis.goalSupported&&result.goalSupported&&basis.params.frequency===params.frequency&&basis.params.flux!==params.flux;kind='photon-flux-comparison';}
    if(id==='C08'){eligible=condition===0&&basis.goalSupported&&result.goalSupported&&basis.params.lid==='open'&&params.lid==='open'&&basis.params.boundary===params.boundary&&basis.params.gas!==params.gas&&basis.measurement.views.some(v=>v.gas===basis.params.gas&&v.lid==='open')&&result.measurement.views.some(v=>v.gas===params.gas&&v.lid==='open');kind='mass-boundary-comparison';}
    return {eligible,verified:eligible,kind};
  }
  function reviewCommand(state){if(state.id!=='M10'||!state.records.some(r=>r.condition===1&&r.recordValid&&r.goalSupported))return null;const refs=sealed(state);return refs.length>=2?{references:refs.slice(0,2).map(r=>r.id),reasoning:'held-out-comparison'}:null;}
  function review(state,cmd){
    const wanted=reviewCommand(state);if(!wanted||cmd.reasoning!==wanted.reasoning||JSON.stringify(cmd.references)!==JSON.stringify(wanted.references))return null;
    const sources=sealed(state).slice(0,2),errors=sources.map(r=>r.measurement.prediction-observation);
    if(JSON.stringify(sources[0].params)===JSON.stringify(sources[1].params))return null;
    return {references:wanted.references,reasoning:wanted.reasoning,verified:true,measurement:{predictions:sources.map(r=>r.measurement.prediction),observation,errors},text:`两组模型都在拆信前封存，训练误差均≤0.35；t=24 的原预测分别为 ${sources.map(r=>r.measurement.prediction.toFixed(3)).join('、')}，独立观测 ${observation}，误差分别为 ${errors.map(v=>v.toFixed(3)).join('、')}。训练容差内不意味着预测唯一；这次检验也不保证未来都成立。`};
  }
  function candidates(id,c,state){
    if(id==='P10'&&c)return (state?.records||[]).filter(r=>r.condition===1&&r.goalSupported).map(r=>({...r.params,flux:r.params.flux===1?5:1}));
    if(id==='C08'&&!c)return [8,12].map(gas=>({lid:'open',boundary:'vessel',claim:'accounted',gas,views:[{lid:'open',gas},{lid:'closed',gas}]}));
    return [];
  }
  function createSession(id){if(!definitions[id])throw new RangeError('Unknown return level');return Research.create({id,modelVersion:`return-${id}-1`,normalize:(c,p)=>normalize(id,c,p),evaluate:(c,p,state)=>evaluate(id,c,p,state),compare:input=>compare(id,input),candidates:(c,state)=>candidates(id,c,state),review:id==='M10'?review:undefined,reviewCandidate:id==='M10'?reviewCommand:undefined,consult:c=>({text:definitions[id].goals[c]})});}
  const api={definitions,normalize,evaluate,photo,orthogonal,training,polynomial,fitting,sealed,mass,boundaryPack,compare,reviewCommand,review,createSession};
  if(local)module.exports=api;if(typeof window!=='undefined')window.AtlasReturnModels=api;
})();
