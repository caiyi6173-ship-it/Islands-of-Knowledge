/* Original animated pixel dioramas. Scientific state comes from the experiment. */
(() => {
  const base = window.AtlasPhysicsAtlasArt.themes;
  const directions = [
    [
      "潮汐港的清晨",
      "#102f3b",
      "#173e49",
      "#f6cc78",
      "#9ddbd1",
      "#87d6d0",
      "#36889a",
      "#245366",
    ],
    [
      "钟楼下的午后",
      "#332b25",
      "#46372d",
      "#f3bb68",
      "#c6c49b",
      "#efca83",
      "#bf815e",
      "#795b43",
    ],
    [
      "万有引力的夜空",
      "#171a35",
      "#252843",
      "#c1a6ff",
      "#b8c8e6",
      "#1c2454",
      "#574d83",
      "#2d355d",
    ],
    [
      "发光的蒸汽工坊",
      "#30242c",
      "#433039",
      "#ffb775",
      "#e6bfa6",
      "#5a4559",
      "#a26b65",
      "#5b3e45",
    ],
    [
      "暮色里的双缝花园",
      "#30203d",
      "#412c50",
      "#efa4df",
      "#d5b9df",
      "#695281",
      "#a36a9c",
      "#453e60",
    ],
    [
      "绿铜色的感应室",
      "#142d30",
      "#203c3e",
      "#87e6c3",
      "#acd6ca",
      "#244d4d",
      "#528b7b",
      "#2d5750",
    ],
    [
      "落日下的信号海峡",
      "#27273d",
      "#36334d",
      "#ffd18b",
      "#cbc3e4",
      "#d5a6a1",
      "#857aa6",
      "#41476b",
    ],
    [
      "翡翠矿石计量所",
      "#19332b",
      "#254538",
      "#bde98a",
      "#c0dac3",
      "#547c68",
      "#83a58a",
      "#355d49",
    ],
    [
      "炉火与光的颗粒",
      "#32232b",
      "#48303a",
      "#ffba6e",
      "#e9c6b3",
      "#3f3452",
      "#846179",
      "#45354c",
    ],
    [
      "紫罗兰光电实验室",
      "#29203b",
      "#3b2d50",
      "#e9d67e",
      "#d1bfdf",
      "#63517e",
      "#9280ac",
      "#45365e",
    ],
  ];
  const themes = Object.fromEntries(
    directions.map((v, i) => {
      const id = "P" + String(i + 1).padStart(2, "0");
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
          ink: "#fff3dd",
          line: panel,
          wash: panel,
          secondary: [
            "#ed947f",
            "#a9c8a0",
            "#81ccda",
            "#86c6b2",
            "#b0d69e",
            "#db9a7a",
            "#a3dad7",
            "#e6b3cd",
            "#bf9bdb",
            "#b69be8",
          ][i],
        },
      ];
    }),
  );
  const r = (x, y, w, h, c, extra = "") =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" ${extra}/>`;
  const path = (d, c, width = 2, extra = "") =>
    `<path d="${d}" fill="none" stroke="${c}" stroke-width="${width}" ${extra}/>`;
  const group = (cls, content, extra = "") =>
    `<g class="${cls}" ${extra}>${content}</g>`;
  const label = (x, y, text, color = "#fff0cf", size = 7) =>
    `<text x="${x}" y="${y}" fill="${color}" font-family="Consolas, monospace" font-size="${size}">${text}</text>`;
  function figure(id, variant) {
    const n = Number(id.slice(1)),
      t = themes[id];
    const hair =
      variant !== undefined
        ? ["#58413b", "#76513c", "#51394c"][variant % 3]
        : n === 8
          ? "#332638"
          : [1, 2, 3, 9, 10].includes(n)
            ? "#e1d7ba"
            : "#4b343a";
    const coat =
      variant === 0
        ? t.accent
        : variant === 1
          ? t.secondary
          : variant === 2
            ? "#d3b4c7"
            : "#719e9b";
    let s =
      r(8, 28, 8, 7, "#26323b") +
      r(21, 28, 8, 7, "#26323b") +
      r(8, 19, 21, 12, coat) +
      r(5, 21, 4, 9, coat) +
      r(29, 21, 4, 9, coat) +
      r(12, 6, 15, 14, "#e2af83") +
      r(10, 3, 19, 5, hair) +
      r(10, 8, 3, 9, hair) +
      r(26, 8, 3, 9, hair) +
      r(15, 11, 2, 2, "#28313a") +
      r(23, 11, 2, 2, "#28313a") +
      r(18, 16, 5, 2, "#b27362") +
      r(17, 20, 5, 7, "#f9e3bb");
    if (variant === undefined) {
      if ([1, 2].includes(n))
        s += r(13, 16, 13, 7, hair) + r(16, 22, 7, 3, hair);
      if (n === 3) s += r(7, 7, 4, 17, hair) + r(28, 8, 4, 16, hair);
      if (n === 8) s += r(12, 0, 14, 4, hair) + r(10, 27, 17, 7, coat);
      if (n === 9)
        s += path("M13 10h8v5h-8zM22 10h8v5h-8zM21 12h2", "#3c4653", 1);
      if (n === 10)
        s +=
          r(6, 5, 26, 4, hair) + r(8, 1, 22, 3, hair) + r(18, 15, 8, 2, hair);
    } else if (variant === 1)
      s +=
        r(8, 2, 22, 5, "#e2b168") +
        r(12, 0, 15, 2, "#e2b168") +
        r(14, 25, 9, 7, "#c38969");
    else if (variant === 2)
      s += path("M13 10h8v5h-8zM22 10h8v5h-8zM21 12h2", "#46384a", 1);
    return s;
  }
  function portrait(id, variant) {
    return `<svg class="px-portrait atlas-portrait" viewBox="0 0 38 40" role="img" aria-label="像素人物" shape-rendering="crispEdges">${r(0, 0, 38, 40, themes[id].panel)}${group("px-person-idle", figure(id, variant), 'transform="translate(0 3)"')}</svg>`;
  }
  function cloud(x, y, c, k = 1) {
    return `<g transform="translate(${x} ${y}) scale(${k})">${r(0, 7, 48, 7, c)}${r(8, 0, 18, 10, c)}${r(25, 4, 17, 8, c)}</g>`;
  }
  function tree(x, y, t, k = 1) {
    return `<g transform="translate(${x} ${y}) scale(${k})">${r(12, 22, 5, 30, "#70544a")}${r(2, 7, 26, 23, t.secondary)}${r(7, 0, 16, 9, t.secondary)}${r(0, 19, 30, 9, t.far)}${r(7, 8, 6, 4, t.accent)}</g>`;
  }
  function house(x, y, w, h, t, windows = true) {
    let s =
      r(x, y, w, h, t.ground) +
      r(x + 4, y + 4, w - 8, h - 4, t.far) +
      r(x - 6, y - 5, w + 12, 6, t.ground) +
      r(x + 2, y - 12, w - 4, 7, t.far) +
      r(x + 10, y - 17, w - 20, 6, t.ground) +
      r(x + w / 2 - 8, y + h - 24, 16, 24, t.paper);
    if (windows)
      for (let i = 0; i < Math.floor(w / 22); i++)
        s +=
          r(x + 9 + i * 22, y + 12, 9, 13, t.accent) +
          r(x + 13 + i * 22, y + 12, 2, 13, t.far);
    return s;
  }
  function stars(t) {
    return Array.from({ length: 45 }, (_, i) =>
      r(
        (i * 113 + 19) % 640,
        (i * i * 13 + 7) % 162,
        i % 7 ? 1 : 2,
        i % 7 ? 1 : 2,
        i % 3 ? t.muted : t.accent,
        `class="px-twinkle" style="animation-delay:-${i % 5}s"`,
      ),
    ).join("");
  }
  function scenery(t, n) {
    let s = r(0, 0, 640, 256, t.sky);
    if ([3, 5, 6, 8, 9, 10].includes(n)) s += stars(t);
    else
      s += group(
        "px-clouds",
        cloud(55, 37, "#fff0cf", 1.4) +
          cloud(365, 27, "#ffe7c4", 0.9) +
          cloud(525, 63, "#fff0cf", 0.7),
      );
    if (n !== 6 && n !== 8)
      s +=
        r(522, 32, 26, 26, n === 3 ? "#e8d9ef" : t.accent) +
        r(518, 38, 34, 14, n === 3 ? "#e8d9ef" : t.accent);
    s += `<path d="M0 174V149H32V134H62V113H90V126H125V143H157V160H209V144H246V125H278V144H321V161H373V143H416V118H449V137H483V155H537V137H578V151H609V168H640V256H0Z" fill="${t.far}"/>`;
    s += r(0, 206, 640, 50, t.ground) + r(0, 205, 640, 4, t.secondary);
    for (let i = 0; i < 42; i++)
      s += r(
        (i * 41) % 640,
        217 + ((i * 11) % 35),
        4 + (i % 7),
        2,
        i % 2 ? t.far : t.panel,
      );
    return s;
  }
  function scene(id, { result = null, round = 0, params = null } = {}) {
    const n = Number(id.slice(1)),
      t = themes[id],
      p = params || result?.params || {};
    let s = scenery(t, n);
    const water = () => {
      let out = r(0, 187, 640, 69, "#296f83");
      for (let i = 0; i < 35; i++)
        out += r(
          (i * 43) % 640,
          195 + ((i * 17) % 58),
          12 + (i % 17),
          2,
          i % 3 ? "#4ca4af" : "#94d6c9",
          'class="px-water"',
        );
      return out;
    };
    switch (n) {
      case 1: {
        s +=
          water() +
          house(43, 114, 83, 69, t) +
          r(0, 187, 235, 9, "#b57b59") +
          r(103, 196, 9, 60, "#775248") +
          r(209, 196, 9, 60, "#775248");
        const flat = p.shape === "lump",
          wide = p.shape === "wide",
          failed = p.shape
            ? !window.AtlasPhysicsModels.evaluate(id, {
                ...p,
                cargo: round === 1 ? 4 : 0,
              }).floats
            : false;
        const hull = flat
          ? r(304, 182, 94, 13, "#d7a166")
          : `<path d="M282 182h${wide ? 190 : 154}v7h-7v7h-9v7H304v-7h-10v-7h-12Z" fill="#ac644d"/>${r(294, 181, wide ? 166 : 130, 5, "#efc689")}`;
        const ship =
          hull +
          (flat
            ? ""
            : r(355, 86, 4, 96, "#805349") +
              `<path d="M361 90v77h64v-7h-9v-12h-9v-12h-10v-13h-10v-13h-12V96h-7v-6Z" fill="#fff0c9"/>`) +
          r(317, 160, 18, 20, t.accent) +
          r(339, 160, 18, 20, "#d89761") +
          (round
            ? r(361, 160, 18, 20, t.accent) + r(339, 137, 18, 20, "#dfa96e")
            : "");
        s +=
          group(
            failed ? "sandbox-sinking" : "px-boat",
            ship,
            'data-live-key="ship"',
          ) +
          label(452, 151, "F buoyancy", "#d9fff2") +
          path("M456 174v-16m-4 5 4-5 4 5", "#d9fff2");
        s += group(
          "px-bird",
          path("M240 56h6v3h6v-3h6M280 43h6v3h6v-3h6", "#3b626c", 2),
        );
        break;
      }
      case 2: {
        s +=
          house(459, 90, 58, 116, t) +
          r(473, 57, 30, 33, t.far) +
          r(479, 65, 18, 18, "#fff0cc") +
          path("M488 67v9h6", "#6b5b46");
        s += path(
          "M143 92h28v8h28v8h28v8h28v8h28v8h28v8h28v8h28v8h28v8h28v8h28",
          "#f9d68b",
          5,
        );
        const distances =
          p.layout === "equal"
            ? [1, 2, 3]
            : p.layout === "linear"
              ? [2, 4, 6]
              : [1, 4, 9];
        const bellXs = distances.map((distance) => 147 + distance * 28);
        bellXs.forEach((x, i) => {
          const y = 91 + (x - 143) * 0.29;
          s +=
            r(x, y - 25, 3, 20, "#776243") +
            group(
              "sandbox-bell",
              r(x - 5, y - 12, 14, 10, t.accent) +
                r(x - 8, y - 3, 20, 3, "#ffe5a3"),
              `data-bell-index="${i}"`,
            ) +
            label(x - 1, y - 30, String(distances[i]), "#fff0cf");
        });
        s += r(171, 106, 6, 98, "#85714e") + r(378, 167, 6, 37, "#85714e");
        s += group(
          "sandbox-rolling",
          r(147, 83, 8, 8, "#b9e1da") + r(148, 84, 3, 2, "#f0ffff"),
          'data-live-key="rolling-ball"',
        );
        break;
      }
      case 3: {
        s = r(0, 0, 640, 256, t.sky) + stars(t);
        const q = window.AtlasPhysicsModels.orbit(Number(p.speed) || 1);
        const scale =
          94 / Math.max(1, ...q.path.map(([x, y]) => Math.hypot(x, y)));
        const planet = (0.68 * scale) / 60;
        const planetArt =
          `<path d="M275 96h65v8h16v16h10v48h-10v16h-17v9h-66v-9h-17v-16h-9v-48h10v-16h18Z" fill="#57919f"/>` +
          r(267, 111, 30, 14, "#b1d3a2") +
          r(287, 125, 22, 23, "#b1d3a2") +
          r(325, 154, 23, 12, "#b1d3a2") +
          r(317, 166, 19, 15, "#87bda0");
        s += `<g transform="translate(307 144) scale(${planet.toFixed(3)}) translate(-307 -144)">${planetArt}</g>`;
        const orbitPath = q.path
          .map(
            ([x, y], i) =>
              `${i ? "L" : "M"}${(307 + x * scale).toFixed(1)},${(144 + y * scale).toFixed(1)}`,
          )
          .join(" ");
        s += path(orbitPath, "#8d7cb0", 1, 'stroke-dasharray="3 4"');
        s += group(
          "px-orbit",
          r(-3, -3, 6, 6, "#f5d697") + r(-2, -2, 2, 2, "#fff1c2"),
          `data-live-key="orbit-body" data-orbit-kind="${q.kind}" style="offset-path:path('${orbitPath}');animation-duration:${q.kind === "orbit" ? 9 : 5}s"`,
        );
        s +=
          house(49, 151, 61, 55, t) +
          r(69, 132, 6, 21, "#a8b9cf") +
          r(68, 125, 28, 9, t.accent) +
          label(449, 80, "F = GMm / r^2", "#c5b5f0", 9);
        break;
      }
      case 4: {
        s +=
          house(43, 126, 97, 78, t) +
          r(157, 182, 357, 12, "#c39373") +
          r(174, 194, 9, 29, "#825a52") +
          r(489, 194, 9, 29, "#825a52");
        s +=
          r(234, 73, 7, 108, "#d7ba91") +
          r(234, 73, 175, 7, "#d7ba91") +
          r(403, 78, 3, 52, "#e2bc81");
        const powered = p.connected === true;
        const heatLevel = powered ? (p.insulated ? 30 : 22) : 0;
        s += group(
          powered ? "px-weight" : "",
          r(391, 128, 27, 28, "#b37d65") + r(395, 132, 19, 4, "#e0b698"),
        );
        s +=
          r(276, 145, 73, 37, "#6eb5ad") +
          r(282, 151, 61, 26, "#9bd8c8") +
          r(310, 95, 4, 68, "#f3c278");
        if (p.insulated) s += path("M271 143v43h83v-43", "#eac18b", 5);
        s += `<g class="${powered ? "px-paddle" : ""}" style="transform-origin:312px 162px">${r(291, 159, 42, 6, "#c28c65")}${r(309, 141, 6, 42, "#c28c65")}</g>`;
        s +=
          r(456, 134, 5, 39, "#e6d5be") +
          r(454, 168, 9, 12, "#f08b67") +
          r(456, 174 - heatLevel, 5, heatLevel, "#ff9c67");
        if (powered)
          s += group(
            "px-charge",
            r(291, 157, 4, 5, "#ffcb82") + r(325, 165, 5, 6, "#ffcb82"),
          );
        s +=
          label(435, 116, "DELTA T", "#ffe0be") +
          label(262, 220, "HEAT / SCHEMATIC", "#e6bfa6");
        break;
      }
      case 5: {
        const slitA = 147 - 13 * (p.gap || 1),
          slitB = 147 + 13 * (p.gap || 1);
        const beam = round === 1 ? "#8cb9f1" : "#ffdd96";
        s +=
          tree(37, 138, t, 1.4) +
          tree(551, 146, t, 1.2) +
          r(82, 177, 455, 9, "#ba83a2");
        s +=
          r(113, 137, 18, 28, "#f3d38f") +
          r(134, 147, 105, 5, "#d6b172") +
          r(240, 99, 8, 89, "#c9b5d6") +
          r(240, slitA, 8, 7, t.sky);
        const two = p.slits !== "one";
        if (two) s += r(240, slitB, 8, 7, t.sky);
        s += group(
          "px-light-beam",
          `<path d="M248 ${slitA + 4} 480 93v88Z" fill="${beam}33"/>${two ? `<path d="M248 ${slitB + 4} 480 97v84Z" fill="${beam}22"/>` : ""}`,
        );
        s += r(480, 83, 32, 105, "#e9d9df");
        const fringeSpacing = (9 * (round === 1 ? 0.75 : 1)) / (p.gap || 1);
        for (let i = 0; i < Math.floor(96 / fringeSpacing); i++)
          s += r(
            484,
            88 + i * fringeSpacing,
            24,
            Math.max(2, fringeSpacing * 0.55),
            two
              ? i % 2
                ? "#745b8e"
                : round === 1
                  ? "#aed6f4"
                  : "#ffe6a3"
              : "#dcbf85",
            'class="px-fringe"',
          );
        s += label(
          332,
          73,
          two ? "TWO PATHS / INTERFERENCE" : "ONE APERTURE",
          "#efc5e6",
        );
        const optical = window.AtlasPhysicsModels.evaluate(id, {
          ...p,
          color: round === 1 ? "blue" : "warm",
        });
        s +=
          r(478, 132, 36, 3, optical.dark ? "#87e6c3" : "#efb57e") +
          label(519, 139, "TARGET", "#efc5e6");
        break;
      }
      case 6: {
        s +=
          house(43, 134, 79, 70, t) +
          r(155, 179, 370, 10, "#9e8971") +
          r(173, 189, 8, 31, "#5c7563") +
          r(500, 189, 8, 31, "#5c7563");
        s += path("M343 136h42v-45h77v35M343 168h116v-10", "#c7bc7b", 3);
        for (let i = 0; i < 9; i++)
          s += path(`M${292 + i * 7} 174v-43h4v43`, "#dfad72", 3);
        const moving = !["still", "hold", "coast"].includes(
          p.motion || p.drive,
        );
        s += group(
          moving ? "sandbox-magnet" : "",
          r(212, 142, 53, 20, "#e38a80") +
            r(212, 142, 26, 20, "#7bcbc0") +
            label(218, 156, "N", "#233d3d") +
            label(246, 156, "S", "#5c3134"),
          'data-live-key="magnet"',
        );
        s +=
          r(421, 121, 59, 43, "#d7d6b2") +
          r(428, 127, 45, 29, "#173c3f") +
          path("M433 149h35", "#93bfa4");
        s += group(
          moving ? "sandbox-needle" : "",
          path("M449 149v-17", "#f2c16f", 3),
          'data-live-key="needle" style="transform-origin:449px 149px"',
        );
        if (moving)
          s += group(
            "px-charge",
            r(375, 90, 4, 4, "#bcf4b0") + r(457, 170, 4, 4, "#bcf4b0"),
          );
        s += label(275, 68, "CHANGE / FLUX / CURRENT", "#b5e6cb");
        break;
      }
      case 7: {
        const signal = window.AtlasPhysicsModels.evaluate(id, p, round);
        s += water() + house(47, 144, 77, 46, t) + house(504, 144, 77, 46, t);
        s += path(
          "M85 143V78M78 111h14M78 94h14M539 143V78M532 111h14M532 94h14",
          "#efe0b4",
          3,
        );
        for (let i = 0; i < 6; i++)
          s += group(
            "px-radio-wave",
            path(
              `M${137 + i * 55} 88h7v8h7v12h5v22h-5v12h-7v8h-7`,
              i % 2 ? "#fbd6a4" : "#a0e2d4",
              2,
            ),
            `style="animation-delay:-${i * 0.35}s;animation-duration:${7.5 / (p.frequency || 3)}s"`,
          );
        s +=
          r(520, 158, 25, 14, signal.tuned ? "#b9e8a7" : "#6d6989") +
          label(523, 168, signal.tuned ? p.code || "OK" : "...", "#354a53");
        s += label(249, 56, "NO WIRES. ONE SIGNAL.", "#fff3d2", 8);
        break;
      }
      case 8: {
        s +=
          house(43, 126, 94, 78, t) +
          tree(562, 150, t) +
          r(173, 180, 354, 10, "#a89775") +
          r(190, 190, 8, 27, "#60765a") +
          r(501, 190, 8, 27, "#60765a");
        s += `<path d="M181 169v-21h7v-23h7v-20h17v18h8v18h8v28Z" fill="#a1d9b1"/>${r(197, 112, 6, 55, "#c9f7bd")}`;
        [275, 338, 401].forEach((x, i) => {
          const visible =
            round === 1 ||
            p.protocol === "control" ||
            i === 2 ||
            (i === 1 && p.protocol === "pair");
          s +=
            `<g opacity="${visible ? 1 : 0.25}">` +
            r(x, 139, 33, 40, "#a8c6a0") +
            r(x + 4, 134, 25, 5, "#d4d4ac") +
            r(x + 4, 158, 25, 17, ["#7eaa96", "#b19eb7", "#abce78"][i]) +
            label(
              x + 5,
              152,
              (round === 1 ? ["ORE", "PART", "REPEAT"] : ["BG", "REF", "ORE"])[
                i
              ],
              "#23443c",
            ) +
            "</g>";
        });
        s += group(
          "px-geiger",
          r(452, 104, 41, 61, "#4e7765") +
            r(458, 114, 29, 17, "#d5eb9e") +
            label(
              461,
              126,
              round === 1 ? (p.repeats === 3 ? "3 x" : "1 x") : "056",
              "#244739",
            ) +
            r(460, 140, 5, 5, "#e8c488"),
        );
        for (let i = 0; i < 7; i++)
          s += group(
            "px-radiation",
            r(416 + i * 5, 124 - (i % 3) * 9, 3, 3, t.accent),
            `style="animation-delay:-${i * 0.3}s"`,
          );
        break;
      }
      case 9: {
        s +=
          house(43, 145, 75, 59, t) +
          r(238, 89, 83, 117, "#a56e63") +
          r(248, 115, 63, 91, "#261f30") +
          r(256, 129, 47, 72, "#654151");
        s += group(
          "px-flame",
          r(260, 167, 38, 32, "#ee8551") +
            r(267, 147, 25, 52, "#ffb35e") +
            r(274, 168, 12, 31, "#ffe6a0"),
        );
        s += group(
          "px-smoke",
          r(269, 76, 8, 9, "#9c8293") + r(286, 58, 7, 8, "#9c8293"),
        );
        s +=
          r(383, 100, 142, 100, "#c5b6bd") +
          r(390, 107, 128, 84, "#302c46") +
          path("M399 179h106M399 179v-61", "#82758f");
        const spectrum = window.AtlasPhysicsModels.evaluate(id, p);
        const curve = Array.from({ length: 65 }, (_, i) => {
          const frequency = 0.05 + i * 0.075;
          return `${i ? "L" : "M"}${400 + i * 1.6},${179 - Math.min(64, spectrum.spectrum(frequency, p.model === "quanta") * 140)}`;
        }).join(" ");
        s += path(curve, "#ffc278", 3);
        ["#e79891", "#e9c978", "#abcf93", "#8fc9d9", "#b29cda"].forEach(
          (c, i) => (s += r(328, 147 + i * 6, 48, 3, c)),
        );
        if (p.model !== "continuous")
          for (let i = 0; i < 6; i++)
            s += group(
              "px-packet",
              r(334 + i * 7, 145 + (i % 3) * 9, 4, 4, t.accent),
              `style="animation-delay:-${i * 0.4}s"`,
            );
        s += label(
          424,
          126,
          p.model === "continuous" ? "CLASSICAL" : "E = hf",
          "#e5d4ee",
        );
        break;
      }
      case 10: {
        s +=
          r(134, 183, 386, 11, "#b2a0b6") +
          r(151, 194, 8, 29, "#75627e") +
          r(495, 194, 8, 29, "#75627e") +
          house(539, 145, 55, 59, t);
        const uv = p.color === "uv" || (!p.color && !p.protocol),
          blue = p.color === "blue" || p.protocol === "frequency";
        const active = uv || (round === 0 && blue);
        s += r(157, 135, 39, 32, "#a394af") + r(196, 141, 17, 20, t.accent);
        s += group(
          "px-light-beam",
          `<path d="M213 143 332 126v49L213 160Z" fill="${uv ? "#bfa2fa66" : blue ? "#8cb8ed66" : "#f29c7466"}"/>`,
        );
        s +=
          r(333, 104, 10, 78, "#e2c49b") +
          r(430, 104, 10, 78, "#b9c7be") +
          path("M338 182v24h97v-24", "#d8c785", 3) +
          r(370, 197, 36, 18, "#a5bfa8") +
          r(378, 201, 20, 9, "#ebdfaf");
        if (active)
          for (let i = 0; i < (p.intensity === 5 ? 10 : 5); i++)
            s += group(
              "px-electron",
              r(350 + (i % 6) * 11, 134 + (i % 3) * 9, 4, 4, "#f1e69f"),
              `style="animation-delay:-${i * 0.3}s"`,
            );
        s +=
          label(291, 70, "ONE PHOTON / ONE ELECTRON", "#e5caef", 8) +
          label(367, 241, "hf > W", "#dfcbec", 8);
        break;
      }
    }
    const peopleX = [1, 7].includes(n) ? 160 : 62;
    if (n !== 3)
      s += `<g transform="translate(${peopleX} 167)">${group("px-person-idle", figure(id))}</g>`;
    if (n === 1 || n === 2 || n === 8)
      s += `<g transform="translate(${n === 1 ? 210 : 125} 174) scale(.8)">${figure(id, 1)}</g>`;
    s += r(0, 251, 640, 5, t.panel);
    if (result && !params)
      s +=
        r(515, 12, 112, 17, result.success ? "#315e48" : "#764c48") +
        label(
          524,
          24,
          result.success ? "EVIDENCE SAVED" : "TRY ANOTHER WAY",
          "#fff0cf",
        );
    return `<svg class="px-scene" data-pixel-theme="${id}" data-art-theme="${id}" data-result="${params ? "preview" : result ? (result.success ? "success" : "retry") : "ambient"}" viewBox="0 0 640 256" role="img" aria-label="${t.label}：${t.category}，像素动画场景" shape-rendering="crispEdges">${s}</svg>`;
  }
  const emblem = (id) => window.AtlasPhysicsAtlasArt.emblem(id);
  window.AtlasPhysicsPixelArt = {
    themes,
    scene,
    portrait,
    emblem,
    backdrop: scenery,
    house,
    tree,
  };
})();
