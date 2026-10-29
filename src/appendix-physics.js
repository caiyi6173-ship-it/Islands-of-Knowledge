(() => {
  const local=typeof module!=='undefined'&&module.exports,H=local?require('./appendix-common.js'):window.AtlasAppendixCommon;
  const {value:v,number:n,choice:one,list,near,result:R}=H;
  function normalize(id,c,p){
    if(id==='P02')return {bells:list(v(p,'bells',[1,2,3]),x=>n(x,.3,9),3),slope:c?30:15};
    if(id==='P04')return {coupled:one(v(p,'coupled','no'),['yes','no']),retained:n(v(p,'retained',50),0,196)};
    if(id==='P05')return {slits:one(v(p,'slits','one'),['one','two']),distance:n(v(p,'distance',.6),.15,1.5)};
    if(id==='P08')return {subtract:one(v(p,'subtract','no'),['yes','no']),scope:one(v(p,'scope','element'),['anomaly','element']),batch:one(v(p,'batch','A'),['A','B'])};
    return {model:one(v(p,'model','classical'),['classical','planck']),cursor:n(v(p,'cursor',1),.2,5),scope:one(v(p,'scope','all'),['all','point'])};
  }
  function bells(c,p){
    const acceleration=9.8*Math.sin((c?30:15)*Math.PI/180),times=p.bells.map(x=>Math.sqrt(2*x/acceleration)),intervals=times.map((t,i)=>t-(times[i-1]||0));
    const ordered=p.bells.length===3&&p.bells[0]<p.bells[1]&&p.bells[1]<p.bells[2],equal=ordered&&Math.max(...intervals)-Math.min(...intervals)<.025;
    return Object.assign(R(equal,{acceleration,times,intervals},[['到达时间 / s',times.map(t=>t.toFixed(3)).join(' / ')],['从释放起三段间隔 / s',intervals.map(t=>t.toFixed(3)).join(' / ')],['坡度',`${c?30:15}°`]],equal?'三段节拍近似等时。钟位和真实秒数一起保留。':'移动钟位，不改回放速度；从释放到第一钟也算一段。',{g:9.8,slope:c?30:15,model:'ideal point acceleration; no rolling inertia'}),{legal:ordered,referenceValid:ordered});
  }
  function heat(c,p){const input=196,transmitted=p.coupled==='yes'?196:0,retention=c ? .9 : .6,waterHeat=transmitted*retention,lost=input-waterHeat,delta=waterHeat/4180,goal=transmitted>0&&near(p.retained,waterHeat,.05);return R(goal,{input,transmitted,waterHeat,lost,delta},[['一次落锤做功',`${input} J`],['水中留热 / 散出',`${waterHeat.toFixed(1)} / ${lost.toFixed(1)} J`],['真实温升',`${delta.toFixed(5)} °C`],['你记的水中留热',`${p.retained} J`]],goal?'微小温升有了能量账；放大刻度不改变真实量级。':'先接上传动，再把留在水中的热量和总做功分开记。',{mass:1,specificHeat:4180,inputIfCoupled:196,retention,oneDrop:true,units:'J,kg,°C'},{coupled:p.coupled});}
  function intensity(c,p,y=.001){const wavelength=(c?450:600)*1e-9,phase=p.distance*.001*y/(2*wavelength);return p.slits==='two'?Math.cos(Math.PI*phase)**2:1;}
  function interference(c,p){const I=intensity(c,p),wavelength=c?450:600,goal=p.slits==='two'&&I<.025;return R(goal,{intensity:I,wavelength,pathWaves:p.distance*.001*.001/(2*wavelength*1e-9)},[['波长 / 缝距',`${wavelength} nm / ${p.distance.toFixed(2)} mm`],['固定点相对强度',I.toFixed(5)],['装置',p.slits==='two'?'双缝':'单缝（本模型为均匀参考）']],goal?'探测点的暗纹也可以留下。换波长后要重新核对。':'固定探测点 y=1 mm，屏距 2 m。开双缝、调缝距，观察暗与亮。',{screenDistance:2,probeY:.001,wavelength,model:'equal-amplitude two-slit far-field; diffraction envelope ignored'});}
  const batches={A:{background:[4,5,6],reference:[29,30,31],ore:[55,56,57]},B:{background:[7,8,9],reference:[32,33,34],ore:[57,58,59]}};
  function stats(values){return {mean:values.reduce((s,x)=>s+x,0)/values.length,min:Math.min(...values),max:Math.max(...values)};}
  function anomaly(c,p){const raw=c?batches[p.batch]:{background:[5],reference:[30],ore:[56]},bg=stats(raw.background),ref=stats(raw.reference),ore=stats(raw.ore),netReference=ref.mean-bg.mean,netOre=ore.mean-bg.mean;return R(p.subtract==='yes'&&p.scope==='anomaly',{raw,background:bg,reference:ref,ore,netReference,netOre},[['资料来源',c?`给定批次 ${p.batch}，不是重复点击产生的新样本`:'给定单次资料'],['背景 / 参考 / 矿石均值',`${bg.mean} / ${ref.mean} / ${ore.mean}`],['扣背景净计数 / 参考与矿石',p.subtract==='yes'?`${netReference} / ${netOre}`:'尚未扣背景'],['矿石原数范围',`${ore.min}—${ore.max}`]],p.scope==='element'?'计数异常不足以鉴定特定新元素。保留背景、样品与批次，结论先停在异常。':'原数、背景和净计数都保留；趋势可重复，不保证批次完全相同。',{source:'given fixed teaching readings',units:'relative counts',batch:c?p.batch:'single'},{subtract:p.subtract,batch:c?p.batch:'single'});}
  const xs=[.4,.8,1.2,2,3,4];
  function spectrum(model,x,temperature){const energy=temperature*x*x*(model==='classical'?1:x/temperature/Math.expm1(x/temperature));return energy;}
  function spectral(c,p){const temperature=c?1.5:1,observed=xs.map(x=>spectrum('planck',x,temperature)),predicted=xs.map(x=>spectrum(p.model,x,temperature)),errors=predicted.map((y,i)=>y-observed[i]),rmse=Math.sqrt(errors.reduce((s,e)=>s+e*e,0)/errors.length);return R(p.scope==='all'&&rmse<.05,{temperature,xs,observed,predicted,errors,rmse,cursorValue:spectrum(p.model,p.cursor,temperature)},[['统一标度温度',String(temperature)],['全点均方根误差',rmse.toFixed(5)],['高频点 x=4 的残差',errors.at(-1).toFixed(4)],['游标模型值',spectrum(p.model,p.cursor,temperature).toFixed(4)]],p.scope==='point'?'一处对上不等于整段一致；正式结论须保留全部给定采样点。':'量子模型在这份给定理想资料上的全点误差可核对；资料由理论生成，不冒充真实黑体测量。',{normalization:'x=hν/kT0; y∝ν³/(exp(hν/kT)-1)',source:'fixed ideal Planck-generated teaching reference',temperature,units:'dimensionless',sampleRange:[.4,4]},{model:p.model});}
  const evaluate=(id,c,p)=>({P02:bells,P04:heat,P05:interference,P08:anomaly,P09:spectral}[id])(c,p);
  function compare(id,{condition:c,basis:b,params:p,result:r}){let eligible=false,kind='';
    if(id==='P05'){eligible=b.params.slits==='two'&&p.slits==='two'&&b.params.distance!==p.distance&&Math.abs(b.measurement.intensity-r.measurement.intensity)>.5;kind='interference-comparison';}
    if(id==='P09'){eligible=b.params.model!==p.model&&b.params.scope==='all'&&p.scope==='all';kind='spectral-comparison';}
    return {eligible,verified:eligible,kind};
  }
  function study(id,records){
    if(id==='P02'){const a=records.find(r=>r.condition===0),b=records.find(r=>r.condition===1);if(!a||!b||!a.params.bells.every((x,i)=>near(x,b.params.bells[i])))return null;const ratio=Math.sqrt(a.measurement.acceleration/b.measurement.acceleration);return {measurement:{ratio,times:[a.measurement.times,b.measurement.times]},text:`同一组钟位，两坡的三个到达时间均乘 √(a₀/a₁)=${ratio.toFixed(5)}。等时关系保留，绝对秒数改变。`};}
    if(id==='P04'){const a=records.find(r=>r.condition===0),b=records.find(r=>r.condition===1);if(!a||!b)return null;return {measurement:{ratio:b.measurement.delta/a.measurement.delta},text:'ΔT=Q/(mc)，同为 1 kg 水、c=4180 J/(kg·°C)。留热比 176.4/117.6=1.5，温升比同为 1.5；没有把 196 J 全部算作水中热量。'};}
    if(id==='P08'){const b=records.find(r=>r.condition===1);if(!b)return null;return {measurement:{ore:b.measurement.ore,netReference:b.measurement.netReference,netOre:b.measurement.netOre},text:`给定批次 ${b.params.batch}：矿石均值 ${b.measurement.ore.mean}，范围 ${b.measurement.ore.min}—${b.measurement.ore.max}；扣背景后矿石 ${b.measurement.netOre}、参考 ${b.measurement.netReference}。这是一份给定重复资料的统计核对，没有新增独立实验。`};}
    return null;
  }
  const api={normalize,evaluate,compare,study,intensity,spectrum,batches,stats};if(local)module.exports=api;if(typeof window!=='undefined')window.AtlasAppendixPhysics=api;
})();
