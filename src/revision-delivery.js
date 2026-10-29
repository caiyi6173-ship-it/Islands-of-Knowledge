/* R03 delivery is saved before this read-only, skippable correspondence plays. */
(() => {
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  function create(host,{getProgress,onDone,onSelectLetter,replay=false}){
    let step=0,timer=0,dead=false;
    const scenes=[['原页留下，分册带走','老乔：哪些核过，哪些还要问，把两栏都带上。阿澜把待发信袋系紧，原来的三份成果和早先正确的记录都继续保留。','阿墨把“删掉”的提议收回，展开两张给定旧页。三种图例各装一册，没有把报码点、几何变换和电子点混成一种符号。'],['这一次，带着约定寄出','发送条件与报码、中心与变换次序、共享对与计数范围，都随有效记录一同寄出。站章仍只表示“已寄”。','阿澜：赶得上这一班。老乔：改动和来历都在页边，下一位不用猜。'],['对岸也改了自己的页','小禾：这次看懂了。我这边的图，也少写了一行。改稿一起寄回，你们读读看。','她没有抽走自己的旧稿，而是把补注夹在旁边：来回用的几页，能不能编在同一本里？下一份委托：图纸背面的那一行。']];
    host.classList.add('fv-delivery','cr-delivery');
    const presentation=window.AtlasResearchPresentation.delivery(host,()=>clearTimeout(timer));
    function render(){
      if(dead)return;clearTimeout(timer);const p=getProgress(),letter=window.AtlasWorldline.letter(p),[title,a,b]=scenes[step];
      const sources=window.AtlasWorldlineData.letterSources.filter(id=>p.mailArtifacts[id]?.complete);
      host.innerHTML=`<div class="fv-delivery-header"><small>R03 / ${replay?'共同修订回看 · 不重复交付':'对岸看懂了吗'} / ${step+1} OF 3</small><button data-revision-flight="skip">${step<2?'跳过演出，直接看回条':'收好补注'} →</button></div><h2 id="modal-title">${title}</h2><div class="fv-delivery-art">${window.AtlasRevisionArt.delivery(step)}</div><div class="fv-delivery-copy"><p>${a}</p><p>${b}</p></div>${step===2?`<article class="fv-receipt"><small>已收 / 小禾 · 附自己的修订页</small><h3>这次看懂了</h3><p>我这边也补了接收条件、先移再转的次序和全分子的计数范围。旧页一起留着，下一版我们一起编。</p></article><section class="cr-letter-source"><label for="revision-letter-source">00 / 给下一位愿意试试的人 · 可选引用一份已有成果</label><select id="revision-letter-source">${sources.map(id=>`<option value="${id}" ${letter?.artifactId===id?'selected':''}>${esc(window.AtlasWorldlineData.tasks[id].title)}</option>`).join('')}</select><p class="cr-letter-text">${esc(letter?.text||'先保留原来的空白页，已有成果与回条不会因此丢失。')}</p><p>不改引用也可以继续；回信不是额外考核。</p></section>`:''}<div class="fv-delivery-nav"><span>${step===2?'下一份：把图册的用途与条件放到正面':'有效版本与交付已保存，随时可跳过或回看。'}</span><button class="fv-primary" data-revision-flight="next">${step===2?'收好补注，准备共同图册':'继续'} →</button></div>`;
      host.querySelector('[data-revision-flight=skip]').focus({preventScroll:true});
      if(step<2&&!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setTimeout(()=>{step++;render();},6000);
    }
    function action(kind){clearTimeout(timer);if(kind==='skip'){if(step<2){step=2;render();}else onDone();}else if(step<2){step++;render();}else onDone();}
    function click(e){const kind=e.target.closest('[data-revision-flight]')?.dataset.revisionFlight;if(kind&&!dead)action(kind);}
    function key(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();action('skip');}}
    function change(e){if(e.target.id!=='revision-letter-source'||dead)return;onSelectLetter(e.target.value);host.querySelector('.cr-letter-text').textContent=window.AtlasWorldline.letter(getProgress())?.text||'';}
    host.addEventListener('click',click);host.addEventListener('keydown',key);host.addEventListener('change',change);render();
    return {destroy(){presentation.destroy();dead=true;clearTimeout(timer);host.removeEventListener('click',click);host.removeEventListener('keydown',key);host.removeEventListener('change',change);}};
  }
  window.AtlasRevisionDelivery={create};
})();
