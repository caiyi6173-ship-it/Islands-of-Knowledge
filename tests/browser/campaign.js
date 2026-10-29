async(page)=>{
  const base=new URL(page.url()).origin,browser=page.context().browser(),checks=[],pageErrors=[];
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  context.on('page',p=>p.on('pageerror',e=>pageErrors.push(e.stack||e.message)));
  const p=await context.newPage();
  const assert=(ok,message)=>{if(!ok)throw new Error(message);};
  const read=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('knowledge-islands-v2')));
  const act=action=>p.locator(`[data-fv-action=${action}]`).click();
  const record=()=>act('record');
  async function open(id){
    const task=await p.evaluate(id=>AtlasWorldlineData.tasks[id],id);
    await p.locator('#mail-toggle').click();await p.locator(`[data-mail-chapter=${task.chapter}]`).click();
    if(task.kind==='side')await p.locator('.mail-optional>summary').click();
    await p.locator(`[data-mail-open=${id}]`).click();await p.locator(`.fv-workbench[data-level=${id}]`).waitFor();
    assert(await p.locator('.fv-intro').isVisible(),'missing repeated intro '+id);await p.keyboard.press('Escape');
    await p.evaluate(()=>window.__campaignStage=document.querySelector('.fv-scene'));
  }
  async function set(key,value){
    await p.locator(`[data-fv-input=${key}]`).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));},value);
    await p.waitForFunction(({key,value})=>document.querySelector(`[data-fv-input=${key}]`)?.nextElementSibling.textContent===String(value),{key,value});
  }
  async function choose(key,value){
    await p.locator(`[data-fv-param=${key}][data-value=${value}]`).click();
    await p.waitForFunction(({key,value})=>document.querySelector(`[data-fv-param=${key}][data-value=${value}]`)?.getAttribute('aria-pressed')==='true',{key,value});
  }
  async function finish(id){
    await act('archive');const raw=await read(),run=raw.researchRuns[id];
    assert(raw.mailArtifacts[id]?.complete,'archive unavailable '+id);
    assert(run.bestStars===2&&run.supplies===0,'ordinary path unexpectedly needed optional research '+id);
    assert(run.resources.time>=0&&run.resources.tools>=0,'negative budget '+id);
    assert(await p.evaluate(()=>window.__campaignStage===document.querySelector('.fv-scene')),'stage replaced '+id);
    assert(raw.mailArtifacts[id].revisions.at(-1).source==='worldline-1','not a new-model artifact '+id);
    await act('exit');
  }
  async function delivery(chapter){
    await p.locator('#mail-toggle').click();await p.locator(`[data-mail-chapter=${chapter}]`).click();
    await p.locator(`[data-mail-deliver=${chapter}]`).click();await p.locator('.fv-delivery').waitFor();
    const sent=JSON.stringify((await read()).mailDeliveries[chapter]);assert(sent&&sent!=='undefined','delivery not committed before playback');
    await p.keyboard.press('Escape');
    assert(await p.locator(chapter==='R05'?'.rt-letter-paper':'.fv-receipt').isVisible(),'skip lost receipt '+chapter);
    if(chapter==='R05'){
      assert((await p.locator('[data-rt-letter]').innerText()).includes('6.0 kg'),'default ending did not cite actual first cargo');
      await p.screenshot({path:'output/browser-regressions/p12-fresh-ending.png'});
    }
    await p.reload({waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();assert(JSON.stringify((await read()).mailDeliveries[chapter])===sent,'reload repeated delivery '+chapter);
  }
  async function pulse(duration){await p.locator('[data-cr-action=key]').focus();await p.keyboard.down('Space');await p.waitForTimeout(duration);await p.keyboard.up('Space');}
  async function sendCode(symbols){
    // Retry only free native input if automation itself held a key too long.
    // Never inject durations or change the game's classification thresholds.
    for(let attempt=0;attempt<3;attempt++){
      await p.locator('[data-cr-action=clear-pulses]').click();
      for(const symbol of symbols)await pulse(symbol==='.'?140:850);
      await p.waitForTimeout(80);
      const sent=await p.locator('.fv-readings dl>div').filter({has:p.locator('dt', {hasText:'发出 / 收到'})}).locator('dd').innerText();
      if(sent.split(' / ')[0]===symbols)return;
    }
    throw new Error('Native key input did not match the intended free practice code');
  }
  async function hold(duration){await p.locator('[data-nw-drive="1"]').focus();await p.keyboard.down('Space');await p.waitForTimeout(duration);await p.keyboard.up('Space');await p.waitForTimeout(560);}
  async function pair(index,zone){await p.locator('[data-cr-pick]').selectOption(String(index));await p.locator(`button[data-cr-action=place][data-cr-zone=${zone}]`).click();}
  try{
    await p.goto(base+"/#map",{waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();
    assert((await p.locator('#quest-title').innerText()).includes('四箱'),'new player lacks concrete commission');
    await p.locator('#quest-start').click();await p.locator('.fv-workbench[data-level=P01]').waitFor();await p.keyboard.press('Escape');await p.evaluate(()=>window.__campaignStage=document.querySelector('.fv-scene'));
    await record();assert((await read()).researchRuns.P01.failures===1,'formal mistake not retained');
    await choose('shape','bowl');await record();await act('advance');await choose('shape','wide');await record();await finish('P01');
    checks.push('fresh courier commission, visible formal penalty and recoverable ordinary two-star P01 without a supply');

    await open('M10');await set('a',.05);await set('b',-1.2);await set('c',15);await record();
    const sealed=JSON.stringify((await read()).researchRuns.M10.records);
    await act('exit');await p.reload({waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();await open('M10');
    assert(JSON.stringify((await read()).researchRuns.M10.records)===sealed,'early forecast changed on reload');
    assert(await p.locator('[data-rt-observation]').count()===0,'refresh revealed held-out data');
    await act('advance');await record();await finish('M10');assert(!Object.keys((await read()).mailDeliveries).length,'early R05 completed postal chapters');
    checks.push('out-of-order R05 research works before R01, sealed prediction survives refresh and early completion does not advance the story');

    await open('M03');await set('targetX',4);await set('targetY',3);await record();await act('advance');await set('lineSlope',2);await record();await finish('M03');
    await open('C01');await choose('instrument','density');await choose('identity','salt');await record();await act('advance');await choose('instrument','magnet');await choose('identity','iron');await record();await finish('C01');
    await delivery('R01');checks.push('three new-model R01 artifacts jointly ship, skipped receipt and refresh preserve the first actual delivery');

    await open('C10');
    for(const [wire,bridge] of [[true,false],[false,true],[true,true]])for(const [key,on] of [['wire',wire],['bridge',bridge]]){
      const button=p.locator(`[data-fv-param=${key}]`);
      if((await button.getAttribute('aria-pressed')==='true')!==on){await button.click();await p.waitForFunction(({key,on})=>document.querySelector(`[data-fv-param=${key}]`)?.getAttribute('aria-pressed')===String(on),{key,on});}
    }
    await record();await act('advance');await set('load',45);await choose('direction','ZnCu');await record();await finish('C10');
    await open('M08');await set('angle',126.87);await record();await act('advance');await set('angle',90);await record();await finish('M08');
    await open('P06');await hold(1450);await record();await act('advance');await hold(2400);await record();await finish('P06');
    await delivery('R02');checks.push('R02 uses real key-held samples, both circuit paths and two navigation goals; all three can finish at two stars');

    await open('M06');await p.locator('[data-cr-op=R]').click();await p.locator('[data-cr-op=T]').click();await record();await act('advance');await p.locator('[data-cr-action=up-op][data-cr-index="1"]').click();await set('scale',2);await record();await finish('M06');
    await open('C04');await pair(0,'bond');await record();await act('advance');for(let i=0;i<6;i++)await pair(i,i<2?'bond':i<4?'left':'right');await record();await finish('C04');
    await open('P07');if(await p.evaluate(()=>!AtlasPhysicsSound.isMuted()))await act('mute');await set('tuning',3);await sendCode('...');await record();await act('advance');await set('tuning',5);await sendCode('.-.');await record();await finish('P07');
    await delivery('R03');checks.push('R03 actual short/long key input, reordered transformation cards and electron placement form a reciprocal joint revision');

    await open('M05');await set('h',6);await set('k',4.1);await record();await act('advance');await set('a',-.125);await record();await finish('M05');
    await open('C06');await choose('shape','tetra');await p.locator('[data-at-action=angle][data-at-value="109.5"]').click();await record();await act('advance');await choose('shape','bent');await p.locator('[data-at-action=angle][data-at-value="104.5"]').click();await record();await finish('C06');
    await open('P03');await set('speed',10);await record();await act('advance');await set('ratio',1);await record();await finish('P03');
    await delivery('R04');checks.push('R04 ordinary trajectory, full-width clearance and spatial-angle pages create a three-page atlas without optional proof gates');

    await open('P10');await p.locator('[data-rt-action=capture]').click();await set('flux',5);await p.locator('[data-rt-action=capture]').click();await set('frequency',7);await p.locator('[data-rt-action=capture]').click();await record();await act('advance');await set('frequency',9);await record();await finish('P10');
    await open('C08');await p.locator('[data-rt-action=capture]').click();await choose('lid','closed');await p.locator('[data-rt-action=capture]').click();await choose('lid','open');await record();await act('advance');await set('h2',2);await set('h2o',2);await record();await finish('C08');
    await delivery('R05');const ending=await read();
    assert(Object.keys(ending.mailArtifacts).length===15&&Object.keys(ending.mailDeliveries).length===5&&ending.mailFacts.formalDesk,'new-model main campaign did not close the loop');
    assert(Object.values(ending.mailArtifacts).every(a=>a.bestStars===2),'main campaign required three stars');
    assert(Object.values(ending.mailArtifacts).every(a=>a.revisions.every(r=>r.source==='worldline-1')),'new campaign relied on legacy completion flags');
    assert(!Object.keys(ending.mailAppendices).length,'main campaign needed optional postage');
    await p.locator('#postal-office-toggle').click();await p.locator('.postal-room[data-phase="5"]').waitFor();
    assert((await p.locator('.post-inspector-content').innerText()).includes('正式桌位'),'formal desk not visible');await p.locator('.post-object-list [data-post-object=alan]').click();assert((await p.locator('.post-dialogue').innerText()).includes('吃饭'),'worker handoff missing');await p.locator('[data-post-action=close]').click();
    checks.push('a fully fresh fifteen-main-task run ends with only two-star artifacts, actual default 00, formal desk and worker handoff; no side tasks or legacy seeding');

    const main=JSON.stringify(ending.mailDeliveries),letter=JSON.stringify(ending.mailLetters);
    await open('M02');await p.locator('[data-ap-op=x]').click();await p.locator('[data-ap-op=number][data-ap-amount="3"]').click();await record();await act('advance');await p.locator('[data-ap-op=number][data-ap-amount="5"]').click();await p.locator('[data-ap-op=divide]').click();await record();await act('archive');await act('deliver');await p.locator('.ap-receipt-modal').waitFor();
    assert((await p.locator('.ap-receipt-modal').innerText()).includes('阿澜'),'post-ending appendix has no user reply');await p.locator('[data-ap-post]').click();await p.locator('[data-post-action=close]').click();
    assert(JSON.stringify((await read()).mailDeliveries)===main&&JSON.stringify((await read()).mailLetters)===letter,'post-ending appendix rewrote main delivery or default 00');
    checks.push('after the ending, a genuinely new optional task sends an independent user reply without changing main delivery or 00');

    await open('P01');await p.locator('.fv-tools summary').click();await act('restart');await p.keyboard.press('Escape');await record();await act('exit');await p.reload({waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();
    const replay=await read();assert(replay.researchRuns.P01.failures===1&&replay.mailArtifacts.P01.bestStars===2,'failed fresh attempt erased earned achievement');
    assert(Object.values(replay.researchHistory).some(h=>h.id==='P01'),'new round erased previous run');assert(JSON.stringify(replay.mailDeliveries)===main&&JSON.stringify(replay.mailLetters)===letter,'new attempt rewrote actual posted pages');
    checks.push('restarting and failing after the ending preserves archived sources, historical stars, research history and every sent revision');

    await p.locator('#journal-toggle').click();p.once('dialog',d=>d.dismiss());await p.locator('#clear-progress').click();assert(Object.keys((await read()).mailDeliveries).length===5,'cancelled reset deleted data');
    p.once('dialog',d=>d.accept());await p.locator('#clear-progress').click();await p.reload({waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();const reset=await read();
    assert(!Object.keys(reset.mailArtifacts).length&&!Object.keys(reset.researchRuns).length&&!Object.keys(reset.mailDeliveries).length,'reset resurrected old campaign');assert((await p.locator('#quest-title').innerText()).includes('四箱'),'reset did not restore first commission');
    checks.push('cancelled reset is harmless; confirmed reset and reload return to a genuinely empty first commission');
    assert(!pageErrors.length,pageErrors.join('\n'));return {passed:true,checks,pageErrors};
  }catch(error){await p.screenshot({path:'output/browser-regressions/p12-campaign-failure.png'});return {passed:false,error:error.stack,checks,pageErrors,debug:await p.evaluate(()=>({level:document.querySelector('.fv-workbench')?.dataset.level,title:document.querySelector('#modal-title')?.textContent,feedback:document.querySelector('.fv-feedback')?.textContent,readings:document.querySelector('.fv-readings')?.textContent}))};}
  finally{await context.close();}
}
