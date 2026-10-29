(() => {
  const local=typeof module!=='undefined'&&module.exports,H=local?require('./appendix-common.js'):window.AtlasAppendixCommon;
  const {value:v,number:n,integer:int,choice:one,list,near,chain,result:R}=H;
  const proofs={irrational:['coprime','square','p-even','q-even','contradiction'],triangle:['positive','closure','areas','converse'],limit:['expand','divide','limit'],minimum:['stationary','convex','minimum']};
  const proofText={coprime:'假设 √2=p/q，p、q 互素且 q≠0',square:'平方得 p²=2q²','p-even':'p² 偶，所以 p 偶，写 p=2k','q-even':'代入得 q²=2k²，所以 q 也偶',contradiction:'p、q 同偶，与互素矛盾；故 √2 无理',positive:'三边均正',closure:'任意两边和大于第三边，形成非退化三角形',areas:'最大边平方等于另外两边平方和',converse:'应用勾股逆定理，得到最大边所对角为直角',expand:'h(10+Δt)−h(10)=−4Δt+0.2Δt²',divide:'Δt>0，除以 Δt，平均率=−4+0.2Δt',limit:'令 Δt→0，差商→−4；这是该函数在 10 的导数',stationary:'h′(t)=−8+0.4t；t=20 时为零',convex:'h″(t)=0.4>0，在邻域内成立',minimum:'由驻点及二阶导数正，t=20 是严格极小点',looks:'看起来像，所以直接宣布成立'};
  function steps(p){return list(v(p,'proof',[]),x=>one(x,Object.keys(proofText)),8);}
  function equations(c,ops){
    let e=c?[3,5,0,26]:[2,3,1,7],equivalent=true,history=[e.slice()];
    for(const op of ops){const indexes=op.side==='both'?[0,2]:op.side==='left'?[0]:[2];
      for(const i of indexes){const target=i+(op.kind==='number'?1:0);if(op.kind==='divide'){e[i]/=op.amount;e[i+1]/=op.amount;}else{if(e[target]+1e-8<op.amount)return {valid:false,history};e[target]-=op.amount;}}
      if(op.side!=='both')equivalent=false;history.push(e.slice());
    }
    const x=c?7:4,solved=equivalent&&near(e[0],1)&&near(e[1],0)&&near(e[2],0)&&near(e[3],x);
    return {valid:true,equivalent,history,equation:e,x,solved,substitution:c?[3*x+5,26]:[2*x+3,x+7]};
  }
  function normalize(id,c,p){
    if(id==='M01')return {length:n(v(p,'length',1),.5,2),fraction:one(v(p,'fraction','17/12'),['7/5','17/12','41/29']),proof:steps(p)};
    if(id==='M02'){const ops=list(v(p,'ops',[]),o=>({kind:one(o.kind,['x','number','divide']),amount:n(o.amount,1/3,7),side:one(o.side,['both','left','right'])}),8);if(!equations(c,ops).valid)throw new RangeError('Cannot remove an absent object');return {ops};}
    if(id==='M04')return {source:int(v(p,'source',1),1,6),links:list(v(p,'links',[]),pair=>{if(!Array.isArray(pair)||pair.length!==2)throw new RangeError('Invalid relation');return [int(pair[0],1,5),int(pair[1],1,11)];},16)};
    if(id==='M07')return {a:n(v(p,'a',3),1,9),b:n(v(p,'b',4),1,9),c:n(v(p,'c',6),1,12),scale:c?n(v(p,'scale',2),.5,3):1,proof:steps(p)};
    return {dt:n(v(p,'dt',4),.05,8),t:c?n(v(p,'t',15),10,25):10,proof:steps(p)};
  }
  function strings(c,p){const [a,b]=p.fraction.split('/').map(Number),squaredNumerator=a*a-2*b*b,goal=c?Math.abs(a/b-Math.SQRT2)<.01&&chain(p.proof,proofs.irrational):near(p.length,2/3,.002);return R(goal,{frequencyRatio:1/p.length,numerator:a,denominator:b,squaredNumerator,squaredDenominator:b*b,proof:p.proof.map(x=>proofText[x])},c?[['分数近似',`${a}/${b} = ${(a/b).toFixed(8)}`],['平方与 2 的精确差',`${squaredNumerator}/${b*b}`],['无理性理由',chain(p.proof,proofs.irrational)?'互素假设 → 同偶矛盾':'需要完整互素与奇偶推理']]:[['弦长 / 参考弦长',p.length.toFixed(4)],['频率 / 参考频率',(1/p.length).toFixed(4)],['目标比','弦长 2/3；频率 3/2']],c?'分数平方差用于检查这一份近似；一般无理性需要互素到奇偶矛盾的推理。':'同张力与线密度，f∝1/L；听觉喜好不判对错。',{sameTension:true,sameLinearDensity:true,source:'modern mathematical teaching model'});}
  function balance(c,p){const m=equations(c,p.ops);return R(m.solved,m,[['当前等式',formatEquation(m.equation)],['等价操作',m.equivalent?'每步两边同作':'有单侧操作，已不等价'],['代回原式左右',m.solved?m.substitution.join(' = '):'解完再核对'],['步骤数',String(p.ops.length)]],m.solved?'x 已独立在一边，代回原式也相等。步骤随账单保存。':'两盘同步移物；3x=21 仍需除以 3。单侧操作可以预览，但不能声明为等价解。',{original:c?'3x+5=26':'2x+3=x+7',model:'exact equivalence with rational-valued operations'});}
  function fmt(x){if(near(x,Math.round(x)))return String(Math.round(x));if(near(x*3,Math.round(x*3)))return `${Math.round(x*3)}/3`;return x.toFixed(3);}
  function formatEquation(e){const side=(a,b)=>(near(a,0)?'':near(a,1)?'x':fmt(a)+'x')+(near(b,0)?'':(near(a,0)?'':' + ')+fmt(b))||'0';return side(e[0],e[1])+' = '+side(e[2],e[3]);}
  function relation(c,p){const domain=c?[1,2,3,4,5]:[1,3,5],group=Object.fromEntries(domain.map(x=>[x,[...new Set(p.links.filter(pair=>pair[0]===x).map(pair=>pair[1]))]])),old=[1,3,5].every(x=>group[x]?.length===1&&group[x][0]===2*x+1),unique=domain.every(x=>group[x].length===1),goal=old&&unique,outputs=group[p.source];return R(goal,{domain,group,old,unique,probe:p.source,outputs:outputs||null},[['定义域',`{${domain.join(',')}}`],['当前投递编号',String(p.source)],['此输入输出',outputs?.length?outputs.join('、'):outputs?'尚未连接':'此表未定义'],['每个域内输入恰一输出',unique?'是':'否：缺项或多义'],['旧样本 1→3,3→7,5→11',old?'保留':'尚未对应']],goal?'这张有限表成立。不同输入可以到同一窗；它并不唯一确定未见编号的规则。':'保留旧样本，检查每个域内输入恰一处；编号 6 在域外，不能强行套用。',{domain,knownRule:c?'only three old samples fixed':'given y=2x+1'},{links:p.links});}
  function triangle(c,p){const sides=[p.a,p.b,p.c].map(x=>x*p.scale).sort((a,b)=>a-b),positive=sides[0]>0,closed=sides[0]+sides[1]>sides[2],squares=sides.map(x=>x*x),right=near(squares[0]+squares[1],squares[2]),proof=chain(p.proof,proofs.triangle);return R(positive&&closed&&right&&proof,{sides,squares,closed,right,proof:p.proof.map(x=>proofText[x])},[['实际边长',sides.map(fmt).join(' / ')],['两短边和 / 最大边',`${fmt(sides[0]+sides[1])} / ${fmt(sides[2])}`],['平方板面积',squares.map(fmt).join(' + / ')],['闭合 / 平方关系',`${closed?'非退化三角形':'不能组成非退化三角形'} / ${right?'相等':'不相等'}`]],!closed?'等号边界不能当三角形；先让两边和大于第三边。':'平方关系加上三角形前提，再用逆定理；画面角度只是示意。',{theorem:'converse of Pythagoras; nondegenerate positive triangle required',scale:p.scale});}
  const height=t=>100-8*t+.2*t*t,derivative=t=>-8+.4*t;
  function calculus(c,p){const secant=(height(p.t+p.dt)-height(p.t))/p.dt,tangent=derivative(p.t),error=secant-tangent,goal=c?near(p.t,20)&&chain(p.proof,proofs.minimum):p.dt<=.5&&chain(p.proof,proofs.limit);return R(goal,{t:p.t,dt:p.dt,height:height(p.t),secant,tangent,error,second:.4,proof:p.proof.map(x=>proofText[x])},[['正时间间隔',String(p.dt)],['平均变化率',secant.toFixed(5)],['该时刻导数',tangent.toFixed(5)],['差商误差',error.toFixed(5)],['二阶导数','0.4 > 0']],c?'驻点需要变号或二阶导数依据；本函数二阶导数恒正，所以 20 是极小点。':'差商 −4+0.2Δt；缩小正间隔并连接极限步骤，不能把一次平均率叫瞬时率。',{function:'h(t)=100−8t+0.2t²',source:'given fictional teaching curve',zeroIntervalForbidden:true});}
  const evaluate=(id,c,p)=>({M01:strings,M02:balance,M04:relation,M07:triangle,M09:calculus}[id])(c,p);
  function compare(id,{condition:c,basis:b,params:p,result:r}){let eligible=false,kind='';
    if(id==='M02'){eligible=b.goalSupported&&r.goalSupported&&!chain(b.params.ops.filter(o=>o.kind!=='divide'||!near(o.amount,1)),p.ops.filter(o=>o.kind!=='divide'||!near(o.amount,1)));kind='equivalent-route';}
    if(id==='M04'){eligible=c===1&&b.goalSupported&&r.goalSupported&&[2,4].some(x=>b.measurement.group[x][0]!==r.measurement.group[x][0]);kind='finite-counterexample';}
    if(id==='M07'){eligible=c===1&&b.goalSupported&&r.goalSupported&&b.params.a===p.a&&b.params.b===p.b&&b.params.c===p.c&&b.params.scale!==p.scale;kind='squared-scaling';}
    if(id==='M09'){eligible=c===0&&b.goalSupported&&r.goalSupported&&b.params.dt!==p.dt;kind='secant-limit';}
    return {eligible,verified:eligible,kind};
  }
  function study(id){if(id!=='M01')return null;return {measurement:{first:[1,144],second:[-1,841]},text:'(17/12)²−2=1/144，(41/29)²−2=−1/841。绝对平方差 1/841<1/144，但都不为零；它们是近似，互素假设的奇偶矛盾才给出无理性结论。'};}
  const api={normalize,evaluate,compare,study,proofs,proofText,equations,formatEquation,height,derivative};if(local)module.exports=api;if(typeof window!=='undefined')window.AtlasAppendixMath=api;
})();
