async(page)=>{
  const base=new URL(page.url()).origin,browser=page.context().browser(),contexts=[],checks=[],pageErrors=[];
  const assert=(ok,message)=>{if(!ok)throw new Error(message);};
  async function load(options={}){
    const c=await browser.newContext({viewport:{width:1440,height:1000},...options});contexts.push(c);
    c.on('page',p=>p.on('pageerror',e=>pageErrors.push(e.stack||e.message)));
    const p=await c.newPage();await p.goto(base+"/#map",{waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();return p;
  }
  async function open(p,id){
    const task=await p.evaluate(id=>AtlasWorldlineData.tasks[id],id);
    await p.locator('#mail-toggle').click();await p.locator(`[data-mail-chapter=${task.chapter}]`).click();
    if(task.kind==='side')await p.locator('.mail-optional>summary').click();
    await p.locator(`[data-mail-open=${id}]`).click();await p.locator(`.fv-workbench[data-level=${id}]`).waitFor();
  }
  const act=(p,a)=>p.locator(`[data-fv-action=${a}]`).click();
  const read=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('knowledge-islands-v2')));
  async function enterTheatre(p){
    const text=p.locator('.px-blackout-screen .px-prologue-box');
    await text.click();if(await p.locator('.px-blackout-screen:not(.px-prologue-exit)').count())await text.click();
    await p.locator('.px-act-person').waitFor();
    await p.locator('.px-blackout-screen').waitFor({state:'detached'});
  }
  async function audit(p,id,c){
    const errors=await p.evaluate(({id,c})=>{
      const host=document.querySelector('.fv-workbench'),guide=host.querySelector('.ro-guide'),errors=[];
      if(guide.dataset.condition!==String(c))errors.push('wrong condition guide');
      for(const s of AtlasResearchOnboarding.guides[id].lessons[c])if(![...host.querySelectorAll(s.target)].some(el=>el.getClientRects().length))errors.push('missing visible action: '+s.target);
      if(host.querySelectorAll('.ro-target').length!==1)errors.push('guide must highlight exactly one control group');
      if(!guide.textContent.includes(AtlasResearchOnboarding.operationNotes[id] instanceof Array?AtlasResearchOnboarding.operationNotes[id][c]:AtlasResearchOnboarding.operationNotes[id]))errors.push('running behavior is not explained');
      const modal=document.querySelector('#modal');if(modal.scrollWidth>modal.clientWidth+1)errors.push('horizontal overflow');
      if(!host.contains(document.activeElement)||!document.activeElement.getClientRects().length)errors.push('skip lost visible focus');
      return errors;
    },{id,c});assert(!errors.length,id+' / '+c+': '+errors.join(', '));
  }
  try{
    const p=await load(),ids=await p.evaluate(()=>Object.keys(AtlasWorldlineData.tasks));
    for(const id of ids){
      await open(p,id);assert(await p.locator('.fv-intro .px-blackout-screen').count()===1,'original opening missing '+id);
      const runBefore=JSON.stringify((await read(p)).researchRuns[id]);
      assert(await p.locator('.fv-workbench').evaluate(el=>el.inert),'opening permits accidental experiment input '+id);
      assert(await p.locator('.fv-condition').isHidden(),'text wall still before entrance '+id);
      assert(await p.locator('.ro-arriving-raven,.ro-scene-overlay').count()===0,'rejected replacement entrance remains '+id);
      await enterTheatre(p);assert(await p.locator('.px-person-frame .px-portrait').count()===1,'original scientist portrait absent '+id);
      if(id==='P01')await p.screenshot({path:'output/browser-regressions/original-intro-person.png'});
      await p.locator('.px-step-pill[data-step="2"]').click();assert(await p.locator('.px-story-scene-wrapper svg').count()>0,'original subject scene absent '+id);
      if(['P01','M03','C01'].includes(id)){await p.waitForTimeout(500);await p.screenshot({path:`output/browser-regressions/original-intro-story-${id}.png`});}
      if(id==='P01')assert(await p.locator('.px-story-scene-wrapper').evaluate(el=>el.getAnimations({subtree:true}).some(a=>a.playState==='running')),'original pixel scene has no running animation');
      await p.locator('.px-step-pill[data-step="3"]').click();
      const goals=await p.evaluate(id=>[AtlasFirstVoyageModels,AtlasNightwatchModels,AtlasRevisionModels,AtlasAtlasModels,AtlasReturnModels,AtlasAppendixModels].find(m=>m.definitions[id]).definitions[id].goals,id);
      const mission=await p.locator('.px-act-mission').innerText();assert(goals.every(g=>mission.includes(g)),'cutscene advertises obsolete controls '+id);
      assert(JSON.stringify((await read(p)).researchRuns[id])===runBefore,'entrance created measurements or spent resources '+id);
      await p.keyboard.press('Escape');assert(await p.locator('.fv-intro').isHidden(),'Escape did not skip only entrance');await audit(p,id,0);
      await act(p,'exit');
    }
    checks.push('all thirty original history prologues, scientist portraits and animated story scenes restored; task cards match current goals and experiments remain inert');

    // Prepare legitimate first-condition records only in this isolated test context.
    // These fixtures test all second-page guide targets; campaign.js tests the full native gameplay.
    await p.evaluate(()=>{
      const ramp=[...Array.from({length:21},(_,i)=>({t:i*50,value:-2+1.5*i/20})),...Array.from({length:7},(_,i)=>({t:1050+i*50,value:-.5}))];
      const op=(kind,amount)=>({kind,amount,side:'both'}),proofs=AtlasAppendixMath.proofs;
      const params={P01:{shape:'bowl'},C01:{instrument:'density',identity:'salt'},M03:{targetX:4,targetY:3},P06:{trace:ramp},C10:{wire:'on',bridge:'on',checks:[{wire:'on',bridge:'off'},{wire:'off',bridge:'on'},{wire:'on',bridge:'on'}]},M08:{angle:126.87},P07:{tuning:3,pulses:[200,200,200]},M06:{order:['R','T']},C04:{placements:['bond']},P03:{speed:10},M05:{a:-.1,h:6,k:4.1},C06:{shape:'tetra',angleLabel:109.5},P10:{frequency:7,flux:5,trials:[{frequency:4.5,flux:1},{frequency:4.5,flux:5},{frequency:7,flux:5}]},M10:{a:.05,b:-1.2,c:15},C08:{lid:'open',gas:8,views:[{lid:'open',gas:8},{lid:'closed',gas:8}]},P02:{bells:[1,4,9]},P04:{coupled:'yes',retained:117.6},P05:{slits:'two',distance:.6},P08:{subtract:'yes',scope:'anomaly'},P09:{model:'planck',scope:'all'},M01:{length:2/3},M02:{ops:[op('x',1),op('number',3)]},M04:{links:[[1,3],[3,7],[5,11]]},M07:{a:3,b:4,c:5,proof:proofs.triangle},M09:{dt:.5,proof:proofs.limit},C05:{a:2,b:1,copies:1},C09:{lost:2,gained:2},C03:{slots:[1,1,2,2,0]},C07:{p:1,angle:180},C02:{carbon:1,oxygen:1,ratioClaim:1.33}};
      let progress=JSON.parse(localStorage.getItem('knowledge-islands-v2'));
      for(const [id,p] of Object.entries(params)){
        const model=[AtlasFirstVoyageModels,AtlasNightwatchModels,AtlasRevisionModels,AtlasAtlasModels,AtlasReturnModels,AtlasAppendixModels].find(m=>m.definitions[id]),api=model.createSession(id);
        for(const [type,extra] of [['record',{params:p}],['advance',{}]]){
          const run=progress.researchRuns[id],result=AtlasWorldline.commitResearch(progress,id,api,{id:AtlasResearchSession.token(),runId:run.runId,expectedSequence:run.events.length,type,...extra});
          if(!result.changed)throw new Error(id+' fixture '+type+': '+result.reason);progress=result.progress;
        }
      }
      localStorage.setItem('knowledge-islands-v2',JSON.stringify(progress));
    });
    await p.reload({waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();
    for(const id of ids){await open(p,id);await p.keyboard.press('Escape');await audit(p,id,1);await act(p,'exit');}
    checks.push('all thirty changed-condition pages have visible matching guide targets, with legal fixture preparation separate from native campaign verification');

    const fresh=await load();await open(fresh,'P01');
    await enterTheatre(fresh);await fresh.waitForFunction(()=>document.querySelector('.px-step-pill.active')?.dataset.step==='2');
    await fresh.locator('[data-action=toggle-pause]').click();assert(await fresh.locator('.px-intro-paused').count()===1,'original autoplay pause missing');
    await fresh.locator('.px-step-pill[data-step="3"]').click();await fresh.locator('.px-intro-btn-start').click();
    assert(await fresh.locator('[data-fv-param=shape]').first().evaluate(el=>el===document.activeElement),'original mission did not transfer focus to real controls');
    const resources=JSON.stringify((await read(fresh)).researchRuns.P01.resources);
    await fresh.evaluate(()=>window.__entranceStage=document.querySelector('.fv-scene'));
    await fresh.locator('[data-fv-param=shape][data-value=bowl]').click();await fresh.waitForFunction(()=>document.querySelector('.ro-guide').dataset.phase==='observe');
    await fresh.locator('[data-ro-action=next-hint]').click();assert(await fresh.locator('#fv-record').evaluate(el=>el===document.activeElement),'guide did not take player to explicit recording action');
    assert(JSON.stringify((await read(fresh)).researchRuns.P01.resources)===resources,'guide or exploration charged resources');
    await act(fresh,'record');assert(await fresh.locator('.ro-guide').getAttribute('data-phase')==='advance','supported record lacks next-condition cue');
    await act(fresh,'advance');assert(await fresh.locator('.ro-guide').getAttribute('data-condition')==='1','new goal did not replace guide');
    await fresh.locator('[data-fv-param=shape][data-value=wide]').click();await act(fresh,'record');
    assert(await fresh.locator('.ro-guide').getAttribute('data-phase')==='archive','second supported page lacks archive cue');
    await act(fresh,'archive');assert(await fresh.locator('.ro-guide').getAttribute('data-phase')==='posted','archived guide points to absent archive button');
    assert(await fresh.evaluate(()=>window.__entranceStage===document.querySelector('.fv-scene')),'entrance or tutorial replaced the experiment stage');
    checks.push('native first-ship actions advance guide through observe, explicit record, new condition, archive and manifest without charging guidance or replacing the stage');

    const saved=JSON.stringify((await read(fresh)).researchRuns.P01);await fresh.locator('.fv-tools summary').click();await act(fresh,'replay-intro');assert(await fresh.locator('.fv-intro').isVisible(),'replay absent');
    await fresh.keyboard.press('Escape');assert(JSON.stringify((await read(fresh)).researchRuns.P01)===saved,'replay changed history');
    await fresh.locator('[data-ro-action=collapse]').click();assert(await fresh.locator('.ro-guide-body').isHidden(),'guide cannot collapse');
    assert(await fresh.locator('[data-ro-action=collapse]').evaluate(el=>el===document.activeElement),'collapse dropped keyboard focus');
    await act(fresh,'hint');assert(await fresh.locator('.ro-guide-body').isVisible(),'free help did not restore guide');
    await act(fresh,'exit');await open(fresh,'P01');assert(await fresh.locator('.fv-intro').isVisible(),'re-entry did not replay entrance');await fresh.keyboard.press('Escape');await act(fresh,'exit');
    checks.push('entrance replays on every visit and on request; collapse preserves focus, free help restores instructions, all retained records stay unchanged');

    const error=await load();await open(error,'P01');await error.keyboard.press('Escape');await act(error,'record');
    assert((await read(error)).researchRuns.P01.failures===1,'formal error was waived by tutorial');assert(await error.locator('.ro-guide').getAttribute('data-phase')==='operate','early formal error skipped the first operation instruction');
    const afterFailure=JSON.stringify((await read(error)).researchRuns.P01.resources);await error.locator('[data-fv-param=shape][data-value=bowl]').click();await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.phase==='observe');
    assert(JSON.stringify((await read(error)).researchRuns.P01.resources)===afterFailure,'retry guidance charged extra');await act(error,'exit');
    checks.push('formal errors retain their real penalty and return the player to free manipulation guidance');

    const mobile=await load({viewport:{width:320,height:780},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    for(const id of ids){
      await open(mobile,id);assert(await mobile.locator('.px-intro-paused').count()===1,'reduced motion permits automatic playback');
      assert(await mobile.locator('.px-typed-text').innerText(),'reduced motion has no complete prologue');
      const visible=await mobile.locator('.px-blackout-screen [data-action=skip]').evaluate(el=>{const b=el.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;});
      assert(visible,'320px start action below viewport '+id);
      if(['P01','M03','C01'].includes(id)){
        await enterTheatre(mobile);await mobile.locator('.px-step-pill[data-step="2"]').click();
        const overflow=await mobile.locator('.fv-intro').evaluate(el=>el.scrollWidth>el.clientWidth+1);assert(!overflow,'original theatre horizontal overflow '+id);
        await mobile.screenshot({path:`output/browser-regressions/original-intro-mobile-${id}.png`});
      }
      await mobile.keyboard.press('Escape');await audit(mobile,id,0);
      if(id==='C01')await mobile.screenshot({path:'output/browser-regressions/p12-guide-mobile.png'});
      await act(mobile,'exit');
    }
    checks.push('all thirty original prologues remain skippable at 320px; reduced motion fills the text, pauses autoplay and preserves three-subject theatre layouts');

    await open(error,'P06');await error.keyboard.press('Escape');const beforeTrace=JSON.stringify((await read(error)).researchRuns.P06.resources);
    await error.locator('[data-nw-drive="1"]').focus();await error.keyboard.down('Space');await error.waitForTimeout(850);assert(await error.locator('.ro-guide').getAttribute('data-phase')==='operate','held input advanced the guide before release');await error.keyboard.up('Space');await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.phase==='observe');
    assert(await error.locator('.ro-guide').getAttribute('data-phase')==='observe','native continuous input not recognized by guide');
    assert(JSON.stringify((await read(error)).researchRuns.P06.resources)===beforeTrace,'continuous input guidance charged');await act(error,'exit');
    await open(error,'P07');await error.keyboard.press('Escape');await error.locator('#fv-tuning').focus();await error.keyboard.press('ArrowRight');await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.step==='1');
    await error.locator('[data-cr-action=key]').focus();
    for(let i=0;i<3;i++){await error.keyboard.down('Space');await error.waitForTimeout(200);await error.keyboard.up('Space');if(!i)assert(await error.locator('.ro-guide').getAttribute('data-step')==='1','one pulse prematurely completed three-pulse instruction');}
    await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.phase==='observe');
    await error.screenshot({path:'output/browser-regressions/p12-guide-telegraph.png'});await act(error,'exit');
    checks.push('held induction and native telegraph key inputs progress their specific guidance without synthetic measurements or paid commands');

    await open(error,'P10');await error.keyboard.press('Escape');const previewBudget=JSON.stringify((await read(error)).researchRuns.P10.resources);
    const set=async(key,value)=>{await error.locator(`[data-fv-input=${key}]`).evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));},value);await error.waitForFunction(({key,value})=>document.querySelector(`[data-fv-input=${key}]`).nextElementSibling.textContent===String(value),{key,value});};
    await set('flux',1);assert(await error.locator('.ro-guide').getAttribute('data-step')==='0','moving slider was mistaken for captured preview');
    await error.locator('[data-rt-action=capture]').click();await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.step==='1');
    await set('flux',5);await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.step==='2');assert(await error.locator('.ro-guide').getAttribute('data-phase')==='operate','uncaptured comparison reached observation');
    await error.locator('[data-rt-action=capture]').click();await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.step==='3');
    await set('frequency',7);await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.step==='4');await error.locator('[data-rt-action=capture]').click();await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.phase==='observe');
    assert(JSON.stringify((await read(error)).researchRuns.P10.resources)===previewBudget,'preview pack guide spent resources');await act(error,'exit');
    await open(error,'C08');await error.keyboard.press('Escape');await error.locator('[data-rt-action=capture]').click();
    await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.step==='1');
    await error.locator('[data-fv-param=lid][data-value=closed]').click();await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.step==='2');assert(await error.locator('.ro-guide').getAttribute('data-phase')==='operate','container toggle was mistaken for second saved preview');
    await error.locator('[data-rt-action=capture]').click();await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.step==='3');await act(error,'exit');
    checks.push('photon and mass-account instructions wait for actual multi-preview captures instead of treating a single slider or lid change as a completed comparison');

    await open(error,'M03');await error.keyboard.press('Escape');
    await error.locator('[data-fv-param=origin][data-value="0"]').click();await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.step==='1');
    const slider=await error.locator('#fv-targetX').boundingBox();
    await error.mouse.move(slider.x+slider.width*.25,slider.y+slider.height/2);await error.mouse.down();await error.mouse.move(slider.x+slider.width*.65,slider.y+slider.height/2,{steps:5});await error.waitForTimeout(400);
    assert(await error.locator('.ro-guide').getAttribute('data-step')==='1','drag advanced guide while pointer was still held');
    await error.mouse.up();await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.phase==='observe');
    const preserved=await read(error),draft=JSON.stringify(preserved.researchDrafts.M03),runSaved=JSON.stringify(preserved.researchRuns.M03);
    await error.evaluate(()=>window.__guideStage=document.querySelector('.fv-scene'));
    await error.locator('[data-ro-action=help]').click();await error.locator('[data-ro-action=demo]').click();assert(await error.locator('.ro-demo').count()===1,'operation demonstration absent');
    const overControl=await error.locator('.ro-demo').evaluate(el=>{const a=el.getBoundingClientRect(),b=document.querySelector('#fv-targetX').closest('label').getBoundingClientRect();return a.top>=b.top-10&&a.top<=b.bottom+10;});assert(overControl,'observation help demonstrates a reading instead of a real control');
    await error.waitForTimeout(2600);assert(await error.locator('.ro-demo').count()===0,'demonstration did not clean up');
    assert(JSON.stringify((await read(error)).researchRuns.M03)===runSaved&&JSON.stringify((await read(error)).researchDrafts.M03)===draft,'demonstration created evidence, spent resources or changed the experiment');
    assert(await error.evaluate(()=>window.__guideStage===document.querySelector('.fv-scene')),'demonstration replaced experiment stage');
    await error.screenshot({path:'output/playwright/contextual-guide-desktop.png'});
    await act(error,'exit');await open(error,'M03');await error.keyboard.press('Escape');assert(await error.locator('.ro-guide').getAttribute('data-phase')==='observe','return visit repeated completed instructions');
    await error.locator('[data-ro-action=help]').click();await error.locator('[data-ro-action=restart]').click();assert(await error.locator('.ro-guide').getAttribute('data-step')==='0','guided replay did not restart instructions');
    assert(JSON.stringify((await read(error)).researchRuns.M03)===runSaved&&JSON.stringify((await read(error)).researchDrafts.M03)===draft,'guided replay erased actual work');await act(error,'exit');
    checks.push('actual slider drags wait for release; optional demonstrations are temporary and leave draft, evidence, resources and stage intact; return visits remember guidance and allow a free replay');

    await open(error,'C10');await error.keyboard.press('Escape');const circuitBudget=JSON.stringify((await read(error)).researchRuns.C10.resources);
    await error.locator('[data-fv-param=wire]').click();await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.step==='1');
    await error.locator('[data-fv-param=bridge]').click();await error.waitForTimeout(250);assert(await error.locator('.ro-guide').getAttribute('data-step')==='1','one circuit state completed three-state comparison');
    await error.locator('[data-fv-param=wire]').click();await error.waitForFunction(()=>document.querySelector('.ro-guide').dataset.phase==='observe');
    assert(JSON.stringify((await read(error)).researchRuns.C10.resources)===circuitBudget,'circuit guidance charged resources');await act(error,'exit');
    checks.push('circuit guide teaches both switches and waits for all three real connection comparisons');

    await open(mobile,'M03');await mobile.keyboard.press('Escape');await mobile.locator('[data-ro-action=help]').click();await mobile.locator('[data-ro-action=demo]').click();
    const reduced=await mobile.locator('.ro-demo').evaluate(el=>getComputedStyle(el).animationName==='none'&&getComputedStyle(el.querySelector('.ro-demo-ring')).animationName==='none');assert(reduced,'operation demonstration ignores reduced motion');
    const fits=await mobile.locator('.ro-guide').evaluate(el=>el.scrollWidth<=el.clientWidth+1);assert(fits,'mobile guidance overflows');await mobile.screenshot({path:'output/playwright/contextual-guide-mobile.png'});await act(mobile,'exit');
    assert(await mobile.locator('.ro-demo').count()===0,'guide demonstration survived exit');
    checks.push('320px help, static reduced-motion demonstrations and exit cleanup work without a blocking overlay');

    await open(error,'P02');await error.keyboard.press('Escape');const quiet=JSON.stringify((await read(error)).researchRuns.P02);
    await error.waitForTimeout(20200);assert(await error.locator('.ro-stall').isVisible(),'idle player was not offered gentle help');
    assert(await error.locator('.ro-help').isHidden(),'idle hint forced open a help panel');
    assert(await error.locator('[data-ap-bell="0"]').evaluate(el=>el===document.activeElement),'idle hint stole focus');
    assert(JSON.stringify((await read(error)).researchRuns.P02)===quiet,'idle offer changed research state');
    await error.locator('[data-ro-action=collapse]').click();assert(await error.locator('.ro-guide-body').isHidden(),'player cannot dismiss idle guidance');await act(error,'exit');
    checks.push('idle assistance is a single inline offer; it never opens a panel, moves focus, changes research or prevents dismissal');

    await open(error,'C01');const closed=(await read(error)).researchRuns.C01;await act(error,'exit');await error.waitForTimeout(5200);
    assert(await error.locator('#modal-backdrop').isHidden(),'leaving entrance reopened modal');assert(JSON.stringify((await read(error)).researchRuns.C01)===JSON.stringify(closed),'entrance timers wrote after leaving');
    checks.push('leaving during entrance cancels scene timers and retains the untouched research state');
    assert(!pageErrors.length,pageErrors.join('\n'));return {passed:true,checks,pageErrors};
  }catch(error){for(const c of contexts)for(const p of c.pages())await p.screenshot({path:'output/browser-regressions/p12-onboarding-failure.png'}).catch(()=>{});return {passed:false,error:error.stack,checks,pageErrors};}
  finally{for(const c of contexts)await c.close();}
}
