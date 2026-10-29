/* The discovery archive offers two ways into the same people and questions. */
(() => {
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
  let portraitSerial = 0;

  function portrait(id, name) {
    const colors = {
      "#8c9fc5": "#8b8174",
      "#bdcbea": "#c7b99b",
      "#dfe8fa": "#e5ded1",
      "#eef3ff": "#f3eddf",
      "#f8faff": "#fffaf0",
      "#667a9d": "#5a5149",
    };
    const coat = window.AtlasPhysicsAtlasArt.themes[id].accent;
    const svg = window.AtlasPhysicsArt.portrait(id)
      .replace(/#[\da-f]{6}/g, (color) => colors[color] || color)
      .replace(/(<path d="M40 94[^\"]*" fill=")[^"]+/, `$1${coat}`)
      .replaceAll(`etch-${id}`, `history-etch-${++portraitSerial}`);
    return `<span class="history-portrait" role="img" aria-label="${escape(name)}的示意插画">${svg}</span>`;
  }

  function mount(root, options) {
    const { entries, byId } = window.AtlasPhysicsHistory;
    const physics = window.AtlasPhysicsData.byId;
    const state = {
      subject: ["P", "M", "C"].includes(options.subject)
        ? options.subject
        : "P",
      view: "stories",
      selected: byId[options.selected] ? options.selected : "P01",
    };
    const names = { P: "物理", M: "数学", C: "化学" };
    const number = (id) => id.slice(1);
    const sources = (entry) =>
      `<section class="history-sources"><h4>史料与延伸阅读</h4>${entry.sources.map(([label, url]) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} <span aria-hidden="true">↗</span></a>`).join("")}<p>人物为原创示意插画；文字依据所列资料整理。</p></section>`;

    function rail() {
      const people = state.view === "people";
      return `<aside class="history-rail ${people ? "history-people-rail" : ""}" aria-label="${people ? "选择物理人物" : "选择发现故事"}"><p class="history-rail-label">${people ? "PHYSICISTS / 人物图鉴" : "TEN QUESTIONS / 问题脉络"}</p><div class="history-entry-list">${entries
        .map((entry) => {
          const person = physics[entry.id];
          return `<button class="history-entry ${state.selected === entry.id ? "is-active" : ""}" data-history-entry="${entry.id}" data-focus="entry-${entry.id}" aria-pressed="${state.selected === entry.id}">${people ? portrait(entry.id, person.person) : `<span class="history-entry-number">${number(entry.id)}</span>`}<span class="history-entry-copy"><strong>${escape(person.person)}</strong><small>${escape(people ? person.concept : entry.title)}</small></span></button>`;
        })
        .join("")}</div></aside>`;
    }

    function story(entry, person) {
      return `<div class="history-story-art">${window.AtlasPhysicsAtlasArt.scene(entry.id)}<span class="history-art-tag">DISCOVERY ${number(entry.id)} / 10</span></div><article class="history-story-article"><div class="history-meta"><span>${escape(entry.year)}</span><span>${escape(person.concept)}</span></div><h3 id="history-entry-title">${escape(entry.title)}</h3><p class="history-deck">${escape(entry.deck)}</p><button class="history-byline" data-history-view="people" data-focus="byline">${portrait(entry.id, person.person)}<span><strong>${escape(person.person)}</strong><small>认识这位研究者 <span aria-hidden="true">↗</span></small></span></button><div class="history-narrative">${entry.sections.map(([heading, body], index) => `<section><span class="history-section-number">0${index + 1}</span><div><h4>${escape(heading)}</h4><p>${escape(body)}</p></div></section>`).join("")}</div><p class="history-open-question"><span>问题继续向前</span>${escape(entry.bridge)}</p><details class="history-adaptation"><summary>这段历史，在游戏里如何呈现？</summary><p>${escape(entry.boundary)}</p><button data-history-map="${entry.id}">在地图上找到${escape(person.place)} →</button></details>${sources(entry)}</article>`;
    }

    function profile(entry, person) {
      return `<article class="history-person-article"><header class="history-profile-hero"><div class="history-profile-portrait">${portrait(entry.id, person.person)}<small>人物示意插画</small></div><div class="history-profile-heading"><p class="history-meta">PHYSICIST ${number(entry.id)} / 10</p><h3 id="history-entry-title">${escape(person.person)}</h3><p class="history-english">${escape(person.english)}</p><p class="history-life">${escape(entry.life)} <span>· ${escape(entry.region)}</span></p><span class="history-field">${escape(entry.field)}</span></div></header><p class="history-person-bio">${escape(entry.bio)}</p><section class="history-contributions"><h4>${entry.id === "P08" ? "她" : "他"}留下了什么？</h4><div>${entry.contributions.map((contribution, index) => `<p><b>0${index + 1}</b>${escape(contribution)}</p>`).join("")}</div></section><section class="history-milestones"><h4>研究与接力</h4><ol>${entry.milestones.map(([date, text]) => `<li><span>${escape(date)}</span><p>${escape(text)}</p></li>`).join("")}</ol></section><button class="history-story-link" data-history-view="stories" data-focus="profile-story"><small>从一个具体问题，了解这位人物</small><strong>${escape(entry.title)} <span aria-hidden="true">→</span></strong></button>${sources(entry)}</article>`;
    }

    function physicsWorkspace() {
      const entry = byId[state.selected],
        person = physics[entry.id],
        theme = window.AtlasPhysicsPixelArt.themes[entry.id];
      return `<div class="history-workspace" style="--history-accent:${theme.accent}">${rail()}<section class="history-reader" aria-labelledby="history-entry-title"><div class="history-reader-scroll">${state.view === "stories" ? story(entry, person) : profile(entry, person)}</div><footer class="history-actions"><button class="history-secondary" data-history-view="${state.view === "stories" ? "people" : "stories"}" data-focus="switch-related">${state.view === "stories" ? "认识" + escape(person.person) : "阅读发现故事"}</button><button class="history-primary" data-history-play="${entry.id}">走进对应关卡 <span aria-hidden="true">→</span></button></footer></section></div>`;
    }

    function otherStories() {
      return `<div class="history-other-stories"><p class="history-other-intro">${names[state.subject]}也从一个个具体问题中生长。先沿着这三个切面，回到概念的起点。</p>${options.histories[state.subject].map((entry, index) => `<article class="history-story"><small>0${index + 1} / ${escape(entry.era)}</small><h3>${escape(entry.title)}</h3><p class="history-other-question">${escape(entry.question)}</p><p>${escape(entry.text)}</p><button class="related-node" data-history-map="${entry.node}">探索相关概念：${escape(options.nodes[entry.node].title)} →</button></article>`).join("")}</div>`;
    }

    function render(focusKey) {
      if (state.subject === "C") {
        window.AtlasChemistryConsole.mountHistory(root, {
          ...options,
          selected: window.AtlasChemistryData.byId[options.selected]
            ? options.selected
            : state.selected,
          onSubject: (subject) => {
            state.subject = subject;
            root.classList.remove("chem-history-modal");
            render();
          },
        });
        return;
      }
      const isPhysics = state.subject === "P";
      root.classList.add("history-modal");
      root.innerHTML = `${options.closeButton}<header class="history-header"><p class="modal-eyebrow">PEOPLE, QUESTIONS & DISCOVERIES</p><h2 id="modal-title">${isPhysics ? "发现背后的人与故事" : names[state.subject] + "，从问题开始"}</h2><p class="modal-subtitle">${isPhysics ? "十段发现，十位研究者。沿着问题，走近物理。" : "沿着问题的来路，理解概念为什么出现。"}</p></header><div class="history-toolbar">${isPhysics ? `<div class="history-aspects" role="group" aria-label="阅读视角"><button data-history-view="stories" data-focus="view-stories" aria-pressed="${state.view === "stories"}"><span>01</span>发现故事 <small>10</small></button><button data-history-view="people" data-focus="view-people" aria-pressed="${state.view === "people"}"><span>02</span>物理人物 <small>10</small></button></div>` : '<span class="history-toolbar-caption">发现故事 / DISCOVERY STORIES</span>'}<nav class="history-subjects" aria-label="故事所属学科">${Object.entries(
        names,
      )
        .map(
          ([subject, name]) =>
            `<button data-history-subject="${subject}" data-focus="subject-${subject}" aria-pressed="${state.subject === subject}">${name}</button>`,
        )
        .join(
          "",
        )}</nav></div>${isPhysics ? physicsWorkspace() : otherStories()}`;
      root.querySelector(".modal-close").onclick = options.onClose;
      root.querySelectorAll("[data-history-view]").forEach(
        (button) =>
          (button.onclick = () => {
            state.view = button.dataset.historyView;
            render(
              button.dataset.focus?.startsWith("view-")
                ? button.dataset.focus
                : "view-" + state.view,
            );
          }),
      );
      root.querySelectorAll("[data-history-subject]").forEach(
        (button) =>
          (button.onclick = () => {
            state.subject = button.dataset.historySubject;
            render(button.dataset.focus);
          }),
      );
      root.querySelectorAll("[data-history-entry]").forEach(
        (button) =>
          (button.onclick = () => {
            state.selected = button.dataset.historyEntry;
            render(button.dataset.focus);
          }),
      );
      root
        .querySelectorAll("[data-history-play]")
        .forEach(
          (button) =>
            (button.onclick = () => options.onPlay(button.dataset.historyPlay)),
        );
      root
        .querySelectorAll("[data-history-map]")
        .forEach(
          (button) =>
            (button.onclick = () =>
              options.onExplore(button.dataset.historyMap)),
        );
      if (focusKey)
        root
          .querySelector(`[data-focus="${focusKey}"]`)
          ?.focus({ preventScroll: true });
      const selected = root.querySelector(".history-entry.is-active");
      if (selected) {
        const list = selected.parentElement;
        if (matchMedia("(max-width: 700px)").matches)
          list.scrollLeft = selected.offsetLeft - list.offsetLeft - 8;
        else if (selected.offsetTop + selected.offsetHeight > list.clientHeight)
          list.scrollTop = selected.offsetTop - list.offsetTop - 80;
      }
    }
    render();
  }
  window.AtlasHistoryView = { mount };
})();
