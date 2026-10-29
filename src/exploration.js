/* Map geography and discovery rules. Revealing a place never verifies knowledge. */
(() => {
  const physics = {
    name: "物理岛",
    subtitle: "十场未决的探索",
    art: "./assets/physics-island-v3.png",
    entry: { x: 300, y: 735, radius: 245 },
    positions: {
      P01: [300, 735],
      P02: [325, 385],
      P03: [610, 165],
      P04: [725, 650],
      P05: [865, 395],
      P06: [1155, 555],
      P07: [1390, 415],
      P08: [1100, 220],
      P09: [1360, 755],
      P10: [1420, 185],
    },
    landmarks: {
      P01: "潮汐港",
      P02: "斜面钟楼",
      P03: "山顶轨道台",
      P04: "热功工坊",
      P05: "双缝花园",
      P06: "感应工坊",
      P07: "海峡信号站",
      P08: "矿石计量所",
      P09: "黑体炉房",
      P10: "光电研究站",
    },
    regions: [
      { name: "测量与运动", english: "MOTION & MEASUREMENT", x: 360, y: 915 },
      { name: "热功与波光", english: "ENERGY & INTERFERENCE", x: 815, y: 880 },
      {
        name: "电磁海岸",
        english: "THE ELECTROMAGNETIC COAST",
        x: 1370,
        y: 565,
      },
      { name: "量子高地", english: "EVIDENCE & QUANTA", x: 1110, y: 75 },
    ],
    // Paths branch by the relationship between investigations, rather than an old activity list.
    trails: [
      ["P01", "P02", "P03"],
      ["P02", "P04", "P06", "P07"],
      ["P04", "P05", "P10"],
      ["P07", "P08", "P09", "P10"],
    ],
    order: [
      "P01",
      "P02",
      "P03",
      "P04",
      "P05",
      "P06",
      "P07",
      "P08",
      "P09",
      "P10",
    ],
  };

  const math = {
    name: "数学岛",
    subtitle: "十场秩序的求索",
    art: "./assets/math-island-painterly.png",
    entry: { x: 330, y: 650, radius: 250 },
    positions: {
      M01: [285, 540],
      M02: [365, 365],
      M03: [555, 370],
      M04: [740, 415],
      M05: [1130, 590],
      M06: [1295, 220],
      M07: [755, 730],
      M08: [1390, 470],
      M09: [980, 310],
      M10: [840, 150],
    },
    landmarks: {
      M01: "琴弦数轴庭院",
      M02: "天平广场",
      M03: "坐标测绘台",
      M04: "秩序机器花园",
      M05: "抛物线石桥",
      M06: "变换镜廊",
      M07: "几何回廊",
      M08: "向量石桥",
      M09: "变化水钟塔",
      M10: "星空测绘所",
    },
    regions: [
      { name: "数与形的庭院", english: "NUMBER & FORM", x: 390, y: 860 },
      { name: "对应关系花园", english: "PATTERNS & FUNCTIONS", x: 820, y: 330 },
      { name: "变换与结构", english: "GEOMETRY & STRUCTURE", x: 1190, y: 840 },
      { name: "变化与预报", english: "CHANGE & PREDICTION", x: 950, y: 110 },
    ],
    trails: [
      ["M01", "M02", "M04", "M05", "M06"],
      ["M01", "M03", "M07", "M08", "M09", "M10"],
    ],
    order: [
      "M01",
      "M02",
      "M03",
      "M04",
      "M05",
      "M06",
      "M07",
      "M08",
      "M09",
      "M10",
    ],
  };

  const chemistry = {
    name: "化学岛",
    subtitle: "物质的秘密档案",
    art: "./assets/chemistry-island-painterly.svg",
    entry: { x: 360, y: 650, radius: 250 },
    positions: {
      C01: [370, 650],
      C02: [390, 400],
      C03: [640, 255],
      C04: [850, 420],
      C05: [625, 535],
      C06: [1100, 370],
      C07: [1340, 455],
      C08: [935, 225],
      C09: [1055, 620],
      C10: [1280, 690],
    },
    landmarks: {
      C01: "玻璃标本港",
      C02: "原子砝码坊",
      C03: "元素温室",
      C04: "电子对灯房",
      C05: "分子邮局",
      C06: "四面体花园",
      C07: "偶极风向台",
      C08: "守恒天平所",
      C09: "电子渡口",
      C10: "双杯信号站",
    },
    regions: [
      { name: "标本与元素", english: "THE CABINET OF MATTER", x: 370, y: 140 },
      {
        name: "电子与分子",
        english: "THE INVISIBLE CONNECTIONS",
        x: 710,
        y: 495,
      },
      { name: "空间的花园", english: "SHAPE & POLARITY", x: 1200, y: 860 },
      { name: "守恒的海岸", english: "MATTER IN MOTION", x: 1120, y: 100 },
    ],
    trails: [
      ["C01", "C02", "C03", "C04", "C05", "C06", "C07"],
      ["C04", "C08", "C09", "C10"],
    ],
    order: Array.from(
      { length: 10 },
      (_, i) => "C" + String(i + 1).padStart(2, "0"),
    ),
  };

  const world = {
    art: "./assets/world-map-v2.png?v=20261029-scroll-layout-3",
    harbor: { x: 790, y: 470 },
  };

  const worldPortals = {
    P: {
      x: 1210,
      y: 315,
      terrain: { x: 1230, y: 290 },
      colorExtent: { rx: 390, ry: 285 },
      name: "物理岛",
      caption: "十场未决的探索",
      description:
        "十位科学家，十场未决事件。选择身份，调查线索，动手实验，让证据改变探索的结局。",
    },
    M: {
      x: 380,
      y: 290,
      terrain: { x: 385, y: 250 },
      colorExtent: { rx: 390, ry: 285 },
      name: "数学岛",
      caption: "十场秩序的求索",
      description:
        "十位数学先驱，十座思辨实验台。在数、形、方程与变化之间揭示秩序。",
    },
    C: {
      x: 815,
      y: 770,
      terrain: { x: 815, y: 755 },
      colorExtent: { rx: 535, ry: 260 },
      name: "化学岛",
      caption: "物质的秘密档案",
      description:
        "十位研究者，十座化学实验台。从物性鉴别到电子与分子，让两份证据解释变化，接通最后的原电池。",
    },
  };

  function fogAreas(layer, subject, visited = [], entered = []) {
    if (layer === "world") {
      const areas = [
        { ...worldPortals.P.terrain, radius: 250 },
        { ...world.harbor, radius: 120 },
      ];
      for (const s of ["M", "C"])
        if (entered.includes(s) || visited.some((id) => id.startsWith(s))) {
          const p = worldPortals[s];
          areas.push({ ...p.terrain, radius: 270 });
        }
      return areas;
    }
    if (subject === "P") {
      return [
        physics.entry,
        ...visited
          .filter((id) => physics.positions[id])
          .map((id) => ({
            x: physics.positions[id][0],
            y: physics.positions[id][1],
            radius: 190,
          })),
      ];
    }
    if (subject === "M") {
      return [
        math.entry,
        ...visited
          .filter((id) => math.positions[id])
          .map((id) => ({
            x: math.positions[id][0],
            y: math.positions[id][1],
            radius: 190,
          })),
      ];
    }
    if (subject === "C")
      return [
        chemistry.entry,
        ...visited
          .filter((id) => chemistry.positions[id])
          .map((id) => ({
            x: chemistry.positions[id][0],
            y: chemistry.positions[id][1],
            radius: 190,
          })),
      ];
    return [];
  }

  function isRevealed(position, areas) {
    return areas.some(
      (area) =>
        Math.hypot(position.x - area.x, position.y - area.y) <=
        area.radius - 20,
    );
  }

  function nextLandmark(visited = [], subject = "P") {
    const target =
      subject === "M" ? math : subject === "C" ? chemistry : physics;
    return target.order.find((id) => !visited.includes(id)) || null;
  }

  // Color is earned by discoveries, independently of visiting and fog visibility.
  function colorAreas(layer, subject, discoveries = []) {
    const ids = [...new Set(discoveries)].filter((id) =>
      /^[PMC](0[1-9]|10)$/.test(id),
    );
    if (layer === "island" && subject === "P") {
      const cleared = ids.filter((id) => physics.positions[id]);
      return {
        full: cleared.length === 10,
        areas: cleared.map((id) => ({
          id,
          x: physics.positions[id][0],
          y: physics.positions[id][1],
          rx: 235,
          ry: 210,
        })),
      };
    }
    if (layer === "island" && subject === "M") {
      const cleared = ids.filter((id) => math.positions[id]);
      return {
        full: cleared.length === 10,
        areas: cleared.map((id) => ({
          id,
          x: math.positions[id][0],
          y: math.positions[id][1],
          rx: 235,
          ry: 210,
        })),
      };
    }
    if (layer === "island" && subject === "C") {
      const cleared = ids.filter((id) => chemistry.positions[id]);
      return {
        full: cleared.length === 10,
        areas: cleared.map((id) => ({
          id,
          x: chemistry.positions[id][0],
          y: chemistry.positions[id][1],
          rx: 235,
          ry: 210,
        })),
      };
    }
    const subjects = layer === "world" ? ["P", "M", "C"] : [subject];
    const areas = subjects.flatMap((s) => {
      const count = ids.filter((id) => id.startsWith(s)).length,
        terrain = worldPortals[s]?.terrain;
      if (!count || !terrain) return [];
      const { x, y } = terrain;
      const extent = worldPortals[s].colorExtent;
      return [{
        id: s, x, y,
        rx: 85 + (extent.rx - 85) * count / 10,
        ry: 65 + (extent.ry - 65) * count / 10,
      }];
    });
    return {
      full:
        layer === "world"
          ? ids.length === 30
          : ids.filter((id) => id.startsWith(subject)).length === 10,
      areas,
    };
  }

  const api = {
    world,
    physics,
    math,
    chemistry,
    worldPortals,
    fogAreas,
    colorAreas,
    isRevealed,
    nextLandmark,
  };

  if (typeof window !== "undefined") window.AtlasExploration = api;
  if (typeof module !== "undefined") module.exports = api;
})();
