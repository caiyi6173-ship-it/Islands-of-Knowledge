/* The post office is an optional place to revisit, never a checkpoint before a lab. */
(() => {
  const World=window.AtlasPostalWorld,D=window.AtlasWorldlineData,Art=window.AtlasPostalArt;
  const patch=window.AtlasPhysicsSandbox.patch;
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const objectNames={desk:'借来的桌角',receipts:'回条绳',folio:'图夹里的原页',bag:'这一趟的信袋',letter:'00 · 给下一位愿意试试的人'};
  function create(host,options) {
    const {station,getProgress,onStation,onOpen,onManifest,onDeliver,onReplay,onAppendix,onMeet,onDecorate,onLetter,onExplore,onClose}=options;
    const place=World.stations[station];
    let selected=station==='P'?'desk':station==='C'?'xiaohe':'folio',receiptId=null,dialogue=null,dialoguePhase=-1,destroyed=false;
    host.className='postal-room';host.dataset.station=station;
    host.innerHTML=`<header class="post-room-header"><div><small>THE ISLAND POST / ${station==='P'?'HOME PORT':station==='C'?'OBSERVATION WINDOW':'MAP DESK'}</small><h2 id="modal-title">${place.name}</h2></div><button data-post-action="close" aria-label="回到地图">✕</button></header>
      <nav class="post-room-nav" aria-label="三个接应站">${Object.values(World.stations).map(p=>`<button data-post-place="${p.id}" aria-current="${p.id===station?'page':'false'}">${p.id==='P'?'01':p.id==='C'?'02':'03'} / ${p.name}</button>`).join('')}</nav>
      <div class="post-room-layout"><div class="post-room-main"><div class="post-room-label"><span class="post-current-era"></span><span>点物件，看看后来发生了什么</span></div><div class="post-room-scene"><div class="post-room-art"></div><div class="post-room-hotspots" aria-hidden="true">${Art.hotspots[station].map(([id,label,x,y])=>`<button data-post-object="${id}" tabindex="-1" style="left:${x}%;top:${y}%" aria-label="${World.companions[id]?'和':'查看'}${label}"><i aria-hidden="true"></i><span>${label}</span></button>`).join('')}</div></div>
      <div class="post-object-list" aria-label="可查看的物件与伙伴">${Art.hotspots[station].map(([id,label])=>`<button data-post-object="${id}">${World.companions[id]?'◌':'⌑'} ${label}</button>`).join('')}</div>
      <p class="post-place-life"></p></div>
      <aside class="post-inspector" aria-label="物件与人物详情"><div class="post-inspector-content"></div></aside><section class="post-commission" aria-label="当前委托"></section></div>
      <footer class="post-room-footer"><span>三站随时可去 · 看物件与交谈不消耗研究额度</span><div><button data-post-action="manifest">完整货单与原始依据 ↗</button><button data-post-action="explore">去${place.island}自由探索 →</button></div></footer>`;

    function taskRows(s) {
      return s.tasks.map(t=>`<li><span class="${t.complete?'post-check':''}">${t.complete?'✓':'○'}</span><div><strong>${esc(t.title)}</strong><small>${t.id} · ${World.stations[t.station].island} · ${t.complete?'已归档':'待核对'}</small></div><button data-post-open="${t.id}">${t.complete?'回访':'前往'} →</button></li>`).join('');
    }
    function deliveryButton(s) {
      return s.chapter?`<button class="post-primary" data-post-action="deliver" ${s.ready?'':'disabled'}>${s.ready?`${s.phase?'共同交付':'寄出第一船信'} →`:`还需 ${s.missing.length} 份主线成果`}</button>`:'<p class="post-finished">✓ 五份回条留存。邮路照常往返，探索继续。</p>';
    }
    function commission(s) {
      return s.chapter?`<div class="post-commission-heading"><small>${s.chapter.id} / 当前委托</small><h3>${esc(s.chapter.title)}</h3><p>${esc(s.chapter.need)}</p></div><ul>${taskRows(s)}</ul>${s.ready?deliveryButton(s):''}`:
        '<div class="post-commission-heading"><small>THE NEXT DAY</small><h3>信袋回来了，位置留给下一位</h3><p>你的桌位在这里。未做的补充委托和三十个现场仍可自由进入。</p></div>';
    }
    function desk(s) {
      return `<small class="post-inspector-kicker">A CORNER TO KEEP</small><h3>${s.formalDesk?'你的正式桌位':'老乔借出的桌角'}</h3><p>${s.formalDesk?'临时纸条换成了收信格。阿墨仍是搭档，旁边又腾出一角。':'先在这里整理。回条和小物会留下来，有了三份记录就能寄出，不必把桌面摆满。'}</p><div class="post-keepsake"><b>${esc(s.decoration.name)}</b><p>${esc(s.decoration.note)}</p></div><h4>桌上放哪一件</h4><div class="post-keepsake-choices">${s.owned.map(k=>`<button data-post-decor="${k.id}" aria-pressed="${k.id===s.decoration.id}">${esc(k.name)}</button>`).join('')}</div><p class="post-small">小物来自已经收到的回条。摆放只改变桌面，不影响交付。</p>`;
    }
    function appendixReplies() {
      const p=getProgress();return Object.keys(p.mailAppendices).map(id=>{const reply=window.AtlasAppendixPost.page(p,id);return `<details class="mail-appendix"><summary>${esc(reply.receiver)} · ${esc(reply.title)}</summary><blockquote>${esc(reply.text)}</blockquote><button data-post-appendix="${id}">查看实际寄出的附页 →</button></details>`;}).join('');
    }
    function receipts(s) {
      const extras=appendixReplies();
      const receipt=s.receipts.find(c=>c.id===receiptId)||s.receipts.at(-1);
      return `<small class="post-inspector-kicker">LETTERS THAT CAME BACK</small><h3>${s.receipts.length?'每一张，真的有人回过信':'绳上还空着'}</h3>${receipt?`<div class="post-receipt-tabs">${s.receipts.map(c=>`<button data-post-receipt="${c.id}" aria-pressed="${c.id===receipt.id}">${c.id}</button>`).join('')}</div><article class="post-kept-receipt"><small>${receipt.id} / ${esc(receipt.title)} · 已收</small><blockquote>${esc(receipt.receipt)}</blockquote><p>—— ${esc(receipt.sender)}</p></article><p>${esc(receipt.effect)}</p>${['R01','R02','R03','R04','R05'].includes(receipt.id)?`<button data-post-action="replay" data-post-replay="${receipt.id}">${receipt.id==='R01'?'重看首航与缺角箱回条':receipt.id==='R02'?'重看夜班交接与回条':receipt.id==='R03'?'重看两岸修订与补注':receipt.id==='R04'?'重看图册与展开折角':'重看整圈返航与 00 回信'} →</button>`:''}`:'<p>老乔已经留好位置。收到回信时，绳上才会多一张纸；只进过关卡不会盖“已收”。</p><button data-post-object="bag">看看第一趟还缺什么 →</button>'}${extras}`;
    }
    function recordDetails(artifact) {
      const revision=artifact.revisions.find(r=>r.ref===artifact.currentRef);
      const readings=revision.records.flatMap(r=>r.readings||[]);
      return `<details class="post-source"><summary>${esc(artifact.title||D.tasks[artifact.id].title)} <small>${artifact.id}</small></summary>${readings.length?`<p>保留取得时的规则与原始读数。</p><dl>${readings.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`:'<p>已有完成记录；原始读数未保留，这里不补写数值或比较过程。</p>'}${revision.records.filter(r=>r.fixed?.purpose).map(r=>`<p class="at-record-scope">用途：${esc(r.fixed.purpose)}<br>条件：${esc(r.fixed.conditions)}<br>尚未检查：${(r.fixed.notTested||[]).map(esc).join('；')}</p>`).join('')}${(revision.studies||[]).map(study=>`<p>本人推理（引用 ${study.references.length} 条记录）：${esc(study.text)}</p>`).join('')}<button data-post-open="${artifact.id}">去现场回访 →</button></details>`;
    }
    function folio(s) {
      const artifacts=Object.values(s.artifacts);
      const preferred=[...(s.chapter?.main||[]),...(D.chapters[s.phase-1]?.main||[]),...artifacts.map(a=>a.id).reverse()];
      const shown=[...new Set(preferred)].map(id=>s.artifacts[id]).filter(Boolean).slice(0,6);
      return `<small class="post-inspector-kicker">ORIGINALS & NOTES</small><h3>${s.phase>=4?'条件已经夹在正面':s.phase>=3?'原页和对岸补注都在':'给原页留一个地方'}</h3><p>${s.phase>=4?'阿墨展开了折角。来历与未查的条件跟着正文一起走。':s.phase>=3?'小禾也寄回了改稿。旧站章继续只记收寄，不代替内容核对。':'成果按原来的依据保留。以后修订可以另加一页，不必把原来的判断抹掉。'}</p><p class="post-small">已归档 ${artifacts.length} / 30 份，这里展示 ${shown.length} 份。完整内容在货单里。</p>${shown.map(recordDetails).join('')||'<div class="post-empty-note">这只图夹还空着。去现场留下第一份正式记录吧。</div>'}<button data-post-action="manifest">完整货单与所有依据 ↗</button>`;
    }
    function bag(s) {
      return `<small class="post-inspector-kicker">THE BAG FOR THIS TRIP</small><h3>${s.chapter?esc(s.chapter.title):'这一圈，已经回来了'}</h3><p>${s.phase===0?'留样和清单副本可以先随信使走；四箱整批货仍在潮汐港，三份成果齐备才发船。':s.phase===5?'第四箱的样品已归档，空箱带回新问题。正式信袋仍会带你去未探索的地方。':'首批四箱已经交付。现在装进信袋的是这一趟要带去的记录，货物不会因重做退回岸上。'}</p><ul class="post-bag-tasks">${taskRows(s)}</ul>${deliveryButton(s)}`;
    }
    function letter(s) {
      const available=D.letterSources.filter(id=>s.artifacts[id]?.complete&&getProgress().mailFacts.letterIntroduced);
      return `<small class="post-inspector-kicker">LETTER 00</small><h3>给下一位愿意试试的人</h3><p>${s.letter?'这一行有来历。以后换了条件，下一位知道该从哪里重新检查。':'先留一张空白纸。弄明白一件事，就能写下一行。不需要先写作文。'}</p><div class="post-letter-paper">${esc(s.letter?.text||'收件人：下一位愿意试试的人\n\n这里先留白，等一份真实记录。')}</div>${available.length?`<label class="post-letter-label">引用已有成果<select data-post-letter aria-label="00 回信引用来源">${available.map(id=>`<option value="${id}" ${s.letter?.artifactId===id?'selected':''}>${esc(D.tasks[id].title)}</option>`).join('')}</select></label><small class="post-letter-ref">来源：${esc(s.letter?.title||'')} · 保留所引成果版本</small>`:''}`;
    }
    function character(p,s) {
      const d=dialogue&&dialogue.id===selected&&dialoguePhase===s.phase?dialogue:World.dialogue(p,selected);
      const art=selected==='amo'?window.AtlasFirstVoyageArt.raven(13,17):window.AtlasFirstVoyageArt.companion(d.name,10,4);
      const leftForHome=selected==='alan'&&s.phase===5;
      return `<small class="post-inspector-kicker">${leftForHome?'交班时留下的话':d.first?'初次打招呼':'又见面了'}</small><div class="post-person-heading"><svg viewBox="0 0 62 64" aria-hidden="true" shape-rendering="crispEdges">${art}</svg><div><h3>${d.name}</h3><small>${d.role}</small></div></div><p class="post-daily-action">${leftForHome?'交班签留在木桩上。阿澜已经收工，下一班照常接应。':d.action}</p><p class="post-dialogue" role="status">“${esc(d.text)}”</p><button data-post-object="bag">一起看看这一趟 →</button>`;
    }
    function render() {
      if(destroyed)return;
      const p=getProgress(),s=World.snapshot(p);
      host.dataset.phase=s.phase;
      patch(host.querySelector('.post-room-art'),Art.room(station,s));
      host.querySelector('.post-current-era').textContent=s.routeTitle;
      host.querySelector('.post-place-life').textContent=s.places.find(x=>x.id===station).activity+'。'+place.subtitle+'。';
      patch(host.querySelector('.post-commission'),commission(s));
      const content=World.companions[selected]?character(p,s):({desk,receipts,folio,bag,letter})[selected](s);
      patch(host.querySelector('.post-inspector-content'),content);
      host.querySelectorAll('[data-post-object]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.postObject===selected));
      host.querySelectorAll('[data-post-object=alan]').forEach(b=>{
        const label=b.querySelector('span');
        if(label)label.textContent=s.phase===5?'交班签':'阿澜';else b.textContent=s.phase===5?'⌑ 交班签':'◌ 阿澜';
        b.setAttribute('aria-label',s.phase===5?'查看阿澜的交班签':'和阿澜聊聊');
      });
      const select=host.querySelector('[data-post-letter]');if(select&&s.letter)select.value=s.letter.artifactId;
    }
    function selectObject(id,reveal=false) {
      if(!objectNames[id]&&!World.companions[id])return;
      selected=id;
      if(World.companions[id]) {
        dialogue=World.dialogue(getProgress(),id);dialoguePhase=World.snapshot(getProgress()).phase;onMeet(id);
      }
      render();
      if(reveal&&matchMedia('(max-width:760px)').matches)
        host.querySelector('.post-inspector').scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
    }
    function click(event) {
      const b=event.target.closest('button');if(!b||!host.contains(b)||b.disabled||destroyed)return;
      if(b.dataset.postObject)return selectObject(b.dataset.postObject,true);
      if(b.dataset.postPlace)return onStation(b.dataset.postPlace);
      if(b.dataset.postAppendix)return onAppendix(b.dataset.postAppendix);
      if(b.dataset.postOpen)return onOpen(b.dataset.postOpen);
      if(b.dataset.postDecor){onDecorate(b.dataset.postDecor);render();return;}
      if(b.dataset.postReceipt){receiptId=b.dataset.postReceipt;render();return;}
      switch(b.dataset.postAction) {
        case 'close':onClose();break;
        case 'manifest':onManifest();break;
        case 'explore':onExplore(station);break;
        case 'replay':onReplay(b.dataset.postReplay);break;
        case 'deliver':{const c=World.snapshot(getProgress()).chapter;if(c&&onDeliver(c.id)!==true)render();break;}
      }
    }
    function change(event){if(event.target.matches('[data-post-letter]')){onLetter(event.target.value);render();}}
    host.addEventListener('click',click);host.addEventListener('change',change);
    if(World.companions[selected])selectObject(selected);else render();
    return {render,destroy(){destroyed=true;host.removeEventListener('click',click);host.removeEventListener('change',change);}};
  }
  window.AtlasPostalRoomView={create};
})();
