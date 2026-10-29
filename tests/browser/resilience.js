async(page)=>{
  const base=new URL(page.url()).origin,browser=page.context().browser(),contexts=[],checks=[],pageErrors=[];
  const assert=(ok,message)=>{if(!ok)throw new Error(message);};
  async function load(options={}){
    const c=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});contexts.push(c);
    c.on('page',p=>p.on('pageerror',e=>pageErrors.push(e.stack||e.message)));
    await c.addInitScript(({origin,mode})=>{
      if(location.origin!==origin)return;
      const get=Storage.prototype.getItem,set=Storage.prototype.setItem;
      window.__blockProgressWrites=mode==='denied';
      Storage.prototype.getItem=function(key){if(key==='knowledge-islands-v2'&&mode==='denied')throw new DOMException('Unavailable','SecurityError');return get.call(this,key);};
      Storage.prototype.setItem=function(key,value){if(key==='knowledge-islands-v2'&&window.__blockProgressWrites)throw new DOMException('Full','QuotaExceededError');return set.call(this,key,value);};
      if(mode==='corrupt'&&!get.call(sessionStorage,'seeded-corrupt')){set.call(localStorage,'knowledge-islands-v2','{unfinished-record');set.call(sessionStorage,'seeded-corrupt','yes');}
    },{origin:base,mode:options.mode});
    const p=await c.newPage();await p.goto(base+"/#map",{waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();return p;
  }
  const act=(p,a)=>p.locator(`[data-fv-action=${a}]`).click();
  async function open(p,id){
    const task=await p.evaluate(id=>AtlasWorldlineData.tasks[id],id);await p.locator('#mail-toggle').click();await p.locator(`[data-mail-chapter=${task.chapter}]`).click();if(task.kind==='side')await p.locator('.mail-optional>summary').click();await p.locator(`[data-mail-open=${id}]`).click();await p.locator('.fv-intro').waitFor();await p.keyboard.press('Escape');
  }
  async function shape(p,value){await p.locator(`[data-fv-param=shape][data-value=${value}]`).click();await p.waitForFunction(value=>document.querySelector(`[data-fv-param=shape][data-value=${value}]`)?.getAttribute('aria-pressed')==='true',value);}
  try{
    const quota=await load();await quota.evaluate(()=>{const s=JSON.parse(localStorage.getItem('knowledge-islands-v2')||'{}');s.expDone={'story-M02':true};for(const c of AtlasWorldlineData.chapters)for(const id of c.main)s.expDone['story-'+id]=true;localStorage.setItem('knowledge-islands-v2',JSON.stringify(s));});await quota.reload({waitUntil:'networkidle'});await quota.locator('[data-flight=skip]').click();
    const original=await quota.evaluate(()=>localStorage.getItem('knowledge-islands-v2'));await quota.evaluate(()=>window.__blockProgressWrites=true);await quota.locator('#mail-toggle').click();await quota.locator('[data-mail-deliver=R01]').click();
    assert(await quota.locator('.fv-delivery').isVisible(),'write failure trapped the delivery before its first scene');
    assert(await quota.locator('#save-status').isVisible(),'storage loss is only a disappearing toast');
    assert((await quota.locator('#save-status').innerText()).includes('本次会话'),'storage loss falsely appears persistent');
    assert((await quota.locator('.fv-delivery-nav').innerText()).includes('本次会话'),'delivery still claims it was saved');
    await quota.keyboard.press('Escape');await quota.keyboard.press('Escape');
    for(const id of ['R02','R03','R04','R05']){await quota.locator(`[data-mail-deliver=${id}]`).click();await quota.locator('.fv-delivery').waitFor();await quota.keyboard.press('Escape');await quota.keyboard.press('Escape');}
    await quota.locator('.postal-room[data-phase="5"]').waitFor();
    assert(await quota.evaluate(()=>localStorage.getItem('knowledge-islands-v2'))===original,'session-only play overwrote previous disk save');
    await quota.screenshot({path:'output/browser-regressions/p12-session-ending.png'});
    await quota.locator('[data-post-action=close]').click();await quota.locator('#mail-toggle').click();await quota.locator('[data-mail-chapter=R01]').click();await quota.locator('.mail-optional>summary').click();await quota.locator('[data-mail-appendix=M02]').click();await quota.locator('.ap-receipt-modal').waitFor();await quota.locator('[data-ap-post]').click();
    await quota.evaluate(()=>window.__blockProgressWrites=false);await quota.locator('[data-post-action=close]').click();await quota.locator('#postal-office-toggle').click();
    await quota.locator('#save-status').waitFor({state:'hidden'});assert(await quota.evaluate(()=>JSON.parse(localStorage.getItem('knowledge-islands-v2')).mailFacts.formalDesk),'recovered storage did not persist current session');
    checks.push('quota failure keeps five deliveries and appendix postage playable in clearly marked session mode; prior disk save is untouched and recovery persists the current session');

    const denied=await load({mode:'denied'});await open(denied,'P01');await shape(denied,'bowl');await act(denied,'record');await act(denied,'advance');await shape(denied,'wide');await act(denied,'record');await act(denied,'archive');
    await denied.evaluate(()=>{window.__saveAnnouncements=0;new MutationObserver(mutations=>window.__saveAnnouncements+=mutations.filter(m=>m.type==='childList').length).observe(document.querySelector('#save-status'),{childList:true});});
    await shape(denied,'bowl');await shape(denied,'wide');await denied.waitForTimeout(350);assert(await denied.evaluate(()=>window.__saveAnnouncements)===0,'free changes repeatedly announced the same storage warning');
    assert((await denied.locator('.fv-summary-slot').innerText()).includes('已夹入货单'),'blocked storage prevented ordinary research');assert(await denied.locator('#save-status').isVisible(),'blocked reads have no persistent notice');assert(await denied.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'session notice caused mobile overflow');
    await denied.setViewportSize({width:320,height:780});await denied.locator('#modal').evaluate(el=>el.scrollTop=0);
    assert(await denied.evaluate(()=>document.querySelector('#save-status').getBoundingClientRect().bottom<=document.querySelector('#modal').getBoundingClientRect().top),'session notice covers the narrow-screen controls');
    await denied.screenshot({path:'output/browser-regressions/p12-storage-denied.png'});
    checks.push('denied localStorage still permits free manipulation, formal recording and local archive, with a persistent mobile-safe notice');

    const corrupt=await load({mode:'corrupt'});await open(corrupt,'P01');await shape(corrupt,'bowl');await act(corrupt,'record');assert(await corrupt.evaluate(()=>localStorage.getItem('knowledge-islands-v2'))==='{unfinished-record','automatic save overwrote corrupt input');await act(corrupt,'exit');await corrupt.locator('#journal-toggle').click();
    corrupt.once('dialog',d=>d.dismiss());await corrupt.locator('#clear-progress').click();assert(await corrupt.evaluate(()=>localStorage.getItem('knowledge-islands-v2'))==='{unfinished-record','cancelled repair changed original');
    corrupt.once('dialog',d=>d.accept());await corrupt.locator('#clear-progress').click();await corrupt.locator('#modal-backdrop').waitFor({state:'hidden'});
    const repaired=await corrupt.evaluate(()=>JSON.parse(localStorage.getItem('knowledge-islands-v2')));assert(!Object.keys(repaired.researchRuns).length,'explicit reset did not repair corrupt data');assert(await corrupt.evaluate(()=>localStorage.getItem('knowledge-islands-v2-unreadable'))==='{unfinished-record','repair discarded raw recovery copy');
    await corrupt.locator('#save-status').waitFor({state:'hidden'});await corrupt.reload({waitUntil:'networkidle'});await corrupt.locator('[data-flight=skip]').click();assert((await corrupt.locator('#quest-title').innerText()).includes('四箱'),'repaired save does not reload');
    checks.push('malformed saved JSON remains untouched during play and cancelled reset; confirmed reset preserves one raw recovery copy and writes a reloadable fresh save');
    assert(!pageErrors.length,pageErrors.join('\n'));return {passed:true,checks,pageErrors};
  }catch(error){return {passed:false,error:error.stack,checks,pageErrors};}finally{for(const c of contexts)await c.close();}
}
