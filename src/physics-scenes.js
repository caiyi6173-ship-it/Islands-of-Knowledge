/* Original storybook sets. Every moving measurement uses AtlasPhysicsModels. */
(() => {
  const M = window.AtlasPhysicsModels,
    A = window.AtlasPhysicsArt;
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
  const txt = (x, y, s, size = 15, color = "#5f7668", anchor = "start") =>
    `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${esc(s)}</text>`;
  const path = (d, c = "#8a9b82", w = 3, extra = "") =>
    `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const rect = (x, y, w, h, fill = "#e7d9b9", rx = 5) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
  const clickable = (action, label, body, drag = "") =>
    `<g role="button" tabindex="0" data-story-action="${action}" ${drag ? `data-drag="${drag}"` : ""} aria-label="${esc(label)}" class="scene-touch">${body}</g>`;
  const crate = (x, y, loaded = false) =>
    `<g transform="translate(${x} ${y})">${rect(0, 0, 36, 32, loaded ? "#bb8c57" : "#c7a877", 2)}${path("M2 2 34 30M34 2 2 30", "#836e4d", 1.4)}${path("M0 0H36V32H0Z", "#90774d", 1.5)}</g>`;
  const note = (x, y, label, value) =>
    `<g>${rect(x, y, 154, 55, "#f9f1de", 5)}${txt(x + 12, y + 19, label, 10, "#9e8d68")}${txt(x + 12, y + 43, value, 18, "#536e65")}</g>`;
  const floor = () =>
    `<path d="M0 465Q200 448 470 470T960 465V600H0Z" fill="#d8ddc3"/>${[0, 1, 2, 3, 4].map((i) => path(`M${i * 210} 500l90 80`, "#c4ccb0", 1)).join("")}`;
  function scene(id, p, view = {}) {
    const {
        phase = 0,
        running = false,
        step = 0,
        clues = [],
        pulse = 0,
        last = null,
      } = view,
      r = view.result || M.evaluate(id, p, step);
    let body = "",
      readout = [],
      bg = "#e9eddf";
    const arcWindow = (x, y, w = 125, h = 250) =>
      `<path d="M${x} ${y + h}V${y + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0v${h - w / 2}Z" fill="#c8d9ca" stroke="#bdc5aa" stroke-width="8"/>${path(`M${x + w / 2} ${y}v${h}M${x} ${y + 120}h${w}`, "#a9b69c", 4)}`;
    if (id === "P01") {
      bg = "#dce9df";
      body = `<circle cx="785" cy="108" r="49" fill="#f6e6ba"/><path d="M0 270 100 199 175 249 280 178 410 277Z" fill="#aec7b8"/><path d="M650 288 778 190 960 276V348H650Z" fill="#b9ceba"/>${rect(0, 325, 960, 275, "#91b9ad", 0)}${[0, 1, 2, 3, 4, 5].map((i) => path(`M${i * 178 - 20} ${390 + (i % 2) * 30}q45-8 80 0`, "#d0dfc5", 2)).join("")}<path d="M0 365H218V438H0Z" fill="#b29971"/>${path("M20 370V475M160 370V470", "#8c7c59", 12)}${path("M0 372H219", "#d0b78b", 9)}${rect(715, 274, 154, 154, "#d5c5a0")}${path("M701 275 792 202 884 275Z", "#5d8177", 5)}${rect(778, 336, 35, 92, "#849c82")}${txt(792, 307, "对岸码头", 13, "#8d7958", "middle")}`;
      const sink =
          running && !r.floats
            ? phase * 100
            : !running && last && !last.ok && !r.floats
              ? 70
              : 0,
        x =
          step && r.floats
            ? running
              ? 300 + phase * 310
              : last?.ok
                ? 610
                : 420
            : 420,
        y = 345 + sink + (r.floats ? p.cargo * 5 : 0);
      let hull =
        p.shape === "lump"
          ? '<ellipse cx="0" cy="0" rx="35" ry="32" fill="#ad855b" stroke="#806849" stroke-width="3"/>'
          : `<path d="M-${p.shape === "wide" ? 130 : 82} -5Q-55 100 ${p.shape === "wide" ? 130 : 82} -5Z" fill="#ad855b" stroke="#806849" stroke-width="4"/><path d="M-${p.shape === "wide" ? 130 : 82} -5Q0 28 ${p.shape === "wide" ? 130 : 82} -5" fill="none" stroke="#e5c98d" stroke-width="8"/>`;
      for (let i = 0; i < p.cargo; i++) hull += crate(-70 + i * 38, -38, true);
      body += `<g transform="translate(${x} ${y})">${hull}</g>${txt(75, 527, "码头上的四箱仪器 · 点击装船 / 卸下", 13, "#647c69")}`;
      for (let i = 0; i < 4; i++)
        body += clickable(
          `cargo:${i + 1}`,
          `装载${i + 1}箱器材`,
          crate(78 + i * 48, 465, i < p.cargo),
        );
      body +=
        note(660, 455, "船与货物总质量", r.mass.toFixed(1) + " kg") +
        note(660, 520, "进水前最大排水", r.capacity.toFixed(1) + " L");
      readout = [
        ["水面上的问题", r.floats ? "这艘船可以浮起" : "排水空间不足"],
        ["已装器材", p.cargo + " / 4 箱"],
      ];
    } else if (id === "P02") {
      body = `${floor()}${arcWindow(55, 60)}${arcWindow(770, 60)}${rect(310, 65, 340, 32, "#d2c7a6")}${txt(480, 87, "斜 面 钟 楼", 17, "#796c4e", "middle")}`;
      const steep = p.slope === "steep",
        oy = steep ? 225 : 275,
        dy = steep ? 23 : 14;
      body +=
        path(`M170 ${oy} 790 ${oy + dy * 10}`, "#a88754", 20) +
        path(`M170 ${oy - 9} 790 ${oy + dy * 10 - 9}`, "#e1cba0", 4);
      for (let i = 0; i <= 10; i++)
        body +=
          path(`M${170 + i * 58} ${oy + i * dy + 17}v9`, "#968966", 2) +
          txt(170 + i * 58, oy + i * dy + 46, i, 12, "#9b8f70", "middle");
      const maxTime = Math.sqrt(10 / (steep ? 2 : 1)),
        ballPos = running
          ? Math.min(10, (phase * maxTime) ** 2 * (steep ? 2 : 1))
          : last
            ? 10
            : 0;
      for (let i = 0; i < 3; i++) {
        const v = p.bells[i],
          x = 170 + v * 58,
          y = oy + v * dy - 62,
          hit = running && ballPos >= v;
        body += clickable(
          "bell:" + i,
          `移动第${i + 1}只钟`,
          `${rect(x - 28, y - 32, 56, 94, "#ffffff01")}${path(`M${x} ${y - 24}V${y - 8}`, "#776e55", 3)}<path d="M${x - 15} ${y + 14}Q${x - 14} ${y - 14} ${x} ${y - 14}Q${x + 14} ${y - 14} ${x + 15} ${y + 14}Z" fill="${hit ? "#f1ca6c" : "#c5a260"}" stroke="#9b814b" stroke-width="2"/><circle cx="${x}" cy="${y + 18}" r="4" fill="#927c4d"/>${txt(x, y - 32, i + 1, 11, "#a18d63", "middle")}`,
          "bell:" + i,
        );
      }
      body += `<circle cx="${170 + ballPos * 58}" cy="${oy + ballPos * dy - 21}" r="12" fill="#7f9c91" stroke="#546d63" stroke-width="3"/>${txt(480, 545, "拖动轨道上方的三只钟，寻找均匀的节拍", 14, "#8b8d70", "middle")}`;
      readout = [
        ["三个时间间隔", r.gaps.map((v) => v.toFixed(2)).join(" · ")],
        ["坡度", steep ? "陡坡" : "缓坡"],
      ];
    } else if (id === "P03") {
      bg = "#304e50";
      body = `${Array.from({ length: 35 }, (_, i) => `<circle cx="${(i * 127 + 43) % 960}" cy="${(i * 73 + 20) % 600}" r="${i % 4 === 0 ? 2 : 1}" fill="#eadfb7" opacity="${0.25 + (i % 3) * 0.15}"/>`).join("")}`;
      const maxR = Math.max(1.4, ...r.path.map((v) => Math.hypot(...v))),
        scale = Math.min(205, 270 / maxR),
        cx = 490,
        cy = 318,
        points = r.path.map(([x, y]) => [cx + x * scale, cy + y * scale]),
        n = Math.floor(phase * (points.length - 1)),
        point = points[running ? n : last ? points.length - 1 : 0];
      body += `<circle cx="${cx}" cy="${cy}" r="${scale * 0.68}" fill="#7d9a7d" stroke="#c0c39b" stroke-width="3"/><path d="M${cx - scale * 0.55} ${cy - 15}q${scale * 0.25}-${scale * 0.5} ${scale * 0.58} ${scale * 0.08}t${scale * 0.5} 0" fill="#a3b08a" opacity=".6"/>${path(`M${points.map((v) => v.join(",")).join("L")}`, "#edcc84", 2.5, 'stroke-dasharray="4 7" opacity=".6"')}${path(
        `M${points
          .slice(0, Math.max(1, n + 1))
          .map((v) => v.join(","))
          .join("L")}`,
        "#f0d392",
        3,
      )}<g transform="translate(${point[0]} ${point[1]})"><rect x="-10" y="-6" width="22" height="12" rx="3" fill="#f4e5b8"/><path d="M-6-6V6" stroke="#a99568"/></g>${txt(46, 60, "一场没有空气阻力的思想实验", 14, "#b8c7b5")}${txt(48, 555, "引力始终指向星球中心", 14, "#bbccb9")}`;
      readout = [
        ["水平初速度", p.speed.toFixed(2) + " × 圆轨道速度"],
        [
          "这一条轨迹",
          { ground: "落回地面", orbit: "封闭环绕", escape: "离开星球" }[r.kind],
        ],
      ];
    } else if (id === "P04") {
      body = `${floor()}${arcWindow(690, 65, 170, 270)}${path("M125 480V127H520V480", "#8b9475", 15)}<circle cx="180" cy="135" r="30" fill="#bfa77a" stroke="#867d5b" stroke-width="4"/><circle cx="480" cy="135" r="30" fill="#bfa77a" stroke="#867d5b" stroke-width="4"/>${path(`M180 135V${240 + phase * 130}M180 103H480V302`, p.connected ? "#a48c59" : "#b7baa1", 4, p.connected ? "" : 'stroke-dasharray="8 8"')}${rect(144, 240 + phase * 130, 72, 77, "#a7ad8b")}${txt(180, 283 + phase * 130, "10 kg", 14, "#f9f0d4", "middle")}${rect(375, 305, 213, 155, p.insulated ? "#acb796" : "#c5d6c0", 15)}${rect(391, 333, 181, 109, "#a6c6b9", 8)}${path("M480 271V413", "#907a50", 6)}<g transform="rotate(${phase * 840} 480 402)">${path("M420 402H540M480 365V438", "#9a8458", 8)}</g>${path("M641 307V453", "#c6bda1", 20)}${path(`M641 442V${442 - Math.min(116, (((p.heat || 0) + (running ? r.heatAdded * phase : 0)) / 4180) * 600)}`, "#b27959", 8)}<circle cx="641" cy="449" r="16" fill="#b27959"/>${txt(641, 284, "放大的温度刻度", 12, "#998e71", "middle")}${txt(480, 501, p.insulated ? "隔热层已包好" : "能量也会传向周围环境", 14, "#8a896c", "middle")}`;
      readout = [
        [
          "水的累计温升",
          (
            ((p.heat || 0) + (running ? r.heatAdded * phase : 0)) /
            4180
          ).toFixed(3) + " ℃",
        ],
        ["累计有效下落", p.drops + " 次"],
      ];
    } else if (id === "P05") {
      bg = "#dfe7d9";
      const beam = p.color === "blue" ? "#94b8cf" : "#e6c882";
      body = `${floor()}${[70, 790].map((x) => `<path d="M${x} 460V180q50-140 100 0V460" fill="#cad6b9"/>`).join("")}${rect(190, 408, 560, 45, "#c7b18b")}${path("M215 453V513M725 453V513", "#a38e68", 14)}${rect(155, 234, 76, 108, "#98aa91", 12)}<circle cx="218" cy="283" r="19" fill="${beam}"/>${path("M239 283H432", beam, 6)}${rect(432, 165, 22, 240, "#7c8c78", 2)}${rect(428, 268 - p.gap * 13, 30, 9, "#e1e8cf", 0)}${p.slits === "two" ? rect(428, 296 + p.gap * 13, 30, 9, "#e1e8cf", 0) : ""}${rect(732, 116, 34, 319, "#344b45", 3)}`;
      for (let y = 130; y < 425; y += 5) {
        const rel = (y - 275) / 60,
          I =
            p.slits === "two"
              ? Math.cos(
                  ((Math.PI * p.gap * 0.5 * 600) / r.wavelength) * rel,
                ) ** 2
              : 1;
        body += rect(736, y, 26, 5, beam, 0).replace(
          'fill="' + beam + '"',
          'fill="' + beam + '" opacity="' + (0.08 + 0.9 * I) + '"',
        );
      }
      const y1 = 272 - p.gap * 13,
        y2 = 300 + p.gap * 13;
      body += `<path d="M454 ${y1} 732 135V425Z" fill="${beam}" opacity=".12"/>${p.slits === "two" ? `<path d="M454 ${y2} 732 135V425Z" fill="${beam}" opacity=".12"/>` : ""}${path("M722 335H784", "#b28a45", 3)}${txt(794, 340, "刻线", 12, "#9f8955")}${txt(470, 510, r.dark && p.slits === "two" ? "“看见明亮，也要解释黑暗。”" : "让金色刻线落在一条暗纹里", 16, "#687c64", "middle")}`;
      readout = [
        ["目标处相对光强", Math.round(r.intensity * 100) + "%"],
        ["光的波长", r.wavelength + " nm"],
      ];
    } else if (id === "P06") {
      body = `${floor()}${arcWindow(65, 70)}${arcWindow(770, 70)}${rect(190, 377, 575, 39, "#bca47b")}${path("M224 415V493M728 415V493", "#9b8964", 16)}${path("M445 340V210H702V340H540", "#9a8e63", 4)}${rect(406, 238, 164, 120, "#b8c4a8", 10)}`;
      for (let i = 0; i < 8; i++)
        body += `<ellipse cx="${425 + i * 17}" cy="298" rx="14" ry="62" fill="none" stroke="#b39255" stroke-width="5"/>`;
      let mx = 150 + p.magnetX * 3.2;
      if (running && !step)
        mx = 150 + (view.from + (p.magnetX - view.from) * phase) * 3.2;
      body += clickable(
        "magnet",
        "拖动磁铁；也可使用推进和拉出按钮",
        `<g transform="translate(${mx} 281) rotate(${step && running && p.crank ? phase * 720 : 0})">${rect(-70, 0, 140, 35, "#a46650", 3)}${rect(0, 0, 70, 35, "#6a8993", 3)}${txt(-36, 24, "N", 15, "#fff0cf", "middle")}${txt(36, 24, "S", 15, "#fff0cf", "middle")}</g>`,
        "magnet",
      );
      const needle = running
        ? step
          ? Math.sin(phase * 18) * 50
          : pulse * 47
        : pulse * 47;
      body += `<path d="M615 230a76 76 0 0 1 152 0v39H615Z" fill="#f3e7c9" stroke="#9e9470" stroke-width="4"/>${path(`M691 249l${Math.sin((needle * Math.PI) / 180) * 62} ${-Math.cos((needle * Math.PI) / 180) * 62}`, "#9e7150", 3)}${txt(691, 188, "0", 12, "#9a8b6c", "middle")}${txt(691, 290, "检流计 · 停下归零", 12, "#8c8d71", "middle")}`;
      const glowing = (running && step && p.crank) || (step && view.completed);
      body += `<circle cx="727" cy="337" r="23" fill="${glowing ? "#f3d68d" : "#d4d9bd"}" stroke="#9e9d77" stroke-width="3"/>${path("M712 359H742M717 367H737", "#9a926c", 5)}`;
      if (p.crank)
        body +=
          path("M510 368H565V404H598", "#8e7a4d", 9) +
          `<circle cx="600" cy="405" r="13" fill="#9b8355"/>`;
      body += txt(
        480,
        528,
        glowing && !running
          ? "工人接手摇柄，继续输入机械能"
          : running
            ? "移动时，留意指针的方向"
            : "磁铁静止，指针回到零",
        14,
        "#78836b",
        "middle",
      );
      readout = [
        [
          "磁铁的来与回",
          `${clues.includes("in") ? "✓" : "○"} 推进　${clues.includes("out") ? "✓" : "○"} 拉出`,
        ],
        ["能量输入", p.crank ? "摇柄已连接" : "还没有连接摇柄"],
      ];
    } else if (id === "P07") {
      bg = "#dce7df";
      body = `<path d="M0 325Q210 285 370 355L333 600H0Z" fill="#acbda1"/><path d="M695 357Q840 291 960 318V600H665Z" fill="#bac8ab"/><path d="M330 375Q480 330 691 376V600H330Z" fill="#91b4a9"/>${[0, 1, 2].map((i) => path(`M${370 + i * 22} ${445 + i * 50}q70-18 155 0`, "#c8d9bd", 2)).join("")}`;
      for (const x of [250, 755])
        body +=
          path(
            `M${x - 35} 410 ${x} 130 ${x + 35} 410M${x - 25} 330H${x + 25}M${x - 18} 260H${x + 18}M${x - 10} 195H${x + 10}`,
            "#658275",
            7,
          ) + `<circle cx="${x}" cy="130" r="10" fill="#c9ab6c"/>`;
      for (let i = 0; i < 5; i++) {
        const rad = running ? 20 + ((phase * 280 + i * 58) % 300) : 35 + i * 49;
        body += `<path d="M${250 + rad * 0.65} ${260 - rad * 0.65}Q${250 + rad * 1.15} 260 ${250 + rad * 0.65} ${260 + rad * 0.65}" fill="none" stroke="#c4a261" stroke-width="2" opacity="${Math.max(0.1, 1 - rad / 330)}"/>`;
      }
      body += `${rect(150, 405, 186, 57, "#dfcfaa")}${rect(688, 405, 143, 57, "#dfcfaa")}<circle cx="760" cy="433" r="12" fill="${running && r.tuned ? "#efd287" : "#8e9e85"}"/>${txt(760, 490, "接收刻度 " + r.receiver, 16, "#647d6a", "middle")}${txt(245, 490, "发射刻度 " + p.frequency, 16, "#647d6a", "middle")}${txt(480, 540, step ? "对岸回信：请发送 · — ·" : "理论的预言，等待实验的回应", 15, "#7b876f", "middle")}`;
      readout = [
        ["接收信号", r.tuned ? "频段已匹配" : "尚未匹配"],
        [
          "发送的电报码",
          { S: "S　· · ·", O: "O　— — —", R: "R　· — ·" }[p.code],
        ],
      ];
    } else if (id === "P08") {
      body = `${floor()}${arcWindow(690, 60, 155, 270)}${rect(80, 122, 250, 280, "#b9b395")}${[0, 1, 2].map((i) => rect(92, 135 + i * 85, 225, 72, "#d1c8a8", 3) + path(`M185 ${165 + i * 85}h38`, "#968660", 4)).join("")}${rect(343, 393, 475, 40, "#bda781")}${path("M378 430V499M785 430V499", "#9b8964", 15)}${rect(548, 184, 194, 202, "#c6c4a3", 12)}${rect(569, 205, 153, 93, "#ede8cc", 3)}<path d="M587 275q56-80 116 0" fill="none" stroke="#b1ad85" stroke-width="2"/>${path(`M644 282l${running ? Math.sin(phase * 5) * 30 : 20} -52`, "#8a7855", 3)}${txt(644, 330, "测量信号", 14, "#7b8066", "middle")}`;
      const cols = {
        background: "#d4d2bb",
        uranium: "#aab89b",
        ore: "#8e9c8b",
        fraction: "#b3a8bc",
      };
      body += `<path d="M424 301 407 368H489L473 301V280H424Z" fill="${cols[p.sample]}" stroke="#7c8975" stroke-width="3"/>${path("M425 280H473", "#aeb49a", 7)}${txt(450, 391, { background: "空白", uranium: "铀参考", ore: "矿石", fraction: "强信号组分" }[p.sample], 12, "#667968", "middle")}`;
      const vals = Object.entries(r.means);
      for (let i = 0; i < 4; i++) {
        const [key, value] = vals[i],
          x = 100 + i * 200;
        body +=
          rect(x, 490, Math.min(165, value * 0.5), 12, cols[key]) +
          txt(
            x,
            532,
            {
              background: "空白",
              uranium: "铀参考",
              ore: "矿石",
              fraction: "强信号组分",
            }[key],
            13,
          ) +
          txt(
            x,
            555,
            r.counts[key]
              ? value.toFixed(0) + " · " + r.counts[key] + "次"
              : "尚未测量",
            12,
            "#9a8e73",
          );
      }
      readout = [
        [
          "当前样本",
          {
            background: "空白背景",
            uranium: "铀参考样本",
            ore: "矿石样本",
            fraction: "分离组分",
          }[p.sample],
        ],
        ["调查方式", "同条件对照 · 重复测量"],
      ];
    } else if (id === "P09") {
      bg = "#e5e3d5";
      body = `${floor()}${rect(60, 80, 210, 365, "#aa8a6e", 14)}<path d="M93 425V267a73 73 0 0 1 146 0v158Z" fill="#5c5149"/><path d="M109 421V282a57 57 0 0 1 114 0v139Z" fill="${p.temperature === "hot" ? "#edc67c" : "#ca925e"}"/>${path("M75 155H255M75 195H255M75 116H255", "#93775b", 2)}${txt(165, 474, p.temperature === "hot" ? "高温记录" : "较低温记录", 15, "#8e7353", "middle")}`;
      const chartX = 360,
        chartY = 120,
        chartW = 490,
        chartH = 215,
        scale = 92;
      body +=
        rect(chartX - 12, chartY - 25, chartW + 40, chartH + 60, "#f4edda", 7) +
        path(`M${chartX} ${chartY}v${chartH}h${chartW}`, "#a0a58a", 2);
      for (const [q, col] of [
        [true, "#728e7c"],
        [r.quantized, "#bd9861"],
      ]) {
        let d = "";
        for (let k = 1; k <= 90; k++) {
          const x = k / 20,
            v = r.spectrum(x, q),
            y = chartY + chartH - Math.min(chartH + 12, v * scale);
          d += (k === 1 ? "M" : "L") + (chartX + x * 100) + "," + y;
        }
        body += path(d, col, 3, q ? "" : 'stroke-dasharray="5 5"');
      }
      body +=
        txt(385, 104, "实测趋势 / 当前模型", 13, "#8f825f") +
        txt(853, 367, "频率 →", 11, "#939777", "end");
      for (let i = 1; i <= 3; i++) {
        const x = 390 + (i - 1) * 178,
          fed = p.fed.includes(i);
        body += clickable(
          "feed:" + i,
          `向${i === 1 ? "低" : i === 2 ? "中" : "高"}频振子送入能量包`,
          `${rect(x - 30, 420, 142, 110, fed ? "#d2dcb9" : "#dfdbc3", 9)}${path(`M${x + 40} 432v11l-12 12 24 13-24 13 12 12v14`, "#a28e5f", 3)}${txt(x + 40, 554, ["低频 · 1份", "中频 · 2份", "高频 · 3份"][i - 1], 12, "#8b8569", "middle")}${fed ? txt(x + 84, 444, "✓", 19, "#6d8b6f") : ""}`,
        );
      }
      readout = [
        ["交换规则", r.quantized ? "按频率分份" : "连续交换"],
        [
          "已送到的能量包",
          p.fed.length
            ? p.fed.map((n) => n + "份").join(" · ")
            : "选择包，点击振子",
        ],
      ];
    } else if (id === "P10") {
      bg = "#dce5df";
      body = `${floor()}${rect(602, 95, 214, 367, "#c9cbb1", 14)}<path d="M640 462V235a69 69 0 0 1 138 0v227Z" fill="#728d7d"/>${path("M708 170V459", "#bdc6a3", 4)}${rect(655, 270, 106, 95, "#b7a985", 5)}${rect(172, 269, 125, 82, "#9ca98c", 12)}<circle cx="290" cy="310" r="24" fill="${{ red: "#c28369", blue: "#83abc1", uv: "#aaa0bf" }[p.color]}"/>${path("M195 351V430M177 430H252", "#899577", 9)}`;
      const col = { red: "#d39b7d", blue: "#8ab7cc", uv: "#b3a4c6" }[p.color];
      body += `<path d="M315 290 655 267V364L315 330Z" fill="${col}" opacity="${0.12 + p.intensity * 0.045}"/>`;
      if (running && r.electrons) {
        for (let i = 0; i < Math.min(15, r.electrons); i++) {
          const t = (phase * 2 + i * 0.17) % 1;
          body += `<circle cx="${760 + t * 117}" cy="${277 + (i % 4) * 22}" r="4" fill="#cfb06e"/>`;
        }
        body += `<path d="M709 175V453" stroke="#ecd79a" stroke-width="5"/>`;
      }
      if (last?.ok && step)
        body += `<path d="M640 235 700 214V452L640 462Z" fill="#eadfbb"/>`;
      body +=
        txt(
          709,
          401,
          step ? "第二块金属" : "第一块金属",
          14,
          "#e2e5ca",
          "middle",
        ) +
        txt(
          480,
          531,
          r.electrons
            ? "有电子逸出，机关可以响应"
            : "没有电子逸出。继续观察光的频率。",
          15,
          "#75836c",
          "middle",
        );
      readout = [
        ["单个光子能量", r.photon.toFixed(2) + " eV"],
        ["当前金属逸出功", r.workFunction.toFixed(1) + " eV"],
      ];
    }
    return {
      svg: `<svg class="story-scene" viewBox="0 0 960 600" role="group" aria-label="${window.AtlasPhysicsData.byId[id].place}互动场景"><rect width="960" height="600" fill="${bg}"/>${body}<path d="M24 24H73M24 24V73M936 24H887M936 24V73M24 576H73M24 576V527M936 576H887M936 576V527" fill="none" stroke="${id === "P03" ? "#82978a" : "#b5ba9f"}" stroke-width="1" opacity=".55"/></svg>`,
      readout,
    };
  }
  window.AtlasPhysicsScenes = { render: scene };
})();
