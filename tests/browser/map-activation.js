async(page)=>{
  const base=new URL(page.url()).origin,browser=page.context().browser(),contexts=[],checks=[],pageErrors=[];
  const assert=(ok,message)=>{if(!ok)throw Error(message);};
  async function load(options={}){
    const c=await browser.newContext({viewport:{width:1440,height:1000},...options});contexts.push(c);
    const p=await c.newPage();p.on('pageerror',e=>pageErrors.push(e.stack||e.message));
    await p.goto(base,{waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();
    await p.evaluate(()=>{window.__openedLabs=0;const create=AtlasFirstVoyageWorkbench.create;AtlasFirstVoyageWorkbench.create=function(...args){window.__openedLabs++;return create(...args);};});
    return p;
  }
  const read=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('knowledge-islands-v2')||'{}'));
  async function hit(p,selector){
    return p.locator(selector).evaluate(el=>{
      const r=el.getBoundingClientRect(),points=[];
      for(const part of [el.querySelector('.node-label'),el.querySelector('.story-map-seal'),el])if(part){const b=part.getBoundingClientRect();points.push([b.left+b.width/2,b.top+b.height/2]);}
      for(const x of [.25,.5,.75])for(const y of [.15,.35,.55,.75,.9])points.push([r.left+r.width*x,r.top+r.height*y]);
      for(const [x,y] of points)if(x>2&&y>2&&x<innerWidth-2&&y<innerHeight-2&&el.contains(document.elementFromPoint(x,y)))return {x,y};
      return null;
    });
  }
  async function nodePoint(p,id){
    // Keyboard focusing is the existing accessible way to bring remote landmarks into view.
    await p.keyboard.press('Tab');await p.locator(`[data-node=${id}]`).focus();await p.waitForTimeout(650);
    const point=await hit(p,`[data-node=${id}]`);assert(point,'no exposed landmark hit area '+id);return point;
  }
  async function exitLab(p){await p.keyboard.press('Escape');await p.locator('[data-fv-action=exit]').click();}
  try{
    const p=await load();
    for(const id of ['P','M','C']){
      await p.locator(`[data-island=${id}]`).click();
      assert(await p.locator('#enter-island').isVisible(),'single click no longer previews island '+id);
      assert(await p.locator('#map-stage').getAttribute('data-layer')==='world','single click entered island '+id);
      await p.keyboard.press('Escape');
      const point=await hit(p,`[data-island=${id}]`);assert(point,'island has no exposed hit area '+id);
      await p.mouse.dblclick(point.x,point.y,{delay:45});
      assert(await p.locator('#map-stage').getAttribute('data-subject')===id,'double click entered wrong island '+id);
      assert(await p.locator('#node-panel').isHidden(),'double click left an extra island dossier '+id);
      await p.locator('#world-perspective').click();
    }
    checks.push('all three island labels preserve immediate single-click previews and support double-click entry without another dossier');

    for(const subject of ['P','M','C']){
      await p.locator(`button[data-subject=${subject}]`).dblclick();assert(await p.locator('#node-panel').isHidden(),'subject double click retained its dossier');
      for(let n=1;n<=10;n++){
        const id=subject+String(n).padStart(2,'0'),point=await nodePoint(p,id),before=await p.evaluate(()=>window.__openedLabs);
        await p.mouse.dblclick(point.x,point.y,{delay:45});
        await p.locator(`.fv-workbench[data-level=${id}]`).waitFor();
        assert(await p.evaluate(()=>window.__openedLabs)===before+1,'double click opened the lab more than once '+id);
        assert(await p.locator('.fv-intro .px-blackout-screen').count()===1,'double click consumed original opening '+id);
        const run=(await read(p)).researchRuns[id];assert(run.events.length===0&&run.records.length===0,'entry created research evidence '+id);
        await exitLab(p);
      }
      await p.locator('#world-perspective').click();
    }
    checks.push('all thirty native landmark double clicks enter exactly one matching workbench, retain the original opening and create no formal research');

    await p.locator('button[data-subject=P]').dblclick();
    let point=await nodePoint(p,'P07'),before=await p.evaluate(()=>window.__openedLabs);
    await p.mouse.click(point.x,point.y);assert(await p.locator('#node-panel [data-primary=P07]').isVisible(),'single click lost level preview');
    assert(!await p.locator('.fv-workbench').isVisible(),'single click entered a lab');
    await p.waitForTimeout(400);await p.mouse.click(point.x,point.y);
    await p.locator('.fv-workbench[data-level=P07]').waitFor();assert(await p.evaluate(()=>window.__openedLabs)===before+1,'slow double click failed after camera motion');await exitLab(p);
    checks.push('a slower double click still enters the original landmark after its preview redraws and recenters the map');

    await p.locator('button[data-subject=M]').dblclick();point=await nodePoint(p,'M03');
    await p.mouse.click(point.x,point.y);await p.waitForTimeout(700);point=await nodePoint(p,'M03');await p.mouse.click(point.x,point.y);
    assert(!await p.locator('.fv-workbench').isVisible(),'two separate previews accidentally entered a lab');
    await p.locator('#node-panel [data-primary=M03]').focus();await p.keyboard.press('Enter');await p.locator('.fv-workbench[data-level=M03]').waitFor();await exitLab(p);
    checks.push('separate clicks stay previews and the existing keyboard Enter action still opens the level');

    const wide=await load({viewport:{width:2560,height:1440}});
    for(const station of ['P','C','M']){
      await wide.locator(`.postal-world-station [data-post-station=${station}]`).dblclick();
      assert(await wide.locator(`.postal-room[data-station=${station}]`).isVisible(),'station double click closed or switched its room '+station);
      await wide.locator('[data-post-action=close]').click();
    }
    await wide.locator('.postal-world-station [data-post-station=P]').dblclick();
    await wide.locator('.post-object-list [data-post-object=amo]').dblclick();
    assert((await wide.locator('.post-inspector-kicker').innerText()).includes('初次'),'object double click repeated the first greeting');
    await wide.locator('[data-post-action=close]').click();
    await wide.locator('button[data-subject=C]').dblclick();await wide.locator('#postal-local-pins [data-post-station=C]').dblclick();assert(await wide.locator('.postal-room[data-station=C]').isVisible(),'island station double click failed');await wide.locator('[data-post-action=close]').click();
    checks.push('world stations, island stations and room objects accept a double gesture once, including wide-screen clicks outside the opened room');

    await p.locator('#world-perspective').click();before=await p.evaluate(()=>window.__openedLabs);
    await p.locator('[data-post-task=P01]').dblclick();await p.locator('.fv-workbench[data-level=P01]').waitFor();assert(await p.evaluate(()=>window.__openedLabs)===before+1,'direct task double click repeated entry');assert(await p.locator('.fv-intro .px-blackout-screen').count()===1,'direct task double click skipped the opening');await exitLab(p);
    checks.push('task shortcuts remain single-click actions and double clicking them never repeats entry or skips their prologue');

    const mobile=await load({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    await mobile.locator('[data-island=M]').tap();assert(await mobile.locator('#enter-island').isVisible(),'touch no longer previews island');await mobile.locator('#enter-island').tap();
    assert(await mobile.locator('#map-stage').getAttribute('data-subject')==='M','touch island entry failed');
    assert(!pageErrors.length,pageErrors.join('\n'));
    checks.push('touch keeps its original single-tap preview and explicit entry behavior');
    await p.screenshot({path:'output/playwright/map-double-click.png'});
    return {passed:true,checks,pageErrors};
  }catch(error){for(const c of contexts)for(const p of c.pages())await p.screenshot({path:'output/playwright/map-double-click-failure.png'}).catch(()=>{});return {passed:false,error:error.stack,checks,pageErrors};}
  finally{for(const c of contexts)await c.close();}
}
