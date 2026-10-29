/* Original animated pixel dioramas for Math Island. Mathematical state comes from models. */
(() => {
  const base = window.AtlasMathAtlasArt.themes;

  const directions = [
    [
      "琴弦庭院的清晨",
      "#1e182e",
      "#2d2542",
      "#e6b8ff",
      "#c9bad9",
      "#483c66",
      "#746299",
      "#362a4d",
    ],
    [
      "天平广场的集市",
      "#2e2318",
      "#423425",
      "#ffd18b",
      "#d9c8ba",
      "#66533c",
      "#997e62",
      "#4d3d2a",
    ],
    [
      "测绘天顶台的晨光",
      "#18222e",
      "#253442",
      "#8bd1ff",
      "#bad0d9",
      "#3c5266",
      "#627f99",
      "#2a3b4d",
    ],
    [
      "秩序花园的齿轮声",
      "#182e1e",
      "#25422d",
      "#a6ffb8",
      "#bad9c0",
      "#3c6645",
      "#62996e",
      "#2a4d31",
    ],
    [
      "深谷大桥的暮色",
      "#2e1d18",
      "#422b25",
      "#ffaa8b",
      "#d9c0ba",
      "#66413c",
      "#996962",
      "#4d2e2a",
    ],
    [
      "镜廊秘境的幻影",
      "#2a182e",
      "#3c2542",
      "#ffb8f7",
      "#d6bad9",
      "#5e3c66",
      "#8e6299",
      "#432a4d",
    ],
    [
      "几何回廊的白昼",
      "#182c2e",
      "#253f42",
      "#9efff0",
      "#b9d9d6",
      "#3c6266",
      "#629399",
      "#2a464d",
    ],
    [
      "运河石桥的急流",
      "#1f182e",
      "#2e2542",
      "#d1b8ff",
      "#c2bad9",
      "#4c3c66",
      "#776299",
      "#342a4d",
    ],
    [
      "水钟塔楼的流光",
      "#18282e",
      "#253b42",
      "#8be9ff",
      "#bad4d9",
      "#3c5c66",
      "#628c99",
      "#2a414d",
    ],
    [
      "星空测绘所的穹顶",
      "#1f182e",
      "#2d2542",
      "#ffc6e5",
      "#d9bad0",
      "#4c3c66",
      "#7b6299",
      "#362a4d",
    ],
  ];

  const themes = Object.fromEntries(
    directions.map((v, i) => {
      const id = "M" + String(i + 1).padStart(2, "0");
      const [label, paper, panel, accent, muted, sky, far, ground] = v;
      return [
        id,
        {
          ...base[id],
          label,
          paper,
          panel,
          accent,
          muted,
          sky,
          far,
          ground,
        },
      ];
    }),
  );

  const originalPortrait =
    typeof window !== "undefined" && window.AtlasMathPixelArt?.portrait;
  const portrait = (id, variant = 0) =>
    originalPortrait ? originalPortrait(id, variant) : "";

  const emblem = (id) =>
    typeof window !== "undefined" && window.AtlasMathAtlasArt?.emblem
      ? window.AtlasMathAtlasArt.emblem(id)
      : "";

  const scene = window.AtlasMathPixelArt.scene;

  const api = { themes, scene, portrait, emblem };

  if (typeof window !== "undefined") {
    window.AtlasMathPixelArt = api;
    window.AtlasMathPixelWorlds = api;
  }
  if (typeof module !== "undefined") module.exports = api;
})();
