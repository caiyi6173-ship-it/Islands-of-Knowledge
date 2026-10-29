/* Full-color science plates for landmark previews; map fog is styled separately. */
(() => {
  const themes = {
    P01: {
      label: "海港手绘",
      category: "平衡与浮力",
      accent: "#4d8e85",
      wash: "#dceee7",
      paper: "#fff9eb",
      formula: "F浮 = ρ水gV排",
      symbol: "buoyancy",
    },
    P02: {
      label: "文艺复兴手稿",
      category: "运动的测量",
      accent: "#ad783b",
      wash: "#efe0bf",
      paper: "#fff6e3",
      formula: "s ∝ t²",
      symbol: "motion",
    },
    P03: {
      label: "天体航海图",
      category: "引力与轨道",
      accent: "#c9ae6d",
      wash: "#36324c",
      paper: "#fff5d9",
      formula: "F = GMm/r²",
      symbol: "orbit",
    },
    P04: {
      label: "铜与蒸汽工坊",
      category: "功与热",
      accent: "#b7784d",
      wash: "#e9d1b9",
      paper: "#fff4e2",
      formula: "W → Q",
      symbol: "energy",
    },
    P05: {
      label: "光影植物园",
      category: "光的干涉",
      accent: "#a96889",
      wash: "#e1ebcf",
      paper: "#fff9ed",
      formula: "光程差 ↔ 明暗条纹",
      symbol: "waves",
    },
    P06: {
      label: "铜线与电磁工坊",
      category: "电磁感应",
      accent: "#bd8e58",
      wash: "#24443c",
      paper: "#f7efda",
      formula: "ε = −dΦB/dt",
      symbol: "magnet",
    },
    P07: {
      label: "海峡信号航图",
      category: "电磁波与光",
      accent: "#a87947",
      wash: "#cce1dc",
      paper: "#fff2d7",
      formula: "c = 1/√(ε₀μ₀)",
      symbol: "signal",
    },
    P08: {
      label: "矿物标本图鉴",
      category: "放射性与证据",
      accent: "#648663",
      wash: "#e4e5d0",
      paper: "#faf5e5",
      formula: "样本 − 背景 = 净信号",
      symbol: "mineral",
    },
    P09: {
      label: "炉火与光谱",
      category: "能量的量子",
      accent: "#d29b5e",
      wash: "#3f302d",
      paper: "#fff1d3",
      formula: "ΔE = hf",
      symbol: "spectrum",
    },
    P10: {
      label: "光电实验图纸",
      category: "光量子与阈值",
      accent: "#977b9e",
      wash: "#e5dccd",
      paper: "#fffaf0",
      formula: "K最大 = hf − W",
      symbol: "photon",
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
  const path = (d, stroke = "#8c9fc5", width = 2, extra = "") =>
    `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const box = (x, y, w, h, fill, rx = 3, extra = "") =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
  const text = (x, y, label, size = 13, color = "#8c9fc5", anchor = "start") =>
    `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}" font-family="Georgia, 'Microsoft YaHei', serif">${esc(label)}</text>`;
  const circle = (x, y, r, fill, extra = "") =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
  const tree = (x, y, k = 1, c = "#789a6a") =>
    `<g transform="translate(${x} ${y}) scale(${k})">${path("M0 0V-37", "#876648", 5)}<path d="M0-76C-38-52-28-28-12-26C-33-5 16 6 28-18C44-38 18-72 0-76Z" fill="${c}"/>${path("M0-55V-9M0-33-12-43M0-25 13-40", "#bbcd98", 1.2)}</g>`;
  const crate = (x, y, k = 1) =>
    `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 0 25-8 49 0 24 9Z" fill="#dfbf89"/><path d="M0 0V30L24 40V9Z" fill="#bd9161"/><path d="M24 9V40L49 30V0Z" fill="#936443"/>${path("M3 4 20 32M20 12 4 24M29 14 44 7M29 33 44 26", "#755239", 1.3)}</g>`;
  const gear = (x, y, r = 32) =>
    `<g transform="translate(${x} ${y})" class="atlas-gear">${Array.from({ length: 12 }, (_, i) => box(-5, -r - 5, 10, 16, "#c49759", 1, `transform="rotate(${i * 30})"`)).join("")}${circle(0, 0, r - 3, "#e3c891", 'stroke="#896642" stroke-width="2"')}${circle(0, 0, 11, "#fff3d6", 'stroke="#896642" stroke-width="2"')}${path(`M-22 0H22M0-22V22`, "#bc8e53", 3)}</g>`;
  function compass(x, y, r = 29, color = "#bdcbea") {
    return `<g transform="translate(${x} ${y})" opacity=".65">${circle(0, 0, r, "none", `stroke="${color}" stroke-width="1"`)}<path d="M0-${r - 5} 6-5 ${r - 5} 0 5 6 0 ${r - 5}-6 5-${r - 5} 0-5-6Z" fill="none" stroke="${color}"/>${path(`M0-${r}V${r}M-${r} 0H${r}`, color, 0.7)}${text(0, -r - 8, "N", 9, color, "middle")}</g>`;
  }
  function emblem(id) {
    const t = themes[id];
    const marks = {
      buoyancy:
        "M7 24H34L29 32H13ZM21 7V23M21 8 32 21H21M8 36Q13 33 18 36T30 36",
      motion: "M7 31 34 15M9 34H36M15 26V18M25 20V12M33 15V7",
      orbit:
        "M21 12a9 9 0 1 0 0 18 9 9 0 0 0 0-18M6 32C-3 19 28-3 37 10S16 45 6 32",
      energy: "M11 8V24M7 10H15M7 22H15M25 7V26a6 6 0 1 0 8 0V7M29 15V31",
      waves: "M4 21Q9 4 15 21T26 21 38 21M4 29Q9 12 15 29T26 29 38 29",
      magnet:
        "M10 10V24a11 11 0 0 0 22 0V10H26V24a5 5 0 0 1-10 0V10ZM10 17H16M26 17H32",
      signal:
        "M19 35 22 10 25 35M14 9Q3 21 14 30M30 9Q41 21 30 30M10 4Q-4 21 10 36M34 4Q48 21 34 36",
      mineral:
        "M10 29 13 9 24 3 33 17 30 35 19 39ZM13 9 24 17 33 17M24 3V17L19 39M10 29 24 17 30 35",
      spectrum: "M6 34V8M6 34H38M8 31Q17-9 23 16T37 31M9 32 36 7",
      photon: "M5 17H16M5 25H16M22 6V36M31 6V36M24 21H38M34 17 38 21 34 25",
    };
    return `<svg class="atlas-emblem" viewBox="0 0 44 44" aria-hidden="true"><path d="${marks[t.symbol]}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function portrait(id, variant) {
    if (variant === undefined)
      return window.AtlasPhysicsArt.portrait(id).replace(
        'class="scientist-portrait"',
        'class="scientist-portrait atlas-portrait"',
      );
    const accent = themes[id].accent,
      hat = variant === 1 ? "#bdcbea" : "#bdcbea";
    return `<svg class="atlas-portrait" viewBox="0 0 120 150" aria-hidden="true"><path d="M9 144V55a51 51 0 0 1 102 0v89Z" fill="#f8faff"/><circle cx="60" cy="67" r="43" fill="${themes[id].wash}"/><path d="M21 148 28 112 47 99H74L96 117 105 148Z" fill="${accent}" stroke="#8c9fc5"/><path d="M47 92V111L60 122 74 110V92" fill="#d9bd99"/><path d="M34 54Q34 29 60 29Q86 29 85 55L80 81Q77 101 60 103Q44 101 39 81Z" fill="#e3c7a3" stroke="#8c9fc5"/>${variant === 1 ? `<path d="M26 56V36Q57 14 88 36L91 56Z" fill="${hat}"/><path d="M26 48H91M46 28 43 46M72 29 76 46" stroke="#8c9fc5" stroke-width="2"/>` : '<path d="M33 61Q24 31 46 24Q76 15 87 39L84 66 77 45Q53 49 42 39Z" fill="#667a9d"/>'}${path("M44 65H51M69 65H76M59 67 56 80H62M51 89Q60 95 70 88", "#847059", 1.5)}${circle(47, 70, 1.6, "#667a9d")}${circle(72, 70, 1.6, "#667a9d")}${variant === 2 ? '<g fill="none" stroke="#8c9fc5"><circle cx="47" cy="70" r="11"/><circle cx="73" cy="70" r="11"/><path d="M58 69H62"/></g>' : ""}<path d="M40 111 60 131 81 111M60 131V149" stroke="#eef3ff" stroke-width="2" fill="none"/>${variant === 1 ? box(49, 131, 23, 16, "#dfe8fa", 2) : path("M34 128 28 145M87 127 94 146", "#dfe8fa", 1.4)}</svg>`;
  }
  let serial = 0;
  function scene(id, { result = null, round = 0 } = {}) {
    const t = themes[id],
      uid = `plate-${id}-${++serial}`;
    const ink = "#6c5946",
      sea = "#9ecdc7";
    let body = "",
      background = t.wash,
      foreground = ink;
    const hills = `<path d="M0 225Q98 130 189 204Q292 99 404 203Q500 143 596 220V360H0Z" fill="#a6bd8f" opacity=".55"/><path d="M566 224Q648 147 722 198Q827 118 960 208V360H566Z" fill="#91b38a" opacity=".43"/>`;
    switch (id) {
      case "P01": {
        body =
          circle(790, 62, 32, "#fff7e4") +
          hills +
          `<path d="M0 236Q255 217 480 240T960 230V360H0Z" fill="${sea}"/>`;
        for (let i = 0; i < 13; i++)
          body += path(
            `M${i * 83 - 18} ${268 + (i % 3) * 26}q28-7 58-1`,
            "#fff7e4",
            1.6,
          );
        body += `<path d="M0 226 130 202 253 226 227 247H0Z" fill="#ded0ac"/><path d="M0 246H224V265H0Z" fill="#c4a172"/>${path("M48 260V319M174 260V319", "#8f6446", 11)}<path d="M54 205V119H173V210" fill="#eee2c8" stroke="#c4a172"/><path d="M42 119 116 73 187 119Z" fill="#8f6446"/>${path("M72 132V197M96 132V197M129 132V197M154 132V197", "#d7c7a3", 5)}<path d="M707 234 799 194 925 225 859 250Z" fill="#b7c99e"/>${tree(873, 203, 0.8)}${tree(824, 185, 0.6)}`;
        const failed = result && !result.success,
          shape = result?.params?.shape;
        body += `<g class="atlas-boat" transform="translate(427 ${failed ? 257 : 223})">${shape === "lump" ? '<ellipse cx="85" cy="20" rx="30" ry="24" fill="#c4a172"/>' : `<path d="M-12 17Q20 93 190 46L225 11Q140 41-12 17Z" fill="#8f6446" stroke="#695844" stroke-width="2"/><path d="M-12 17Q98 56 225 11" stroke="#d5b17d" stroke-width="7" fill="none"/>${path("M126 18V-123", "#8f6446", 4)}<path d="M131-116Q194-79 204-31H131Z" fill="#fff7e4" stroke="#d8c9a4"/><path d="M121-105 59-38H121Z" fill="#eee2c8"/>${round ? crate(21, -7, 0.8) + crate(59, -17, 0.8) + crate(94, -22, 0.8) + crate(62, -45, 0.8) : result ? "" : crate(36, -12, 0.75) + crate(78, -14, 0.75)}`}</g>`;
        body +=
          path("M693 264V212M687 220 693 212 699 220", "#8f6446", 2) +
          text(712, 226, "浮力", 12, "#8f6446") +
          path("M690 158V193M684 185 690 193 696 185", "#8f6446", 2) +
          text(711, 171, "重力", 12, "#8f6446");
        body +=
          path("M332 252H714", "#fff7e4", 1, 'stroke-dasharray="4 6"') +
          text(70, 335, "潮汐 / 船形 / 排开的水", 12, "#8f6446");
        break;
      }
      case "P02": {
        background = "#fff6e3";
        body = `<path d="M57 284V104a83 83 0 0 1 166 0v180Z" fill="#cce3df" stroke="#d6be90" stroke-width="8"/>${path("M140 23V284M59 139H221", "#d6be90", 4)}<path d="M144 32 219 183 219 284 148 284Z" fill="#fff6e3" opacity=".45"/>${box(745, 72, 132, 174, "#f0dfbd", 2)}${path("M766 100H851M766 119H829M766 138H846", "#bf9b55", 1)}<path d="M0 299 397 264 960 298V360H0Z" fill="#f0dfbd"/>`;
        body +=
          path("M257 125 755 276", "#866342", 18) +
          path("M257 115 757 265", "#f0dfbd", 4) +
          path("M295 139V299M713 263V304", "#bf9b55", 7);
        const layout = {
          equal: [1, 2, 3],
          square: [1, 4, 9],
          linear: [2, 4, 6],
        }[result?.params?.layout] || [1, 4, 9];
        layout.forEach((v, i) => {
          const x = 257 + v * 49.8,
            y = 125 + v * 15.1;
          body +=
            path(`M${x} ${y - 71}V${y - 48}`, "#866342", 2) +
            `<path d="M${x - 13} ${y - 29}Q${x - 14} ${y - 57} ${x} ${y - 55}Q${x + 14} ${y - 57} ${x + 13} ${y - 29}Z" fill="#bf9b55" stroke="#866342"/>${circle(x, y - 24, 3, "#866342")}` +
            text(x, y - 83, String(v), 12, "#866342", "middle");
        });
        body +=
          circle(281, 112, 10, "#bf9b55", 'stroke="#866342" stroke-width="2"') +
          path("M293 108 343 123", "#bf9b55", 1, 'stroke-dasharray="3 5"') +
          `<g transform="translate(78 288) rotate(-6)">${box(0, 0, 164, 57, "#fff6e3", 2)}${text(16, 23, "1   4   9", 17, "#866342")}${text(16, 44, "s ∝ t²", 13, "#866342")}</g>` +
          text(800, 283, "计时手稿", 12, "#866342", "middle");
        break;
      }
      case "P03": {
        background = "#292a42";
        foreground = "#efe6c8";
        for (let i = 0; i < 72; i++)
          body += circle(
            (i * 137 + 31) % 960,
            (i * i * 37 + 17) % 360,
            i % 8 ? 1 : 2,
            "#efe6c8",
            `opacity="${0.2 + (i % 4) * 0.16}"`,
          );
        body += `<ellipse cx="523" cy="180" rx="210" ry="137" fill="none" stroke="#8eae77" stroke-width="1" stroke-dasharray="2 6"/><ellipse cx="523" cy="180" rx="156" ry="121" fill="none" stroke="#c6aa66" opacity=".55"/>${circle(523, 181, 96, "#5c929f", 'stroke="#efe6c8" stroke-width="1.5"')}<ellipse cx="523" cy="181" rx="96" ry="35" fill="none" stroke="#8eae77"/><ellipse cx="523" cy="181" rx="43" ry="96" fill="none" stroke="#8eae77"/>${path("M430 164Q483 199 616 164M523 85V277", "#8eae77", 1)}<path d="M449 127 479 113 510 132 506 161 472 171 469 207 443 192Z" fill="#8eae77"/><path d="M553 191 589 171 605 188 584 218 565 239 546 221Z" fill="#8eae77"/>${path("M523 62Q717 49 732 182", "#8eae77", 2.5)}${circle(726, 167, 5, "#efe6c8")}${path("M704 172 641 176M650 171 641 176 651 181", "#efe6c8", 1.5)}${text(674, 156, "引力", 11, "#efe6c8")}`;
        body +=
          `<g transform="translate(142 226)">${circle(0, 0, 66, "none", 'stroke="#c6aa66" stroke-width="4"')}<ellipse cx="0" cy="0" rx="24" ry="66" fill="none" stroke="#8eae77" stroke-width="2" transform="rotate(35)"/><ellipse cx="0" cy="0" rx="65" ry="21" fill="none" stroke="#8eae77" stroke-width="2" transform="rotate(-30)"/>${circle(0, 0, 18, "#c6aa66")}${path("M0 68V100M-40 101H40", "#c6aa66", 5)}</g>` +
          compass(857, 78, 35, "#8eae77") +
          text(64, 62, "地面与天空，同一条引力规律", 14, "#efe6c8") +
          text(741, 313, "NEWTON’S THOUGHT EXPERIMENT", 9, "#8eae77");
        break;
      }
      case "P04": {
        background = "#fff5e6";
        body = `<path d="M42 252V79a65 65 0 0 1 130 0v173Z" fill="#f0dfc7" stroke="#d6bd9f" stroke-width="7"/>${path("M107 16V250M44 137H169", "#d6bd9f", 3)}${box(0, 281, 960, 79, "#d6bd9f", 0)}${box(249, 258, 584, 18, "#be8d5d", 3)}${path("M278 277V346M797 277V346", "#8b644b", 12)}${path("M325 258V78H618V119", "#8b644b", 10)}${circle(463, 82, 23, "#d6bd9f", 'stroke="#8b644b" stroke-width="3"')}${path("M443 83V190M484 82V187M613 117V179", "#8b644b", 2)}${box(590, 176, 48, 55, "#8b644b", 3)}${path("M600 187H627M600 197H627M600 207H627", "#be8d5d", 1.5)}`;
        body += `<path d="M382 181Q430 166 510 181V252Q442 277 382 252Z" fill="#d6bd9f" stroke="#be8d5d" stroke-width="2"/><ellipse cx="446" cy="181" rx="64" ry="15" fill="#f0dfc7" stroke="#be8d5d"/><path d="M390 203Q443 188 502 202V246Q449 263 391 246Z" fill="#7eb4af" opacity=".8"/>${path("M463 129V240M423 233H496", "#8b644b", 4)}${gear(463, 150, 23)}${box(698, 130, 12, 108, "#fff5e6", 6, 'stroke="#be8d5d" stroke-width="2"')}${box(702, round ? 169 : 189, 4, 49, "#c3654d", 2)}${circle(704, 239, 13, "#c3654d")}${path("M682 146H691M682 161H691M682 176H691M682 191H691", "#d6bd9f", 1)}${text(704, 103, "微小温升", 12, "#8b644b", "middle")}${text(616, 155, "W", 18, "#8b644b", "middle")}${text(528, 226, "Q", 18, "#8b644b")}`;
        body += `<g transform="translate(78 277) rotate(-8)">${box(0, 0, 113, 49, "#fff5e6", 2)}${text(15, 21, "功 → 热", 14, "#8b644b")}${path("M15 31H95M15 37H78", "#d6bd9f", 1)}</g>`;
        break;
      }
      case "P05": {
        background = "#fff8e8";
        body =
          circle(823, 65, 33, "#fff8e8") +
          `<path d="M0 258Q178 200 329 251T646 239T960 253V360H0Z" fill="#e4edcf"/><path d="M0 304Q310 258 514 312T960 302V360H0Z" fill="#b1c99b"/><path d="M83 260V111a70 70 0 0 1 140 0v149" fill="none" stroke="#e4edcf" stroke-width="16"/>${path("M85 260Q91 142 111 97T208 95M221 260Q221 187 203 164", "#7c9d68", 4)}${tree(50, 296, 0.8, "#769268")}${tree(891, 297, 1.1, "#597d5c")}`;
        for (let i = 0; i < 13; i++) {
          let x = 70 + i * 65,
            y = 302 + (i % 3) * 13;
          body +=
            path(`M${x} ${y + 10}v-20`, "#7c9d68", 1) +
            circle(x, y - 13, 4, i % 2 ? "#d795a2" : "#e4c56b");
        }
        const blue = round === 1,
          beam = blue ? "#77aabc" : "#d9b458";
        body += `<path d="M288 186 302 174 324 182 324 213 301 222 288 209Z" fill="#7c9d68"/>${path("M325 195H433", beam, 4)}${box(435, 104, 13, 164, "#7c9d68", 1)}${box(435, 163, 13, 9, "#fff8e8", 0)}${box(435, 210, 13, 9, "#fff8e8", 0)}${box(701, 82, 70, 201, "#fff8e8", 3, 'stroke="#b1c99b" stroke-width="2"')}`;
        for (let i = 0; i < 12; i++) {
          let y = 94 + i * 15;
          body += box(
            707,
            y,
            58,
            8,
            beam,
            0,
            `opacity="${0.12 + 0.8 * Math.cos(i * 1.1) ** 2}"`,
          );
        }
        body += `<path d="M449 168 701 89V274Z" fill="${beam}" opacity=".1"/><path d="M449 214 701 89V274Z" fill="${beam}" opacity=".12"/>${path("M449 168 701 190M449 214 701 190", beam, 1.5)}${path("M777 188H811", "#7c9d68", 1)}${text(817, 192, "暗纹", 12, "#57654d")}${text(478, 315, blue ? "蓝光 / 条纹随波长移动" : "相干光 / 两条缝 / 明与暗", 13, "#57654d")}`;
        break;
      }
      case "P06": {
        background = "#24443c";
        foreground = "#fff2d0";
        for (let x = 0; x < 960; x += 32)
          body += path(`M${x} 0V360`, "#c0925d", 0.5, 'opacity=".24"');
        for (let y = 0; y < 360; y += 32)
          body += path(`M0 ${y}H960`, "#c0925d", 0.5, 'opacity=".24"');
        body +=
          path("M53 286H894M97 286V325M848 286V325", "#d7ccb1", 5) +
          path("M372 122V86H726V122M375 240V274H726V218", "#fff2d0", 2.5);
        for (let i = 0; i < 11; i++)
          body += `<ellipse cx="${382 + i * 15}" cy="182" rx="14" ry="59" fill="none" stroke="${i % 2 ? "#d7ae78" : "#b78c5d"}" stroke-width="5"/>`;
        body +=
          box(207, 167, 130, 30, "#7b9ab8", 3) +
          box(207, 167, 65, 30, "#c5735a", 3) +
          text(238, 187, "N", 13, "#fff9ea", "middle") +
          text(304, 187, "S", 13, "#fff9ea", "middle") +
          path("M225 143H329M321 137 329 143 321 149", "#fff2d0", 1.5) +
          `<g transform="translate(726 173)">${circle(0, 0, 61, "#fff2d0", 'stroke="#d7ccb1" stroke-width="5"')}<path d="M-43 4a43 43 0 0 1 86 0" fill="none" stroke="#c0925d" stroke-width="2"/>${path("M0 30 24-24", "#4b6457", 3)}${text(0, 45, "−    0    +", 12, "#4b6457", "middle")}</g>`;
        body +=
          path(
            "M167 125C278 45 518 66 586 121M172 226C279 309 522 287 584 237",
            "#c0925d",
            1,
            'stroke-dasharray="5 6"',
          ) +
          text(64, 51, "磁铁在动，什么正在改变？", 16, "#fff2d0") +
          text(625, 316, "ΦB / 变化 / 感应", 12, "#d7ccb1");
        break;
      }
      case "P07": {
        background = "#d8ebe5";
        for (let x = 0; x < 960; x += 96)
          body += path(`M${x} 0V360`, "#bdc99d", 0.6);
        for (let y = 0; y < 360; y += 72)
          body += path(`M0 ${y}H960`, "#bdc99d", 0.6);
        body += `<path d="M-20 170 56 123 181 145 275 204 204 277 74 291-20 258Z" fill="#bdc99d" stroke="#8da376"/><path d="M691 168 783 128 902 164 998 249 940 292 780 275 691 221Z" fill="#bdc99d" stroke="#8da376"/><path d="M4 185 71 149 175 169 243 212" fill="none" stroke="#d8ebe5" stroke-width="10"/><path d="M723 180 788 153 893 181 959 235" fill="none" stroke="#d8ebe5" stroke-width="10"/>${tree(65, 197, 0.6)}${tree(119, 246, 0.7)}${tree(866, 223, 0.7)}`;
        body +=
          path(
            "M191 233 221 76 254 234M201 187H244M209 145H235M218 100H225",
            "#785f42",
            4,
          ) +
          circle(222, 71, 6, "#bdc99d") +
          `<path d="M756 230V161H834V230" fill="#fff6df" stroke="#8da376"/><path d="M750 160a46 46 0 0 1 90 0Z" fill="#8da376"/>${path("M795 114V83", "#785f42", 3)}${circle(795, 79, 5, "#bdc99d")}`;
        for (let i = 0; i < 5; i++)
          body += `<path class="atlas-signal-ring" style="animation-delay:${-i * 0.4}s" d="M${291 + i * 80} 87Q${344 + i * 80} 158 ${291 + i * 80} 228" fill="none" stroke="#785f42" stroke-width="${i ? 1.4 : 2}" opacity="${0.65 - i * 0.07}"/>`;
        body +=
          compass(855, 63, 28, "#785f42") +
          path(
            "M322 296Q482 262 670 294",
            "#8da376",
            1,
            'stroke-dasharray="5 6"',
          ) +
          text(496, 320, "一段没有连接导线的距离", 13, "#785f42", "middle") +
          text(169, 263, "发射", 12, "#785f42") +
          text(778, 259, "接收", 12, "#785f42");
        break;
      }
      case "P08": {
        background = "#faf5e6";
        body = `<path d="M0 116 174 67 353 97 412 158 0 228Z" fill="#d8ccae"/><path d="M0 188 116 128 260 157 402 195 0 280Z" fill="#baaa8a"/><path d="M0 246 109 196 233 214 385 253 0 331Z" fill="#baaa8a"/>${path("M0 227 109 177 242 196 384 235", "#d8ccae", 7)}<path d="M106 223 131 128 163 101 193 155 181 238 143 261Z" fill="#86a380" stroke="#6d6351"/><path d="M163 101 157 190 143 261 131 128M157 190 193 155M157 190 181 238" fill="none" stroke="#e5ebd9"/><path d="M205 253 224 191 255 170 280 218 264 273 234 285Z" fill="#b49ab4" stroke="#6d6351"/>${path("M255 170 245 229 234 285M245 229 280 218", "#e5ebd9", 1.5)}`;
        body +=
          box(427, 259, 466, 15, "#baaa8a", 3) +
          path("M452 274V332M867 274V332", "#baaa8a", 9);
        [
          ["背景", 491, 29],
          ["铀", 618, 68],
          ["矿石", 745, 98],
        ].forEach(([name, x, h], i) => {
          body +=
            box(
              x,
              140,
              80,
              103,
              "#e5ebd9",
              4,
              'stroke="#baaa8a" stroke-width="1.5"',
            ) +
            box(
              x + 9,
              202 - i * 12,
              62,
              32 + i * 12,
              ["#e5ebd9", "#8f9b6d", "#9d8461"][i],
              1,
            ) +
            box(x + 8, 135, 64, 9, "#baaa8a", 2) +
            box(x + 7, 162, 66, 29, "#faf5e6", 1) +
            text(x + 40, 181, name, 12, "#6d6351", "middle");
        });
        body +=
          `<g transform="translate(645 43) rotate(4)">${box(0, 0, 210, 63, "#faf5e6", 2)}${text(15, 24, "标本记录 / 相同条件", 12, "#6d6351")}${path("M16 42H194M16 50H158", "#d8ccae", 1)}</g>` +
          text(150, 325, "矿物标本 / 层理与组分", 12, "#6d6351", "middle");
        break;
      }
      case "P09": {
        background = "#332a29";
        foreground = "#f9ebd0";
        body = `<path d="M0 302 960 279V360H0Z" fill="#62534b"/><path d="M94 292V105L130 66H304L344 106V292Z" fill="#9f6b50" stroke="#c8a16a" stroke-width="2"/><path d="M86 106 126 57H311L354 106Z" fill="#62534b"/><path d="M155 292V189a64 64 0 0 1 128 0v103" fill="#332a29" stroke="#c8a16a" stroke-width="7"/><path d="M168 290V192a51 51 0 0 1 102 0v98Z" fill="url(#${uid}-heat)"/><path class="atlas-flame" d="M191 288Q171 253 202 220Q192 250 224 235Q251 256 245 288Z" fill="#f0cb83" opacity=".8"/>${path("M113 129H148M294 129H324M113 149H141M302 149H323", "#c8a16a", 1.5)}`;
        body += `<path d="M289 194 445 151 445 232Z" fill="#e6cba0" opacity=".12"/><path d="M450 150 493 222H410Z" fill="#e6cba0" fill-opacity=".6" stroke="#e6cba0" stroke-width="2"/>${path("M289 194H437", "#e6cba0", 2)}`;
        ["#bd86b8", "#7ba5d0", "#8cba85", "#e1c16c", "#d88d62"].forEach(
          (c, i) => (body += path(`M451 185 622 ${123 + i * 20}`, c, 2)),
        );
        body +=
          `<g transform="translate(624 77)">${box(0, 0, 251, 191, "#f9ebd0", 3, 'stroke="#c8a16a" stroke-width="2"')}${path("M31 23V156H225", "#c8a16a", 1)}${path("M37 145Q72 29 112 73T222 145", "#9f6b50", 3)}${path("M37 145Q123 135 219 28", "#c8a16a", 1.5, 'stroke-dasharray="4 5"')}${text(33, 178, "频率 / 光谱记录", 11, "#9f6b50")}</g>` +
          text(65, 38, "一扇炉门，打开经典理论的边界", 15, "#f9ebd0");
        break;
      }
      case "P10": {
        background = "#fffaf0";
        body = `<path d="M55 284V101a58 58 0 0 1 116 0v183Z" fill="#e9e2d3" stroke="#ccdace" stroke-width="7"/>${path("M112 45V283M58 151H167", "#ccdace", 3)}<path d="M0 308 960 285V360H0Z" fill="#e9e2d3"/>${box(220, 277, 628, 16, "#bca16e", 3)}${path("M252 294V344M815 294V344", "#675966", 10)}`;
        body += `<path d="M276 204 296 182 357 182 372 204 357 230H296Z" fill="#bca16e" stroke="#675966" stroke-width="2"/>${box(263, 204, 17, 36, "#ccdace", 2)}${box(305, 230, 12, 46, "#bca16e", 2)}${box(286, 269, 53, 8, "#bca16e", 2)}<path d="M371 200 501 181 501 226 371 212Z" fill="${result?.params?.color === "red" || result?.params?.protocol === "brightness" ? "#d57b61" : result?.params?.color === "uv" ? "#a78abb" : "#7daebc"}" opacity=".35"/>`;
        body += `<rect x="475" y="115" width="263" height="143" rx="68" fill="#fffaf0" fill-opacity=".6" stroke="#ccdace" stroke-width="3"/>${box(499, 140, 14, 98, "#bca16e", 1)}${box(692, 140, 14, 98, "#bca16e", 1)}${path("M506 238V304H701V238", "#bca16e", 2)}${box(577, 287, 57, 33, "#e9e2d3", 4, 'stroke="#bca16e"')}<path d="M586 309a20 20 0 0 1 39 0" fill="none" stroke="#bca16e"/>${path("M606 311 615 295", "#675966", 2)}${text(507, 129, "−", 16, "#675966", "middle")}${text(699, 129, "+", 16, "#bca16e", "middle")}`;
        const emitting = result ? result.success : true;
        if (emitting)
          for (let i = 0; i < 6; i++)
            body += circle(
              536 + i * 24,
              174 + (i % 2) * 26,
              3,
              "#bca16e",
              `class="atlas-electron" style="animation-delay:${-i * 0.25}s"`,
            );
        body +=
          `<g transform="translate(759 58) rotate(4)">${box(0, 0, 145, 116, "#fffaf0", 3)}${text(17, 30, "hf ≥ W", 17, "#675966")}${path("M17 45H125M17 55H111M17 65H119", "#ccdace", 1)}${text(17, 96, "阈值 / 频率 / 强度", 9, "#bca16e")}</g>` +
          text(380, 337, "让每一份光的能量，接受实验的检验", 13, "#675966");
        break;
      }
    }
    const cornerColor = foreground === ink ? "#b79b65" : foreground;
    return `<svg class="atlas-scene" data-art-theme="${id}" viewBox="0 0 960 360" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(t.label + " · " + t.category)}"><defs><pattern id="${uid}-grain" width="17" height="19" patternUnits="userSpaceOnUse"><circle cx="2" cy="4" r=".55" fill="#b79b65" opacity=".14"/><path d="M11 12h2" stroke="#b79b65" stroke-width=".5" opacity=".18"/></pattern><radialGradient id="${uid}-heat"><stop stop-color="#f6d493"/><stop offset=".65" stop-color="#ca8b4d"/><stop offset="1" stop-color="#7f5037"/></radialGradient></defs>${box(0, 0, 960, 360, background, 0)}${body}${box(0, 0, 960, 360, `url(#${uid}-grain)`, 0)}${path("M16 36V16H36M924 16H944V36M16 324V344H36M924 344H944V324", cornerColor, 0.8, 'opacity=".5"')}${result ? `<g transform="translate(807 16)">${box(0, 0, 133, 26, result.success ? "#fff6e3" : "#fff6e3", 3)}${text(66, 18, result.success ? "已收录 · 实验证据" : "观察记录 · 待验证", 10, result.success ? "#6c5946" : "#6c5946", "middle")}</g>` : ""}</svg>`;
  }
  window.AtlasPhysicsAtlasArt = { themes, emblem, portrait, scene };
})();
