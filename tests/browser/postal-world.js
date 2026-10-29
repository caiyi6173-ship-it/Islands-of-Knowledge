async(page) => {
  const base=new URL(page.url()).origin,browser=page.context().browser(),contexts=[],checks=[],pageErrors=[];
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  const context=async(options={})=>{const c=await browser.newContext({viewport:{width:1440,height:960},...options});contexts.push(c);c.on('page',p=>p.on('pageerror',e=>pageErrors.push(e.stack||e.message)));return c;};
  const load=async c=>{const p=await c.newPage();await p.goto(base+"/#map",{waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();return p;};
  const read=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('knowledge-islands-v2')||'{}'));
  const office=async(p,station='P')=>{await p.locator('#postal-office-toggle').click();await p.locator('.postal-room').waitFor();if(station!=='P')await p.locator(`[data-post-place=${station}]`).click();};
  const object=(p,id)=>p.locator(`.post-object-list [data-post-object=${id}]`).click();
  const close=p=>p.locator('[data-post-action=close]').click();
  const seed=async(p,ids)=>{await p.evaluate(ids=>{const raw=JSON.parse(localStorage.getItem('knowledge-islands-v2')||'{}');raw.expDone||={};ids.forEach(id=>raw.expDone['story-'+id]=true);localStorage.setItem('knowledge-islands-v2',JSON.stringify(raw));},ids);await p.reload({waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();};
  const chapterMain={R01:['P01','C01','M03'],R02:['P06','C10','M08'],R03:['P07','M06','C04'],R04:['P03','M05','C06'],R05:['P10','M10','C08']};
  try {
    const p=await load(await context());
    assert(await p.locator('.postal-world-station').count()===3,'missing three physical map stations');
    assert(await p.locator('#map-nodes>.island-identity[data-island]').count()===3,'islands lack independent identity markers');
    assert(await p.locator('.postal-world-station [data-island]').count()===0,'island entrance is still attached to the post office');
    assert(await p.locator('[data-post-route][data-state=planned]').count()===3,'fresh map is not a postal sketch');
    assert(await p.locator('[data-post-route=PC]').evaluate(el=>el instanceof SVGPathElement&&el.getTotalLength()>100),'route is not a visible SVG path');
    assert(await p.locator('#postal-task-strip [data-post-task]').count()===3,'three direct task entries missing');
    await p.screenshot({path:'output/browser-regressions/p5-world-fresh.png'});
    await p.locator('.postal-world-station [data-post-station=P]').click();
    await p.locator('.post-room-scene').waitFor();await p.evaluate(()=>window.__room=document.querySelector('.post-room-art svg'));
    assert((await p.locator('.post-inspector-content h3').innerText()).includes('借出'),'borrowed desk was replaced with an earned desk');
    await object(p,'receipts');assert((await p.locator('.post-inspector-content').innerText()).includes('还空着'),'fresh room invented receipts');
    await object(p,'letter');assert((await p.locator('.post-letter-paper').innerText()).includes('这里先留白'),'fresh 00 invented a result');
    await object(p,'folio');assert((await p.locator('.post-inspector-content').innerText()).includes('还空着'),'fresh folio invented evidence');
    for(const id of ['joe','amo','alan']) {
      await object(p,id);assert((await p.locator('.post-inspector-kicker').innerText()).includes('初次'),'initial greeting missing');
    }
    await object(p,'desk');await object(p,'alan');assert((await p.locator('.post-inspector-kicker').innerText()).includes('又见面'),'companion did not remember meeting');
    assert(await p.evaluate(()=>window.__room===document.querySelector('.post-room-art svg')),'objects replaced the entire room stage');
    let raw=await read(p);assert(!Object.keys(raw.mailArtifacts).length&&!Object.keys(raw.mailDeliveries).length,'visiting awarded progress');
    checks.push('three named map stations, real SVG route sketch, direct tasks and optional office objects without research rewards');
    await p.screenshot({path:'output/browser-regressions/p5-office-borrowed.png'});
    await p.locator('[data-post-place=C]').click();
    assert((await p.locator('.post-dialogue').innerText()).includes('两个地方'),'observation window confused with the entrance lab');
    assert((await p.locator('.post-daily-action').innerText()).includes('留着位置'),'unreceived four crates appeared as received');
    await p.locator('[data-post-place=M]').click();assert(await p.locator('.postal-room[data-station=M]').count()===1,'map desk missing');
    await close(p);await p.locator('#postal-task-strip [data-post-task=C01]').click();
    await p.locator('.fv-workbench[data-level=C01]').waitFor();await p.keyboard.press('Escape');
    assert((await p.locator('.fv-conversation').innerText()).includes('入口'),'direct task did not enter the right lab');
    await p.locator('[data-fv-action=exit]').click();
    checks.push('three station interiors, remembered companions, chemistry entrance distinction and direct lab entry');
    await p.locator('#world-perspective').click();
    for(const [id,name] of [['P','物理岛'],['M','数学岛'],['C','化学岛']]){
      await p.locator(`.island-identity[data-island=${id}]`).click();
      assert((await p.locator('#node-panel h2').innerText())===name,'island name opens the wrong destination '+id);
      await p.locator('#enter-island').click();assert(await p.locator('#map-stage').getAttribute('data-subject')===id,'island entry failed '+id);
      await p.locator('#world-perspective').click();
    }
    checks.push('three prominent island names open their own island overview and enter the correct subject, independently of coastal postal rooms');

    await seed(p,chapterMain.R01);
    assert(await p.locator('[data-post-route][data-state=planned]').count()===3,'precompleted artifacts sent the ship');
    await office(p);await object(p,'bag');assert(await p.locator('.post-inspector [data-post-action=deliver]').isEnabled(),'ready cargo not deliverable from the bag');
    await p.locator('.post-inspector [data-post-action=deliver]').click();await p.locator('.fv-delivery').waitFor();
    const receipt=JSON.stringify((await read(p)).mailDeliveries.R01);
    await p.keyboard.press('Escape');await p.keyboard.press('Escape');await p.locator('[data-mail-home=P]').click();
    assert(await p.locator('.postal-room[data-phase="1"]').count()===1,'returned room forgot the first boat');
    await object(p,'receipts');assert((await p.locator('.post-kept-receipt').innerText()).includes('最后那箱也在'),'first physical receipt missing');
    await object(p,'desk');assert(await p.locator('[data-post-decor]').count()===2,'unearned keepsakes visible');
    await p.locator('[data-post-decor=box-sketch]').click();
    assert((await read(p)).postalDesk.item==='box-sketch','decoration not stored');
    await object(p,'letter');await p.locator('[data-post-letter]').selectOption('C01');
    assert((await read(p)).mailLetters['00'].artifactId==='C01','00 choice not stored');
    assert(!(await p.locator('.post-letter-paper').innerText()).includes('6.0'),'old completion invented measurements');
    await object(p,'alan');assert((await p.locator('.post-dialogue').innerText()).includes('早送到了'),'boat worker regressed to an undelivered task');
    await p.screenshot({path:'output/browser-regressions/p5-office-first-receipt.png'});
    await p.reload({waitUntil:'networkidle'});await p.locator('[data-flight=skip]').click();await office(p);await object(p,'desk');
    assert(await p.locator('[data-post-decor=box-sketch][aria-pressed=true]').count()===1,'desk choice did not survive refresh');
    assert(JSON.stringify((await read(p)).mailDeliveries.R01)===receipt,'room visit or refresh replayed delivery');
    checks.push('one-time bag delivery, first physical receipt, owned keepsakes, grounded 00 selection and persistent desk choice');
    await p.locator('[data-post-place=C]').click();assert((await p.locator('.post-daily-action').innerText()).includes('尺和纸'),'receiver is not using the delivered cargo');
    await p.screenshot({path:'output/browser-regressions/p5-window-day.png'});
    await close(p);await p.locator('button[data-subject=ALL]').click();
    assert(await p.locator('#node-panel').isHidden(),'returning to overview covered the postal station with an unsolicited dossier');
    assert(await p.locator('[data-post-route=PC][data-state=day]').count()===1,'first boat is not daytime');
    assert((await p.locator('#quest-title').innerText()).includes('R02'),'current commission did not advance');
    assert(await p.locator('#postal-task-strip [data-post-task=M08]').count()===1,'next chapter lost direct math entry');
    checks.push('delivered cargo is in use, daytime route stays distinct and the map shows the next real commission');

    await seed(p,Object.values(chapterMain).slice(1).flat());
    for(const id of ['R02','R03','R04']) {
      await office(p);await object(p,'bag');await p.locator('.post-inspector [data-post-action=deliver]').click();
      assert((await read(p)).mailDeliveries[id],`${id} delivery lost`);
      if(id==='R02') {
        await p.keyboard.press('Escape');await p.keyboard.press('Escape');await p.locator('[data-mail-home=P]').click();
        await p.locator('[data-post-place=C]').click();assert((await p.locator('.post-place-life').innerText()).includes('夜窗有人接班'),'night window lacks a real shift');
        await p.screenshot({path:'output/browser-regressions/p5-window-night.png'});
      }
      if(id==='R03'){await p.keyboard.press('Escape');await p.keyboard.press('Escape');await p.locator('[data-mail-home=P]').click();}
      if(id==='R04') {
        await p.keyboard.press('Escape');await p.keyboard.press('Escape');await p.locator('[data-mail-home=P]').click();
        await p.locator('[data-post-place=M]').click();assert((await p.locator('.post-place-life').innerText()).includes('正面'),'map desk did not retain conditions');
        await object(p,'folio');assert((await p.locator('.post-inspector-content h3').innerText()).includes('正面'),'folio did not reflect revisions');
        await p.screenshot({path:'output/browser-regressions/p5-map-desk-revised.png'});
      }
      await close(p);
    }
    await p.locator('button[data-subject=ALL]').click();
    assert(await p.locator('[data-post-route=PC][data-state=night]').count()===1,'partial night route missing');
    assert(await p.locator('[data-post-route][data-state=circuit]').count()===0,'partial work made a full night circuit');
    await office(p);await object(p,'bag');await p.locator('.post-inspector [data-post-action=deliver]').click();
    await p.keyboard.press('Escape');await p.keyboard.press('Escape');
    await object(p,'desk');assert((await p.locator('.post-inspector-content h3').innerText()).includes('正式桌位'),'full delivery did not give a desk');
    await object(p,'alan');assert((await p.locator('.post-dialogue').innerText()).includes('吃饭'),'boat worker never gets to leave');
    assert(await p.locator('[data-post-prop=alan-on-dock]').count()===0,'boat worker still stuck on the dock after handing over');
    assert(await p.locator('[data-post-prop=returned-box]').count()===1,'chipped return box missing from the home port');
    await object(p,'receipts');assert(await p.locator('[data-post-receipt]').count()===5,'receipt rope not complete');
    await p.locator('[data-post-place=C]').click();
    assert(await p.locator('[data-post-prop=delivered-cargo] .post-box').count()===3,'fourth box did not leave the receiving window');
    await close(p);await p.locator('button[data-subject=ALL]').click();
    assert(await p.locator('[data-post-route][data-state=circuit]').count()===3,'completed circuit missing');
    assert((await p.locator('#map-color-layer').getAttribute('data-full'))==='false','night circuit restored unexplored land');
    await p.screenshot({path:'output/browser-regressions/p5-world-circuit.png'});
    checks.push('night shift, jointly revised atlas, five real receipts and full circuit retain unexplored map areas');

    const shared=await context(),a=await load(shared),b=await load(shared);
    await office(a,'C');await a.evaluate(()=>window.__liveRoom=document.querySelector('.post-room-art svg'));
    await seed(b,chapterMain.R01);await b.locator('#mail-toggle').click();await b.locator('[data-mail-deliver=R01]').click();
    await a.locator('.postal-room[data-phase="1"]').waitFor();
    assert((await a.locator('.post-dialogue').innerText()).includes('最后那箱也在'),'open room did not follow another page delivery');
    assert(await a.evaluate(()=>window.__liveRoom===document.querySelector('.post-room-art svg')),'live update rebuilt the room');
    await b.locator('.fv-delivery').waitFor();await b.keyboard.press('Escape');await b.keyboard.press('Escape');
    await b.locator('.modal-close').click();await b.locator('#journal-toggle').click();b.once('dialog',d=>d.accept());await b.locator('#clear-progress').click();
    await a.waitForFunction(()=>!Object.keys(JSON.parse(localStorage.getItem('knowledge-islands-v2')).mailDeliveries).length);
    if(await a.locator('.postal-room').isVisible()) {
      await a.locator('.postal-room[data-phase="0"]').waitFor();await object(a,'receipts');assert(await a.locator('.post-kept-receipt').count()===0,'reset left ghost receipts');
    }
    checks.push('live rooms follow cross-page delivery without losing their stage and reset removes earned props');

    const mobile=await load(await context({viewport:{width:390,height:844},reducedMotion:'reduce'}));
    assert(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile document overflow');
    for(const id of ['P','M','C']) {
      const pin=await mobile.locator(`.postal-world-station [data-post-station=${id}]`).boundingBox();
      assert(pin&&pin.x>=0&&pin.x+pin.width<=390,`${id}: mobile station outside map`);
    }
    await mobile.screenshot({path:'output/browser-regressions/p5-world-mobile.png'});
    await mobile.locator('#postal-office-toggle').focus();await mobile.keyboard.press('Enter');await mobile.locator('.postal-room').waitFor();
    assert(await mobile.locator('#postal-office-toggle svg').count()===1,'mobile office tool has no visible icon');
    await object(mobile,'letter');
    assert(await mobile.locator('.post-inspector').evaluate(el=>{const r=el.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;}),'selected mobile object inspector stayed below the viewport');
    await mobile.screenshot({path:'output/browser-regressions/p5-office-mobile-selected.png'});
    assert(await mobile.locator('#modal').evaluate(el=>el.scrollWidth<=el.clientWidth+1),'mobile room horizontal overflow');
    await mobile.locator('#modal').evaluate(el=>el.scrollTop=0);await mobile.screenshot({path:'output/browser-regressions/p5-office-mobile.png'});
    await mobile.keyboard.press('Escape');assert(await mobile.locator('#modal-backdrop').isHidden(),'keyboard could not leave the room');
    checks.push('390px world overview, all station buttons in bounds, touch equivalents, keyboard exit and reduced motion');
    await mobile.goto(base+'/'+encodeURIComponent('学科脉络地图.html')+'#map',{waitUntil:'networkidle'});await mobile.locator('[data-flight=skip]').click();await office(mobile);
    assert(await mobile.locator('.postal-room').isVisible(),'alternate HTML did not load inhabited world');
    const duplicates=await mobile.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i);});
    assert(!duplicates.length,'duplicate DOM IDs: '+duplicates.join(','));
    checks.push('alternate entry and unique DOM identifiers');
    const composition=await load(await context({reducedMotion:'reduce'}));
    for(const [width,height] of [[320,568],[390,844],[667,375],[844,390],[1440,900],[1920,980],[2560,1080]]){
      await composition.setViewportSize({width,height});
      await composition.waitForTimeout(80);
      const problems=await composition.evaluate(()=>{
        const errors=[],stage=document.querySelector('#map-stage').getBoundingClientRect();
        const buttons=[...document.querySelectorAll('#map-nodes [data-post-station],#map-nodes [data-island]')];
        for(const button of buttons){
          const r=button.getBoundingClientRect(),top=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
          if(r.left<0||r.right>innerWidth||r.top<stage.top||r.bottom>stage.bottom)errors.push('station out of bounds: '+button.textContent.trim());
          if(!button.contains(top))errors.push('station covered by '+top?.className+': '+button.textContent.trim());
        }
        for(let i=0;i<buttons.length;i++)for(let j=i+1;j<buttons.length;j++){
          const a=buttons[i].getBoundingClientRect(),b=buttons[j].getBoundingClientRect();
          if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)errors.push('overlapping markers: '+buttons[i].getAttribute('aria-label')+' / '+buttons[j].getAttribute('aria-label'));
        }
        for(const id of ['P','M','C'])if(document.querySelector(`.island-identity[data-island=${id}]`).getBoundingClientRect().width<document.querySelector(`.postal-world-station[data-station=${id}]`).getBoundingClientRect().width*1.3)errors.push('island lacks visual priority '+id);
        if(document.documentElement.scrollWidth>innerWidth)errors.push('document overflow');
        return errors;
      });
      assert(!problems.length,`${width}x${height}: ${problems.join('; ')}`);
      if([667,1920].includes(width))await composition.screenshot({path:`output/playwright/map-balance-verified-${width}.png`});
    }
    checks.push('three primary island markers and three separate postal markers remain visible, clickable and nonoverlapping across phone, landscape, desktop and ultrawide layouts');
    assert(pageErrors.length===0,pageErrors.join('\n'));
    return {passed:true,checks,pageErrors};
  }catch(error){error.message+='\nCompleted: '+checks.join('; ')+'\nPage errors: '+pageErrors.join('; ');throw error;}
  finally{for(const c of contexts)await c.close();}
}
