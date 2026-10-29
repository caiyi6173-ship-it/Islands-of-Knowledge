async (page) => {
  const base = new URL(page.url()).origin;
  const contexts = [], checks = [], pageErrors = [];
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  async function load(options = {}) {
    const context = await page.context().browser().newContext({
      viewport: { width: 390, height: 844 }, ...options,
    });
    contexts.push(context);
    context.on('page', p => p.on('pageerror', e => pageErrors.push(e.message)));
    const p = await context.newPage();
    await p.goto(base + '/#map', { waitUntil: 'networkidle' });
    await p.locator('[data-flight=skip]').click();
    return p;
  }
  async function open(p, id) {
    const task = await p.evaluate(id => AtlasWorldlineData.tasks[id], id);
    await p.locator('#mail-toggle').click();
    await p.locator(`[data-mail-chapter=${task.chapter}]`).click();
    if (task.kind === 'side') await p.locator('.mail-optional>summary').click();
    await p.locator(`[data-mail-open=${id}]`).click();
    await p.locator('.px-blackout-screen').waitFor();
    await p.keyboard.press('Escape');
    await p.locator('.fv-in-opening').waitFor({ state: 'detached' });
  }
  async function audit(p, id) {
    const result = await p.evaluate(() => {
      const modal = document.querySelector('#modal');
      const host = modal.querySelector('.fv-workbench');
      modal.scrollTop = modal.scrollHeight;
      const bounds = modal.getBoundingClientRect();
      const last = host.querySelector('.fv-lab').getBoundingClientRect();
      const readingsOverlap = [...host.querySelectorAll('.fv-readings dl > div')].some(row => {
        const label = row.querySelector('dt'), value = row.querySelector('dd');
        return label && value && label.getBoundingClientRect().right > value.getBoundingClientRect().left;
      });
      return {
        scroll: modal.scrollTop,
        overflow: modal.scrollWidth > modal.clientWidth + 1,
        documentOverflow: document.documentElement.scrollWidth > innerWidth + 1,
        bottomReachable: last.bottom <= bounds.bottom + 1,
        hostOverflow: getComputedStyle(host).overflowY,
        readingsOverlap,
      };
    });
    assert(!result.overflow && !result.documentOverflow, `${id}: horizontal overflow`);
    assert(!result.readingsOverlap, `${id}: reading labels overlap values`);
    assert(result.bottomReachable && result.hostOverflow === 'visible',
      `${id}: lower controls clipped ${JSON.stringify(result)}`);
    assert(result.scroll > 0, `${id}: modal cannot scroll`);
  }
  try {
    const mobile = await load({ isMobile: true, hasTouch: true });
    const ids = await mobile.evaluate(() => Object.keys(AtlasWorldlineData.tasks));
    for (const id of ids) {
      await open(mobile, id);
      await audit(mobile, id);
      await mobile.locator('[data-fv-action=exit]').click();
    }
    checks.push('all thirty levels: mobile controls reachable by scrolling, no horizontal overflow');

    await open(mobile, 'P01');
    await mobile.locator('#modal').evaluate(el => { el.scrollTop = 0; });
    const cdp = await mobile.context().newCDPSession(mobile);
    // Swipe on the conversation, away from the draggable scene and sliders.
    const box = await mobile.locator('.fv-conversation').boundingBox();
    const startY = Math.min(720, box.y + 30), x = 190;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: startY }] });
    for (const dy of [30, 70, 120, 180, 240]) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: startY - dy }] });
      await mobile.waitForTimeout(30);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await mobile.waitForTimeout(250);
    assert(await mobile.locator('#modal').evaluate(el => el.scrollTop > 30), 'real touch swipe did not scroll');
    await cdp.detach();
    await mobile.screenshot({ path: 'output/playwright/scroll-layout-mobile.png' });
    await mobile.locator('[data-fv-action=exit]').click();
    checks.push('real mobile touch swipe scrolls the level');

    for (const viewport of [
      { width: 320, height: 640 }, { width: 768, height: 700 },
      { width: 1440, height: 640 }, { width: 844, height: 390 },
    ]) {
      await mobile.setViewportSize(viewport);
      for (const id of ['P01', 'M03', 'C01']) {
        await open(mobile, id); await audit(mobile, id);
        if (viewport.width === 320 && id === 'C01')
          await mobile.screenshot({ path: 'output/playwright/scroll-layout-320.png' });
        await mobile.locator('[data-fv-action=exit]').click();
      }
    }
    checks.push('320px phone, tablet, short desktop and landscape: all three subjects remain reachable');

    const desktop = await load({ viewport: { width: 1440, height: 900 } });
    await open(desktop, 'P01');
    const lab = desktop.locator('.fv-lab-scroll'), labBox = await lab.boundingBox();
    await desktop.mouse.move(labBox.x + labBox.width / 2, labBox.y + labBox.height / 2);
    await desktop.mouse.wheel(0, 600);
    await desktop.waitForTimeout(250);
    assert(await lab.evaluate(el => el.scrollTop > 0), 'desktop controls do not scroll with wheel');
    assert(await desktop.locator('#fv-record').isVisible(), 'desktop primary action missing');
    await desktop.screenshot({ path: 'output/playwright/scroll-layout-desktop.png' });
    await desktop.locator('[data-fv-action=exit]').click();
    checks.push('desktop sidebar scrolls with mouse wheel and retains primary action');

    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await desktop.setViewportSize(viewport);
      for (const subject of ['P', 'M', 'C']) {
        await desktop.locator(`button[data-subject=${subject}]`).click();
        const baseline = await desktop.locator('.chapter-heading').evaluate(el => getComputedStyle(el).backgroundColor);
        // Exercise the same selector state used once a discovery reveals map color.
        await desktop.locator('#world').evaluate(el => el.classList.add('has-map-color'));
        const result = await desktop.locator('.chapter-heading').evaluate(el => {
          const style = getComputedStyle(el), title = el.querySelector('h2');
          const range = document.createRange(); range.selectNodeContents(title);
          const text = range.getBoundingClientRect(), card = el.getBoundingClientRect();
          return { background: style.backgroundColor, image: style.backgroundImage,
            textFits: text.left >= card.left && text.right <= card.right + 1,
            titleColor: getComputedStyle(title).color };
        });
        assert(result.background === baseline && result.image === 'none', `${subject}: discovery changes card to pale background`);
        assert(result.textFits && result.titleColor !== result.background, `${subject}: chapter title unreadable or clipped`);
        if (subject === 'P' && viewport.width === 1440)
          await desktop.screenshot({ path: 'output/playwright/scroll-layout-island.png' });
        await desktop.locator('#world').evaluate(el => el.classList.remove('has-map-color'));
      }
    }
    checks.push('all three island headings: readable before and after map color restoration on desktop and mobile');
    assert(!pageErrors.length, pageErrors.join('\n'));
    return { passed: true, checks, pageErrors };
  } catch (error) {
    for (const context of contexts) for (const p of context.pages())
      await p.screenshot({ path: 'output/playwright/scroll-layout-failure.png' }).catch(() => {});
    return { passed: false, error: error.stack, checks, pageErrors };
  } finally {
    for (const context of contexts) await context.close();
  }
}
