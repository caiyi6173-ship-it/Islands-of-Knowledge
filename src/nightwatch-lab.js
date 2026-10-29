/* Optional R02 controls plug into the existing persistent research shell. */
(() => {
  const M=window.AtlasNightwatchModels;
  function controls({id,condition:c,params:p,input}){
    if(id==='P06')return `<fieldset><legend>${c?'转动线圈':'移动磁铁'} · 按住操作</legend><div class="fv-choices"><button data-nw-drive="-1">${c?'↶ 反向转动':'← 拉远'}</button><button data-nw-drive="1">${c?'正向转动 ↷':'推近 →'}</button></div><small>按住鼠标、触屏，或聚焦按钮后按住空格 / 方向键；松手停稳。也可直接拖舞台上的${c?'手柄':'磁铁'}。</small><button data-nw-action="clear">清空当前片段 · 免费</button><div class="nw-legend"><i></i>输入轨迹与响应同步采样，记录前可反复试</div></fieldset>`;
    if(id==='C10'){
      const toggle=(key,label)=>`<button data-fv-param="${key}" data-value="${p[key]==='on'?'off':'on'}" aria-pressed="${p[key]==='on'}">${label}：${p[key]==='on'?'已接通 · 拆开':'断开 · 接通'}</button>`;
      const checks=c?'':`<div class="nw-checks">${[['on','off','只接导线'],['off','on','只接盐桥'],['on','on','双路闭合']].map(([wire,bridge,name])=>`<span class="${p.checks.some(s=>s.wire===wire&&s.bridge===bridge)?'done':''}">${p.checks.some(s=>s.wire===wire&&s.bridge===bridge)?'✓':'○'} ${name}</span>`).join('')}</div>`;
      return `<fieldset><legend>01 / 查两条通路</legend><div class="fv-choices">${toggle('wire','外导线')}${toggle('bridge','盐桥')}</div><small>也可把舞台接头拖到虚线接口；直接点接头可拆开。</small>${checks}</fieldset>${c?`<fieldset><legend>02 / 改负载</legend>${input('load','外部负载 / Ω',10,100,5)}</fieldset><fieldset><legend>03 / 标电子的外路方向</legend><div class="fv-choices">${['ZnCu','CuZn'].map(v=>`<button data-fv-param="direction" data-value="${v}" aria-pressed="${p.direction===v}">${v==='ZnCu'?'Zn → Cu':'Cu → Zn'}</button>`).join('')}</div><small>盐桥走离子；方向签不改变物理读数。</small></fieldset>`:''}`;
    }
    return `<fieldset><legend>拖动船速箭头 · 长度固定为 5</legend>${input('angle','航向 / °',30,150,.01)}<div class="nw-vector-key"><span>━ 船速</span><span>━ 水流</span><span>━ 合速度</span></div><small>0° 顺流，90° 正对岸，180° 逆流。拖动黄色箭头端点，或用滑条与方向键细调。</small></fieldset>`;
  }
  function edit(id,c,p,u){
    const next={...p,...u};
    if(id==='C10'&&!c){const pair={wire:next.wire,bridge:next.bridge};next.checks=p.checks.some(s=>s.wire===pair.wire&&s.bridge===pair.bridge)?p.checks:[...p.checks,pair];}
    return next;
  }
  function nextParams(id,p){return id==='C10'?{wire:p.wire,bridge:p.bridge,load:50,direction:''}:id==='M08'?p:M.normalize(id,1);}
  window.AtlasNightwatchLab={models:M,art:window.AtlasNightwatchArt,chapter:'R02',tag:'NIGHT WATCH / R02',mission:'工坊输入 → 值班信号 → 回程航向',ids:['P06','C10','M08'],labels:['输入','信号','回程'],places:{P06:'线圈工坊',C10:'信号台',M08:'回程河道'},deliveryTitle:'交付夜班操作卡',deliveredText:'局部夜班已经有人交接；完整三岛夜邮仍需后续委托。',controls,edit,nextParams,reviewCommand:M.reviewCommand,createRuntime:options=>window.AtlasNightwatchRuntime.create(options)};
})();
