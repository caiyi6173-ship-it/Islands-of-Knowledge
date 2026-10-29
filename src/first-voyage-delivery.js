/* Delivery is committed before playback; skipping and replay never send again. */
(() => {
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  function create(host,{getProgress,onDone,onSelectLetter,replay=false}){
    let step=0,timer=0,destroyed=false;
    const texts=[
      ['老乔的桌角','老乔：船带得下，样品签补好了，窗口也写清楚。可以交给阿澜。','阿墨：这回，最后那箱有地方去了。'],
      ['第一船信，寄出了','阿澜系紧箱绳。四箱一起驶向标本港；这趟白天首航，还不是整圈夜邮。','旧章盖的是“已寄”。参数、来历与条件仍夹在货单里。'],
      ['对岸回信了','阿墨：她连缺角都画上了。真是我们的箱子。','老乔：她问的是每天的来回。夜班还得有人接，阿澜也得回得来。'],
    ];
    host.classList.add('fv-delivery');
    const presentation=window.AtlasResearchPresentation.delivery(host,()=>clearTimeout(timer));
    function render(){
      if(destroyed)return;clearTimeout(timer);
      const p=getProgress(),letter=window.AtlasWorldline.letter(p),text=texts[step];
      host.innerHTML=`<div class="fv-delivery-header"><small>R01 / ${replay?'首航回看 · 不重复交付':'第一船信'} / ${step+1} OF 3</small><button data-flight="skip">${step<2?'跳过演出，直接看回条':'收好回条'} →</button></div><h2 id="modal-title">${text[0]}</h2><div class="fv-delivery-art">${window.AtlasFirstVoyageArt.shipping(step)}</div><div class="fv-delivery-copy"><p>${text[1]}</p><p>${text[2]}</p></div>${step===2?`<article class="fv-receipt"><small>已收 / 小禾，标本港观测窗口</small><p><strong>收到了。最后那箱也在。</strong></p><p>尺和纸已经用上，样品记录夹进柜里了。我照着箱盖画的，缺角没画错吧？</p><p>记录总要到收工才写完。晚上，也能有人接信吗？</p></article><section class="fv-letter00"><label for="fv-letter-source">00 / 给下一位愿意试试的人 · 引用已有成果</label><select id="fv-letter-source">${window.AtlasWorldlineData.letterSources.filter(id=>p.mailArtifacts[id]?.complete).map(id=>`<option value="${id}" ${letter?.artifactId===id?'selected':''}>${esc(window.AtlasWorldlineData.tasks[id].title)}</option>`).join('')}</select><p class="fv-letter-text">${esc(letter?.text||'先留一张空白页，下一次接着写。')}</p><p>阿澜：能约好交班就试试。我也想准点吃上饭。</p></section>`:''}<div class="fv-delivery-nav"><span>${step===2?'下一份委托：夜班还开着':'已交付事实已保存，随时可以跳过或回看。'}</span><button class="fv-primary" data-flight="next">${step===2?'收好回条，回到邮路':'继续'} →</button></div>`;
      host.querySelector('[data-flight=skip]').focus({preventScroll:true});
      if(step<2&&!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setTimeout(()=>{step++;render();},step===0?2400:3300);
    }
    function click(event){const action=event.target.closest('[data-flight]')?.dataset.flight;if(!action||destroyed)return;clearTimeout(timer);if(action==='skip'){if(step<2){step=2;render();}else onDone();}else if(step<2){step++;render();}else onDone();}
    function change(event){if(event.target.id!=='fv-letter-source'||destroyed)return;onSelectLetter(event.target.value);const chosen=window.AtlasWorldline.letter(getProgress());host.querySelector('.fv-letter-text').textContent=chosen?.text||'';}
    function key(event){if(event.key==='Escape'){event.preventDefault();event.stopPropagation();clearTimeout(timer);if(step<2){step=2;render();host.querySelector('[data-flight=next]')?.focus();}else onDone();}}
    host.addEventListener('click',click);host.addEventListener('change',change);host.addEventListener('keydown',key);render();
    return {destroy(){presentation.destroy();destroyed=true;clearTimeout(timer);host.removeEventListener('click',click);host.removeEventListener('change',change);host.removeEventListener('keydown',key);}};
  }
  window.AtlasFirstVoyageDelivery={create};
})();
