/* Mathematical instruments, drawn in the same pixel world as the island. */
(() => {
  const A = window.AtlasMathPixelArt,
    M = window.AtlasMathModels;
  const ink = "#f6eedb",
    mint = "#9ed8b8",
    risk = "#e9a38f";
  const r = (x, y, w, h, c, extra = "") =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" ${extra}/>`;
  const path = (d, c, w = 2, extra = "") =>
    `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" ${extra}/>`;
  const txt = (x, y, s, c = ink, z = 14) =>
    `<text x="${x}" y="${y}" fill="${c}" font-size="${z}" font-family="Consolas, Microsoft YaHei, monospace">${s}</text>`;
  const dot = (x, y, c, z = 6, extra = "") =>
    `<circle cx="${x}" cy="${y}" r="${z}" fill="${c}" ${extra}/>`;
  const poly = (fn, a, b, project) =>
    Array.from({ length: 81 }, (_, i) => {
      const x = a + ((b - a) * i) / 80,
        [sx, sy] = project(x, fn(x));
      return `${i ? "L" : "M"}${sx.toFixed(2)} ${sy.toFixed(2)}`;
    }).join(" ");
  const handle = (x, y, key, c) =>
    dot(
      x,
      y,
      c,
      9,
      `data-drag="${key}" tabindex="0" role="button" aria-label="拖动调节；也可使用右侧滑块" stroke="${ink}" stroke-width="2"`,
    );
  function grid(x, y, cols, rows, u, t) {
    let s = "";
    for (let i = 0; i <= cols; i++)
      s += path(
        `M${x + i * u} ${y - rows * u}V${y}`,
        t.far,
        1,
        'opacity=".45"',
      );
    for (let j = 0; j <= rows; j++)
      s += path(
        `M${x} ${y - j * u}H${x + cols * u}`,
        t.far,
        1,
        'opacity=".45"',
      );
    return s + path(`M${x} ${y - rows * u}V${y}H${x + cols * u}`, t.muted, 2);
  }
  function arrow(x, y, dx, dy, c, label = "") {
    const a = Math.atan2(dy, dx),
      ex = x + dx,
      ey = y + dy;
    return (
      path(`M${x} ${y}L${ex} ${ey}`, c, 3) +
      `<polygon points="${ex},${ey} ${ex - 10 * Math.cos(a - 0.45)},${ey - 10 * Math.sin(a - 0.45)} ${ex - 10 * Math.cos(a + 0.45)},${ey - 10 * Math.sin(a + 0.45)}" fill="${c}"/>` +
      (label ? txt(ex + 8, ey - 8, label, c, 12) : "")
    );
  }
  A.scene = function (
    id,
    {
      round = 0,
      params = {},
      interactive = false,
      instrumentOnly = false,
    } = {},
  ) {
    const t = A.themes[id],
      second = round === 1,
      p = window.AtlasMathScenarios.cleanParams(id, Math.min(round, 1), params),
      q = M.evaluate(id, p, Math.min(round, 1));
    let s = "",
      hint = "拖动滑块，观察变化";
    switch (id) {
      case "M01":
        if (!second) {
          const [a, b] = q.ratio.split(":").map(Number),
            length = (330 * a) / b;
          s =
            r(145, 147, 475, 135, "#8c694c") +
            r(156, 160, 452, 108, "#bb9867") +
            r(177, 175, 412, 78, "#30283a") +
            r(183, 165, 8, 103, t.accent) +
            r(513, 165, 8, 103, t.accent);
          s +=
            path(
              "M187 190H517",
              t.muted,
              3,
              'data-live-string="reference" data-length="330"',
            ) +
            path(
              `M187 235H${187 + length}`,
              t.accent,
              3,
              `data-live-string="variable" data-length="${length}"`,
            ) +
            r(184 + length, 221, 7, 28, t.accent);
          s +=
            txt(
              150,
              111,
              "相同材质、张力与线密度 · 弦长越短，基频越高",
              t.muted,
              13,
            ) +
            txt(155, 322, `弦长比 ${a}:${b}　频率比 ${b}:${a}`, t.accent, 22) +
            txt(
              155,
              359,
              "把观察带到下一幕：所有长度都能写成分数吗？",
              t.muted,
              13,
            );
          hint = "点击「拨弦」，试听两根弦的基频";
        } else {
          s =
            r(147, 133, 158, 158, t.panel) +
            path("M147 133H305V291H147Z", t.muted, 3) +
            path("M147 291L305 133", t.accent, 4) +
            txt(217, 315, "1", t.muted, 16) +
            txt(125, 217, "1", t.muted, 16) +
            txt(214, 206, "√2", t.accent, 23);
          const target = 440 + (Math.SQRT2 - 1.38) * 1500,
            x = 440 + (q.val - 1.38) * 1500;
          s +=
            path("M430 237H682", t.muted, 2) +
            path(`M${target} 184V264`, mint, 2, 'stroke-dasharray="4 4"') +
            dot(x, 237, t.accent, 7) +
            txt(430, 146, `${q.val.toFixed(6)}²`, t.accent, 23) +
            txt(430, 180, `= ${(q.val * q.val).toFixed(6)}`, t.muted, 18) +
            txt(430, 310, `残差 ${q.err.toFixed(6)}`, t.accent, 17) +
            txt(
              147,
              362,
              "有限次逼近是线索；无理性还需要逻辑证明。",
              t.muted,
              13,
            );
          hint = "比较逼近分数与对角线：更接近，不等于相等";
        }
        break;
      case "M02": {
        s =
          r(389, 153, 14, 173, "#ad875d") +
          `<polygon points="340,339 450,339 410,316 384,316" fill="#ad875d"/>` +
          path("M205 163H590", t.accent, 7) +
          dot(396, 163, t.accent, 9) +
          path("M225 167V247M190 247H295M570 167V247M525 247H620", t.muted, 3);
        if (!second) {
          const tokens = (x, bags, weights) => {
            let v = "";
            for (let i = 0; i < Math.max(0, bags); i++)
              v +=
                r(x + i * 33, 208, 26, 28, "#cb9b69") +
                txt(x + 8 + i * 33, 228, "x", t.paper, 17);
            for (let i = 0; i < Math.max(0, weights); i++)
              v += r(x + i * 11, 237, 8, 10, t.accent);
            return v;
          };
          s +=
            tokens(210, q.leftPouches, q.leftWeights) +
            tokens(539, q.rightPouches, q.rightWeights) +
            txt(
              155,
              115,
              q.validRemoval
                ? `${q.leftPouches}x + ${q.leftWeights} = ${q.rightPouches}x + ${q.rightWeights}`
                : "右盘只有 1 包，不能两边各拿掉 2 包。",
              q.validRemoval ? t.accent : risk,
              19,
            ) +
            txt(
              160,
              373,
              "两端施加相同操作，保持等价，再把未知量单独留下。",
              t.muted,
              13,
            );
        } else
          s +=
            txt(170, 115, "3x + 5 = 26", t.accent, 23) +
            txt(
              180,
              225,
              q.solved ? "x" : q.reduced ? "3x" : "x + 5/3",
              t.accent,
              q.solved || q.reduced ? 29 : 23,
            ) +
            txt(
              540,
              225,
              q.solved ? "7" : q.reduced ? "21" : "26/3",
              t.accent,
              28,
            ) +
            txt(
              170,
              374,
              q.solved
                ? "两边减 5 → 两边除以 3 → x = 7"
                : "等价变形还没有结束，继续把 x 单独留下。",
              t.muted,
              14,
            );
        hint = "天平是一份等式：不能只改一边";
        break;
      }
      case "M03": {
        s = grid(225, 352, 8, 7, 36, t);
        for (let i = 0; i <= 8; i++)
          s += txt(220 + 36 * i, 375, i, t.muted, 11);
        for (let i = 1; i <= 7; i++)
          s += txt(202, 356 - 36 * i, i, t.muted, 11);
        if (!second) {
          const x = 225 + 36 * q.x,
            y = 352 - 36 * q.y;
          s +=
            dot(
              369,
              244,
              "none",
              13,
              `stroke="${mint}" stroke-width="2" stroke-dasharray="3 3"`,
            ) +
            txt(390, 249, "目标 (4,3)", mint, 14) +
            path(`M225 ${y}H${x}V352`, t.accent, 1, 'stroke-dasharray="4 4"') +
            handle(x, y, "coordinate", t.accent) +
            txt(x + 14, y - 14, `(${q.x},${q.y})`, t.accent, 17);
          hint = "直接拖动坐标点；先横向 x，再纵向 y";
        } else {
          s += path(
            `M225 352L${225 + Math.min(8, 7 / Math.max(0.01, q.slope)) * 36} ${352 - Math.min(7, 8 * q.slope) * 36}`,
            t.accent,
            3,
          );
          for (const [x, y] of [
            [1, 2],
            [3, 6],
          ])
            s +=
              dot(225 + x * 36, 352 - y * 36, mint, 6) +
              txt(237 + x * 36, 348 - y * 36, `(${x},${y})`, t.muted, 12);
          s += txt(556, 136, `y = ${q.slope}x`, t.accent, 22);
          hint = "调节斜率，让航线同时通过两个航标";
        }
        break;
      }
      case "M04":
        if (!second) {
          s =
            r(300, 120, 195, 167, t.panel) +
            r(314, 134, 167, 139, "#ffffff0b") +
            txt(338, 179, `× ${q.k}`, t.accent, 28) +
            txt(338, 232, `+ ${q.b}`, t.accent, 28);
          for (let i = 0; i < 3; i++)
            s +=
              txt(164, 155 + i * 66, [1, 3, 5][i], t.muted, 24) +
              arrow(205, 146 + i * 66, 78, 0, t.muted) +
              arrow(511, 146 + i * 66, 58, 0, t.accent) +
              txt(593, 155 + i * 66, q.outputs[i].toFixed(1), t.accent, 23) +
              txt(654, 155 + i * 66, `/ ${[3, 7, 11][i]}`, t.muted, 14);
          s +=
            txt(172, 355, "输入", t.muted, 13) +
            txt(327, 321, "f(x) = kx + b", t.accent, 19) +
            txt(578, 355, "输出 / 目标", t.muted, 13);
        } else {
          const pairs = q.singleValued
            ? [
                [-2, 4],
                [0, 0],
                [2, 4],
              ]
            : [
                [4, 2],
                [4, -2],
                [0, 0],
              ];
          pairs.forEach(
            ([x, y], i) =>
              (s +=
                txt(220, 155 + i * 66, x, t.muted, 25) +
                arrow(
                  270,
                  146 + i * 66,
                  240,
                  0,
                  q.singleValued ? t.accent : risk,
                ) +
                txt(565, 155 + i * 66, y, t.accent, 25)),
          );
          s += txt(
            170,
            358,
            q.singleValued
              ? "不同输入可以得到同一个输出：仍然是函数。"
              : "输入 4 同时指向 2 和 −2：不满足单值性。",
            t.muted,
            14,
          );
        }
        hint = "把规则当成机器：输入变化，输出如何响应？";
        break;
      case "M05": {
        const project = (x, y) => [150 + 42 * x, 370 - 40 * y];
        s =
          r(150, 370, 505, 18, "#487c8a") +
          r(112, 337, 40, 50, t.far) +
          r(654, 337, 40, 50, t.far) +
          r(
            276,
            230,
            252,
            140,
            "#8fd6bd12",
            `stroke="${mint}" stroke-dasharray="5 5"`,
          ) +
          txt(289, 256, "6 m × 3.5 m 通行区", t.muted, 13);
        s +=
          path(
            poly((x) => q.a * (x - q.h) ** 2 + q.k, 0, 12, project),
            t.accent,
            7,
            'data-live-key="arch"',
          ) +
          dot(150, 350, mint, 6) +
          dot(654, 350, mint, 6) +
          (second
            ? dot(...project(q.h, q.k), t.accent, 6)
            : handle(...project(q.h, q.k), "vertex", t.accent)) +
          txt(149, 111, `y = ${q.a}(x − ${q.h})² + ${q.k}`, t.accent, 20);
        hint = second
          ? "端点仍须落在桥基；这次再检查通行区"
          : "直接拖动顶点，或调节开口系数";
        break;
      }
      case "M06": {
        s = grid(180, 350, 14, 8, 30, t);
        const points = (sx, sy, rot, scale) =>
          [
            [0, 0],
            [4, 0],
            [0, 3],
          ]
            .map(([x, y]) => {
              const a = (rot * Math.PI) / 180;
              return [
                300 + 30 * (sx + scale * (x * Math.cos(a) + y * Math.sin(a))),
                260 - 30 * (sy + scale * (-x * Math.sin(a) + y * Math.cos(a))),
              ].join(",");
            })
            .join(" ");
        s += `<polygon points="${points(0, 0, 0, 1)}" fill="${t.far}55" stroke="${t.muted}" stroke-dasharray="4 4" stroke-width="2"/>`;
        if (!second)
          s += `<polygon points="${points(3, 2, 90, 1)}" fill="none" stroke="${mint}" stroke-dasharray="5 5" stroke-width="3"/>`;
        s += `<polygon points="${points(second ? 0 : q.sx, second ? 0 : q.sy, second ? 0 : q.rot, second ? q.s : 1)}" fill="${t.accent}55" stroke="${t.accent}" stroke-width="3" data-live-key="moving-shape"/>`;
        if (!second)
          s += handle(300 + q.sx * 30, 260 - q.sy * 30, "transform", t.accent);
        s += txt(
          173,
          109,
          second
            ? `长度 × ${q.s}　面积 × ${q.areaRatio.toFixed(2)}`
            : `顺时针 ${q.rot}°，再平移 (${q.sx},${q.sy})`,
          t.accent,
          19,
        );
        hint = second
          ? "比较长度与面积：它们不是按同一倍率增长"
          : "拖动锚点平移图形；旋转后与虚线重合";
        break;
      }
      case "M07":
        if (!second) {
          const tri = q.isTri;
          s = `<polygon data-live-frame="${tri ? "triangle" : "quad"}" points="${tri ? "245,310 540,310 390,128" : "230,310 525,310 570,150 275,150"}" fill="${t.far}55" stroke="${t.accent}" stroke-width="6"/>`;
          (tri
            ? [
                [245, 310],
                [540, 310],
                [390, 128],
              ]
            : [
                [230, 310],
                [525, 310],
                [570, 150],
                [275, 150],
              ]
          ).forEach(
            ([x, y], i) =>
              (s += dot(x, y, t.accent, 8, `data-frame-joint="${i}"`)),
          );
          s +=
            txt(345, 241, tri ? "180°" : "360°", t.accent, 30) +
            txt(
              200,
              363,
              tri
                ? "固定三边长度，非退化三角形的形状被确定。"
                : "只固定四条边，四边形的角度仍然可以改变。",
              t.muted,
              14,
            );
        } else {
          [q.a, q.b, q.c].forEach((side, i) => {
            const x = 150 + i * 185,
              y = 158,
              u = 18;
            s += r(
              x,
              y,
              side * u,
              side * u,
              i === 2 ? "#8fd6bd33" : `${t.accent}44`,
            );
            for (let k = 0; k <= side; k++)
              s += path(
                `M${x + k * u} ${y}V${y + side * u}M${x} ${y + k * u}H${x + side * u}`,
                i === 2 ? mint : t.accent,
                1,
              );
            s += txt(x, y - 18, `${side}² = ${side * side}`, t.accent, 21);
          });
          s +=
            txt(
              174,
              341,
              `${q.a * q.a} + ${q.b * q.b} ${q.pythagorean ? "=" : "≠"} ${q.c * q.c}`,
              q.pythagorean ? mint : risk,
              28,
            ) + txt(174, 376, "勾股面积关系用于直角三角形。", t.muted, 14);
        }
        hint = "比较结构与面积，寻找图形中的不变量";
        break;
      case "M08": {
        s =
          r(150, 125, 500, 230, "#24566a") +
          r(150, 111, 500, 14, "#92bba0") +
          r(150, 355, 500, 14, "#92bba0");
        for (let i = 0; i < 7; i++)
          s += path(
            `M165 ${143 + i * 30}h460`,
            "#6ba7b566",
            2,
            'class="math-water-line" stroke-dasharray="18 18"',
          );
        const rad = (q.angle * Math.PI) / 180;
        s +=
          path("M340 125V355", t.muted, 1, 'stroke-dasharray="5 5"') +
          arrow(340, 330, q.flow * 24, 0, "#e5b4a0", "水流") +
          arrow(
            340,
            330,
            q.speed * Math.cos(rad) * 24,
            -q.speed * Math.sin(rad) * 24,
            t.muted,
            "船速",
          ) +
          arrow(340, 330, q.vx * 24, -q.vy * 24, t.accent, "合速度");
        s +=
          `<g data-live-key="boat" data-live-boat="true">${r(328, 320, 25, 13, t.accent)}<path d="M324 333h34l-7 9h-20Z" fill="#8b634a"/></g>` +
          handle(
            340 + q.speed * Math.cos(rad) * 24,
            330 - q.speed * Math.sin(rad) * 24,
            "heading",
            t.muted,
          ) +
          txt(
            169,
            94,
            second
              ? "保持船速 5 m/s，寻找最快过河方向"
              : "水流向东 3 m/s · 目标：正对岸码头",
            t.muted,
            13,
          );
        hint = "拖动船速箭头的端点，观察合速度与航迹";
        break;
      }
      case "M09": {
        const X = (x) => 185 + x * 14,
          Y = (y) => 360 - y * 2.3,
          fn = (x) => 100 - 8 * x + 0.2 * x * x,
          at = second ? q.zeroSlopeT : 10,
          slope = -8 + 0.4 * at;
        s =
          grid(185, 360, 16, 12, 25, t) +
          path(
            poly(fn, 0, 30, (x, y) => [X(x), Y(y)]),
            t.muted,
            3,
          ) +
          path(
            `M${X(at) - 70} ${Y(fn(at)) + (slope * 70 * 2.3) / 14}L${X(at) + 70} ${Y(fn(at)) - (slope * 70 * 2.3) / 14}`,
            mint,
            3,
          );
        if (!second)
          s +=
            path(
              `M${X(10)} ${Y(fn(10))}L${X(10 + q.dt)} ${Y(fn(10 + q.dt))}`,
              t.accent,
              4,
            ) + dot(X(10 + q.dt), Y(fn(10 + q.dt)), t.accent, 6);
        s +=
          dot(X(at), Y(fn(at)), t.accent, 7) +
          txt(
            191,
            108,
            second
              ? `t = ${at}　h′(t) = ${slope.toFixed(2)}`
              : `Δt = ${q.dt}　割线 ${q.avgSlope.toFixed(3)}　切线 −4`,
            t.accent,
            19,
          ) +
          txt(192, 389, "h(t) = 100 − 8t + 0.2t² · 示意记录函数", t.muted, 12);
        hint = "缩小时间间隔，观察割线怎样逼近切线";
        break;
      }
      case "M10": {
        const X = (x) => 175 + x * 16,
          Y = (y) => 360 - y * 9;
        s =
          grid(175, 360, 20, 12, 25, t) +
          path(
            poly(
              (x) => q.a * x * x + q.b * x + q.c,
              0,
              30,
              (x, y) => [X(x), Y(y)],
            ),
            t.accent,
            3,
          );
        for (const [x, y] of [
          [0, 15.2],
          [10, 8.1],
          [20, 11],
        ])
          s +=
            path(
              `M${X(x)} ${Y(y)}V${Y(q.a * x * x + q.b * x + q.c)}`,
              risk,
              2,
            ) + dot(X(x), Y(y), "#f0d598", 6);
        if (second)
          s +=
            dot(X(q.predT), Y(q.predY), t.accent, 8, 'class="math-star"') +
            dot(X(24), Y(15), "none", 13, `stroke="${mint}" stroke-width="2"`) +
            txt(455, 123, `预测 ${q.predY.toFixed(2)}°`, t.accent, 19);
        s +=
          txt(
            190,
            95,
            second
              ? "第 24 天的独立观测：15°"
              : "残差是观测点与曲线之间的竖直距离",
            t.muted,
            13,
          ) +
          txt(
            181,
            389,
            "教学用二次近似 · 不是谷神星的真实轨道解算",
            t.muted,
            12,
          );
        hint = "减小残差，再用没有参与拟合的数据检验预测";
        break;
      }
    }
    let background =
      r(0, 0, 800, 440, t.sky) +
      `<path d="M0 180h80v-35h80v45h70v-30h95v35h75v-45h90v28h80v-40h80v32h80v270H0Z" fill="${t.far}" opacity=".45"/>` +
      r(0, 385, 800, 55, t.ground);
    for (let i = 0; i < 18; i++)
      background += r(
        (i * 83 + 12) % 800,
        55 + ((i * 31) % 270),
        2,
        2,
        t.accent,
        'opacity=".25"',
      );
    background +=
      r(80, 68, 640, 340, t.paper) + path("M80 68H720V408H80Z", t.far, 2);
    const clipId = `math-instrument-${id}-${interactive ? "live" : "preview"}`;
    if (!interactive)
      s = s.replace(
        / data-drag="[^"]*" tabindex="0" role="button" aria-label="[^"]*"/g,
        "",
      );
    if (instrumentOnly)
      return `<svg class="subject-instrument math-px-scene" data-math-board="${id}" data-round="${round}" viewBox="0 0 800 440" role="img" aria-label="${hint}" shape-rendering="crispEdges">${s}</svg>`;
    return `<svg class="px-scene math-px-scene" data-math-board="${id}" data-round="${round}" viewBox="0 0 800 440" role="img" aria-label="${t.label}：${hint}" shape-rendering="crispEdges"><defs><clipPath id="${clipId}"><rect x="82" y="70" width="636" height="335"/></clipPath></defs>${background}<g clip-path="url(#${clipId})">${s}</g>${txt(25, 34, hint, t.accent, 14)}${txt(25, 426, "MATHEMATICAL PLAYGROUND / " + id, t.muted, 10)}</svg>`;
  };
})();
