/* Original code-drawn pixel scenery for Math Island. */
(() => {
  const r = (x, y, w, h, c, extra = "") =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" ${extra}/>`;
  const line = (points, c, w = 2, extra = "") =>
    `<polyline points="${points}" fill="none" stroke="${c}" stroke-width="${w}" ${extra}/>`;

  const skin = "#d7ab7b",
    ink = "#181713",
    gold = "#edb860",
    stone = "#4b4857";

  function figure(id, variant = 0) {
    const n = Number(id.slice(1));
    const hair = [1, 2, 7].includes(n) ? "#c6c2ab" : "#433a4f";
    const coat =
      variant === 1
        ? "#735c94"
        : variant === 2
          ? "#5b7894"
          : "#665778";

    let s =
      r(9, 30, 7, 6, ink) +
      r(21, 30, 7, 6, ink) +
      r(9, 19, 19, 11, coat) +
      r(6, 21, 4, 9, coat) +
      r(28, 21, 4, 9, coat) +
      r(12, 7, 14, 13, skin) +
      r(10, 4, 18, 5, hair) +
      r(9, 8, 4, 9, hair) +
      r(26, 8, 3, 9, hair) +
      r(15, 12, 2, 2, ink) +
      r(23, 12, 2, 2, ink) +
      r(18, 17, 5, 2, "#ac7654") +
      r(17, 20, 5, 5, "#d8c9a5");

    if ([1, 2, 7].includes(n)) {
      s += r(13, 17, 13, 7, hair) + r(16, 23, 7, 3, hair);
    }
    if (n === 9) {
      s += r(7, 6, 24, 15, "#2a2833"); // Leibniz wig
    }
    if (n === 10) {
      s += r(11, 2, 16, 6, "#3a3045"); // Gauss bonnet
    }
    return s;
  }

  function portrait(id, variant = 0) {
    return `<svg class="px-portrait" viewBox="0 0 38 38" role="img" aria-label="数学家像素人物" shape-rendering="crispEdges">${figure(id, variant)}</svg>`;
  }

  function building(x, y, w, h, mode = 0) {
    let s =
      r(x, y, w, h, "#2b2736") +
      r(x + 3, y + 4, w - 6, h - 4, stone) +
      r(x - 4, y - 6, w + 8, 7, "#635873") +
      r(x + 4, y - 11, w - 8, 5, "#524761");
    for (let j = 0; j < Math.floor(w / 18); j++)
      s += r(x + 9 + j * 18, y + 12, 6, 9, mode ? gold : "#9d90b5");
    s += r(x + w / 2 - 6, y + h - 20, 12, 20, "#1c1824");
    return s;
  }

  function scene(id, { result = null, round = 0 } = {}) {
    const n = Number(id.slice(1));
    let s = r(0, 0, 640, 230, "#191624");
    for (let i = 0; i < 48; i++)
      s += r(
        (i * 97 + 23) % 640,
        (i * i * 19 + 7) % 115,
        i % 7 ? 1 : 2,
        i % 7 ? 1 : 2,
        i % 4 ? "#70648c" : "#edb8ff",
      );

    s += `<path d="M0 146V124H35V108H70V90H110V110H135V128H170V145H230V132H270V105H310V92H340V118H370V130H410V108H445V88H470V108H510V124H555V115H590V132H640V230H0Z" fill="#252033"/>`;
    s += r(0, 176, 640, 54, "#1d1929") + r(0, 176, 640, 4, "#3d3452");

    switch (n) {
      case 1: // 琴弦
        s +=
          building(45, 95, 95, 82, 1) +
          r(180, 140, 280, 14, "#5c4875") +
          line("190,147 450,147", gold, 2) +
          line("190,152 450,152", gold, 1) +
          r(320, 134, 12, 24, "#8a75a6");
        break;
      case 2: // 天平
        s +=
          building(55, 90, 85, 87) +
          r(270, 70, 12, 107, stone) +
          line("190,90 350,90", gold, 4) +
          line("190,90 170,140 210,140 190,90", stone, 1.5) +
          line("350,90 330,140 370,140 350,90", stone, 1.5);
        break;
      case 3: // 坐标
        s +=
          building(50, 95, 80, 82) +
          r(210, 50, 220, 120, "#2a243b") +
          line("210,110 430,110", gold, 2) +
          line("320,50 320,170", gold, 2);
        break;
      case 4: // 函数齿轮
        s +=
          building(45, 95, 90, 82) +
          r(220, 90, 180, 70, "#3a3250") +
          line("170,125 220,125", gold, 4) +
          line("400,125 450,125", gold, 4);
        break;
      case 5: // 抛物线桥
        s +=
          r(160, 110, 40, 67, stone) +
          r(440, 110, 40, 67, stone) +
          line("160,110 200,90 250,75 320,68 390,75 440,90 480,110", gold, 4);
        break;
      default:
        s += building(60, 95, 100, 82);
        break;
    }

    s += `<g transform="translate(100 146) scale(.9)">${figure(id)}</g>`;
    s += r(0, 226, 640, 4, "#5c4f73");
    if (result)
      s +=
        r(570, 15, 55, 18, result.success ? "#4a7a60" : "#8c5545") +
        `<text x="597" y="27" text-anchor="middle" fill="#eee4cf" font-size="8" font-family="monospace">${result.success ? "RESOLVED" : "RETRY"}</text>`;

    return `<svg class="px-scene" viewBox="0 0 640 230" role="img" aria-label="数学岛像素场景" shape-rendering="crispEdges">${s}</svg>`;
  }

  window.AtlasMathPixelArt = { portrait, scene };
})();
