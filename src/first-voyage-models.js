/* R01 calculations: previews and formal records read exactly the same model. */
(() => {
  const local = typeof module !== "undefined" && module.exports;
  const Research = local ? require("./research-session.js") : window.AtlasResearchSession;
  const Physics = local ? require("./physics-models.js") : window.AtlasPhysicsModels;
  const definitions = {
    P01: {
      title: "装不下最后一箱的船", person: "阿基米德", place: "潮汐港 · 备航水槽", subject: "物理",
      conditions: ["同一块材料 · 空载 1.2 kg", "新载重 · 四箱合计 6.0 kg"],
      goals: ["让这块材料在水中浮起来，留下空载记录。", "把四箱的重量都算进去，再检查船口与水线。"],
      change: "阿澜：刚才没装这四箱。总质量现在是 6.0 kg，先沿用船型，再查一次。",
      quality: "同材料、同水、同空载，比较碗形和宽船。两种都可以浮，不必故意失败。",
      intro: ["阿基米德：先不装箱。还是这块材料，看看形状变了会怎样。", "阿墨：重量没少。船口和水线，放在一起看。"],
      revisit: "阿基米德：吃水卡还在。继续原来的核对，或换一种船型比较。",
      delivered: "阿澜：那四箱已经送到了。卡还夹在这里，重做不会让货物退回岸上。",
      boundary: "水密度固定 1 kg/L；容量和水线为教学示意，未检验风浪、侧翻和真实适航。",
      summary: "空载与四箱的记录一起夹进吃水卡。阿澜备船，等样品签和地址齐备。",
    },
    C01: {
      title: "被水泡坏的两张标签", person: "波义耳", place: "标本港入口 · 留样台", subject: "化学",
      conditions: ["留样 A · 白色样品，候选盐 / 糖", "新留样 B · 金属，候选铁 / 铜"],
      goals: ["找有区分力的测量，对照参考，再贴身份签。", "换了留样与候选。仅仅能导电，足够分开它们吗？"],
      change: "波义耳：现在是另一份留样 B。参考换成铁与铜，上一张签不能直接搬过来。",
      quality: "同一 A 留样，分别用密度和规定溶液电导交叉取证。换名字不算新测量。",
      intro: ["波义耳：外面两张签泡坏了。先看哪一项性质能分开。", "阿墨：带来的是留样和清单副本。四箱货还在潮汐港，小禾的窗口在内港。"],
      revisit: "波义耳：留样和参考都在。看清你上次用了哪一种测量。",
      delivered: "波义耳：小禾已经收到样品签。可以补一份测量，不必再送一遍四箱货。",
      boundary: "限定候选的虚拟留样。各测量采用参考表同条件，电导为规定溶液与装置的相对读数。",
      summary: "两张身份签保留测量与参考，夹回第四箱清单。入口样品台不等于最终收货窗口。",
    },
    M03: {
      title: "写不清的地址", person: "笛卡尔", place: "测绘台 · 内港窗口图", subject: "数学",
      conditions: ["窗口地址 · 先约定从哪里数", "新问题 · 两个航标与 y = mx"],
      goals: ["把投递标记送到小禾窗口，地址保留原点、方向、单位与次序。", "题卡限定过原点的直线 y = mx。让关系线同时穿过两个航标。"],
      change: "笛卡尔：单点帮我们找地方。现在换回题卡原点 (0,0)，核对 (1,2)、(3,6) 与 y=mx。",
      quality: "换原点到 (1,1)，重新写地址，核对仍是同一个窗口。不是只改一个数字。",
      intro: ["笛卡尔：从哪里数、一格多长，先放在图上。", "阿墨：“右上一点”不够。下一位拿到地址，也得找得到小禾。"],
      revisit: "笛卡尔：图上的窗口没有移动。先看看地址用了哪一个原点。",
      delivered: "笛卡尔：货已经按地址送到了。可以换个原点重写，窗口还是同一个。",
      boundary: "一格为模型长度单位；有限点只在给定直线族中核对参数，不代表真实航线评估。",
      summary: "地址签正面留原点、正方向、单位和次序，背面夹航标代入页。",
    },
  };
  const shapes = { lump: ["实心", 0.9], bowl: ["碗形", 4.2], wide: ["宽船", 6.4] };
  const integers = (v, fallback) => v === undefined ? fallback : Number(v);
  function normalize(id, condition, raw = {}) {
    if (!definitions[id] || ![0, 1].includes(condition)) throw new RangeError("Unknown R01 condition");
    const allowed = id === "P01" ? ["shape"] : id === "C01" ? ["instrument", "identity"] : condition ? ["lineSlope"] : ["origin", "targetX", "targetY"];
    if (Object.keys(raw).some(k => !allowed.includes(k))) throw new RangeError("Unknown R01 input");
    if (id === "P01") {
      const shape = raw.shape ?? "lump";
      if (!shapes[shape]) throw new RangeError("Unknown shape");
      return { shape };
    }
    if (id === "C01") {
      const instrument = raw.instrument ?? "eye", identity = raw.identity ?? "";
      if (!(condition ? ["eye", "conductivity", "magnet"] : ["eye", "density", "conductivity"]).includes(instrument) ||
          !(condition ? ["", "iron", "copper"] : ["", "salt", "sugar"]).includes(identity)) throw new RangeError("Unknown instrument or label");
      return { instrument, identity };
    }
    if (condition) {
      const lineSlope = integers(raw.lineSlope, 1);
      if (!Number.isFinite(lineSlope) || lineSlope < 0 || lineSlope > 4 || Math.abs(lineSlope * 10 - Math.round(lineSlope * 10)) > 1e-7) throw new RangeError("Invalid slope");
      return { lineSlope };
    }
    const origin = integers(raw.origin, 0), targetX = integers(raw.targetX, 0), targetY = integers(raw.targetY, 0);
    if (![0, 1].includes(origin) || !Number.isInteger(targetX) || !Number.isInteger(targetY)) throw new RangeError("Invalid coordinate");
    return { origin, targetX, targetY };
  }
  function evaluate(id, condition, raw) {
    const p = normalize(id, condition, raw);
    if (id === "P01") {
      const model = Physics.evaluate("P01", { shape: p.shape, cargo: condition ? 4 : 0 });
      return { legal: true, goalSupported: model.floats, referenceValid: true,
        fixed: { cargo: condition ? 4 : 0, bodyMass: 1.2, crateMass: 1.2, waterDensity: 1 },
        measurement: model, model,
        readings: [["船型", shapes[p.shape][0]], ["总质量", `${model.mass.toFixed(1)} kg`], ["最大排水容量", `${model.capacity.toFixed(1)} L`],
          ["实际排水", model.floats ? `${model.displacement.toFixed(1)} L` : "模型已进水"], ["容量余量", `${model.reserve.toFixed(1)} L`], ["浮态", model.floats ? "漂浮" : "进水下沉"]],
        feedback: model.floats ? "水线仍在船口下方。这组可以支持当前载重。" : `总质量 ${model.mass.toFixed(1)} kg，进水前最大排水容量 ${model.capacity.toFixed(1)} L。看看船口。` };
    }
    if (id === "C01") {
      const distinguishing = condition ? p.instrument === "magnet" : ["density", "conductivity"].includes(p.instrument);
      const measurement = condition ? { response: p.instrument === "magnet" ? "attracted" : p.instrument === "conductivity" ? "conductive" : "similar-appearance" }
        : p.instrument === "density" ? { value: 2.16, unit: "g/cm³" } : p.instrument === "conductivity" ? { value: 15, unit: "relative" } : { response: "white-crystals" };
      const value = condition ? p.instrument === "magnet" ? "明显被吸引" : p.instrument === "conductivity" ? "可导电" : "银灰色外观"
        : p.instrument === "density" ? "2.16 g/cm³" : p.instrument === "conductivity" ? "15（相对）" : "白色晶体";
      const reference = condition ? p.instrument === "magnet" ? "铁：明显吸引；铜：无此响应" : "铁、铜均可导电；外观不能定名"
        : p.instrument === "density" ? "糖 1.59；盐 2.16 g/cm³" : p.instrument === "conductivity" ? "糖 0.2；盐 15（同条件）" : "糖、盐外观近似";
      const supported = distinguishing && p.identity === (condition ? "iron" : "salt");
      return { legal: p.identity !== "", goalSupported: supported, referenceValid: true,
        factParams: { instrument: p.instrument }, fixed: { sample: condition ? "B" : "A", reference: "r01-samples-1", conditions: "same-as-reference" },
        measurement, model: { distinguishing, value, reference, sample: condition ? "B" : "A" },
        readings: [["留样", condition ? "B · 金属" : "A · 白色样品"], ["本次观察", value], ["参考", reference], ["身份签", ({salt:"盐",sugar:"糖",iron:"铁",copper:"铜"})[p.identity] || "尚未贴签"]],
        feedback: !p.identity ? "先留下测量，再夹一张身份签；贴签本身不会改变读数。" : !distinguishing ? "这项观察不能排除另一候选。换一种有区分力的测量。" : supported ? "测量与身份签吻合，把参考条件一同留下。" : "读数指向另一候选。修改身份签不会生成新的测量。" };
    }
    const fixed = { directionX: "east", directionY: "north", unit: "one-model-grid", order: "x,y" };
    if (!condition) {
      const worldX = p.targetX + p.origin, worldY = p.targetY + p.origin;
      const legal = worldX >= 0 && worldX <= 8 && worldY >= 0 && worldY <= 6;
      const supported = worldX === 4 && worldY === 3;
      return { legal, goalSupported: supported, referenceValid: legal,
        fixed: { ...fixed, window: [4, 3] }, measurement: { worldX, worldY, origin: [p.origin, p.origin], local: [p.targetX, p.targetY] },
        model: { worldX, worldY, supported },
        readings: [["原点", `(${p.origin}, ${p.origin})`], ["窗口地址", `(${p.targetX}, ${p.targetY})`], ["还原世界位置", `(${worldX}, ${worldY})`], ["约定", "东为 x 正向，北为 y 正向；每格 1 单位"]],
        feedback: !legal ? "标记超出给定地图。坐标没有被自动截断，请移回网格。" : supported ? "下一位按这组约定也能找到同一个窗口。" : `当前投到 (${worldX}, ${worldY})，离窗口还差横向 ${4-worldX}、纵向 ${3-worldY} 格。` };
    }
    const residuals = [[1,2],[3,6]].map(([x,y]) => ({ x, y, residual: Number((y-p.lineSlope*x).toFixed(8)) }));
    const supported = residuals.every(r => Math.abs(r.residual) <= 0.01);
    return { legal: true, goalSupported: supported, referenceValid: true,
      fixed: { ...fixed, origin: [0,0], family: "y=mx", intercept: 0, points: [[1,2],[3,6]] },
      measurement: { slope: p.lineSlope, residuals }, model: { residuals, supported },
      readings: [["给定关系族", `y = ${p.lineSlope}x（截距 0）`], ...residuals.map(r => [`航标 (${r.x},${r.y})`, `${r.y} − ${p.lineSlope} × ${r.x} = ${r.residual}`])],
      feedback: supported ? "两个航标代入后残差都为零。在给定直线族内，这组参数成立。" : "不是每个点都在关系线上。高亮处显示 y − mx 的差，再调斜率。" };
  }
  function compare(id, { condition, basis, params, result }) {
    if (id === "P01") return { eligible: basis.params.shape !== params.shape,
      verified: condition === 0 && basis.goalSupported && result.goalSupported &&
        [basis.params.shape, params.shape].includes("bowl") && [basis.params.shape, params.shape].includes("wide"),
      kind: "controlled-comparison" };
    if (id === "C01") {
      const methods = [basis.params.instrument, params.instrument];
      const eligible = condition === 0 && basis.goalSupported && methods.includes("density") && methods.includes("conductivity");
      return { eligible, verified: eligible && result.goalSupported, kind: "cross-check" };
    }
    const eligible = condition === 0 && basis.goalSupported && basis.params.origin !== params.origin;
    return { eligible, verified: eligible && result.goalSupported && basis.measurement.worldX === result.measurement.worldX && basis.measurement.worldY === result.measurement.worldY, kind: "representation-check" };
  }
  function candidates(id, condition) {
    if (id === "P01") return Object.keys(shapes).map(shape => ({ shape }));
    if (id === "C01") return (condition ? ["eye","magnet","conductivity"] : ["eye","density","conductivity"]).map(instrument => ({instrument,identity:condition?"iron":"salt"}));
    return condition ? [1,2,3].map(lineSlope => ({lineSlope})) : [0,1].map(origin => ({origin,targetX:4-origin,targetY:3-origin}));
  }
  function createSession(id) {
    if (!definitions[id]) throw new RangeError("Unknown first voyage level");
    return Research.create({ id, modelVersion: `first-voyage-${id}-1`, normalize: (c,p) => normalize(id,c,p), evaluate: (c,p) => evaluate(id,c,p),
      compare: input => compare(id,input), candidates: c => candidates(id,c),
      consult: (c,strong) => ({ text: strong ? `${definitions[id].goals[c]} ${definitions[id].quality}` : definitions[id].goals[c] }) });
  }
  const api = { definitions, shapes, normalize, evaluate, compare, candidates, createSession };
  if (local) module.exports = api;
  if (typeof window !== "undefined") window.AtlasFirstVoyageModels = api;
})();
