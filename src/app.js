(() => {
  "use strict";
  const { SUBJECTS, NODES, EDGES, ROUTES, QUIZ } = window.AtlasContent;
  const Science = window.AtlasScience;
  const Postal = window.AtlasWorldline;
  const PostalData = window.AtlasWorldlineData;
  const PostalWorld = window.AtlasPostalWorld;
  const PostalMap = window.AtlasPostalMapView;
  const Exploration = window.AtlasExploration;
  const PhysicsGame = window.AtlasPhysicsScenarios;
  const PhysicsData = {
    levels: window.AtlasPhysicsData.levels.map((l) => ({
      ...l,
      title: PhysicsGame.byId[l.id].title,
      opening: PhysicsGame.byId[l.id].crisis,
    })),
  };
  PhysicsData.byId = Object.fromEntries(
    PhysicsData.levels.map((l) => [l.id, l]),
  );
  const PhysicsIllustrations = window.AtlasPhysicsAtlasArt;
  const PhysicsArt = {
    ...window.AtlasPhysicsArt,
    landmark: window.AtlasPhysicsMapArt.landmark,
  };
  const MathGame = window.AtlasMathScenarios;
  const MathData = {
    levels: window.AtlasMathData
      ? window.AtlasMathData.levels.map((l) => ({
          ...l,
          title: l.title,
          opening: l.opening,
        }))
      : [],
  };
  if (MathData.levels.length) {
    MathData.byId = Object.fromEntries(MathData.levels.map((l) => [l.id, l]));
  }
  const MathIllustrations = window.AtlasMathAtlasArt;
  const MathArt = {
    ...window.AtlasMathArt,
    landmark: window.AtlasSubjectMapArt.math,
  };
  const ChemData = window.AtlasChemistryData;
  const ChemGame = window.AtlasChemistryScenarios;
  const ChemArt = {
    ...window.AtlasChemistryArt,
    landmark: window.AtlasSubjectMapArt.chemistry,
  };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const escape = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const iconPaths = {
    mail: '<rect x="3" y="5" width="18" height="14"/><path d="m3 5 9 8 9-8"/>',
    cloud:
      '<path d="M7 18a5 5 0 1 1 .6-10A6 6 0 0 1 19 9a4.5 4.5 0 0 1-1 9H7Z"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    book: '<path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-4-2-7-1-10 1Zm0 0v15"/>',
    network:
      '<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="19" r="2.5"/><path d="m7 8 4 8m6-8-4 8M8 6h8"/>',
    hourglass: '<path d="M6 3h12M6 21h12M7 3v4l10 10v4M17 3v4L7 17v4M8 17h8"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1"/>',
    compass:
      '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6 6-2ZM12 1v3M12 20v3M1 12h3M20 12h3"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    play: '<path d="m8 5 11 7-11 7V5Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    atom: '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)"/><ellipse cx="12" cy="12" rx="4" ry="10"/>',
    curve: '<path d="M4 3v17h17M6 6c4 16 8 16 14 0"/>',
    flask:
      '<path d="M9 3h6M10 3v7l-6 9c-.5 1 0 2 2 2h12c2 0 2.5-1 2-2l-6-9V3M7 15h10"/>',
    flag: '<path d="M5 22V3c5-3 8 4 14 1v10c-6 3-9-4-14-1"/>',
    mouse:
      '<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 3v6"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9 9c0-4 7-4 6 0-.5 2-3 2-3 5m0 3v.3"/>',
    back: '<path d="M20 12H5m6-6-6 6 6 6"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    reset: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
    spark:
      '<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/>',
  };
  const icon = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.spark}</svg>`;
  const paintIcons = (root = document) =>
    $$("[data-icon]", root).forEach(
      (el) => (el.innerHTML = icon(el.dataset.icon)),
    );
  paintIcons();
  $("#search-toggle").innerHTML = icon("search");

  const coordinates = {
    M01: [175, 285],
    M02: [330, 210],
    M03: [260, 375],
    M04: [445, 255],
    M05: [535, 170],
    M06: [590, 320],
    M07: [365, 440],
    M08: [585, 425],
    M09: [410, 345],
    M10: [175, 415],
    P01: [1040, 185],
    P02: [1180, 225],
    P03: [1030, 335],
    P04: [1380, 260],
    P05: [1200, 350],
    P06: [1460, 365],
    P07: [1340, 165],
    P08: [1110, 445],
    P09: [1265, 480],
    P10: [1420, 455],
    C01: [520, 650],
    C02: [670, 595],
    C03: [820, 625],
    C04: [700, 720],
    C05: [940, 730],
    C06: [880, 820],
    C07: [1060, 795],
    C08: [600, 825],
    C09: [1050, 880],
    C10: [1180, 845],
  };
  const colors = { P: "#4568ed", M: "#7383cf", C: "#398cbd" };
  const majorNodes = new Set([
    "M02",
    "M03",
    "M05",
    "M06",
    "M08",
    "P01",
    "P04",
    "P05",
    "P08",
    "P09",
    "C02",
    "C04",
    "C06",
    "C08",
    "C10",
  ]);
  const experimentNodes = { P03: "shoot", M06: "func", C06: "mole" };
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
  NODES.forEach((n) => {
    [n.x, n.y] = coordinates[n.id];
    n.exp = experimentNodes[n.id] || null;
  });
  // Refine the retained mathematics and chemistry copy.
  Object.assign(byId.M05, {
    one: "形如 y=ax²+bx+c 且 a≠0 的函数，图像是抛物线。",
  });
  Object.assign(byId.M06, {
    one: "在 y=a(x−h)²+k 中，a 决定开口和宽窄，(h,k) 决定顶点位置。",
  });
  Object.assign(byId.C01, {
    boundary:
      "物理性质可在不改变物质化学组成时观察；化学性质涉及发生化学变化的能力。",
  });
  Object.assign(byId.C02, {
    one: "元素由原子核中质子数相同的一类原子定义，物质可由原子、分子或离子等构成。",
    boundary: "普通化学变化不改变原子核；分子和化学键可以发生变化。",
  });
  Object.assign(byId.C03, {
    one: "价电子参与原子的成键；对本实验中的主族元素，最外层电子帮助解释常见成键方式。",
  });
  Object.assign(byId.C04, {
    one: "原子通过共享电子对形成共价键；一根共价单键通常对应一对共享电子。",
    boundary:
      "共享电子对描述成键方式，氧化还原描述氧化数变化；两者有关联，但不是同一个分类角度。",
  });
  Object.assign(byId.C08, {
    boundary: "本产品讨论普通化学反应；原子种类和数目在配平的反应式中守恒。",
  });
  Object.assign(byId.C09, {
    one: "氧化还原以元素氧化数的变化为特征，可用电子转移或电子偏移描述。",
    boundary:
      "电子转移与共价成键的共享电子对是不同概念；不能仅凭是否存在共价键判断反应类型。",
  });
  QUIZ.C01 = {
    q: "在不知道白色粉末是什么时，应怎样识别？",
    opts: ["直接尝一下", "在指导下比较安全可观察的性质", "只看颜色就下结论"],
    ans: 1,
    fb: "未知物质不能品尝。识别需要合适、安全的性质观察与实验。",
  };
  QUIZ.C04 = {
    q: "共价单键的一个基础描述是？",
    opts: [
      "原子之间共享一对电子",
      "原子核合并为一个原子核",
      "一定发生完整电子转移",
    ],
    ans: 0,
    fb: "共享电子对是基础共价成键模型；它与反应中氧化数变化的描述不同。",
  };
  QUIZ.M09 = {
    q: "在同样的坐标尺度下，图像越陡通常表示？",
    opts: ["变化率的绝对值越大", "变化率一定为正", "函数一定更复杂"],
    ans: 0,
    fb: "陡峭程度对应变化率的绝对值；上升与下降还要看正负。",
  };
  const histories = {
    M: [
      {
        title: "给未知的量起一个名字",
        question: "还不知道答案，能不能先写出关系？",
        text: "用符号表示未知量，让等式成为推理工具。与其直接猜答案，可以先表达量之间满足的条件。",
        node: "M02",
        era: "从计算到代数",
      },
      {
        title: "在数与形之间搭一座桥",
        question: "一个位置能否用数字表示？",
        text: "坐标把几何位置与数联系起来。图形可以被写成关系式，代数关系也可以变成看得见的图像。",
        node: "M03",
        era: "从图形到坐标",
      },
      {
        title: "研究变化中的关系",
        question: "一个量变化时，另一个量会怎样？",
        text: "函数把关注点从某个固定答案转向变量之间的对应。进一步研究变化率，可以比较变化的快慢。",
        node: "M04",
        era: "从静态数值到变量关系",
      },
    ],
    C: [
      {
        title: "从性质追问组成",
        question: "众多物质由什么构成？",
        text: "比较物质的性质、区分元素与化合物，为研究组成提供起点。分类与实验需要一起使用。",
        node: "C02",
        era: "从物质分类到组成",
      },
      {
        title: "用微观模型解释组合",
        question: "为什么组成并不是任意的？",
        text: "原子与分子的模型帮助表达组成规律。分子式记录原子种类和数量，连接关系需要更多信息。",
        node: "C05",
        era: "从组成规律到粒子模型",
      },
      {
        title: "从连接走向空间结构",
        question: "写出分子式就知道分子形状了吗？",
        text: "电子结构与空间模型帮助描述成键和分子构型。模型的图像是解释工具，需要了解其简化和边界。",
        node: "C06",
        era: "从连接到空间模型",
      },
    ],
  };
  const defaultProgress = () => ({
    ...Postal.fields(),
    physicsLevels: {},
    physicsStories: {},
    physicsScenarios: {},
    mathLevels: {},
    mathStories: {},
    mathScenarios: {},
    chemistryScenarios: {},
    storyVisited: [],
    visited: [],
    verified: {},
    expDone: {},
    relations: {},
    experiments: {},
    lastNode: "P05",
    enteredIslands: [],
    fogEnabled: false,
  });
  let progress = defaultProgress(),
    storageAvailable = true,
    storedProgress = null,
    storedBaseline = defaultProgress();
  try {
    storedProgress = localStorage.getItem("knowledge-islands-v2");
    const raw = JSON.parse(storedProgress || "null");
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      storedBaseline = { ...defaultProgress(), ...raw };
      progress = { ...defaultProgress(), ...raw };
      progress.visited = Array.isArray(raw.visited)
        ? raw.visited.filter((id) => byId[id])
        : [];
      for (const key of [
        "verified",
        "expDone",
        "relations",
        "experiments",
        "physicsLevels",
        "physicsStories",
        "physicsScenarios",
        "mathLevels",
        "mathStories",
        "mathScenarios",
        "chemistryScenarios",
      ])
        if (
          !progress[key] ||
          typeof progress[key] !== "object" ||
          Array.isArray(progress[key])
        )
          progress[key] = {};
      if (!byId[progress.lastNode]) progress.lastNode = "P05";
      progress.enteredIslands = Array.isArray(raw.enteredIslands)
        ? raw.enteredIslands.filter((s) => ["P", "M", "C"].includes(s))
        : [];
      progress.fogEnabled = raw.fogEnabled === true;
      progress.storyVisited = Array.isArray(raw.storyVisited)
        ? [
            ...new Set(
              raw.storyVisited.filter(
                (id) =>
                  PhysicsData.byId[id] ||
                  (MathData.byId && MathData.byId[id]) ||
                  ChemData.byId[id],
              ),
            ),
          ]
        : [];
    } else {
      const old = JSON.parse(localStorage.getItem("xkmap_v1") || "null");
      if (old?.progress) {
        progress.visited = (old.progress.visited || []).filter(
          (id) => byId[id],
        );
        progress.verified = old.progress.verified || {};
        progress.expDone = old.progress.expDone || {};
      }
    }
  } catch {
    storageAvailable = false;
  }
  // Normalize the previous chemical campaign before maps and journals read it.
  // The migration carries the original record and historical stars with it.
  for (const [id, record] of Object.entries(progress.chemistryScenarios)) {
    if (ChemData.byId[id] && record?.version === 1)
      progress.chemistryScenarios[id] = ChemGame.restore(id, record);
  }
  const postalGames = { P: PhysicsGame, M: MathGame, C: ChemGame };
  progress = Postal.reconcile(progress, postalGames);
  const progressStore = window.AtlasProgressStore.create({
    storage: {
      getItem: (key) => localStorage.getItem(key),
      setItem: (key, value) => localStorage.setItem(key, value),
    },
    key: "knowledge-islands-v2",
    initial: storedBaseline,
    raw: storedProgress,
  });
  const state = {
    layer: "world",
    subject: "ALL",
    selected: null,
    mode: "knowledge",
    relations: false,
    zoom: 1,
    pan: { x: 0, y: 0 },
    route: null,
    modalKind: null,
    worldCamera: null,
    islandCameras: {},
    lastIsland: "P",
  };
  let activeExperiment = null,
    raf = 0,
    lastFocus = null,
    toastTimer,
    saveTimer;
  let physicsController = null;
  let mathController = null;
  let chemistryController = null;
  let mailController = null;
  let voyageController = null;
  let flightController = null;
  let postalRoomController = null;
  const stage = $("#map-stage"),
    world = $("#world"),
    panel = $("#node-panel"),
    modal = $("#modal"),
    backdrop = $("#modal-backdrop");
  function toast(message) {
    clearTimeout(toastTimer);
    $("#toast").textContent = message;
    $("#toast").classList.add("show");
    toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 3800);
  }
  function save(options) {
    clearTimeout(saveTimer);
    try {
      const previous = progress;
      progress = Postal.reconcile(progress, postalGames);
      const result = progressStore.save(progress, options);
      progress = Postal.reconcile({ ...defaultProgress(), ...result.record }, postalGames);
      const recordKey = voyageController
        ? "researchRuns"
        : physicsController
        ? "physicsScenarios"
        : mathController
          ? "mathScenarios"
          : chemistryController
            ? "chemistryScenarios"
            : null;
      const activeChanged = recordKey
        ? JSON.stringify(previous[recordKey][state.selected]) !==
          JSON.stringify(progress[recordKey][state.selected])
        : activeExperiment &&
          JSON.stringify(previous.experiments) !==
            JSON.stringify(progress.experiments);
      if (
        result.conflicts.length ||
        (result.remoteChanged &&
          (activeChanged ||
            (result.resetChanged && (recordKey || activeExperiment))))
      ) {
        queueMicrotask(() => {
          if (!backdrop.hidden) closeModal();
          toast(
            result.conflicts.length
              ? "另一页已更新记录，已保留本页副本并载入最新进度。请重新进入关卡。"
              : "另一页已更新当前实验，已载入最新进度。请重新进入关卡继续。",
          );
        });
      }
      const recovered=!storageAvailable;
      storageAvailable=true;
      if(recovered&&!result.conflicts.length)toast("本次会话进度已恢复保存。");
      return result.conflicts.length === 0;
    } catch {
      if (storageAvailable) {
        storageAvailable = false;
        toast("当前浏览器无法保存记录，本次探索仍可继续。");
      }
      return false;
    } finally {
      updateSaveStatus();
      updateProgress();
    }
  }
  function updateSaveStatus() {
    document.body.dataset.saveMode=storageAvailable?"persistent":"session";
    const status=$("#save-status");
    status.hidden=storageAvailable;
    const message="仅本次会话：进度未能保存，刷新或关闭页面会丢失本次更改。";
    if(!storageAvailable&&status.textContent!==message)status.textContent=message;
  }
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 250);
  }
  function updateProgress() {
    const delivered = PostalData.chapters.filter(c => progress.mailDeliveries[c.id]).length;
    $("#mail-count").textContent = `${delivered} / 5`;
    document.body.dataset.postalChapter = Postal.current(progress)?.id || "complete";
    const postalSnapshot = PostalWorld.snapshot(progress);
    const quest = PostalMap.quest(postalSnapshot);
    $("#quest-title").textContent = quest.title;
    $("#quest-subtitle").textContent = quest.subtitle;
    $(".quest-card .eyebrow").textContent = postalSnapshot.chapter ? `当前邮路 · ${postalSnapshot.chapter.id}` : "三站往返 · 已恢复";
    if (state.layer === "world") $("#discovery-note-text").textContent = `${postalSnapshot.routeTitle} · ${postalSnapshot.fullCircuit ? "未探索的现场仍保留迷雾" : "三站均可自由前往"}`;
    window.AtlasPhysicsSandbox.patch($("#postal-task-strip"), PostalMap.taskStrip(postalSnapshot));
    const visited = progress.visited.length;
    $("#journal-count").textContent = visited;
    const islandCount = (
      ["P", "M", "C"].includes(state.subject)
        ? progress.storyVisited
        : progress.visited
    ).filter((id) => id.startsWith(state.subject)).length;
    $("#progress-text").textContent =
      state.layer === "world"
        ? `已发现 ${visited} / 30 个地点`
        : `${SUBJECTS[state.subject].name}岛 · 已探索 ${islandCount} / 10 个地标`;
    $("#progress-fill").style.width =
      `${(state.layer === "world" ? visited / 30 : islandCount / 10) * 100}%`;
    if (state.layer === "island" && state.subject === "P")
      $("#progress-text").textContent =
        `物理岛 · 已发现 ${clearedPhysicsCount()}/10 个规律 · 相遇 ${islandCount}/10`;
    if (state.layer === "island" && state.subject === "M")
      $("#progress-text").textContent =
        `数学岛 · 已发现 ${clearedMathCount()}/10 封信件 · 相遇 ${islandCount}/10`;
    if (state.layer === "island" && state.subject === "C")
      $("#progress-text").textContent =
        `化学岛 · 已归档 ${clearedChemistryCount()}/10 个发现 · 相遇 ${islandCount}/10`;
  }
  function isResearchComplete(id) {
    return progress.mailArtifacts[id]?.complete === true;
  }
  function bestResearchStars(id, record) {
    return Math.max(0, Math.min(3, Math.trunc(Math.max(
      Number(progress.mailArtifacts[id]?.bestStars) || 0, Number(record?.bestStars) || 0,
    ))));
  }
  function clearedPhysicsCount() {
    return PhysicsData.levels.filter((l) =>
      isResearchComplete(l.id),
    ).length;
  }
  function nextPhysicsLevel() {
    return (
      PhysicsData.levels.find(
        (l) => !isResearchComplete(l.id),
      )?.id || null
    );
  }
  function clearedMathCount() {
    return MathData.levels
      ? MathData.levels.filter(
          (l) => isResearchComplete(l.id),
        ).length
      : 0;
  }
  function nextMathLevel() {
    return (
      MathData.levels?.find(
        (l) => !isResearchComplete(l.id),
      )?.id || null
    );
  }
  function clearedChemistryCount() {
    return ChemData.levels.filter((l) =>
      isResearchComplete(l.id),
    ).length;
  }
  function nextChemistryLevel() {
    return (
      ChemData.levels.find(
        (l) => !isResearchComplete(l.id),
      )?.id || null
    );
  }
  function renderChemistryIslandDossier() {
    const count = progress.storyVisited.filter((id) =>
      id.startsWith("C"),
    ).length;
    panel.hidden = false;
    panel.classList.add("island-dossier", "level-dossier");
    panel.classList.remove("story-place-panel");
    panel.setAttribute("aria-label", "化学岛故事入口");
    panel.innerHTML = `<button class="panel-close" aria-label="关闭岛屿介绍">${icon("close")}</button><div class="panel-art"><img src="${Exploration.chemistry.art}" alt="化学岛，标本、温室与电化学海岸"><span class="panel-tag">CHEMISTRY / THE SECRET FILES OF MATTER</span></div><div class="panel-content"><h2>物质的秘密档案</h2><p class="panel-question">把变化看清，把物质数清。</p><div class="chem-island-portraits">${["C01", "C04", "C08"].map((id) => ChemArt.portrait(id)).join("")}</div><p class="island-letter-intro">十位研究者，十座化学实验台。鉴别样品、拼原子、摆电子、旋转分子，再把两份证据连成一个解释。</p><div class="dossier-meta"><span><b>${count}</b>/10 次相遇</span><span><b>${clearedChemistryCount()}</b>/10 个发现</span></div><button class="primary-button" id="start-chemistry-island-exploration">${icon("flask")}${count ? "继续未完成的研究" : "在玻璃标本港遇见波义耳"}</button><button class="campaign-outline-button" id="chemistry-campaign-button">▦ 选择一份研究档案 · ${clearedChemistryCount()}/10</button><button class="secondary-button" id="preview-chemistry-island">${icon("search")}先看看完整的岛</button><p class="fog-legend">色彩已恢复 ${clearedChemistryCount()}/10 · 访问揭雾，完成研究恢复原色。</p></div>`;
    $(".panel-close", panel).onclick = () => (panel.hidden = true);
    $("#start-chemistry-island-exploration").onclick = () =>
      startChemistryLevel(nextChemistryLevel() || "C01");
    $("#chemistry-campaign-button").onclick = showChemistryCampaign;
    $("#preview-chemistry-island").onclick = () => {
      progress.fogEnabled = false;
      state.zoom = 1;
      state.pan = { x: 0, y: 0 };
      updateTransform(true);
      save();
      applyScene();
      renderMap();
      panel.hidden = true;
      toast("十份档案已展开。完成研究，地图才会恢复原色。");
    };
    organizePanel();
  }
  function showChemistryNotebook(id) {
    const l = ChemData.byId[id];
    showModal(
      `${modalClose()}<p class="modal-eyebrow">CHEMISTRY / A RESEARCHER'S FIELD NOTES</p><h2 id="modal-title">${escape(l.person)} · ${escape(l.concept)}</h2><p class="modal-subtitle">${escape(l.era)} · ${escape(l.place)}</p><section class="reading-section"><div class="chem-island-portraits">${ChemArt.portrait(id)}</div><h3>史实与人物</h3><p>${escape(l.history)}</p><h3>这次研究的问题</h3><p>${escape(l.opening)}</p><h3>带走一个解释</h3><p>${escape(l.takeaway)}</p><p class="boundary-note">${escape(l.formula)}</p><h3>模型与现实</h3><p>${escape(l.boundary)}</p><p>人物形象为原创示意；地点、对白与任务为教学创作。</p>${l.sources.map(([label, url]) => `<p><a href="${url}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗</a></p>`).join("")}</section><button class="primary-button" id="notebook-enter">走进这份化学档案 →</button>${["C05", "C06"].includes(id) ? '<button class="secondary-button" id="chemistry-free-workshop">打开自由分子工坊 ↗</button>' : ""}`,
      "reading",
    );
    $("#notebook-enter").onclick = () => startChemistryLevel(id);
    $("#chemistry-free-workshop")?.addEventListener("click", () =>
      startExperiment("mole"),
    );
  }
  function startChemistryLevel(id, { legacy = false } = {}) {
    if (!ChemData.byId[id]) return;
    if (!legacy && isPostalResearch(id) && !preferLegacyVoyage(id)) return startPostalResearch(id);
    openNode(id, { focus: false });
    showModal(
      '<div id="chemistry-level-root" class="physics-level-host"></div>',
      "chemistry-story",
    );
    chemistryController = window.AtlasChemistryConsole.create({
      id,
      host: $("#chemistry-level-root"),
      record: progress.chemistryScenarios[id],
      achievement: progress.mailArtifacts[id],
      onUpdate: (record) => {
        const before = isResearchComplete(id);
        acceptLevelRecord(id, record, "chemistryScenarios");
        if (ChemGame.isCleared(record)) {
          progress.verified[id] = true;
          progress.expDone["story-" + id] = true;
        }
        save();
        renderMap();
        if (state.subject === "C")
          $("#quest-title").textContent = nextChemistryLevel()
            ? "下一份档案：" + ChemData.byId[nextChemistryLevel()].place
            : "十份证据，连成一座化学岛";
        if (!before && ChemGame.isCleared(record))
          toast(
            ChemData.byId[id].place +
              " · 发现已归档 · " +
              clearedChemistryCount() +
              "/10",
          );
      },
      onExit: () => {
        closeModal();
        openNode(id, { focus: false });
      },
      onNext: (next) =>
        next ? startChemistryLevel(next) : showChemistryCampaign(),
      onLegacy: () => startExperiment("mole"),
    });
    if (isPostalResearch(id)) addVoyageBridge(id);
  }
  function showChemistryCampaign() {
    const count = clearedChemistryCount();
    showModal(
      `${modalClose()}<p class="modal-eyebrow">CHEMISTRY / THE SECRET FILES OF MATTER</p><h2 id="modal-title">物质的秘密档案</h2><p class="modal-subtitle">从标本港到双杯信号站，十份研究互相接力。先自由观察，再让记录支持你的解释。</p><div class="campaign-stat">${count}<small>/ 10 个发现 · 即时实验 / 单变量对照 / 三星收集</small></div><div class="campaign-grid">${ChemData.levels
        .map((l, i) => {
          const raw = progress.chemistryScenarios[l.id],
            r = ChemGame.restore(l.id, raw),
            done = isResearchComplete(l.id);
          const stars = bestResearchStars(l.id, r);
          return `<button class="campaign-level ${done ? "done" : ""}" data-chemistry-campaign-level="${l.id}" style="--chapter-accent:${l.color};--chapter-panel:${l.panel}"><span class="campaign-mini-portrait">${ChemArt.portrait(l.id)}<small>${String(i + 1).padStart(2, "0")}</small></span><div><h3>${escape(l.person)}</h3><p class="campaign-concept">${escape(l.concept)} · ${escape(l.place)}</p><p class="campaign-question">${escape(l.title)}</p><p class="campaign-status">${done ? "发现已归档" : r.events.length ? "研究进行中 · 可继续" : "打开实验台，自由探索"}</p>${stars ? `<span class="campaign-stars" aria-label="历史最佳 ${stars} 星">${"★".repeat(stars)}${"☆".repeat(3 - stars)} · 人物手记已收录</span>` : ""}</div><b>${done ? "✓" : "↗"}</b></button>`;
        })
        .join(
          "",
        )}</div><p class="campaign-path-note">这是一条从性质、组成到结构与反应的概念路线，非严格年代顺序。人物史料可在手记中查阅；对白与任务为教学创作。所有关卡可自由进入。</p><button class="primary-button" id="chemistry-campaign-continue" style="margin-top:18px">${count === 10 ? "回到化学岛" : "继续研究 · " + ChemData.byId[nextChemistryLevel()].place} →</button>`,
      "campaign",
    );
    modal.classList.add("event-campaign-modal", "chem-campaign-modal");
    $$("[data-chemistry-campaign-level]", modal).forEach(
      (b) =>
        (b.onclick = () =>
          startChemistryLevel(b.dataset.chemistryCampaignLevel)),
    );
    $("#chemistry-campaign-continue").onclick = () => {
      if (count === 10) {
        closeModal();
        setSubject("C");
      } else startChemistryLevel(nextChemistryLevel());
    };
  }
  function updateTransform(animate = false) {
    const base = state.layer === "world"
      ? window.AtlasMapCamera.worldFit(stage.clientWidth, stage.clientHeight)
      : Math.max(stage.clientWidth / 1600, stage.clientHeight / 1000);
    const scale = base * state.zoom;
    const maxPanX = Math.max(0, (1600 * scale - stage.clientWidth) / 2),
      maxPanY = Math.max(0, (1000 * scale - stage.clientHeight) / 2);
    state.pan.x = Math.max(-maxPanX, Math.min(maxPanX, state.pan.x));
    state.pan.y = Math.max(-maxPanY, Math.min(maxPanY, state.pan.y));
    world.style.transition =
      animate && !matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "transform .55s cubic-bezier(.2,.7,.3,1)"
        : "none";
    world.style.transform = `translate(calc(-50% + ${state.pan.x}px),calc(-50% + ${state.pan.y}px)) scale(${scale})`;
    world.style.setProperty("--postal-pin-scale", state.layer === "world"
      ? window.AtlasMapCamera.stationScale(scale, stage.clientWidth, stage.clientHeight)
      : Math.max(1, .72 / scale));
    world.style.setProperty("--island-label-scale", window.AtlasMapCamera.islandScale(scale, stage.clientWidth, stage.clientHeight));
    $("#zoom-value").textContent = `${Math.round(state.zoom * 100)}%`;
    $("#zoom-out").disabled = state.zoom <= 1;
    $("#zoom-in").disabled = state.zoom >= 2.5;
    world.classList.toggle("detailed", state.zoom > 1.25);
    return scale;
  }
  function fitMap() {
    if (state.layer === "island")
      state.islandCameras[state.subject] = {
        zoom: state.zoom,
        pan: { ...state.pan },
      };
    state.layer = "world";
    state.zoom = state.worldCamera?.zoom || 1;
    state.pan = { ...(state.worldCamera?.pan || { x: 0, y: 0 }) };
    state.subject = "ALL";
    state.selected = null;
    applyScene();
    updateSubjectNav();
    updateTransform(true);
    renderMap();
    panel.hidden = true;
  }
  function focusNode(n, animate = true) {
    if (stage.clientWidth > 700 && n.x > 1300)
      state.zoom = Math.max(state.zoom, 1.9);
    const base = Math.max(stage.clientWidth / 1600, stage.clientHeight / 1000);
    let scale = base * state.zoom;
    const safeWidth =
      stage.clientWidth > 700 ? stage.clientWidth - 305 : stage.clientWidth;
    const desiredX =
      stage.clientWidth > 700
        ? Math.min(stage.clientWidth / 2, safeWidth * 0.65)
        : stage.clientWidth / 2;
    const desiredY =
      stage.clientHeight * (stage.clientWidth > 700 ? 0.5 : 0.42);
    const screenX = stage.clientWidth / 2 + (n.x - 800) * scale + state.pan.x;
    const screenY = stage.clientHeight / 2 + (n.y - 500) * scale + state.pan.y;
    if (screenX < 80 || screenX > safeWidth - 12) {
      if (state.zoom < 1.4) {
        state.zoom = 1.4;
        scale = base * state.zoom;
      }
      state.pan.x = desiredX - stage.clientWidth / 2 - (n.x - 800) * scale;
    }
    if (screenY < 130 || screenY > stage.clientHeight - 150) {
      if (state.zoom < 1.25) {
        state.zoom = 1.25;
        scale = base * state.zoom;
      }
      state.pan.y = desiredY - stage.clientHeight / 2 - (n.y - 500) * scale;
    }
    updateTransform(animate);
  }
  function setSubject(subject) {
    if (subject === "ALL") {
      fitMap();
      return;
    }
    if (state.layer === "world")
      state.worldCamera = { zoom: state.zoom, pan: { ...state.pan } };
    else
      state.islandCameras[state.subject] = {
        zoom: state.zoom,
        pan: { ...state.pan },
      };
    state.layer = "island";
    state.lastIsland = subject;
    state.subject = subject;
    state.selected = null;
    panel.hidden = true;
    state.zoom = state.islandCameras[subject]?.zoom || 1;
    state.pan = { ...(state.islandCameras[subject]?.pan || { x: 0, y: 0 }) };
    if (!progress.enteredIslands.includes(subject))
      progress.enteredIslands.push(subject);
    applyScene();
    updateSubjectNav();
    updateTransform(true);
    renderMap();
    if (subject === "P") renderIslandDossier();
    else if (subject === "M") renderMathIslandDossier();
    else if (subject === "C") renderChemistryIslandDossier();
    save();
  }
  function applyScene() {
    const geography = {
      P: Exploration.physics,
      M: Exploration.math,
      C: Exploration.chemistry,
    };
    const inWorld = state.layer === "world",
      island = inWorld ? null : geography[state.subject];
    NODES.forEach((n) => {
      [n.x, n.y] =
        island && n.s === state.subject
          ? island.positions[n.id]
          : coordinates[n.id];
    });
    const art = $("#world-art"),
      source = island ? island.art : Exploration.world.art;
    if (art.getAttribute("src") !== source) art.src = source;
    const harbor = $(".harbor-label");
    harbor.style.left = Exploration.world.harbor.x + "px";
    harbor.style.top = Exploration.world.harbor.y + 45 + "px";
    harbor.style.transform = "translateX(-50%)";
    art.alt = island
      ? island.name + "：十座人物故事与学科实验地标"
      : "知识群岛世界地图";
    world.classList.toggle("is-world-map", inWorld);
    for (const [key, name] of [
      ["P", "physics"],
      ["M", "math"],
      ["C", "chemistry"],
    ])
      world.classList.toggle(
        "is-" + name + "-island",
        !inWorld && state.subject === key,
      );
    stage.dataset.layer = state.layer;
    stage.dataset.subject = state.subject;
    $("#chapter-heading").hidden = inWorld;
    const headings = {
      P: [
        "01",
        "物理岛 · 十场未决的探索",
        "从浮力与自由落体，到电磁与量子。选择你的身份，在每一次尝试中寻找规律。",
      ],
      M: [
        "02",
        "数学岛 · 十封未寄出的信",
        "从整数与未知数，到坐标与函数。在参数与公理间推演，给未来写下证明。",
      ],
      C: [
        "03",
        "化学岛 · 物质的秘密档案",
        "从玻璃标本到分子与电子。用两份证据，解释眼前的变化。",
      ],
    };
    if (island) {
      const h = headings[state.subject];
      $("#chapter-heading").innerHTML =
        `<span>CHAPTER ${h[0]}</span><h2>${h[1]}</h2><p>${h[2]}</p>`;
    }
    $("#level-regions").innerHTML = island
      ? island.regions
          .map(
            (r) =>
              `<div class="region-label" style="left:${r.x}px;top:${r.y}px"><span>${r.english}</span><h2>${r.name}</h2></div>`,
          )
          .join("")
      : "";
    $("#island-trails").innerHTML = island
      ? island.trails
          .map(
            (ids) =>
              `<polyline class="exploration-trail" points="${ids.map((id) => island.positions[id].join(",")).join(" ")}"/>`,
          )
          .join("")
      : "";
    $("#world-perspective").classList.toggle("active", inWorld);
    $("#world-perspective").setAttribute("aria-pressed", inWorld);
    $("#island-perspective").classList.toggle("active", !inWorld);
    $("#island-perspective").setAttribute("aria-pressed", !inWorld);
    $("#island-perspective-label").textContent =
      `当前关卡 · ${SUBJECTS[state.lastIsland].name}岛`;
    const next = inWorld
      ? null
      : { P: nextPhysicsLevel, M: nextMathLevel, C: nextChemistryLevel }[
          state.subject
        ]();
    const data = { P: PhysicsData, M: MathData, C: ChemData };
    $("#quest-title").textContent = inWorld
      ? "三座岛，三十场发现"
      : next
        ? `下一关：${data[state.subject].byId[next].title}`
        : `${SUBJECTS[state.subject].name}岛远征完成 · 回看你的发现`;
    $("#quest-subtitle").textContent = inWorld
      ? "从迷雾中的问题，走向自然、数学与物质的规律"
      : {
          P: "选择身份，让实验和抉择改变故事",
          M: "推演参数，解开十位数学先驱的危机",
          C: "动手观察，用原子与电子解释变化",
        }[state.subject];
    $("#discovery-note-text").textContent = inWorld
      ? "未探索的海域，等待你的足迹。"
      : "每个地标都是一个问题。完成研究，让附近地图恢复色彩。";
    $("#fog-toggle").setAttribute("aria-pressed", progress.fogEnabled);
  }
  let colorSceneKey = "",
    colorDiscoveryIds = new Set(),
    mapColorReveal = { full: false, areas: [] };
  const pendingMapColors = new Set();
  function mapDiscoveries() {
    return NODES.filter(n => isResearchComplete(n.id)).map(n => n.id);
  }
  function renderMapColor() {
    const discoveries = mapDiscoveries();
    const reveal = Exploration.colorAreas(
      state.layer,
      state.subject,
      discoveries,
    );
    mapColorReveal = reveal;
    const key = state.layer + state.subject;
    const animate =
      key === colorSceneKey &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;
    const concealed = !$("#modal-backdrop").hidden;
    if (colorSceneKey)
      for (const id of discoveries)
        if (!colorDiscoveryIds.has(id)) pendingMapColors.add(id);
    const source =
      state.layer === "island" && state.subject === "P"
        ? Exploration.physics.art
        : state.layer === "island" && state.subject === "M"
          ? Exploration.math.art
          : state.layer === "island" && state.subject === "C"
            ? Exploration.chemistry.art
            : Exploration.world.art;
    const circles = reveal.areas
      .map((a) => {
        const queued =
          a.id.length === 1
            ? [...pendingMapColors].some((id) => id.startsWith(a.id))
            : pendingMapColors.has(a.id);
        const fresh =
          !concealed &&
          animate &&
          (queued ||
            (a.id.length === 1
              ? discoveries.filter((id) => id.startsWith(a.id)).length >
                [...colorDiscoveryIds].filter((id) => id.startsWith(a.id))
                  .length
              : !colorDiscoveryIds.has(a.id)));
        return `<ellipse cx="${a.x}" cy="${a.y}" rx="${a.rx}" ry="${a.ry}" fill="white">${fresh ? `<animate attributeName="rx" from="0" to="${a.rx}" dur="1.4s"/><animate attributeName="ry" from="0" to="${a.ry}" dur="1.4s"/>` : ""}</ellipse>`;
      })
      .join("");
    $("#map-color-layer").innerHTML =
      `<defs><filter id="color-soft-edge"><feGaussianBlur stdDeviation="21"/></filter><mask id="discovery-color-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><g filter="url(#color-soft-edge)">${reveal.full ? '<rect width="1600" height="1000" fill="white"/>' : circles}</g></mask></defs><image href="${source}" width="1600" height="1000" preserveAspectRatio="xMidYMid slice" mask="url(#discovery-color-mask)"/>`;
    $("#map-color-layer").dataset.discoveries = discoveries.length;
    $("#map-color-layer").dataset.full = reveal.full;
    world.classList.toggle("has-map-color", reveal.areas.length > 0);
    colorSceneKey = key;
    colorDiscoveryIds = new Set(discoveries);
    if (!concealed) pendingMapColors.clear();
  }
  function renderFog() {
    const applicable =
      state.layer === "world" || ["P", "M", "C"].includes(state.subject);
    stage.dataset.fog = !progress.fogEnabled || !applicable || mapColorReveal.full ? "off" : "on";
    world.classList.toggle(
      "fog-disabled",
      !progress.fogEnabled || !applicable || mapColorReveal.full,
    );
    const areas = Exploration.fogAreas(
      state.layer,
      state.subject,
      state.layer === "island" && ["P", "M", "C"].includes(state.subject)
        ? progress.storyVisited
        : progress.visited,
      progress.enteredIslands,
    );
    areas.push(
      ...mapColorReveal.areas.map((a) => ({
        x: a.x,
        y: a.y,
        radius: Math.max(a.rx, a.ry) + 25,
      })),
    );
    $("#map-fog").innerHTML =
      `<defs><filter id="fog-feather" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="27"/></filter><mask id="exploration-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"><rect width="1600" height="1000" fill="white"/>${areas.map((a) => `<circle cx="${a.x}" cy="${a.y}" r="${a.radius}" fill="black" filter="url(#fog-feather)"/>`).join("")}</mask><linearGradient id="fog-shade" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f6f9ff"/><stop offset=".5" stop-color="#dfe9fc"/><stop offset="1" stop-color="#f4f8ff"/></linearGradient><pattern id="fog-contours" width="190" height="140" patternUnits="userSpaceOnUse"><path d="M-30 70Q30 20 110 65T230 65M-30 85Q30 35 110 80T230 80M-30 100Q30 50 110 95T230 95" fill="none" stroke="#88a9e8" stroke-opacity=".07" stroke-width="1"/></pattern></defs><g mask="url(#exploration-mask)"><rect width="1600" height="1000" fill="url(#fog-shade)" opacity=".96"/><rect width="1600" height="1000" fill="url(#fog-contours)"/></g>`;
    return areas;
  }
  function organizePanel() {
    const content = $(".panel-content", panel);
    if (!content || $(".panel-details", content)) return;
    const actions = [...content.children].filter((el) =>
      el.matches(
        "button.primary-button, button.secondary-button, button.campaign-outline-button",
      ),
    );
    const details = document.createElement("div");
    details.className = "panel-details";
    while (content.firstChild) details.append(content.firstChild);
    const commands = document.createElement("div");
    commands.className = "panel-commands";
    commands.append(...actions);
    content.append(details, commands);
  }
  function renderWorldDossier(subject = "P") {
    const place = Exploration.worldPortals[subject],
      count = progress.storyVisited.filter((id) =>
        id.startsWith(subject),
      ).length;
    panel.hidden = false;
    panel.classList.add("island-dossier");
    panel.classList.remove("level-dossier", "story-place-panel");
    panel.setAttribute("aria-label", "岛屿探索入口");
    const preview =
      subject === "P"
        ? Exploration.physics.art
        : subject === "C"
          ? Exploration.chemistry.art
          : Exploration.math.art;
    panel.innerHTML = `<button class="panel-close" aria-label="关闭岛屿介绍">${icon("close")}</button><div class="panel-art"><img src="${preview}" alt="${place.name}预览"><span class="panel-tag">${subject === "P" ? "CHAPTER 01 · 第一座远征岛" : subject === "M" ? "CHAPTER 02 · 第二座远征岛" : "CHAPTER 03 · 第三座远征岛"}</span></div><div class="panel-content"><h2>${place.name}</h2><p class="panel-question">${place.caption}</p><p class="panel-description">${place.description}</p><div class="dossier-meta"><span><b>10</b>知识地标</span><span><b>${count}</b>已经探索</span></div><button class="primary-button" id="enter-island">${icon("flag")}进入${place.name}</button><div class="dossier-chapters"><small>在这座岛上发现</small>${(subject === "P" ? ["测量与运动 · 港口、钟楼与轨道台", "热功与波光 · 落锤工坊与双缝光庭", "电磁海岸 · 磁铁、线圈与隔海信号", "量子高地 · 矿石、炉光与光电子"] : subject === "M" ? ["数与未知量", "坐标与函数映射", "几何变换与公理证明", "向量、微积分与建模"] : ["原子与元素", "成键与分子", "化学反应"]).map((t) => `<p>${t}</p>`).join("")}</div><p class="fog-legend">${subject === "P" ? "从港口开始调查，让未知慢慢变成航图。" : subject === "M" ? "从琴弦庭院开始推演，让公理与方程写下证明。" : "从玻璃标本港出发，用原子与电子解释变化。"}</p></div>`;
    const colored = mapDiscoveries().filter((id) =>
      id.startsWith(subject),
    ).length;
    $(".dossier-meta", panel).insertAdjacentHTML(
      "afterend",
      `<div class="color-restoration"><i></i> 色彩已恢复 <b>${colored} / 10</b> · 完成探索，点亮地图</div>`,
    );
    $(".panel-close", panel).onclick = () => (panel.hidden = true);
    $("#enter-island").onclick = () => setSubject(subject);
    organizePanel();
  }
  function renderIslandDossier() {
    const count = progress.storyVisited.filter((id) =>
      id.startsWith("P"),
    ).length;
    panel.hidden = false;
    panel.classList.add("island-dossier", "level-dossier");
    panel.classList.remove("story-place-panel");
    panel.setAttribute("aria-label", "物理岛故事入口");
    panel.innerHTML = `<button class="panel-close" aria-label="关闭岛屿介绍">${icon("close")}</button><div class="panel-art"><img src="${Exploration.physics.art}" alt="物理岛：十场未决事件的实验地景"><span class="panel-tag">PHYSICS / TEN UNRESOLVED EVENTS</span></div><div class="panel-content"><h2>十场未决的探索</h2><p class="panel-question">回到科学问题尚未解决的那一刻。</p><div class="dossier-story-people">${["P01", "P02", "P03"].map((id) => PhysicsArt.portrait(id)).join("")}</div><p class="island-letter-intro">十位科学家，十座实验台。先自由观察，再正式记录；通过对照研究收集星星，让证据改变故事的结局。</p><div class="dossier-meta"><span><b>${count}</b>/10 次相遇</span><span><b>${clearedPhysicsCount()}</b>/10 个发现</span></div><button class="primary-button" id="start-island-exploration">${icon("flag")}${count ? "继续未完成的探索" : "在潮汐港遇见阿基米德"}</button><button class="campaign-outline-button" id="physics-campaign-button">▦ 选择一场科学事件 · ${clearedPhysicsCount()}/10</button><button class="secondary-button" id="preview-island">${icon("search")}先看看完整的岛</button><p class="fog-legend">每个地标都是一座即时物理沙盒。所有关卡均可自由进入。</p></div>`;
    $(".panel-close", panel).onclick = () => (panel.hidden = true);
    $("#start-island-exploration").onclick = () =>
      startPhysicsLevel(nextPhysicsLevel() || "P01");
    $(".fog-legend", panel).textContent =
      `色彩已恢复 ${clearedPhysicsCount()}/10 · 每完成一场探索，附近地图就会恢复原色。`;
    $("#physics-campaign-button").onclick = showPhysicsCampaign;
    $("#preview-island").onclick = () => {
      progress.fogEnabled = false;
      state.zoom = 1;
      state.pan = { x: 0, y: 0 };
      updateTransform(true);
      save();
      applyScene();
      renderMap();
      panel.hidden = true;
      toast("十段记忆已展开。随时可以恢复探索迷雾。");
    };
    organizePanel();
  }
  function renderMathIslandDossier() {
    const count = progress.storyVisited.filter((id) =>
      id.startsWith("M"),
    ).length;
    panel.hidden = false;
    panel.classList.add("island-dossier", "level-dossier");
    panel.classList.remove("story-place-panel");
    panel.setAttribute("aria-label", "数学岛故事入口");
    panel.innerHTML = `<button class="panel-close" aria-label="关闭岛屿介绍">${icon("close")}</button><div class="panel-art"><img src="${Exploration.math?.art || Exploration.world.art}" alt="科学记忆中的数学岛"><span class="panel-tag">MATHEMATICS / TEN UNPOSTED LETTERS</span></div><div class="panel-content"><h2>十封未寄出的信</h2><p class="panel-question">重返数学公理与证明诞生的历史现场。</p><div class="dossier-story-people">${["M01", "M02", "M03"].map((id) => MathArt.portrait(id)).join("")}</div><p class="island-letter-intro">十位数学先驱，十座即时实验台。连续调参、公平对照、三星收集，用严密证明给未来写下回信。</p><div class="dossier-meta"><span><b>${count}</b>/10 次相遇</span><span><b>${clearedMathCount()}</b>/10 个发现</span></div><button class="primary-button" id="start-math-island-exploration">${icon("flag")}${count ? "继续未完成的探索" : "在琴弦庭院遇见毕达哥拉斯"}</button><button class="campaign-outline-button" id="math-campaign-button">▦ 选择一场数学事件 · ${clearedMathCount()}/10</button><button class="secondary-button" id="preview-math-island">${icon("search")}先看看完整的岛</button><p class="fog-legend">每个地标都是一座即时数学沙盒。所有关卡均可自由进入。</p></div>`;
    $(".panel-close", panel).onclick = () => (panel.hidden = true);
    $("#start-math-island-exploration").onclick = () =>
      startMathLevel(nextMathLevel() || "M01");
    $(".fog-legend", panel).textContent =
      `色彩已恢复 ${clearedMathCount()}/10 · 每完成一场探索，附近地图就会恢复原色。`;
    $("#math-campaign-button").onclick = showMathCampaign;
    $("#preview-math-island").onclick = () => {
      progress.fogEnabled = false;
      state.zoom = 1;
      state.pan = { x: 0, y: 0 };
      updateTransform(true);
      save();
      applyScene();
      renderMap();
      panel.hidden = true;
      toast("十封信件已展开。随时可以恢复探索迷雾。");
    };
    organizePanel();
  }
  function updateSubjectNav() {
    $$("button[data-subject]").forEach((b) => {
      const active = b.dataset.subject === state.subject;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", active);
    });
  }
  function renderMap() {
    renderMapColor();
    const postalSnapshot = PostalWorld.snapshot(progress);
    const postalRoutes = $("#postal-routes");
    postalRoutes.toggleAttribute("hidden", state.layer !== "world");
    if (state.layer === "world" && postalRoutes.dataset.phase !== String(postalSnapshot.phase)) {
      postalRoutes.innerHTML = PostalMap.routes(postalSnapshot);
      postalRoutes.dataset.phase = postalSnapshot.phase;
    }
    $("#postal-local-pins").innerHTML = state.layer === "world" ? "" : PostalMap.localStation(state.subject, postalSnapshot);
    world.classList.toggle("relations-on", state.relations);
    world.classList.toggle("history-mode", state.mode === "history");
    const areas = renderFog();
    if (state.layer === "world") {
      $("#map-nodes").innerHTML = PostalMap.stations(postalSnapshot);
      $("#world-edges").innerHTML = "";
      updateProgress();
      return;
    }
    const detailed = state.subject !== "ALL" || state.zoom > 1.25;
    $("#map-nodes").innerHTML = NODES.filter((n) => n.s === state.subject)
      .map((n) => {
        const selected = n.id === state.selected;
        const verified = isResearchComplete(n.id);
        const physics = state.subject === "P";
        const math = state.subject === "M";
        const chemistry = state.subject === "C";
        const unknown =
          (physics || math || chemistry) &&
          progress.fogEnabled &&
          !Exploration.isRevealed(n, areas) &&
          !(
            physics || math || chemistry
              ? progress.storyVisited
              : progress.visited
          ).includes(n.id);
        const cls = [
          "map-node",
          n.exp ? "experiment" : "",
          !detailed && !majorNodes.has(n.id) && !selected ? "minor" : "",
          selected ? "selected" : "",
          progress.visited.includes(n.id) ? "visited" : "",
          verified ? "verified" : "",
          state.subject !== "ALL" && n.s !== state.subject
            ? "filtered-out"
            : "",
          state.mode === "history" ? "history-pin" : "",
          physics || math || chemistry ? "island-landmark" : "",
          unknown ? "unknown" : "",
        ]
          .filter(Boolean)
          .join(" ");
        if (physics) {
          const l = PhysicsData.byId[n.id],
            r = progress.physicsScenarios[n.id],
            done = isResearchComplete(n.id);
          return `<button class="${cls} ${done ? "level-cleared" : ""}" data-node="${n.id}" title="单击查看介绍，双击进入关卡" style="left:${n.x}px;top:${n.y}px;--node-color:${colors.P}" aria-label="${unknown ? "未解决事件，点击走近" : escape(l.person + " · " + l.place)}"><span class="story-map-art">${PhysicsArt.landmark(n.id)}</span><span class="story-map-seal">${done ? "✓" : n.id.slice(1)}</span><span class="node-label"><span class="node-place-name">${unknown ? "一个未解决的事件" : l.place}</span><span class="story-map-person">${unknown ? "进入这场探索" : l.person + (done ? " · 已有发现" : "")}</span></span></button>`;
        }
        if (math) {
          const l = MathData.byId[n.id],
            r = progress.mathScenarios?.[n.id],
            done = isResearchComplete(n.id);
          return `<button class="${cls} ${done ? "level-cleared" : ""}" data-node="${n.id}" title="单击查看介绍，双击进入关卡" style="left:${n.x}px;top:${n.y}px;--node-color:${colors.M}" aria-label="${unknown ? "未解决事件，点击走近" : escape(l.person + " · " + l.place)}"><span class="story-map-art">${MathArt.landmark(n.id)}</span><span class="story-map-seal">${done ? "✓" : n.id.slice(1)}</span><span class="node-label"><span class="node-place-name">${unknown ? "一个未解决的事件" : l.place}</span><span class="story-map-person">${unknown ? "进入这场探索" : l.person + (done ? " · 已有发现" : "")}</span></span></button>`;
        }
        if (chemistry) {
          const l = ChemData.byId[n.id],
            done = isResearchComplete(n.id);
          return `<button class="${cls} ${done ? "level-cleared" : ""}" data-node="${n.id}" title="单击查看介绍，双击进入关卡" style="left:${n.x}px;top:${n.y}px;--node-color:${colors.C}" aria-label="${unknown ? "未解决事件，点击走近" : escape(l.person + " · " + l.place)}"><span class="story-map-art">${ChemArt.landmark(n.id)}</span><span class="story-map-seal">${done ? "✓" : n.id.slice(1)}</span><span class="node-label"><span class="node-place-name">${unknown ? "一份未解的档案" : l.place}</span><span class="story-map-person">${unknown ? "走近这座实验台" : l.person + (done ? " · 已有发现" : "")}</span></span></button>`;
        }
        return `<button class="${cls}" data-node="${n.id}" title="单击查看介绍，双击进入关卡" style="left:${n.x}px;top:${n.y}px;--node-color:${colors[n.s]}" aria-label="${unknown ? "未探索地标，点击调查" : escape(n.title) + "，" + SUBJECTS[n.s].name + (verified ? "，已验证" : "")}"><span class="node-pin">${unknown ? "?" : icon(verified ? "check" : state.mode === "history" ? "hourglass" : n.exp ? { shoot: "play", func: "curve", mole: "flask" }[n.exp] : majorNodes.has(n.id) ? "spark" : "")}</span><span class="node-label">${unknown ? "未探索地标" : physics ? `<span class="node-place-name">${Exploration.physics.landmarks[n.id]}${n.exp ? " ↗" : ""}</span><span class="node-concept-name">${escape(n.title)}</span>` : escape(n.title) + (n.exp ? " ↗" : "")}</span></button>`;
      })
      .join("");
    renderEdges();
    updateProgress();
  }
  function renderEdges() {
    if (state.layer === "world") {
      $("#world-edges").innerHTML = "";
      return;
    }
    let edges = state.relations
      ? EDGES
      : state.selected
        ? EDGES.filter(
            (e) => e.from === state.selected || e.to === state.selected,
          )
        : [];
    if (state.subject !== "ALL" && state.relations)
      edges = edges.filter(
        (e) =>
          byId[e.from].s === state.subject && byId[e.to].s === state.subject,
      );
    if (state.mode === "history") edges = [];
    if (state.route) {
      const route = ROUTES.find((r) => r.id === state.route);
      edges = route.path.slice(1).map((id, i) => ({
        id: `route-${i}`,
        from: route.path[i],
        to: id,
        type: "route",
        label: "推荐探索路线",
      }));
    }
    edges = edges.filter(
      (e) => byId[e.from].s === state.subject && byId[e.to].s === state.subject,
    );
    const defs =
      '<defs><marker id="edge-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#4568ed"/></marker></defs>';
    $("#world-edges").innerHTML =
      defs +
      edges
        .map((e, index) => {
          const a = byId[e.from],
            b = byId[e.to],
            cross = a.s !== b.s;
          const dx = b.x - a.x,
            dy = b.y - a.y,
            bend = cross ? -Math.min(120, Math.abs(dx) * 0.2) : -25;
          const cx = (a.x + b.x) / 2,
            cy = (a.y + b.y) / 2 + bend;
          const label = state.relations
            ? ""
            : cross && index < 5
              ? `<text class="edge-label" x="${cx}" y="${(a.y + b.y) / 2 + bend / 2 - 10}" text-anchor="middle">${escape(e.id === "eX2" ? "函数描述理想轨迹" : e.type === "route" ? "推荐探索路线" : "跨学科联系")}</text>`
              : "";
          return `<g><path class="relation-path ${e.type === "prep" ? "prep" : ""} ${e.type === "route" ? "route-path" : ""}" data-edge="${e.id}" d="M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}" ${e.undirected || e.type === "route" ? "" : 'marker-end="url(#edge-arrow)"'}><title>${escape(e.label)}</title></path>${label}</g>`;
        })
        .join("");
  }
  function openNode(id, { focus = true } = {}) {
    const n = byId[id];
    if (!n) return;
    if (state.layer === "world" || state.subject !== n.s) setSubject(n.s);
    state.selected = id;
    if (!progress.visited.includes(id)) progress.visited.push(id);
    if (["P", "M", "C"].includes(n.s) && !progress.storyVisited.includes(id))
      progress.storyVisited.push(id);
    progress.lastNode = id;
    progress = Postal.visit(progress, id);
    save();
    renderMap();
    renderPanel(n);
    applyScene();
    if (focus) focusNode(n);
  }
  function renderPhysicsPanel(n) {
    const l = PhysicsData.byId[n.id],
      r = progress.physicsScenarios[n.id],
      done = isResearchComplete(n.id),
      route = ROUTES.find((r) => r.id === state.route),
      at = route?.path.indexOf(n.id);
    const links = EDGES.filter((e) => e.from === n.id || e.to === n.id).slice(
      0,
      3,
    );
    panel.classList.remove("island-dossier", "level-dossier");
    panel.classList.add("story-place-panel");
    panel.hidden = false;
    panel.setAttribute("aria-label", l.person + "的故事");
    panel.innerHTML = `<button class="panel-close" aria-label="关闭人物介绍">${icon("close")}</button><div class="story-panel-portrait event-panel-portrait"><small>EVENT ${n.id.slice(1)} / 10</small>${PhysicsIllustrations.scene(n.id)}<span>${l.place}</span></div><div class="panel-content">${route ? `<div class="route-banner">${escape(route.title)} · ${at + 1}/${route.path.length}<div class="route-navigation">${at < route.path.length - 1 ? `<button data-route-next="${route.path[at + 1]}">下一站 →</button>` : ""}<button data-route-exit>结束路线</button></div></div>` : ""}<p class="node-region-tag">${l.era}</p><h2>${l.person}</h2><p class="panel-question">${l.title}</p><p class="story-panel-description">${l.opening}</p><button class="primary-button" data-primary="${n.id}">${icon("play")}${done ? "重玩，寻找另一种结局" : r?.role ? "继续这场探索" : "选择身份，进入事件"}</button><button class="secondary-button" data-read="${n.id}">${icon("book")}人物与科学手记</button><div class="panel-relations"><span>这次发现，还连接着</span>${links
      .map((e) => {
        const o = byId[e.from === n.id ? e.to : e.from];
        return `<button class="related-node" data-related="${o.id}">${o.title}${icon("arrow")}</button>`;
      })
      .join("")}</div></div>`;
    $(".panel-close", panel).onclick = () => {
      panel.hidden = true;
      state.selected = null;
      renderMap();
    };
    $("[data-primary]", panel).onclick = () => startPhysicsLevel(n.id);
    $("[data-read]", panel).onclick = () => showPhysicsNotebook(n.id);
    $$("[data-related]", panel).forEach(
      (b) =>
        (b.onclick = () => {
          const e = links.find(
            (e) => e.from === b.dataset.related || e.to === b.dataset.related,
          );
          if (e?.cross) showRelation(e);
          else openNode(b.dataset.related);
        }),
    );
    $("[data-route-next]", panel)?.addEventListener("click", (e) =>
      openNode(e.currentTarget.dataset.routeNext),
    );
    $("[data-route-exit]", panel)?.addEventListener("click", () => {
      state.route = null;
      renderMap();
      renderPhysicsPanel(n);
    });
    organizePanel();
  }
  function renderMathPanel(n) {
    const l = MathData.byId[n.id],
      r = progress.mathScenarios?.[n.id],
      done = isResearchComplete(n.id),
      route = ROUTES.find((r) => r.id === state.route),
      at = route?.path.indexOf(n.id);
    const links = EDGES.filter((e) => e.from === n.id || e.to === n.id).slice(
      0,
      3,
    );
    panel.classList.remove("island-dossier", "level-dossier");
    panel.classList.add("story-place-panel");
    panel.hidden = false;
    panel.setAttribute("aria-label", l.person + "的故事");
    panel.innerHTML = `<button class="panel-close" aria-label="关闭人物介绍">${icon("close")}</button><div class="story-panel-portrait event-panel-portrait"><small>EVENT ${n.id.slice(1)} / 10</small>${MathIllustrations?.scene ? MathIllustrations.scene(n.id) : window.AtlasMathPixelWorlds?.scene ? window.AtlasMathPixelWorlds.scene(n.id) : ""}<span>${l.place}</span></div><div class="panel-content">${route ? `<div class="route-banner">${escape(route.title)} · ${at + 1}/${route.path.length}<div class="route-navigation">${at < route.path.length - 1 ? `<button data-route-next="${route.path[at + 1]}">下一站 →</button>` : ""}<button data-route-exit>结束路线</button></div></div>` : ""}<p class="node-region-tag">${l.era}</p><h2>${l.person}</h2><p class="panel-question">${l.title}</p><p class="story-panel-description">${l.opening}</p><button class="primary-button" data-primary="${n.id}">${icon("play")}${done ? "重玩，寻找另一种结局" : r?.role ? "继续这场探索" : "选择身份，进入事件"}</button><button class="secondary-button" data-read="${n.id}">${icon("book")}人物与数学手记</button><div class="panel-relations"><span>这次发现，还连接着</span>${links
      .map((e) => {
        const o = byId[e.from === n.id ? e.to : e.from];
        return `<button class="related-node" data-related="${o.id}">${o.title}${icon("arrow")}</button>`;
      })
      .join("")}</div></div>`;
    $(".panel-close", panel).onclick = () => {
      panel.hidden = true;
      state.selected = null;
      renderMap();
    };
    $("[data-primary]", panel).onclick = () => startMathLevel(n.id);
    $("[data-read]", panel).onclick = () => showMathNotebook(n.id);
    $$("[data-related]", panel).forEach(
      (b) =>
        (b.onclick = () => {
          const e = links.find(
            (e) => e.from === b.dataset.related || e.to === b.dataset.related,
          );
          if (e?.cross) showRelation(e);
          else openNode(b.dataset.related);
        }),
    );
    $("[data-route-next]", panel)?.addEventListener("click", (e) =>
      openNode(e.currentTarget.dataset.routeNext),
    );
    $("[data-route-exit]", panel)?.addEventListener("click", () => {
      state.route = null;
      renderMap();
      renderMathPanel(n);
    });
    organizePanel();
  }
  function renderChemistryPanel(n) {
    const l = ChemData.byId[n.id],
      r = progress.chemistryScenarios?.[n.id],
      done = isResearchComplete(n.id),
      route = ROUTES.find((r) => r.id === state.route),
      at = route?.path.indexOf(n.id);
    const links = EDGES.filter((e) => e.from === n.id || e.to === n.id).slice(
      0,
      3,
    );
    panel.classList.remove("island-dossier", "level-dossier");
    panel.classList.add("story-place-panel");
    panel.hidden = false;
    panel.setAttribute("aria-label", l.person + "的故事");
    panel.innerHTML = `<button class="panel-close" aria-label="关闭人物介绍">${icon("close")}</button><div class="story-panel-portrait event-panel-portrait chem-preview-art"><small>EVENT ${n.id.slice(1)} / 10</small>${ChemArt.scene(n.id)}<span>${l.place}</span></div><div class="panel-content">${route ? `<div class="route-banner">${escape(route.title)} · ${at + 1}/${route.path.length}<div class="route-navigation">${at < route.path.length - 1 ? `<button data-route-next="${route.path[at + 1]}">下一站 →</button>` : ""}<button data-route-exit>结束路线</button></div></div>` : ""}<p class="node-region-tag">${l.era}</p><h2>${l.person}</h2><p class="panel-question">${l.title}</p><p class="story-panel-description">${l.opening}</p><button class="primary-button" data-primary="${n.id}">${icon("play")}${done ? "重玩，挑战更高星级" : r?.events?.length ? "继续这场探索" : "打开即时实验台"}</button><button class="secondary-button" data-read="${n.id}">${icon("book")}人物与化学手记</button><div class="panel-relations"><span>这次发现，还连接着</span>${links
      .map((e) => {
        const o = byId[e.from === n.id ? e.to : e.from];
        return `<button class="related-node" data-related="${o.id}">${o.title}${icon("arrow")}</button>`;
      })
      .join("")}</div></div>`;
    $(".panel-close", panel).onclick = () => {
      panel.hidden = true;
      state.selected = null;
      renderMap();
    };
    $("[data-primary]", panel).onclick = () => startChemistryLevel(n.id);
    $("[data-read]", panel).onclick = () => showChemistryNotebook(n.id);
    $$("[data-related]", panel).forEach(
      (b) =>
        (b.onclick = () => {
          const e = links.find(
            (e) => e.from === b.dataset.related || e.to === b.dataset.related,
          );
          if (e?.cross) showRelation(e);
          else openNode(b.dataset.related);
        }),
    );
    $("[data-route-next]", panel)?.addEventListener("click", (e) =>
      openNode(e.currentTarget.dataset.routeNext),
    );
    $("[data-route-exit]", panel)?.addEventListener("click", () => {
      state.route = null;
      renderMap();
      renderChemistryPanel(n);
    });
    organizePanel();
  }
  function showPhysicsNotebook(id) {
    const l = PhysicsData.byId[id];
    showModal(
      `${modalClose()}<p class="modal-eyebrow">A SCIENTIST’S FIELD NOTES</p><h2 id="modal-title">${l.person} · ${l.concept}</h2><p class="modal-subtitle">${l.era} · ${l.place}</p><section class="reading-section"><h3>我们在问什么</h3><p>${l.opening}</p><h3>可以带走的认识</h3><p>${l.takeaway}</p><p class="boundary-note">${l.formula}</p><h3>记忆与史实</h3><p>${l.history}</p><p><a href="${l.source[1]}" target="_blank" rel="noopener noreferrer">${l.source[0]} ↗</a></p><h3>模型与现实</h3><p>${l.boundary}</p></section><button class="primary-button" id="notebook-enter">走进${l.person}的故事 →</button>`,
      "reading",
    );
    $("#notebook-enter").onclick = () => startPhysicsLevel(id);
  }
  function showMathNotebook(id) {
    const l = MathData.byId[id];
    showModal(
      `${modalClose()}<p class="modal-eyebrow">A MATHEMATICIAN’S FIELD NOTES</p><h2 id="modal-title">${l.person} · ${l.concept}</h2><p class="modal-subtitle">${l.era} · ${l.place}</p><section class="reading-section"><h3>我们在问什么</h3><p>${l.opening}</p><h3>可以带走的认识</h3><p>${l.takeaway}</p><p class="boundary-note">${l.formula}</p><h3>记忆与史实</h3><p>${l.history}</p><p><a href="${l.source[1]}" target="_blank" rel="noopener noreferrer">${l.source[0]} ↗</a></p><h3>模型与现实</h3><p>${l.boundary}</p></section><button class="primary-button" id="notebook-enter">走进${l.person}的故事 →</button>`,
      "reading",
    );
    $("#notebook-enter").onclick = () => startMathLevel(id);
  }
  function renderPanel(n) {
    if (n.s === "P") {
      renderPhysicsPanel(n);
      return;
    }
    if (n.s === "M") {
      renderMathPanel(n);
      return;
    }
    if (n.s === "C") {
      renderChemistryPanel(n);
      return;
    }
    panel.classList.remove("story-place-panel");
    panel.classList.remove("island-dossier", "level-dossier");
    panel.setAttribute("aria-label", "知识地点详情");
    const relations = EDGES.filter((e) => e.from === n.id || e.to === n.id)
      .sort((a, b) => Number(Boolean(b.cross)) - Number(Boolean(a.cross)))
      .slice(0, 3);
    const crop = {
      P: { x: 145 - n.x * 0.48, y: 70 - n.y * 0.48 },
      M: { x: -66, y: -60 },
      C: { x: -249, y: -266 },
    }[n.s];
    const route = ROUTES.find((r) => r.id === state.route),
      routeIndex = route?.path.indexOf(n.id);
    panel.hidden = false;
    panel.innerHTML = `<button class="panel-close" aria-label="关闭地点详情">${icon("close")}</button><div class="panel-art"><img src="${Exploration.world.art}" alt="" style="width:1600px;height:1000px;max-width:none;position:absolute;left:${crop.x}px;top:${crop.y}px;transform:scale(.48);transform-origin:top left"><span class="panel-tag">${SUBJECTS[n.s].name} · ${n.id} ${progress.verified[n.id] ? "／ 已验证" : ""}</span></div><div class="panel-content">${route ? `<div class="route-banner">${escape(route.title)} · ${routeIndex >= 0 ? routeIndex + 1 : "—"}/${route.path.length}<div class="route-navigation">${routeIndex < route.path.length - 1 ? `<button data-route-next="${route.path[Math.max(0, routeIndex + 1)]}">下一站 →</button>` : "<span>路线已走完</span>"}<button data-route-exit>结束路线</button></div></div>` : ""}<h2>${escape(n.title)}</h2><p class="panel-question">${escape(n.problem.split("？")[0])}${n.problem.includes("？") ? "？" : ""}</p><p class="panel-description">${escape(n.one)}</p><button class="primary-button" data-primary="${n.id}">${icon(n.exp ? "play" : "book")}${n.exp ? "开始实验" : "打开知识手册"}</button>${n.exp ? `<button class="secondary-button" data-read="${n.id}">${icon("book")}先了解这个概念</button>` : ""}${state.mode === "history" ? `<button class="secondary-button" data-history="${n.s}">${icon("hourglass")}阅读发展故事</button>` : ""}<div class="panel-relations"><span>从这里，还可以去</span>${relations
      .map((e) => {
        const other = byId[e.from === n.id ? e.to : e.from];
        return `<button class="related-node" data-related="${other.id}" title="${escape(e.label)}"><i class="subject-dot" style="background:${colors[other.s]}"></i>${escape(other.title)}${icon("arrow")}</button>`;
      })
      .join("")}</div></div>`;
    $(".panel-close", panel).onclick = () => {
      panel.hidden = true;
      state.selected = null;
      renderMap();
    };
    $("[data-primary]", panel).onclick = () =>
      n.exp ? startExperiment(n.exp) : showReading(n.id);
    $("[data-read]", panel)?.addEventListener("click", () => showReading(n.id));
    $("[data-history]", panel)?.addEventListener("click", () =>
      showHistory(n.s),
    );
    $$("[data-related]", panel).forEach(
      (b) =>
        (b.onclick = () => {
          const edge = EDGES.find(
            (e) =>
              (e.from === n.id && e.to === b.dataset.related) ||
              (e.to === n.id && e.from === b.dataset.related),
          );
          if (edge?.cross) showRelation(edge);
          else openNode(b.dataset.related);
        }),
    );
    $("[data-route-next]", panel)?.addEventListener("click", (event) =>
      openNode(event.currentTarget.dataset.routeNext),
    );
    $("[data-route-exit]", panel)?.addEventListener("click", () => {
      state.route = null;
      renderMap();
      renderPanel(n);
    });
    organizePanel();
  }
  function showModal(content, kind = "reading") {
    if (backdrop.hidden) lastFocus = document.activeElement;
    cleanupExperiment();
    state.modalKind = kind;
    modal.className = "modal paper";
    modal.dataset.kind = kind;
    modal.innerHTML = content;
    backdrop.hidden = false;
    $("#search-popover").hidden = true;
    for (const el of [$(".topbar"), stage, $(".bottom-bar")]) el.inert = true;
    modal.focus();
    $(".modal-close", modal)?.addEventListener("click", closeModal);
  }
  function closeModal() {
    cleanupExperiment();
    backdrop.hidden = true;
    for (const el of [$(".topbar"), stage, $(".bottom-bar")]) el.inert = false;
    state.modalKind = null;
    renderMap();
    if (state.selected && !panel.hidden) renderPanel(byId[state.selected]);
    if (lastFocus?.isConnected) lastFocus.focus({ preventScroll: true });
    else $(".map-node.selected")?.focus({ preventScroll: true });
    if (!modal.contains(document.activeElement) && document.activeElement === document.body)
      $("#postal-office-toggle")?.focus({ preventScroll: true });
  }
  const modalClose = () =>
    `<button class="modal-close" aria-label="关闭窗口">${icon("close")}</button>`;
  function quizMarkup(id) {
    const q = QUIZ[id];
    return `<section class="quiz-box" data-quiz="${id}"><h3>想一想 · ${escape(q.q)}</h3>${q.opts.map((o, i) => `<button class="quiz-option" data-answer="${i}">${String.fromCharCode(65 + i)}　${escape(o)}</button>`).join("")}<p class="quiz-feedback" role="status">${progress.verified[id] ? "你已完成这道验证，也可以再次回顾。" : ""}</p></section>`;
  }
  function bindQuiz(root) {
    $$("[data-quiz]", root).forEach((box) =>
      $$("[data-answer]", box).forEach(
        (button) =>
          (button.onclick = () => {
            const id = box.dataset.quiz,
              q = QUIZ[id],
              correct = Number(button.dataset.answer) === q.ans;
            $$("[data-answer]", box).forEach((b) =>
              b.classList.remove("correct", "wrong"),
            );
            button.classList.add(correct ? "correct" : "wrong");
            $(".quiz-feedback", box).textContent =
              (correct ? "理解正确。" : "再想一想。") + q.fb;
            if (correct) {
              progress.verified[id] = true;
              save();
              renderMap();
            }
          }),
      ),
    );
  }
  function showReading(id) {
    if (PhysicsData.byId[id]) {
      showPhysicsNotebook(id);
      return;
    }
    if (MathData.byId && MathData.byId[id]) {
      showMathNotebook(id);
      return;
    }
    if (ChemData.byId[id]) {
      showChemistryNotebook(id);
      return;
    }
    const n = byId[id];
    showModal(
      `${modalClose()}<p class="modal-eyebrow">${SUBJECTS[n.s].name} / KNOWLEDGE JOURNAL / ${n.id}</p><h2 id="modal-title">${escape(n.title)}</h2><p class="modal-subtitle">每一个概念，都是理解世界的新视角。</p><section class="reading-section"><h3>一句话理解</h3><p>${escape(n.one)}</p></section><section class="reading-section"><h3>它解决什么问题</h3><p>${escape(n.problem)}</p></section><div class="boundary-note">模型与边界 · ${escape(n.boundary)}</div><section class="reading-section"><h3>沿着联系，继续探索</h3>${EDGES.filter(
        (e) => e.from === id || e.to === id,
      )
        .map((e) => {
          const other = byId[e.from === id ? e.to : e.from];
          return `<button class="search-result" data-jump="${other.id}"><i class="subject-dot" style="background:${colors[other.s]}"></i><span>${escape(other.title)}<small style="display:block;margin:0">${escape(e.label)}</small></span>${icon("arrow")}</button>`;
        })
        .join("")}</section>${quizMarkup(id)}`,
    );
    bindQuiz(modal);
    $$("[data-jump]", modal).forEach(
      (b) =>
        (b.onclick = () => {
          closeModal();
          openNode(b.dataset.jump);
        }),
    );
  }
  function showHistory(subject) {
    showModal("", "history");
    window.AtlasHistoryView.mount(modal, {
      subject,
      selected: state.selected,
      histories,
      nodes: byId,
      closeButton: modalClose(),
      onClose: closeModal,
      onExplore: (id) => {
        closeModal();
        openNode(id);
      },
      onPlay: (id) => {
        if (id && id.startsWith("C")) startChemistryLevel(id);
        else if (id && id.startsWith("M")) startMathLevel(id);
        else startPhysicsLevel(id);
      },
    });
  }
  function deliverPostalChapter(chapter) {
    save();
    const result = Postal.deliver(progress, chapter);
    if (!result.changed) return false;
    progress = result.progress;
    const saved = save();
    renderMap();
    if (saved && progress.mailDeliveries[chapter]) toast("回条已留存，可以回看，也可以继续自由探索。");
    if ((saved || !storageAvailable) && ["R01", "R02", "R03", "R04", "R05"].includes(chapter) && progress.mailDeliveries[chapter]) {
      playPostalDelivery(chapter, false);
      return true;
    }
    return false;
  }
  function updatePostalPreference(result) {
    if (!result.changed) return;
    progress = result.progress;
    save();
  }
  function showPostalPlace(station = "P") {
    if (!PostalWorld.stations[station]) return;
    save();
    updatePostalPreference(PostalWorld.visit(progress, station));
    showModal('<div id="postal-room-root"></div>', "postal-room");
    modal.classList.remove("paper");
    modal.classList.add("post-room-modal");
    modal.scrollTop = 0;
    postalRoomController = window.AtlasPostalRoomView.create($("#postal-room-root"), {
      station, getProgress: () => progress,
      onStation: showPostalPlace, onOpen: openPostalLevel,
      onManifest: showPostOffice, onDeliver: deliverPostalChapter,
      onReplay: replayPostalChapter, onAppendix: showAppendix, onClose: closeModal,
      onMeet: id => updatePostalPreference(PostalWorld.meet(progress, id)),
      onDecorate: id => updatePostalPreference(PostalWorld.decorate(progress, id)),
      onLetter: id => updatePostalPreference(Postal.selectLetter(progress, id)),
      onExplore: subject => { closeModal(); setSubject(subject); },
    });
  }
  function showPostOffice() {
    save();
    showModal("", "mail");
    mailController = window.AtlasWorldlineView.mount(modal, {
      getProgress: () => progress,
      closeButton: modalClose(),
      onClose: closeModal,
      onHome: () => showPostalPlace("P"),
      onOpen: id => {
        if (id[0] === "P") startPhysicsLevel(id);
        else if (id[0] === "M") startMathLevel(id);
        else startChemistryLevel(id);
      },
      onReplay: replayPostalChapter, onAppendix: showAppendix,
      onDeliver: deliverPostalChapter,
    });
  }
  function showJournal() {
    const verified = Object.keys(progress.verified).filter(
      (id) => byId[id] && progress.verified[id],
    ).length;
    showModal(
      `${modalClose()}<p class="modal-eyebrow">YOUR EXPLORER'S JOURNAL</p><h2 id="modal-title">每一次发现，都有迹可循</h2><p class="modal-subtitle">收集问题，连接知识，记录自己的探索。</p><div class="stats-grid"><div class="stat"><strong>${progress.visited.length}</strong><span>已访问地点</span></div><div class="stat"><strong>${verified}</strong><span>已完成理解验证</span></div><div class="stat"><strong>${Object.values(progress.expDone).filter(Boolean).length}</strong><span>已完成实验任务</span></div></div><section class="reading-section"><h3>选择一条探索航线</h3>${ROUTES.map((r, i) => `<div class="route-card"><span>0${i + 1}</span><div><h3>${r.title}</h3><p>${r.path.length} 个地点 · ${new Set(r.path.map((id) => byId[id].s)).size} 个学科视角</p></div><button data-route="${r.id}">启程 →</button></div>`).join("")}</section><section class="reading-section"><h3>你留下足迹的地方</h3><div class="journal-list">${
        progress.visited.length
          ? progress.visited
              .slice()
              .reverse()
              .map(
                (id) =>
                  `<button class="journal-place" data-journal-node="${id}"><i class="subject-dot" style="background:${colors[byId[id].s]}"></i>${byId[id].title}<small>${progress.verified[id] ? "已验证" : "已访问"}</small></button>`,
              )
              .join("")
          : '<p class="index-empty">旅程才刚刚开始。选一条航线，或者去地图上点开一个地点。</p>'
      }</div></section><p class="progress-info">记录保存在当前浏览器。实验任务完成与理解验证分别记录。</p><button class="danger-button" id="clear-progress">清除本地探索记录</button>`,
      "journal",
    );
    $("#clear-progress").insertAdjacentHTML(
      "beforebegin",
      `<button class="campaign-outline-button" id="journal-mail">三岛邮路 · 货单、成果与回条 →</button><button class="campaign-outline-button" id="journal-campaign">物理岛事件档案 · ${clearedPhysicsCount()}/10 个发现 →</button><button class="campaign-outline-button" id="journal-math-campaign" style="margin-top:8px">数学岛十封信 · ${clearedMathCount()}/10 个证明 →</button>`,
    );
    $("#journal-mail").onclick = showPostOffice;
    $("#journal-campaign").onclick = showPhysicsCampaign;
    $("#journal-math-campaign").onclick = showMathCampaign;
    $("#journal-math-campaign").insertAdjacentHTML(
      "afterend",
      `<button class="campaign-outline-button" id="journal-chemistry-campaign" style="margin-top:8px">化学岛秘密档案 · ${clearedChemistryCount()}/10 个发现 →</button>`,
    );
    $("#journal-chemistry-campaign").onclick = showChemistryCampaign;
    $$("[data-route]", modal).forEach(
      (b) =>
        (b.onclick = () => {
          state.route = b.dataset.route;
          closeModal();
          state.subject = "ALL";
          updateSubjectNav();
          openNode(ROUTES.find((r) => r.id === state.route).path[0]);
          toast("航线已展开，你可以随时自由探索。");
        }),
    );
    $$("[data-journal-node]", modal).forEach(
      (b) =>
        (b.onclick = () => {
          closeModal();
          openNode(b.dataset.journalNode);
        }),
    );
    $("#clear-progress", modal).onclick = () => {
      if (
        confirm(
          "清除当前浏览器中的全部探索记录、实验参数和验证结果？此操作无法撤销。",
        )
      ) {
        progress = defaultProgress();
        if (!save({ replace: true }) && storageAvailable) return;
        closeModal();
        state.selected = null;
        panel.hidden = true;
        renderMap();
        toast("探索手记已重置，新旅程准备启航。");
      }
    };
  }
  function showIndex() {
    showModal(
      `${modalClose()}<p class="modal-eyebrow">INDEX OF DISCOVERIES</p><h2 id="modal-title">每一个地点，都是一个问题</h2><p class="modal-subtitle">全部 30 个知识地点都可以自由访问。</p><div class="place-index">${[
        "P",
        "M",
        "C",
      ]
        .map(
          (s) =>
            `<section><h3 style="color:${colors[s]}">${SUBJECTS[s].name}群岛</h3>${NODES.filter(
              (n) => n.s === s,
            )
              .map(
                (n) =>
                  `<button data-index-node="${n.id}">${progress.verified[n.id] ? "✓" : progress.visited.includes(n.id) ? "◉" : "○"}　${n.title}${n.exp ? " ↗" : ""}</button>`,
              )
              .join("")}</section>`,
        )
        .join("")}</div>`,
      "index",
    );
    $$("[data-index-node]", modal).forEach(
      (b) =>
        (b.onclick = () => {
          closeModal();
          openNode(b.dataset.indexNode);
        }),
    );
  }
  function showHelp() {
    showModal(
      `${modalClose()}<p class="modal-eyebrow">A SMALL GUIDE TO A BIG WORLD</p><h2 id="modal-title">给好奇心一张地图</h2><p class="modal-subtitle">没有固定的通关顺序，从你感兴趣的问题开始。</p><section class="reading-section"><h3>01　选择一个地点</h3><p>拖动地图、滚轮缩放，或从地点索引中选择概念。三座岛各有十个故事地标，通向不同研究者与即时实验台。</p></section><section class="reading-section"><h3>02　预测，然后动手验证</h3><p>三座岛都支持即时调参，像素舞台与读数实时响应。自由探索、暂停和开场重播不耗资源；正式记录才结算。化学岛完成两轮证据后提交解释，错误扣信誉，首次单变量对照免费。通关收集人物手记和星星；自由分子工坊仍可从化学手记进入。</p></section><section class="reading-section"><h3>03　沿着联系去另一座岛</h3><p>选中地点后出现知识连线。点击连线可读到解释；细虚线表示建议先了解，实线表示解释或应用，双向联系用于对照理解。物理与化学的发展故事可切换发现故事和人物视角，史实与教学改编分别说明。</p></section><section class="reading-section"><h3>把探索留在手记里</h3><p>空心标记表示未访问，小旗表示已访问，勾选表示已验证。手记保存在本机浏览器中；所有地点始终可访问。</p></section><div class="boundary-note">键盘：Tab 选择地点和按钮，Enter 打开；按 / 搜索，Escape 关闭窗口。也可以通过地点索引完成地图浏览。</div>`,
      "help",
    );
    modal.insertAdjacentHTML(
      "beforeend",
      '<div class="help-openings"><button class="primary-button" id="replay-harbor-flight">回到启航首页 · 群岛序章 ↗</button><button class="primary-button" id="replay-site-prologue">重看网站序章 · 答案之前 ↗</button></div>',
    );
    $("#replay-harbor-flight").onclick = () => {
      closeModal();
      window.AtlasHarborEntry?.open();
    };
    $("#replay-site-prologue").onclick = () => {
      closeModal();
      window.AtlasSitePrologue?.open();
    };
  }
  function showRelation(edge) {
    const destination = state.selected === edge.to ? edge.from : edge.to;
    const questions = {
      eX2: {
        q: "轨迹的函数图像能直接告诉我们什么？",
        options: [
          "小球经过的空间位置形成什么形状",
          "小球在每个位置的时刻与速度全部信息",
          "真实空气阻力的精确大小",
        ],
        answer: 0,
        explanation:
          "y 关于 x 的关系描述轨迹形状；要描述运动快慢，还需要位置随时间的关系。",
      },
      eX4: {
        q: "几何关系在分子模型中主要帮助描述什么？",
        options: [
          "分子的真实颜色",
          "键的空间方向、角度与对称性",
          "电子一定从哪一个原子转移到另一个",
        ],
        answer: 1,
        explanation:
          "几何工具描述空间形状；形成这种结构的原因还需要化学模型解释。",
      },
      eX7: {
        q: "元素与放射性研究怎样联系，同时保持区别？",
        options: [
          "普通化学反应会任意改变原子核",
          "一条异常读数就能证明一种新元素",
          "元素研究与物质内部研究相遇，但化学变化和核变化不同",
        ],
        answer: 2,
        explanation:
          "放射性提供研究物质内部的线索；鉴别元素还需更多证据，普通化学变化不改变原子核。",
      },
    };
    const question = questions[edge.id];
    showModal(
      `${modalClose()}<p class="modal-eyebrow">A CONNECTION BETWEEN IDEAS</p><h2 id="modal-title">${byId[edge.from].title} ${edge.undirected ? "↔" : "→"} ${byId[edge.to].title}</h2><section class="reading-section"><h3>这条联系意味着什么</h3><p>${escape(edge.label)}</p></section>${question ? `<section class="quiz-box"><h3>${question.q}</h3>${question.options.map((text, index) => `<button class="quiz-option" data-relation-answer="${index}">${text}</button>`).join("")}<p class="quiz-feedback" id="relation-feedback" role="status">${progress.relations[edge.id] ? "你已经验证过这条联系。" : ""}</p></section>` : ""}<button class="primary-button" id="follow-edge" style="margin-top:20px">去看看：${byId[destination].title}${icon("arrow")}</button>`,
    );
    $("#follow-edge").onclick = () => {
      closeModal();
      openNode(destination);
    };
    $$("[data-relation-answer]", modal).forEach(
      (b) =>
        (b.onclick = () => {
          const correct = Number(b.dataset.relationAnswer) === question.answer;
          b.classList.add(correct ? "correct" : "wrong");
          $("#relation-feedback").textContent =
            (correct ? "联系建立成功。" : "再想一想。") + question.explanation;
          if (correct) {
            progress.relations[edge.id] = true;
            save();
          }
        }),
    );
  }
  function search(query) {
    const value = query.trim().toLowerCase();
    const matches = NODES.filter(
      (n) => !value || (n.title + n.kw + n.id).toLowerCase().includes(value),
    );
    $("#search-results").innerHTML = matches.length
      ? matches
          .slice(0, 8)
          .map(
            (n) =>
              `<button class="search-result" data-search-node="${n.id}"><i class="subject-dot" style="background:${colors[n.s]}"></i>${n.title}<small>${SUBJECTS[n.s].name} · ${n.id}</small></button>`,
          )
          .join("")
      : '<p class="search-empty">还没有找到这个概念。试试“函数”“分子”或“能量”。</p>';
    $$("[data-search-node]").forEach(
      (b) =>
        (b.onclick = () => {
          $("#search-popover").hidden = true;
          openNode(b.dataset.searchNode);
        }),
    );
  }

  function acceptLevelRecord(id, record, key) {
    const previous = progress[key][id];
    if (previous?.events?.length && previous.researchRunId !== record.researchRunId)
      progress = Postal.rememberAttempt(progress, id, previous);
    progress[key][id] = record;
  }
  function postalResearchLab(id) {
    const lab = [window.AtlasNightwatchLab, window.AtlasRevisionLab, window.AtlasAtlasLab, window.AtlasReturnLab, window.AtlasAppendixLab].find(lab => lab.ids.includes(id));
    return lab?.forLevel ? lab.forLevel(id) : lab || null;
  }
  function isPostalResearch(id) {
    return ["P01", "C01", "M03"].includes(id) || !!postalResearchLab(id);
  }
  function legacyVoyageRecord(id) {
    const key = { P: "physicsScenarios", C: "chemistryScenarios", M: "mathScenarios" }[id[0]];
    return progress[key]?.[id];
  }
  function preferLegacyVoyage(id) {
    const record = legacyVoyageRecord(id);
    return !progress.researchRuns[id] && record?.role && !record.ended;
  }
  function openPostalLevel(id, options) {
    if (id[0] === "P") startPhysicsLevel(id, options);
    else if (id[0] === "M") startMathLevel(id, options);
    else startChemistryLevel(id, options);
  }
  function addVoyageBridge(id) {
    const bridge = document.createElement("div");
    bridge.className = "fv-legacy-bridge";
    bridge.innerHTML = '<span>原规则的进行中记录仍可继续。</span><button>开始新版委托 · 旧记录保留 →</button>';
    bridge.querySelector("button").onclick = () => startPostalResearch(id);
    modal.prepend(bridge);
  }
  function startPostalResearch(id) {
    const lab = postalResearchLab(id);
    const chapter = lab?.chapter || "R01";
    const api = (lab?.models || window.AtlasFirstVoyageModels).createSession(id);
    const encounter = Postal.encounter(progress, id);
    const firstJob = chapter === "R01" && !progress.mailFacts.firstVoyageStarted;
    openNode(id, { focus: false });
    showModal('<div id="first-voyage-root"></div>', "first-voyage");
    modal.classList.remove("paper");
    modal.classList.add("fv-modal");
    modal.dataset.fvTheme = id;
    modal.scrollTop = 0;
    const restored = api.restore(progress.researchRuns[id]);
    if (restored.error) progress = Postal.startResearch(progress, id, api).progress;
    else progress.researchRuns[id] = restored.state;
    if (chapter === "R01") progress.mailFacts.firstVoyageStarted = true;
    save();
    voyageController = window.AtlasFirstVoyageWorkbench.create($("#first-voyage-root"), {
      id, encounter, firstJob, lab,
      getProgress: () => progress,
      getState: () => progress.researchRuns[id],
      onCommand: command => {
        save();
        const introduced = !progress.mailFacts.letterIntroduced;
        const result = Postal.commitResearch(progress, id, api, command);
        if (!result.changed) return result;
        progress = result.progress;
        if (command.type === "archive") {
          progress.verified[id] = true;
          progress.expDone["story-" + id] = true;
        }
        save();
        renderMap();
        const retained = progress.researchRuns[id]?.events.some(e => e.id === command.id);
        return { changed: !!retained, reason: retained ? result.reason : "stale-command",
          introduced: retained && introduced && !!progress.mailFacts.letterIntroduced };
      },
      onDraft: draft => {
        if (progress.researchRuns[id]?.runId !== draft.runId) return;
        progress.researchDrafts[id] = draft;
        scheduleSave();
      },
      onRestart: role => {
        save();
        const result = Postal.startResearch(progress, id, api, role);
        if (!result.changed) return result;
        const runId = result.progress.researchRuns[id].runId;
        progress = result.progress;
        delete progress.researchDrafts[id];
        save();
        return { changed: progress.researchRuns[id]?.runId === runId };
      },
      onExit: () => { closeModal(); openNode(id, { focus: false }); },
      onOpen: openPostalLevel,
      onPost: showPostOffice,
      onDeliver: () => {
        if (lab?.kind === "side") return sendAppendix(id);
        save();
        if (progress.mailDeliveries[chapter]) return replayPostalChapter(chapter);
        if (Postal.status(progress, chapter).ready) deliverPostalChapter(chapter);
        else showPostOffice();
      },
      onLegacy: legacyVoyageRecord(id)?.role ? () => openPostalLevel(id, { legacy: true }) : null,
    });
  }
  function sendAppendix(id) {
    save();
    const result = Postal.sendAppendix(progress, id);
    if (result.changed) { progress = result.progress; if (!save() && storageAvailable) return; }
    if (progress.mailAppendices[id]) showAppendix(id);
    else showPostOffice();
  }
  function showAppendix(id, {send = false} = {}) {
    if (send) return sendAppendix(id);
    if (!progress.mailAppendices[id]) return sendAppendix(id);
    showModal('<div id="appendix-post-root"></div>', "appendix-post");
    modal.classList.remove("paper");
    modal.classList.add("ap-post-modal");
    modal.scrollTop = 0;
    flightController = window.AtlasAppendixPost.create($("#appendix-post-root"), { id, getProgress: () => progress, onDone: () => showPostalPlace("P") });
  }
  function replayPostalChapter(chapter = "R01") {
    playPostalDelivery(chapter, true);
  }
  function playPostalDelivery(chapter, replay) {
    const view = { R01: window.AtlasFirstVoyageDelivery, R02: window.AtlasNightwatchDelivery, R03: window.AtlasRevisionDelivery, R04: window.AtlasAtlasDelivery, R05: window.AtlasReturnDelivery }[chapter];
    if (!view || !progress.mailDeliveries[chapter]) return;
    showModal('<div id="postal-delivery-root"></div>', "postal-delivery");
    modal.classList.remove("paper");
    modal.classList.add("fv-delivery-modal");
    modal.scrollTop = 0;
    flightController = view.create($("#postal-delivery-root"), {
      getProgress: () => progress, replay, onDone: chapter === "R05" ? () => showPostalPlace("P") : showPostOffice,
      onSelectLetter: id => updatePostalPreference(Postal.selectLetter(progress, id)),
    });
  }
  function continuePostalErrand() {
    const current = PostalWorld.snapshot(progress);
    if (!current.chapter) return showPostalPlace("P");
    if (current.ready) return showPostOffice();
    openPostalLevel(current.missing[0]);
  }
  // Experiment lifecycle: one animation loop per open experiment.
  function cleanupExperiment() {
    postalRoomController?.destroy(); postalRoomController = null;
    voyageController?.destroy(); voyageController = null;
    flightController?.destroy(); flightController = null;
    delete modal.dataset.fvTheme;
    mailController?.destroy();
    mailController = null;
    if (physicsController) {
      physicsController.destroy();
      physicsController = null;
    }
    if (mathController) {
      mathController.destroy();
      mathController = null;
    }
    if (chemistryController) {
      chemistryController.destroy();
      chemistryController = null;
    }
    cancelAnimationFrame(raf);
    raf = 0;
    if (activeExperiment) {
      activeExperiment = null;
      save();
    }
  }
  function startPhysicsLevel(id, { legacy = false } = {}) {
    if (!PhysicsData.byId[id]) return;
    if (!legacy && isPostalResearch(id) && !preferLegacyVoyage(id)) return startPostalResearch(id);
    openNode(id, { focus: false });
    showModal(
      '<div id="physics-level-root" class="physics-level-host"></div>',
      "physics-story",
    );
    modal.classList.add("physics-level-modal");
    physicsController = window.AtlasPhysicsLevels.create({
      id,
      host: $("#physics-level-root"),
      record: progress.physicsScenarios[id],
      achievement: progress.mailArtifacts[id],
      onUpdate: (record) => {
        const before = isResearchComplete(id);
        acceptLevelRecord(id, record, "physicsScenarios");
        if (PhysicsGame.isCleared(record)) {
          progress.verified[id] = true;
          progress.expDone["story-" + id] = true;
        }
        save();
        renderMap();
        if (state.subject === "P")
          $("#quest-title").textContent = nextPhysicsLevel()
            ? "下一事件：" + PhysicsData.byId[nextPhysicsLevel()].person
            : "十个发现，连成一座岛";
        if (!before && PhysicsGame.isCleared(record))
          toast(
            PhysicsData.byId[id].person +
              "的新发现 · " +
              clearedPhysicsCount() +
              "/10",
          );
      },
      onExit: () => {
        closeModal();
        openNode(id, { focus: false });
      },
      onNext: (next) =>
        next ? startPhysicsLevel(next) : showPhysicsCampaign(),
      onLegacy: () => startExperiment("shoot"),
    });
    if (isPostalResearch(id)) addVoyageBridge(id);
  }
  function showPhysicsCampaign() {
    const count = clearedPhysicsCount();
    showModal(
      `${modalClose()}<p class="modal-eyebrow">PHYSICS / THE UNRESOLVED QUESTIONS</p><h2 id="modal-title">科学，还没写下答案。</h2><p class="modal-subtitle">十位科学家，十座即时实验台。自由调参观察，再用正式记录支持你的发现。</p><div class="campaign-stat">${count}<small>/ 10 个发现 · 自由沙盒 / 对照研究 / 三星收集</small></div><div class="campaign-grid">${PhysicsData.levels
        .map((l, i) => {
          const r = progress.physicsScenarios[l.id],
            done = isResearchComplete(l.id);
          const theme = window.AtlasPhysicsPixelArt.themes[l.id];
          const stars = bestResearchStars(l.id, r);
          return `<button class="campaign-level ${done ? "done" : ""}" data-campaign-level="${l.id}" style="--chapter-accent:${theme.accent};--chapter-panel:${theme.panel}"><span class="campaign-mini-portrait">${window.AtlasPhysicsPixelArt.portrait(l.id)}<small>${String(i + 1).padStart(2, "0")}</small></span><div><h3>${l.person}</h3><p class="campaign-concept">${l.concept}</p><p class="campaign-question">${l.title}</p><p class="campaign-status">${r?.ended ? "已收集 " + (r.endings?.length || 1) + " / 4 种结局" : r?.role ? "第 " + (r.round + 1) + " 幕 · 可继续" : "打开实验台，自由探索"}${done ? " · 发现成立" : ""}</p>${stars ? `<span class="campaign-stars" aria-label="最佳 ${stars} 星">${"★".repeat(stars)}${"☆".repeat(3 - stars)} · 人物手记已收录</span>` : ""}</div><b>${done ? "✓" : "↗"}</b></button>`;
        })
        .join(
          "",
        )}</div><p class="campaign-path-note">从平衡与运动，到电、磁、光的联系，再走向经典理论遇到的新问题。每关可自由重玩；人物对白和分支结局为教学创作。</p><button class="primary-button" id="campaign-continue" style="margin-top:18px">${count === 10 ? "回到物理岛" : "继续探索 · " + PhysicsData.byId[nextPhysicsLevel()].person} →</button>`,
      "campaign",
    );
    modal.classList.add("event-campaign-modal");
    $$("[data-campaign-level]", modal).forEach(
      (b) => (b.onclick = () => startPhysicsLevel(b.dataset.campaignLevel)),
    );
    $("#campaign-continue").onclick = () => {
      if (count === 10) {
        closeModal();
        fitMap();
      } else startPhysicsLevel(nextPhysicsLevel());
    };
  }
  function startMathLevel(id, { legacy = false } = {}) {
    if (!MathData.byId[id]) return;
    if (!legacy && isPostalResearch(id) && !preferLegacyVoyage(id)) return startPostalResearch(id);
    openNode(id, { focus: false });
    showModal(
      '<div id="math-level-root" class="math-level-host"></div>',
      "math-story",
    );
    modal.classList.add("math-level-modal");
    mathController = window.AtlasMathLevels.create({
      id,
      host: $("#math-level-root"),
      record: progress.mathScenarios[id],
      achievement: progress.mailArtifacts[id],
      onUpdate: (record) => {
        const before = isResearchComplete(id);
        acceptLevelRecord(id, record, "mathScenarios");
        if (MathGame.isCleared(record)) {
          progress.verified[id] = true;
          progress.expDone["story-" + id] = true;
        }
        save();
        renderMap();
        if (state.subject === "M")
          $("#quest-title").textContent = nextMathLevel()
            ? "下一事件：" + MathData.byId[nextMathLevel()].person
            : "十封信，连成一座数学岛";
        if (!before && MathGame.isCleared(record))
          toast(
            MathData.byId[id].person +
              "的新证明 · " +
              clearedMathCount() +
              "/10",
          );
      },
      onExit: () => {
        closeModal();
        openNode(id, { focus: false });
      },
      onNext: (next) => (next ? startMathLevel(next) : showMathCampaign()),
      onLegacy: () => startExperiment("func"),
    });
    if (isPostalResearch(id)) addVoyageBridge(id);
  }
  function showMathCampaign() {
    const count = clearedMathCount();
    showModal(
      `${modalClose()}<p class="modal-eyebrow">MATHEMATICS / TEN UNPOSTED LETTERS</p><h2 id="modal-title">写给未来的证明</h2><p class="modal-subtitle">十位数学家，十座即时推演台。调参观察几何与方程，在公理与极限中推导你的结论。</p><div class="campaign-stat">${count}<small>/ 10 个发现 · 连续推演 / 对照论证 / 三星收集</small></div><div class="campaign-grid">${MathData.levels
        .map((l, i) => {
          const r = progress.mathScenarios[l.id],
            done = isResearchComplete(l.id);
          const theme = window.AtlasMathPixelWorlds.themes[l.id];
          const stars = bestResearchStars(l.id, r);
          return `<button class="campaign-level ${done ? "done" : ""}" data-campaign-level="${l.id}" style="--chapter-accent:${theme.accent};--chapter-panel:${theme.panel}"><span class="campaign-mini-portrait">${window.AtlasMathPixelArt.portrait(l.id)}<small>${String(i + 1).padStart(2, "0")}</small></span><div><h3>${l.person}</h3><p class="campaign-concept">${l.concept}</p><p class="campaign-question">${l.title}</p><p class="campaign-status">${r?.ended ? "已收集 " + (r.endings?.length || 1) + " / 4 种结局" : r?.role ? "第 " + (r.round + 1) + " 幕 · 可继续" : "打开推演台，自由探索"}${done ? " · 结论成立" : ""}</p>${stars ? `<span class="campaign-stars" aria-label="最佳 ${stars} 星">${"★".repeat(stars)}${"☆".repeat(3 - stars)} · 人物手记已收录</span>` : ""}</div><b>${done ? "✓" : "↗"}</b></button>`;
        })
        .join(
          "",
        )}</div><p class="campaign-path-note">从整数与无理数，到方程、坐标、映射、向量与微积分，走向近代数学的建模与证明。每关可自由重玩；人物对白与分支结局为教学创作。</p><button class="primary-button" id="campaign-continue" style="margin-top:18px">${count === 10 ? "回到数学岛" : "继续探索 · " + MathData.byId[nextMathLevel()].person} →</button>`,
      "campaign",
    );
    modal.classList.add("event-campaign-modal", "math-campaign-modal");
    $$("[data-campaign-level]", modal).forEach(
      (b) => (b.onclick = () => startMathLevel(b.dataset.campaignLevel)),
    );
    $("#campaign-continue").onclick = () => {
      if (count === 10) {
        closeModal();
        fitMap();
      } else startMathLevel(nextMathLevel());
    };
  }
  function startExperiment(kind) {
    const node = { shoot: "P03", func: "M06", mole: "C06" }[kind];
    if (!byId[node]) return;
    if (!progress.visited.includes(node)) progress.visited.push(node);
    progress.lastNode = node;
    save();
    const titles = {
      shoot: ["抛体试验场", "物理 · 运动与轨迹"],
      func: ["图形变换试验场", "数学 · 参数与形状"],
      mole: ["分子工坊", "化学 · 组成与空间结构"],
    };
    showModal(
      `<header class="experiment-header"><span style="color:#4568ed">${icon({ shoot: "compass", func: "curve", mole: "flask" }[kind])}</span><div><p class="modal-eyebrow">${titles[kind][1]}</p><h2 id="modal-title">${titles[kind][0]}</h2></div>${modalClose()}</header><div class="experiment-body"><div class="experiment-stage"><span class="stage-caption">${kind === "shoot" ? "观察、预测，再让轨迹给出答案" : kind === "func" ? "改一个参数，观察整个图形" : "选择原子放置 · 点击两个原子连接"} </span><canvas id="experiment-canvas" aria-label="${titles[kind][0]}交互画布"></canvas><div class="stage-formula" id="stage-formula"></div>${kind === "mole" ? '<div class="molecule-shape" id="molecule-shape"></div>' : ""}</div><aside class="experiment-side" id="experiment-side"></aside></div>`,
      "experiment",
    );
    modal.classList.add("experiment-modal");
    activeExperiment = { kind };
    if (kind === "shoot") initShoot();
    else if (kind === "func") initFunction();
    else initMolecule();
    requestAnimationFrame(() => {
      if (activeExperiment) resizeExperiment();
    });
  }
  function canvasSetup() {
    const canvas = $("#experiment-canvas");
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { canvas, ctx, width: rect.width, height: rect.height };
  }
  function resizeExperiment() {
    if (!activeExperiment) return;
    activeExperiment.surface = canvasSetup();
    if (activeExperiment.kind === "shoot") drawShoot();
    if (activeExperiment.kind === "func") drawFunction();
    if (activeExperiment.kind === "mole") drawMolecule();
  }
  function experimentReturn() {
    const kind = activeExperiment?.kind;
    closeModal();
    const id = { shoot: "P03", func: "M06", mole: "C06" }[kind];
    if (id) openNode(id, { focus: false });
  }
  function feedback(message, success = false) {
    const el = $("#experiment-feedback");
    if (el) {
      el.textContent = message;
      el.classList.toggle("success", success);
    }
  }
  function completeExperiment(kind) {
    if (!progress.expDone[kind]) {
      progress.expDone[kind] = true;
      save();
      toast("实验任务完成！还可以验证理解，或回地图看看新的联系。");
    }
  }
  function commonExperimentFooter(id) {
    return `${quizMarkup(id)}<button class="experiment-return" id="experiment-return">${icon("back")}回地图，看看知识联系</button>`;
  }
  function bindExperimentFooter() {
    bindQuiz(modal);
    $("#experiment-return").onclick = experimentReturn;
  }
  function drawGrid(ctx, width, height, ox, oy, unit) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#eef5ff";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#6d94dd16";
    ctx.lineWidth = 1;
    for (let x = ox % unit; x < width; x += unit) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = oy % unit; y < height; y += unit) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  function initShoot() {
    const saved = progress.experiments.shoot || {};
    const valid = (v, min, max, fallback) =>
      Number.isFinite(v) && v >= min && v <= max ? v : fallback;
    const params = {
      v0: valid(saved.v0, 4, 16, 12),
      angle: valid(saved.angle, 10, 80, 50),
      g: [9.8, 1.62].includes(saved.g) ? saved.g : 9.8,
    };
    const exp = activeExperiment;
    Object.assign(exp, {
      params,
      time: 0,
      flight: null,
      running: false,
      paused: false,
      lastTimestamp: 0,
      reference: null,
    });
    $("#experiment-side").innerHTML =
      `<h3>让小球落入篮筐</h3><p>调整速度与角度，观察它们如何影响轨迹。</p><div class="control-group"><label for="speed">初速度 <span><input id="speed-number" type="number" min="4" max="16" step=".1" value="${params.v0}" aria-label="初速度数值"> m/s</span></label><input id="speed" type="range" min="4" max="16" step=".1" value="${params.v0}"></div><div class="control-group"><label for="angle">发射角度 <span><input id="angle-number" type="number" min="10" max="80" step="1" value="${params.angle}" aria-label="发射角度数值"> °</span></label><input id="angle" type="range" min="10" max="80" step="1" value="${params.angle}"></div><div class="control-group"><label>重力环境</label><div class="pill-row"><button class="pill ${params.g === 9.8 ? "active" : ""}" data-gravity="9.8">地球 9.8</button><button class="pill ${params.g === 1.62 ? "active" : ""}" data-gravity="1.62">月球 1.62</button></div></div><button class="primary-button" id="fire-ball">${icon("play")}发射小球</button><div class="pill-row"><button class="pill" id="pause-ball" disabled>暂停</button><button class="pill" id="reset-ball">重置</button><button class="pill" id="reference-ball">保留参考轨迹</button></div><div class="experiment-feedback" id="experiment-feedback">模型：忽略空气阻力与旋转，使用均匀重力。目标位于 (12 m, 3 m)，下降时经过篮筐才算命中。</div><section class="quiz-box"><h3>先预测：同样的速度与角度，减小重力后？</h3><button class="quiz-option" data-prediction="correct">最高点升高，飞行时间增加</button><button class="quiz-option" data-prediction="wrong">最高点降低，飞行时间减少</button><p class="quiz-feedback" id="prediction-feedback" role="status"></p></section>${commonExperimentFooter("P03")}`;
    const updateParam = (key, value, source) => {
      const number = Number(value);
      const min = key === "v0" ? 4 : 10,
        max = key === "v0" ? 16 : 80;
      if (
        value === "" ||
        !Number.isFinite(number) ||
        number < min ||
        number > max
      ) {
        source.setAttribute("aria-invalid", "true");
        $("#fire-ball").disabled = true;
        feedback(`请输入 ${min} 至 ${max} 之间的有效数值。`);
        return;
      }
      source.removeAttribute("aria-invalid");
      params[key] = number;
      const prefix = key === "v0" ? "speed" : "angle";
      $("#" + prefix).value = number;
      $("#" + prefix + "-number").value = number;
      $("#" + prefix).removeAttribute("aria-invalid");
      $("#" + prefix + "-number").removeAttribute("aria-invalid");
      $("#fire-ball").disabled = Boolean($('[aria-invalid="true"]', modal));
      progress.experiments.shoot = { ...params };
      scheduleSave();
      if (exp.running || exp.paused)
        feedback("新参数将在下次发射生效，当前飞行保持原来的参数。");
      else drawShoot();
    };
    for (const [name, key] of [
      ["speed", "v0"],
      ["angle", "angle"],
    ])
      for (const suffix of ["", "-number"])
        $("#" + name + suffix).oninput = (event) =>
          updateParam(key, event.target.value, event.target);
    $$("[data-gravity]", modal).forEach(
      (b) =>
        (b.onclick = () => {
          params.g = Number(b.dataset.gravity);
          $$("[data-gravity]", modal).forEach((el) =>
            el.classList.toggle("active", el === b),
          );
          progress.experiments.shoot = { ...params };
          scheduleSave();
          if (exp.running || exp.paused)
            feedback("重力变化将在下一次发射生效。");
          else drawShoot();
        }),
    );
    $("#fire-ball").onclick = () => {
      exp.flight = Science.flight({ ...params });
      exp.time = 0;
      exp.running = true;
      exp.paused = false;
      exp.lastTimestamp = 0;
      $("#pause-ball").disabled = false;
      $("#pause-ball").textContent = "暂停";
      feedback("观察小球：水平速度保持不变，竖直速度随时间变化。");
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(shootFrame);
    };
    $("#pause-ball").onclick = () => {
      if (!exp.flight) return;
      exp.paused = !exp.paused;
      exp.lastTimestamp = 0;
      $("#pause-ball").textContent = exp.paused ? "继续" : "暂停";
      if (!exp.paused) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(shootFrame);
      }
    };
    $("#reset-ball").onclick = () => {
      cancelAnimationFrame(raf);
      Object.assign(params, { v0: 12, angle: 50, g: 9.8 });
      progress.experiments.shoot = { ...params };
      save();
      initShoot();
      resizeExperiment();
    };
    $("#reference-ball").onclick = () => {
      exp.reference = exp.flight || Science.flight({ ...params });
      feedback("已保留一条参考轨迹。调整参数后再次发射，对照差异。");
      drawShoot();
    };
    $$("[data-prediction]", modal).forEach(
      (b) =>
        (b.onclick = () => {
          $("#prediction-feedback").textContent =
            b.dataset.prediction === "correct"
              ? "预测正确！试试月球重力，观察最高点和飞行时间。"
              : "保持初速度与角度，减小重力会让最高点升高、飞行时间增加。可以操作验证。";
        }),
    );
    $("#stage-formula").textContent =
      "x = v₀ cosθ · t　　y = 1.5 + v₀ sinθ · t − ½gt²";
    bindExperimentFooter();
  }
  function shootFrame(timestamp) {
    const exp = activeExperiment;
    if (!exp || exp.kind !== "shoot" || !exp.running || exp.paused) return;
    if (exp.lastTimestamp)
      exp.time += Math.min((timestamp - exp.lastTimestamp) / 1000, 0.1);
    exp.lastTimestamp = timestamp;
    if (exp.time >= exp.flight.duration) {
      exp.time = exp.flight.duration;
      exp.running = false;
      $("#pause-ball").disabled = true;
      if (exp.flight.hit) {
        feedback(
          "命中！小球在下降时穿过篮筐。试着解释它为什么会沿曲线飞行。",
          true,
        );
        completeExperiment("shoot");
      } else
        feedback(
          exp.flight.crossingX === null
            ? "没有达到篮筐高度。试着增加竖直方向的初速度。"
            : exp.flight.crossingX < 12
              ? "下降到篮筐高度时，小球仍在篮筐前方。调整速度或角度再试一次。"
              : "下降到篮筐高度时，小球越过了篮筐。调整速度或角度再试一次。",
        );
    }
    drawShoot();
    if (exp.running) raf = requestAnimationFrame(shootFrame);
  }
  function drawShoot() {
    const exp = activeExperiment;
    if (!exp?.surface || exp.kind !== "shoot") return;
    const { ctx, width: w, height: h } = exp.surface;
    const flight = exp.flight || Science.flight(exp.params);
    const maxX = Math.max(17, flight.at(flight.duration).x + 2),
      maxY = Math.max(8, flight.peak + 2);
    const unit = Math.min((w - 85) / maxX, (h - 130) / maxY),
      ox = 48,
      oy = h - 62;
    const point = (x, y) => [ox + x * unit, oy - y * unit];
    drawGrid(ctx, w, h, ox, oy, Math.max(unit, 22));
    ctx.fillStyle = "#dce8fc";
    ctx.fillRect(0, oy, w, h - oy);
    ctx.strokeStyle = "#94afd9";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(w, oy);
    ctx.stroke();
    ctx.font = '11px "Microsoft YaHei"';
    ctx.fillStyle = "#6982a8";
    ctx.textAlign = "center";
    for (let x = 0; x < maxX; x += Math.max(2, Math.round(maxX / 12))) {
      const p = point(x, 0);
      ctx.fillText(`${x}`, p[0], oy + 23);
    }
    ctx.fillText("m", w - 18, oy + 23);
    const trace = (f, color, dashed = false, until = f.duration) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash(dashed ? [5, 6] : []);
      ctx.beginPath();
      const steps = 180;
      for (let i = 0; i <= steps; i++) {
        const t = (until * i) / steps,
          p = f.at(t),
          xy = point(p.x, p.y);
        i ? ctx.lineTo(...xy) : ctx.moveTo(...xy);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };
    if (exp.reference) trace(exp.reference, "#9daecd", true);
    if (!exp.flight) trace(flight, "#88a9e8", true);
    else trace(flight, "#4568ed", false, exp.time);
    const hoop = point(12, 3);
    ctx.strokeStyle = "#738db7";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(hoop[0] + 0.5 * unit, oy);
    ctx.lineTo(hoop[0] + 0.5 * unit, hoop[1] - unit);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#4568ed";
    ctx.beginPath();
    ctx.ellipse(
      hoop[0],
      hoop[1],
      Math.max(0.35 * unit, 6),
      3,
      0,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
    ctx.strokeStyle = "#9aafd0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hoop[0] - 0.35 * unit, hoop[1] + 2);
    ctx.lineTo(hoop[0] - 0.2 * unit, hoop[1] + 16);
    ctx.lineTo(hoop[0] + 0.2 * unit, hoop[1] + 16);
    ctx.lineTo(hoop[0] + 0.35 * unit, hoop[1] + 2);
    ctx.stroke();
    ctx.fillStyle = "#61789d";
    ctx.textAlign = "left";
    ctx.fillText("篮筐 (12, 3)", hoop[0] - 35, hoop[1] - 20);
    const position = flight.at(exp.flight ? exp.time : 0),
      ball = point(position.x, Math.max(0, position.y));
    ctx.beginPath();
    ctx.arc(ball[0], ball[1], 8, 0, Math.PI * 2);
    ctx.fillStyle = "#6788f4";
    ctx.fill();
    ctx.strokeStyle = "#3a5bd1";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.strokeStyle = "#3656c588";
    ctx.beginPath();
    ctx.moveTo(ball[0] - 7, ball[1]);
    ctx.lineTo(ball[0] + 7, ball[1]);
    ctx.moveTo(ball[0], ball[1] - 7);
    ctx.lineTo(ball[0], ball[1] + 7);
    ctx.stroke();
    ctx.fillStyle = "#61789d";
    ctx.textAlign = "left";
    ctx.font = '11px "Microsoft YaHei"';
    ctx.fillText(`t = ${exp.time.toFixed(2)} s`, 25, 65);
    ctx.fillText(`最高点 ${flight.peak.toFixed(1)} m`, 25, 85);
  }

  function initFunction() {
    const exp = activeExperiment,
      saved = progress.experiments.func || {};
    const params = { a: 1, h: 0, k: 0 };
    for (const key of ["a", "h", "k"])
      if (
        Number.isFinite(saved[key]) &&
        Math.abs(saved[key]) <= (key === "a" ? 3 : 5)
      )
        params[key] = saved[key];
    Object.assign(exp, { params, showTarget: true });
    $("#experiment-side").innerHTML =
      `<h3>把图形变成目标的样子</h3><p>目标虚线：a=0.5，h=2，k=1。先观察，再调整。</p>${[
        ["a", "开口与宽窄", 3],
        ["h", "水平位移", 5],
        ["k", "竖直位移", 5],
      ]
        .map(
          ([key, label, max]) =>
            `<div class="control-group"><label for="param-${key}">${label} ${key}<span><input id="number-${key}" type="number" min="-${max}" max="${max}" step=".1" value="${params[key]}" aria-label="参数 ${key} 数值"></span></label><input id="param-${key}" type="range" min="-${max}" max="${max}" step=".1" value="${params[key]}"></div>`,
        )
        .join(
          "",
        )}<button class="primary-button" id="check-curve">${icon("check")}验证图形匹配</button><div class="pill-row"><button class="pill" id="reset-curve">恢复 y=x²</button><button class="pill active" id="toggle-target" aria-pressed="true">显示目标</button></div><div class="experiment-feedback" id="experiment-feedback">h 增大，图像向右移；k 增大，图像向上移。试试改变 a 的正负。</div><section class="quiz-box"><h3>先预测：把 h 从 0 改成 2，图像向哪里移动？</h3><button class="quiz-option" data-curve-predict="right">向右移动 2 个单位</button><button class="quiz-option" data-curve-predict="left">向左移动 2 个单位</button><p class="quiz-feedback" id="curve-prediction-feedback" role="status"></p></section>${commonExperimentFooter("M06")}`;
    const update = (key, value, input) => {
      const n = Number(value),
        max = key === "a" ? 3 : 5;
      if (value === "" || !Number.isFinite(n) || Math.abs(n) > max) {
        input.setAttribute("aria-invalid", "true");
        $("#check-curve").disabled = true;
        feedback(`参数 ${key} 需要在 −${max} 至 ${max} 之间。`);
        return;
      }
      input.removeAttribute("aria-invalid");
      params[key] = n;
      $("#param-" + key).value = n;
      $("#number-" + key).value = n;
      $("#param-" + key).removeAttribute("aria-invalid");
      $("#number-" + key).removeAttribute("aria-invalid");
      $("#check-curve").disabled = Boolean($('[aria-invalid="true"]', modal));
      progress.experiments.func = { ...params };
      scheduleSave();
      if (params.a === 0)
        feedback(
          "a=0 时退化为水平直线 y=k，此时不是二次函数，没有抛物线顶点。",
        );
      drawFunction();
    };
    for (const key of ["a", "h", "k"])
      for (const prefix of ["param-", "number-"])
        $("#" + prefix + key).oninput = (e) =>
          update(key, e.target.value, e.target);
    $("#check-curve").onclick = () => {
      if (Science.matchesCurve(params)) {
        completeExperiment("func");
        feedback("匹配成功！开口向上，顶点在 (2,1)，比 y=x² 更宽。", true);
      } else
        feedback(
          params.a <= 0
            ? "先看开口方向：目标开口向上，需要 a>0。"
            : Math.abs(params.a - 0.5) > 0.05
              ? "再看曲线宽窄：目标 a=0.5，比 y=x² 更宽。"
              : "开口与宽窄接近了，继续调整 h 和 k，让顶点移到 (2,1)。",
        );
    };
    $("#reset-curve").onclick = () => {
      progress.experiments.func = { a: 1, h: 0, k: 0 };
      save();
      initFunction();
      resizeExperiment();
    };
    $("#toggle-target").onclick = (e) => {
      exp.showTarget = !exp.showTarget;
      e.currentTarget.classList.toggle("active", exp.showTarget);
      e.currentTarget.setAttribute("aria-pressed", exp.showTarget);
      drawFunction();
    };
    $$("[data-curve-predict]", modal).forEach(
      (b) =>
        (b.onclick = () => {
          $("#curve-prediction-feedback").textContent =
            b.dataset.curvePredict === "right"
              ? "预测正确！顶点的横坐标是 h，因此 h=2 时向右移动。"
              : "式子虽然写 x−h，但顶点横坐标是 h，所以 h=2 时向右移动。";
        }),
    );
    bindExperimentFooter();
  }
  function drawFunction() {
    const exp = activeExperiment;
    if (!exp?.surface || exp.kind !== "func") return;
    const { ctx, width: w, height: h } = exp.surface,
      { a, h: shift, k } = exp.params;
    const unit = Math.min((w - 65) / 16, (h - 100) / 13),
      ox = w / 2,
      oy = h / 2 + unit;
    drawGrid(ctx, w, h, ox, oy, unit);
    ctx.strokeStyle = "#89a5d1";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(w, oy);
    ctx.moveTo(ox, 0);
    ctx.lineTo(ox, h);
    ctx.stroke();
    ctx.font = '10px "Segoe UI"';
    ctx.fillStyle = "#6d85ac";
    ctx.textAlign = "center";
    for (let i = -7; i <= 7; i++) {
      if (i) ctx.fillText(i, ox + i * unit, oy + 15);
    }
    for (let i = -5; i <= 6; i++) {
      if (i) ctx.fillText(i, ox - 12, oy - i * unit + 3);
    }
    ctx.fillText("x", w - 15, oy - 10);
    ctx.fillText("y", ox + 12, 18);
    const curve = (ca, ch, ck, color, dashed) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = dashed ? 2 : 2.7;
      ctx.setLineDash(dashed ? [6, 5] : []);
      ctx.beginPath();
      for (let px = 0; px <= w; px += 2) {
        const x = (px - ox) / unit,
          y = oy - (ca * (x - ch) ** 2 + ck) * unit;
        px ? ctx.lineTo(px, y) : ctx.moveTo(px, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 40, w, h - 95);
    ctx.clip();
    if (exp.showTarget) curve(0.5, 2, 1, "#8da3c5", true);
    curve(a, shift, k, "#4568ed", false);
    if (a !== 0) {
      ctx.setLineDash([4, 5]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#7394d988";
      ctx.beginPath();
      ctx.moveTo(ox + shift * unit, 0);
      ctx.lineTo(ox + shift * unit, h);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(ox + shift * unit, oy - k * unit, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#4568ed";
      ctx.fill();
      ctx.font = '12px "Segoe UI"';
      ctx.textAlign = "left";
      ctx.fillText(
        `(${shift}, ${k})`,
        ox + shift * unit + 11,
        oy - k * unit - 10,
      );
    }
    ctx.restore();
    const term =
        shift === 0 ? "x" : `(x ${shift < 0 ? "+" : "−"} ${Math.abs(shift)})`,
      constant = k === 0 ? "" : ` ${k < 0 ? "−" : "+"} ${Math.abs(k)}`;
    $("#stage-formula").textContent =
      a === 0
        ? `y = ${k}　（水平直线）`
        : `y = ${a === 1 ? "" : a === -1 ? "−" : a}${term}²${constant}`;
  }

  function initMolecule() {
    const exp = activeExperiment,
      saved = progress.experiments.mole || {};
    const done = Array.isArray(saved.done)
      ? saved.done.slice(0, 3).map(Boolean)
      : [false, false, false];
    while (done.length < 3) done.push(false);
    Object.assign(exp, {
      task:
        Number.isInteger(saved.task) && saved.task >= 0 && saved.task < 3
          ? saved.task
          : 0,
      done,
      atoms: [],
      bonds: [],
      history: [],
      selected: null,
      atom: "H",
      mode: "place",
      nextId: 1,
    });
    if (Array.isArray(saved.atoms) && Array.isArray(saved.bonds)) {
      exp.atoms = saved.atoms
        .filter(
          (a) =>
            Number.isInteger(a.id) &&
            ["H", "C", "N", "O"].includes(a.el) &&
            Number.isFinite(a.x) &&
            Number.isFinite(a.y),
        )
        .map((a) => ({
          ...a,
          x: Math.max(0.04, Math.min(0.96, a.x)),
          y: Math.max(0.1, Math.min(0.88, a.y)),
        }));
      exp.bonds = saved.bonds.filter(
        (b) =>
          Array.isArray(b) &&
          b.length === 2 &&
          b[0] !== b[1] &&
          b.every((id) => exp.atoms.some((a) => a.id === id)),
      );
      exp.nextId = Math.max(0, ...exp.atoms.map((a) => a.id)) + 1;
    }
    renderMoleculeSide();
    $("#experiment-canvas").onclick = moleculeClick;
  }
  function storeMolecule() {
    const exp = activeExperiment;
    if (!exp || exp.kind !== "mole") return;
    progress.experiments.mole = {
      task: exp.task,
      done: exp.done,
      atoms: exp.atoms,
      bonds: exp.bonds,
    };
    scheduleSave();
    updateMoleculeSelectors();
  }
  function updateMoleculeSelectors() {
    const exp = activeExperiment;
    if (exp?.kind !== "mole") return;
    for (const id of ["bond-from", "bond-to"]) {
      const select = $("#" + id);
      if (!select) continue;
      const previous = select.value;
      select.innerHTML = exp.atoms
        .map((a) => `<option value="${a.id}">${a.el} · ${a.id}</option>`)
        .join("");
      if (exp.atoms.some((a) => String(a.id) === previous))
        select.value = previous;
      else if (id === "bond-to" && exp.atoms.length > 1)
        select.value = exp.atoms.at(-1).id;
    }
  }
  function connectMoleculeAtoms(from, to) {
    const exp = activeExperiment,
      first = exp.atoms.find((a) => a.id === from),
      second = exp.atoms.find((a) => a.id === to);
    if (!first || !second || from === to) {
      feedback("请选择两个不同的原子。");
      return;
    }
    const max = { H: 1, C: 4, N: 3, O: 2 };
    if (exp.bonds.some((b) => b.includes(from) && b.includes(to))) {
      feedback("这两个原子已经相连。");
      return;
    }
    if (
      exp.bonds.filter((b) => b.includes(from)).length >= max[first.el] ||
      exp.bonds.filter((b) => b.includes(to)).length >= max[second.el]
    ) {
      feedback("超出本任务采用的常见成键数量，请检查或撤销连接。");
      return;
    }
    moleculeSnapshot();
    exp.bonds.push([from, to]);
    exp.showShape = false;
  }
  function moleculeSnapshot() {
    const exp = activeExperiment;
    exp.history.push(JSON.stringify({ atoms: exp.atoms, bonds: exp.bonds }));
    if (exp.history.length > 20) exp.history.shift();
  }
  function renderMoleculeSide() {
    const exp = activeExperiment,
      template = Science.templates[exp.task];
    $("#experiment-side").innerHTML =
      `<h3>搭建${template.name} ${template.formula}</h3><p>需要 1 个 ${template.center} 与 ${template.hydrogens} 个 H。先放置原子，再建立连接。</p><div class="pill-row">${Science.templates.map((t, i) => `<button class="pill ${i === exp.task ? "active" : ""}" data-molecule-task="${i}">${exp.done[i] ? "✓ " : ""}${t.formula}</button>`).join("")}</div><div class="atom-picker">${["C", "N", "O", "H"].map((el) => `<button class="atom-${el} ${el === exp.atom ? "active" : ""}" data-atom="${el}" aria-label="选择 ${el} 原子">${el}</button>`).join("")}</div><div class="pill-row"><button class="pill ${exp.mode === "place" ? "active" : ""}" data-molecule-mode="place">放置原子</button><button class="pill ${exp.mode === "bond" ? "active" : ""}" data-molecule-mode="bond">连接原子</button><button class="pill ${exp.mode === "delete" ? "active" : ""}" data-molecule-mode="delete">删除</button></div><button class="primary-button" id="check-molecule">${icon("check")}验证分子结构</button><div class="pill-row"><button class="pill" id="undo-molecule">撤销</button><button class="pill" id="reset-molecule">重置本任务</button><button class="pill" id="shape-molecule">查看空间模型</button></div><div class="experiment-feedback" id="experiment-feedback">放置：选一种原子，再点击空白处。连接：切换连接模式，依次点击两个原子。${template.formula}使用单键与有限模板验证。</div>${commonExperimentFooter("C06")}`;
    $(".atom-picker", modal).insertAdjacentHTML(
      "afterend",
      '<button class="pill" id="add-selected-atom">添加所选原子</button><p class="molecule-controls-label">也可以通过列表连接与删除原子</p><div class="accessible-bonds"><select id="bond-from" aria-label="起点原子"></select><select id="bond-to" aria-label="终点原子"></select><button id="connect-selected-atoms">连接</button><button id="delete-selected-atom">删除起点</button></div>',
    );
    updateMoleculeSelectors();
    $("#add-selected-atom").onclick = () => {
      if (exp.atoms.length >= 12) {
        feedback("当前任务最多放置 12 个原子。");
        return;
      }
      moleculeSnapshot();
      const index = exp.atoms.length,
        angle = ((index - 1) * Math.PI) / 2;
      exp.atoms.push({
        id: exp.nextId++,
        el: exp.atom,
        x: index === 0 ? 0.5 : 0.5 + Math.cos(angle) * 0.23,
        y: index === 0 ? 0.45 : 0.45 + Math.sin(angle) * 0.23,
      });
      exp.showShape = false;
      storeMolecule();
      drawMolecule();
    };
    $("#connect-selected-atoms").onclick = () => {
      connectMoleculeAtoms(
        Number($("#bond-from").value),
        Number($("#bond-to").value),
      );
      storeMolecule();
      drawMolecule();
    };
    $("#delete-selected-atom").onclick = () => {
      const id = Number($("#bond-from").value);
      if (!exp.atoms.some((a) => a.id === id)) return;
      moleculeSnapshot();
      exp.atoms = exp.atoms.filter((a) => a.id !== id);
      exp.bonds = exp.bonds.filter((b) => !b.includes(id));
      exp.selected = null;
      exp.showShape = false;
      storeMolecule();
      drawMolecule();
    };
    $$("[data-molecule-task]", modal).forEach(
      (b) =>
        (b.onclick = () => {
          exp.task = Number(b.dataset.moleculeTask);
          exp.atoms = [];
          exp.bonds = [];
          exp.history = [];
          exp.selected = null;
          exp.showShape = false;
          storeMolecule();
          renderMoleculeSide();
          drawMolecule();
        }),
    );
    $$("[data-atom]", modal).forEach(
      (b) =>
        (b.onclick = () => {
          exp.atom = b.dataset.atom;
          exp.mode = "place";
          exp.selected = null;
          renderMoleculeSide();
          drawMolecule();
        }),
    );
    $$("[data-molecule-mode]", modal).forEach(
      (b) =>
        (b.onclick = () => {
          exp.mode = b.dataset.moleculeMode;
          exp.selected = null;
          renderMoleculeSide();
          drawMolecule();
        }),
    );
    $("#check-molecule").onclick = () => {
      const result = Science.validateMolecule(exp.atoms, exp.bonds, exp.task);
      feedback(result.message, result.ok);
      if (result.ok) {
        exp.done[exp.task] = true;
        exp.showShape = true;
        storeMolecule();
        if (exp.done.every(Boolean)) completeExperiment("mole");
        $$("[data-molecule-task]", modal).forEach((b) => {
          const i = Number(b.dataset.moleculeTask);
          b.textContent = `${exp.done[i] ? "✓ " : ""}${Science.templates[i].formula}`;
        });
        drawMolecule();
      }
    };
    $("#undo-molecule").onclick = () => {
      if (!exp.history.length) {
        feedback("还没有可撤销的编辑。");
        return;
      }
      Object.assign(exp, JSON.parse(exp.history.pop()));
      exp.selected = null;
      exp.showShape = false;
      storeMolecule();
      drawMolecule();
    };
    $("#reset-molecule").onclick = () => {
      moleculeSnapshot();
      exp.atoms = [];
      exp.bonds = [];
      exp.selected = null;
      exp.showShape = false;
      storeMolecule();
      drawMolecule();
      feedback("当前搭建已清空，已完成任务记录保留。");
    };
    $("#shape-molecule").onclick = () => {
      exp.showShape = !exp.showShape;
      drawMolecule();
      feedback(
        `预设空间模型：${template.name}为${template.shape}。${template.lonePairs ? `中心原子有 ${template.lonePairs} 对孤电子对。` : ""}球棍比例与键长均为示意，二维拖放不是实际成键过程。`,
      );
    };
    $("#stage-formula").textContent = "";
    bindExperimentFooter();
  }
  function moleculeClick(event) {
    const exp = activeExperiment;
    if (!exp?.surface || exp.kind !== "mole") return;
    const rect = event.currentTarget.getBoundingClientRect(),
      x = (event.clientX - rect.left) / rect.width,
      y = (event.clientY - rect.top) / rect.height;
    const hit = exp.atoms.find(
      (a) =>
        Math.hypot((a.x - x) * rect.width, (a.y - y) * rect.height) <
        (a.el === "H" ? 19 : 25),
    );
    if (exp.mode === "delete") {
      if (hit) {
        moleculeSnapshot();
        exp.atoms = exp.atoms.filter((a) => a !== hit);
        exp.bonds = exp.bonds.filter((b) => !b.includes(hit.id));
        exp.selected = null;
      }
    } else if (exp.mode === "place") {
      if (hit) {
        feedback("这里已有原子。要连接它，请切换到“连接原子”。");
        return;
      }
      if (exp.atoms.length >= 12) {
        feedback("当前任务最多放置 12 个原子，请删除多余原子。");
        return;
      }
      moleculeSnapshot();
      exp.atoms.push({
        id: exp.nextId++,
        el: exp.atom,
        x: Math.max(0.04, Math.min(0.96, x)),
        y: Math.max(0.1, Math.min(0.88, y)),
      });
      exp.showShape = false;
    } else if (hit) {
      if (exp.selected === null) exp.selected = hit.id;
      else if (exp.selected !== hit.id) {
        connectMoleculeAtoms(exp.selected, hit.id);
        exp.selected = null;
      } else exp.selected = null;
    }
    storeMolecule();
    drawMolecule();
  }
  function drawMolecule() {
    const exp = activeExperiment;
    if (!exp?.surface || exp.kind !== "mole") return;
    const { ctx, width: w, height: h } = exp.surface;
    drawGrid(ctx, w, h, w / 2, h / 2, 30);
    const template = Science.templates[exp.task];
    $("#molecule-shape").textContent = exp.showShape
      ? `${template.formula} · ${template.shape}`
      : `已完成 ${exp.done.filter(Boolean).length}/3 个分子`;
    const colors = { C: "#43577b", N: "#5a87cf", O: "#bf7769", H: "#ffffff" };
    const atom = (el, x, y, selected = false, radius) => {
      const r = radius || (el === "H" ? 18 : 25);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        x - r * 0.3,
        y - r * 0.4,
        1,
        x,
        y,
        r,
      );
      gradient.addColorStop(
        0,
        el === "H"
          ? "#ffffff"
          : el === "O"
            ? "#e1a18c"
            : el === "N"
              ? "#9fbced"
              : "#a1b2cf",
      );
      gradient.addColorStop(1, colors[el]);
      ctx.fillStyle = gradient;
      ctx.shadowColor = "#31529422";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = selected ? "#4568ed" : "#748fbc66";
      ctx.lineWidth = selected ? 3 : 1;
      ctx.stroke();
      ctx.fillStyle = el === "H" ? "#526d99" : "#ffffff";
      ctx.font = '600 16px "Segoe UI"';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(el, x, y);
    };
    if (exp.showShape) {
      const cx = w / 2,
        cy = h / 2,
        unit = Math.min(w * 0.2, h * 0.19);
      const layouts = [
        [
          [0, -1],
          [0.95, 0.35],
          [-0.95, 0.35],
          [0.2, 1.1],
        ],
        [
          [0, -0.9],
          [-0.95, 0.6],
          [0.95, 0.6],
        ],
        [
          [-0.8, 0.65],
          [0.8, 0.65],
        ],
      ];
      const offsets = layouts[exp.task];
      offsets.forEach(([x, y], i) => {
        ctx.strokeStyle = "#9eb6d9";
        ctx.lineWidth = 5;
        ctx.setLineDash(exp.task === 0 && i === 3 ? [4, 5] : []);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + x * unit, cy + y * unit);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      atom(template.center, cx, cy, false, 32);
      offsets.forEach(([x, y]) =>
        atom("H", cx + x * unit, cy + y * unit, false, 21),
      );
      ctx.fillStyle = "#6787b9";
      for (let i = 0; i < template.lonePairs; i++) {
        const dx = (i - (template.lonePairs - 1) / 2) * 50;
        for (const off of [-5, 5]) {
          ctx.beginPath();
          ctx.arc(cx + dx + off, cy - 57, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.font = '11px "Microsoft YaHei"';
      ctx.fillStyle = "#697fa1";
      ctx.fillText(
        "预设空间模型 · 虚线表示向画面内的键，比例仅为示意",
        cx,
        h - 40,
      );
    } else {
      ctx.strokeStyle = "#8faad3";
      ctx.lineWidth = 5;
      exp.bonds.forEach(([from, to]) => {
        const a = exp.atoms.find((n) => n.id === from),
          b = exp.atoms.find((n) => n.id === to);
        if (a && b) {
          ctx.beginPath();
          ctx.moveTo(a.x * w, a.y * h);
          ctx.lineTo(b.x * w, b.y * h);
          ctx.stroke();
        }
      });
      exp.atoms.forEach((a) =>
        atom(a.el, a.x * w, a.y * h, a.id === exp.selected),
      );
      if (!exp.atoms.length) {
        ctx.fillStyle = "#9db5da";
        ctx.textAlign = "center";
        ctx.font = '42px "Segoe UI"';
        ctx.fillText(template.formula, w / 2, h / 2 - 12);
        ctx.font = '12px "Microsoft YaHei"';
        ctx.fillStyle = "#6e86ab";
        ctx.fillText("从右侧选择原子，点击这里开始搭建", w / 2, h / 2 + 24);
      }
      ctx.font = '11px "Microsoft YaHei"';
      ctx.fillStyle = "#697fa1";
      ctx.textAlign = "center";
      ctx.fillText(
        exp.mode === "place"
          ? `当前：放置 ${exp.atom} 原子`
          : exp.mode === "bond"
            ? "当前：依次点击两个原子以连接"
            : "当前：点击原子以删除",
        w / 2,
        h - 25,
      );
    }
  }

  // Map controls and keyboard-equivalent entry points.
  function mapActivationTarget(element) {
    const island = element.closest("[data-island],button[data-subject]");
    const subject = island?.dataset.island || island?.dataset.subject;
    if (["P", "M", "C"].includes(subject)) return { kind: "island", id: subject };
    const preview = element.closest("[data-node],[data-related],[data-route-next],[data-search-node],[data-index-node]");
    if (preview) {
      const id = preview.dataset.node || preview.dataset.related || preview.dataset.routeNext || preview.dataset.searchNode || preview.dataset.indexNode;
      if (byId[id]) return { kind: "level", id };
    }
    const direct = element.closest("[data-post-station],[data-post-place],[data-post-task],[data-post-open],[data-mail-open],[data-fv-open],[data-campaign-level],[data-chemistry-campaign-level],[data-primary],.postal-room [data-post-object],#world-edges [data-edge]");
    return direct && !direct.disabled ? { kind: "already-open", direct: true } : null;
  }
  window.AtlasMapActivation?.bind(document, {
    resolve: mapActivationTarget,
    enter(target) {
      if (target.kind === "island") {
        if (state.layer !== "island" || state.subject !== target.id) setSubject(target.id);
        panel.hidden = true;
      } else if (target.kind === "level") openPostalLevel(target.id);
    },
  });
  $(".brand").onclick = (event) => {
    event.preventDefault();
    fitMap();
  };
  $$("button[data-subject]").forEach(
    (b) => (b.onclick = () => setSubject(b.dataset.subject)),
  );
  $$("[data-mode]").forEach(
    (b) =>
      (b.onclick = () => {
        state.mode = b.dataset.mode;
        $$("[data-mode]").forEach((el) => {
          el.classList.toggle("active", el === b);
          el.setAttribute("aria-pressed", el === b);
        });
        renderMap();
        if (state.selected && !panel.hidden) renderPanel(byId[state.selected]);
        if (state.mode === "history")
          showHistory(state.subject === "ALL" ? null : state.subject);
      }),
  );
  $("#map-nodes").onclick = (event) => {
    const station = event.target.closest("[data-post-station]");
    if (station) return showPostalPlace(station.dataset.postStation);
    const portal = event.target.closest("[data-island]");
    if (portal) {
      renderWorldDossier(portal.dataset.island);
      return;
    }
    const b = event.target.closest("[data-node]");
    if (b) {
      if (state.mode === "history") {
        openNode(b.dataset.node, { focus: false });
        showHistory(byId[b.dataset.node].s);
      } else openNode(b.dataset.node);
    }
  };
  $("#map-nodes").addEventListener("focusin", (event) => {
    const node = event.target.closest("[data-node]");
    if (node?.matches(":focus-visible")) focusNode(byId[node.dataset.node]);
  });
  $("#world-edges").onclick = (event) => {
    const path = event.target.closest("[data-edge]");
    if (!path) return;
    const edge = EDGES.find((e) => e.id === path.dataset.edge);
    if (edge) showRelation(edge);
  };
  $("#relations-toggle").onclick = (e) => {
    state.relations = !state.relations;
    e.currentTarget.setAttribute("aria-pressed", state.relations);
    renderEdges();
    world.classList.toggle("relations-on", state.relations);
    if (state.relations)
      toast("点击连线查看解释；也可从知识手册的关系列表访问。");
  };
  const horizonStart = $("#horizon-start");
  if (horizonStart) horizonStart.onclick = continuePostalErrand;
  $("#journal-toggle").onclick = showJournal;
  $("#mail-toggle").onclick = showPostOffice;
  $("#postal-office-toggle").onclick = () => showPostalPlace("P");
  $("#postal-local-pins").onclick = event => {
    const station = event.target.closest("[data-post-station]");
    if (station) showPostalPlace(station.dataset.postStation);
  };
  $("#postal-task-strip").onclick = event => {
    const button = event.target.closest("[data-post-task]");
    if (button) openPostalLevel(button.dataset.postTask);
  };
  $("#help-toggle").onclick = showHelp;
  $("#list-toggle").onclick = showIndex;
  $("#quest-start").onclick = () => {
    continuePostalErrand();
  };
  $("#world-perspective").onclick = fitMap;
  $("#island-perspective").onclick = () => setSubject(state.lastIsland);
  $("#fog-toggle").onclick = () => {
    progress.fogEnabled = !progress.fogEnabled;
    save();
    applyScene();
    renderMap();
    toast(
      progress.fogEnabled
        ? "探索迷雾已开启，已发现的地标会保持清晰。"
        : "迷雾已关闭，正在查看完整地图。",
    );
  };
  $("#fit-map").onclick = fitMap;
  function zoom(factor) {
    state.zoom = Math.min(2.5, Math.max(1, state.zoom * factor));
    updateTransform();
    renderMap();
  }
  $("#zoom-in").onclick = () => zoom(1.15);
  $("#zoom-out").onclick = () => zoom(1 / 1.15);
  $("#search-toggle").onclick = () => {
    const el = $("#search-popover");
    el.hidden = !el.hidden;
    if (!el.hidden) {
      search($("#search-input").value);
      $("#search-input").focus();
    }
  };
  $("#search-input").oninput = (e) => search(e.target.value);
  let drag = null;
  stage.addEventListener("pointerdown", (event) => {
    if (
      event.target.closest(
        "button,a,input,aside,section,.map-view-switch,.map-tools,.perspective-switch,[data-edge]",
      )
    )
      return;
    drag = {
      x: event.clientX,
      y: event.clientY,
      px: state.pan.x,
      py: state.pan.y,
      id: event.pointerId,
    };
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("dragging");
  });
  stage.addEventListener("pointermove", (event) => {
    if (!drag) return;
    state.pan = {
      x: Math.max(-2300, Math.min(2300, drag.px + event.clientX - drag.x)),
      y: Math.max(-1800, Math.min(1800, drag.py + event.clientY - drag.y)),
    };
    updateTransform();
  });
  const endDrag = () => {
    drag = null;
    stage.classList.remove("dragging");
  };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
  stage.addEventListener(
    "wheel",
    (event) => {
      if (event.target.closest("aside,section,.search-popover")) return;
      event.preventDefault();
      zoom(event.deltaY < 0 ? 1.07 : 1 / 1.07);
    },
    { passive: false },
  );
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closeModal();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#search-popover,#search-toggle"))
      $("#search-popover").hidden = true;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!$("#search-popover").hidden) {
        $("#search-popover").hidden = true;
        $("#search-toggle").focus();
      } else if (!backdrop.hidden) closeModal();
      else if (!panel.hidden) {
        panel.hidden = true;
        state.selected = null;
        renderMap();
      }
    }
    if (
      event.key === "/" &&
      !event.target.matches("input,textarea") &&
      backdrop.hidden
    ) {
      event.preventDefault();
      $("#search-popover").hidden = false;
      search("");
      $("#search-input").focus();
    }
    if (event.key === "Tab" && !backdrop.hidden) {
      const focusable = $$(
        'button:not(:disabled),input:not(:disabled),select,a[href],summary,[tabindex="0"]',
        modal,
      ).filter((el) => el.getClientRects().length && !el.closest("[inert]"));
      if (!focusable.length) return;
      const first = focusable[0],
        last = focusable.at(-1);
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === modal)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  document.addEventListener("visibilitychange", () => {
    const exp = activeExperiment;
    if (
      document.hidden &&
      exp?.kind === "shoot" &&
      exp.running &&
      !exp.paused
    ) {
      exp.paused = true;
      exp.lastTimestamp = 0;
      $("#pause-ball").textContent = "继续";
      cancelAnimationFrame(raf);
    }
  });
  window.addEventListener("resize", () => {
    updateTransform();
    resizeExperiment();
  });
  window.addEventListener("pagehide", () => {
    clearTimeout(saveTimer);
    save();
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== "knowledge-islands-v2") return;
    save();
    renderMap();
    if (state.selected && !panel.hidden) renderPanel(byId[state.selected]);
    mailController?.render();
    postalRoomController?.render();
  });
  const art = $("#world-art");
  const finishLoading = () => {
    const loading = $("#map-loading");
    loading.classList.add("finished");
    setTimeout(() => {
      loading.hidden = true;
    }, 550);
  };
  art.addEventListener("load", finishLoading);
  art.addEventListener("error", () => {
    finishLoading();
    toast("地图插画暂时无法加载，地点索引和实验仍可使用。");
  });
  if (art.complete) finishLoading();
  // Presentation-only camera handoff: it never grants discoveries or spends resources.
  window.AtlasMapArrival = {
    stage,
    prepare() {
      if (!backdrop.hidden) closeModal();
      state.worldCamera = { zoom: 1, pan: { x: 0, y: 0 } };
      fitMap();
      updateTransform(false);
      return { world, stage };
    },
    settle() { updateTransform(false); },
    focus() { $("#world-perspective").focus({ preventScroll: true }); },
  };
  applyScene();
  renderMap();
  updateTransform();
  panel.hidden = true;
  if (!storageAvailable)
    setTimeout(() => toast("本地记录不可用，本次探索仍可继续。"), 1200);
  updateSaveStatus();
})();
