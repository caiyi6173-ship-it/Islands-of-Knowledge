/* The final journey reads immutable sent revisions; it does not manufacture evidence. */
(() => {
  const local=typeof module!=='undefined'&&module.exports,D=local?require('./worldline-data.js'):window.AtlasWorldlineData,W=local?require('./worldline.js'):window.AtlasWorldline;
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  function pages(progress){return ['P10','M10','C08'].map(id=>{
    const a=progress.mailArtifacts?.[id],ref=progress.mailDeliveries?.R05?.artifacts?.[id]||a?.currentRef,r=a?.revisions.find(r=>r.ref===ref),records=r?.records||[],valid=records.filter(r=>r.recordValid&&r.goalSupported);
    const typed=[0,1].every(c=>valid.some(r=>r.condition===c&&r.modelVersion?.startsWith('return-')));
    return {id,ref,title:D.tasks[id].title,typed,readings:typed?valid.flatMap(r=>r.readings):records.flatMap(r=>r.readings||[])};
  });}
  function create(host,{getProgress,onDone,onSelectLetter,replay=false}){
    let step=0,timer=0,dead=false;
    const scenes=[['信袋先到窗口','小禾把三份新核对分开归档，第四箱的样品也收好。她把缺角空箱折上，里面留了下一轮想一起查的问题。','小禾：新记录收到了。你们寄来的原页，我都留着。'],['测绘台接着用','记录员把封存预测与后来观测并排夹好。图册没有变成一张“永远都对”的通行证，下一次核对有了来处。','阿墨数过三份签：光电阈值、独立预报、称量边界。每一页都有人接着用。'],['回到潮汐港','信袋走完潮汐港、标本港、测绘台，完整回到了起点。木桩上已经挂好下一班的交接纸签。','阿澜系好缆绳：明天还是这班。我先回去吃饭。老乔把临时纸条换成正式收信格。'],['把桌角留给下一位','老乔：这个位置留给你。要寄哪一页，你来决定。阿墨把最初那只纸夹放在 00 上：搭档，我还在。','门口来了新人，拿着一份多了一箱的清单。你把桌面挪出一角：先放这里，我们一起看看。']];
    host.classList.add('fv-delivery','rt-delivery');
    const presentation=window.AtlasResearchPresentation.delivery(host,()=>clearTimeout(timer));
    function render(){
      if(dead)return;clearTimeout(timer);const [title,a,b]=scenes[step],p=getProgress(),letter=W.letter(p),available=D.letterSources.filter(id=>p.mailArtifacts?.[id]?.complete);
      host.innerHTML=`<div class="fv-delivery-header"><small>R05 / ${replay?'整圈返航回看 · 不重复交付':'下一次还成立吗'} / ${step+1} OF 4</small><button data-rt-flight="skip">${step<3?'跳过演出，直接看 00':'收好回信，继续探索'} →</button></div><h2 id="modal-title">${title}</h2><div class="fv-delivery-art">${window.AtlasReturnArt.delivery(step)}</div><div class="fv-delivery-copy"><p>${a}</p><p>${b}</p></div>${step===2?`<section class="rt-proof-pages" aria-label="本次寄出的新核对">${pages(p).map(page=>`<article class="rt-proof-page" data-rt-page="${page.id}" data-rt-page-ref="${esc(page.ref||'')}"><small>${page.id} / ${page.typed?'寄出版本的原记录':'原规则完成页'}</small><h3>${esc(page.title)}</h3>${page.readings.length?`<ul>${page.readings.map(([key,value])=>`<li>${esc(key)}：${esc(value)}</li>`).join('')}</ul>`:'<p>原始参数与读数未保留，不补造本次模型验证。</p>'}</article>`).join('')}</section>`:''}${step===3?`<article class="rt-letter-paper" aria-label="第 00 封回信"><small>LETTER 00 / 给下一位愿意试试的人</small><h3>有一件事，我想先去看看。</h3><p data-rt-letter>${esc(letter?.text||'已经留下的完成页都保留在图夹里。条件换了，我们再一起核对。')}</p><small data-rt-letter-source data-rt-letter-ref="${esc(letter?.ref||'')}">来源：${esc(letter?.title||'归档成果')} · 保留引用时的成果页</small></article><p class="rt-ending-note">这一圈已经完成。你的桌位留下来，阿墨仍是搭档。三十个现场和未做的补充委托继续开放，不必先完成三星或写一篇作文。</p><details class="rt-letter-picker"><summary>可选：换一份已有成果写进 00</summary><div class="rt-letter-options">${available.map(id=>`<button data-rt-letter-choice="${id}" aria-pressed="${letter?.artifactId===id}">${id} · ${esc(D.tasks[id].title)}</button>`).join('')}</div></details>`:''}<div class="fv-delivery-nav"><span>${step===3?'下一次多一箱，还要从条件开始看。':'整圈交付已保存；关闭、刷新与重看不重复结算。'}</span><button class="fv-primary" data-rt-flight="next">${step===3?'收好 00，回到自己的桌位':'继续'} →</button></div>`;
      host.querySelector('[data-rt-flight=skip]').focus({preventScroll:true});if(step<3&&!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setTimeout(()=>{step++;render();},6500);
    }
    function action(kind){clearTimeout(timer);if(kind==='skip'&&step<3){step=3;render();}else if(kind==='skip'||step===3)onDone();else{step++;render();}}
    function click(e){const b=e.target.closest('button');if(!b||dead)return;if(b.dataset.rtFlight)action(b.dataset.rtFlight);if(b.dataset.rtLetterChoice){const id=b.dataset.rtLetterChoice;onSelectLetter?.(id);const p=getProgress(),letter=W.letter(p);host.querySelector('[data-rt-letter]').textContent=letter?.text||'';const source=host.querySelector('[data-rt-letter-source]');source.textContent=`来源：${letter?.title||''} · 保留引用时的成果页`;source.dataset.rtLetterRef=letter?.ref||'';host.querySelectorAll('[data-rt-letter-choice]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.rtLetterChoice===letter?.artifactId));}}
    function key(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();action('skip');}}
    host.addEventListener('click',click);host.addEventListener('keydown',key);render();
    return {destroy(){presentation.destroy();dead=true;clearTimeout(timer);host.removeEventListener('click',click);host.removeEventListener('keydown',key);}};
  }
  const api={pages,create};if(local)module.exports=api;if(typeof window!=='undefined')window.AtlasReturnDelivery=api;
})();
