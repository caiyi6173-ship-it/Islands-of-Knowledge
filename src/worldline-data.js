/* Postal work is shared across subjects; it never decides scientific validity. */
(() => {
  const chapters = [
    { id: "R01", title: "第一船信", main: ["P01", "C01", "M03"], side: ["P02", "M02", "C05"],
      need: "把四箱器材与样品送到小禾的内港窗口。", effect: "四箱货已抵达，缺角箱子的回条挂上桌角。",
      receipt: "收到了。最后那箱也在。记录总要到收工才写完，晚上也能有人接吗？", sender: "小禾" },
    { id: "R02", title: "夜班还开着", main: ["P06", "C10", "M08"], side: ["P04", "M04", "C09"],
      need: "把操作卡、电路图和航向卡夹进同一份夜班夹。", effect: "局部夜间接应恢复，阿澜有了明确的交班。整圈夜邮仍在准备。",
      receipt: "今晚轮到我们接。交班纸签夹在窗口，回程看这里。返回的旧稿有两页标得不同，一起核对吧。", sender: "小禾和值班同伴" },
    { id: "R03", title: "对岸看懂了吗", main: ["P07", "M06", "C04"], side: ["P05", "M01", "C03"],
      need: "核对给定旧页，分别补齐报码、变换与电子对的图例。", effect: "修订分册寄出，三站开始共同编写可携带的图册。",
      receipt: "这次看懂了。我这边的图，也少写了一行，改稿一起寄回。", sender: "小禾" },
    { id: "R04", title: "图纸背面的那一行", main: ["P03", "M05", "C06"], side: ["P08", "M07", "C07"],
      need: "把轨道、净空与构型页的用途和条件放到正面。", effect: "共同图册寄出，原页和修订来历一起保留。",
      receipt: "用途放在正面了。新现场还没试过的部分，我们也留着。下一趟带一份新记录来核对。", sender: "三站图册夹" },
    { id: "R05", title: "下一次还成立吗", main: ["P10", "M10", "C08"], side: ["P09", "M09", "C02"],
      need: "夹好三份新核对，让夜邮信袋沿三站完整返回。", effect: "整圈夜邮完成。你有了自己的桌位，阿墨仍是搭档；阿澜按交班收工。",
      receipt: "新记录收到了。下一轮有一处，想和你们一起查。新人带来多一箱的清单，你的桌子，愿意借他一角吗？", sender: "标本港观测窗口与测绘台" },
  ];
  const names = {
    P01: "船型与载重吃水卡", P02: "钟位与时间表", P03: "带假设的轨道图", P04: "做功与温升记录", P05: "双缝图样页",
    P06: "感应装置操作卡", P07: "发送接收与报码说明", P08: "有条件的异常报告", P09: "模型适用范围页", P10: "光电检测条件签",
    M01: "音程与逼近折页", M02: "质量等式账单", M03: "原点单位地址签", M04: "定义域对应表", M05: "桥洞几何净空图",
    M06: "变换顺序图例", M07: "有依据直角卡", M08: "两种目标航向卡", M09: "割线切线与极小值页", M10: "独立检验预报页",
    C01: "样品性质与身份签", C02: "组成比例页", C03: "分类卡和现代附页", C04: "电子对图例", C05: "下标与份数清单",
    C06: "多视角构型页", C07: "单键与合偶极图", C08: "称量边界与反应账本", C09: "分开的电子账", C10: "双杯两通路图",
  };
  const tasks = Object.fromEntries(chapters.flatMap(c => ["main", "side"].flatMap(kind =>
    c[kind].map(id => [id, { id, chapter: c.id, kind, title: names[id] }]))));
  for (const c of chapters) { Object.freeze(c.main); Object.freeze(c.side); Object.freeze(c); }
  Object.values(tasks).forEach(Object.freeze);
  const letterSources = Object.freeze(chapters.flatMap(c => [...c.main, ...c.side]));
  const api = Object.freeze({ version: 1, letterSources, chapters: Object.freeze(chapters), tasks: Object.freeze(tasks) });
  if (typeof window !== "undefined") window.AtlasWorldlineData = api;
  if (typeof module !== "undefined") module.exports = api;
})();
