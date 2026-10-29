/* One optional postal panel. Entering a lab never requires passing through it. */
(() => {
  const D = window.AtlasWorldlineData, W = window.AtlasWorldline;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  function mount(root, { getProgress, onDeliver, onOpen, onReplay, onAppendix, onHome, onClose, closeButton }) {
    let selected = W.current(getProgress())?.id || "R05";
    let resizeFrame = 0;
    function revealSelectedChapter() {
      const nav = root.querySelector(".mail-chapters"), button = root.querySelector(`[data-mail-chapter="${selected}"]`);
      if (!nav || !button) return;
      const left = button.getBoundingClientRect().left - nav.getBoundingClientRect().left;
      if (left < 0 || left + button.offsetWidth > nav.clientWidth)
        nav.scrollLeft += left - (nav.clientWidth - button.offsetWidth) / 2;
    }
    function resize() {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(revealSelectedChapter);
    }
    function render() {
      const p = getProgress(), state = W.status(p, selected), c = state.chapter;
      const done = D.chapters.filter(c => p.mailDeliveries[c.id]).length;
      const readings = records => records.map(r => `<div class="mail-record"><small>${r.condition === 0 || r.round === 0 ? "参照条件" : "新条件"}</small><dl>${(r.readings || r.result?.readings || []).map(([name,value]) => `<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>${r.fixed?.purpose?`<p class="at-record-scope">用途：${esc(r.fixed.purpose)}<br>条件：${esc(r.fixed.conditions)}<br>尚未检查：${(r.fixed.notTested||[]).map(esc).join("；")}</p>`:""}</div>`).join("");
      const evidence = (id, artifact) => {
        const history = Object.values(p.researchHistory).filter(h => h?.id === id);
        if (!artifact?.complete && !history.length) return "";
        const revision = artifact?.revisions.find(r => r.ref === artifact.currentRef);
        const currentEvidence = !revision ? "<p>尚未归档有效成果。可以回看先前尝试，继续核对。</p>" : revision.records.length ? `<p>读数按取得时的规则保留，未重算历史成绩。</p>${readings(revision.records)}` : "<p>已有完成记录。原始参数与测量未保留，因此这里不补写读数或比较过程。</p>";
        return `<details class="mail-evidence"><summary>查看归档依据${history.length ? "与先前尝试" : ""}</summary>${currentEvidence}${(revision?.studies||[]).map(study=>`<p>本人推理（引用 ${study.references.length} 条记录）：${esc(study.text)}</p>`).join("")}${history.map((h,i) => `<details><summary>先前尝试 ${i+1}</summary>${readings(h.record?.records || (h.record?.log || []).filter(r => r.action === "experiment")) || "<p>这次尝试没有正式实验读数。</p>"}</details>`).join("")}</details>`;
      };
      const item = id => {
        const artifact = p.mailArtifacts[id], ready = artifact?.complete;
        const side = W.appendixStatus(p,id), reply = side && window.AtlasAppendixData.definitions[id];
        const extra = side ? `<div class="mail-appendix"><small>收件人：${esc(reply.receiver)} · ${side.waiting?"等所属章节交付后补寄":side.sent?"追加回条已留存":"独立附页"}</small>${side.sent?`<blockquote>${esc(window.AtlasAppendixPost.page(p,id)?.text||reply.receipt)}</blockquote>`:""}${side.ready||side.sent?`<button data-mail-appendix="${id}">${side.ready?"寄出附页 / 补订页":"回看实寄附页"} →</button>`:""}</div>` : "";
        return `<li class="mail-item ${ready ? "is-ready" : ""}"><span aria-hidden="true">${ready ? "✓" : "○"}</span><div><strong>${esc(D.tasks[id].title)}</strong><small>${id} · ${ready ? artifact.revisions?.at(-1)?.source === "legacy-completion" ? "已有完成记录，未补造原始读数" : "成果已归档" : "可自由前往，完成后夹入本章"}</small>${evidence(id,artifact)}${extra}</div><button data-mail-open="${id}">${ready ? "回访" : "前往"} ↗</button></li>`;
      };
      const receipt = p.mailDeliveries[c.id];
      root.classList.add("mail-modal");
      root.innerHTML = `${closeButton}<header class="mail-header"><span class="modal-eyebrow">THE ISLAND POST / 把问题寄出去</span><p class="mail-route">潮汐港 <i>→</i> 标本港 <i>→</i> 测绘台 <i>→</i> 潮汐港</p><h2 id="modal-title">${done === 5 ? "信袋回来了，桌角留给下一位" : "一份成果，要有人接着用"}</h2><p class="modal-subtitle">${done === 5 ? "你有了正式桌位，阿墨仍和你搭档。三十个现场继续开放。" : "三岛可以自由往返。先整理各地成果，再按次序共同交付；不要求三星或补充委托。"}</p><span class="mail-stamp">${done} / 5 份回条</span></header>
      <nav class="mail-chapters" aria-label="五段邮路">${D.chapters.map(ch => `<button data-mail-chapter="${ch.id}" aria-pressed="${ch.id === selected}"><small>${ch.id} ${p.mailDeliveries[ch.id] ? "· 已送达" : W.status(p, ch.id).ready ? "· 待交付" : ""}</small>${esc(ch.title)}</button>`).join("")}</nav>
      <section class="mail-manifest" aria-label="当前邮路货单"><div class="mail-section-heading"><span>${c.id} / ${receipt ? "已送达" : "委托单"}</span><h3>${esc(c.title)}</h3><p>${esc(c.need)}</p></div><ul>${c.main.map(item).join("")}</ul>
      ${receipt ? `<article class="mail-receipt" aria-label="${c.id} 回条"><small>已收 / 回条留存</small><blockquote>${esc(c.receipt)}</blockquote><p>——${esc(c.sender)}</p><span>${esc(c.effect)}</span></article>` : `<div class="mail-delivery"><p role="status">${state.missing.length ? `还需 ${state.missing.length} 份主线成果。已完成的页会一直保留。` : !state.previousDelivered ? "三份成果已备好；先完成前一段交付，这些记录无需重做。" : "三份成果齐了，可以一同寄出。"}</p><button class="primary-button" data-mail-deliver="${c.id}" ${state.ready ? "" : "disabled"}>${c.id === "R01" ? "寄出第一船信" : "共同交付"} →</button></div>`}
      <details class="mail-optional"><summary>本章的补充委托 · 可选</summary><ul>${c.side.map(item).join("")}</ul><p>现在做或以后补寄都可以，不会让已经送达的货物退回岸上。</p></details></section>
      <footer class="mail-letter"><small>00 / 给下一位愿意试试的人</small><p>${p.mailFacts.firstArtifact ? `袋里已经有${Object.values(p.mailArtifacts).filter(a => a.complete).length}份成果。${esc(Object.values(p.mailArtifacts).find(a => a.complete)?.title || "已有成果")}可以成为回信的一行；具体引用留待整理回信时选择。` : "先留一张空白纸。弄明白一件事，就能往上写一行。"}</p></footer>`;
      root.querySelector(".modal-close").onclick = onClose;
      if (onHome) {
        const home=document.createElement("button");home.dataset.mailHome="P";home.className="mail-home-link";home.textContent="回潮汐港 · 看看桌角与伙伴 ↗";
        root.querySelector(".mail-header").append(home);
      }
      if (receipt && ["R01", "R02", "R03", "R04", "R05"].includes(c.id) && onReplay) {
        const button = document.createElement("button");
        button.textContent = c.id === "R01" ? "重看首航与小禾回条 →" : c.id === "R02" ? "重看夜班交接与回条 →" : c.id === "R03" ? "重看两岸修订与补注 →" : c.id === "R04" ? "重看图册与展开折角 →" : "重看整圈返航与 00 回信 →";
        button.className = "primary-button"; button.dataset.mailReplay = c.id;
        root.querySelector(".mail-receipt").append(button);
      }
      if (Object.keys(D.tasks).every(id => p.mailArtifacts[id]?.complete)) {
        const banner=document.createElement('p');banner.className='ap-full-atlas';banner.dataset.fullAtlas='true';banner.textContent='邮路全览 / 30 份成果已归档，全部现场恢复色彩。主线与追加页各自保留来历。';root.querySelector('.mail-header').append(banner);
      }
      const savedLetter = W.letter(p);
      if (savedLetter) root.querySelector(".mail-letter p").textContent = savedLetter.text;
      revealSelectedChapter();
    }
    function click(event) {
      const button = event.target.closest("button");
      if (!button || !root.contains(button) || button.disabled) return;
      if (button.dataset.mailChapter) {
        selected = button.dataset.mailChapter; render();
        root.querySelector(`[data-mail-chapter="${selected}"]`)?.focus();
      }
      if (button.dataset.mailOpen) onOpen(button.dataset.mailOpen);
      if (button.dataset.mailHome) { onHome?.(); return; }
      if (button.dataset.mailAppendix) { onAppendix?.(button.dataset.mailAppendix, {send: W.appendixStatus(getProgress(),button.dataset.mailAppendix).ready}); return; }
      if (button.dataset.mailReplay) { onReplay?.(button.dataset.mailReplay); return; }
      if (button.dataset.mailDeliver) {
        if (onDeliver(button.dataset.mailDeliver) === true) return;
        render();
        root.querySelector(`[data-mail-chapter="${selected}"]`)?.focus();
      }
    }
    root.addEventListener("click", click);
    window.addEventListener("resize", resize);
    render();
    return { render, destroy() {
      root.removeEventListener("click", click);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(resizeFrame);
    } };
  }
  window.AtlasWorldlineView = { mount };
})();
