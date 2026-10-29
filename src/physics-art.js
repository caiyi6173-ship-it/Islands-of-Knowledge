/* Original SVG ink portraits and miniature landmarks. All figures are illustrative. */
(() => {
  const palettes = [
    "#8c9fc5",
    "#bdcbea",
    "#8c9fc5",
    "#8c9fc5",
    "#bdcbea",
    "#8c9fc5",
    "#8c9fc5",
    "#8c9fc5",
    "#8c9fc5",
    "#bdcbea",
  ];
  function portrait(id) {
    const i = Number(id.slice(1)) - 1,
      c = palettes[i],
      curie = i === 7,
      newton = i === 2,
      einstein = i === 9,
      beard = [0, 1, 3, 6].includes(i);
    const hair = curie
      ? '<path d="M34 54Q24 28 46 22Q49 10 65 17Q82 15 83 32Q94 42 81 62L75 35Q52 47 39 37Z" fill="#667a9d"/>'
      : newton
        ? '<path d="M28 104Q13 86 24 68Q12 53 28 41Q19 23 40 19Q50 8 64 20Q80 9 87 28Q105 34 90 53Q106 67 91 80Q101 98 83 108L77 38L39 38Z" fill="#dfe8fa" stroke="#8c9fc5"/>'
        : einstein
          ? '<path d="M31 64L18 51 28 48 17 34 34 37 28 22 45 29 54 14 64 27 81 19 79 33 99 29 88 42 101 48 85 57 83 69 76 34 43 35Z" fill="#eef3ff" stroke="#bdcbea"/>'
          : i === 8
            ? '<path d="M35 63Q26 27 43 25L42 36Q29 44 35 65M79 62Q93 33 75 27L77 40Z" fill="#8c9fc5"/>'
            : `<path d="M30 64Q17 27 43 22Q70 6 86 35L82 66 76 40Q53 47 38 34Z" fill="${i === 0 ? "#dfe8fa" : "#667a9d"}"/>`;
    return `<svg viewBox="0 0 120 150" class="scientist-portrait" aria-hidden="true"><defs><pattern id="etch-${id}" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 5 5 0" stroke="#667a9d" stroke-width=".4" opacity=".2"/></pattern></defs><path d="M9 144V55a51 51 0 0 1 102 0v89Z" fill="#eef3ff"/><circle cx="60" cy="65" r="44" fill="${c}" opacity=".2"/>${hair}<path d="M40 94 35 111 17 126 14 150H108L104 124 79 110 77 92Z" fill="${c}" stroke="#667a9d" stroke-width="1"/><path d="M49 91 46 111 60 126 76 110 70 89Z" fill="#dcc29f"/><path d="M36 53Q36 31 59 31Q83 31 82 56L78 83Q73 101 60 103Q45 100 38 82Z" fill="#e4c9a4" stroke="#8c9fc5" stroke-width="1.2"/><path d="M40 62 51 60M67 60 78 62" stroke="#667a9d" stroke-width="1.8"/><circle cx="47" cy="66" r="1.7" fill="#667a9d"/><circle cx="72" cy="66" r="1.7" fill="#667a9d"/><path d="M60 64 56 79 62 80M52 89Q61 93 69 87" fill="none" stroke="#9b7d60" stroke-width="1.1"/>${beard ? `<path d="M37 76Q45 85 52 83L60 80 67 83 79 76Q83 107 60 ${i === 0 ? 126 : 114}Q35 104 37 76Z" fill="${i === 0 || i === 1 ? "#dfe8fa" : "#667a9d"}"/><path d="M53 88H66M46 94 53 109M61 95 62 117M73 91 70 107" stroke="#667a9d" stroke-width=".7" opacity=".5"/>` : einstein ? '<path d="M47 84Q61 78 75 86L69 90H49Z" fill="#bdcbea"/>' : ""}${i === 8 ? '<g fill="none" stroke="#667a9d"><ellipse cx="46" cy="64" rx="12" ry="9"/><ellipse cx="73" cy="64" rx="12" ry="9"/><path d="M58 63H61"/></g>' : ""}${curie ? '<path d="M42 111 60 130 79 111M60 130V150" fill="none" stroke="#eef3ff" stroke-width="2"/>' : '<path d="M39 111 50 136 60 124 72 136 82 111M60 125V150" fill="#f8faff" stroke="#8c9fc5" stroke-width="1"/>'}<path d="M15 144 25 126 37 120 52 150H15M74 149 82 121 101 132 106 149Z" fill="url(#etch-${id})"/><path d="M8 148H112" stroke="#bdcbea"/></svg>`;
  }
  function landmark(id) {
    let b = "";
    const wall = "#eef3ff",
      roof = "#8c9fc5",
      dark = "#667a9d",
      gold = "#dfe8fa";
    const house = (x, y, w, h) =>
      `<path d="M${x} ${y}h${w}v${h}h-${w}Z" fill="${wall}" stroke="#8c9fc5"/><path d="M${x - 8} ${y} ${x + w / 2} ${y - 24} ${x + w + 8} ${y}Z" fill="${roof}" stroke="${dark}"/><path d="M${x + 12} ${y + 13}h13v18h-13ZM${x + w - 26} ${y + 13}h13v18h-13Z" fill="#bdcbea"/>`;
    switch (id) {
      case "P01":
        b = `<path d="M16 88Q75 72 138 91" fill="none" stroke="#dfe8fa" stroke-width="12"/><path d="M23 72H127L111 98H44Z" fill="#8c9fc5" stroke="#667a9d"/><path d="M76 18V77M78 23 112 65H79Z" fill="#f8faff" stroke="#8c9fc5"/><path d="M9 99H49M18 104H56" stroke="#dfe8fa" stroke-width="7"/>`;
        break;
      case "P02":
        b =
          house(47, 31, 54, 72) +
          `<path d="M41 32 74 0 107 32Z" fill="#8c9fc5"/><circle cx="74" cy="49" r="14" fill="#f8faff" stroke="#bdcbea"/><path d="M74 38V49L84 53" stroke="#667a9d" fill="none"/><path d="M20 98 122 68" stroke="#8c9fc5" stroke-width="6"/><circle cx="36" cy="89" r="6" fill="#dfe8fa"/>`;
        break;
      case "P03":
        b =
          house(26, 61, 98, 44) +
          `<path d="M31 60a44 44 0 0 1 88 0Z" fill="#bdcbea" stroke="${dark}"/><path d="M68 17V63M80 18 88 61" stroke="#dfe8fa"/><path d="M99 38 129 21" stroke="#bdcbea" stroke-width="12"/><path d="M111 103 130 68" stroke="${dark}" stroke-width="4"/><circle cx="131" cy="23" r="4" fill="#eef3ff"/>`;
        break;
      case "P04":
        b =
          house(32, 48, 89, 55) +
          `<circle cx="39" cy="81" r="25" fill="#bdcbea" stroke="#8c9fc5" stroke-width="4"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((n) => `<path d="M39 81 39 57" transform="rotate(${n * 45} 39 81)" stroke="#8c9fc5" stroke-width="3"/>`).join("")}<path d="M4 110H143" stroke="#dfe8fa" stroke-width="8"/>`;
        break;
      case "P05":
        b = `<path d="M20 99 42 36 63 99M88 99 108 35 132 99" fill="#bdcbea"/><path d="M30 96V39H120V96" fill="none" stroke="${wall}" stroke-width="13"/><path d="M72 38V93M83 38V93" stroke="#bdcbea" stroke-width="3"/><path d="M12 108H143" stroke="#dfe8fa" stroke-width="6"/><circle cx="24" cy="102" r="7" fill="#dfe8fa"/><circle cx="137" cy="95" r="9" fill="#dfe8fa"/>`;
        break;
      case "P06":
        b =
          house(24, 57, 109, 47) +
          `<path d="M36 38V7H56V39" fill="#bdcbea" stroke="#8c9fc5"/><path d="M28 57V39H123V57" fill="${wall}" stroke="#8c9fc5"/><path d="M58 52V89M66 52V89M74 52V89M82 52V89M90 52V89" stroke="#bdcbea" stroke-width="5"/><path d="M113 71V102" stroke="${dark}" stroke-width="5"/><circle cx="113" cy="69" r="10" fill="#eef3ff"/>`;
        break;
      case "P07":
        b = `<path d="M63 108 78 17 94 108M68 82H90M72 60H87M74 39H83" stroke="${dark}" stroke-width="4" fill="none"/><circle cx="78" cy="15" r="7" fill="${gold}"/><path d="M48 24Q30 44 48 63M108 24Q126 44 108 63M34 12Q4 44 34 77M121 12Q151 44 121 77" stroke="#dfe8fa" fill="none" stroke-width="3"/>`;
        break;
      case "P08":
        b =
          house(25, 49, 105, 56) +
          `<path d="M40 48V21H112V48" fill="#eef3ff" stroke="#8c9fc5"/><path d="M70 21V7H81V21" stroke="${dark}" fill="#dfe8fa"/><path d="M61 76 55 95H76L69 76V66H61Z" fill="#dfe8fa" stroke="#8c9fc5"/><path d="M91 78 86 95H108L101 78V67H91Z" fill="#dfe8fa" stroke="#8c9fc5"/>`;
        break;
      case "P09":
        b = `<path d="M26 106V46L47 23H111L134 46V106Z" fill="#bdcbea" stroke="#667a9d"/><path d="M21 46 46 15H111L140 46Z" fill="#8c9fc5"/><path d="M53 106V70a27 27 0 0 1 54 0v36" fill="#667a9d"/><path d="M61 103V76a19 19 0 0 1 38 0v27" fill="#bdcbea"/><path d="M67 102Q57 82 77 74Q70 93 91 84Q104 104 91 105Z" fill="#eef3ff"/>`;
        break;
      case "P10":
        b = `<path d="M33 109V39H123V109" fill="${wall}" stroke="#8c9fc5"/><path d="M24 39 77 9 133 39Z" fill="${roof}"/><path d="M54 108V65a24 24 0 0 1 48 0v43Z" fill="#8c9fc5"/><path d="M78 44V104" stroke="#dfe8fa"/><circle cx="111" cy="79" r="6" fill="#eef3ff"/><path d="M11 69 28 63 48 78 28 92 11 86Z" fill="#dfe8fa"/><path d="M40 75 66 70 66 88 40 83Z" fill="#dfe8fa" opacity=".8"/>`;
        break;
    }
    const roofColor = [
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
    ][Number(id.slice(1)) - 1];
    const colors = {
      "#eef3ff": "#f3e8cf",
      "#dfe8fa": "#dfc798",
      "#bdcbea": "#aac0ad",
      "#8c9fc5": roofColor,
      "#667a9d": "#465b58",
      "#f8faff": "#fffae9",
    };
    return `<svg viewBox="0 0 155 120" aria-hidden="true" class="landmark-drawing"><ellipse cx="78" cy="109" rx="65" ry="8" fill="#465b58" opacity=".18"/>${b}</svg>`.replace(
      /#[a-f\d]{6}/gi,
      (color) => colors[color] || color,
    );
  }
  const api = { portrait, landmark };
  if (typeof window !== "undefined") window.AtlasPhysicsArt = api;
  if (typeof module !== "undefined") module.exports = api;
})();
