/* R01 keeps its stage mounted while controls, evidence and story update locally. */
(() => {
  // The shell owns research flow; chapter plug-ins own controls, models and live input.
  const patch=window.AtlasPhysicsSandbox.patch;
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const labels={lump:'实心',bowl:'碗形',wide:'宽船',eye:'看外观',density:'测密度',conductivity:'测电导',magnet:'看磁响应',salt:'盐',sugar:'糖',iron:'铁',copper:'铜'};
  const hints={P01:'先点右侧船型 · 再盯住船身吃水与「实际排水」',C01:'先把留样拖到仪器 · 再看读数是否变化',M03:'先拖方格里的标记定地址 · 再读坐标'};
  function create(host,options){
    const {id,getProgress,getState,onCommand,onRestart,onDraft,onExit,onOpen,onDeliver,onPost,onLegacy,encounter,firstJob}=options;
    const lab=options.lab||{},M=lab.models||window.AtlasFirstVoyageModels,Art=lab.art||window.AtlasFirstVoyageArt,chapter=lab.chapter||'R01';
    const ids=lab.ids||['P01','C01','M03'],taskLabels=lab.labels||['承载','样品','地址'];
    const d=M.definitions[id],api=M.createSession(id),sound=window.AtlasPhysicsSound,Presentation=window.AtlasResearchPresentation;let runtime=null,presentation=null,onboarding=null;
    const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
    let run=getState(),params=M.normalize(id,run.activeCondition),destroyed=false,frame=0,drag=null;
    let notice='',noticeKind='',reference=false,desiredRole=run.role,intro=true,motionPaused=motionPreference.matches;
    const saved=getProgress().researchDrafts?.[id];
    if(saved?.runId===run.runId&&saved.condition===run.activeCondition){try{params=M.normalize(id,run.activeCondition,saved.params);}catch{}}
    else {const last=run.records.findLast(r=>r.condition===run.activeCondition);if(last)params={...last.params};}
    const portrait=Presentation.portrait(id);
    host.innerHTML=`<header class="fv-header"><button data-fv-action="exit" aria-label="关闭关卡">← 返回地图</button><div><small>${lab.tag||'FIRST VOYAGE / R01'} · ${id}</small><h2 id="modal-title">${esc(d.title)}</h2></div><button data-fv-action="mute" aria-label="切换音效"></button></header>
      <div class="rp-ribbon" aria-label="本章邮路"></div>${lab.context?lab.context({id}):''}
      <div class="fv-goal"><div class="fv-goal-main"><small>当前目标</small><h3 class="fv-goal-text" aria-live="polite"></h3><div class="fv-condition"></div></div><div class="fv-resources" aria-label="研究额度"></div></div>
      <div class="fv-mission"></div>
      <div class="fv-layout"><section class="fv-play"><div class="fv-stage-frame" data-fv-drop="stage"></div><p class="fv-scene-hint"></p>
      <div class="fv-conversation"><span class="fv-portrait">${portrait}</span><div><small>${esc(d.person)} · ${esc(d.place)}</small><strong class="rp-feedback-state"></strong><p class="fv-feedback"></p></div></div><p class="rp-announcement" role="status" aria-live="polite" aria-atomic="true"></p>
      </section><aside class="fv-lab" aria-label="操作与记录"><div class="fv-lab-scroll"><section class="ro-guide" aria-label="操作指引"></section><div class="fv-controls"></div><div class="fv-readings" aria-live="off"></div><div class="fv-actions"></div>
      <section class="fv-summary-slot"></section><details class="fv-ledger"><summary>研究手记 · <span class="fv-record-count"></span></summary><div class="fv-records"></div><p class="fv-boundary">${esc(d.boundary)}</p></details></div><div class="fv-commit"></div>
      <footer class="fv-tools"><details><summary>研究偏好与帮助</summary><label>下一轮偏好 <select data-fv-role><option value="assistant">助手 · 9 时间 / 4 器材</option><option value="maker">工匠 · 7 / 6，首条免器材</option><option value="skeptic">求真者 · 7 / 4，首份核对更详细</option></select></label><button data-fv-action="restart">开启新一轮，保留成果与历史</button><button data-fv-action="hint">怎么操作 · 免费</button><button data-fv-action="replay-intro">重播关卡开头</button><button data-fv-action="consult">请人物核对 · 时间 −1</button>${onLegacy?'<button data-fv-action="legacy">查看 / 继续原规则记录</button>':''}</details><span>自由操作免费 · 正式记录按标价结算</span></footer></aside></div>`;
    host.classList.add('fv-workbench');host.dataset.level=id;
    host.querySelector('[data-fv-role]').value=run.role;
    function supported(c){return run.records.some(r=>r.condition===c&&r.recordValid&&r.goalSupported);}
    function quality(){return run.records.some(r=>r.recordValid&&r.quality?.verified)||(run.studies||[]).some(s=>s.verified);}
    function quote(){
      const base=run.records.findLast(r=>r.condition===run.activeCondition&&r.recordValid&&api.quote(run,{type:'record',params,basis:r.id,claim:reference?'reference':'goal'}).quality?.eligible);
      return api.quote(run,{type:'record',params,claim:reference?'reference':'goal',...(base?{basis:base.id}:{})});
    }
    function buttons(key,values,kind=''){
      return values.map(value=>`<button type="button" draggable="true" data-fv-param="${key}" data-value="${value}" ${kind?`data-fv-${kind}="${value}"`:''} aria-pressed="${params[key]===value}">${esc(labels[value])}</button>`).join('');
    }
    function input(key,label,min,max,step=1){return `<label class="fv-number"><span class="rp-range-label">${label}</span><input id="fv-${key}" aria-label="${esc(label)}" data-fv-input="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${params[key]}"><output for="fv-${key}">${params[key]}</output></label>`;}
    function controls(){
      if(lab.controls)return lab.controls({id,condition:run.activeCondition,params,input,buttons,run});
      if(id==='P01')return `<fieldset><legend>塑形 · 材料仍为 1.2 kg</legend><div class="fv-choices">${buttons('shape',['lump','bowl','wide'])}</div><small>拖船型入水槽，也可直接点选。</small></fieldset>`;
      if(id==='C01')return `<fieldset><legend>01 / 测性质</legend><button class="fv-sample" draggable="true" data-fv-sample="${run.activeCondition?'B':'A'}">留样 ${run.activeCondition?'B · 金属':'A · 白色样品'} ↗</button><div class="fv-choices">${buttons('instrument',run.activeCondition?['eye','conductivity','magnet']:['eye','density','conductivity'],'instrument')}</div><small>拖留样到仪器，或把仪器拖到舞台。</small></fieldset><fieldset><legend>02 / 夹身份签</legend><div class="fv-choices fv-labels">${buttons('identity',run.activeCondition?['iron','copper']:['salt','sugar'])}</div><small>改名字不改变读数，也不制造新测量。</small></fieldset>`;
      if(run.activeCondition)return `<fieldset><legend>题卡只研究 y = mx，截距为 0</legend>${input('lineSlope','斜率 m',0,4,.1)}<small>拖关系线上的方块，或用方向键调整。</small></fieldset>`;
      return `<fieldset><legend>从同一个地方数</legend><div class="fv-choices"><button data-fv-param="origin" data-value="0" aria-pressed="${params.origin===0}">原点 (0,0)</button><button data-fv-param="origin" data-value="1" aria-pressed="${params.origin===1}">原点 (1,1)</button></div>${input('targetX','横坐标 x',-params.origin,8-params.origin)}${input('targetY','纵坐标 y',-params.origin,6-params.origin)}<small>东 +x，北 +y；每格 1 单位；先横再纵。</small></fieldset>`;
    }
    function refresh(){
      if(destroyed)return;
      const latest=getState();if(!latest||latest.runId!==run.runId)return;
      run=latest;const result=M.evaluate(id,run.activeCondition,params,run),q=quote(),p=getProgress();
      const postal=window.AtlasWorldline.status(p,chapter),missing=postal.missing;
      patch(host.querySelector('.rp-ribbon'),Presentation.ribbon(chapter,!!p.mailDeliveries[chapter]));
      patch(host.querySelector('.fv-mission'),`<span>${lab.mission||'四箱货 → 小禾的内港窗口'}</span><div>${ids.map((key,i)=>`<span class="${p.mailArtifacts[key]?.complete?'is-complete':''}">${p.mailArtifacts[key]?.complete?'✓':'○'} ${taskLabels[i]}</span>`).join('')}</div>`);
      const best=Math.max(run.bestStars,p.mailArtifacts[id]?.bestStars||0);
      patch(host.querySelector('.fv-resources'),`<span>时间 <b>${run.resources.time}</b></span><span>器材 <b>${run.resources.tools}</b></span><span>记录可靠度 <b>${run.resources.trust}/5</b></span><span class="fv-stars" aria-label="历史最佳 ${best} 星">${'★'.repeat(best)}${'☆'.repeat(3-best)} <small>历史最佳</small></span>`);
      patch(host.querySelector('.fv-goal-text'),esc(d.goals[run.activeCondition]));
      patch(host.querySelector('.fv-scene-hint'),esc(hints[id]||'先动右侧控件 · 再看读数变化'));
      patch(host.querySelector('.fv-condition'),`<small>${run.returnCondition!==null?'补充核对':`条件 ${run.activeCondition+1} / 2`}</small><h3>${esc(d.conditions[run.activeCondition])}</h3>`);
      patch(host.querySelector('.fv-stage-frame'),Art.scene(id,run.activeCondition,params,result,{run}));
      patch(host.querySelector('.fv-controls'),controls());
      patch(host.querySelector('.fv-readings'),`<dl>${result.readings.map(([name,value])=>`<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`);
      const explanation=q.reason==='duplicate-record'?'这组条件与声明已有记录':!result.legal?(lab.invalidReason||(id==='C01'?'先夹一张身份签，再正式记录':id==='C10'?'先标记电子方向，再正式记录':'先把标记移回给定网格')):'额度不足，可检查合格比较或补给';
      patch(host.querySelector('.fv-commit'),`<p class="ro-charge-note">随便试，预览与操作帮助都免费。准备好再记录。</p><label class="fv-reference"><input type="checkbox" data-fv-reference ${reference?'checked':''}>只记现象，作为参考</label><div class="fv-price"><strong>${q.discount?'合格补充研究':'正式记录'}</strong><span>时间 −${q.cost?.time??2} · 器材 −${q.cost?.tools??1}</span></div><button id="fv-record" class="fv-primary" data-fv-action="record" ${q.allowed?'':'disabled'}>${q.allowed?'记录这一组 →':esc(explanation)}</button><small>正式声明无依据：扣本次成本与 1 可靠度。免费调试不扣。</small>`);
      host.querySelector('[data-fv-reference]').checked=reference;
      let actions='';
      if(run.returnCondition!==null)actions+='<button data-fv-action="return">返回当前任务 →</button>';
      else if(run.activeCondition===0&&supported(0))actions+=`<p>${esc(d.change)}</p><button data-fv-action="advance">已看清变化，检查新条件 →</button>`;
      if(run.activeCondition===1&&supported(0)&&run.returnCondition===null)actions+='<button data-fv-action="supplement">回到原条件，补充核对 ↶</button>';
      if(api.canSupply(run))actions+='<button data-fv-action="supply">一次补给 +4 时间 / +2 器材 · 本轮无第三星</button>';
      const review=lab.reviewCommand?.(run),rq=review&&api.quote(run,{type:'review',...review});
      if(review&&!quality())actions+=`<p>${esc(lab.reviewPrompt||'可选：两张路线都已记录。引用它们，核对竖直分量给出的时间下界。')}</p><button data-fv-action="review" ${rq.allowed?'':'disabled'}>${esc(lab.reviewLabel||'核对 vy ≤ 5 与 T ≥ 4')} · 时间 −1 / 器材 0</button>`;
      patch(host.querySelector('.fv-actions'),actions);
      const feedback=host.querySelector('.fv-feedback');feedback.textContent=notice||result.feedback;feedback.dataset.kind=noticeKind;
      host.querySelector('.fv-conversation').dataset.feedback=noticeKind||'preview';
      patch(host.querySelector('.rp-feedback-state'),Presentation.status(noticeKind||'preview'));
      const changed=JSON.stringify(run.revisions.at(-1)?.records)!==JSON.stringify([...run.records.filter(r=>r.recordValid).map(r=>r.id),...(run.studies||[]).filter(s=>s.verified).map(s=>s.id)]);
      let summary=`<div class="fv-quality ${quality()?'is-verified':''}"><strong>${quality()?'✓ 额外研究已核对':'☆ 第三星 · 可选研究'}</strong><p>${esc(d.quality)}</p><small>正式失误 ≤1，未用补给。主线无需三星。</small></div>`;
      if(supported(0)&&supported(1)&&run.returnCondition===null)summary+=`<article class="fv-outcome"><small>${run.revisions.length?'成果已归档':'可以收好成果了'}</small><h3>${esc(window.AtlasWorldlineData.tasks[id].title)}</h3><p>${esc(d.summary)}</p>${changed?`<button class="fv-primary" data-fv-action="archive">${run.revisions.length?'发布这份补充记录':'收好成果'} →</button>`:''}</article>`;
      if(p.mailArtifacts[id]?.complete && lab.kind==='side'){
        const status=window.AtlasWorldline.appendixStatus(p,id),saved=p.mailAppendices[id];
        summary+=`<div class="ap-sent"><p>${status.waiting?'附页已收好。所属章节 '+chapter+' 交付后即可补寄，研究无需重做。':status.ready?'已有成果可单独补寄给使用者。主线不会重演。':'追加回条已留存，继续研究不会撤回原寄出页。'}</p>${status.waiting?'':`<button data-fv-action="deliver">${status.ready?'寄出这份附页':'回看追加回条'} →</button>`}<button data-fv-action="post">查看货单与附页</button></div>`;
      }
      if(p.mailArtifacts[id]?.complete && lab.kind!=='side'){
        const delivered=!!p.mailDeliveries[chapter],ready=postal.ready;
        const message=delivered?(lab.deliveredText||'第一船信已经送达，世界进度会保留。'):missing.length?'成果已夹入货单。还缺：'+missing.map(k=>window.AtlasWorldlineData.tasks[k].title).join('、'):!ready?'三张齐备。先交付前一份委托，再安排这次交班。':'三张齐备，可以一同寄出。';
        summary+=`<div class="fv-next"><p>${message}</p>${missing.map(k=>`<button data-fv-open="${k}">去${lab.places?.[k]||(k==='P01'?'水槽':k==='C01'?'留样台':'测绘台')} →</button>`).join('')}${!missing.length?`<button class="fv-primary" data-fv-action="deliver">${delivered?(lab.replayTitle|| (chapter==='R01'?'重看首航与回条':chapter==='R02'?'重看夜班交接与回条':'重看共同修订与补注')):ready?(lab.deliveryTitle||'交付第一船信'):'先查看前一份委托'} →</button>`:''}<button data-fv-action="post">查看三岛货单</button></div>`;
      }
      patch(host.querySelector('.fv-summary-slot'),summary);
      host.querySelector('.fv-record-count').textContent=`${run.records.length} 条正式记录，${run.consultations.length} 份给定资料`;
      patch(host.querySelector('.fv-records'),run.records.map(r=>`<article><small>${r.condition===0?'参照':'新条件'} · ${r.recordValid?(r.goalSupported?'目标有支持':'有效参考'):'声明未成立'}${r.quality?.verified?' · '+({ 'cross-check':'交叉取证','representation-check':'表示核对','controlled-comparison':'控制比较','motion-reversal':'同路反向比较','load-comparison':'固定条件负载比较','tuning-comparison':'固定报码调谐比较','electron-correspondence':'共享对与键线对应','orbit-comparison':'同假设轨迹比较','spatial-correspondence':'跨视角顶点对应','photon-flux-comparison':'固定频率通量比较','mass-boundary-comparison':'固定边界质量去向比较','interference-comparison':'固定波长明暗比较','spectral-comparison':'同资料模型残差比较','equivalent-route':'等价变形路线','finite-counterexample':'有限表反例','squared-scaling':'平方关系缩放','secant-limit':'差商与极限','molecule-copies':'整票复制核对','electrolysis-charge':'同装置电量比较','dipole-addition':'非零向量相加','composition-scaling':'同组成倍增'})[r.quality.kind]:''}</small><p>${r.readings.map(([name,value])=>`${esc(name)}：${esc(value)}`).join(' / ')}</p><span>时间 −${r.cost.time} · 器材 −${r.cost.tools}</span></article>`).join('')+(run.studies||[]).map(s=>`<article><small>本人推理 · 引用 ${s.references.length} 条正式记录</small><p>${esc(s.text)}</p><span>时间 −1 · 器材 0</span></article>`).join('')+run.consultations.map(c=>`<article><small>给定核对资料 · 不替代本人记录</small><p>${esc(c.guidance.text)}</p></article>`).join(''));
      updateMute();onboarding?.update(result);
    }
    function updateMute(){const button=host.querySelector('[data-fv-action=mute]');button.textContent=sound.isMuted()?'音效：关':'音效：开';button.setAttribute('aria-pressed',String(!sound.isMuted()));button.setAttribute('aria-label',sound.isMuted()?'开启音效':'关闭音效');}
    function announce(){presentation?.announce(noticeKind||'preview',notice);}
    function dismissIntro(){
      if(!intro)return;intro=false;
      onboarding.dismiss();
    }
    function showIntro(){
      intro=true;
      onboarding.showOpening(motionPaused);
    }
    function change(updates){
      if(destroyed)return;dismissIntro();
      const previous=params;
      try{params=M.normalize(id,run.activeCondition,lab.edit?lab.edit(id,run.activeCondition,params,updates):{...params,...updates});notice='';noticeKind='';}
      catch{if(lab.invalidInput){notice=lab.invalidInput;noticeKind='warning';onboarding.blocked(notice);refresh();announce();}return;}
      onboarding.changed(updates,params,previous);onDraft({runId:run.runId,condition:run.activeCondition,params:{...params}});
      cancelAnimationFrame(frame);frame=requestAnimationFrame(refresh);
    }
    function command(type,extra={}){
      if(destroyed)return;dismissIntro();cancelAnimationFrame(frame);
      const previousTrust=run.resources.trust;
      const result=onCommand({id:window.AtlasResearchSession.token(),runId:run.runId,expectedSequence:run.events.length,type,...extra});
      if(destroyed)return;
      if(!result.changed){notice=({'unsupported-archive':'依据或可靠度还不足，保留记录继续核对。','stale-command':'另一页更新了这轮研究，请重新进入。','duplicate-record':'这组已经记录，换一项真实条件再比较。','insufficient-resources':'额度不足；可做合格比较、领取一次补给，或开启新轮。'})[result.reason]||'本次没有结算。请检查条件与现有记录。';noticeKind='warning';sound.playWarning();refresh();announce();return;}
      run=getState();
      if(type==='record'){
        const record=run.records.at(-1);notice=record.recordValid?(record.quality?.verified?'核对成立，这份比较也留下了依据。':record.goalSupported?'记录已保存。可以继续比较，再主动切换条件。':'现象已作为有效参考保存；这份记录还不支持当前目标。'):M.evaluate(id,run.activeCondition,params,run).feedback;
        noticeKind=record.recordValid?(record.goalSupported?'success':'reference'):'error';
        if(!record.recordValid)notice+=` 本次时间 −${record.cost.time}、器材 −${record.cost.tools}，可靠度 −${previousTrust-run.resources.trust}。可以免费调试后再记。`;
        record.recordValid?(record.goalSupported?sound.playEureka():sound.playReference()):sound.playError();onboarding.recorded(record.recordValid);
      }
      if(type==='advance'){params=lab.nextParams?M.normalize(id,1,lab.nextParams(id,params)):id==='P01'?{...params}:M.normalize(id,1);reference=false;notice=d.change;noticeKind='';}
      if(type==='supplement'||type==='return'){params={...(run.records.findLast(r=>r.condition===run.activeCondition)?.params||M.normalize(id,run.activeCondition))};reference=false;notice='主任务进度保留，补充记录会按现在的时间顺序加入。';}
      if(type==='archive'){notice=result.introduced?'阿墨翻出 00：给下一位愿意试试的人。弄明白一件事，就能写一行。':'成果已收好。当地完成与整批交付分别记录。';noticeKind='archive';sound.playSuccess();}
      if(type==='review'){notice=run.studies.at(-1).text;noticeKind='success';sound.playEureka();}
      if(['advance','supplement','return'].includes(type))runtime?.reset();
      if(type==='consult'){notice=run.consultations.at(-1).guidance.text;noticeKind='reference';}
      if(type==='supply'){notice='已补给。本轮仍可完成成果，第三星不再计入。';noticeKind='warning';}
      const focusedAction=document.activeElement?.dataset.fvAction;
      onDraft({runId:run.runId,condition:run.activeCondition,params:{...params}});refresh();announce();
      if(focusedAction&&!host.querySelector(`[data-fv-action="${focusedAction}"]:not(:disabled)`))host.querySelector('[data-fv-action=advance],[data-fv-action=archive],[data-fv-action=record]:not(:disabled),[data-fv-param],input[data-fv-input]')?.focus({preventScroll:true});
    }
    function click(event){
      const button=event.target.closest('button');if(!button||!host.contains(button)||button.disabled||destroyed)return;
      if(button.dataset.fvParam){change({[button.dataset.fvParam]:id==='M03'?Number(button.dataset.value):button.dataset.value});return;}
      if(button.dataset.fvOpen){onOpen(button.dataset.fvOpen);return;}
      switch(button.dataset.fvAction){
        case 'record':{const q=quote();command('record',{params:{...params},claim:reference?'reference':'goal',...(q.basis?{basis:q.basis.id}:{})});break;}
        case 'advance':command('advance');break;case 'supplement':command('supplement',{condition:0});break;case 'return':command('return');break;
        case 'review':{const review=lab.reviewCommand?.(run);if(review)command('review',review);break;}
        case 'archive':command('archive',{scope:'tested'});break;case 'supply':command('supply');break;case 'consult':command('consult');break;
        case 'exit':onExit();break;case 'post':onPost();break;case 'deliver':onDeliver();break;case 'legacy':onLegacy?.();break;
        case 'skip-intro':dismissIntro();break;
        case 'replay-intro':showIntro();break;
        case 'hint':dismissIntro();onboarding.help();break;
        case 'mute':sound.toggleMute();refresh();break;
        case 'motion':setMotion(!motionPaused);break;
        case 'restart':if(!onRestart(desiredRole)?.changed)break;run=getState();params=M.normalize(id,0);runtime?.reset();reference=false;notice='新轮已开始，先前正式尝试和有效成果保留。';refresh();showIntro();break;
      }
    }
    function handleInput(event){const key=event.target.dataset.fvInput;if(key&&Number.isFinite(event.target.valueAsNumber))change({[key]:event.target.valueAsNumber});}
    function select(event){if(event.target.matches('[data-fv-reference]')){reference=event.target.checked;refresh();}if(event.target.matches('[data-fv-role]'))desiredRole=event.target.value;}
    function pointerDown(event){const handle=event.target.closest('[data-fv-handle]');if(!handle||destroyed)return;event.preventDefault();drag=handle.dataset.fvHandle;host.setPointerCapture(event.pointerId);handle.focus();}
    function pointerMove(event){
      if(!drag||destroyed)return;const svg=host.querySelector('.fv-scene'),point=svg.createSVGPoint();point.x=event.clientX;point.y=event.clientY;
      const p=point.matrixTransform(svg.getScreenCTM().inverse());
      if(drag==='point')change({targetX:Math.max(0,Math.min(8,Math.round((p.x-96)/48)))-params.origin,targetY:Math.max(0,Math.min(6,Math.round((312-p.y)/48)))-params.origin});
      else change({lineSlope:Math.max(0,Math.min(4,Math.round((312-p.y)/72*10)/10))});
    }
    function pointerUp(){drag=null;}
    function key(event){
      if(event.key==='Escape'&&intro){event.stopPropagation();event.preventDefault();dismissIntro();return;}
      const handle=event.target.closest('[data-fv-handle]');if(!handle||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
      event.preventDefault();const direction=['ArrowUp','ArrowRight'].includes(event.key)?1:-1;
      if(handle.dataset.fvHandle==='slope')change({lineSlope:Math.max(0,Math.min(4,Number((params.lineSlope+direction*.1).toFixed(1))))});
      else{const axis=['ArrowLeft','ArrowRight'].includes(event.key)?'targetX':'targetY',max=axis==='targetX'?8:6;change({[axis]:Math.max(-params.origin,Math.min(max-params.origin,params[axis]+direction))});}
    }
    function dragStart(event){const b=event.target.closest('[draggable=true]');if(!b||!b.dataset.fvSample&&!b.dataset.fvParam)return;event.dataTransfer.setData('application/x-first-voyage',b.dataset.fvSample?`sample:${b.dataset.fvSample}`:`${b.dataset.fvParam}:${b.dataset.value}`);event.dataTransfer.effectAllowed='copy';}
    function dragOver(event){if(event.dataTransfer.types.includes('application/x-first-voyage'))event.preventDefault();}
    function drop(event){
      const [key,value]=event.dataTransfer.getData('application/x-first-voyage').split(':');if(!key)return;event.preventDefault();
      if(key==='sample'&&value===(run.activeCondition?'B':'A')){const target=event.target.closest('[data-fv-instrument]');if(target)change({instrument:target.dataset.fvInstrument});}
      else if(event.target.closest('.fv-stage-frame')&&['shape','instrument','identity'].includes(key))change({[key]:value});
    }
    const listeners={click,input:handleInput,change:select,pointerdown:pointerDown,pointermove:pointerMove,pointerup:pointerUp,pointercancel:pointerUp,keydown:key,dragstart:dragStart,dragover:dragOver,drop};
    Object.entries(listeners).forEach(([event,fn])=>host.addEventListener(event,fn));
    const motionButton=document.createElement('button');motionButton.dataset.fvAction='motion';host.querySelector('.fv-tools details').append(motionButton);
    function setMotion(paused){motionPaused=paused||motionPreference.matches;runtime?.pause?.(motionPaused);if(motionPaused){presentation?.pause();onboarding?.pause();}host.classList.toggle('fv-motion-paused',motionPaused);motionButton.textContent=motionPreference.matches?'已按系统减少动态 · 计算仍即时':motionPaused?'允许场景动画 · 计算仍即时':'暂停场景动画 · 计算仍即时';motionButton.disabled=motionPreference.matches;motionButton.setAttribute('aria-pressed',String(motionPaused));}
    const preferenceChanged=event=>setMotion(event.matches);
    motionPreference.addEventListener('change',preferenceChanged);window.addEventListener('atlas-sound-change',updateMute);
    refresh();presentation=Presentation.mount(host);onboarding=window.AtlasResearchOnboarding.mount({host,id,definition:d,getState,onDismiss:()=>{intro=false;}});showIntro();runtime=lab.createRuntime?.({host,id,getParams:()=>params,getCondition:()=>run.activeCondition,getState:()=>run,change});setMotion(motionPaused);
    return {id,refresh,destroy(){destroyed=true;onboarding?.destroy();presentation?.destroy();runtime?.destroy();sound.stopAll();cancelAnimationFrame(frame);drag=null;motionPreference.removeEventListener('change',preferenceChanged);window.removeEventListener('atlas-sound-change',updateMute);Object.entries(listeners).forEach(([event,fn])=>host.removeEventListener(event,fn));}};
  }
  window.AtlasFirstVoyageWorkbench={create};
})();
