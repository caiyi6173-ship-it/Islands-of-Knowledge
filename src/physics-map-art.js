/* Map miniatures follow the current experiments, using the atlas stone/brass palette. */
(() => {
  const wall = "#f3e8cf",
    stone = "#dfc798",
    ink = "#465b58",
    glass = "#aac0ad";
  const roofs = [
    "#c38d65",
    "#8da479",
    "#8b83b4",
    "#c08d60",
    "#a88baa",
    "#76a792",
    "#7c9fac",
    "#89a56d",
    "#b27859",
    "#ac8caf",
  ];
  const titles = [
    "载重船与排水试验池",
    "三只钟的斜面计时轨道",
    "地球与环绕轨道思想模型",
    "落锤、搅拌桨与测温水槽",
    "双狭缝与明暗干涉屏",
    "磁铁、线圈与感应电流表",
    "隔海相望的发射与接收塔",
    "矿石、空白参照与静电计",
    "黑体炉腔与分光测量台",
    "红蓝光源、金属与光电流表",
  ];
  function landmark(id) {
    const i = Number(id.slice(1)) - 1,
      roof = roofs[i];
    if (!roof) return "";
    const house = (x = 24, y = 55, w = 108, h = 49) =>
      `<path d="M${x} ${y}h${w}v${h}H${x}Z" fill="${wall}" stroke="${ink}"/><path d="M${x - 7} ${y} ${x + w / 2} ${y - 25} ${x + w + 7} ${y}Z" fill="${roof}" stroke="${ink}"/><path d="M${x + 10} ${y + 14}h13v18h-13ZM${x + w - 23} ${y + 14}h13v18h-13Z" fill="${glass}"/>`;
    const dial = (x, y, r = 11) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${wall}" stroke="${ink}" stroke-width="1.8"/><path d="M${x} ${y + r - 3}V${y}l${r - 4}-${r - 4}" fill="none" stroke="${roof}" stroke-width="2"/>`;
    const bell = (x, y) =>
      `<path d="M${x} ${y}v10m-7 11v-5a7 7 0 0 1 14 0v5l3 3h-20Z" fill="${stone}" stroke="${ink}"/><circle cx="${x}" cy="${y + 26}" r="2" fill="${ink}"/>`;
    const tower = (x, y, h) =>
      `<path d="M${x - 11} ${y + h} ${x} ${y} ${x + 11} ${y + h}M${x - 7} ${y + h * 0.7}h14M${x - 5} ${y + h * 0.4}h10" fill="none" stroke="${ink}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="4" fill="${stone}" stroke="${ink}"/>`;
    let body = "";
    switch (id) {
      case "P01":
        body = `<path d="M8 94h48v16H8ZM45 86h96v24H45Z" fill="${wall}" stroke="${ink}"/><path d="M50 96h86" stroke="${glass}" stroke-width="7"/><path d="M50 88h83l-15 17H67Z" fill="${roof}" stroke="${ink}"/><path d="M85 25v61m2-56 29 43H87Z" fill="${wall}" stroke="${ink}"/><g fill="${stone}" stroke="${ink}"><path d="M15 72h14v14H15Zm16 0h14v14H31Zm-16-16h14v14H15Zm16 0h14v14H31Z"/></g><path d="M17 109h120" stroke="${stone}" stroke-width="4"/>`;
        break;
      case "P02":
        body =
          house(19, 37, 36, 68) +
          dial(37, 54, 11) +
          `<path d="M56 105V31m-7-1 89 58" stroke="${ink}" stroke-width="3"/><path d="M35 42 136 98" stroke="${roof}" stroke-width="7"/>` +
          bell(65, 34) +
          bell(91, 52) +
          bell(128, 77) +
          `<circle cx="45" cy="43" r="6" fill="${stone}" stroke="${ink}"/>`;
        break;
      case "P03":
        body = `<path d="M7 107 28 76 52 96 83 52 111 88l20-17 17 36Z" fill="${glass}" stroke="${ink}"/><circle cx="82" cy="50" r="27" fill="${wall}" stroke="${ink}" stroke-width="2"/><path d="M59 45q23-23 42 6l-12 6-3 17-14-12-11-1Z" fill="${glass}"/><ellipse cx="82" cy="50" rx="49" ry="16" transform="rotate(-29 82 50)" fill="none" stroke="${roof}" stroke-width="3"/><circle cx="120" cy="20" r="5" fill="${stone}" stroke="${ink}"/><path d="M19 88h24l7-7-17-7-14 6Z" fill="${stone}" stroke="${ink}"/><path d="M22 89v13m19-13v13" stroke="${ink}" stroke-width="3"/>`;
        break;
      case "P04":
        body =
          house(24, 60, 106, 45) +
          `<path d="M32 43V11h88v32M43 11v44m66-44v44" stroke="${ink}" stroke-width="3" fill="none"/><circle cx="43" cy="17" r="7" fill="${stone}" stroke="${ink}"/><circle cx="109" cy="17" r="7" fill="${stone}" stroke="${ink}"/><path d="M34 46h18v23H34Zm66 0h18v23h-18Z" fill="${roof}" stroke="${ink}"/><path d="M58 62h37v36H58Z" fill="${stone}" stroke="${ink}"/><path d="M76 18v67m-11-5h22m-22 7h22" stroke="${ink}" stroke-width="3"/><path d="M101 72V49" stroke="${roof}" stroke-width="3"/><circle cx="101" cy="76" r="5" fill="${glass}" stroke="${roof}" stroke-width="2"/>`;
        break;
      case "P05":
        body = `<path d="M12 107h132" stroke="${stone}" stroke-width="6"/><path d="M19 97V39h29v58" fill="${roof}" stroke="${ink}"/><path d="M28 48v28m11-28v28" stroke="${wall}" stroke-width="3"/><path d="M101 24h37v71h-37Z" fill="${wall}" stroke="${ink}"/><path d="M108 29v61m7-61v61m8-61v61m7-61v61" stroke="${roof}" stroke-width="3"/><path d="M42 54 101 35M42 69l59 13" stroke="${stone}" stroke-width="2" fill="none"/><path d="M22 26 75 6 142 26" fill="${glass}" stroke="${ink}"/><path d="M75 28v70M114 94v12" stroke="${ink}" stroke-width="3"/>`;
        break;
      case "P06":
        body =
          house() +
          `<path d="M17 104h126" stroke="${stone}" stroke-width="5"/><path d="M37 71h68" stroke="${ink}" stroke-width="4"/><g fill="none" stroke="${roof}" stroke-width="4">${[60, 67, 74, 81].map((x) => `<ellipse cx="${x}" cy="71" rx="9" ry="18"/>`).join("")}</g><path d="M24 48h17v10H33v21h8v10H24Z" fill="${stone}" stroke="${ink}"/><circle cx="114" cy="78" r="16" fill="${glass}" stroke="${ink}"/><path d="M114 78l10-12h13" stroke="${ink}" stroke-width="3" fill="none"/>` +
          dial(81, 22, 14);
        break;
      case "P07":
        body =
          `<path d="M8 106q18-10 36 0t36 0t36 0t36 0" stroke="${glass}" stroke-width="6" fill="none"/><path d="M8 91h48v14H8Zm93 0h47v14h-47Z" fill="${wall}" stroke="${ink}"/>` +
          tower(32, 16, 74) +
          tower(124, 27, 63) +
          `<path d="M58 35q21 19 0 38m19-47q30 26 0 53M16 83h12m7 0h13m61-1h8m5 0h13" fill="none" stroke="${roof}" stroke-width="2.5"/>`;
        break;
      case "P08":
        body =
          house(20, 55, 116, 49) +
          `<path d="M61 30h34v22H61Z" fill="${wall}" stroke="${ink}"/>` +
          dial(78, 24, 16) +
          `<path d="M38 75h24v19H38Zm54 0h25v19H92Z" fill="${glass}" stroke="${ink}"/><path d="m43 87 6-9 9 7-3 6Zm52 2 7-13 11 5-3 10Z" fill="${roof}" stroke="${ink}"/><path d="M39 98h22m32 0h24" stroke="${stone}" stroke-width="3"/>`;
        break;
      case "P09":
        body =
          house(15, 56, 78, 49) +
          `<path d="M25 31V8h16v31" fill="${roof}" stroke="${ink}"/><path d="M37 104V78a17 17 0 0 1 34 0v26Z" fill="${ink}"/><circle cx="54" cy="86" r="7" fill="#db9d65"/><path d="M91 84h52m-47 0v21m42-21v21" stroke="${ink}" stroke-width="3"/><path d="m108 60-8 20h23Z" fill="${glass}" stroke="${ink}"/><path d="M87 81 108 70m10 2 18-12m-17 15 19-6m-18 9 19 1" stroke="${stone}" stroke-width="2"/>`;
        break;
      case "P10":
        body =
          house(35, 62, 99, 43) +
          `<path d="M58 70v-22a26 26 0 0 1 52 0v22Z" fill="${glass}" stroke="${ink}"/><path d="M82 31v40m-9-20h18" stroke="${ink}" stroke-width="3"/><path d="M10 44h22v13H10Zm0 26h22v13H10Z" fill="${wall}" stroke="${ink}"/><path d="M31 48 72 43M31 77l41-22" stroke="${stone}" stroke-width="3"/><path d="M10 45h8v11h-8Z" fill="#bd766c"/><path d="M10 71h8v11h-8Z" fill="#7197bb"/><path d="M82 73v13h40" stroke="${ink}" stroke-width="2" fill="none"/>` +
          dial(121, 78, 12);
        break;
    }
    return `<svg viewBox="0 0 155 120" aria-hidden="true" class="landmark-drawing"><title>${titles[i]}</title><ellipse cx="78" cy="109" rx="65" ry="8" fill="${ink}" opacity=".18"/>${body}</svg>`;
  }
  const api = { landmark };
  if (typeof window !== "undefined") window.AtlasPhysicsMapArt = api;
  if (typeof module !== "undefined") module.exports = api;
})();
