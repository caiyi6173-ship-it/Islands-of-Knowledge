async(page) => {
  const base = new URL(page.url()).origin, browser = page.context().browser();
  const contexts=[],checks=[],pageErrors=[];
  const assert=(v,m)=>{if(!v)throw new Error(m);};
  const context=async()=>{
    const c=await browser.newContext({viewport:{width:1440,height:960}});contexts.push(c);
    await c.addInitScript(origin=>{if(location.origin===origin)sessionStorage.setItem('knowledge-islands-opening-v1','seen');},base);
    c.on('page',p=>p.on('pageerror',e=>pageErrors.push(e.message)));return c;
  };
  const load=async c=>{const p=await c.newPage();await p.goto(base+"/#map",{waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();return p;};
  const read=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('knowledge-islands-v2')));
  const mail=async p=>{await p.locator('#mail-toggle').click();await p.locator('.mail-manifest').waitFor();};
  const seed=async(p,ids)=>{
    await p.evaluate(ids=>{
      const raw=JSON.parse(localStorage.getItem('knowledge-islands-v2')||'{}');raw.expDone||={};
      ids.forEach(id=>raw.expDone['story-'+id]=true);localStorage.setItem('knowledge-islands-v2',JSON.stringify(raw));
    },ids);
  };
  const set=async(p,key,value)=>{
    const index=await p.evaluate(({key,value})=>{
      const id=document.querySelector('.event-modal').dataset.physicsTheme;
      const raw=JSON.parse(localStorage.getItem('knowledge-islands-v2'));
      const r=raw.physicsScenarios[id];
      return AtlasPhysicsScenarios.lab(id,r?.round||0).controls.find(c=>c.key===key).values.findIndex(([v])=>v===value);
    },{key,value});
    await p.locator(`[data-param=${key}][data-option="${index}"]`).click();
  };
  try{
    const p=await load(await context());await mail(p);
    assert(await p.locator('.mail-manifest [data-mail-open]').count()===6,'missing six tasks');
    assert(await p.locator('[data-mail-deliver=R01]').isDisabled(),'fresh delivery enabled');
    await p.locator('[data-mail-chapter=R05]').click();await p.locator('[data-mail-open=M10]').click();
    await p.locator('.fv-intro').waitFor();await p.keyboard.press('Escape');
    assert(await p.locator('.fv-workbench[data-level=M10]').isVisible(),'future level is gated');
    await p.locator('[data-fv-action=exit]').click();checks.push('fresh postal manifest and free access to future chapters');
    await mail(p);await p.locator('[data-mail-open=P01]').click();
    await p.locator('.fv-intro').waitFor();await p.keyboard.press('Escape');
    await p.locator('[data-fv-param=shape][data-value=bowl]').click();await p.locator('#fv-record').click();
    assert(!((await read(p)).mailArtifacts.P01),'one round manufactured an artifact');
    await p.locator('[data-fv-action=advance]').click();await p.locator('[data-fv-param=shape][data-value=wide]').click();
    await p.locator('#fv-record').click();await p.locator('[data-fv-action=archive]').click();
    const saved=await read(p);assert(saved.mailArtifacts.P01?.complete,'real completion was not archived');
    assert(saved.mailArtifacts.P01.revisions[0].records.length===2,'missing actual source records');
    assert(saved.researchRuns.P01.runId,'missing attempt identity');
    assert(!saved.mailDeliveries.R01,'local success sent the whole cargo');
    await p.locator('[data-fv-action=exit]').click();await mail(p);
    assert(await p.locator('[data-mail-deliver=R01]').isDisabled(),'one artifact enabled delivery');
    await p.locator('.mail-item.is-ready .mail-evidence>summary').click();
    assert((await p.locator('.mail-record').allTextContents()).join(' ').includes('6.0 kg'),'archived readings cannot be reviewed');
    checks.push('actual Physics completion archives evidence without premature chapter delivery');
    await p.locator('.modal-close').click();await seed(p,['C01','M03']);await p.reload({waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();await mail(p);
    assert(await p.locator('[data-mail-deliver=R01]').isEnabled(),'legacy completion needs replay');
    const legacy=await read(p);
    assert(legacy.mailArtifacts.C01.revisions[0].records.length===0,'invented legacy measurements');
    await p.locator('[data-mail-deliver=R01]').click();
    await p.locator('.fv-delivery').waitFor();await p.keyboard.press('Escape');await p.keyboard.press('Escape');
    await p.locator('[data-mail-chapter=R01]').click();
    assert(await p.locator('.mail-receipt').isVisible(),'missing first receipt');
    const receipt=JSON.stringify((await read(p)).mailDeliveries.R01);
    await p.reload({waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();await mail(p);
    assert(await p.locator('[data-mail-chapter=R02][aria-pressed=true]').count()===1,'current chapter not restored');
    await p.locator('[data-mail-chapter=R01]').click();
    assert(JSON.stringify((await read(p)).mailDeliveries.R01)===receipt,'receipt changed on replay');
    assert(await p.locator('[data-mail-deliver=R01]').count()===0,'replay pays delivery again');
    await p.screenshot({path:'output/browser-regressions/p3-receipt-desktop.png'});
    checks.push('legacy completion, one-time delivery, receipt replay and refresh');
    // A second live page uses the same real storage pipeline.
    const other=await load(p.context());await mail(other);
    await seed(other,['P06','C10','M08']);await other.reload({waitUntil:'networkidle'});await other.locator('[data-flight=skip]').click();await mail(other);
    await p.locator('[data-mail-chapter=R02]').click();
    await p.locator('[data-mail-deliver=R02]').waitFor();
    await p.waitForFunction(()=>!document.querySelector('[data-mail-deliver=R02]')?.disabled);
    await other.locator('[data-mail-deliver=R02]').click();
    await p.bringToFront();
    await p.locator('.mail-receipt').waitFor();
    assert(Object.keys((await read(p)).mailDeliveries).length===2,'cross-tab duplicate or lost delivery');
    checks.push('live postal panel follows other-page evidence and delivery');
    await other.close();await p.locator('.modal-close').click();
    await seed(p,['P07','M06','C04','P03','M05','C06','P10','M10','C08']);
    await p.reload({waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();await mail(p);
    for(const id of ['R03','R04','R05']){await p.locator(`[data-mail-chapter=${id}]`).click();await p.locator(`[data-mail-deliver=${id}]`).click();if(['R03','R04','R05'].includes(id)){await p.keyboard.press('Escape');await p.keyboard.press('Escape');}}
    await p.locator('[data-post-action=manifest]').click();
    const ended=await read(p);
    assert(ended.mailFacts.formalDesk&&Object.keys(ended.mailArtifacts).length===15,'ending requires side quests or lost desk');
    assert(await p.locator('#modal-title').innerText()==='信袋回来了，桌角留给下一位','ending did not close loop');
    checks.push('fifteen precompleted main tasks deliver five chapters without stars or side quests');
    await p.setViewportSize({width:390,height:844});
    await p.waitForFunction(()=>{
      const a=document.querySelector('[data-mail-chapter=R05]').getBoundingClientRect();
      const b=document.querySelector('.mail-chapters').getBoundingClientRect();
      return a.left>=b.left&&a.right<=b.right;
    });
    assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile page overflow');
    assert(await p.locator('[data-mail-chapter=R05]').isVisible(),'mobile navigation inaccessible');
    await p.waitForFunction(()=>!document.querySelector('#toast').classList.contains('show'));
    await p.screenshot({path:'output/browser-regressions/p3-postal-mobile.png'});
    await p.keyboard.press('Escape');await p.locator('#mail-toggle').focus();await p.keyboard.press('Enter');
    assert(await p.locator('.mail-manifest').isVisible(),'keyboard entry failed');
    checks.push('390px postal layout, Escape and keyboard entry');
    await p.locator('.modal-close').click();await p.locator('#journal-toggle').click();
    p.once('dialog',dialog=>dialog.accept());await p.locator('#clear-progress').click();await mail(p);
    assert(Object.keys((await read(p)).mailArtifacts).length===0,'reset resurrected postal artifacts');
    assert(await p.locator('[data-mail-deliver=R01]').isDisabled(),'reset kept delivery ready');
    checks.push('explicit reset clears postal facts and artifacts');
    const old=await load(await context());
    await old.evaluate(()=>{
      const raw=JSON.parse(localStorage.getItem('knowledge-islands-v2')||'{}');
      raw.physicsLevels={P01:{version:3,steps:[0,1],letterSent:true,bestStars:3}};
      localStorage.setItem('knowledge-islands-v2',JSON.stringify(raw));
    });
    await old.reload({waitUntil:'networkidle'});await old.locator('[data-flight=skip]').click();await mail(old);
    assert((await read(old)).mailArtifacts.P01.bestStars===3,'old model score was lost');
    await old.locator('[data-mail-open=P01]').click();
    await old.locator('.fv-intro').waitFor();await old.keyboard.press('Escape');
    assert(await old.locator('[data-node=P01].level-cleared').count()===1,'old completion lost map recognition');
    assert((await old.locator('.fv-stars').getAttribute('aria-label')).includes('3'),'old best score not carried into replay');
    const oldArtifact=JSON.stringify((await read(old)).mailArtifacts.P01);
    await old.locator('#fv-record').click();
    assert(JSON.stringify((await read(old)).mailArtifacts.P01)===oldArtifact,'failed replay overwrote the old artifact');
    assert(!(await old.locator('#toast').innerText()).includes('新发现'),'failed legacy replay announced a new discovery');
    checks.push('earlier completion keeps map color, evidence and stars through a failed replay');
    const alt=await load(await context());await alt.goto(base+'/'+encodeURIComponent('学科脉络地图.html')+'#map',{waitUntil:'networkidle'});await alt.locator('[data-flight=skip]').click();await mail(alt);
    assert(await alt.locator('.mail-manifest').isVisible(),'alternate HTML entry broken');
    checks.push('both production HTML entries load postal modules');
    assert(pageErrors.length===0,pageErrors.join('\n'));
    return {passed:true,checks,pageErrors};
  }catch(error){const debug=[];for(const c of contexts)for(const p of c.pages())debug.push(await p.evaluate(()=>({title:document.querySelector('#modal-title')?.textContent,hidden:document.querySelector('#modal-backdrop').hidden,mail:document.querySelector('#mail-count')?.textContent,toast:document.querySelector('#toast')?.textContent,chapter:document.querySelector('[data-mail-chapter][aria-pressed=true]')?.dataset.mailChapter,deliveries:JSON.parse(localStorage.getItem('knowledge-islands-v2'))?.mailDeliveries})));return {passed:false,error:error.stack,checks,pageErrors,debug};}finally{for(const c of contexts)await c.close();}
}
