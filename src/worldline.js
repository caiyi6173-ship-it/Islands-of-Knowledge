/* Artifacts remember their source. Delivery consumes references, never experiments. */
(() => {
  const local = typeof module !== "undefined" && module.exports;
  const D = local ? require("./worldline-data.js") : window.AtlasWorldlineData;
  const legacyModels = local
    ? { P: require("./physics-models.js"), M: require("./math-models.js") }
    : { P: window.AtlasPhysicsModels, M: window.AtlasMathModels };
  const clone = v => JSON.parse(JSON.stringify(v));
  const map = v => v && typeof v === "object" && !Array.isArray(v) ? v : {};
  const keys = ["mailArtifacts", "mailDeliveries", "mailAppendices", "mailFacts", "mailLetters", "researchHistory", "researchRuns", "researchDrafts", "postalVisits", "postalDesk"];
  const fields = () => Object.fromEntries(keys.map(k => [k, {}]));
  function normalize(progress) {
    const next = { ...progress };
    for (const key of keys) next[key] = { ...map(progress[key]) };
    next.mailArtifacts = Object.fromEntries(Object.entries(next.mailArtifacts).filter(([id, a]) =>
      D.tasks[id] && a?.id === id && a.complete === true && typeof a.currentRef === "string" &&
      Array.isArray(a.revisions) && a.revisions.some(r => r?.ref === a.currentRef && Array.isArray(r.records))));
    const deliveries = {};
    for (let i = 0; i < D.chapters.length; i++) {
      const c = D.chapters[i], delivery = next.mailDeliveries[c.id];
      if (!delivery || (i && !deliveries[D.chapters[i - 1].id])) break;
      if (delivery.id !== `mail-v1:${c.id}` || delivery.chapter !== c.id || !c.main.every(id =>
        next.mailArtifacts[id]?.revisions.some(r => r.ref === delivery.artifacts?.[id]))) break;
      deliveries[c.id] = delivery;
    }
    next.mailDeliveries = deliveries;
    next.mailAppendices = Object.fromEntries(Object.entries(next.mailAppendices).filter(([id, entry]) =>
      D.tasks[id]?.kind === "side" && deliveries[D.tasks[id].chapter] && entry?.id === id &&
      Array.isArray(entry.refs) && entry.refs.length && entry.refs.every(ref => next.mailArtifacts[id]?.revisions.some(r => r.ref === ref))));
    return next;
  }
  function fingerprint(value) {
    // A deterministic reference, not a security checksum or an experiment ID.
    const text = JSON.stringify(value);
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
    return (h >>> 0).toString(36);
  }
  function sourceSnapshot(id, raw, game) {
    if (!raw || !game) return null;
    let source;
    try { source = game.restore(id, raw); }
    catch { return null; }
    const records = (source.log || []).flatMap((entry, index) => entry.action === "experiment" && entry.result ? [{
      id: `${id}:legacy:${index}`, condition: entry.round, source: "player", rules: `scenario-v${source.version}`,
      params: clone(entry.result.params), readings: clone(entry.result.readings),
      goalSupported: entry.success === true, recordValid: null,
      cost: clone(entry.cost), legacyComparison: clone(entry.comparison || null),
    }] : []);
    return { source, records, complete: game.isCleared(source),
      currentComplete: source.ended === true && ["breakthrough", "discovery"].includes(source.ending) };
  }
  function rememberAttempt(progress, id, record) {
    if (!record?.events?.length || !D.tasks[id]) return progress;
    const next = normalize(progress);
    const key = record.researchRunId || `${id}:legacy:${fingerprint(record.events)}`;
    next.researchHistory[key] = { id, rules: `scenario-v${record.version}`, record: clone(record) };
    return next;
  }
  function startResearch(progress, id, session, role = "assistant") {
    if (!D.tasks[id]) return { progress, changed: false, reason: "unknown-level" };
    const next = normalize(progress), previous = next.researchRuns[id];
    const state = session.fresh(role);
    if (state.id !== id) return { progress, changed: false, reason: "wrong-adapter" };
    if (previous?.events?.length) {
      const restored = session.restore(previous);
      const key = previous.runId || `${id}:retained:${fingerprint(previous)}`;
      next.researchHistory[key] = { id, rules: previous.rules,
        replayStatus: restored.error || "verified", record: clone(restored.error ? previous : restored.state) };
    }
    next.researchRuns[id] = state;
    return { progress: next, changed: true, reason: "started" };
  }
  function commitResearch(progress, id, session, command) {
    const restored = session.restore(progress.researchRuns?.[id]);
    if (restored.error || restored.state.id !== id) return { progress, changed: false, reason: "unreadable-attempt" };
    const result = session.dispatch(restored.state, command);
    if (!result.changed) return { progress, changed: false, reason: result.reason };
    const next = normalize(progress), state = result.state;
    next.researchRuns[id] = state;
    if (command.type === "archive") {
      const existing = next.mailArtifacts[id], prior = existing?.revisions || [];
      const archive = state.revisions.at(-1);
      const revision = { ref: archive.id, source: state.rules, rules: state.rules,
        records: clone(state.records.filter(r => archive.records.includes(r.id))),
        studies: clone(state.studies.filter(s => archive.records.includes(s.id))) };
      next.mailArtifacts[id] = { id, title: D.tasks[id].title, complete: true,
        currentRef: revision.ref, revisions: [...prior, revision],
        bestStars: Math.max(existing?.bestStars || 0, state.bestStars) };
      next.mailFacts.firstArtifact = true;
      if (["P01", "C01", "M03"].includes(id)) {
        next.mailFacts.letterIntroduced = true;
        if (!next.mailLetters["00"]) next.mailLetters["00"] = letter(next, id);
      }
    }
    return { progress: next, changed: true, reason: result.reason };
  }
  function reconcile(progress, games) {
    const next = normalize(progress);
    for (const task of Object.values(D.tasks)) {
      const field = { P: "physicsScenarios", M: "mathScenarios", C: "chemistryScenarios" }[task.id[0]];
      const raw = progress[field]?.[task.id];
      const snapshot = sourceSnapshot(task.id, raw, games[task.id[0]]);
      const prefix = task.id[0] === "P" ? "physics" : "math";
      const legacy = legacyModels[task.id[0]];
      const legacyRecords = [progress[`${prefix}Levels`]?.[task.id], progress[`${prefix}Stories`]?.[task.id]].filter(record => legacy?.isCleared(record));
      const oldMarker = progress.expDone?.[`story-${task.id}`] === true || legacyRecords.length > 0;
      if (!snapshot?.complete && !oldMarker) continue;
      const records = snapshot?.currentComplete ? snapshot.records : [];
      const source = records.length ? "scenario-v4" : "legacy-completion";
      const signature = JSON.stringify({ source, records, events: snapshot?.currentComplete ? snapshot.source.events : [] });
      const existing = next.mailArtifacts[task.id];
      const prior = Array.isArray(existing?.revisions) ? existing.revisions : [];
      // A bare completion flag never overwrites a richer, already archived page.
      if (existing?.complete && (source === "legacy-completion" || prior.some(r => r.signature === signature))) continue;
      const ref = `${task.id}:${source}:${prior.length + 1}`;
      const revision = { ref, signature, source, records, rules: snapshot?.source.version || null };
      next.mailArtifacts[task.id] = {
        id: task.id, title: task.title, complete: true,
        bestStars: Math.max(existing?.bestStars || 0, ...[raw, ...legacyRecords].map(r => Math.max(0, Math.min(3, Math.trunc(Number(r?.bestStars) || 0))))),
        revisions: [...prior, revision], currentRef: prior.some(r => r.ref === existing?.currentRef && r.source === "worldline-1") ? existing.currentRef : ref,
      };
      next.mailFacts.firstArtifact = true;
    }
    if (Object.values(next.mailArtifacts).some(a => a?.complete)) next.mailFacts.firstArtifact = true;
    if (next.mailDeliveries.R01) {
      if (!next.mailLetters["00"]) next.mailLetters["00"] = letter(next);
      next.mailFacts.letterIntroduced = true;
    }
    return next;
  }
  function status(progress, chapterId) {
    const chapter = D.chapters.find(c => c.id === chapterId);
    if (!chapter) return null;
    const index = D.chapters.indexOf(chapter);
    const missing = chapter.main.filter(id => progress.mailArtifacts?.[id]?.complete !== true);
    const delivered = !!progress.mailDeliveries?.[chapter.id];
    const previousDelivered = !index || !!progress.mailDeliveries?.[D.chapters[index - 1].id];
    return { chapter, missing, delivered, previousDelivered, ready: !delivered && previousDelivered && !missing.length };
  }
  function current(progress) {
    return D.chapters.find(c => !progress.mailDeliveries?.[c.id]) || null;
  }
  function deliver(progress, chapterId) {
    const state = status(progress, chapterId);
    if (!state?.ready) return { progress, changed: false, reason: state?.delivered ? "already-delivered" : "not-ready" };
    const next = normalize(progress);
    next.mailDeliveries[chapterId] = {
      id: `mail-v1:${chapterId}`, chapter: chapterId, receipt: chapterId,
      artifacts: Object.fromEntries(state.chapter.main.map(id => [id, next.mailArtifacts[id].currentRef])),
    };
    next.mailFacts[`delivered-${chapterId}`] = true;
    if (chapterId === "R01") {
      if (!next.mailLetters["00"]) next.mailLetters["00"] = letter(next);
      next.mailFacts.letterIntroduced = true;
    }
    if (chapterId === "R05") next.mailFacts.formalDesk = true;
    return { progress: next, changed: true, reason: "delivered" };
  }
  function letter(progress, preferredId) {
    const saved = progress.mailLetters?.["00"];
    if (!preferredId && saved && progress.mailArtifacts?.[saved.artifactId]?.revisions.some(r => r.ref === saved.ref)) return saved;
    const id = preferredId || ["P01", "C01", "M03"].find(id => progress.mailArtifacts?.[id]?.complete);
    const artifact = progress.mailArtifacts?.[id];
    if (!artifact?.complete || !D.letterSources.includes(id)) return null;
    const revision = artifact.revisions.find(r => r.ref === artifact.currentRef);
    if (!revision) return null;
    const records = revision.records.filter(r => r.source === "player" && r.recordValid && r.goalSupported);
    const typed = [0, 1].every(c => records.some(r => r.condition === c && r.modelVersion?.startsWith("first-voyage-")));
    let text = `我已完成「${D.tasks[id].title}」的核对。原记录的条件要和结论一起保留；换条件后，还要重新检查。`;
    if (typed && id === "P01") {
      const loaded = records.findLast(r => r.condition === 1);
      const mass = loaded.readings.find(([name]) => name === "总质量")?.[1];
      text = `四箱货装不上船时，我先核对空载，再把 ${mass} 的总质量算进去。在给定材料和水的条件下，这次的船型有足够容量。下一次多一箱，还要再查。`;
    }
    if (typed && id === "C01") text = "名字贴在证据之后。我对照给定参考，分别核对了两份留样；换一份样品，不能只照抄上一张身份签。";
    if (typed && id === "M03") text = "地址要一起写清原点、方向、单位和先后次序。给定航标也留下了代入依据，这样下一位拿到纸，才知道怎样核对。";
    if (typed && id === "M03" && revision.records.some(r => r.quality?.kind === "representation-check" && r.quality.verified)) text += "换过原点后，两份地址仍还原到同一个窗口。";
    const revised = [0, 1].every(c => records.some(r => r.condition === c && r.modelVersion?.startsWith("revision-")));
    if (revised && id === "P07") {
      const m = records.findLast(r => r.condition === 1).measurement;
      text = `同一段报码要和接收条件一起写。我按出的 ${m.sent} 在接收刻度 ${m.receiver} 下核对为 ${m.decoded}；码本不能替代实际按键，站章也不能替代逐符检查。`;
    }
    if (revised && id === "M06") {
      const a = records.findLast(r => r.condition === 0).measurement.beforeScale[0];
      const b = records.findLast(r => r.condition === 1).measurement;
      text = `同一原片，先转再移的 A 在 (${a.join(",")})，先移再转的 A 在 (${b.beforeScale[0].join(",")})，这里都先比较放大前的位置。第二张再放大 ${b.lengthRatio} 倍，面积变 ${b.areaRatio} 倍；中心、次序和比例都要写清楚。`;
    }
    if (revised && id === "C04") {
      const m = records.findLast(r => r.condition === 1).measurement;
      text = `这张 O₂ 图共有 ${m.total} 个价电子、${m.bondPairs} 对共享电子、全分子 ${m.leftLone + m.rightLone} 对孤对。每个原子周围计入共享对，全分子账只算一次；一条键线代表一共享对，孤对仍要保留。`;
    }
    const hasModel = prefix => [0, 1].every(c => records.some(r => r.condition === c && r.modelVersion?.startsWith(prefix)));
    if (hasModel("nightwatch-")) {
      const r = records.findLast(r => r.condition === 1);
      text = `我在「${D.tasks[id].title}」中留下了新条件核对：${r.readings.slice(0, 2).map(([key, value]) => `${key}为${value}`).join("；")}。这是这份给定装置或航向模型的记录，不能直接替代整座港口的设施。夜班还需要有人接着使用，也需要有人接班。`;
    }
    if (hasModel("atlas-") && id === "P03") {
      const r = records.findLast(r => r.condition === 1);
      text = `这张轨道页在给定的无空气球形世界里，速度比为 ${r.params.ratio}，轨迹为${r.measurement.label}。模型假设和用途要放在正面；它解释环绕，没有检验真实发射与运输。`;
    }
    if (hasModel("atlas-") && id === "M05") {
      const m = records.findLast(r => r.condition === 1).measurement;
      text = `船不只从桥洞最高处通过。我检查了整个 [3,9]，最低几何净空为 ${m.minimum.toFixed(3)}，而轮廓要求为 3.5。潮位、承重与真实航行还需要另查。`;
    }
    if (hasModel("atlas-") && id === "C06") {
      const m = records.findLast(r => r.condition === 1).measurement;
      text = `现代水分子说明页的模型三维角为 ${m.actualAngle.toFixed(2)}°。镜头会改变纸上的投影，角度标注也不会掰动分子；原稿与现代补页各有来历。`;
    }
    if (hasModel("return-") && id === "P10") {
      const r = records.findLast(r => r.condition === 1), m = r.measurement;
      text = `材料 B 的功函数是 ${m.work} eV。这次频率 ${r.params.frequency.toFixed(2)} ×10¹⁴ Hz、相对光子通量 ${r.params.flux}，最大动能 ${m.kinetic.toFixed(3)} eV。光子数量与单个光子的能量分开；换材料，就重新核对阈值。`;
    }
    if (hasModel("return-") && id === "M10") {
      const m = records.findLast(r => r.condition === 1).measurement;
      text = `拆信前，我把 t=${m.time} 的预测封存为 ${m.originalPrediction.toFixed(3)}。未参与拟合的观测是 ${m.observation.toFixed(3)}，原预测误差 ${m.error.toFixed(3)}。拆信后的调参另叫修订，不抹掉第一次预测；下一次还要独立检查。`;
    }
    if (hasModel("return-") && id === "C08") {
      const r = records.findLast(r => r.condition === 0), m = r.measurement;
      text = `在开口与封闭核对包里，我追踪了 ${r.params.gas} g 的给定气体；当前容器内 ${m.inside} g、逸出 ${m.escaped} g，合计仍是 100 g。另一张 H₂+O₂→H₂O 原子账用 2∶1∶2 配平，它不是这份产气称量的真实反应。`;
    }
    if (D.tasks[id].kind === "side" && hasModel("appendix-")) {
      text = `在附页「${D.tasks[id].title}」里，我留下了实际核对：${records.findLast(r => r.condition === 1).readings.slice(0, 3).map(([k,v]) => `${k}为${v}`).join("；")}。这份记录的参数、给定资料与模型范围一起保留，换条件后仍要再查。`;
    }
    return { id: "00", recipient: "下一位愿意试试的人", artifactId: id, ref: revision.ref, title: D.tasks[id].title, text };
  }
  function selectLetter(progress, id) {
    const chosen = letter(progress, id);
    if (!chosen) return { progress, changed: false, reason: "missing-artifact" };
    if (JSON.stringify(progress.mailLetters?.["00"]) === JSON.stringify(chosen)) return { progress, changed: false, reason: "same-letter" };
    const next = normalize(progress); next.mailLetters["00"] = chosen;
    return { progress: next, changed: true, reason: "selected" };
  }
  function visit(progress, id) {
    if (!D.tasks[id]) return progress;
    const next = normalize(progress);
    next.mailFacts[`visited-${id}`] = true;
    return next;
  }
  function encounter(progress, id) {
    const task = D.tasks[id];
    if (!task) return null;
    if (task.kind === "side" ? progress.mailAppendices?.[id] : progress.mailDeliveries?.[task.chapter]) return "delivered";
    if (progress.mailArtifacts?.[id]?.complete) return "recorded";
    if (progress.mailFacts?.[`visited-${id}`]) return "revisit";
    return "first";
  }
  function appendixStatus(progress, id) {
    const task = D.tasks[id];
    if (task?.kind !== "side") return null;
    const artifact = progress.mailArtifacts?.[id], entry = progress.mailAppendices?.[id];
    return { chapter: task.chapter, complete: !!artifact?.complete,
      waiting: !!artifact?.complete && !progress.mailDeliveries?.[task.chapter],
      sent: !!entry, ready: !!artifact?.complete && !!progress.mailDeliveries?.[task.chapter] && !entry?.refs.includes(artifact.currentRef) };
  }
  function sendAppendix(progress, id) {
    const next = normalize(progress), state = appendixStatus(next, id);
    if (!state?.ready) return { progress, changed: false, reason: state?.sent ? "already-sent" : "not-ready" };
    const ref = next.mailArtifacts[id].currentRef, refs = next.mailAppendices[id]?.refs || [];
    next.mailAppendices[id] = { id, chapter: state.chapter, refs: [...refs, ref] };
    return { progress: next, changed: true, reason: "appendix-sent" };
  }
  const api = { fields, normalize, reconcile, rememberAttempt, startResearch, commitResearch, status, current, deliver, letter, selectLetter, visit, encounter, fingerprint, appendixStatus, sendAppendix };
  if (typeof window !== "undefined") window.AtlasWorldline = api;
  if (local) module.exports = api;
})();
