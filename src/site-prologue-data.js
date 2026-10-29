/* A conceptual journey through the people already encountered on the islands. */
(() => {
  const scenes = [
    {
      id: "answers", duration: 8000, title: "答案，越来越快。", era: "此刻 · AI 时代", color: "#85cbd8",
      cast: [],
      lines: ["AI 让答案以前所未有的速度，来到我们面前。", "而一个好问题，是怎样诞生的？"],
    },
    {
      id: "manuscripts", duration: 11000, title: "把世界，写下来。", era: "古典庭院 · 数、形与尺度", color: "#e8c582",
      cast: ["M01", "M07", "P01"],
      lines: ["从琴弦的比例，到船舷边的水线。", "人们把观察写进卷轴，让经验成为可以交流的知识。"],
    },
    {
      id: "unknown", duration: 12000, title: "给未知，一个名字。", era: "手稿与书库 · 符号的力量", color: "#b9b0e7",
      cast: ["M02", "M03", "M04"],
      lines: ["未知可以被命名，关系可以被画出。", "方程、坐标与函数，让思想越过语言与时间。"],
    },
    {
      id: "observe", duration: 12000, title: "让自然，亲自回答。", era: "从斜面到星空 · 观察与检验", color: "#9ebbea",
      cast: ["P02", "P03"],
      lines: ["小球越滚越快，月亮却始终没有落到地面。", "他们追问现象，也让测量与推演检验自己的想法。"],
    },
    {
      id: "evidence", duration: 12000, title: "为变化，留下证据。", era: "工坊与实验室 · 功、热与守恒", color: "#efb17b",
      cast: ["P04", "C08"],
      lines: ["重物落下，水温微微上升；物质变化，天平仍在平衡。", "一次次称量与记录，让看不见的联系有了证据。"],
    },
    {
      id: "connections", duration: 12000, title: "连接，看不见的世界。", era: "线圈、信号与元素 · 寻找秩序", color: "#8bd8bc",
      cast: ["P06", "P07", "C03"],
      lines: ["线圈里出现电流，信号越过海峡，元素找到自己的位置。", "人类逐渐学会，从纷繁的现象中寻找共同的秩序。"],
    },
    {
      id: "light", duration: 11000, title: "走到，旧答案之外。", era: "光与微观 · 让异常带来新问题", color: "#d3a9df",
      cast: ["P05", "P08", "P09", "P10"],
      lines: ["光会相互抵消，矿石留下信号，炉光提出新的难题。", "当证据超出已有的解释，新的理解开始生长。"],
    },
    {
      id: "legacy", duration: 10000, title: "我们继承的，不只是工具。", era: "文明的长卷 · 思想彼此照亮", color: "#e9c987",
      cast: ["M09", "M10", "C05", "C07"],
      lines: ["手稿、图纸、公式与实验记录，也是人类留下的文化。", "AI 所连接的知识背后，是许多人漫长的探索。"],
    },
    {
      id: "islands", duration: 8000, title: "下一次提问，交给你。", era: "知识群岛 · 从一个问题启航", color: "#edc77c",
      cast: [],
      lines: ["AI 时代，更值得认识那些教会人类提问的人。", "亲自探索，让证据支持你的判断。"],
    },
  ];
  let totalDuration = 0;
  for (const scene of scenes) {
    scene.start = totalDuration;
    totalDuration += scene.duration;
    Object.freeze(scene.lines);
    Object.freeze(scene.cast);
    Object.freeze(scene);
  }
  function frameAt(value) {
    const elapsed = Math.max(0, Math.min(totalDuration, Number.isFinite(value) ? value : 0));
    const index = scenes.findIndex(scene => elapsed < scene.start + scene.duration);
    const sceneIndex = index < 0 ? scenes.length - 1 : index;
    const scene = scenes[sceneIndex];
    const progress = Math.min(1, (elapsed - scene.start) / scene.duration);
    return { elapsed, index: sceneIndex, scene, progress, cue: progress < 0.5 ? 0 : 1, finished: elapsed >= totalDuration };
  }
  const api = Object.freeze({ scenes: Object.freeze(scenes), totalDuration, frameAt, sessionKey: "knowledge-islands-opening-v1" });
  if (typeof window !== "undefined") window.AtlasSitePrologueData = api;
  if (typeof module !== "undefined") module.exports = api;
})();
