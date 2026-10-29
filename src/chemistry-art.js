/* Original pixel illustrations. Colors are conventions, not physical appearances. */
(() => {
  const D =
    typeof module !== "undefined" && module.exports
      ? require("./chemistry-data.js")
      : window.AtlasChemistryData;
  const G =
    typeof module !== "undefined" && module.exports
      ? require("./chemistry-engine.js")
      : window.AtlasChemistryGame;
  const esc = (s) =>
    String(s).replace(
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
  const rect = (x, y, w, h, fill, extra = "") =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
  const label = (x, y, s, size = 15, color = "#483d35", extra = "") =>
    `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="middle" ${extra}>${esc(s)}</text>`;
  const line = (x, y, xx, yy, color = "#6b625b", width = 4, extra = "") =>
    `<path d="M${x} ${y}L${xx} ${yy}" fill="none" stroke="${color}" stroke-width="${width}" ${extra}/>`;
  const dot = (x, y, color = "#f4da93", r = 4) =>
    `<rect x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" fill="${color}"/>`;
  const ball = (x, y, symbol, r = 24) =>
    `<g>${rect(x - r, y - r, r * 2, r * 2, { H: "#f6f1dc", O: "#d7766d", C: "#666778", N: "#8d9bd0", Zn: "#b0bfbe", Cu: "#d99a64" }[symbol] || "#b7cf9a", 'rx="5"')}${rect(x - r + 4, y - r + 4, r * 2 - 8, 5, "#ffffff55")}${label(x, y + 6, symbol, Math.min(19, r), symbol === "C" ? "#fff6e4" : "#3f3936")}</g>`;
  const arrows = (x, y, xx, yy, color) =>
    `${line(x, y, xx, yy, color, 4)}<path d="M-9 -6L0 0L-9 6" fill="none" stroke="${color}" stroke-width="4" transform="translate(${xx} ${yy}) rotate(${(Math.atan2(yy - y, xx - x) * 180) / Math.PI})"/>`;
  function portrait(id) {
    const i = Number(id.slice(1)) - 1,
      l = D.byId[id],
      hair = [
        "#5b443d",
        "#a09a87",
        "#968b76",
        "#655c52",
        "#4f4844",
        "#6c5147",
        "#b3ad99",
        "#d1c8b1",
        "#675d53",
        "#665348",
      ][i];
    const long = [0, 2, 7].includes(i),
      beard = [2, 5].includes(i);
    return `<svg viewBox="0 0 40 44" aria-hidden="true" shape-rendering="crispEdges">${rect(2, 1, 36, 42, l.panel)}${rect(4, 34, 32, 10, l.color)}${rect(10, 31, 20, 6, "#ece3c9")}${rect(16, 27, 8, 8, "#d9ac88")}${rect(long ? 7 : 10, 6, long ? 26 : 21, 26, hair)}${rect(12, 12, 17, 17, "#edc5a1")}${rect(11, 8, 20, 7, hair)}${i === 0 || i === 7 ? rect(6, 16, 6, 18, hair) + rect(29, 16, 6, 18, hair) : ""}${i === 1 ? rect(10, 7, 21, 4, "#554c44") + rect(28, 12, 4, 14, hair) : ""}${dot(17, 20, "#463f3c", 1)}${dot(25, 20, "#463f3c", 1)}${rect(20, 22, 2, 3, "#c79072")}${beard ? rect(13, 26, 16, 7, hair) + rect(16, 32, 10, 4, hair) : rect(18, 27, 7, 1, "#a57265")}${[1, 3, 6].includes(i) ? `<g fill="none" stroke="#615c54" stroke-width="1"><rect x="13" y="17" width="7" height="6"/><rect x="22" y="17" width="7" height="6"/><path d="M20 20h2"/></g>` : ""}${rect(18, 35, 5, 9, "#65594d")}${rect(9, 38, 4, 6, "#ffffff44")}</svg>`;
  }
  function landmark(id) {
    const l = D.byId[id],
      i = Number(id.slice(1)),
      c = l.color;
    let body = "";
    if (i === 1)
      body = `${rect(17, 42, 85, 32, "#e1ddc7")}${rect(12, 37, 95, 7, "#708e81")}${[27, 50, 73].map((x) => `${rect(x, 20, 12, 28, "#c1e3d4")}${rect(x + 2, 17, 8, 5, "#697773")}${rect(x + 2, 32, 8, 14, c)}`).join("")}${rect(106, 52, 20, 5, "#9e7452")}`;
    if (i === 2)
      body = `${rect(18, 39, 96, 38, "#b68a72")}${rect(12, 31, 108, 10, "#775f54")}${rect(22, 17, 13, 16, "#68564c")}${rect(73, 16, 29, 27, "#c6aa7d")}${line(87, 12, 87, 48)}${line(62, 23, 112, 23)}${line(67, 23, 61, 42)}${line(107, 23, 114, 42)}${ball(45, 61, "C", 10)}${ball(82, 61, "O", 10)}`;
    if (i === 3)
      body = `<path d="M14 35L68 8L121 35V78H14Z" fill="#d3dfbb" stroke="#6f8b70" stroke-width="4"/>${[37, 63, 89].map((x) => line(x, 25, x, 76, "#7e9c83", 3)).join("")}${line(16, 46, 120, 46, "#7e9c83", 3)}${rect(29, 55, 18, 21, "#c5b97c")}${rect(61, 55, 18, 21, "#c5b97c")}${rect(94, 55, 18, 21, "#c5b97c")}${label(38, 69, "Na", 10)}${label(70, 69, "Cl", 10)}`;
    if (i === 4)
      body = `${rect(25, 25, 83, 54, "#aa91b2")}${rect(20, 20, 93, 9, "#786b8c")}${rect(45, 48, 39, 31, "#736385")}${ball(47, 42, "H", 14)}${ball(88, 42, "H", 14)}${dot(67, 39)}${dot(67, 47)}${rect(55, 7, 22, 13, "#e6d39b")}`;
    if (i === 5)
      body = `${rect(18, 34, 98, 45, "#a3a7bf")}<path d="M10 35L67 9L125 35Z" fill="#7786a3"/>${rect(53, 49, 25, 30, "#6a7895")}${rect(27, 45, 17, 16, "#e8d69f")}${rect(87, 45, 17, 16, "#e8d69f")}${label(67, 32, "H₂O", 13)}${rect(107, 62, 16, 15, "#cfa078")}`;
    if (i === 6)
      body = `<path d="M12 69Q24 12 70 12T127 69Z" fill="#dfbbc9" stroke="#a6819c" stroke-width="3"/>${line(29, 69, 45, 19, "#b18c9e", 2)}${line(106, 69, 90, 19, "#b18c9e", 2)}${line(67, 14, 67, 74, "#b18c9e", 2)}${line(67, 50, 46, 27, c, 4)}${line(67, 50, 98, 46, c, 4)}${line(67, 50, 52, 72, c, 4)}${ball(67, 50, "C", 12)}${ball(46, 27, "H", 9)}${ball(98, 46, "H", 9)}${ball(52, 72, "H", 9)}`;
    if (i === 7)
      body = `${rect(30, 55, 76, 24, "#c8ac7c")}${rect(62, 20, 12, 39, "#a88665")}${line(18, 22, 117, 22, "#c39253", 4)}${arrows(65, 22, 114, 22, "#e7c173")}${ball(35, 22, "O", 11)}${ball(66, 22, "C", 10)}${ball(96, 22, "O", 11)}${rect(19, 71, 98, 8, "#927e64")}`;
    if (i === 8)
      body = `${rect(22, 57, 91, 23, "#b0a183")}${rect(63, 14, 10, 46, "#bda66d")}${line(25, 23, 109, 23, "#8d8059", 4)}${line(30, 23, 21, 52, "#a39470", 2)}${line(30, 23, 40, 52, "#a39470", 2)}${line(104, 23, 95, 52, "#a39470", 2)}${line(104, 23, 114, 52, "#a39470", 2)}${rect(17, 51, 27, 5, "#d8c685")}${rect(91, 51, 27, 5, "#d8c685")}${rect(26, 38, 10, 13, "#cae1c7")}`;
    if (i === 9)
      body = `${rect(9, 62, 118, 16, "#9ebcb3")}${rect(20, 25, 23, 40, "#b5d0c8")}${rect(92, 25, 23, 40, "#cba383")}${line(28, 20, 104, 20, "#cfab79", 5)}${rect(61, 12, 12, 10, "#83b3a6")}${rect(51, 46, 35, 16, "#c1a16f")}${label(68, 58, "e⁻", 12)}${line(14, 69, 126, 69, "#789d94", 2)}`;
    if (i === 10)
      body = `${rect(13, 38, 33, 39, "#abd5d0")}${rect(91, 38, 33, 39, "#90bbc6")}${rect(24, 28, 8, 41, "#b8bab1")}${rect(104, 28, 8, 41, "#c98b66")}<path d="M38 49V22H99V49" fill="none" stroke="#dfd3ab" stroke-width="8"/>${line(28, 27, 28, 9, "#7d7163", 3)}${line(28, 9, 108, 9, "#7d7163", 3)}${line(108, 9, 108, 27, "#7d7163", 3)}${rect(58, 3, 22, 14, "#b59b76")}${line(68, 14, 74, 6, "#f2dec0", 2)}`;
    return `<svg viewBox="0 0 140 96" aria-hidden="true" shape-rendering="crispEdges"><ellipse cx="70" cy="83" rx="62" ry="10" fill="#425b5b33"/>${rect(8, 78, 124, 6, "#8c9e83")}${rect(13, 84, 114, 5, "#c0b18d")}${body}</svg>`;
  }
  let serial = 0;
  function scene(id, round = 0, input = {}, options = {}) {
    const l = D.byId[id],
      r = G.evaluate(id, round, input),
      p = r.params,
      m = r.model,
      live = options.live === true;
    const key = live ? `chem-live-${id}` : `chem-preview-${++serial}`;
    let body = "",
      caption = l.concept;
    const plinth = (x, y, w = 180) =>
      `${rect(x, y, w, 18, "#a38c6e")}${rect(x + 8, y + 18, w - 16, 12, "#736c5e")}`;
    switch (id) {
      case "C01": {
        const x = round && p.instrument === "magnet" ? 465 : 360;
        body = `${rect(110, 82, 160, 196, "#547161")}${rect(120, 92, 140, 176, "#cadac1")}${[0, 1, 2].map((i) => `${rect(125, 127 + i * 56, 130, 5, "#8d9f7d")}${rect(145, 105 + i * 56, 24, 22, ["#d5af78", "#e8dfb5", "#9dbd9c"][i])}${rect(196, 100 + i * 56, 24, 27, ["#9ac6bb", "#e5c0ad", "#a8b5d5"][i])}`).join("")}${plinth(300, 312, 215)}${round ? rect(x, 242, 96, 55, "#a4aeaa") : rect(x, 210, 86, 95, "#e8e3d3", 'stroke="#8ca49a" stroke-width="4"')}${round ? rect(x + 7, 250, 80, 8, "#d2d9c9") : rect(x + 10, 260, 66, 36, "#f8edcb")}${label(x + 44, round ? 278 : 245, round ? "B" : "A", 25)}${p.instrument === "magnet" ? `<path d="M530 245v-48h48v48" fill="none" stroke="#af635e" stroke-width="20"/>${line(518, 251, 505, 262, "#e1be73", 3)}${line(530, 262, 507, 272, "#e1be73", 3)}` : p.instrument === "conductivity" ? `${rect(520, 184, 120, 90, "#7e9c88")}${rect(532, 196, 96, 35, "#e9edcf")}${label(580, 220, round ? "95" : "15", 21)}${line(540, 274, 397, 256, "#7a6555", 3)}` : p.instrument === "density" ? `${rect(549, 143, 28, 155, "#b4d7c9")}${rect(545, 139, 36, 8, "#faf0d5")}${line(563, 170, 563, 264, "#75998e", 3)}${label(617, 224, "2.16", 21)}` : `${label(585, 208, "?", 52, "#b39876")}${label(585, 242, "先选一种仪器", 14)}`}${plinth(520, 312, 135)}`;
        caption = round ? "让磁性成为新的证据" : "相似外观，需要不同的测量";
        break;
      }
      case "C02": {
        body = `${label(230, 110, "C · 每个 12", 21)}${label(565, 110, "O · 每个 16", 21)}${plinth(125, 305, 220)}${plinth(455, 305, 220)}${Array.from({ length: p.carbon }, (_, i) => ball(175 + (i % 2) * 95, 180 + Math.floor(i / 2) * 75, "C", 25)).join("")}${Array.from({ length: p.oxygen }, (_, i) => ball(492 + (i % 4) * 49, 175 + Math.floor(i / 4) * 65, "O", 20)).join("")}${rect(145, 348, 200, 15, "#5f6476")}${rect(455, 348, 200, 15, "#8e574d")}${rect(455, 348, Math.min(200, m.ratio * 60), 15, "#d99776")}${label(400, 150, ":", 40)}${label(400, 385, `氧 / 碳 = ${m.ratio.toFixed(3)}`, 20)}`;
        break;
      }
      case "C03": {
        body = `${rect(110, 95, 290, 260, "#f4efd4")}${ball(255, 225, round ? "Cl" : "Na", 24)}${Array.from({ length: p.shells }, (_, i) => `<ellipse cx="255" cy="225" rx="${43 + i * 22}" ry="${43 + i * 22}" fill="none" stroke="#879978" stroke-width="2" stroke-dasharray="4 5"/>`).join("")}${Array.from(
          { length: p.outer },
          (_, i) => {
            const a = (i * 2 * Math.PI) / p.outer,
              rr = 43 + (p.shells - 1) * 22;
            return dot(
              255 + rr * Math.cos(a),
              225 + rr * Math.sin(a),
              "#a36a46",
              5,
            );
          },
        ).join(
          "",
        )}${label(255, 378, "电子层示意 · 非真实轨道", 13)}${[1, 2, 13, 14, 15, 16, 17, 18].map((g, i) => `${rect(443 + i * 29, 126, 26, 26, "#ced4ad")}${label(456 + i * 29, 144, g, 12)}`).join("")}${[2, 3, 4].map((period, j) => Array.from({ length: 8 }, (_, i) => `${rect(443 + i * 29, 164 + j * 47, 26, 41, p.shells === period && m.group === [1, 2, 13, 14, 15, 16, 17, 18][i] ? l.color : "#aebc91")}`).join("")).join("")}${label(550, 345, `${p.shells} 周期 · 第 ${m.group} 族`, 20)}${label(550, 378, "仅对本关主族元素", 13)}`;
        body += Array.from({ length: p.shells - 1 }, (_, shell) =>
          Array.from({ length: shell ? 8 : 2 }, (_, i) => {
            const angle = (i * 2 * Math.PI) / (shell ? 8 : 2) + 0.25,
              radius = 43 + shell * 22;
            return dot(
              255 + radius * Math.cos(angle),
              225 + radius * Math.sin(angle),
              "#809378",
              3,
            );
          }).join(""),
        ).join("");
        break;
      }
      case "C04": {
        body = `${rect(150, 115, 500, 205, "#f4e5d4")}${ball(280, 215, round ? "O" : "H", 41)}${ball(520, 215, round ? "O" : "H", 41)}${Array.from({ length: p.pairs }, (_, i) => `${dot(390, 190 + i * 23, "#a57067", 5)}${dot(410, 190 + i * 23, "#a57067", 5)}`).join("")}${Array.from(
          { length: p.lone },
          (_, i) => {
            const side = i % 2,
              x = side ? 520 : 280,
              y = 95 + Math.floor(i / 2) * 23;
            return dot(x - 7, y, "#7b7a9f", 4) + dot(x + 7, y, "#7b7a9f", 4);
          },
        ).join(
          "",
        )}${label(400, 295, `${p.pairs} 对共享电子`, 20)}${plinth(120, 320, 560)}${label(400, 380, `价电子账本 ${m.total} / ${round ? 12 : 2}`, 23)}`;
        break;
      }
      case "C05": {
        body = `${Array.from({ length: p.units }, (_, u) => {
          const x = 85 + u * 235;
          return `${rect(x, 110, 205, 220, "#e2d2b5", 'stroke="#8a7990" stroke-width="4"')}${rect(x + 7, 117, 191, 28, "#a6b0ce")}${label(x + 103, 137, `包裹 ${u + 1}`, 14)}${Array.from({ length: p.first }, (_, i) => ball(x + 42 + (i % 3) * 55, 179 + Math.floor(i / 3) * 40, m.first, 17)).join("")}${Array.from({ length: p.second }, (_, i) => ball(x + 42 + (i % 3) * 55, 260 + Math.floor(i / 3) * 40, m.second, 17)).join("")}${label(x + 103, 355, `${m.first}${p.first}${m.second}${p.second}`, 22)}`;
        }).join(
          "",
        )}${label(400, 400, "下标写在每一份里 · 系数数有多少份", 17)}`;
        break;
      }
      case "C06": {
        const half = (p.angle * Math.PI) / 360,
          s = Math.sin(half),
          c = Math.cos(half),
          yaw = ((options.view || 0) * Math.PI) / 180;
        const project = (v) => [
          400 + 145 * (v[0] * Math.cos(yaw) + v[2] * Math.sin(yaw)),
          235 +
            145 *
              (v[1] + 0.22 * (-v[0] * Math.sin(yaw) + v[2] * Math.cos(yaw))),
        ];
        let vectors = round
          ? [
              [s, c, 0],
              [-s, c, 0],
            ]
          : p.shape === "flat"
            ? [
                [1, 0, 0],
                [-1, 0, 0],
                [0, -1, 0],
                [0, 1, 0],
              ]
            : [
                [s, c, 0],
                [-s, c, 0],
                [0, -c, s],
                [0, -c, -s],
              ];
        if (round && p.shape === "linear")
          vectors = [
            [1, 0, 0],
            [-1, 0, 0],
          ];
        if (!round && p.shape === "bent")
          vectors = [
            [s, c, 0],
            [-s, c, 0],
          ];
        body = `<ellipse cx="400" cy="363" rx="213" ry="32" fill="#92687944"/>${rect(195, 362, 410, 20, "#c096a1")}${vectors
          .map((v) => {
            const [x, y] = project(v);
            return (
              line(
                400,
                235,
                x,
                y,
                "#8d7b85",
                v[2] < 0 ? 4 : 9,
                v[2] < 0 ? 'stroke-dasharray="6 7"' : "",
              ) + ball(x, y, "H", 22)
            );
          })
          .join(
            "",
          )}${ball(400, 235, round ? "O" : "C", 35)}${round ? `${dot(365, 181, "#a179ad", 5)}${dot(377, 172, "#a179ad", 5)}${dot(423, 172, "#a179ad", 5)}${dot(435, 181, "#a179ad", 5)}` : ""}${label(400, 105, `${round ? "H₂O" : "CH₄"} · ${p.angle}°`, 25)}${label(400, 411, "球棍投影 · 拖动金色手柄调节参考角", 14)}`;
        if (live && (p.shape === "tetra" || p.shape === "bent")) {
          const [x, y] = project(vectors[0]);
          body += `<g data-chem-angle data-scale="${Math.cos(yaw)}" data-yaw="${Math.sin(yaw)}" role="slider" tabindex="0" aria-label="参考键角，方向键调整" aria-valuemin="90" aria-valuemax="180" aria-valuenow="${p.angle}"><circle cx="${x}" cy="${y}" r="33" fill="transparent" stroke="#e0ae62" stroke-width="3" stroke-dasharray="5 5"/></g>`;
        }
        break;
      }
      case "C07": {
        const half = (p.angle * Math.PI) / 360,
          s = Math.sin(half),
          c = Math.cos(half),
          cx = 400,
          cy = 225;
        const left = [cx - 145 * s, cy + 145 * c],
          right = [cx + 145 * s, cy + 145 * c];
        body = `${line(cx, cy, ...left, "#807966", 7)}${line(cx, cy, ...right, "#807966", 7)}${ball(cx, cy, round ? "O" : "C", 30)}${ball(...left, round ? "H" : "O", 25)}${ball(...right, round ? "H" : "O", 25)}`;
        for (const sign of [-1, 1]) {
          const x = cx + sign * 60 * s,
            y = cy + 60 * c,
            dx = sign * s * 60 * p.pull,
            dy = c * 60 * p.pull;
          body += round
            ? arrows(x + dx, y + dy, x, y, "#bc7858")
            : arrows(x, y, x + dx, y + dy, "#bc7858");
        }
        if (m.net > 0.001)
          body += arrows(
            400,
            round ? cy - 42 : cy + 40,
            400,
            (round ? cy - 42 : cy + 40) + (round ? -1 : 1) * m.net * 53,
            "#638e6c",
          );
        body += `${label(400, 99, `${round ? "H₂O" : "CO₂"} · ${p.angle}°`, 26)}${label(400, 376, m.net < 0.001 ? "两根非零箭头 · 合量为 0" : `合偶极 ${m.net.toFixed(3)}（示意）`, 21)}${label(400, 407, "砖红：单键偶极 · 绿色：合偶极", 14)}`;
        if (live)
          body += `<g data-chem-angle data-scale="1" data-yaw="0" role="slider" tabindex="0" aria-label="两键夹角，方向键调整" aria-valuemin="90" aria-valuemax="180" aria-valuenow="${p.angle}"><circle cx="${right[0]}" cy="${right[1]}" r="34" fill="transparent" stroke="#b99052" stroke-width="3" stroke-dasharray="5 5"/></g>`;
        break;
      }
      case "C08": {
        if (!round) {
          const tilt = p.closed === "open" ? p.gas * 0.7 : 0;
          body = `${rect(380, 140, 24, 220, "#9d885c")}${rect(290, 357, 204, 15, "#ba9c6c")}<g transform="rotate(${-tilt} 392 185)">${line(178, 185, 610, 185, "#8a7655", 9)}${line(210, 185, 210, 291, "#b8a67a", 3)}${line(575, 185, 575, 291, "#b8a67a", 3)}${rect(143, 290, 135, 10, "#c4ae7c")}${rect(510, 290, 135, 10, "#c4ae7c")}${rect(163, 212, 95, 75, "#cee0cb", 'stroke="#7e9a88" stroke-width="3"')}${rect(169, 248, 83, 36, "#a7bf98")}${p.closed === "closed" ? rect(157, 203, 108, 12, "#8fa486") : ""}${rect(542, 238, 65, 48, "#a89c7b")}${label(575, 269, "100g", 17)}${Array.from({ length: p.gas }, (_, i) => `<g class="chem-gas" style="--bubble-delay:${i * -0.37}s">${dot(176 + (i % 4) * 20, p.closed === "closed" ? 230 + (i % 2) * 8 : 183 - (i % 3) * 18, "#f7f1c8", 3)}</g>`).join("")}</g>${label(210, 350, `${m.retained} g`, 23)}${label(580, 350, "100 g", 23)}${label(400, 405, p.closed === "closed" ? "气体也在称量边界内" : "逸出的气体离开了天平", 18)}`;
        } else
          body = `${label(400, 115, `${p.hydrogen}H₂ + ${p.oxygen}O₂ → ${p.water}H₂O`, 34)}${rect(100, 160, 260, 152, "#d7d9b3")}${rect(440, 160, 260, 152, "#d7d9b3")}${label(230, 192, "反应前", 17)}${label(570, 192, "反应后", 17)}${label(230, 242, `H: ${m.leftH}    O: ${m.leftO}`, 24)}${label(570, 242, `H: ${m.rightH}    O: ${m.rightO}`, 24)}${label(400, 360, `原子差额  H ${m.diffH} / O ${m.diffO}`, 23)}${label(400, 402, "调整系数，保留分子式的下标", 16)}`;
        break;
      }
      case "C09": {
        if (!round)
          body = `<path d="M0 290Q80 267 160 290T320 290T480 290T640 290T800 290V440H0Z" fill="#76a99c"/>${rect(80, 185, 150, 125, "#a6c5b9")}${rect(570, 185, 150, 125, "#d0a481")}${label(155, 175, "Zn → Zn²⁺", 22)}${label(645, 175, "Cu²⁺ → Cu", 22)}<g class="chem-ferry ${p.donor === "Cu" ? "reverse" : ""}">${rect(270, 253, 125, 20, "#bb9563")}${Array.from({ length: p.electrons }, (_, i) => `${dot(295 + i * 30, 235, "#f0d18c", 10)}${label(295 + i * 30, 240, "−", 16)}`).join("")}</g>${arrows(p.donor === "Zn" ? 280 : 520, 120, p.donor === "Zn" ? 520 : 280, 120, "#5e8c7c")}${label(400, 387, `${p.electrons} e⁻ · 从 ${p.donor} 出发`, 23)}`;
        else
          body = `${rect(185, 130, 220, 196, "#a7d3c7", 'stroke="#699d92" stroke-width="5"')}${rect(198, 200, 194, 112, "#80b8bb")}${rect(278, 103, 35, 193, "#8f9d97")}${rect(278 - Math.min(45, m.mass / 9), 205, Math.min(45, m.mass / 9), 90, "#cb9568")}${rect(480, 153, 160, 112, "#7b998b")}${rect(490, 165, 140, 62, "#e8e0bd")}${label(560, 203, `${p.charge} C`, 25)}${line(314, 110, 560, 110, "#8c775d", 5)}${line(560, 110, 560, 153, "#8c775d", 5)}${label(400, 366, `${m.mass.toFixed(1)} mg 铜 · 理想模型`, 25)}${label(400, 404, `每个 Cu²⁺ 接受 ${p.valence} e⁻${p.valence !== 2 ? " · 电荷不符" : ""}`, 17)}`;
        break;
      }
      case "C10": {
        const flow = m.connected;
        body = `${rect(110, 192, 200, 150, "#b5d8cf", 'stroke="#789d93" stroke-width="4"')}${rect(490, 192, 200, 150, "#91c0c7", 'stroke="#6c929a" stroke-width="4"')}${rect(120, 245, 180, 85, "#9dc6b7")}${rect(500, 245, 180, 85, "#75a8b6")}${rect(190, 158, 23, 153, "#b4b6a7")}${rect(580, 158, 23, 153, "#c99469")}${p.bridge === "on" ? `<path d="M272 253V166H529V253" fill="none" stroke="#e5dcb4" stroke-width="18"/>${label(400, 158, "离子通路", 13)}${flow ? `${label(340, 190, "← 阴离子", 12)}${label(470, 190, "阳离子 →", 12)}` : ""}` : label(400, 188, "盐桥缺失", 16)}${p.wire === "on" ? `<path class="${flow ? "chem-electron-flow" : ""}" d="M202 157V95H592V157" fill="none" stroke="#8d7058" stroke-width="6"/>${flow ? arrows(277, 95, 337, 95, "#f4d29b") : ""}` : `${line(202, 157, 202, 95, "#8d7058", 5)}${line(202, 95, 315, 95, "#8d7058", 5)}${line(490, 95, 592, 95, "#8d7058", 5)}${line(592, 95, 592, 157, "#8d7058", 5)}${label(400, 106, "导线断开", 16)}`}${rect(352, 70, 100, 55, "#ece4c8")}${line(402, 118, 402 + Math.min(35, m.current), 82, "#ad7452", 3)}${label(207, 373, "Zn · 负极", 20)}${label(592, 373, "Cu · 正极", 20)}${label(400, 409, `${m.current.toFixed(1)} mA · 电子沿外路 Zn → Cu`, 17)}`;
        break;
      }
    }
    if (options.instrumentOnly)
      return `<svg class="chem-scene subject-instrument" viewBox="0 0 800 440" role="img" aria-label="${esc(l.place + "：" + caption)}" ${live ? "data-chem-scene" : ""}><title>${esc(l.place)}</title>${body}</svg>`;
    const hills = `<path d="M0 183L85 118L166 174L278 89L419 193L534 118L682 181L756 115L800 159V440H0Z" fill="${l.ground}" opacity=".24"/>`;
    return `<svg class="chem-scene" viewBox="0 0 800 440" role="img" aria-label="${esc(l.place + "：" + caption)}" style="background:${l.sky}" ${live ? "data-chem-scene" : ""}><title>${esc(l.place + " · " + caption)}</title><defs><pattern id="${key}-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="#ffffff" stroke-opacity=".12"/></pattern></defs>${rect(0, 0, 800, 440, l.sky)}${rect(0, 0, 800, 440, `url(#${key}-grid)`)}${rect(640, 42, 45, 37, "#fff9dc", 'opacity=".65"')}${hills}${rect(0, 335, 800, 105, l.ground, 'opacity=".2"')}${[45, 725, 750].map((x, i) => `${rect(x, 225 - i * 16, 6, 99, l.ground)}${rect(x - 14, 206 - i * 16, 35, 34, l.ground, 'opacity=".65"')}`).join("")}${body}<g opacity=".26">${rect(0, 0, 800, 5, "#fff")}${rect(0, 435, 800, 5, l.bg)}</g></svg>`;
  }
  function island() {
    const trees = Array.from({ length: 130 }, (_, i) => {
      const x = 190 + ((i * 131) % 1200),
        y = 160 + ((i * 79) % 660);
      if ((x < 350 && y < 420) || (x > 1300 && y < 320)) return "";
      return `${rect(x + 7, y + 18, 6, 18, "#8a8266")}<path d="M${x - 5} ${y + 22}l15-30 15 30Z" fill="${["#759e88", "#88ab88", "#a2b68c"][i % 3]}"/>`;
    }).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><defs><pattern id="waves" width="95" height="70" patternUnits="userSpaceOnUse"><path d="M10 35q18-8 36 0t36 0" stroke="#f1f7eb" stroke-width="2" fill="none" opacity=".43"/></pattern><clipPath id="land"><path d="M206 634L250 442L321 353L300 257L455 171L616 135L719 168L873 100L1032 173L1110 159L1255 257L1285 370L1405 449L1453 621L1406 772L1245 866L1102 822L971 871L792 828L650 872L518 800L360 825L258 738Z"/></clipPath></defs><rect width="1600" height="1000" fill="#b6d4d8"/><rect width="1600" height="1000" fill="url(#waves)"/><path d="M195 650L240 450L305 350L290 260L455 155L615 120L719 150L875 88L1040 158L1120 146L1272 250L1305 365L1420 440L1470 620L1422 788L1245 884L1100 840L970 888L790 846L650 888L510 820L345 842L244 750Z" fill="#dae7cf" opacity=".7"/><path d="M206 672L250 480L321 391L300 295L455 209L616 173L719 206L873 138L1032 211L1110 197L1255 295L1285 408L1405 487L1453 659L1406 810L1245 904L1102 860L971 909L792 866L650 910L518 838L360 863L258 776Z" fill="#9aa68d"/><g clip-path="url(#land)"><rect x="150" y="85" width="1340" height="800" fill="#cbd6ad"/><path d="M170 500Q420 350 710 487T1470 490V950H170Z" fill="#b4c59f"/><path d="M310 250Q700 100 1100 280T1450 600" fill="none" stroke="#e2dfb8" stroke-width="110" opacity=".55"/><path d="M930 120Q870 330 1000 430T1080 630T1190 870" fill="none" stroke="#7eafb0" stroke-width="46"/><path d="M935 120Q875 330 1005 430T1085 630T1195 870" fill="none" stroke="#b7d5cb" stroke-width="21"/>${trees}<path d="M355 715L495 533L487 300L760 380L780 657L1080 650L1260 480L1130 280L800 210M1080 650L1320 710" fill="none" stroke="#e8dfb7" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/><path d="M355 715L495 533L487 300L760 380L780 657L1080 650L1260 480L1130 280L800 210M1080 650L1320 710" fill="none" stroke="#a4a78b" stroke-width="2" stroke-dasharray="3 15"/>${[
      [360, 710],
      [500, 530],
      [490, 300],
      [760, 380],
      [775, 660],
      [1080, 650],
      [1260, 480],
      [800, 210],
      [1130, 280],
      [1320, 710],
    ]
      .map(
        ([x, y]) =>
          `<ellipse cx="${x}" cy="${y + 25}" rx="92" ry="54" fill="#dce0bd" stroke="#b2bb97" stroke-width="3"/>`,
      )
      .join(
        "",
      )}<path d="M960 625L1130 676" stroke="#a48f72" stroke-width="34"/><path d="M960 618L1130 669" stroke="#dbcb9e" stroke-width="29"/><path d="M1094 650l-8 28m-12-33-8 28m-12-33-8 28m-12-33-8 28m-12-33-8 28" stroke="#a89d7a" stroke-width="2"/></g><path d="M306 774l-55 90h74l31-83" fill="#bba37d" stroke="#8d8d75" stroke-width="3"/><path d="M269 808h67m-73 12h69m-75 12h71" stroke="#ded0a9" stroke-width="3"/><g fill="#e2e8d2"><path d="M127 713l25-18 26 21-24 13Z"/><path d="M1417 271l31-9 21 22-35 11Z"/><path d="M1308 911l34-12 29 22-34 14Z"/></g><g fill="#749992" opacity=".35"><ellipse cx="154" cy="740" rx="42" ry="9"/><ellipse cx="1443" cy="309" rx="36" ry="8"/></g></svg>`;
  }
  const api = { portrait, landmark, scene, island };
  if (typeof module !== "undefined") module.exports = api;
  if (typeof window !== "undefined") window.AtlasChemistryArt = api;
})();
