/* Chemistry keeps its models; the campaign now uses the Physics Island rules. */
(() => {
  const local = typeof module !== "undefined" && module.exports;
  const D = local ? require("./chemistry-data.js") : window.AtlasChemistryData;
  const Native = local
    ? require("./chemistry-engine.js")
    : window.AtlasChemistryGame;
  const Engine = local
    ? require("./scenario-engine.js")
    : window.AtlasScenarioEngine;
  const ResearchEngine = local
    ? require("./research-engine.js")
    : window.AtlasResearchEngine;
  const thirdClaims = [
    "同样能导电的样品，必定属于同一种物质。",
    "一种元素的原子在普通化学组合中可以随意变成另一种元素。",
    "同一周期的原子，价电子数一定相同。",
    "只要总电子数正确，就不用检查电子如何分配。",
    "分子式的下标已经给出了所有键角和空间位置。",
    "转动观察视角，就改变了分子真实的键角。",
    "合偶极为零，说明分子中的每一根键都没有极性。",
    "配平方程时，可以随意改变分子式下标来让原子总数相等。",
    "氧化就是得到电子，还原就是失去电子。",
    "原电池中，电子可以直接经过盐桥从一杯流向另一杯。",
  ];
  const crew = [
    "港口记录员",
    "称量学徒",
    "温室管理员",
    "灯房工匠",
    "分子邮差",
    "模型制作师",
    "风向台测量员",
    "天平记录员",
    "渡口管理员",
    "信号站值班员",
  ];
  const scenarios = D.levels.map((l, i) => ({
    id: l.id,
    question: l.title,
    title: l.title,
    subtitle: l.opening,
    crisis: l.opening,
    roleNames: ["化学助手", "装置工匠", "研究记录员"],
    npc: {
      name: crew[i],
      stance: "希望用可以核对的证据解释现象",
      quote: "怎样知道这份解释经得起检验？",
    },
    rounds: l.tasks.map((t) => ({
      title: t.title,
      description: t.goal,
      actions: [
        { id: "experiment", title: t.title, text: t.goal, reply: t.success },
        {
          id: "consult",
          title: "查阅人物手记",
          text: "比较模型与研究条件。",
          reply: t.hint,
        },
        {
          id: "rush",
          title: "先做一次小范围试探",
          text: "留下初步线索，仍需完整记录。",
          reply: t.hint,
        },
      ],
    })),
    final: {
      title: "把发现交给下一位研究者",
      publish: "归档这份化学解释",
      detail: l.boundary,
      success: l.takeaway,
      overreach: l.wrong,
    },
  }));
  const roles = [
    {
      id: "assistant",
      title: "耐心的探索者",
      skill: "多两格时间",
      time: 9,
      tools: 4,
      trust: 2,
    },
    {
      id: "maker",
      title: "灵巧的造物者",
      skill: "首次实验免器材",
      time: 7,
      tools: 6,
      trust: 2,
    },
    {
      id: "skeptic",
      title: "敏锐的质疑者",
      skill: "首次调查线索强度 +1",
      time: 7,
      tools: 4,
      trust: 3,
    },
  ];
  function lab(id, round) {
    const t = Native.task(id, round);
    return {
      goal: t.goal,
      hint: t.hint,
      controls: t.controls.map((c) => {
        if (c.type === "choice")
          return {
            key: c.key,
            label: c.label,
            values: c.options,
            value: c.value,
            role: c.role || "condition",
          };
        const count = (c.max - c.min) / c.step;
        const values =
          count <= 7
            ? Array.from({ length: count + 1 }, (_, i) =>
                Number((c.min + i * c.step).toFixed(6)),
              )
            : [
                ...new Set([
                  c.min,
                  c.value,
                  Number((c.min + Math.round(count / 2) * c.step).toFixed(6)),
                  c.max,
                ]),
              ].sort((a, b) => a - b);
        return {
          key: c.key,
          label: c.label,
          range: { min: c.min, max: c.max, step: c.step },
          value: c.value,
          values: values.map((v) => [v, v + (c.unit || "")]),
        };
      }),
    };
  }
  const cases = Object.fromEntries(
    D.levels.map((l, i) => [
      l.id,
      {
        method: l.tasks.map((t) => t.hint).join(" "),
        claims: [l.claim, l.wrong, thirdClaims[i]],
      },
    ]),
  );
  function forecast(id, round) {
    const labels = {
      C01: round
        ? ["被明显吸引", "只测到可导电", "轮廓不足以区分"]
        : ["出现可比较的特征读数", "只有相似的白色外观", "无法获得任何读数"],
      C02: ["氧/碳质量比偏低", "氧/碳质量比与账单相同", "氧/碳质量比偏高"],
      C03: ["模型总电子数偏少", "模型总电子数相同", "模型总电子数偏多"],
      C04: ["总价电子偏少", "总价电子与原子提供数相同", "总价电子偏多"],
      C05: [
        "第一种原子下标偏小",
        "第一种原子下标与分子式相同",
        "第一种原子下标偏大",
      ],
      C06: ["参考角偏小", "参考角与目标近似一致", "参考角偏大"],
      C07: ["键偶极非零，合量抵消", "出现非零合偶极", "键偶极本身被调为零"],
      C08: round
        ? ["左右两种元素各自平衡", "有原子差额，未配平", "反应式下标发生改变"]
        : ["天平总读数保持 100g", "部分质量流出称量边界", "总质量凭空增加"],
      C09: round
        ? ["沉积量小于参考", "沉积量约等于 127mg", "沉积量大于参考"]
        : ["电子从锌出发", "电子从铜出发", "电子没有指定去向"],
      C10: ["没有持续电流", "电流存在但小于 20mA", "电流至少 20mA"],
    }[id];
    return {
      question: "先预测：这组设置会让仪器显示什么？",
      options: labels.map((label, i) => ({
        id: ["first", "second", "third"][i],
        label,
      })),
    };
  }
  function observe(id, round, result, guess) {
    const p = result.params,
      m = result.model;
    const compare = (x, y) => (Math.abs(x - y) < 0.000001 ? 1 : x < y ? 0 : 2);
    const index = {
      C01: () =>
        round
          ? p.instrument === "magnet"
            ? 0
            : p.instrument === "conductivity"
              ? 1
              : 2
          : p.instrument === "eye"
            ? 1
            : 0,
      C02: () => compare(m.ratio, round ? 8 / 3 : 4 / 3),
      C03: () => compare(m.total, m.target),
      C04: () => compare(m.total, round ? 12 : 2),
      C05: () => compare(p.first, round ? 1 : 2),
      C06: () =>
        Math.abs(p.angle - m.target) <= 0.5 ? 1 : compare(p.angle, m.target),
      C07: () => (!p.pull ? 2 : m.net < 1e-8 ? 0 : 1),
      C08: () =>
        round
          ? m.diffH === 0 && m.diffO === 0
            ? 0
            : 1
          : m.retained === 100
            ? 0
            : 1,
      C09: () =>
        round
          ? compare(m.mass, ((63.546 * 386) / (2 * 96485)) * 1000)
          : p.donor === "Zn"
            ? 0
            : 1,
      C10: () => (!m.current ? 0 : m.current < 20 ? 1 : 2),
    }[id]();
    const options = forecast(id, round).options,
      actual = options[index],
      prediction = options.find((o) => o.id === guess);
    return {
      actual: actual.id,
      label: actual.label,
      prediction: prediction?.id || null,
      predictedLabel: prediction?.label || null,
      matched: prediction ? prediction.id === actual.id : null,
    };
  }
  const research = ResearchEngine.create({
    cases,
    forecast,
    observe,
    experimentKeys: (id, round) =>
      lab(id, round)
        .controls.filter((control) => control.role !== "answer")
        .map((control) => control.key),
  });
  const base = Engine.create({
    scenarios,
    roles,
    lab,
    cleanParams: Native.params,
    test: Native.evaluate,
    research,
    researchVersion: 2,
    legacyComparison: ResearchEngine.create({ cases, forecast, observe })
      .comparison,
  });
  // Preserve evidence from the first chemical workbench. The source record travels
  // with the new save, while supported observations are replayed under common rules.
  function migrate(id, record) {
    const old = Native.restore(id, record),
      cleared = Native.isCleared(old);
    let state = base.fresh(id, "assistant", {
      cleared,
      bestStars: old.bestStars,
      endings: cleared ? ["breakthrough"] : [],
    });
    state.legacyChemistry = JSON.parse(JSON.stringify(record));
    for (let round = 0; round < 2; round++) {
      const rows = old.records.filter((r) => r.round === round),
        row = rows.findLast((r) => r.success) || rows.at(-1);
      if (!row) break;
      state =
        base.act(state, "experiment", row.params, { followUp: true }) || state;
      if (old.round > round || old.phase !== "lab")
        state = base.next(state) || state;
      else break;
    }
    if (old.phase === "complete" && state.round === 2) {
      const records = state.log.flatMap((e, i) => (e.points ? [i] : []));
      state =
        base.act(
          state,
          "publish",
          {},
          { argument: { claim: "supported", scope: "tested", records } },
        ) || state;
    }
    // Replaying the old evidence must not award a better historical score by migration.
    state.bestStars = old.bestStars;
    state.legacyMigration = {
      events: state.events.length,
      bestStars: old.bestStars,
    };
    return state;
  }
  function restore(id, record) {
    if (record?.version === 1 && record.id === id) return migrate(id, record);
    const state = base.restore(id, record);
    if (record?.legacyChemistry)
      state.legacyChemistry = JSON.parse(
        JSON.stringify(record.legacyChemistry),
      );
    if (
      record?.legacyMigration &&
      record.events?.length === record.legacyMigration.events
    ) {
      state.legacyMigration = { ...record.legacyMigration };
      state.bestStars = Native.restore(id, record.legacyChemistry).bestStars;
    }
    return state;
  }
  function fresh(id, role, previous) {
    const archive = previous?.version === 1 ? restore(id, previous) : previous;
    const state = base.fresh(id, role, archive);
    if (archive?.legacyChemistry)
      state.legacyChemistry = JSON.parse(
        JSON.stringify(archive.legacyChemistry),
      );
    return state;
  }
  const api = {
    ...base,
    restore,
    fresh,
    rating(state) {
      const result = base.rating(state);
      if (
        state.legacyMigration &&
        state.events.length === state.legacyMigration.events &&
        state.ended
      ) {
        const count = Native.restore(state.id, state.legacyChemistry).bestStars;
        return {
          ...result,
          count,
          stars: result.stars.map((star, i) => ({
            ...star,
            earned: i < count,
            hint: "保留旧版研究的历史星级；重新挑战使用统一评分规则。",
          })),
        };
      }
      return result;
    },
    isCleared: (r) =>
      r?.version === 1 ? Native.isCleared(r) : base.isCleared(r),
    research,
  };
  if (local) module.exports = api;
  if (typeof window !== "undefined") window.AtlasChemistryScenarios = api;
})();
