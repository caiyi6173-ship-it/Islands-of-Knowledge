/* P1 interaction wireframe. Demonstration state never reads the game's save. */
(() => {
  "use strict";
  const KEY = "worldline-p1-wireframe-v1";
  const $ = (q) => document.querySelector(q);
  const $$ = (q) => [...document.querySelectorAll(q)];
  const ids = ["P01", "C01", "M03"];
  const clone = (v) => JSON.parse(JSON.stringify(v));
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, Number(v) || 0));
  const cfg = {
    P01: { person:"阿基米德", english:"ARCHIMEDES", place:"潮汐港", title:"装不下最后一箱的船", artifact:"船型与载重吃水卡", icon:"P", accent:"#376b54",
      goals:["先让空载的船浮起来","把四箱货物也算进去"], detail:["同一份材料。先比较形状，再看水线。","载重变了，再检查进水前是否还有余量。"],
      phases:["空载记录","载货记录"], intro:"先不装箱。用同一份材料，看看形状变了会怎样。", change:"新条件：现在加上四箱货。刚才能浮，不代表这次仍能带得下。",
      hint:["把实心改成中空，再比较水线。可以继续调整开口宽度。","载重已经增加。把船体展开一些，再看它有没有沉过进水边界。"],
      boundary:"船体与水线为 P1 交互示意，不是正式适航模型；风浪、侧翻等未包含。", summary:"比较船体形状，并重新检查加货后的水线。" },
    C01: { person:"波义耳", english:"ROBERT BOYLE", place:"标本港 · 入口样品台", title:"被水泡坏的两张标签", artifact:"样品性质与身份签", icon:"C", accent:"#9a5c42",
      goals:["找到能分清这瓶样品的证据","换成金属，重新选择证据"], detail:["参考范围只有盐与糖。外观相同，哪种测量有区分力？","参考范围只有铁与铜。两种都能导电，试试别的性质。"],
      phases:["白色样品","金属留样"], intro:"先读性质，名字等一会儿再贴。我们只比较这张参考表里的样品。", change:"新条件：换成金属留样。共同的导电性，不足以分清铁与铜。",
      hint:["在同样条件下比较溶液电导，再让标签与读数对应。","选择磁性检查，再核对参考里的铁和铜。改标签不会改变测量。"],
      boundary:"仅给定纯样品、参考和虚拟仪器的示意；不构成真实未知物鉴定。不提供尝味操作。", summary:"先读取有区分力的性质，再把身份与参考对应。" },
    M03: { person:"笛卡尔", english:"RENÉ DESCARTES", place:"坐标测绘台", title:"写不清的地址", artifact:"有原点与单位的地址签", icon:"M", accent:"#575383",
      goals:["把地址标记放在 (4, 3)","让直线同时经过两个给定点"], detail:["原点在左下，每格 1 单位。先横向，再纵向。","给定 (1, 2)、(3, 6)。改变 m，检查 y = mx。"],
      phases:["位置记录","关系记录"], intro:"先约定从哪里数。你画在纸上的位置，下一位送信的人也要找得到。", change:"新问题：多个点之间有什么关系？用两个给定点一起检查 y = mx。",
      hint:["第一个数是横向 4，第二个数是向上 3。可以拖动图上的标记。","先用 (1, 2) 试 m，再检查 (3, 6)。不能只看一个点。"],
      boundary:"局部坐标和给定直线关系为示意，不是检查过暗礁的实航线；一般数学结论仍需相应推理。", summary:"写清原点、方向和单位，再用多个点核对给定关系。" }
  };
  function freshRun(id) {
    return { phase:0, params:id === "P01" ? { shape:"solid", width:4 } : id === "C01" ? { tool:"look", identity:"" } : { x:1, y:1, slope:1 },
      valid:[false,false], time:9, tools:4, trust:2, logs:[], discountUsed:[false,false], supplies:false, settled:false, stars:null, started:false, feedback:"先动手观察。只有正式记录才结算成本。", feedbackType:"" };
  }
  function fresh(mode = "fresh") {
    const s = { version:1, mode, completed:{}, runs:Object.fromEntries(ids.map(id => [id,freshRun(id)])), history:[], seen:[], delivered:false, reference:null, view:"map", active:"P01", reduceMotion:false };
    const seeded = mode === "legacy" ? ["P01","M03"] : ["ready","delivered"].includes(mode) ? ids : [];
    for (const id of seeded) { s.completed[id] = { source:mode === "legacy" ? "旧记录承接" : "评审预设", stars:null, summary:"已有有效完成记录，未补写参数与操作次数。" }; s.runs[id].settled = true; }
    s.reference = seeded[0] || null;
    s.delivered = mode === "delivered";
    return s;
  }
  function restore() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!raw || raw.version !== 1 || !raw.runs || !raw.completed) return fresh();
      const s = fresh(["fresh","legacy","ready","delivered"].includes(raw.mode) ? raw.mode : "fresh");
      s.completed = Object.fromEntries(ids.filter(id => raw.completed[id] && typeof raw.completed[id] === "object").map(id => [id,raw.completed[id]]));
      s.delivered = raw.delivered === true && ids.every(id => s.completed[id]);
      s.seen = Array.isArray(raw.seen) ? raw.seen.filter(id => ids.includes(id)) : [];
      s.history = Array.isArray(raw.history) ? raw.history.filter(h => ids.includes(h.id) && Array.isArray(h.logs)) : [];
      s.reference = ids.includes(raw.reference) && s.completed[raw.reference] ? raw.reference : Object.keys(s.completed)[0] || null;
      s.reduceMotion = raw.reduceMotion === true;
      for (const id of ids) {
        const r = raw.runs[id];
        if (!r || typeof r !== "object" || !Array.isArray(r.logs)) continue;
        s.runs[id] = { ...freshRun(id), ...r, phase:r.phase === 1 ? 1 : 0, time:clamp(r.time,0,20), tools:clamp(r.tools,0,12), trust:clamp(r.trust,0,5), valid:[r.valid?.[0] === true,r.valid?.[1] === true], logs:r.logs.filter(l => l && [0,1].includes(l.phase) && l.params), discountUsed:[r.discountUsed?.[0] === true,r.discountUsed?.[1] === true] };
        const p = s.runs[id].params;
        if (id === "P01") s.runs[id].params = { shape:p?.shape === "hollow" ? "hollow" : "solid", width:clamp(p?.width,3,9) };
        if (id === "C01") s.runs[id].params = { tool:["look","conductivity","magnet"].includes(p?.tool) ? p.tool : "look", identity:["salt","sugar","iron","copper"].includes(p?.identity) ? p.identity : "" };
        if (id === "M03") s.runs[id].params = { x:clamp(p?.x,0,8), y:clamp(p?.y,0,6), slope:clamp(p?.slope,1,4) };
      }
      s.view = raw.view === "level" && ids.includes(raw.active) ? "level" : "map";
      s.active = ids.includes(raw.active) ? raw.active : "P01";
      return s;
    } catch { return fresh(); }
  }
  let state = restore(), toastTimer, returnFocus;
  const drawer = $("#utility-drawer");
  const run = () => state.runs[state.active];
  const ready = () => ids.every(id => state.completed[id]);
  function persist() {
    try { localStorage.setItem(KEY,JSON.stringify(state)); }
    catch { toast("原型暂时无法保存；当前仍可继续体验。"); }
  }
  function toast(text) {
    clearTimeout(toastTimer); $("#toast").textContent = text; $("#toast").hidden = false;
    toastTimer = setTimeout(() => { $("#toast").hidden = true; }, 3800);
  }
  function portrait(id) {
    const colors = id === "P01" ? ["#e1d8bd","#b2baa8","#687e60"] : id === "C01" ? ["#ead5b5","#c4ac8f","#684d43"] : ["#e5ccb2","#635347","#68648c"];
    return '<svg viewBox="0 0 64 72" aria-hidden="true" shape-rendering="crispEdges"><path fill="'+colors[2]+'" d="M10 58h8V46h29v12h8v14H10z"/><path fill="'+colors[1]+'" d="M16 13h7V7h22v8h7v31h-8v10H23V45h-7z"/><path fill="'+colors[0]+'" d="M22 20h23v24H22z"/><path fill="#3d3b31" d="M25 26h4v4h-4zM38 26h4v4h-4z"/><path fill="#ae8365" d="M31 32h5v6h-5z"/><path fill="'+colors[1]+'" d="'+(id === "P01" ? 'M19 35h6v5h17v-5h7v14h-6v10H27V48h-8z' : id === "C01" ? 'M12 22h7v29h-8zM46 18h8v34h-8z' : 'M25 40h17v5H25zM21 9h28v13h-6v-7H22z')+'"/><path fill="#d7c59b" d="M27 58h11v14H27z"/></svg>';
  }
  function mapRender() {
    const count = Object.keys(state.completed).length;
    $("#chapter-count").textContent = count+" / 3";
    $("#chapter-label").textContent = state.delivered ? "R01 · 首航已交付" : "R01 · 第一船信";
    $("#bag-count").textContent = count;
    for (const id of ids) {
      $$('[data-level="'+id+'"]').forEach(b => { b.classList.toggle("complete",!!state.completed[id]); });
      $('[data-restore="'+id+'"]').classList.toggle("restored",!!state.completed[id]);
      const item = $('#map-tasks [data-level="'+id+'"] em');
      item.textContent = state.completed[id] ? "成果已收好" : ({P01:"承载记录",C01:"身份记录",M03:"坐标地址"})[id];
    }
    $("#map-deliver").hidden = !ready();
    $("#map-deliver").textContent = state.delivered ? "重看小禾的回条 ↗" : "交付第一船信 →";
    $(".chart").classList.toggle("delivered",state.delivered);
    $("#mail-boat").setAttribute("visibility",state.delivered ? "visible" : "hidden");
    $("#mission-title").textContent = state.delivered ? "第一船信，到了" : "第一船信";
    $("#mission-copy").innerHTML = state.delivered ? "最后一箱，也到了。<br>现在，等信的人开始回信。" : "把四箱器材送到对岸。<br>最后一箱，也不能落。";
    $(".stamp-mini").textContent = state.delivered ? "已寄" : "待寄";
    $("#mission-note").innerHTML = state.delivered ? '<span class="tiny-raven">◆</span><p>“她连箱盖缺角都画上了！”<small>下一问：晚上，也能有人接信吗？</small></p>' : !state.seen.length && !count ? '<span class="tiny-raven">✉</span><p>“先借这里。跑通邮路，就给你留个位置。”<small>老乔把桌角让给了你。见习信使的第一趟，就从这里开始。</small></p>' : '<span class="tiny-raven">◆</span><p>“先去看看船。箱子总不能自己游过去吧。”<small>阿墨，已经准备好了。</small></p>';
    $("#chart-status").textContent = state.delivered ? "首航已经送达。自由重访不会让货物重新丢失。" : ready() ? "三份成果齐备，可以直接交付，无需再做测验。" : "可以从任何一站开始，成果会放进同一只信袋。";
    $("#footer-text").textContent = state.delivered ? "00 回信已留下一行。小禾的问题，已经在回来的信里。" : count ? "00 回信可以引用一份真实成果，也可以先收好。" : "00 回信还空着。弄明白一件事，就能写下一行。";
    $("#review-state").value = state.mode;
    document.body.classList.toggle("reduce-motion",state.reduceMotion);
  }
  function showMap() {
    closeDrawer(false); state.view = "map"; document.body.dataset.view = "map";
    $("#map-view").hidden = false; $("#level-view").hidden = true;
    mapRender(); persist();
  }
  function boatArt() {
    return '<svg viewBox="0 0 780 350" aria-label="木码头旁同一份材料的船体与载重示意" role="img" shape-rendering="crispEdges"><path fill="#e5e7cc" d="M0 0h780v350H0z"/><path fill="#f0cd7c" d="M616 34h28v-7h22v7h14v25h-14v9h-36v-9h-14z"/><path fill="#f6f1da" d="M94 47h30V36h53v11h24v14H94zM416 67h28V55h46v12h31v12H416z"/><path fill="#9eae86" d="M0 121h53v-21h41v14h51v-23h40v17h70v24h81v-17h76v22h76v-15h88v23h64v-24h72v-18h37v18h31v229H0z"/><path fill="#6d967f" d="M0 175h780v175H0z"/><path fill="#5e887c" d="M0 225h780v125H0z"/><path stroke="#a7c3a4" stroke-width="3" d="M196 197h67m91 13h100m123-17h66M200 251h102m157 4h147m39 32h71M210 309h138m78-19h58"/><path fill="#b69b68" d="M0 194h173v156H0z"/><path fill="#d5bd87" d="M0 188h176v15H0z"/><path fill="#9c7952" d="M108 206h155v14H108zM129 218h12v102h-12zM218 218h12v102h-12z"/><path fill="#e2cd9e" d="M108 204h155v5H108z"/><path stroke="#6c5843" stroke-width="3" d="M118 208v11m22-11v11m24-11v11m23-11v11m25-11v11m23-11v11"/><path fill="#71815c" d="M31 140h13v-21h15v-15h14v36h12v52H31z"/><path fill="#d1b89a" d="M47 106h21v22H47z"/><path fill="#d7d0b5" d="M40 102h8v-8h21v9h7v27h-8v13H48v-14h-8z"/><path fill="#e6c8a2" d="M49 105h17v19H49z"/><path fill="#2c3b31" d="M52 111h3v3h-3zM61 111h3v3h-3z"/><path fill="#272e30" d="M164 154h10v-12h21v7h8v9h13v5h-15v20h-22v-8h-15z"/><path fill="#e2c26d" d="M185 181h17v5h-17z"/><path fill="#f5e9cd" d="M184 150h4v4h-4z"/><path fill="#e0c393" d="M70 228h41v36H70z"/><path fill="#97784f" d="M88 228h6v36h-6z"/><path stroke="#d2daba" stroke-dasharray="5 5" stroke-width="2" d="M278 218h263"/><text x="574" y="218" fill="#dce7ca" class="model-label">水线</text><g class="boat-group" id="boat-group" transform="translate(385 208)"><path id="boat-hull" fill="#677e7c" stroke="#455953" stroke-width="3" d="M-45-20h90v30h-90z"/><path id="boat-rim" fill="none" stroke="#d2ba83" stroke-width="5" d="M-45-20H45"/><g id="cargo-group" visibility="hidden"><path fill="#bb8d55" stroke="#795c3f" stroke-width="2" d="M-58-45h26v26h-26zM-28-45h26v26h-26zM2-45h26v26H2zM32-45h26v26H32z"/><path stroke="#ddc18a" stroke-width="4" d="M-45-44v24m30-24v24m30-24v24m30-24v24"/></g><rect id="width-handle" data-drag="width" x="43" y="-27" width="13" height="35" fill="#e3bf6b" stroke="#4a624e" stroke-width="2" style="cursor:ew-resize"/><text x="-45" y="58" class="model-label" id="boat-state" fill="#e7edce"></text></g><text x="284" y="121" fill="#586b4b" class="pixel-text">同一份材料 · 先比较，再记录</text></svg>';
  }
  function chemistryArt() {
    return '<svg viewBox="0 0 780 350" role="img" aria-label="样品台上的白色样品、金属留样和虚拟测量装置" shape-rendering="crispEdges"><path fill="#e7dec6" d="M0 0h780v350H0z"/><path fill="#c4bc9e" d="M0 196h780v154H0z"/><path fill="#f4edda" d="M32 26h160v154H32z"/><path fill="#a6c0b0" d="M44 36h136v130H44z"/><path stroke="#f4edda" stroke-width="8" d="M112 36v130M44 101h136"/><path fill="#789783" d="M44 122h20V97h20v25h20v44H44zM123 138h20v-21h20v21h17v28h-57z"/><path fill="#b2946c" d="M0 239h780v19H0z"/><path fill="#876a50" d="M0 258h780v92H0z"/><path stroke="#a98a61" stroke-width="2" d="M27 286h165m258 28h283"/><path fill="#f5eedb" stroke="#9ca28a" stroke-width="2" d="M383 31h341v160H383z"/><text x="405" y="57" class="model-label" fill="#66735d">本关给定参考 · 同条件比较</text><text x="406" y="91" class="pixel-text" fill="#626b57" id="reference-line-1">盐：白色，溶液电导明显</text><text x="406" y="120" class="pixel-text" fill="#626b57" id="reference-line-2">糖：白色，溶液电导很弱</text><text x="406" y="163" class="model-label" fill="#8b8b72">颜色相同，不足以判断身份</text><g id="white-sample"><path fill="#e5ebe0" stroke="#829e90" stroke-width="3" d="M262 98h39v29h20v112h-79V127h20z"/><path fill="#f1f0df" d="M250 179h63v52h-63z"/><path fill="#b48c66" d="M257 88h48v18h-48z"/><path fill="#e9d6b4" d="M253 142h57v28h-57z"/><text x="271" y="161" class="model-label" fill="#7e735a">A</text></g><g id="metal-sample" visibility="hidden"><path fill="#7f8b89" stroke="#536b67" stroke-width="3" d="M235 194l54-20 49 23-55 25z"/><path fill="#687976" d="M235 194v35l48 18v-25z"/><path fill="#98a39a" d="M283 222l55-25v33l-55 17z"/><text x="259" y="157" class="pixel-text" fill="#6a7863">金属留样 B</text></g><path fill="#5b7464" d="M463 220h124v20H463z"/><path fill="#829983" d="M476 173h100v56H476z"/><path fill="#e7edd9" d="M490 184h72v28h-72z"/><circle id="meter-lamp" cx="600" cy="199" r="8" fill="#8d9578"/><path id="probe-wire" stroke="#987856" stroke-width="4" fill="none" d="M477 211h-53v-65h-119" visibility="hidden"/><text x="506" y="202" class="model-number" fill="#48614c" id="meter-value">观察</text><text x="444" y="278" class="model-label" fill="#e6d5b4">虚拟仪器 · 只比较给定参考</text><path fill="#262e2c" d="M116 211h10v-11h22v6h8v10h12v5h-14v18h-22v-7h-16z"/><path fill="#e6c371" d="M138 236h17v4h-17z"/></svg>';
  }
  function mathArt() {
    let grid = "";
    for (let i=0;i<=8;i++) grid += '<path d="M'+(180+i*38)+' 62v228" stroke="#526b61" stroke-width="1"/><text x="'+(177+i*38)+'" y="309" class="model-label" fill="#a0b6a0">'+i+'</text>';
    for (let i=0;i<=6;i++) grid += '<path d="M180 '+(290-i*38)+'h304" stroke="#526b61" stroke-width="1"/><text x="157" y="'+(294-i*38)+'" class="model-label" fill="#a0b6a0">'+i+'</text>';
    return '<svg viewBox="0 0 780 350" role="img" aria-label="有原点、方向和单位的坐标网格，标记可以拖动" shape-rendering="crispEdges"><path fill="#c9c3a8" d="M0 0h780v350H0z"/><path fill="#937d5e" d="M57 17h666v312H57z"/><path fill="#2e4940" d="M69 29h642v286H69z"/>'+grid+'<path stroke="#d7dfbf" stroke-width="2" d="M180 55v235h318"/><path fill="#d7dfbf" d="M180 49l-4 9h8zM504 290l-10-4v8z"/><text x="513" y="295" class="pixel-text" fill="#d7dfbf">x</text><text x="175" y="46" class="pixel-text" fill="#d7dfbf">y</text><text x="537" y="83" class="pixel-text" fill="#e2d69e">每格 1 单位</text><text x="537" y="112" class="pixel-text" fill="#b9c7b0">先横向，再纵向</text><g id="point-target"><path d="M324 168h16v16h-16z" fill="none" stroke="#e3c478" stroke-width="2" stroke-dasharray="3 3"/><text x="347" y="173" class="model-label" fill="#ead5a1">目标窗口 (4, 3)</text></g><circle id="user-point" data-drag="point" cx="218" cy="252" r="9" fill="#d9a39c" stroke="#f1d8bf" stroke-width="2" style="cursor:grab"/><text id="point-coordinate" x="235" y="247" class="model-number" fill="#f2d1b9">(1, 1)</text><g id="relation-group" visibility="hidden"><path id="user-line" d="M180 290l228-228" stroke="#d9a39c" stroke-width="3"/><circle cx="218" cy="214" r="5" fill="#e2cd7e"/><circle cx="294" cy="62" r="5" fill="#e2cd7e"/><text x="232" y="215" class="model-label" fill="#e6dcac">(1, 2)</text><text x="305" y="66" class="model-label" fill="#e6dcac">(3, 6)</text><text x="537" y="182" class="model-number" fill="#e0c9b4" id="relation-label">y = 1x</text></g><path fill="#e9d7b0" d="M79 318h29v9H79z"/><path fill="#e9e0c5" d="M639 317h45v6h-45z"/></svg>';
  }
  function mountControls() {
    const r = run(), id = state.active;
    if (id === "P01") $("#controls").innerHTML = '<div class="control-group"><span class="control-title">材料形状</span><div class="choice-row"><button data-param="shape" data-value="solid">实心</button><button data-param="shape" data-value="hollow">中空</button></div></div><div class="control-group"><label for="boat-width">开口宽度 <output id="width-output"></output></label><input id="boat-width" type="range" min="3" max="9" step="1" value="'+r.params.width+'" data-input="width"><div class="range-caption"><span>窄</span><span>宽</span></div></div><p class="control-group note" id="control-reference">同一份材料，先比较形状。也可以拖动船口的金色把手。</p>';
    if (id === "C01") {
      const choices = r.phase === 0 ? [["salt","盐"],["sugar","糖"]] : [["iron","铁"],["copper","铜"]];
      $("#controls").innerHTML = '<div class="control-group"><span class="control-title">先选观察方式</span><div class="choice-row"><button data-param="tool" data-value="look">看外观</button><button data-param="tool" data-value="conductivity">测电导</button><button data-param="tool" data-value="magnet">测磁性</button></div></div><div class="control-group"><span class="control-title">根据证据贴标签</span><div class="choice-row">'+choices.map(([v,t]) => '<button data-param="identity" data-value="'+v+'">'+t+'</button>').join("")+'</div></div><p class="control-group note" id="control-reference"></p>';
    }
    if (id === "M03") $("#controls").innerHTML = r.phase === 0 ? '<div class="control-group"><label for="coordinate-x">横向 x <output id="x-output"></output></label><input id="coordinate-x" type="range" min="0" max="8" step="1" data-input="x" value="'+r.params.x+'"></div><div class="control-group"><label for="coordinate-y">纵向 y <output id="y-output"></output></label><input id="coordinate-y" type="range" min="0" max="6" step="1" data-input="y" value="'+r.params.y+'"></div><p class="control-group note">左下为原点，向右与向上为正。也可以直接拖动图上的标记。</p>' : '<div class="control-group"><label for="line-slope">直线的 m <output id="slope-output"></output></label><input id="line-slope" type="range" min="1" max="4" step="1" data-input="slope" value="'+r.params.slope+'"></div><p class="control-group note">点来自给定资料：<br>(1, 2) 与 (3, 6)。<br>同时检查两处。</p>';
  }
  function showIntro(speaker,text) { $("#intro-speaker").textContent = speaker; $("#intro-text").textContent = text; $("#intro-note").hidden = false; }
  function openLevel(id, focus = true) {
    if (!ids.includes(id)) return;
    closeDrawer(false);
    const seen = state.seen.includes(id);
    state.view = "level"; state.active = id;
    if (!seen) state.seen.push(id);
    const c = cfg[id];
    $("#map-view").hidden = true; $("#level-view").hidden = false; document.body.dataset.view = "level";
    document.documentElement.style.setProperty("--lab-accent",c.accent);
    document.documentElement.style.setProperty("--stage-base",id === "P01" ? "#e5e7cc" : id === "C01" ? "#e7dec6" : "#c9c3a8");
    $("#location-label").textContent = c.place+" / "+c.person;
    $("#scene-code").textContent = id+" / FIRST DELIVERY";
    $("#scene-title").textContent = c.title;
    $("#person-name").textContent = c.person; $("#person-english").textContent = c.english;
    $("#portrait").innerHTML = portrait(id);
    $("#model-caption").textContent = c.boundary;
    $("#scene-art").innerHTML = id === "P01" ? boatArt() : id === "C01" ? chemistryArt() : mathArt();
    mountControls(); bindStageDrag();
    showIntro(c.person,state.completed[id] ? "这份成果已经收好。可以自由观察，也可以带着已有记录继续这趟委托。" : seen ? "记录还在。先看这次的条件，再接着试。" : c.intro);
    paint(); mapRender(); persist();
    if (focus) { $("#back-map").focus({preventScroll:true}); window.scrollTo({top:0,behavior:"instant"}); }
  }
  function verdict(id,r) {
    const p = r.params;
    if (id === "P01") {
      const success = p.shape === "hollow" && p.width >= (r.phase === 0 ? 3 : 7);
      return { success, observation:p.shape === "solid" ? "实心材料在示意中下沉。" : success ? (r.phase === 0 ? "空载中空船体浮起，水线可比较。" : "四箱都在船上，仍有示意承载余量。") : "加货后水线越过进水边界，船体下沉。",
        reason:p.shape === "solid" ? "同一份材料改成中空，再比较进水前能排开的水。" : "载重已增加。把船口展开一些，再看水线。" };
    }
    if (id === "C01") {
      const measured = r.phase === 0 ? p.tool === "conductivity" : p.tool === "magnet";
      const correct = p.identity === (r.phase === 0 ? "salt" : "iron");
      const observation = p.tool === "look" ? "外观不足以区分给定参考。" : p.tool === "conductivity" ? (r.phase === 0 ? "同条件溶液电导明显，支持盐的参考。" : "铁和铜都能导电，这项不足以区分。") : (r.phase === 0 ? "当前磁性观察不能区分盐与糖。" : "虚拟磁性检查有响应，支持铁的参考。");
      return { success:measured && correct, observation, reason:!measured ? "先选能区分本组参考的测量，再判断身份。" : "读数已经支持一项参考。让身份标签与测量对应，改标签不会改变读数。" };
    }
    const success = r.phase === 0 ? p.x === 4 && p.y === 3 : p.slope === 2;
    return { success, observation:r.phase === 0 ? "当前坐标 ("+p.x+", "+p.y+")；目标 (4, 3)。" : "y = "+p.slope+"x："+(success ? "两个给定点都满足。" : "还不能同时经过两个给定点。"),
      reason:r.phase === 0 ? "第一个数先管横向，再看第二个数的纵向位置。" : "分别代入两个给定点，再看同一个 m 是否都成立。" };
  }
  function compareInfo(r) {
    const previous = [...r.logs].reverse().find(l => l.phase === r.phase);
    const differences = previous ? Object.keys(r.params).filter(k => previous.params[k] !== r.params[k]) : [];
    const fair = state.active === "P01" && !!previous && differences.length === 1 && ["shape","width"].includes(differences[0]);
    const discount = fair && !r.discountUsed[r.phase];
    return { fair,discount,time:discount ? 1 : 2,tools:discount ? 0 : 1,duplicate:!!previous && JSON.stringify(previous.params) === JSON.stringify(r.params) };
  }
  function hasAffordableAction(r) {
    return (r.time >= 2 && r.tools >= 1) || (state.active === "P01" && r.logs.some(l => l.phase === r.phase) && !r.discountUsed[r.phase] && r.time >= 1);
  }
  function paint() {
    const r = run(), id = state.active, c = cfg[id], p = r.params, v = verdict(id,r), cost = compareInfo(r);
    $("#phase-label").textContent = r.settled ? "成果已归档" : "条件 "+(r.phase+1)+" / 2";
    $("#goal-title").textContent = r.settled ? "这份成果已经在信袋里" : c.goals[r.phase];
    $("#goal-detail").textContent = r.settled ? "可继续免费观察。研究表现与当前预览分别保存，已有交付不会倒退。" : c.detail[r.phase];
    $("#time-value").textContent = r.time; $("#tools-value").textContent = r.tools; $("#trust-value").textContent = r.trust;
    $("#evidence-slots").innerHTML = c.phases.map((label,i) => {
      const legacy = r.settled && state.completed[id]?.source !== "本次示意研究";
      return '<div class="evidence-slot '+(r.valid[i] || legacy ? "valid" : "")+'"><span>'+(r.valid[i] || legacy ? "✓" : "□")+'</span>'+esc(label)+(legacy ? " · 原有成果" : r.valid[i] ? " · 已有支持" : " · 尚待记录")+'</div>';
    }).join("");
    $("#phenomenon").textContent = v.observation;
    $("#feedback").textContent = r.feedback;
    $("#feedback").className = "feedback "+(r.feedbackType || "");
    $("#conclusion-preview").hidden = r.settled || !r.valid.every(Boolean);
    $("#conclusion-preview").innerHTML = '<small>随信说明 / 收给小禾</small><p>'+esc(c.summary)+'</p><span>引用当前两种条件的有效记录，仅覆盖给定模型范围。归档后进入同一份货单。</span>';
    $("#cost-label").textContent = r.settled ? "已有成果与历史最佳保留" : cost.discount ? "合格比较 · 本次 1 时间 / 0 器材" : "本次正式记录 · 2 时间 / 1 器材";
    $("#record-btn").hidden = r.settled;
    $("#record-btn").disabled = r.time < cost.time || r.tools < cost.tools || cost.duplicate;
    $("#record-btn").textContent = cost.duplicate ? "这组已记录，先改变条件" : r.valid[r.phase] ? "再记录一组比较" : "记录这一组";
    $("#record-btn").classList.toggle("secondary",r.valid[r.phase]);
    $("#next-condition").hidden = r.settled || r.phase !== 0 || !r.valid[0];
    $("#archive-btn").hidden = !r.settled && !(r.valid.every(Boolean) && r.trust > 0);
    $("#archive-btn").textContent = r.settled ? (state.delivered ? "回地图，继续看看 →" : ready() ? "交付第一船信 →" : "去下一份缺少的记录 →") : "核对说明，收好成果 →";
    $("#resupply-btn").hidden = r.settled || r.supplies || hasAffordableAction(r);
    $("#resupply-btn").textContent = "补给 +4 时间 / +2 器材";
    $("#new-run-btn").hidden = !r.settled && (hasAffordableAction(r) && r.trust > 0);
    $("#new-run-btn").textContent = r.settled ? "保留已有成果，再研究一轮" : "保留既往记录，开始新一轮";
    if (r.settled) $("#feedback").textContent = state.completed[id]?.source === "本次示意研究" ? "成果已收好。"+(r.stars ? "本轮 "+r.stars+" 星；" : "")+(state.completed[id].stars ? "历史最佳 "+state.completed[id].stars+" 星。" : "")+"自由预览不改写正式记录。" : "原有完成记录已承接。没有原始参数的部分保持空白，无须重打一遍。";
    $$('#controls [data-param]').forEach(b => b.setAttribute("aria-pressed",String(p[b.dataset.param] === b.dataset.value)));
    if (id === "P01") {
      $("#width-output").textContent = p.width <= 4 ? "偏窄" : p.width >= 7 ? "较宽" : "适中";
      const half = (52+p.width*8)/2, hull = p.shape === "solid" ? "M-"+half+"-20h"+(half*2)+"v30h-"+(half*2)+"z" : "M-"+half+"-20h"+(half*2)+"l-16 38h-"+(half*2-32)+"z";
      $("#boat-hull").setAttribute("d",hull); $("#boat-hull").setAttribute("fill",p.shape === "solid" ? "#71827b" : "#b68b54");
      $("#boat-rim").setAttribute("d","M-"+half+"-20H"+half);
      $("#width-handle").setAttribute("x",half-6); $("#width-handle").setAttribute("visibility",p.shape === "hollow" ? "visible" : "hidden");
      $("#boat-group").setAttribute("transform","translate(385 "+(v.success ? 208 : 263)+")");
      $("#cargo-group").setAttribute("visibility",r.phase === 1 ? "visible" : "hidden");
      $("#boat-state").textContent = r.phase === 0 ? "空载" : "四箱货物";
      $("#control-reference").textContent = r.phase === 0 ? "同一份材料，先比较形状。也可以拖动船口的金色把手。" : "现在是四箱载重。空载记录仍留着，改变宽度后可并排比较。";
    }
    if (id === "C01") {
      $("#white-sample").setAttribute("visibility",r.phase === 0 ? "visible" : "hidden");
      $("#metal-sample").setAttribute("visibility",r.phase === 1 ? "visible" : "hidden");
      $("#reference-line-1").textContent = r.phase === 0 ? "盐：白色，溶液电导明显" : "铁：能导电，给定磁性检查有响应";
      $("#reference-line-2").textContent = r.phase === 0 ? "糖：白色，溶液电导很弱" : "铜：能导电，给定磁性检查无响应";
      $("#meter-value").textContent = p.tool === "look" ? "观察" : p.tool === "conductivity" ? "电导" : "磁性";
      const relevant = r.phase === 0 ? p.tool === "conductivity" : p.tool === "magnet";
      $("#meter-lamp").setAttribute("fill",relevant ? "#dcb85e" : "#8d9578");
      $("#probe-wire").setAttribute("visibility",p.tool === "look" ? "hidden" : "visible");
      $("#control-reference").textContent = r.phase === 0 ? "参考：盐的溶液电导明显，糖的溶液电导很弱。条件相同再比。" : "参考：铁与铜都能导电；给定磁性检查只有铁有响应。";
    }
    if (id === "M03") {
      const x = 180+p.x*38, y = 290-p.y*38;
      $("#user-point").setAttribute("cx",x); $("#user-point").setAttribute("cy",y);
      $("#point-coordinate").setAttribute("x",x+16); $("#point-coordinate").setAttribute("y",y-9);
      $("#point-coordinate").textContent = "("+p.x+", "+p.y+")";
      for (const k of ["x","y","slope"]) if ($("#"+k+"-output")) $("#"+k+"-output").textContent = p[k];
      $("#point-target").setAttribute("visibility",r.phase === 0 ? "visible" : "hidden");
      $("#user-point").setAttribute("visibility",r.phase === 0 ? "visible" : "hidden");
      $("#point-coordinate").setAttribute("visibility",r.phase === 0 ? "visible" : "hidden");
      $("#relation-group").setAttribute("visibility",r.phase === 1 ? "visible" : "hidden");
      const maxX = Math.min(8,6/p.slope);
      $("#user-line").setAttribute("d","M180 290L"+(180+maxX*38)+" "+(290-maxX*p.slope*38));
      $("#relation-label").textContent = "y = "+p.slope+"x";
    }
  }
  function parameterChanged() {
    $("#intro-note").hidden = true;
    const r = run(); r.feedback = "变化已经显示在舞台上。自由观察不扣资源。"; r.feedbackType = "";
    paint(); persist();
  }
  function bindStageDrag() {
    const svg = $("#scene-art svg"); let drag = null;
    svg.addEventListener("pointerdown",e => {
      const target = e.target.closest("[data-drag]"); if (!target || run().phase === 1 && target.dataset.drag === "point") return;
      drag = target.dataset.drag; svg.setPointerCapture(e.pointerId); e.preventDefault();
    });
    svg.addEventListener("pointermove",e => {
      if (!drag) return;
      const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      const pos = pt.matrixTransform(svg.getScreenCTM().inverse()), r = run();
      if (drag === "width") {
        r.params.width = clamp(Math.round((Math.abs(pos.x-385)*2-52)/8),3,9);
        $("#boat-width").value = r.params.width;
      } else {
        r.params.x = clamp(Math.round((pos.x-180)/38),0,8); r.params.y = clamp(Math.round((290-pos.y)/38),0,6);
        $("#coordinate-x").value = r.params.x; $("#coordinate-y").value = r.params.y;
      }
      parameterChanged();
    });
    const stop = () => { drag = null; };
    svg.addEventListener("pointerup",stop); svg.addEventListener("pointercancel",stop);
  }
  function record() {
    const r = run(), c = compareInfo(r);
    if (r.settled || c.duplicate || r.time < c.time || r.tools < c.tools) return;
    $("#intro-note").hidden = true;
    const v = verdict(state.active,r);
    const previousTrust = r.trust;
    r.started = true; r.time -= c.time; r.tools -= c.tools; r.trust = clamp(r.trust+(v.success ? 1 : -1),0,5);
    if (c.discount) r.discountUsed[r.phase] = true;
    const entry = { phase:r.phase, params:clone(r.params), success:v.success, observation:v.observation, cost:{time:c.time,tools:c.tools}, fair:c.fair, discount:c.discount };
    r.logs.push(entry); if (v.success) r.valid[r.phase] = true;
    r.feedbackType = v.success ? "success" : "failure";
    r.feedback = v.success ? "这组记录有支持。"+(r.phase === 0 ? "可以继续比较，也可以看看明示的新条件。" : "两种条件的证据都在了，可以核对说明后归档。") : "已扣 "+c.time+" 时间、"+c.tools+" 器材，"+(previousTrust > 0 ? "可靠度 -1。" : "可靠度仍为 0。")+v.reason;
    paint(); persist();
  }
  function nextCondition() {
    const r = run(); if (r.settled || r.phase !== 0 || !r.valid[0]) return;
    r.phase = 1;
    if (state.active === "C01") { r.params.tool = "look"; r.params.identity = ""; }
    r.feedback = "新条件已经明示。先观察，再决定什么时候正式记录。"; r.feedbackType = "";
    mountControls(); showIntro("新的条件",cfg[state.active].change); paint(); persist();
  }
  function archive() {
    const r = run(), id = state.active;
    if (r.settled) {
      if (state.delivered) return showMap();
      if (ready()) return deliver();
      return openLevel(ids.find(x => !state.completed[x]));
    }
    if (!r.valid.every(Boolean) || r.trust <= 0) return;
    const failures = r.logs.filter(l => !l.success).length;
    const stars = 2 + (r.logs.some(l => l.fair) && failures <= 1 && !r.supplies ? 1 : 0);
    const previous = state.completed[id]?.stars || 0;
    state.completed[id] = { source:"本次示意研究", stars:Math.max(stars,previous), summary:cfg[id].summary, records:clone(r.logs.filter(l => l.success)) };
    r.settled = true; r.stars = stars; state.reference ||= id;
    r.feedback = cfg[id].artifact+"已收好。"; r.feedbackType = "success";
    paint(); mapRender(); persist();
    toast(ready() ? "三份成果齐备。可以直接交付第一船信。" : cfg[id].artifact+"已进入信袋。整批货还在等待其他记录。");
  }
  function supply() {
    const r = run(); if (r.settled || r.supplies || hasAffordableAction(r)) return;
    r.time += 4; r.tools += 2; r.supplies = true;
    r.feedback = "补给已到。本轮不再满足三星的无补给条件；有效完成与主线照常。";
    r.feedbackType = ""; paint(); persist();
  }
  function newRun() {
    const id = state.active, current = run();
    if (current.logs.length) state.history.push({id,logs:clone(current.logs)});
    state.runs[id] = freshRun(id); state.runs[id].started = true;
    openLevel(id); showIntro("新一轮研究","已有成果和既往记录保留；这一轮的资源与评分重新开始。");
    persist();
  }
  function closeDrawer(restoreFocus = true) {
    if (!drawer.open) return;
    drawer.close();
    if (restoreFocus && returnFocus && returnFocus.isConnected) returnFocus.focus({preventScroll:true});
  }
  function recordMarkup(id,entries) {
    return entries.map((l,i) => '<div class="record-entry '+(l.success ? "" : "fail")+'"><strong>'+esc(id)+" · "+esc(cfg[id].phases[l.phase])+" · 第 "+(i+1)+" 次"+(l.success ? " / 有支持" : " / 待修正")+'</strong><p>'+esc(l.observation)+'<br>条件：'+esc(Object.entries(l.params).map(([k,v]) => k+"="+v).join("，"))+'<br>已结算 '+esc(l.cost.time)+" 时间 / "+esc(l.cost.tools)+" 器材"+(l.discount ? " · 合格比较" : "")+'</p></div>').join("");
  }
  function openPanel(kind) {
    returnFocus = document.activeElement;
    const names = {bag:"信使的行囊",journal:"每一次尝试，都有来处",office:"潮汐港邮局",letter:"第 00 封回信",receipt:"小禾的第一张回条"};
    $("#drawer-title").textContent = names[kind] || names.bag;
    let html = "";
    const done = ids.filter(id => state.completed[id]);
    if (kind === "bag" || kind === "office") {
      html += '<p class="drawer-lead">'+(kind === "office" ? "桌角还是你借用的那一处。货单上的三项齐备，就能把四箱交给阿澜。" : "三座岛的成果会放进同一只信袋。已经完成的部分，不必重做。")+'</p>';
      html += ids.map(id => '<div class="drawer-row"><span class="row-icon">'+cfg[id].icon+'</span><div><b>'+esc(cfg[id].artifact)+'</b><p>'+(state.completed[id] ? esc(state.completed[id].source)+(state.completed[id].stars ? " · 历史最佳 "+state.completed[id].stars+" 星" : "") : "尚待取得 · "+esc(cfg[id].person))+'</p></div><button data-drawer-level="'+id+'">'+(state.completed[id] ? "重访" : "去看看")+'</button></div>').join("");
      if (ready()) html += '<button class="primary" data-drawer-deliver>'+(state.delivered ? "重看小禾的回条" : "交付第一船信 →")+'</button>';
      else html += '<p class="field-notice">还缺 '+(3-done.length)+' 份记录。已取得的成果会保留，不会重复扣除或退回。</p>';
      html += '<div class="drawer-section"><h3>00 回信纸</h3><p class="drawer-lead">收件人：下一位愿意试试的人。</p><button class="secondary" data-drawer-panel="letter">看看已经能写下什么</button></div>';
      if (kind === "bag") html += '<div class="drawer-section"><label><input id="reduce-motion" type="checkbox" '+(state.reduceMotion ? "checked" : "")+'> 减少动态效果</label><p class="field-notice">本原型使用默认助手资源。完整偏好、逐关三星标准在后续设计与正式实现中接入。</p></div>';
    }
    if (kind === "journal") {
      const logs = ids.flatMap(id => state.runs[id].logs.map(entry => ({id,entry})));
      html = '<p class="drawer-lead">这里只有正式留下的记录。自由预览不会被写成失败，也不会凭空产生证据。</p>';
      if (!logs.length && !state.history.length) html += '<p class="empty-note">还没有正式记录。<br>可以先去一个现场，随便试试看。</p>';
      for (const id of ids) if (state.runs[id].logs.length) html += recordMarkup(id,state.runs[id].logs);
      for (const h of state.history) html += '<div class="drawer-section"><h3>'+esc(h.id)+' · 既往一轮</h3>'+recordMarkup(h.id,h.logs)+'</div>';
      for (const id of done) if (state.completed[id].source !== "本次示意研究") html += '<div class="record-entry"><strong>'+esc(id)+" · "+esc(state.completed[id].source)+'</strong><p>仅承接完成事实；未补写未保存的参数、数值或失败次数。</p></div>';
      html += '<p class="field-notice">本页的正式记录属于 P1 独立示意。正式模型与史实资料在游戏中各自标注。</p>';
    }
    if (kind === "letter") {
      html = '<p class="drawer-lead">给下一位愿意试试的人。先留下一件弄明白的事，后面的空白还可以接着写。</p>';
      if (!done.length) html += '<div class="letter-paper"><span class="letter-label">LETTER 00 / 尚待写下第一行</span><p>有一个问题，<br>我想先去看看。</p></div>';
      else {
        const id = state.reference && state.completed[state.reference] ? state.reference : done[0], record = state.completed[id];
        html += '<div class="letter-paper"><span class="letter-label">LETTER 00 / '+id+'</span><p>我遇到的问题：<br>'+esc(cfg[id].title)+'。</p><p>'+esc(record.source === "本次示意研究" ? record.summary : "已有相应完成记录。原始参数未保留，具体条件留待查阅。")+'</p><p>这些条件之外，<br>还有没有需要再试的地方？</p></div><div class="inline-pick">'+done.map(x => '<button data-reference="'+x+'" aria-pressed="'+String(x===id)+'">引用 '+x+" · "+esc(cfg[x].artifact)+'</button>').join("")+'</div>';
      }
      html += '<p class="field-notice">不必输入文字，也不必故意失败。这里的默认稿只引用已经取得的成果。</p>';
    }
    if (kind === "receipt") {
      html = '<p class="drawer-lead">老乔把它夹到你借用的桌角。纸上画的，是你认得的那个缺角箱子。</p><div class="letter-paper"><span class="letter-label">标本港观测窗口 / R01 已送达</span><svg viewBox="0 0 90 80" aria-label="缺角箱子的手绘图"><path d="M15 22h49l10 12v36H15z" fill="#dfcca3" stroke="#7b785c" stroke-width="2"/><path d="M15 22l21-12h32l-4 12m10 12l10-12-16-12M74 70l10-12V22" fill="none" stroke="#7b785c" stroke-width="2"/><path d="M38 23h8v47h-8z" fill="#a6936e"/><path d="M64 22v12h10" fill="#f7f0dc" stroke="#7b785c" stroke-width="2"/></svg><p>收到了。<br>最后那箱也在。</p><p>尺和纸已经用上，样品记录夹进柜里了。缺角没画错吧？</p><p>记录总要到收工才写完。晚上，也能有人接信吗？</p><p class="letter-sign">小禾</p></div><button class="primary" data-close-receipt>收好回条，回地图 →</button><p class="field-notice">R02 的夜班委托在后续阶段制作。本原型到首张回条为止，可以继续重访三个现场。</p>';
    }
    $("#drawer-content").innerHTML = html;
    if (!drawer.open) drawer.showModal();
    $("#drawer-content").scrollTop = 0; $("#close-drawer").focus();
  }
  function deliver() {
    if (!ready()) { toast("先把缺少的记录收好，已有成果会保留。"); return; }
    state.delivered = true; showMap(); persist(); openPanel("receipt");
  }
  $("#controls").addEventListener("click",e => {
    const button = e.target.closest("[data-param]"); if (!button) return;
    run().params[button.dataset.param] = button.dataset.value; parameterChanged();
  });
  $("#controls").addEventListener("input",e => {
    if (!e.target.dataset.input) return;
    run().params[e.target.dataset.input] = Number(e.target.value); parameterChanged();
  });
  document.addEventListener("click",e => {
    const level = e.target.closest("[data-level]"); if (level) openLevel(level.dataset.level);
    const panel = e.target.closest("[data-panel]"); if (panel) openPanel(panel.dataset.panel);
  });
  $("#drawer-content").addEventListener("click",e => {
    const level = e.target.closest("[data-drawer-level]"); if (level) return openLevel(level.dataset.drawerLevel);
    if (e.target.closest("[data-drawer-deliver]")) return deliver();
    const panel = e.target.closest("[data-drawer-panel]"); if (panel) return openPanel(panel.dataset.drawerPanel);
    const ref = e.target.closest("[data-reference]"); if (ref) { state.reference = ref.dataset.reference; persist(); return openPanel("letter"); }
    if (e.target.closest("[data-close-receipt]")) { closeDrawer(); toast("回条已留在手记。可以继续探索与重访。"); }
  });
  $("#drawer-content").addEventListener("change",e => {
    if (e.target.id === "reduce-motion") { state.reduceMotion = e.target.checked; mapRender(); persist(); }
  });
  $("#back-map").addEventListener("click",showMap);
  $("#brand-home").addEventListener("click",e => { e.preventDefault(); showMap(); });
  $("#record-btn").addEventListener("click",record);
  $("#next-condition").addEventListener("click",nextCondition);
  $("#archive-btn").addEventListener("click",archive);
  $("#resupply-btn").addEventListener("click",supply);
  $("#new-run-btn").addEventListener("click",newRun);
  $("#hint-btn").addEventListener("click",() => { run().feedback = "阿墨："+cfg[state.active].hint[run().phase]; run().feedbackType = ""; paint(); });
  $("#skip-intro").addEventListener("click",() => { $("#intro-note").hidden = true; });
  $("#open-records").addEventListener("click",() => openPanel("journal"));
  $("#map-deliver").addEventListener("click",deliver);
  $("#close-drawer").addEventListener("click",() => closeDrawer());
  drawer.addEventListener("cancel",() => { setTimeout(() => { if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true}); },0); });
  drawer.addEventListener("click",e => { if (e.target === drawer && (e.clientX < drawer.getBoundingClientRect().left || e.clientY < 0)) closeDrawer(); });
  document.addEventListener("keydown",e => { if (e.key === "Escape" && !drawer.open && state.view === "level") showMap(); });
  $("#review-state").addEventListener("change",e => { state = fresh(e.target.value); showMap(); toast("已切换独立评审情境，正式游戏存档不受影响。"); });
  $("#reset-demo").addEventListener("click",() => { state = fresh(); showMap(); toast("P1 原型已重置。正式游戏存档不受影响。"); });
  mapRender();
  if (state.view === "level") openLevel(state.active,false); else showMap();
})();
