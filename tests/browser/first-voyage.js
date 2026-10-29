async(page) => {
  const base=new URL(page.url()).origin,browser=page.context().browser(),contexts=[],checks=[],pageErrors=[];
  const assert=(v,m)=>{if(!v)throw new Error(m);};
  const context=async(options={})=>{
    const c=await browser.newContext({viewport:{width:1440,height:960},...options});contexts.push(c);
    c.on('page',p=>p.on('pageerror',e=>pageErrors.push(e.stack||e.message)));return c;
  };
  const load=async c=>{const p=await c.newPage();await p.goto(base+"/#map",{waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();return p;};
  const read=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('knowledge-islands-v2')));
  const action=(p,a)=>p.locator(`[data-fv-action=${a}]`).click();
  const exit=p=>action(p,'exit');
  const open=async(p,id)=>{
    await p.locator('#mail-toggle').click();await p.locator('[data-mail-chapter=R01]').click();
    await p.locator(`[data-mail-open=${id}]`).click();await p.locator(`.fv-workbench[data-level=${id}]`).waitFor();
    assert(await p.locator('.fv-intro').isVisible(),`${id}: entry did not replay intro`);
    await p.keyboard.press('Escape');assert(await p.locator('.fv-workbench').isVisible(),`${id}: Escape closed the whole level`);
  };
  const set=async(p,key,value)=>{
    const b=p.locator(`[data-fv-param=${key}][data-value="${value}"]`);
    if(await b.count()) {
      await b.click();await p.waitForFunction(({key,value})=>document.querySelector(`[data-fv-param=${key}][data-value="${value}"]`)?.getAttribute('aria-pressed')==='true',{key,value});
    } else {
      await p.locator(`[data-fv-input=${key}]`).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));},value);
      await p.waitForFunction(({key,value})=>document.querySelector(`[data-fv-input=${key}]`)?.nextElementSibling.textContent===String(value),{key,value});
    }
  };
  try {
    const p=await load(await context());
    assert(await p.locator('#site-prologue').isHidden(),'long opening blocked the first courier job');
    assert((await p.locator('#quest-title').innerText()).includes('四箱'),'first commission was not visible');
    await p.locator('#help-toggle').click();await p.locator('#replay-site-prologue').click();
    await p.locator('#site-prologue').waitFor();await p.keyboard.press('Escape');
    checks.push('fresh player sees the courier commission; the longer science opening remains available on request');
    await p.locator('#quest-start').click();await p.locator('.fv-workbench[data-level=P01]').waitFor();
    assert(await p.locator('.fv-intro .px-blackout-screen').count()===1,'first job does not use the original historical prologue');
    await p.keyboard.press('Escape');
    await p.evaluate(()=>{window.__fvStage=document.querySelector('.fv-scene');});
    const initial=JSON.stringify((await read(p)).researchRuns.P01.resources);
    await set(p,'shape','bowl');await set(p,'shape','wide');await set(p,'shape','bowl');
    await p.locator('.fv-tools summary').click();await action(p,'motion');await action(p,'hint');await action(p,'motion');
    await action(p,'mute');assert(await p.locator('[data-fv-action=mute]').innerText()==='音效：关','mute not applied');
    await p.locator('.fv-tools summary').click();await p.locator('#modal').evaluate(el=>el.scrollTop=0);
    assert(JSON.stringify((await read(p)).researchRuns.P01.resources)===initial,'free changes consumed resources');
    await p.waitForTimeout(500);
    await p.screenshot({path:'output/browser-regressions/p4-harbor-desktop.png'});
    await action(p,'record');await set(p,'shape','wide');await action(p,'record');
    await action(p,'advance');assert(await p.locator('[data-fv-param=shape][data-value=wide][aria-pressed=true]').count()===1,'cargo stage discarded shape');
    await action(p,'record');await action(p,'archive');
    let s=(await read(p)).researchRuns.P01;
    assert(s.records.length===3&&s.bestStars===3&&s.resources.time===4,'P01 three-star path failed');
    assert(await p.evaluate(()=>window.__fvStage===document.querySelector('.fv-scene')),'P01 replaced its mounted stage');
    assert((await p.locator('.fv-feedback').innerText()).includes('00'),'first archive did not introduce 00');
    assert(!(await read(p)).mailDeliveries.R01,'one local artifact sent the ship');
    checks.push('P01 direct entry, free preview, same mounted stage, affordable optional research and local archive');
    await exit(p);await open(p,'C01');
    assert(await p.locator('#modal').evaluate(el=>getComputedStyle(el).backgroundColor)==='rgb(26, 44, 68)','unified deep-sea chrome did not reach the sample lab');
    assert(await p.locator('.fv-readings dd').first().evaluate(el=>getComputedStyle(el).color)==='rgb(237, 243, 252)','sample readings lost their intended contrast');
    await set(p,'instrument','density');await set(p,'identity','salt');await action(p,'record');
    const before=JSON.stringify((await read(p)).researchRuns.C01.resources);
    await set(p,'identity','sugar');
    assert((await p.locator('.fv-readings').innerText()).includes('2.16'),'identity changed measured density');
    assert((await p.locator('.fv-price').innerText()).includes('器材 −1'),'answer edit got a discount');
    await set(p,'identity','salt');await set(p,'instrument','conductivity');
    assert((await p.locator('.fv-price').innerText()).includes('器材 −0'),'cross-check discount absent');
    assert(JSON.stringify((await read(p)).researchRuns.C01.resources)===before,'free label change was charged');
    await p.screenshot({path:'output/browser-regressions/p4-samples-desktop.png'});
    await action(p,'record');await action(p,'advance');
    assert(await p.locator('[data-fv-param=identity][aria-pressed=true]').count()===0,'previous sample label carried over');
    await set(p,'instrument','magnet');await set(p,'identity','iron');await action(p,'record');await action(p,'archive');
    assert((await read(p)).mailArtifacts.C01.bestStars===3,'C01 failed cross-check archive');
    checks.push('C01 independent identity tags, real two-method cross-check and new sample reset');
    await exit(p);await open(p,'M03');
    const box=await p.locator('.fv-scene').boundingBox();
    await p.mouse.move(box.x+96/640*box.width,box.y+312/360*box.height);await p.mouse.down();
    await p.mouse.move(box.x+288/640*box.width,box.y+168/360*box.height,{steps:8});await p.mouse.up();
    await p.waitForFunction(()=>document.querySelector('#fv-targetX').value==='4'&&document.querySelector('#fv-targetY').value==='3');
    await action(p,'record');
    await set(p,'origin',1);
    assert((await p.locator('.fv-readings').innerText()).includes('(5, 4)'),'origin change did not move the actual world point');
    await p.locator('[data-fv-handle=point]').focus();await p.keyboard.press('ArrowLeft');await p.keyboard.press('ArrowDown');
    await p.waitForFunction(()=>document.querySelector('#fv-targetY').value==='2');
    assert((await p.locator('.fv-readings').innerText()).includes('(4, 3)'),'keyboard did not restore target from new origin');
    await action(p,'record');await action(p,'advance');await set(p,'lineSlope',2);
    await p.screenshot({path:'output/browser-regressions/p4-chart-desktop.png'});
    await action(p,'record');await action(p,'archive');
    s=(await read(p)).researchRuns.M03;assert(s.bestStars===3&&s.records[1].quality.verified,'M03 representation check missing');
    assert(s.records.at(-1).measurement.residuals.every(q=>q.residual===0),'both residuals not archived');
    checks.push('M03 real origin rebasing, keyboard point control and per-point line substitution');
    await action(p,'deliver');await p.locator('.fv-delivery').waitFor();
    const delivery=JSON.stringify((await read(p)).mailDeliveries.R01);
    assert(delivery&&delivery!=='undefined','delivery was not committed before animation');
    await p.keyboard.press('Escape');await p.locator('.fv-receipt').waitFor();
    for(const id of ['P01','C01','M03']) {
      await p.locator('#fv-letter-source').selectOption(id);
      const raw=await read(p);assert(raw.mailLetters['00'].artifactId===id,'00 selection not saved');
      assert(raw.mailArtifacts[id].revisions.some(r=>r.ref===raw.mailLetters['00'].ref),'00 invented source');
    }
    await p.screenshot({path:'output/browser-regressions/p4-first-receipt.png'});
    await p.reload({waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();await p.locator('#mail-toggle').click();
    assert(await p.locator('[data-mail-chapter=R02][aria-pressed=true]').count()===1,'receipt refresh did not resume next commission');
    await p.locator('[data-mail-chapter=R01]').click();await p.locator('[data-mail-replay=R01]').click();
    await p.keyboard.press('Escape');await p.keyboard.press('Escape');
    assert(JSON.stringify((await read(p)).mailDeliveries.R01)===delivery,'skip/replay repeated delivery');
    checks.push('joint shipping saved before playback, skippable receipt, grounded 00 selection and replay/refresh idempotence');
    await p.locator('.modal-close').click();await open(p,'M03');
    assert((await p.locator('.fv-feedback').innerText()).length>0,'revisit lost result');
    await action(p,'supplement');await set(p,'origin',1);await set(p,'targetX',2);await set(p,'targetY',2);
    await p.reload({waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();await open(p,'M03');
    assert((await p.locator('#fv-targetX').inputValue())==='2','free draft did not survive refresh');
    assert((await read(p)).researchRuns.M03.returnCondition===1,'supplement lost main condition');
    await action(p,'return');assert((await read(p)).researchRuns.M03.activeCondition===1,'return lost main task');
    await p.setViewportSize({width:390,height:844});
    assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'390px document overflow');
    assert(await p.locator('#modal').evaluate(el=>el.scrollWidth<=el.clientWidth+1),'390px workbench overflow');
    await p.locator('#modal').evaluate(el=>el.scrollTop=0);await p.screenshot({path:'output/browser-regressions/p4-chart-mobile.png'});
    checks.push('revisit intro, supplement/return, free draft refresh and 390px layout');
    await exit(p);await p.setViewportSize({width:1440,height:960});
    for(const id of ['P01','C01','M03']) {
      await p.locator(`button[data-subject=${id[0]}]`).click();
      await p.locator(id[0]==='P'?'#physics-campaign-button':id[0]==='C'?'#chemistry-campaign-button':'#math-campaign-button').click();
      const selector=id[0]==='C'?`[data-chemistry-campaign-level=${id}]`:`[data-campaign-level=${id}]`;
      assert((await p.locator(selector+' .campaign-stars').getAttribute('aria-label')).includes('3'),`${id}: campaign lost current best`);
      await p.locator('.modal-close').click();
    }
    checks.push('all three island campaign lists show the same earned stars as the current research artifact');

    const penalty=await load(await context({reducedMotion:'reduce'}));await open(penalty,'P01');
    await action(penalty,'record');
    s=(await read(penalty)).researchRuns.P01;assert(s.failures===1&&s.resources.time===7&&s.resources.trust===1,'unsupported assertion not penalized');
    await set(penalty,'shape','bowl');await action(penalty,'record');await action(penalty,'advance');
    const total=JSON.stringify((await read(penalty)).researchRuns.P01.resources);
    assert((await penalty.locator('.fv-readings').innerText()).includes('进水下沉'),'new cargo did not visibly invalidate old bowl');
    assert(JSON.stringify((await read(penalty)).researchRuns.P01.resources)===total,'new-condition preview penalized');
    await set(penalty,'shape','wide');await action(penalty,'record');await action(penalty,'archive');
    assert((await read(penalty)).mailArtifacts.P01.bestStars===2,'ordinary success demanded optional research');
    await action(penalty,'supplement');await set(penalty,'shape','wide');await action(penalty,'record');await action(penalty,'return');await action(penalty,'archive');
    assert((await read(penalty)).mailArtifacts.P01.bestStars===3,'post-archive optional work did not improve quality');
    await penalty.locator('.fv-tools summary').click();await action(penalty,'restart');
    const history=await read(penalty);assert(Object.values(history.researchHistory).some(h=>h.id==='P01'),'restart discarded history');
    assert(history.mailArtifacts.P01.bestStars===3&&history.researchRuns.P01.records.length===0,'restart mixed attempts or lost best');
    checks.push('formal penalty, free changed-condition observation, later star revision, restart/history and reduced motion');

    const shared=await context(),a=await load(shared),b=await load(shared);
    await open(a,'P01');await open(b,'M03');await set(a,'shape','bowl');await action(a,'record');
    await set(b,'targetX',4);await set(b,'targetY',3);await action(b,'record');
    const combined=await read(a);
    assert(combined.researchRuns.P01.records.length===1&&combined.researchRuns.M03.records.length===1,'independent level writes lost data');
    assert(await a.locator('.fv-workbench').isVisible(),'unrelated level update closed current level');
    await exit(b);await open(b,'P01');await set(a,'shape','wide');await action(a,'record');
    await b.locator('#modal-backdrop').waitFor({state:'hidden'});
    assert((await read(b)).researchRuns.P01.records.length===2,'same-level page kept stale run');
    await b.locator('#journal-toggle').click();b.once('dialog',d=>d.accept());await b.locator('#clear-progress').click();
    await a.locator('#modal-backdrop').waitFor({state:'hidden'});
    assert(!Object.keys((await read(a)).researchRuns).length,'reset resurrected active research');
    checks.push('new attempts merge across independent tabs, same-level updates close safely and reset wins');

    const old=await load(await context());
    await old.evaluate(()=>{
      const raw=JSON.parse(localStorage.getItem('knowledge-islands-v2')||'{}');
      raw.physicsScenarios={P01:AtlasPhysicsScenarios.act(AtlasPhysicsScenarios.fresh('P01','assistant'),'experiment',{shape:'bowl'})};
      raw.physicsLevels={P01:{version:3,steps:[0,1],letterSent:true,bestStars:3}};
      localStorage.setItem('knowledge-islands-v2',JSON.stringify(raw));
    });
    await old.reload({waitUntil:'networkidle'});await old.locator('[data-flight=skip]').click();await old.locator('#mail-toggle').click();await old.locator('[data-mail-open=P01]').click();
    await old.locator('.px-blackout-screen').waitFor();await old.keyboard.press('Escape');
    assert(await old.locator('.fv-legacy-bridge').isVisible(),'old active attempt was not retained');
    const oldAttempt=JSON.stringify((await read(old)).physicsScenarios.P01);
    await old.locator('.fv-legacy-bridge button').click();await old.keyboard.press('Escape');
    assert((await old.locator('.fv-stars').getAttribute('aria-label')).includes('3'),'new replay lost old best');
    await action(old,'record');assert(JSON.stringify((await read(old)).physicsScenarios.P01)===oldAttempt,'new attempt rewrote old commands');
    assert((await read(old)).mailArtifacts.P01.bestStars===3,'failed new replay erased old achievement');
    checks.push('active legacy resume, explicit new edition bridge and preservation of old commands/map achievement/stars');
    assert(pageErrors.length===0,pageErrors.join('\n'));
    return {passed:true,checks,pageErrors};
  }catch(error){
    error.message+='\nCompleted: '+checks.join('; ')+'\nPage errors: '+pageErrors.join('; ');
    throw error;
  }finally{for(const c of contexts)await c.close();}
}
