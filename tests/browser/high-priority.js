async(page) => {
  const base = new URL(page.url()).origin;
  const browser = page.context().browser();
  const contexts = [], errors = [], checks = [];
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const context = async () => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 } });
    contexts.push(ctx);
    await ctx.addInitScript(origin => {
      if (location.origin === origin)
        sessionStorage.setItem("knowledge-islands-opening-v1", "seen");
    }, base);
    ctx.on("page", p => p.on("pageerror", error => errors.push(error.message)));
    return ctx;
  };
  const load = async ctx => {
    const p = await ctx.newPage();
    await p.goto(base+"/#map", { waitUntil: "networkidle" });await p.locator('[data-flight=skip]').click();
    return p;
  };
  const read = p => p.evaluate(() => JSON.parse(localStorage.getItem("knowledge-islands-v2")));
  const open = async (p, id) => {
    // This suite exercises the retained original workbench. New main and optional tasks get their own suites.
    if (["P01", "C01", "M03", "P06", "C10", "M08", "P07", "M06", "C04", "P03", "M05", "C06", "P10", "M10", "C08", "P02", "P04", "P05", "P08", "P09", "M01", "M02", "M04", "M07", "M09", "C02", "C03", "C05", "C07", "C09"].includes(id)) {
      const seeded = await p.evaluate(id => {
        const raw = JSON.parse(localStorage.getItem("knowledge-islands-v2") || "{}");
        const key = {P:"physicsScenarios",C:"chemistryScenarios",M:"mathScenarios"}[id[0]];
        if (raw[key]?.[id]?.role) return false;
        raw[key] ||= {};
        const game = {P:AtlasPhysicsScenarios,C:AtlasChemistryScenarios,M:AtlasMathScenarios}[id[0]];
        raw[key][id] = game.fresh(id,"assistant");
        localStorage.setItem("knowledge-islands-v2",JSON.stringify(raw)); return true;
      },id);
      if (seeded) { await p.reload({waitUntil:"networkidle"});await p.locator('[data-flight=skip]').click(); }
    }
    const s = id[0];
    await p.locator(`button[data-subject=${s}]`).click();
    await p.locator(s === "P" ? "#physics-campaign-button" : s === "M"
      ? "#math-campaign-button" : "#chemistry-campaign-button").click();
    await p.locator(s === "C" ? `[data-chemistry-campaign-level=${id}]`
      : `[data-campaign-level=${id}]`).click();
    await p.locator(".px-blackout-screen").waitFor();
    await p.keyboard.press("Escape");
  };
  const exit = p => p.locator(".event-header [data-do=exit]").last().click();
  const set = async (p, key, value) => {
    const input = p.locator(`input[data-range=${key}]`);
    if (await input.count()) {
      await input.evaluate((el, v) => {
        el.value = v; el.dispatchEvent(new Event("input", { bubbles: true }));
      }, value);
      await p.waitForFunction(({ key, value }) =>
        document.querySelector(`#sandbox-${key}`).value === String(value), { key, value });
      await p.waitForTimeout(40);
    } else {
      const index = await p.evaluate(({ key, value }) => {
        const id = document.querySelector(".event-modal").dataset.physicsTheme;
        const state = JSON.parse(localStorage.getItem("knowledge-islands-v2"));
        const game = id[0] === "M" ? AtlasMathScenarios : AtlasChemistryScenarios;
        const record = (id[0] === "M" ? state.mathScenarios : state.chemistryScenarios)[id];
        return game.lab(id, record?.round || 0).controls.find(c => c.key === key)
          .values.findIndex(([v]) => v === value);
      }, { key, value });
      assert(index >= 0, `missing option ${key}=${value}`);
      await p.locator(`[data-param=${key}][data-option="${index}"]`).click();
    }
  };
  try {
    const storageContext = await context();
    const a = await load(storageContext), b = await load(storageContext);
    await open(a, "P03");
    await a.locator("#scenario-run").click();
    await b.waitForFunction(() => JSON.parse(localStorage.getItem("knowledge-islands-v2"))
      .physicsScenarios.P03?.events.length === 1);
    await b.close();
    const preserved = await read(a);
    assert(preserved.physicsScenarios.P03.events.length === 1 && preserved.visited.includes("P03"),
      "closing a stale tab erased the new experiment");
    checks.push("stale tab close preserves progress");

    const c = await load(storageContext);
    await open(c, "M03");
    await set(a, "speed", 0.7);
    await a.locator("#scenario-run").click();
    await set(c, "targetX", 4); await set(c, "targetY", 3);
    await c.locator("#scenario-run").click();
    const merged = await read(c);
    assert(merged.physicsScenarios.P03.events.length === 2 && merged.mathScenarios.M03.events.length === 1,
      "independent tabs did not preserve both runs");
    assert(await c.locator(".event-modal").isVisible(), "unrelated progress closed the current run");
    checks.push("independent level edits merge");
    await c.close(); await a.close();

    const sameContext = await context();
    const first = await load(sameContext), second = await load(sameContext);
    await open(first, "P03"); await open(second, "P03");
    await first.locator("#scenario-run").click();
    await second.locator("#modal-backdrop").waitFor({ state: "hidden" });
    assert((await read(second)).physicsScenarios.P03.events.length === 1,
      "same-level tab did not adopt the newer run");
    checks.push("same-level update closes the stale workbench safely");
    await first.close(); await second.close();

    const scenePage = await load(await context());
    const handles = ".event-stage-visual [data-drag], .event-stage-visual [data-chem-angle]";
    for (const id of ["M03", "M05", "M06", "M08", "C06", "C07"]) {
      await open(scenePage, id);
      if (id === "C06") await set(scenePage, "shape", "tetra");
      assert(await scenePage.locator(handles).count(), `${id}: no live handle`);
      await scenePage.locator(handles).first().focus();
      await scenePage.keyboard.press("ArrowRight");
      for (const view of ["evidence", "history"]) {
        await scenePage.locator(`[data-view=${view}]`).click();
        assert(await scenePage.locator(handles).count() === 0, `${id}/${view}: stage still editable`);
        assert(await scenePage.locator(".sandbox-workbench-slot").count() === 0, "unexpected workbench");
      }
      await scenePage.locator("[data-do=notes]").click();
      assert(await scenePage.locator(handles).count() === 0, `${id}: notes still editable`);
      await scenePage.locator("[data-do=notes]").click();
      await scenePage.locator("[data-view=scene]").click();
      assert(await scenePage.locator(handles).count(), `${id}: live handles did not return`);
      const before = await scenePage.locator(".event-lab-controls input").evaluateAll(els => els.map(el => el.value));
      await scenePage.locator(handles).first().focus();
      await scenePage.keyboard.press("ArrowLeft");
      const after = await scenePage.locator(".event-lab-controls input").evaluateAll(els => els.map(el => el.value));
      assert(JSON.stringify(before) !== JSON.stringify(after), `${id}: live editing stopped after tab changes`);
      await exit(scenePage);
    }
    checks.push("six math/chemistry stages are read-only outside the scene and editable on return");

    const chemistry = await load(await context());
    await open(chemistry, "C01");
    await set(chemistry, "instrument", "density");
    await chemistry.locator("#scenario-run").click();
    const beforeAnswer = (await read(chemistry)).chemistryScenarios.C01.last.result.readings;
    await set(chemistry, "identity", "salt");
    assert(await chemistry.locator(".sandbox-reference.fair").count() === 0, "answer change awarded fair comparison");
    await chemistry.locator("#scenario-run").click();
    const corrected = (await read(chemistry)).chemistryScenarios.C01.last;
    assert(!corrected.comparison.fair && corrected.cost.time === 2 && corrected.cost.tools === 1,
      "answer change received a comparison discount");
    assert(JSON.stringify(beforeAnswer) === JSON.stringify(corrected.result.readings), "answer changed observations");
    await chemistry.locator("[data-do=next]").click();
    await set(chemistry, "instrument", "magnet"); await set(chemistry, "identity", "iron");
    await chemistry.locator("#scenario-run").click(); await chemistry.locator("[data-do=next]").click();
    await chemistry.locator("[data-hypothesis=supported]").click();
    await chemistry.locator("[data-action=publish]").click();
    assert((await read(chemistry)).chemistryScenarios.C01.bestStars === 2, "fake comparison still earned three stars");
    checks.push("answer-only changes receive neither discount nor third star");

    const math = await load(await context());
    await open(math, "M02");
    await set(math, "eliminatePouch", 1); await set(math, "eliminateWeight", 3);
    await math.locator("#scenario-run").click(); await math.locator("[data-do=next]").click();
    await set(math, "reduceStep", "divide");
    assert((await math.locator(".event-lab-controls").innerText()).includes("x + 5/3 = 26/3"),
      "partial division is still labelled a complete solution");
    assert((await math.locator(".event-stage-visual").innerText()).includes("x + 5/3"),
      "the equation on the scale disagrees with the selected transformation");
    await set(math, "reduceStep", "done"); await math.locator("#scenario-run").click();
    assert((await read(math)).mathScenarios.M02.last.success, "the full equation solution failed");
    await exit(math); await open(math, "M09");
    await set(math, "deltaT", 0.2); await math.locator("#scenario-run").click();
    await math.locator("[data-do=next]").click(); await set(math, "zeroSlopeT", 20);
    await math.locator("#scenario-run").click();
    const result = (await read(math)).mathScenarios.M09.last.result;
    assert(result.success && result.detail.includes("最低值") && result.detail.includes("而非拐点"),
      "the water-level explanation is still incorrect");
    checks.push("equation and stationary-point feedback agree with the model");
    assert(errors.length === 0, `page errors: ${errors.join("; ")}`);
    return { passed: true, checks, pageErrors: errors };
  } finally {
    for (const ctx of contexts) await ctx.close();
  }
}
