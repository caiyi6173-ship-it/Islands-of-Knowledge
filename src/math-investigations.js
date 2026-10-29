/* Math research choices annotate real model results; they never alter the mathematics. */
(() => {
  const cases = {
    M01: {
      method: "比较琴弦整数比的共鸣，并用有限分数逼近对角线。",
      claims: [
        "有理数不能穷尽所有线段长度，数系需要扩充",
        "所有几何线段都可以写成两个整数之比",
        "无理数只是测量不准造成的误差",
      ],
    },
    M02: {
      method: "在天平两端施加对消与还原，保持平衡解出未知量。",
      claims: [
        "方程求解是在两端等价变形下让未知数显现",
        "解方程就是不断猜测数字直到碰对",
        "移项时两边可以随意改变而不必守恒",
      ],
    },
    M03: {
      method: "用正交坐标轴锁定位置，检验代数方程与几何轨迹的一致性。",
      claims: [
        "一对坐标能唯一确定平面点，方程决定几何轨迹",
        "坐标轴必须随意倾斜才能表示曲线",
        "点的位置脱离参考系依然拥有固定坐标",
      ],
    },
    M04: {
      method: "检验输入输出的确定法则与单值映射契约。",
      claims: [
        "函数规则要求每个输入对应唯一的输出",
        "函数只是一张数值表，不能写成代数式",
        "一个输入可以同时产生两个随机的不同输出",
      ],
    },
    M05: {
      method: "调节抛物线对称轴、顶点高度与开口，兼顾跨度与净空。",
      claims: [
        "二次函数顶点决定极值，开口控制宽窄与方向",
        "桥拱只需用半圆弧就能适应任意跨度",
        "对称轴偏离中央时两端仍能落在对称桥基上",
      ],
    },
    M06: {
      method: "考察刚体与相似变换下的几何守恒量。",
      claims: [
        "刚体变换保持长度与角度，相似变换保持角度与比例",
        "平移后图形的边长会随移动距离缩短",
        "图形旋转 90 度后面积会发生改变",
      ],
    },
    M07: {
      method: "基于公理验证三角形稳固性与勾股面积拼图。",
      claims: [
        "三角形三边确定刚性，直角三角形直角边平方和等于斜边平方",
        "任意四边形只定四边也能保持刚性不晃动",
        "勾股定理适用于所有钝角和锐角三角形",
      ],
    },
    M08: {
      method: "合成渡船合速度，并进行正交分解评估时间与位移。",
      claims: [
        "向量兼具大小与方向，正交分解使多维运动互不干扰",
        "速度只要大小够快就一定能正对岸航行",
        "分解后的两个分量会互相改变彼此的数值",
      ],
    },
    M09: {
      method: "缩小割线时间步长逼近瞬时切线斜率与驻点极值。",
      claims: [
        "时间步长趋于零时，平均变化率收敛为瞬时变化率",
        "瞬时速度可以直接通过一小时的平均速度代替",
        "切线斜率为零的点与函数的极值完全无关",
      ],
    },
    M10: {
      method: "调节模型参数降低残差平方和，并用外推预测验证假设。",
      claims: [
        "好的数学模型提炼核心秩序，容纳误差并支持检验",
        "拟合必须死板穿过每一个带有噪声的噪点",
        "只要公式足够复杂，模型就一定具有最好的预测力",
      ],
    },
  };

  const options = (entries) => entries.map(([id, label]) => ({ id, label }));

  function forecast(id, round) {
    const second = round === 1;
    const definitions = {
      M01: second
        ? [
            "连分数尺逼近对角线，平方后会怎样？",
            [
              ["close", "当前平方残差较小，但不为零"],
              ["exact", "当前分数的平方残差还较大"],
            ],
          ]
        : [
            "拨动这两根琴弦后，会听到怎样的声音？",
            [
              ["harmony", "清澈和谐的纯正和声"],
              ["dissonance", "杂乱刺耳的不和谐音"],
            ],
          ],
      M02: second
        ? [
            "两步还原后，解出的香料重量是多少？",
            [
              ["seven", "解出未知数 x = 7 磅"],
              ["wrong", "还原步骤错误，数值不符"],
            ],
          ]
        : [
            "天平两边拿掉相同负荷后，天平会怎样？",
            [
              ["balanced", "保持平衡，左边只剩包裹"],
              ["tilted", "未知量尚未单独留下，或移除操作无效"],
            ],
          ],
      M03: second
        ? [
            "连接直线航线后，能否穿透航标？",
            [
              ["aligned", "航线笔直穿过所有目标"],
              ["deviated", "航线斜率不匹配偏离"],
            ],
          ]
        : [
            "输入这对坐标后，准星会落在哪里？",
            [
              ["target", "准确锁定 (4, 3) 航标"],
              ["miss", "偏离目标航标位置"],
            ],
          ],
      M04: second
        ? [
            "运行映射检测台，法则表现如何？",
            [
              ["single", "每个输入唯一确定，单值映射"],
              ["ambiguous", "存在一进多出歧义"],
            ],
          ]
        : [
            "设定齿轮传动比后，输出读数是否匹配？",
            [
              ["matched", "测试点输出完全匹配"],
              ["mismatched", "读数与测试数据不符"],
            ],
          ],
      M05: second
        ? [
            "中央 6 米货运通道净空如何？",
            [
              ["cleared", "通道内高度全部超过 3.5 米"],
              ["blocked", "局部高度不足无法通行"],
            ],
          ]
        : [
            "抛物线桥拱两端能否落在基座上？",
            [
              ["fitted", "桥拱两端准确落在基座"],
              ["missed", "端点脱离基座或开口朝上"],
            ],
          ],
      M06: second
        ? [
            "比例放大 2 倍后，面积变成几倍？",
            [
              ["quad", "内角不变，面积变为 4 倍"],
              ["double", "面积倍率不等于本关要求的 4 倍"],
            ],
          ]
        : [
            "平移与旋转后，图案能否对准锁孔？",
            [
              ["locked", "边长角度守恒，钥匙入锁"],
              ["misaligned", "位置或旋转角度未对齐"],
            ],
          ],
      M07: second
        ? [
            "直角边正方形拼图能否填满斜边正方形？",
            [
              ["exact_fit", "面积恰好拼合：9 + 16 = 25"],
              ["unmatched", "面积有多余或缝隙"],
            ],
          ]
        : [
            "扣合连杆后，框架力学表现如何？",
            [
              ["stable", "三角形刚性固定，内角和 180°"],
              ["wobbly", "四边形晃动易变形"],
            ],
          ],
      M08: second
        ? [
            "追求最短过河时间，船头应朝向何方？",
            [
              ["north", "垂直对岸（90°），耗时最短"],
              ["angled", "偏斜航行，过河时间延长"],
            ],
          ]
        : [
            "合成渡船航向后，合速度指向何处？",
            [
              ["across", "合速度正对对岸码头"],
              ["drift", "合速度偏向上游或下游"],
            ],
          ],
      M09: second
        ? [
            "水位变化率为零的驻点在何时出现？",
            [
              ["stationary", "在 t = 20 秒处导数为零"],
              ["moving", "当前切线斜率不为零"],
            ],
          ]
        : [
            "时间步长 Δt 缩短后，割线斜率表现如何？",
            [
              ["tangent", "稳定收敛在 -4 cm/s 瞬时切线"],
              ["gap", "步长过大，与切线存在显著偏差"],
            ],
          ],
      M10: second
        ? [
            "外推预报谷神星，望远镜能否捕获天体？",
            [
              ["captured", "在预报天区成功捕获天体"],
              ["lost", "预报偏差过大未见天体"],
            ],
          ]
        : [
            "调整参数后，残差平方和能否达标？",
            [
              ["minimized", "残差平方和降至 0.25 以下"],
              ["high_error", "曲线与噪点偏差过大"],
            ],
          ],
    };

    const [question, entries] = definitions[id];
    return { question, options: options(entries) };
  }

  function observe(id, round, result, guess) {
    const second = round === 1;
    const actual = {
      M01: () =>
        second
          ? result.success
            ? "close"
            : "exact"
          : result.success
            ? "harmony"
            : "dissonance",
      M02: () =>
        second
          ? result.success
            ? "seven"
            : "wrong"
          : result.success
            ? "balanced"
            : "tilted",
      M03: () =>
        second
          ? result.success
            ? "aligned"
            : "deviated"
          : result.success
            ? "target"
            : "miss",
      M04: () =>
        second
          ? result.success
            ? "single"
            : "ambiguous"
          : result.success
            ? "matched"
            : "mismatched",
      M05: () =>
        second
          ? result.success
            ? "cleared"
            : "blocked"
          : result.success
            ? "fitted"
            : "missed",
      M06: () =>
        second
          ? result.success
            ? "quad"
            : "double"
          : result.success
            ? "locked"
            : "misaligned",
      M07: () =>
        second
          ? result.success
            ? "exact_fit"
            : "unmatched"
          : result.success
            ? "stable"
            : "wobbly",
      M08: () =>
        second
          ? result.success
            ? "north"
            : "angled"
          : result.success
            ? "across"
            : "drift",
      M09: () =>
        second
          ? result.success
            ? "stationary"
            : "moving"
          : result.success
            ? "tangent"
            : "gap",
      M10: () =>
        second
          ? result.success
            ? "captured"
            : "lost"
          : result.success
            ? "minimized"
            : "high_error",
    }[id]();

    const choices = forecast(id, round).options;
    const prediction = choices.find((option) => option.id === guess);
    const chosen = choices.find((option) => option.id === actual);
    return {
      actual,
      label: chosen ? chosen.label : actual,
      prediction: prediction?.id || null,
      predictedLabel: prediction?.label || null,
      matched: prediction ? prediction.id === actual : null,
    };
  }

  function comparison(state, params) {
    const baseIndex = state.log.findLastIndex(
      (entry) => entry.round === state.round && entry.action === "experiment",
    );
    if (baseIndex < 0) return null;
    const base = state.log[baseIndex];
    const changes = Object.keys(base.result.params).filter(
      (key) => base.result.params[key] !== params[key],
    );
    const used = state.log.some(
      (entry) => entry.round === state.round && entry.comparison?.discount,
    );
    return {
      baseIndex,
      changes,
      fair: changes.length === 1,
      discount: !used && changes.length === 1,
    };
  }

  function sanitize(meta, id, round, logLength) {
    if (!meta || typeof meta !== "object") return {};
    const clean = {};
    if (
      round < 2 &&
      forecast(id, round).options.some(
        (option) => option.id === meta.prediction,
      )
    )
      clean.prediction = meta.prediction;
    if (meta.followUp === true) clean.followUp = true;
    if (meta.comparison === true) clean.comparison = true;
    if (round === 2 && meta.argument && typeof meta.argument === "object") {
      const a = meta.argument;
      clean.argument = {
        claim: ["supported", "alternative-1", "alternative-2"].includes(a.claim)
          ? a.claim
          : null,
        scope: ["tested", "universal"].includes(a.scope) ? a.scope : null,
        records: [
          ...new Set(
            Array.isArray(a.records)
              ? a.records.filter(
                  (n) => Number.isInteger(n) && n >= 0 && n < logLength,
                )
              : [],
          ),
        ].slice(0, 3),
      };
    }
    return clean;
  }

  function assess(state, argument) {
    const selected = argument.records
      .map((index) => state.log[index])
      .filter((entry) => entry && entry.round < 2);
    const best = [0, 1].map((round) =>
      Math.max(
        0,
        ...selected
          .filter((entry) => entry.round === round)
          .map((entry) => entry.points || 0),
      ),
    );
    const score = best[0] + best[1],
      proof = selected.some(
        (entry) => entry.action === "experiment" && entry.success,
      );
    const complete = best.every((points) => points > 0);
    const valid =
      argument.claim === "supported" &&
      argument.scope === "tested" &&
      score >= 3 &&
      proof &&
      complete &&
      state.resources.trust > 0;
    const reason =
      argument.scope === "universal"
        ? "数学规律有严格的定义域和假设条件，结论却被推广到了所有情形。"
        : argument.claim !== "supported"
          ? "选中的解释与这次实验的数学规律不符。回看读数，区分直觉与严密结论。"
          : !proof
            ? "选中的记录里缺少一次成功的完整操作，推理还不能代替直接验证。"
            : !complete
              ? "证据链缺少一个阶段：基础认识与拓展边界需要各有记录支持。"
              : score < 3
                ? "选中记录的支持强度还不够，同一幕的多次尝试不会重复叠分。"
                : state.resources.trust <= 0
                  ? "记录已有支持，但还需要恢复在场学者的信任。"
                  : "两幕记录支持同一个数学解释，结论也保留了适用的边界条件。";
    return { valid, score, proof, complete, reason };
  }

  function report(state) {
    const experiments = state.log.filter(
      (entry) => entry.action === "experiment",
    );
    const predicted = experiments.filter(
      (entry) => entry.observation?.prediction,
    );
    const comparisons = experiments.filter((entry) => entry.comparison?.fair);
    const argument = state.argument ? assess(state, state.argument) : null;
    return {
      experiments: experiments.length,
      predicted: predicted.length,
      revised: predicted.filter((entry) => entry.observation.matched === false)
        .length,
      comparisons: comparisons.length,
      argument,
      badges: [
        predicted.length > 0,
        comparisons.length > 0,
        argument?.valid === true,
      ],
    };
  }

  const api = {
    cases,
    forecast,
    observe,
    comparison,
    sanitize,
    assess,
    report,
  };

  if (typeof window !== "undefined") window.AtlasMathInvestigations = api;
  if (typeof module !== "undefined") module.exports = api;
})();
