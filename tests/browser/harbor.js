async(page)=>{
  const base=new URL(page.url()).origin,browser=page.context().browser(),contexts=[],checks=[],pageErrors=[];
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  async function context(options={}){
    const c=await browser.newContext({viewport:{width:1440,height:960},...options});contexts.push(c);
    c.on('page',p=>p.on('pageerror',e=>pageErrors.push(e.stack||e.message)));return c;
  }
  async function load(c,path='/',waitUntil='networkidle'){
    const p=await c.newPage();await p.goto(base+path,{waitUntil});
    await p.waitForFunction(()=>Boolean(window.AtlasHarborEntry));return p;
  }
  const raw=p=>p.evaluate(()=>localStorage.getItem('knowledge-islands-v2'));
  const retained=p=>p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('knowledge-islands-v2'))||{};return JSON.stringify([s.visited||[],s.researchRuns||{},s.mailArtifacts||{},s.mailDeliveries||{}]);});
  const phase=(p,value)=>p.waitForFunction(value=>AtlasHarborEntry.phase===value,value);
  const skip=p=>p.locator('[data-flight=skip]').click();
  async function moving(p,selector){
    const time=()=>p.locator(selector).evaluate(el=>el.getAnimations().find(a=>a.effect.getTiming().iterations===Infinity&&a.playState==='running')?.currentTime??null);
    const before=await time();assert(before!==null,'scene detail is not running: '+selector);
    await p.waitForTimeout(100);assert(await time()>before+30,'scene detail is frozen: '+selector);
  }
  async function scene(p,index){
    const dot=p.locator(`button[data-story-page="${index}"]`);
    if(await dot.isVisible())await dot.click();
    else {await p.keyboard.press('Home');await p.waitForFunction(()=>AtlasHarborEntry.storyPage===0);await settled(p,0);for(let i=1;i<=index;i++){await p.locator('[data-flight=start]').click();await p.waitForFunction(i=>AtlasHarborEntry.storyPage===i,i);await settled(p,i);}}
    await p.waitForFunction(index=>AtlasHarborEntry.storyPage===index,index);await settled(p,index);
  }
  async function settled(p,index){await p.waitForFunction(index=>{const flow=document.querySelector('.hf-story-scroll');return Math.abs(flow.scrollTop-document.querySelectorAll('.hs-page')[index].offsetTop)<2;},index);}
  async function departure(p){
    await scene(p,5);
    const end=await p.locator('.hf-story-scroll').evaluate(el=>el.scrollHeight-el.clientHeight-el.scrollTop<=2);
    if(!end)await p.locator('[data-flight=start]').click();
    await p.waitForFunction(()=>document.querySelector('#harbor-home').dataset.launchReady==='true');
  }

  async function replay(p){await p.locator('#help-toggle').click();await p.locator('#replay-harbor-flight').click();await phase(p,'home');}
  async function mapReady(p){
    await phase(p,'closed');assert(await p.locator('#harbor-home').isHidden(),'homepage still blocks map');
    assert(await p.locator('#world').count()===1,'duplicate live maps');
    assert(await p.locator('#world').evaluate(el=>el.parentElement.id==='map-stage'&&!el.inert),'map not restored');
    assert(!await p.locator('.topbar').evaluate(el=>el.inert),'map navigation still inert');
    assert(await p.evaluate(()=>document.activeElement.id)==='world-perspective','focus not returned to visible map navigation');
  }
  try{
    const p=await load(await context());
    assert(p.url().endsWith('#home'),'root URL did not show home');
    assert(await p.locator('#harbor-title').isVisible(),'homepage title missing');
    assert(await p.locator('#map-stage').evaluate(el=>el.inert),'map receives home input');
    await p.keyboard.press('Tab');assert(await p.locator('[data-flight=skip]').evaluate(el=>el===document.activeElement),'Tab escaped home');
    await p.keyboard.press('Shift+Tab');assert(await p.locator('[data-flight=start]').evaluate(el=>el===document.activeElement),'reverse Tab escaped home');
    const before=await raw(p);await p.mouse.move(720,450);await p.mouse.wheel(0,70);await p.waitForTimeout(120);
    assert(await p.evaluate(()=>AtlasHarborEntry.phase)==='home','small wheel noise launched flight');
    await p.mouse.wheel(0,-90);await p.waitForTimeout(80);
    await p.waitForTimeout(450);assert(await p.locator('.hf-story-scroll').evaluate(el=>el.scrollTop<5),'upward scroll did not return to the start');
    await p.evaluate(()=>{window.__arrivalWorld=document.querySelector('#world');window.__arrivalColors=document.querySelector('#map-color-layer').innerHTML;});
    await p.screenshot({path:'output/browser-regressions/harbor-home-desktop.png'});
    await moving(p,'.hs-cover .hs-sea-wisp:not(.hs-sea-wisp-far)');
    await p.mouse.wheel(0,1000);await p.waitForFunction(()=>AtlasHarborEntry.storyPage===1);await settled(p,1);
    await moving(p,'.hs-route-dashes');
    assert(await p.evaluate(()=>AtlasHarborEntry.phase)==='home','first scroll skipped the world story');
    await scene(p,2);await p.locator('[data-story-back]').click();await settled(p,1);assert(await p.evaluate(()=>AtlasHarborEntry.storyPage)===1,'cannot read a previous scene');
    for(const index of [2,3,4]){await scene(p,index);await moving(p,{2:'.hs-desk-paper',3:'.hs-companion .hs-raven-perched',4:'.hs-cargo-boat'}[index]);await p.screenshot({path:`output/playwright/harbor-story-desktop-${index}.png`});}
    const unseen=await p.evaluate(()=>[...document.querySelectorAll('.hs-page:not(.is-visible)')].flatMap(el=>el.getAnimations({subtree:true})).filter(a=>a.effect.getTiming().iterations===Infinity&&a.playState==='running').map(a=>a.animationName));
    assert(!unseen.length,'offscreen scenes keep animating: '+unseen.join(','));
    assert(await p.locator('#harbor-home').evaluate(el=>Number(el.style.getPropertyValue('--hs-read-progress'))>.7),'reading progress did not follow scrolling');
    checks.push('each scene has advancing thematic animations; offscreen scenes pause and scrolling updates the reading progress');
    await scene(p,5);await p.mouse.wheel(0,180);await p.waitForTimeout(100);assert(await p.evaluate(()=>AtlasHarborEntry.phase)==='home','arrival inertia launched the flight');
    await moving(p,'.hs-ready-raven');
    const perch=await p.evaluate(()=>{const bird=document.querySelector('.hs-ready-raven').getBoundingClientRect(),post=document.querySelector('.hs-illustration-departure rect[x="350"][y="526"]').getBoundingClientRect();return Math.abs(bird.bottom-post.top);});
    assert(perch<12,'ambient motion detached A-Mo from its perch: '+perch);
    await p.waitForFunction(()=>document.querySelector('#harbor-home').dataset.launchReady==='true');
    await p.mouse.wheel(0,160);await phase(p,'flight');
    assert(await p.locator('.hf-map-camera>#world').count()===1,'flight uses a duplicate image instead of live map');
    for(const [name,progress] of [['sea',.4],['rise',.65],['handoff',.96]]){
      await p.waitForFunction(progress=>Number(document.querySelector('#harbor-home').dataset.flightProgress)>=progress,progress);
      await p.screenshot({path:`output/browser-regressions/harbor-${name}.png`});
    }
    await mapReady(p);
    const landing=await p.evaluate(()=>{
      const stage=AtlasMapArrival.stage.getBoundingClientRect(),world=document.querySelector('#world'),r=world.getBoundingClientRect(),scale=AtlasMapCamera.worldFit(stage.width,stage.height);
      return {same:world===window.__arrivalWorld,colors:document.querySelector('#map-color-layer').innerHTML===window.__arrivalColors,dx:Math.abs(r.left-(stage.left+(stage.width-1600*scale)/2)),dy:Math.abs(r.top-(stage.top+(stage.height-1000*scale)/2)),scale:r.width/1600};
    });
    assert(landing.same&&landing.colors&&landing.dx<.5&&landing.dy<.5,'map handoff moved or changed the real map: '+JSON.stringify(landing));
    assert(await raw(p)===before,'flight changed player progress');
    await p.screenshot({path:'output/browser-regressions/harbor-map.png'});
    await p.mouse.move(720,450);await p.mouse.wheel(0,-300);await p.waitForTimeout(150);
    assert(await p.locator('#zoom-value').innerText()!=='100%','wheel remained captured after arrival');
    checks.push('native scrolling reads the six scenes, supports reverse reading, guards final-page inertia and then hands the exact live map back after the seven-second flight');

    await replay(p);await skip(p);await mapReady(p);
    assert(await p.locator('#zoom-value').innerText()==='100%','skip did not fit world map');
    const savedBeforeReload=await retained(p);
    await p.reload({waitUntil:'networkidle'});await phase(p,'home');
    assert(await p.locator('#harbor-title').isVisible()&&await p.locator('#map-stage').evaluate(el=>el.inert),'map refresh bypassed the harbor homepage');
    assert(await retained(p)===savedBeforeReload,'homepage refresh changed research progress');
    await skip(p);await mapReady(p);
    await p.locator('[data-subject=M]').click();assert(await p.locator('#harbor-home').isHidden(),'changing islands restarted entrance');
    await replay(p);await departure(p);await p.locator('[data-flight=start]').click();await phase(p,'flight');await p.waitForTimeout(600);await skip(p);await mapReady(p);
    await replay(p);await p.waitForTimeout(700);assert(await p.evaluate(()=>AtlasHarborEntry.phase)==='home','cancelled flight resurrected after replay');await p.keyboard.press('Escape');await mapReady(p);
    checks.push('map refresh always returns to home without changing progress; Help replays home and cancelling flight leaves island navigation intact');

    const linked=await load(p.context(),'/?entry=harbor#map');await phase(linked,'home');
    assert(await linked.locator('#harbor-title').isVisible(),'opening a saved map URL bypassed homepage');
    await skip(linked);await mapReady(linked);
    await linked.goto(base+'/README.md',{waitUntil:'load'});await linked.goBack({waitUntil:'load'});await phase(linked,'home');
    assert(await linked.locator('#harbor-title').isVisible(),'returning from browser history bypassed homepage');
    await linked.close();
    checks.push('opening saved map URLs in another tab and returning through browser history both begin at the harbor');

    await p.locator('#quest-start').click();await p.locator('.fv-workbench[data-level=P01]').waitFor();
    assert(await p.locator('.fv-intro .px-blackout-screen').count()===1,'original level opening was replaced');
    await p.keyboard.press('Escape');assert(await p.locator('.ro-guide').isVisible(),'original experiment guide lost after landing');
    await p.locator('[data-fv-action=exit]').click();
    checks.push('landing still leads into the original historical level intro and current experiment operation guide');

    const reduced=await load(await context({reducedMotion:'reduce'})),reducedBefore=await raw(reduced);
    await departure(reduced);
    assert(await reduced.locator('.hs-ready-raven').evaluate(el=>getComputedStyle(el).animationName)==='none','reduced motion still animates the scene');
    assert(await reduced.locator('.hs-departure .hs-art').evaluate(el=>getComputedStyle(el).transform)==='none','reduced motion still uses scroll parallax');
    await reduced.locator('[data-flight=start]').click();await phase(reduced,'closed');await mapReady(reduced);
    assert(await reduced.locator('.hf-map-camera>#world').count()===0,'reduced motion still flies');
    await replay(reduced);await departure(reduced);await reduced.locator('[data-flight=start]').click();await reduced.keyboard.press('Escape');await replay(reduced);await reduced.waitForTimeout(650);
    assert(await reduced.evaluate(()=>AtlasHarborEntry.phase)==='home','old reduced-motion timer closed a newly opened homepage');
    await skip(reduced);assert(await raw(reduced)===reducedBefore,'reduced-motion entry changed progress');
    await replay(p);await departure(p);await p.locator('[data-flight=start]').click();await phase(p,'flight');await p.emulateMedia({reducedMotion:'reduce'});await mapReady(p);
    checks.push('reduced-motion fade, changing motion preference during flight and immediate skip/replay leave no stale timers');

    for(const viewport of [{width:320,height:568},{width:390,height:844},{width:768,height:1024},{width:667,height:375}]){
      const mobile=await load(await context({viewport,isMobile:true,hasTouch:true}));
      const layout=await mobile.evaluate(()=>{
        const title=document.querySelector('#harbor-title').getBoundingClientRect(),copy=document.querySelector('.hs-cover .hs-copy').getBoundingClientRect(),start=document.querySelector('[data-flight=start]').getBoundingClientRect(),skip=document.querySelector('[data-flight=skip]').getBoundingClientRect();
        return {overflow:document.documentElement.scrollWidth>innerWidth,overlap:copy.bottom>start.top,titleVisible:title.left>=0&&title.right<=innerWidth,startVisible:start.bottom<=innerHeight&&start.top>0,skipHeight:skip.height,startHeight:start.height};
      });
      assert(!layout.overflow&&!layout.overlap&&layout.titleVisible&&layout.startVisible&&layout.skipHeight>=44&&layout.startHeight>=44,'responsive entry broken '+JSON.stringify({viewport,layout}));
      for(let i=1;i<6;i++){
        await scene(mobile,i);
        const fits=await mobile.evaluate(i=>{const page=document.querySelectorAll('.hs-page')[i],copy=page.querySelector('.hs-copy').getBoundingClientRect(),flow=document.querySelector('.hf-story-scroll');return copy.left>=0&&copy.right<=innerWidth&&flow.scrollWidth<=flow.clientWidth+1;},i);
        assert(fits,'story text overflows at '+viewport.width+' / '+i);
        if(viewport.width===390)await mobile.screenshot({path:`output/playwright/harbor-story-mobile-${i}.png`});
      }
      await scene(mobile,0);
      if(viewport.width===390)await mobile.screenshot({path:'output/browser-regressions/harbor-home-mobile.png'});
      if(viewport.width===667)await mobile.screenshot({path:'output/browser-regressions/harbor-home-landscape.png'});
      if(viewport.width===390){
        const cdp=await mobile.context().newCDPSession(mobile);
        await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:210,y:630}]});
        await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:212,y:520}]});
        await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await mobile.waitForTimeout(700);
        assert(await mobile.evaluate(()=>AtlasHarborEntry.phase)==='home','first native touch skipped the story');
        assert(await mobile.locator('.hf-story-scroll').evaluate(el=>el.scrollTop>0),'native swipe did not scroll the story');
        await departure(mobile);
        await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:580}]});
        await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:201,y:450}]});
        await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await phase(mobile,'flight');await mobile.waitForTimeout(400);
        await mobile.setViewportSize({width:844,height:390});await mobile.waitForTimeout(150);await mobile.keyboard.press('Escape');await mapReady(mobile);await cdp.detach();
      }else await skip(mobile);
    }
    checks.push('small phone, phone, tablet and short landscape layouts; native upward touch gesture and resize during flight');

    const missingContext=await context();await missingContext.route('**/assets/harbor-arrival-v1.png',route=>route.abort());
    const missing=await load(missingContext);assert(await missing.locator('#harbor-home').evaluate(el=>el.classList.contains('hf-image-error')),'missing-image fallback not applied');
    await departure(missing);await missing.locator('[data-flight=start]').click();await phase(missing,'flight');await missing.keyboard.press('Escape');await mapReady(missing);
    checks.push('failed harbor artwork still allows flight and usable map entry');

    const slowContext=await context();let release;const gate=new Promise(resolve=>release=resolve);
    await slowContext.route('**/assets/harbor-arrival-v1.png',async route=>{await gate;await route.continue();});
    const slow=await load(slowContext,'/','domcontentloaded');await departure(slow);await slow.locator('[data-flight=start]').click();await phase(slow,'preparing');
    await slow.keyboard.press('Escape');await mapReady(slow);await replay(slow);release();
    await slow.waitForFunction(()=>document.querySelector('.hf-panorama').complete);await slow.waitForTimeout(200);
    assert(await slow.evaluate(()=>AtlasHarborEntry.phase)==='home','cancelled image preparation launched stale flight');await skip(slow);
    checks.push('skipping while artwork loads releases input immediately and prevents a delayed unwanted flight');

    const protectedContext=await context();
    await protectedContext.addInitScript(()=>{if(location.protocol==='http:')localStorage.setItem('knowledge-islands-v2','{unfinished-record');});
    const protectedPage=await load(protectedContext);assert(await protectedPage.locator('#save-status').isVisible(),'save protection hidden by entry');
    await departure(protectedPage);await protectedPage.locator('[data-flight=start]').click();await phase(protectedPage,'flight');await protectedPage.waitForTimeout(200);await skip(protectedPage);await mapReady(protectedPage);
    assert(await raw(protectedPage)==='{unfinished-record','entry overwrote protected progress');
    checks.push('existing save-protection warning remains visible and unreadable progress remains untouched');

    const alternate=await load(await context(),'/'+encodeURIComponent('学科脉络地图.html')+'#map');
    assert(await alternate.locator('#harbor-title').isVisible(),'alternate HTML entry missing homepage');await skip(alternate);await mapReady(alternate);
    await alternate.reload({waitUntil:'networkidle'});await phase(alternate,'home');assert(await alternate.locator('#harbor-title').isVisible(),'alternate entry refresh bypassed homepage');
    checks.push('both HTML entrypoints expose the same home and map journey');
    assert(!pageErrors.length,'browser page errors: '+pageErrors.join('\n'));
    return {passed:true,checks,pageErrors};
  }catch(error){for(const c of contexts)for(const p of c.pages())await p.screenshot({path:'output/playwright/harbor-story-failure.png'}).catch(()=>{});throw error;}finally{await Promise.all(contexts.map(c=>c.close()));}
}
