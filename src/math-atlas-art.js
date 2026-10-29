/* Full-color mathematical plates and themes for Math Island. */
(() => {
  const themes = {
    M01: {
      label: "琴弦与对角线",
      category: "数与运算",
      accent: "#8565b5",
      wash: "#ece5f5",
      paper: "#faf7fd",
      formula: "√2 ∉ ℚ",
      symbol: "ratio",
    },
    M02: {
      label: "天平手稿",
      category: "未知量与方程",
      accent: "#9c7248",
      wash: "#f5ece3",
      paper: "#fdfbf7",
      formula: "ax + b = c",
      symbol: "balance",
    },
    M03: {
      label: "正交测绘网格",
      category: "坐标",
      accent: "#5679a8",
      wash: "#e3ecf8",
      paper: "#f7faff",
      formula: "P = (x, y)",
      symbol: "grid",
    },
    M04: {
      label: "机器映射齿轮图",
      category: "函数",
      accent: "#6c8c5d",
      wash: "#e7f0e3",
      paper: "#f8fcf7",
      formula: "y = f(x)",
      symbol: "mapping",
    },
    M05: {
      label: "抛物线大桥图样",
      category: "二次函数",
      accent: "#b07357",
      wash: "#f7eee8",
      paper: "#fefaf8",
      formula: "y = a(x−h)² + k",
      symbol: "parabola",
    },
    M06: {
      label: "镜面与变换群",
      category: "图形变换",
      accent: "#996b94",
      wash: "#f4e9f3",
      paper: "#fdf8fc",
      formula: "S' = s² · S",
      symbol: "symmetry",
    },
    M07: {
      label: "几何公理回廊",
      category: "几何关系",
      accent: "#5b8782",
      wash: "#e4f0ee",
      paper: "#f7fcfb",
      formula: "a² + b² = c²",
      symbol: "compass",
    },
    M08: {
      label: "激流航向航路图",
      category: "向量表示",
      accent: "#80709b",
      wash: "#eeeaf5",
      paper: "#faf8fd",
      formula: "v⃗ = v⃗₁ + v⃗₂",
      symbol: "vector",
    },
    M09: {
      label: "滴漏与切线图谱",
      category: "变化率",
      accent: "#4d7e91",
      wash: "#e1eef4",
      paper: "#f5fafd",
      formula: "dy/dx = lim Δy/Δx",
      symbol: "tangent",
    },
    M10: {
      label: "天体轨道测绘板",
      category: "数学建模",
      accent: "#786596",
      wash: "#eee8f7",
      paper: "#faf7fe",
      formula: "min ∑(yᵢ − f(xᵢ))²",
      symbol: "orbit",
    },
  };

  const esc = (v) =>
    String(v).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );

  function emblem(id) {
    const t = themes[id] || themes.M01;
    const marks = {
      ratio: "M6 22H38M12 12V32M26 12V32M36 12V32",
      balance: "M22 6V38M8 14H36M8 14L4 26H16ZM36 14L32 26H44Z",
      grid: "M6 22H38M22 6V38M12 12A3 3 0 1 1 12 18A3 3 0 1 1 12 12M30 14L34 10",
      mapping: "M8 14H24M24 14L18 8M24 14L18 20M8 30H36M36 30L30 24M36 30L30 36",
      parabola: "M6 34Q22 8 38 34M22 8V38",
      symmetry: "M22 6V38M10 14L18 22L10 30ZM34 14L26 22L34 30Z",
      compass: "M22 8L10 36M22 8L34 36M14 26H30M22 8A3 3 0 1 1 22 14A3 3 0 1 1 22 8",
      vector: "M8 32L34 12M34 12H22M34 12V24M8 32H34M34 32V12",
      tangent: "M8 34Q20 30 36 10M6 22L38 16",
      orbit: "M22 22A16 8 30 1 1 22 21.9M22 22A4 4 0 1 1 22 21.9",
    };
    return `<svg class="atlas-emblem" viewBox="0 0 44 44" aria-hidden="true"><path d="${marks[t.symbol] || marks.ratio}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function plate(id) {
    const t = themes[id] || themes.M01;
    return `<div class="atlas-plate" style="--plate-accent:${t.accent};--plate-wash:${t.wash};--plate-bg:${t.paper}">
      <div class="plate-frame">
        <header class="plate-header">
          <span class="plate-symbol">${emblem(id)}</span>
          <div>
            <span class="plate-category">${esc(t.category)}</span>
            <h3 class="plate-title">${esc(t.label)}</h3>
          </div>
          <code class="plate-formula">${esc(t.formula)}</code>
        </header>
      </div>
    </div>`;
  }

  function scene(id, opts = {}) {
    if (typeof window !== "undefined" && window.AtlasMathPixelWorlds?.scene) {
      return window.AtlasMathPixelWorlds.scene(id, opts);
    }
    return plate(id);
  }

  const api = { themes, emblem, plate, scene };

  if (typeof window !== "undefined") window.AtlasMathAtlasArt = api;
  if (typeof module !== "undefined") module.exports = api;
})();
