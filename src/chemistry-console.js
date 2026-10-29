/* Chemistry archive and compatibility entry into the shared Physics workbench. */
(() => {
  const D = window.AtlasChemistryData,
    A = window.AtlasChemistryArt;
  const esc = (s) =>
    String(s).replace(
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
  function create(options) {
    return window.AtlasSubjectLevels.createChemistry(options);
  }
  function mountHistory(root, options) {
    let selected = D.byId[options.selected] ? options.selected : "C01",
      view = "stories";
    function render() {
      const l = D.byId[selected];
      root.classList.add("history-modal", "chem-history-modal");
      root.innerHTML = `${options.closeButton}<header class="history-header"><p class="modal-eyebrow">CHEMISTRY / PEOPLE & DISCOVERIES</p><h2 id="modal-title">物质的秘密，谁在追问？</h2><p class="modal-subtitle">十份档案，十位研究者。史实与教学改编分别说明。</p></header><div class="history-toolbar"><div class="history-aspects">${[
        ["stories", "发现故事"],
        ["people", "化学人物"],
      ]
        .map(
          ([key, name]) =>
            `<button data-chem-history-view="${key}" aria-pressed="${view === key}">${name} <small>10</small></button>`,
        )
        .join(
          "",
        )}</div><nav class="history-subjects" aria-label="故事所属学科">${[
        ["P", "物理"],
        ["M", "数学"],
        ["C", "化学"],
      ]
        .map(
          ([key, name]) =>
            `<button data-chem-history-subject="${key}" aria-pressed="${key === "C"}">${name}</button>`,
        )
        .join(
          "",
        )}</nav></div><div class="chem-archive-body"><aside class="chem-archive-rail" aria-label="选择化学人物">${D.levels.map((person) => `<button data-chem-history-id="${person.id}" aria-pressed="${person.id === selected}"><span>${A.portrait(person.id)}</span><div><strong>${esc(person.person)}</strong><small>${esc(person.concept)}</small></div></button>`).join("")}</aside><article class="chem-archive-reader"><div class="chem-archive-art">${view === "stories" ? A.scene(l.id) : `<span>${A.portrait(l.id)}</span>`}</div><div class="chem-archive-copy"><small>${esc(l.era)} · ${esc(l.concept)}</small><h3>${esc(view === "stories" ? l.title : l.person)}</h3>${view === "people" ? `<p class="chem-history-life">${esc(l.english)} · ${esc(l.life)}</p>` : ""}<h4>${view === "stories" ? "真实研究的线索" : "研究与贡献"}</h4><p>${esc(l.history)}</p><h4>在游戏中重新追问</h4><p>${esc(l.opening)}</p><h4>从这里带走的认识</h4><p>${esc(l.takeaway)}</p><details><summary>教学模型与史实边界</summary><p>${esc(l.boundary)}</p><p>人物形象为原创示意；场景、对白与任务为教学创作。</p></details><div class="history-sources"><h4>史料与模型资料</h4>${l.sources.map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`).join("")}</div></div><footer><button data-chem-history-map="${l.id}">在地图找到${esc(l.place)}</button><button data-chem-history-play="${l.id}">进入对应关卡 →</button></footer></article></div>`;
      root.querySelector(".modal-close").onclick = options.onClose;
      root.querySelectorAll("[data-chem-history-id]").forEach(
        (b) =>
          (b.onclick = () => {
            selected = b.dataset.chemHistoryId;
            render();
            root
              .querySelector(`[data-chem-history-id=${selected}]`)
              .focus({ preventScroll: true });
          }),
      );
      root.querySelectorAll("[data-chem-history-view]").forEach(
        (b) =>
          (b.onclick = () => {
            view = b.dataset.chemHistoryView;
            render();
            root
              .querySelector(`[data-chem-history-view=${view}]`)
              .focus({ preventScroll: true });
          }),
      );
      root.querySelectorAll("[data-chem-history-subject]").forEach(
        (b) =>
          (b.onclick = () => {
            if (b.dataset.chemHistorySubject !== "C")
              options.onSubject(b.dataset.chemHistorySubject);
          }),
      );
      root.querySelector("[data-chem-history-play]").onclick = () =>
        options.onPlay(selected);
      root.querySelector("[data-chem-history-map]").onclick = () =>
        options.onExplore(selected);
    }
    render();
  }
  window.AtlasChemistryConsole = { create, mountHistory };
})();
