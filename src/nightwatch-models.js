/* R02 teaching models: sampled flux, two physical current paths, river vectors. */
(() => {
  const local=typeof module!=='undefined'&&module.exports;
  const Research=local?require('./research-session.js'):window.AtlasResearchSession;
  const definitions={
    P06:{title:'停下来的指针',person:'法拉第与工坊同伴',place:'潮汐港 · 线圈工坊',conditions:['推进、停住，再看指针','把往复输入改成连续转动'],goals:['移动磁铁，留下至少 0.6 格的连续轨迹，再停住至少 0.25 秒。比较移动和静止的响应。','连续转动线圈至少一整圈，记录正、负两种响应；磁铁和线圈位置保持固定。'],change:'刚才的手推片段只说明短时响应。现在让线圈转起来，看输入如何持续变化。',quality:'在原条件下做一次反向同路、两端停稳的比较，核对响应符号反转。',intro:['阿澜：窗口夜里要能传信。工坊先得弄明白，什么操作会让指针响应。','工坊同伴：把手也记进去。只说“磁铁在里面”，下一班可不知道你做了什么。'],revisit:'工坊同伴：轨迹和指针都还在。接着核对，别把停住和移动混在一起。',delivered:'工坊已接到操作卡。重做实验会留新记录，不会熄灭值班窗口。',boundary:'教学模型：Φ = 1/(1+x²) 或 cos θ，响应 ε = −ΔΦ/Δt；仅为相对量，不代表真实发电功率。历史人物为跨时代研究伙伴。',summary:'输入轨迹和响应曲线一起交给工坊。后续由值班人员操作真实设施，实验指针不直接给港口供电。'},
    C10:{title:'接好导线还差一步',person:'丹尼尔与窗口值班员',place:'标本港 · 小信号台',conditions:['外路与内路，都要闭合','给信号灯选择负载'],goals:['分别观察“只有导线”“只有盐桥”“两路闭合”，再把完整通路记录下来。','保持锌、铜电极不变，接通两路，标出电子外路方向，并让模型电流达到 20 mA。'],change:'通路已经查清。现在加上负载与方向签，让下一班能照着接线。',quality:'在新条件分别记录 20 Ω 与 45 Ω 的负载，保持其他条件相同，核对两次电流。',intro:['小禾：夜里传一声消息，需要一条能查得清的信号回路。','丹尼尔：外面的电子路和里面的离子路，缺哪一条都不行。先动手拆开看。'],revisit:'值班员：换负载前先看两条路。方向签是你的判断，不能拿来改变电流表。',delivered:'双通路卡已夹在值班台。这里的小电池仅演示信号模型，不承担港口照明。',boundary:'理想锌铜模型：E = 1.10 V，内阻 10 Ω，忽略极化、耗尽与接触电阻；电子走外导线，离子在内部迁移。',summary:'把外导线、盐桥、电子方向与负载读数写在同一张操作卡上，交给实际设施的值班员。'},
    M08:{title:'总被冲偏的回程船',person:'哈密顿与阿澜',place:'测绘台 · 回程河道',conditions:['到正对岸，不让水流冲偏','换个目标：用时最短'],goals:['保持船速 5、水速 3，调整航向，让对岸落点的漂移不超过 0.15 个模型长度单位。','现在允许漂移：找到到达对岸用时最短的航向。先前的直达方案仍然有效，只是目标变了。'],change:'阿澜：有的班次得在正对岸卸货，有的班次只求尽快过河。把两个目标分开写。',quality:'完成两个目标后，引用两份真实记录，核对“竖直分量 ≤ 船速，所以过河时间 ≥ 4”的理由。',intro:['阿澜：去时好走，回程总被水带偏。下一班不能靠猜航向。','哈密顿：把船的速度和水流叠起来。你要到哪里，和你要多快，是两件事。'],revisit:'阿澜：两张路线卡都在。看看当班目标，再决定朝哪边开。',delivered:'回程航向卡已送到阿澜手里。继续比较不会撤回已经安排的夜班。',boundary:'匀速船与均匀水流的理想模型；河宽 20 个模型长度单位。动画为示意加速，数值使用模型时间，不作为真实导航建议。',summary:'两份路线分别标明“正对岸”和“最短时间”，附上固定船速、水速与河宽，下一班按目标使用。'}
  };
  const finite=(v,min,max)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw new RangeError('Parameter outside model');return v;};
  const choice=(v,list)=>{if(!list.includes(v))throw new RangeError('Unknown setting');return v;};
  const round=v=>Number(v.toFixed(4));
  function normalize(id,c,p={}){
    if(!definitions[id]||![0,1].includes(c))throw new RangeError('Unknown condition');
    if(id==='P06'){
      const trace=p.trace??[{t:0,value:c?0:-2}];
      if(!Array.isArray(trace)||!trace.length||trace.length>160)throw new RangeError('Invalid trace');
      let last=-1;
      return {trace:trace.map(s=>{const t=finite(s.t,0,12000),value=finite(s.value,c?-100000:-2,c?100000:-.5);if(t<=last||last>=0&&t-last<10)throw new RangeError('Trace must be chronological');last=t;return {t:round(t),value:round(value)};})};
    }
    if(id==='C10'){
      const wire=choice(p.wire??'on',['on','off']),bridge=choice(p.bridge??'off',['on','off']);
      if(!c){const checks=p.checks??[{wire,bridge}];if(!Array.isArray(checks)||checks.length>16)throw new RangeError('Invalid inspections');return {wire,bridge,checks:checks.map(s=>({wire:choice(s.wire,['on','off']),bridge:choice(s.bridge,['on','off'])}))};}
      return {wire,bridge,load:finite(p.load??50,10,100),direction:choice(p.direction??'',['','ZnCu','CuZn'])};
    }
    return {angle:finite(p.angle??90,30,150)};
  }
  function evaluate(id,c,p){
    if(id==='P06'){
      const flux=v=>c?Math.cos(v*Math.PI/180):1/(1+v*v),trace=p.trace;
      const series=trace.map((s,i)=>({t:s.t,input:s.value,flux:flux(s.value),response:i?-(flux(s.value)-flux(trace[i-1].value))/((s.t-trace[i-1].t)/1000)||0:0}));
      const values=trace.map(s=>s.value),span=Math.max(...values)-Math.min(...values),duration=(trace.at(-1).t-trace[0].t)/1000;
      let stopped=0;for(let i=trace.length-1;i>0&&Math.abs(trace[i].value-trace[i-1].value)<.0002;i--)stopped+=(trace[i].t-trace[i-1].t)/1000;
      const moving=series.filter(s=>Math.abs(s.response)>.015).length,positive=series.filter(s=>s.response>.03).length,negative=series.filter(s=>s.response<-.03).length;
      const integral=series[0].flux-series.at(-1).flux;
      const goal=c?span>=359&&positive>=3&&negative>=3:span>=.6&&moving>=4&&Math.abs(integral)>=.12&&stopped>=.249;
      const measurement={series,duration,span,stopped,integral,positive,negative};
      return {legal:true,goalSupported:goal,referenceValid:duration>=.25,fixed:{model:c?'cos(theta)':'1/(1+x*x)',sampleUnit:'ms',responseUnit:'relative'},measurement,
        readings:[['连续片段',`${duration.toFixed(2)} s · ${trace.length} 个采样`],['输入跨度',`${span.toFixed(2)} ${c?'°':'格'}`],['即时响应',`${series.at(-1).response.toFixed(3)} 相对单位`],['正 / 负响应点',`${positive} / ${negative}`],['末端停稳',`${stopped.toFixed(2)} s`]],
        feedback:goal?(c?'整圈出现了两种符号的响应。输入与指针已同步留在片段里。':'移动时有响应，停住后回到零。也可以反向同路再试一次。'):c?'按住转动，或连续拖动手柄。完整一圈才能看清正、负两段。':'按住移动或连续拖动磁铁，再松手停稳。单次跳到一个位置不能代替连续输入。'};
    }
    if(id==='C10'){
      const load=c?p.load:50,closed=p.wire==='on'&&p.bridge==='on',current=closed?1100/(load+10):0;
      const checks=c?[]:p.checks.map(s=>({...s,current:s.wire==='on'&&s.bridge==='on'?1100/60:0}));
      const inspected=c||['on/off','off/on','on/on'].every(key=>checks.some(s=>`${s.wire}/${s.bridge}`===key));
      const goal=c?closed&&current>=20-1e-8&&p.direction==='ZnCu':closed&&inspected;
      return {legal:!c||!!p.direction,goalSupported:goal,referenceValid:!c||!!p.direction,fixed:{emf:1.1,internalResistance:10,electrodes:['Zn','Cu']},
        factParams:c?{wire:p.wire,bridge:p.bridge,load}:p,measurement:{current,load,closed,electronDirection:closed?'ZnCu':null,checks},
        readings:[['外导线 / 盐桥',`${p.wire==='on'?'接通':'断开'} / ${p.bridge==='on'?'接通':'断开'}`],['模型电流',`${current.toFixed(2)} mA`],['负载 / 内阻',`${load} Ω / 10 Ω`],['电动势','1.10 V'],[c?'电子方向签':'已观察通路',c?(p.direction==='ZnCu'?'Zn → Cu':p.direction==='CuZn'?'Cu → Zn':'还未标记'):`${new Set(checks.map(s=>s.wire+'/'+s.bridge)).size} 种配置`]],
        feedback:goal?'两条通路与本次目标都已核对，记录可以交给值班员。':!closed?'回路中断。电子不能越过盐桥，离子也不能代替外导线。':!c?'再分别试试缺一条路的情况，保留这三种配置的观察。':!p.direction?'先标出外导线上的电子方向；方向签不会改变电流。':p.direction!=='ZnCu'?'读数没有变，但方向签和锌铜电池的电子外路不符。':'电流低于 20 mA；固定电动势与内阻，试着减小负载。'};
    }
    const theta=p.angle*Math.PI/180,vx=5*Math.cos(theta)+3,vy=5*Math.sin(theta),time=20/vy,drift=vx*time;
    const goal=c?Math.abs(p.angle-90)<.005:Math.abs(drift)<=.15;
    return {legal:true,goalSupported:goal,referenceValid:true,fixed:{width:20,boatSpeed:5,waterSpeed:3,units:'model'},measurement:{angle:p.angle,vx,vy,time,drift},
      readings:[['航向 · 从顺流向逆时针',`${p.angle.toFixed(2)}°`],['合速度 (横 / 纵)',`${vx.toFixed(3)} / ${vy.toFixed(3)}`],['模型过河时间',`${time.toFixed(3)} s`],['预报漂移',`${drift.toFixed(3)} 模型长度`]],
      feedback:goal?(c?'船速全部用在横渡方向，达到 4 秒下界。漂移允许，目标已经换了。':'落点对准正对岸。记下航向，再换一个任务目标。'):c?'允许落点偏移，试着让竖直速度分量最大；上一张直达卡不作废。':'水流会带着船横向移动。朝上游多偏一点，让两个横向分量抵消。'};
  }
  function compare(id,{condition,basis,params,result}){
    if(id==='P06'){
      const a=basis.params.trace,b=params.trace;
      const monotone=trace=>{const direction=Math.sign(trace.at(-1).value-trace[0].value);return direction!==0&&trace.every((s,i)=>!i||(s.value-trace[i-1].value)*direction>=-.0002);};
      const reversed=!condition&&monotone(a)&&monotone(b)&&basis.goalSupported&&result.goalSupported&&Math.abs(a[0].value-b.at(-1).value)<.08&&Math.abs(a.at(-1).value-b[0].value)<.08&&basis.measurement.integral*result.measurement.integral<0;
      return {eligible:reversed,verified:reversed,kind:'motion-reversal'};
    }
    const pair=[basis.params.load,params.load];
    const valid=id==='C10'&&condition===1&&basis.goalSupported&&result.goalSupported&&pair.includes(20)&&pair.includes(45);
    return {eligible:valid,verified:valid,kind:'load-comparison'};
  }
  function reviewCommand(state){const refs=[0,1].map(c=>state.records.findLast(r=>r.condition===c&&r.goalSupported&&r.recordValid)?.id);return refs.every(Boolean)?{references:refs,reasoning:'vertical-component'}:null;}
  function review(state,command){
    if(state.id!=='M08'||command.reasoning!=='vertical-component'||!Array.isArray(command.references)||command.references.length!==2)return null;
    const records=command.references.map(id=>state.records.find(r=>r.id===id&&r.runId===state.runId&&r.goalSupported&&r.recordValid));
    if(records.some((r,c)=>!r||r.condition!==c))return null;
    const [direct,fast]=records.map(r=>evaluate('M08',r.condition,r.params).measurement);
    return {references:records.map(r=>r.id),reasoning:'vertical-component',verified:true,measurement:{directTime:direct.time,fastTime:fast.time,lowerBound:4},text:`直达 ${direct.time.toFixed(3)} s；最快 ${fast.time.toFixed(3)} s。固定船速 5，vy ≤ 5，因此 T = 20/vy ≥ 4；90° 取等号。`};
  }
  function createSession(id){
    if(!definitions[id])throw new RangeError('Unknown nightwatch level');
    return Research.create({id,modelVersion:`nightwatch-${id}-1`,normalize:(c,p)=>normalize(id,c,p),evaluate:(c,p)=>evaluate(id,c,p),compare:input=>compare(id,input),
      candidates:c=>id==='C10'&&c?[20,45].map(load=>({wire:'on',bridge:'on',load,direction:'ZnCu'})):[],
      review:id==='M08'?review:undefined,reviewCandidate:id==='M08'?reviewCommand:undefined,
      consult:(c,strong)=>({text:definitions[id].goals[c]+(strong?' '+definitions[id].quality:'')})});
  }
  const api={definitions,normalize,evaluate,compare,review,reviewCommand,createSession};
  if(local)module.exports=api;if(typeof window!=='undefined')window.AtlasNightwatchModels=api;
})();
