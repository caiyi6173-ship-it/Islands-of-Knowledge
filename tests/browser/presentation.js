async(page)=>{
  const base=new URL(page.url()).origin,browser=page.context().browser(),contexts=[],checks=[],pageErrors=[];
  const assert=(ok,message)=>{if(!ok)throw new Error(message);};
  async function load(options={},observeAudio=false){
    const context=await browser.newContext({viewport:{width:1440,height:1000},...options});contexts.push(context);
    context.on('page',p=>p.on('pageerror',error=>pageErrors.push(error.stack||error.message)));
    if(observeAudio)await context.addInitScript(()=>{
      window.__voices=[];
      const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
      const create=Audio.prototype.createOscillator;
      Audio.prototype.createOscillator=function(...args){
        const oscillator=create.apply(this,args),entry={cancelled:false,ended:false},stop=oscillator.stop;
        window.__voices.push(entry);oscillator.addEventListener('ended',()=>entry.ended=true);
        oscillator.stop=function(at){if(at===undefined)entry.cancelled=true;return stop.apply(this,arguments);};
        return oscillator;
      };
    });
    const p=await context.newPage();await p.goto(base+"/#map",{waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();return p;
  }
  const act=(p,key)=>p.locator(`[data-fv-action=${key}]`).click();
  const read=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('knowledge-islands-v2')));
  async function open(p,id,skip=true){
    const task=await p.evaluate(id=>AtlasWorldlineData.tasks[id],id);
    await p.locator('#mail-toggle').click();await p.locator(`[data-mail-chapter=${task.chapter}]`).click();
    if(task.kind==='side')await p.locator('.mail-optional>summary').click();
    await p.locator(`[data-mail-open=${id}]`).click();await p.locator(`.fv-workbench[data-level=${id}]`).waitFor();
    if(skip)await p.keyboard.press('Escape');
  }
  async function shape(p,value){await p.locator(`[data-fv-param=shape][data-value=${value}]`).click();await p.waitForFunction(value=>document.querySelector(`[data-fv-param=shape][data-value=${value}]`)?.getAttribute('aria-pressed')==='true',value);}
  async function audit(p,id,mobile){
    return p.evaluate(({id,mobile})=>{
      const host=document.querySelector('.fv-workbench'),modal=document.querySelector('#modal'),errors=[];
      if(modal.scrollWidth>modal.clientWidth+1)errors.push('modal horizontal overflow');
      if(document.documentElement.scrollWidth>innerWidth+1)errors.push('document horizontal overflow');
      for(const el of host.querySelectorAll('.fv-number input')){
        if(!el.getAttribute('aria-label'))errors.push('unnamed range');
        if(mobile&&el.getBoundingClientRect().height<44)errors.push('short range target');
      }
      if(host.querySelectorAll('.rp-portrait').length!==1)errors.push('missing shared portrait');
      if(!host.querySelector('.rp-ribbon').textContent.includes('R0'))errors.push('missing chapter object');
      if(host.querySelector('.fv-feedback').hasAttribute('role'))errors.push('live slider narration');
      if(!host.querySelector('.rp-announcement[role=status]'))errors.push('missing outcome announcer');
      if(!mobile){
        const luminance=color=>{
          const rgb=color.startsWith('#')?[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)):color.match(/[\d.]+/g).slice(0,3).map(Number);
          return rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
        };
        const style=getComputedStyle(host),background=luminance(getComputedStyle(modal).backgroundColor);
        for(const kind of ['error','warning','success','reference']){
          const color=luminance(style.getPropertyValue('--rp-'+kind).trim());
          if((Math.max(color,background)+.05)/(Math.min(color,background)+.05)<4.5)errors.push(kind+' contrast below 4.5');
        }
      }
      for(const el of host.querySelectorAll('.fv-header button,.fv-controls button,#fv-record'))if(mobile&&el.getBoundingClientRect().height<43.5)errors.push('short button target');
      return {id,errors};
    },{id,mobile});
  }
  try{
    const p=await load(),ids=await p.evaluate(()=>Object.keys(AtlasWorldlineData.tasks));
    for(const id of ids){await open(p,id);const result=await audit(p,id,false);assert(!result.errors.length,id+': '+result.errors.join(', '));await act(p,'exit');}
    checks.push('all thirty desktop tables use shared portraits, chapter objects, named controls and separate outcome announcements');

    await open(p,'P01',false);await p.waitForTimeout(6700);assert(await p.locator('.fv-intro').isVisible(),'intro expired before the player chose');
    await p.keyboard.press('Escape');assert(await p.locator('[data-fv-param=shape]').first().evaluate(el=>el===document.activeElement),'skip did not transfer focus');
    await p.evaluate(()=>{window.__stage=document.querySelector('.fv-scene');window.__cues=[];for(const name of ['playError','playReference','playEureka','playSuccess']){const original=AtlasPhysicsSound[name];AtlasPhysicsSound[name]=(...args)=>{window.__cues.push(name);return original(...args);};}});
    await act(p,'record');assert(await p.locator('.fv-feedback').getAttribute('data-kind')==='error','formal failure lost visual state');assert((await p.locator('.fv-feedback').innerText()).includes('可靠度 −1'),'failure cost not stated');
    const failed=(await read(p)).researchRuns.P01;assert(failed.failures===1&&failed.resources.trust===1,'penalty changed');
    await p.screenshot({path:'output/browser-regressions/p11-formal-error.png'});
    await p.locator('[data-fv-reference]').check();await act(p,'record');assert(await p.locator('.fv-feedback').getAttribute('data-kind')==='reference','valid reference presented as target completion');
    const announced=await p.locator('.rp-announcement').innerText();await p.locator('[data-fv-reference]').uncheck();await shape(p,'bowl');assert(await p.locator('.rp-announcement').innerText()===announced,'free preview spammed announcements');
    await act(p,'record');assert(await p.locator('.fv-feedback').getAttribute('data-kind')==='success','goal cue absent');await act(p,'advance');await shape(p,'wide');await act(p,'record');await act(p,'archive');
    assert(await p.locator('.fv-feedback').getAttribute('data-kind')==='archive','archive indistinguishable from one measurement');
    assert(await p.evaluate(()=>window.__stage===document.querySelector('.fv-scene')),'feedback replaced stage');
    const cues=await p.evaluate(()=>window.__cues);assert(['playError','playReference','playEureka','playSuccess'].every(c=>cues.includes(c)),'different outcomes did not use different cues');
    await p.locator('.fv-tools summary').click();const last=p.locator('[data-fv-action=motion]');await last.focus();await p.keyboard.press('Tab');assert(await p.locator('[data-fv-action=exit]').evaluate(el=>el===document.activeElement),'Tab escaped modal');await p.keyboard.press('Shift+Tab');assert(await last.evaluate(el=>el===document.activeElement),'reverse Tab escaped modal');
    await p.screenshot({path:'output/browser-regressions/p11-harbor-desktop.png'});await act(p,'exit');
    checks.push('persistent skippable intro, keyboard focus loop, free-preview silence and four distinct formal outcomes preserve stage and resource rules');

    await open(p,'M02');await p.locator('[data-ap-op=x]').click();await p.locator('[data-ap-op=x]').click();assert(await p.locator('.fv-feedback').getAttribute('data-kind')==='warning','free invalid action missing warning');
    const contrast=await p.locator('.fv-feedback').evaluate(el=>{
      const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number),l=rgb=>rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
      const a=l(rgb(getComputedStyle(el).color)),b=l(rgb(getComputedStyle(document.querySelector('#modal')).backgroundColor));return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    });assert(contrast>=4.5,'light-scene warning contrast below 4.5');await act(p,'exit');
    await open(p,'C01');await p.locator('[data-fv-param=identity][data-value=salt]').click();await act(p,'record');assert(await p.locator('.fv-feedback').getAttribute('data-kind')==='error','light-scene formal error missing');
    await p.screenshot({path:'output/browser-regressions/p11-sample-error.png'});await act(p,'exit');
    checks.push('light scenes retain readable warning and formal-error feedback, with symbols and explicit labels');

    await open(p,'M08');await p.emulateMedia({reducedMotion:'reduce'});await p.waitForFunction(()=>document.querySelector('.fv-workbench').classList.contains('fv-motion-paused'));
    const before=JSON.stringify((await read(p)).researchRuns.M08.resources),boat=await p.locator('.nw-boat').getAttribute('style');await p.waitForTimeout(250);assert(await p.locator('.nw-boat').getAttribute('style')===boat,'reduced-motion river still running');
    const range=p.locator('#fv-angle');await range.focus();await p.keyboard.press('ArrowRight');await p.waitForFunction(()=>document.querySelector('#fv-angle').nextElementSibling.textContent!=='90');
    assert(JSON.stringify((await read(p)).researchRuns.M08.resources)===before,'reduced-motion keyboard change charged');
    await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForFunction(()=>!document.querySelector('.fv-workbench').classList.contains('fv-motion-paused'));await act(p,'exit');
    await open(p,'P02');await p.emulateMedia({reducedMotion:'reduce'});await p.locator('[data-ap-action=replay]').click();assert(await p.locator('[data-rung=true]').count()===3,'static timing result missing');await act(p,'exit');
    checks.push('live reduced-motion changes pause river playback while keyboard calculation remains immediate; bell playback has a static final state');

    const mobile=await load({viewport:{width:320,height:780},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    for(const id of ids){await open(mobile,id);const result=await audit(mobile,id,true);assert(!result.errors.length,id+' 320px: '+result.errors.join(', '));if(['P07','C05','M05'].includes(id)){await mobile.locator('#modal').evaluate(el=>el.scrollTop=0);await mobile.screenshot({path:`output/browser-regressions/p11-mobile-${id}.png`});}await act(mobile,'exit');}
    checks.push('all thirty tables at 320px: no horizontal overflow, forty-four-pixel primary targets and reduced-motion entry');

    const delivery=await load();await delivery.evaluate(()=>{const s=JSON.parse(localStorage.getItem('knowledge-islands-v2')||'{}');s.expDone||={};for(const c of AtlasWorldlineData.chapters)for(const id of c.main)s.expDone['story-'+id]=true;localStorage.setItem('knowledge-islands-v2',JSON.stringify(s));});await delivery.reload({waitUntil:'networkidle'});await delivery.locator('[data-flight=skip]').click();await delivery.locator('#mail-toggle').click();await delivery.locator('[data-mail-deliver=R01]').click();
    await delivery.emulateMedia({reducedMotion:'reduce'});const title=await delivery.locator('#modal-title').innerText();await delivery.waitForTimeout(2700);assert(await delivery.locator('#modal-title').innerText()===title,'delivery autoplay ignored changed preference');
    await delivery.keyboard.press('Escape');await delivery.locator('.fv-receipt').waitFor();await delivery.locator('[data-rp-mute]').click();assert(await delivery.evaluate(()=>AtlasPhysicsSound.isMuted()),'receipt cannot mute audio');
    const sent=JSON.stringify((await read(delivery)).mailDeliveries.R01);await delivery.keyboard.press('Escape');assert(JSON.stringify((await read(delivery)).mailDeliveries.R01)===sent,'receipt transition changed saved delivery');
    checks.push('delivery autoplay stops on a live system preference change; receipt has a mute toggle and preserves saved delivery');
    const audio=await load({},true);
    await open(audio,'M01');await audio.locator('[data-ap-action=pluck]').click();assert(await audio.evaluate(()=>window.__voices.length===2),'string did not create native audio nodes');
    await act(audio,'mute');assert(await audio.evaluate(()=>window.__voices.every(v=>v.cancelled||v.ended)),'mute left a scheduled string note');
    await act(audio,'mute');await audio.locator('[data-ap-action=pluck]').click();await act(audio,'exit');assert(await audio.evaluate(()=>window.__voices.every(v=>v.cancelled||v.ended)),'exit left a string note');
    await open(audio,'P07');const start=await audio.evaluate(()=>window.__voices.length);await audio.locator('[data-cr-action=key]').focus();await audio.keyboard.down('Space');
    assert(await audio.evaluate(start=>window.__voices.length>start,start),'telegraph key did not start native tone');await act(audio,'mute');
    assert(await audio.evaluate(start=>window.__voices.slice(start).every(v=>v.cancelled||v.ended),start),'mute did not immediately cancel held telegraph tone');await audio.keyboard.up('Space');await act(audio,'exit');
    checks.push('native string and telegraph audio: mute cancels active and queued notes immediately; leaving a table cancels playback');
    assert(!pageErrors.length,pageErrors.join('\n'));return {passed:true,checks,pageErrors};
  }catch(error){for(const c of contexts)for(const p of c.pages())await p.screenshot({path:'output/browser-regressions/p11-failure.png'}).catch(()=>{});return {passed:false,error:error.stack,checks,pageErrors};}
  finally{for(const c of contexts)await c.close();}
}
