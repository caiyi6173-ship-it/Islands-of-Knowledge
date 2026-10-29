/* The inhabited world reads research and deliveries; visits never advance either. */
(() => {
  const local = typeof module !== "undefined" && module.exports;
  const W = local ? require("./worldline.js") : window.AtlasWorldline;
  const D = local ? require("./worldline-data.js") : window.AtlasWorldlineData;
  const stations = Object.freeze({
    P: Object.freeze({ id:"P", name:"潮汐港邮局", island:"物理岛", subtitle:"借来的桌角，信袋出发的地方", level:"P01", x:1310, y:530, islandX:175, islandY:875 }),
    C: Object.freeze({ id:"C", name:"标本港观测窗口", island:"化学岛", subtitle:"小禾收信，也把问题寄回来", level:"C01", x:1310, y:850, islandX:520, islandY:810 }),
    M: Object.freeze({ id:"M", name:"测绘台", island:"数学岛", subtitle:"把地址与彼此的图放在一起", level:"M03", x:285, y:510, islandX:505, islandY:535 }),
  });
  const keepsakes = Object.freeze([
    {id:"paperclip", chapter:null, name:"阿墨的纸夹", note:"先借给你的那只。纸还空着，也能夹在一起。"},
    {id:"box-sketch", chapter:"R01", name:"缺角箱小画", note:"小禾在首张回条上画的：最后那箱也在。"},
    {id:"shift-tag", chapter:"R02", name:"交班纸签", note:"哪一站接、什么时候交班，都夹在前面。"},
    {id:"legend-leaf", chapter:"R03", name:"双方的图例页", note:"同一页上有不同笔迹，读者也成了作者。"},
    {id:"front-clip", chapter:"R04", name:"展开的条件夹", note:"阿墨把折角展开，重要的一行留在正面。"},
    {id:"return-box", chapter:"R05", name:"回寄箱纸签", note:"样品已归档，缺角空箱带着新问题回来了。"},
  ].map(Object.freeze));
  const companions = Object.freeze({
    joe:{name:"老乔", role:"潮汐港站长", introduction:"我是老乔。你先借这个桌角，信袋放这边。", daily:[
      "拿杯子压住当天登记，给晚来的信留一格。", "把缺角箱回条挂上绳，腾出新的桌角。", "核对交班纸签，给两份旧稿各留一张副页。", "并排保留原稿与改稿，没有只凭旧章换掉原页。", "把图册用途放在正面，未查的部分留着。", "换好你的正式收信格，又在旁边腾出一角。"], lines:[
      "四箱寄给小禾。三份记录齐了，再交给阿澜。", "她收到了。白天这一趟跑通了，晚上的约定还得补上。", "有人接信，也得有人接班。那两份旧稿，咱们并排看看。", "带着依据和没查完的地方，也可以先寄出去。", "这次，下一站拿到就能先看见用途和条件。", "这个位置留给你。要寄哪一页，你来决定。" ]},
    amo:{name:"阿墨", role:"你的渡鸦搭档", introduction:"我叫阿墨。纸夹归你用，信袋我帮你看着。", daily:[
      "叼来一只纸夹，试着把空白回信折齐。", "盯着回条上的缺角小画，夹了又夹。", "把阿澜的交班签夹牢，又把两张旧图并排挂起。", "对照两种笔迹，把容易读错的缩写圈出来。", "展开折角，把条件夹在正面。", "给下一步留一张空白纸，仍站在你这一边。"], lines:[
      "箱子总不能自己游过去。去水槽看看？", "她连缺角都画上了。真是我们的箱子。", "这回写清谁来接。阿澜也能准点收工了。", "我看懂的缩写，别人也可能看不懂。多留一行。", "这一行展开，下一站就不用猜了。", "新人多带了一箱。你的桌子，要借他一角吗？" ]},
    alan:{name:"阿澜", role:"潮汐港船工", introduction:"我是阿澜，跑这条航路。先看看这趟和上趟哪里不同。", daily:[
      "在码头晒绳，修好那张吱呀响的凳子。", "四箱已经送到，回来收好缆绳，检查下一趟清单。", "把交班纸签系在木桩上，到点交给下一位。", "留出核对旧稿的时间，也提醒对岸还在等信。", "翻图册时先看用途，再核对这趟的载重。", "系好缆绳，把下一班交清楚，准备回家吃饭。"], lines:[
      "先别急着装最后一箱。加上去，重量就不同了。", "那四箱早送到了。这回先约好晚上谁接。", "两种航向的目标分开写，我照交班纸签跑。", "能说明白的先寄，必要的核对也留时间。", "图上这一行条件，带着去下一站。", "明天还是这班。我先回去吃饭。" ]},
    xiaohe:{name:"小禾", role:"标本港观测员", introduction:"我是小禾，在内港窗口收信。入口留样台和这里，是两个地方。", daily:[
      "晾受潮的信封，收信格还给四箱留着位置。", "把收到的尺和纸放进记录区，缺角箱画留在窗边。", "与轮班同伴分好夜间收寄格，窗边有灯也有人。", "在自己的图上补一行，和读者的改稿夹在一起。", "把使用说明写到图册前面，给新记录留出位置。", "把样品归档，用第四箱的空箱回寄新的问题。"], lines:[
      "我这里还在等四箱。留样请去入口台，收货地址留给下一位看。", "最后那箱也在。记录总要到收工才写完，晚上也能有人接吗？", "今晚轮到我们接。回程看交班纸签。", "我这边的图，也少写了一行。改稿一起寄回。", "说明我也补了。还没试过的地方，咱们留着。", "新记录收到了。下一轮有一处，想和你们一起查。" ]},
  });
  Object.values(companions).forEach(c => {Object.freeze(c.daily);Object.freeze(c.lines);Object.freeze(c);});

  function activity(station,phase,progress) {
    if(station==='P') {
      if(phase===5)return '按班交接 · 邮船照常往返';
      if(phase>=2)return '交班纸签在木桩上';
      return phase?'四箱已送达 · 准备夜班':'晒绳修凳 · 等这批货齐备';
    }
    if(station==='C') {
      if(phase>=2)return '夜窗有人接班';
      return phase?'尺和纸已经用上':'晾着信封 · 等四箱到达';
    }
    if(phase>=4)return '条件已夹在图册正面';
    if(phase>=3)return '双方改稿并排挂着';
    return progress.mailArtifacts.M03?'地址页已留在图夹':'图和日常字条一起晾着';
  }
  function snapshot(raw) {
    const p = W.normalize(raw), delivered = D.chapters.filter(c => p.mailDeliveries[c.id]);
    const phase = delivered.length, chapter = W.current(p), status = chapter && W.status(p,chapter.id);
    const owned = keepsakes.filter(k => !k.chapter || p.mailDeliveries[k.chapter]);
    const decoration = owned.find(k => k.id === p.postalDesk.item) || owned.at(-1);
    const tasks = chapter ? chapter.main.map(id => ({...D.tasks[id], complete:!!p.mailArtifacts[id]?.complete, station:id[0]})) : [];
    const routeTitle = ["三站相连的草图", "白天首航已通", "局部夜间接应", "图例在三站往来", "图册条件已补齐", "整圈夜邮已返回"][phase];
    return {
      phase, chapter, tasks, ready:!!status?.ready, missing:status?.missing || [],
      routeTitle, fullCircuit:phase===5, nightWatch:phase>=2,
      routes:[{id:"PC",from:"P",to:"C",state:phase===5?"circuit":phase>=2?"night":phase===1?"day":"planned"},
        {id:"CM",from:"C",to:"M",state:phase===5?"circuit":phase>=3?"exchange":"planned"},
        {id:"MP",from:"M",to:"P",state:phase===5?"circuit":phase>=3?"exchange":"planned"}],
      receipts:delivered, owned, decoration, formalDesk:phase===5,
      letter:W.letter(p), artifacts:p.mailArtifacts,
      places:Object.values(stations).map(s => ({...s, localComplete:!!p.mailArtifacts[s.level],
        visited:p.postalVisits[s.id]===true, night:phase>=2&&(s.id!=="M"||phase===5),
        activity:activity(s.id,phase,p)})),
    };
  }
  function visit(progress, station) {
    if (!stations[station]) return {progress,changed:false};
    const next=W.normalize(progress);
    if(next.postalVisits[station]===true)return {progress,changed:false};
    next.postalVisits[station]=true;
    next.enteredIslands=[...new Set([...(Array.isArray(progress.enteredIslands)?progress.enteredIslands:[]),station])];
    return {progress:next,changed:true};
  }
  function meet(progress, id) {
    if(!companions[id])return {progress,changed:false};
    const next=W.normalize(progress),key=`companion-${id}`;
    if(next.postalVisits[key]===true)return {progress,changed:false};
    next.postalVisits[key]=true;return {progress:next,changed:true};
  }
  function dialogue(progress,id) {
    const person=companions[id];if(!person)return null;
    const s=snapshot(progress),first=progress.postalVisits?.[`companion-${id}`]!==true;
    const returning={joe:'老乔移开登记簿，给你看留下的回条。',amo:'阿墨落回信袋旁，叼着熟悉的纸夹。',alan:'阿澜指着这趟的清单。',xiaohe:'小禾指给你看窗边留着的回条。'};
    const introduction=id==='alan'&&s.phase===5?'交班纸签上留着一句：':first?(s.phase?returning[id]:person.introduction):'';
    return {id,name:person.name,role:person.role,first,action:person.daily[s.phase],
      text:(introduction?introduction+" ":"")+person.lines[s.phase]};
  }
  function decorate(progress,id) {
    if(!snapshot(progress).owned.some(k=>k.id===id)||progress.postalDesk?.item===id)return {progress,changed:false};
    const next=W.normalize(progress);next.postalDesk.item=id;return {progress:next,changed:true};
  }
  const api={stations,keepsakes,companions,snapshot,visit,meet,dialogue,decorate};
  if(local)module.exports=api;
  if(typeof window!=="undefined")window.AtlasPostalWorld=api;
})();
