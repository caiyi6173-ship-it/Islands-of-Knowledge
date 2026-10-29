/* Research choices annotate real model results; they never alter the physics. */
(() => {
  const cases = {
    P01: {
      method: "把材料质量保持相同，比较进水前的排水容量。",
      claims: [
        "漂浮取决于排开水的重量能否平衡总重",
        "把材料做成空心后，材料本身就变轻了",
        "船变宽会让水的密度增大",
      ],
    },
    P02: {
      method: "分别比较到达时刻和相邻节拍，别把距离间隔当成时间间隔。",
      claims: [
        "起点静止的匀加速运动，位移随时间平方增长",
        "相同距离总会对应相同时间",
        "只要换一个坡度，平方关系就一定消失",
      ],
    },
    P03: {
      method: "只改水平初速度，观察轨迹是否触地、闭合或远离星球。",
      claims: [
        "向前运动和持续下落可以共同形成环绕",
        "炮弹进入轨道后，引力就消失了",
        "只要速度增加，炮弹就一定留在闭合轨道",
      ],
    },
    P04: {
      method: "区分传动是否连接，以及输入能量有多少留在水中。",
      claims: [
        "机械功可转化为内能，散热影响测得的温升",
        "水温上升就说明装置产生了额外能量",
        "只要有重物下落，断开传动也会让水同样升温",
      ],
    },
    P05: {
      method: "先确认两路相干光，再比较几何设置与目标处光强。",
      claims: [
        "相干光的光程差决定相消位置，波长变化会移动条纹",
        "两路光相遇时，在每个位置都会更亮",
        "固定目标处的明暗只由光的总亮度决定",
      ],
    },
    P06: {
      method: "分清静止、短暂移动和持续输入，关注指针随时间的变化。",
      claims: [
        "磁通变化产生感应，持续供电还需要持续能量输入",
        "磁铁只要足够强，固定不动也能一直供电",
        "停止摇柄后，装置仍能无限输出电能",
      ],
    },
    P07: {
      method: "把频段匹配和信息内容分开检查，避免同时改两件事。",
      claims: [
        "接收条件的匹配和信息内容都需要检验",
        "只要提高发送强度，就可以忽略接收条件",
        "频段匹配后，任何编码都会被解读成同一字母",
      ],
    },
    P08: {
      method: "先想清楚背景、对照和重复分别排除什么疑问。",
      claims: [
        "对照与重复支持异常值得追踪，鉴别元素还需更多证据",
        "只测出一次高读数，就能确认一种新元素",
        "没有背景测量，所有读数也都能直接比较",
      ],
    },
    P09: {
      method: "固定温度比较模型，再检验同一模型能否面对新温度。",
      claims: [
        "按频率分份的交换模型能描述本次高频回落",
        "只要调整温度，经典低频近似就能覆盖全部频段",
        "一种温度的拟合就能证明所有微观理论都正确",
      ],
    },
    P10: {
      method: "分别考察每个光子的能量、材料逸出功和入射光的数量。",
      claims: [
        "单光子能量由频率决定，达到阈值后强度影响电子数量",
        "低频光只要足够亮，单个光子就会获得更大能量",
        "换成不同金属，逸出阈值也完全不会改变",
      ],
    },
  };
  const options = (entries) => entries.map(([id, label]) => ({ id, label }));
  function forecast(id, round) {
    const second = round === 1;
    const definitions = {
      P01: [
        "这艘船放进水里，会怎样？",
        [
          ["float", "排开足够的水，漂浮"],
          ["sink", "容量不够，进水下沉"],
        ],
      ],
      P02: [
        "这组钟位会敲出怎样的节拍？",
        [
          ["even", "相邻钟声等时间隔"],
          ["shorter", "后面的时间间隔缩短"],
        ],
      ],
      P03: [
        "这次发射会留下哪一种轨迹？",
        [
          ["ground", "回到地面"],
          ["orbit", "闭合环绕"],
          ["escape", "远离星球，逃逸"],
        ],
      ],
      P04: [
        "水温计会留下怎样的变化？",
        [
          ["none", "没有机械输入，水不升温"],
          ["loss", "小幅升温，一部分能量散失"],
          ["retained", "隔热后保留更多热，温升更明显"],
        ],
      ],
      P05: [
        "目标刻线会出现什么现象？",
        [
          ["single", "缺少双缝干涉条件"],
          ["dark", "两路光在目标处相消"],
          ["light", "有双缝，目标却未落在暗纹"],
        ],
      ],
      P06: second
        ? [
            "输入持续一段时间后，指针会怎样？",
            [
              ["ongoing", "持续发生变化"],
              ["none", "没有持续的感应响应"],
            ],
          ]
        : [
            "磁铁按这套方式移动，指针会怎样？",
            [
              ["none", "始终为零"],
              ["opposite", "推进与拉出时反向偏转"],
              ["transient", "短暂偏转，停住后归零"],
            ],
          ],
      P07: [
        "接收站会记下什么？",
        [
          ["unmatched", "频段未匹配，没有预期响应"],
          [
            "received",
            second ? "匹配成功，也收到了约定的 R" : "匹配成功，收到试探信号",
          ],
          ...(second ? [["message", "频段匹配，但信息不是 R"]] : []),
        ],
      ],
      P08: second
        ? [
            "这套方案能留下怎样的重复记录？",
            [
              ["single", "每份只有一次读数"],
              ["repeated", "两份样本各有三次读数"],
            ],
          ]
        : [
            "这套方案留下的比较有多完整？",
            [
              ["single", "只有矿石单份读数"],
              ["pair", "有铀和矿石，仍缺背景"],
              ["control", "背景、铀和矿石都被记录"],
            ],
          ],
      P09: [
        "这套模型的高频一端会怎样？",
        [
          ["turn", "曲线回落"],
          ["up", "继续增长，偏离实测"],
        ],
      ],
      P10: second
        ? [
            "第二种金属表面会有电子逸出吗？",
            [
              ["emit", "单光子能量足够，有电子逸出"],
              ["none", "单光子能量不足，没有电子逸出"],
            ],
          ]
        : [
            "这组对照会出现什么？",
            [
              ["mixed", "强红光无电子，弱蓝光有电子"],
              ["none", "两次都没有电子逸出"],
            ],
          ],
    };
    const [question, entries] = definitions[id];
    return { question, options: options(entries) };
  }
  function observe(id, round, result, guess) {
    const p = result.params,
      second = round === 1;
    const actual = {
      P01: () => (result.success ? "float" : "sink"),
      P02: () => (result.success ? "even" : "shorter"),
      P03: () =>
        ({ 触地: "ground", 闭合环绕: "orbit", 逃逸: "escape" })[
          result.readings.find(([label]) => label === "轨迹")[1]
        ],
      P04: () => (!p.connected ? "none" : p.insulated ? "retained" : "loss"),
      P05: () =>
        p.slits === "one" ? "single" : result.success ? "dark" : "light",
      P06: () =>
        second
          ? p.motion === "turn"
            ? "ongoing"
            : "none"
          : p.motion === "in"
            ? "opposite"
            : p.motion === "hold"
              ? "transient"
              : "none",
      P07: () =>
        p.frequency !== (second ? 5 : 3)
          ? "unmatched"
          : second && p.code !== "R"
            ? "message"
            : "received",
      P08: () =>
        second
          ? p.repeats === 3
            ? "repeated"
            : "single"
          : p.protocol === "control"
            ? "control"
            : p.protocol === "pair"
              ? "pair"
              : "single",
      P09: () => (p.model === "quanta" ? "turn" : "up"),
      P10: () =>
        second
          ? result.success
            ? "emit"
            : "none"
          : p.protocol === "frequency"
            ? "mixed"
            : "none",
    }[id]();
    const choices = forecast(id, round).options;
    const prediction = choices.find((option) => option.id === guess);
    return {
      actual,
      label: choices.find((option) => option.id === actual).label,
      prediction: prediction?.id || null,
      predictedLabel: prediction?.label || null,
      matched: prediction ? prediction.id === actual : null,
    };
  }
  const Engine =
    typeof module !== "undefined" && module.exports
      ? require("./research-engine.js")
      : window.AtlasResearchEngine;
  const api = Engine.create({ cases, forecast, observe });
  if (typeof window !== "undefined") window.AtlasPhysicsInvestigations = api;
  if (typeof module !== "undefined") module.exports = api;
})();
