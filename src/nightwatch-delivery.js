/* The save already contains R02 before this skippable, read-only handoff plays. */
(() => {
  function create(host,{onDone,replay=false}){
    let step=0,timer=0,dead=false;
    const scenes=[['先把操作交到人手上','工坊同伴收下同步输入卡，窗口值班员检查双通路信号卡。小禾把姓名写进交班纸签，真实设施由值班人员接管。','小禾：今夜我和值班同伴在窗口。信号卡用于查线，照明还是港里的设备。'],['回程也约好了','阿澜接过两张航向卡：去正对岸，或优先尽快过河，按当班目标选择。小禾递来交班纸签，阿墨夹在邮袋外。','阿澜：这一班交给你。下一班，不用猜谁在。'],['夜里，终于也收到了','小禾和值班同伴：今晚轮到我们接。交班纸签夹在窗口，回程看这里。今天的记录，终于不用等到明早才寄。','回程包裹里夹着两张旧图，同一枚站章，方向和注记却不一样。阿墨：章一样。这一笔，怎么不一样？老乔：把原件都带来。']];
    host.classList.add('fv-delivery','nw-delivery');
    const presentation=window.AtlasResearchPresentation.delivery(host,()=>clearTimeout(timer));
    function render(){
      if(dead)return;clearTimeout(timer);const [title,a,b]=scenes[step];
      host.innerHTML=`<div class="fv-delivery-header"><small>R02 / ${replay?'夜班回看 · 不重复交付':'夜班还开着'} / ${step+1} OF 3</small><button data-night-flight="skip">${step<2?'跳过演出，直接看回条':'收好回条'} →</button></div><h2 id="modal-title">${title}</h2><div class="fv-delivery-art">${window.AtlasNightwatchArt.delivery(step)}</div><div class="fv-delivery-copy"><p>${a}</p><p>${b}</p></div>${step===2?'<article class="fv-receipt"><small>已收 / 小禾和值班同伴</small><h3>今晚轮到我们接</h3><p>交班纸签已夹在窗口。潮汐港与标本港开始局部夜班往返，三岛整圈夜邮还没有接通。</p></article>':''}<div class="fv-delivery-nav"><span>${step===2?'下一份委托：一座站，两张旧图':'交班事实已保存；跳过、关闭或回看都不重复结算。'}</span><button class="fv-primary" data-night-flight="next">${step===2?'收好纸签，查看旧图委托':'继续'} →</button></div>`;
      host.querySelector('[data-night-flight=skip]').focus({preventScroll:true});
      if(step<2&&!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setTimeout(()=>{step++;render();},5500);
    }
    function action(kind){clearTimeout(timer);if(kind==='skip'){if(step<2){step=2;render();}else onDone();}else if(step<2){step++;render();}else onDone();}
    function click(e){const kind=e.target.closest('[data-night-flight]')?.dataset.nightFlight;if(kind&&!dead)action(kind);}
    function key(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();action('skip');}}
    host.addEventListener('click',click);host.addEventListener('keydown',key);render();
    return {destroy(){presentation.destroy();dead=true;clearTimeout(timer);host.removeEventListener('click',click);host.removeEventListener('keydown',key);}};
  }
  window.AtlasNightwatchDelivery={create};
})();
