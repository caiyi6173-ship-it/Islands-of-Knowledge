/* Original code-drawn pixel scenery. No remote image or font dependency. */
(() => {
  const r = (x, y, w, h, c, extra = "") =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" ${extra}/>`;
  const line = (points, c, w = 2, extra = "") =>
    `<polyline points="${points}" fill="none" stroke="${c}" stroke-width="${w}" ${extra}/>`;
  const skin = "#d7ab7b",
    ink = "#181713",
    gold = "#edb860",
    teal = "#82b2a0",
    stone = "#575647";
  function figure(id, variant = 0) {
    const n = Number(id.slice(1)),
      old = [1, 2, 3, 7, 9, 10].includes(n),
      hair = old ? "#c6c2ab" : "#574335",
      coat =
        variant === 1
          ? "#987c4e"
          : variant === 2
            ? "#607f73"
            : n === 8
              ? "#80727b"
              : "#576c70";
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
    if ([1, 2].includes(n)) s += r(13, 17, 13, 7, hair) + r(16, 23, 7, 3, hair);
    if (n === 3) s += r(7, 8, 4, 15, hair) + r(28, 8, 4, 15, hair);
    if (n === 8) s += r(10, 1, 15, 6, hair) + r(13, 25, 11, 9, coat);
    if (n === 9)
      s +=
        r(14, 11, 7, 5, "#cbbd96") +
        r(22, 11, 7, 5, "#cbbd96") +
        r(16, 12, 3, 2, ink) +
        r(24, 12, 3, 2, ink);
    if (n === 10)
      s +=
        r(6, 5, 27, 4, hair) +
        r(8, 2, 22, 3, hair) +
        r(19, 16, 7, 2, "#c6c2ab");
    return s;
  }
  function portrait(id, variant = 0) {
    return `<svg class="px-portrait" viewBox="0 0 38 38" role="img" aria-label="像素人物" shape-rendering="crispEdges">${figure(id, variant)}</svg>`;
  }
  function building(x, y, w, h, mode = 0) {
    let s =
      r(x, y, w, h, "#383a31") +
      r(x + 3, y + 4, w - 6, h - 4, stone) +
      r(x - 4, y - 6, w + 8, 7, "#7b6450") +
      r(x + 4, y - 11, w - 8, 5, "#6b5543");
    for (let j = 0; j < Math.floor(w / 18); j++)
      s += r(x + 9 + j * 18, y + 12, 6, 9, mode ? gold : "#89a499");
    s += r(x + w / 2 - 6, y + h - 20, 12, 20, "#252b26");
    return s;
  }
  function scene(id, { result = null, round = 0 } = {}) {
    const n = Number(id.slice(1));
    let s = r(0, 0, 640, 230, "#1b2424");
    for (let i = 0; i < 44; i++)
      s += r(
        (i * 97 + 19) % 640,
        (i * i * 17 + 11) % 110,
        i % 7 ? 1 : 2,
        i % 7 ? 1 : 2,
        i % 4 ? "#65756b" : "#cdb98a",
      );
    s += r(526, 24, 22, 22, "#d8c9a2") + r(536, 20, 15, 17, "#1b2424");
    s += `<path d="M0 146V128H30V110H65V92H100V112H124V130H158V148H220V136H256V111H294V98H320V121H350V132H398V111H430V90H455V110H494V126H540V117H579V135H640V230H0Z" fill="#2a3934"/>`;
    s += r(0, 176, 640, 54, "#252e28") + r(0, 176, 640, 4, "#4a5140");
    if ([1, 7].includes(n)) {
      s += r(0, 178, 640, 52, "#293d3b");
      for (let i = 0; i < 28; i++)
        s += r(
          (i * 29) % 640,
          185 + ((i * 13) % 42),
          15 + (i % 9),
          2,
          i % 2 ? "#47635a" : "#3a514b",
        );
    }
    switch (n) {
      case 1:
        s +=
          building(44, 102, 87, 75, 1) +
          r(65, 95, 7, 7, gold) +
          r(0, 178, 217, 7, "#927456") +
          r(100, 184, 9, 46, "#6b5640") +
          r(184, 184, 9, 46, "#6b5640");
        s += `<g class="px-bob">${r(284, 179, 172, 9, "#a77e4e")}${r(296, 188, 149, 9, "#775734")}${r(309, 197, 122, 5, "#604a33")}${r(340, 155, 21, 21, gold)}${r(366, 155, 21, 21, "#ae8549")}${round ? r(391, 155, 21, 21, gold) + r(366, 132, 21, 21, "#ad8d60") : ""}${r(376, 74, 5, 78, "#bba17b")}<path d="M381 79V143H430V137H421V123H411V108H399V93H391V79Z" fill="#d7cfac"/></g>`;
        break;
      case 2:
        s +=
          building(462, 74, 54, 103, 1) +
          r(477, 54, 23, 20, "#7b6450") +
          r(483, 60, 11, 11, "#dfc591");
        s += line(
          "113,93 141,93 141,101 169,101 169,109 197,109 197,117 225,117 225,125 253,125 253,133 281,133 281,141 309,141 309,149 337,149 337,157 365,157",
          gold,
          5,
        );
        [148, 232, 365].forEach((x, i) => {
          let y = 100 + i * 28;
          s +=
            r(x, y - 28, 3, 23, stone) +
            r(x - 6, y - 12, 15, 8, gold) +
            r(x - 9, y - 4, 21, 3, gold);
        });
        s +=
          r(120, 83, 8, 8, "#bbc6b0") +
          r(169, 114, 7, 62, "#626047") +
          r(329, 158, 7, 18, "#626047");
        break;
      case 3:
        s += `<circle cx="320" cy="126" r="65" fill="#425e50"/><path d="M266 92h32v14h20v22h-19v20h-21v-14h-20zm78 54h32v13h-12v19h-25v-14h-11v-12Z" fill="#759675"/><circle cx="320" cy="126" r="99" fill="none" stroke="#6f7d65" stroke-dasharray="3 7"/>`;
        s +=
          r(313, 40, 15, 21, "#81765b") +
          r(318, 24, 5, 23, gold) +
          r(323, 23, 22, 6, stone) +
          r(418, 121, 7, 7, gold) +
          building(49, 120, 64, 57);
        break;
      case 4:
        s +=
          building(85, 103, 117, 74, 1) +
          r(296, 76, 6, 100, stone) +
          r(299, 76, 125, 5, stone) +
          r(419, 76, 6, 31, "#b19c73") +
          r(409, 106, 26, 25, "#9f8158");
        s +=
          r(329, 132, 68, 44, "#7a8068") +
          r(335, 138, 56, 30, "#668b7b") +
          r(360, 79, 4, 76, gold) +
          r(343, 152, 38, 4, gold) +
          r(444, 127, 5, 42, "#bdc1a0") +
          r(443, 151, 7, 20, "#bc8155");
        break;
      case 5:
        s +=
          r(109, 116, 20, 34, gold) +
          r(132, 129, 108, 3, "#be9b61") +
          r(242, 78, 9, 99, stone) +
          r(242, 110, 9, 7, "#1b2424") +
          r(242, 139, 9, 7, "#1b2424");
        for (let i = 0; i < 7; i++)
          s +=
            line(`251,114 ${472},${70 + i * 19}`, "#796d4a", 1) +
            line(`251,143 ${472},${70 + i * 19}`, "#68794f", 1);
        s += r(472, 60, 42, 117, "#d1c8a3");
        for (let i = 0; i < 9; i++)
          s += r(477, 67 + i * 12, 32, 4, i % 2 ? "#8c8b72" : "#ddd0a4");
        s += r(488, 120, 12, 2, gold);
        break;
      case 6:
        s +=
          building(57, 108, 90, 69, 1) +
          r(189, 152, 291, 9, "#877352") +
          r(207, 161, 7, 16, stone) +
          r(461, 161, 7, 16, stone);
        for (let i = 0; i < 9; i++) s += r(300 + i * 8, 115, 4, 40, "#bf945b");
        s +=
          r(234, 122, 49, 17, "#ae6d56") +
          r(234, 122, 24, 17, "#739e9a") +
          r(400, 108, 48, 41, stone) +
          r(407, 114, 34, 26, "#d5cba4") +
          line("411,137 424,121", "#9f6047");
        s += line("367,115 387,115 387,96 421,96 421,107", gold);
        break;
      case 7:
        s +=
          building(60, 127, 67, 51, 1) +
          building(498, 127, 67, 51, 1) +
          r(90, 67, 4, 60, gold) +
          r(528, 67, 4, 60, gold);
        for (let i = 0; i < 6; i++)
          s += `<path d="M${115 + i * 53} 76q25 37 0 74" fill="none" stroke="${i % 2 ? "#6b826d" : "#9aa580"}" stroke-width="2" class="px-wave" style="animation-delay:${i * -0.2}s"/>`;
        break;
      case 8:
        s +=
          building(65, 95, 133, 82, 1) +
          r(259, 151, 244, 10, "#8c7955") +
          r(276, 161, 7, 16, stone) +
          r(486, 161, 7, 16, stone);
        [294, 351, 410].forEach((x, i) => {
          s +=
            r(x, 115, 29, 35, "#647c6e") +
            r(x + 5, 110, 19, 5, "#a8aa85") +
            r(x + 5, 132, 19, 11, i === 2 ? "#bba373" : "#8d9680");
        });
        s +=
          r(456, 95, 28, 47, "#716b51") +
          r(464, 82, 12, 14, gold) +
          r(461, 100, 18, 30, "#a6ac89");
        break;
      case 9:
        s +=
          building(59, 104, 79, 73) +
          r(255, 73, 75, 104, "#645442") +
          r(266, 105, 54, 59, "#30281e") +
          r(274, 132, 38, 28, "#b46d39") +
          r(281, 119, 24, 40, gold) +
          r(285, 142, 15, 21, "#f4d991");
        s +=
          r(366, 97, 142, 80, "#717567") +
          r(374, 105, 126, 62, "#202d29") +
          line(
            "381,155 397,145 413,120 429,117 445,132 461,146 481,153",
            gold,
            3,
          ) +
          line("381,155 399,150 420,138 442,119 468,99 486,81", teal, 2);
        break;
      case 10:
        s +=
          r(123, 105, 37, 41, "#6b7467") +
          r(160, 117, 19, 17, gold) +
          line("179,123 314,123", gold, 3) +
          r(315, 88, 13, 84, "#afa085") +
          r(329, 88, 16, 84, "#4f5e54") +
          r(428, 88, 13, 84, "#9c947b");
        s +=
          line("322,172 322,190 435,190 435,172", gold, 2) +
          r(360, 181, 38, 18, "#637264") +
          r(366, 184, 26, 12, "#c1c3a1");
        for (let i = 0; i < 5; i++)
          s += r(353 + i * 13, 111 + (i % 2) * 17, 3, 3, teal);
        s += building(501, 110, 55, 67, 1);
        break;
    }
    s += `<g transform="translate(${n === 1 ? 160 : 70} 146) scale(.9)">${figure(id)}</g>`;
    s += r(0, 226, 640, 4, "#6c664b");
    if (result)
      s +=
        r(576, 15, 47, 17, result.success ? "#476d59" : "#94654a") +
        `<text x="600" y="27" text-anchor="middle" fill="#eee4cf" font-size="8" font-family="monospace">${result.success ? "RECORDED" : "RETRY"}</text>`;
    return `<svg class="px-scene" viewBox="0 0 640 230" role="img" aria-label="物理岛像素场景" shape-rendering="crispEdges">${s}</svg>`;
  }
  window.AtlasPhysicsPixelArt = { portrait, scene };
})();
