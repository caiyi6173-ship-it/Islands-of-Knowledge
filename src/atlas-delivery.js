/* R04 front pages cite the actual sent artifact revisions, including on replay. */
(() => {
  const local=typeof module!=='undefined'&&module.exports;
  const D=local?require('./worldline-data.js'):window.AtlasWorldlineData;
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  function pages(progress){
    return ['P03','M05','C06'].map(id=>{
      const artifact=progress.mailArtifacts?.[id],ref=progress.mailDeliveries?.R04?.artifacts?.[id]||artifact?.currentRef,revision=artifact?.revisions.find(r=>r.ref===ref),records=revision?.records||[];
      const typed=[0,1].every(c=>records.some(r=>r.condition===c&&r.recordValid&&r.goalSupported&&r.modelVersion?.startsWith('atlas-')));
      const last=typed?records.findLast(r=>r.condition===1&&r.recordValid&&r.goalSupported):null;
      const wanted={P03:['理想落点','速度 / 圆轨道速度','轨迹分类'],M05:['两端 y(0) / y(12)','[3,9] 最低净空'],C06:['给定分子 / 候选','模型三维角 H1—中心—H2']};
      const readings=typed?records.filter(r=>r.recordValid&&r.goalSupported).flatMap(r=>r.readings.filter(([name])=>wanted[id].includes(name))):records.flatMap(r=>r.readings||[]);
      return {id,title:D.tasks[id].title,ref,typed,purpose:last?.fixed.purpose||'保留原规则下取得的完成页',conditions:last?.fixed.conditions||'原条件文字未保留，不补写为新模型验证',notTested:last?.fixed.notTested||['旧档未保留完整范围，后续使用需另查'],readings};
    });
  }
  function create(host,{getProgress,onDone,replay=false}){
    let step=0,timer=0,dead=false;
    const texts=[['把折角翻开','阿墨：这一行，我折过去了。小禾的便签就在旁边：我这一页，原稿就没写全。','老乔：那就各补自己的，旧页也留着。条件在操作时已经可见，现在把它们和用途一起夹到正面。'],['不必誊成同一种图','轨迹页保留模型假设，净空页保留整段船宽，构型页保留投影约定。三份记录各自回答问题，一起装成能带走的图册。','阿澜系好信袋。原页、补注和寄出版本一起留下，重做不会把已经寄出的那一版抹掉。'],['用途放在正面了','三站图册夹：用途放在正面了。新现场还没试过的部分，我们也留着。下一轮，每站带一份新记录，再一起看看。','老乔：字说清楚了。换一份记录，还对得上吗？下一趟已有约定：新材料、未用于拟合的观测信、待核对的称量边界。']];
    host.classList.add('fv-delivery','at-delivery');
    const presentation=window.AtlasResearchPresentation.delivery(host,()=>clearTimeout(timer));
    function render(){
      if(dead)return;clearTimeout(timer);const [title,a,b]=texts[step];
      host.innerHTML=`<div class="fv-delivery-header"><small>R04 / ${replay?'共同图册回看 · 不重复交付':'图纸背面的那一行'} / ${step+1} OF 3</small><button data-at-flight="skip">${step<2?'跳过演出，直接看图册':'收好图册'} →</button></div><h2 id="modal-title">${title}</h2><div class="fv-delivery-art">${window.AtlasAtlasArt.delivery(step)}</div><div class="fv-delivery-copy"><p>${a}</p><p>${b}</p></div>${step===2?`<section class="at-book-pages" aria-label="寄出图册的三页正面">${pages(getProgress()).map(page=>`<article class="at-book-page" data-at-page="${page.id}" data-at-page-ref="${esc(page.ref||'')}"><small>${page.id} / ${page.typed?'寄出版本的原记录':'原规则完成页'}</small><h3>${esc(page.title)}</h3><h4>用途</h4><p>${esc(page.purpose)}</p><h4>条件</h4><p>${esc(page.conditions)}</p><h4>${page.typed?'记录中的核对':'原规则读数照存'}</h4>${page.readings.length?`<ul>${page.readings.map(([name,value])=>`<li>${esc(name)}：${esc(value)}</li>`).join('')}</ul>`:'<p>原始读数未保留，这里不补写数值。</p>'}<h4>尚未检查</h4><p>${page.notTested.map(esc).join('；')}</p></article>`).join('')}</section><article class="fv-receipt"><small>已收 / 三站图册夹</small><h3>用途放在正面了</h3><p>下一轮，每站带一份新记录。未试过的部分已经留位，条件先约好，再一起查。</p></article>`:''}<div class="fv-delivery-nav"><span>${step===2?'下一份委托：下一次还成立吗':'寄出事实与版本已保存；关闭、跳过和回看不重复结算。'}</span><button class="fv-primary" data-at-flight="next">${step===2?'收好图册，看看新记录委托':'继续'} →</button></div>`;
      host.querySelector('[data-at-flight=skip]').focus({preventScroll:true});if(step<2&&!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setTimeout(()=>{step++;render();},6000);
    }
    function action(kind){clearTimeout(timer);if(kind==='skip'){if(step<2){step=2;render();}else onDone();}else if(step<2){step++;render();}else onDone();}
    function click(e){const actionName=e.target.closest('[data-at-flight]')?.dataset.atFlight;if(actionName&&!dead)action(actionName);}
    function key(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();action('skip');}}
    host.addEventListener('click',click);host.addEventListener('keydown',key);render();
    return {destroy(){presentation.destroy();dead=true;clearTimeout(timer);host.removeEventListener('click',click);host.removeEventListener('keydown',key);}};
  }
  const api={create,pages};if(local)module.exports=api;if(typeof window!=='undefined')window.AtlasAtlasDelivery=api;
})();
