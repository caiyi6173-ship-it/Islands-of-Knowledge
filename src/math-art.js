/* Original SVG ink portraits and miniature landmarks for Math Island. */
(() => {
  const palettes = [
    "#8565b5",
    "#9c7248",
    "#5679a8",
    "#6c8c5d",
    "#b07357",
    "#996b94",
    "#5b8782",
    "#80709b",
    "#4d7e91",
    "#786596",
  ];

  function portrait(id) {
    const i = Number(id.slice(1)) - 1;
    const c = palettes[i] || "#8565b5";

    // Mathematician specific hairstyles, caps and facial features:
    // 0: Pythagoras (turban/band, beard)
    // 1: Al-Khwarizmi (oriental turban, beard)
    // 2: Descartes (17th c. wavy dark hair, mustache)
    // 3: Euler (soft nightcap/silk turban)
    // 4: Fermat (long dark curly locks, lawyer collar)
    // 5: Klein (neat 19th c. parted hair, mustache)
    // 6: Euclid (Greek philosopher grey curly hair, full beard)
    // 7: Hamilton (19th c. sideburns, wavy hair)
    // 8: Leibniz (grand European baroque wig)
    // 9: Gauss (velvet scholar bonnet cap)

    let headpiece = "";
    if (i === 0) {
      headpiece = `<path d="M30 48Q35 20 60 20Q85 20 90 48Z" fill="#e8dfd2"/><path d="M30 45H90V52H30Z" fill="#a488c9"/>`;
    } else if (i === 1) {
      headpiece = `<ellipse cx="60" cy="36" rx="34" ry="22" fill="#f0ebe0"/><path d="M32 42Q60 48 88 42" stroke="#9c7248" stroke-width="3" fill="none"/>`;
    } else if (i === 2) {
      headpiece = `<path d="M26 100Q16 55 36 34Q60 22 84 34Q104 55 94 100L86 42Q60 30 34 42Z" fill="#363942"/>`;
    } else if (i === 3) {
      headpiece = `<ellipse cx="60" cy="34" rx="30" ry="18" fill="#d9dfd4"/><path d="M34 38Q60 44 86 38" stroke="#6c8c5d" stroke-width="3" fill="none"/>`;
    } else if (i === 4) {
      headpiece = `<path d="M24 95Q14 50 34 32Q60 20 86 32Q106 50 96 95L88 40Q60 30 32 40Z" fill="#2c2a30"/>`;
    } else if (i === 5) {
      headpiece = `<path d="M32 48Q40 24 60 24Q80 24 88 48L84 34Q60 28 36 34Z" fill="#4a3e48"/>`;
    } else if (i === 6) {
      headpiece = `<path d="M28 85Q18 40 40 24Q60 18 80 24Q102 40 92 85L84 38Q60 28 36 38Z" fill="#d0d5d4"/>`;
    } else if (i === 7) {
      headpiece = `<path d="M30 52Q40 26 60 26Q80 26 90 52L86 36Q60 30 34 36Z" fill="#4d4458"/>`;
    } else if (i === 8) {
      headpiece = `<path d="M22 110Q10 75 22 50Q14 30 36 20Q60 10 84 20Q106 30 98 50Q110 75 98 110L88 40Q60 28 32 40Z" fill="#3a454d"/>`;
    } else if (i === 9) {
      headpiece = `<ellipse cx="60" cy="36" rx="28" ry="16" fill="#3a3045"/><path d="M34 42Q60 48 86 42" stroke="#786596" stroke-width="4" fill="none"/>`;
    }

    const hasBeard = [0, 1, 6].includes(i);
    const hasMustache = [2, 5].includes(i);

    return `<svg viewBox="0 0 120 150" class="scientist-portrait" aria-hidden="true">
      <defs>
        <pattern id="etch-m-${id}" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M0 5 5 0" stroke="${c}" stroke-width=".4" opacity=".25"/>
        </pattern>
      </defs>
      <path d="M9 144V55a51 51 0 0 1 102 0v89Z" fill="#f7f5fa"/>
      <circle cx="60" cy="65" r="44" fill="${c}" opacity=".18"/>
      ${headpiece}
      <path d="M40 94 35 111 17 126 14 150H108L104 124 79 110 77 92Z" fill="${c}" stroke="#524a61" stroke-width="1"/>
      <path d="M49 91 46 111 60 126 76 110 70 89Z" fill="#e6d5bf"/>
      <path d="M36 53Q36 31 59 31Q83 31 82 56L78 83Q73 101 60 103Q45 100 38 82Z" fill="#eccfa8" stroke="#8565b5" stroke-width="1.2"/>
      <path d="M40 62 51 60M67 60 78 62" stroke="#524a61" stroke-width="1.8"/>
      <circle cx="47" cy="66" r="1.7" fill="#524a61"/>
      <circle cx="72" cy="66" r="1.7" fill="#524a61"/>
      <path d="M60 64 56 78 62 79M52 87Q61 91 69 85" fill="none" stroke="#8d6849" stroke-width="1.1"/>
      ${hasBeard ? `<path d="M37 76Q45 85 52 83L60 80 67 83 79 76Q83 108 60 122Q35 108 37 76Z" fill="${i === 6 ? "#d0d5d4" : "#4a3e48"}" stroke="#3a3045" stroke-width=".8"/>` : ""}
      ${hasMustache ? `<path d="M48 83Q60 79 72 83Q66 87 60 86Q54 87 48 83Z" fill="#2c2a30"/>` : ""}
      <path d="M39 111 50 136 60 124 72 136 82 111M60 125V150" fill="#fcfbfe" stroke="#8565b5" stroke-width="1"/>
      <path d="M15 144 25 126 37 120 52 150H15M74 149 82 121 101 132 106 149Z" fill="url(#etch-m-${id})"/>
      <path d="M8 148H112" stroke="#bdaacc"/>
    </svg>`;
  }

  function landmark(id) {
    const accent = palettes[Number(id.slice(1)) - 1] || "#8565b5";
    const wall = "#f4f1ea",
      dark = "#3b3646",
      stone = "#cfc8be";

    let b = "";
    switch (id) {
      case "M01": // 琴弦数轴庭院
        b = `<path d="M20 95H130V105H20Z" fill="${stone}" stroke="${dark}" stroke-width="2"/>
             <path d="M28 95V55M122 95V55" stroke="${dark}" stroke-width="6"/>
             <path d="M28 60H122" stroke="${accent}" stroke-width="4"/>
             <path d="M28 75H122" stroke="${accent}" stroke-width="2"/>
             <circle cx="65" cy="60" r="5" fill="#f8e5b8" stroke="${dark}"/>
             <circle cx="85" cy="75" r="5" fill="#f8e5b8" stroke="${dark}"/>
             ${[35, 50, 65, 80, 95, 110].map((x) => `<path d="M${x} 95v5" stroke="${dark}" stroke-width="2"/>`).join("")}`;
        break;
      case "M02": // 天平广场
        b = `<path d="M30 108H120V114H30Z" fill="${stone}"/>
             <path d="M75 108V40" stroke="${dark}" stroke-width="5"/>
             <circle cx="75" cy="40" r="6" fill="#f8e5b8" stroke="${dark}"/>
             <path d="M35 48 115 48" stroke="${accent}" stroke-width="4"/>
             <path d="M35 48 25 78H55L45 48" fill="none" stroke="${dark}" stroke-width="1.5"/>
             <path d="M115 48 105 78H135L125 48" fill="none" stroke="${dark}" stroke-width="1.5"/>
             <rect x="33" y="66" width="14" height="12" rx="2" fill="#bfa370"/>
             <circle cx="120" cy="72" r="5" fill="${stone}" stroke="${dark}"/>`;
        break;
      case "M03": // 苍蝇测绘台
        b = `<rect x="25" y="30" width="100" height="75" rx="4" fill="${wall}" stroke="${dark}" stroke-width="2"/>
             <path d="M25 67H125M75 30V105" stroke="${accent}" stroke-width="2"/>
             ${[40, 55, 90, 105].map((x) => `<path d="M${x} 30V105" stroke="${stone}" stroke-width="1"/>`).join("")}
             ${[42, 54, 80, 92].map((y) => `<path d="M25 ${y}H125" stroke="${stone}" stroke-width="1"/>`).join("")}
             <circle cx="90" cy="54" r="5" fill="#d95d5d" stroke="${dark}"/>
             <circle cx="90" cy="54" r="10" fill="none" stroke="#d95d5d" stroke-dasharray="2,2"/>`;
        break;
      case "M04": // 秩序机器花园
        b = `<rect x="24" y="52" width="102" height="52" rx="3" fill="${wall}" stroke="${dark}" stroke-width="2"/>
             <path d="M15 70H30M120 70H135" stroke="${accent}" stroke-width="6"/>
             <circle cx="55" cy="78" r="18" fill="${stone}" stroke="${dark}" stroke-width="2"/>
             <circle cx="90" cy="74" r="14" fill="${stone}" stroke="${dark}" stroke-width="2"/>
             <path d="M45 42H105L95 52H55Z" fill="${accent}"/>
             <text x="75" y="49" font-size="10" text-anchor="middle" fill="#fff" font-family="serif">f(x)</text>`;
        break;
      case "M05": // 抛物线石桥
        b = `<path d="M15 106H45V60H15ZM105 106H135V60H105Z" fill="${stone}" stroke="${dark}" stroke-width="2"/>
             <path d="M15 62Q75 10 135 62" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
             <path d="M35 68Q75 28 115 68" fill="none" stroke="${dark}" stroke-width="2"/>
             ${[45, 60, 75, 90, 105].map((x) => `<path d="M${x} ${25 + Math.abs(x - 75) * 0.7}v20" stroke="${stone}" stroke-width="2"/>`).join("")}`;
        break;
      case "M06": // 变换镜廊
        b = `<rect x="30" y="32" width="90" height="72" rx="3" fill="${wall}" stroke="${dark}" stroke-width="2"/>
             <path d="M75 32V104" stroke="${accent}" stroke-width="3" stroke-dasharray="4,3"/>
             <polygon points="45,50 60,65 40,75" fill="#f8e5b8" stroke="${dark}" stroke-width="1.5"/>
             <polygon points="105,50 90,65 110,75" fill="#f8e5b8" stroke="${dark}" stroke-width="1.5" transform="rotate(180 100 62)"/>
             <path d="M30 32 75 16 120 32Z" fill="${accent}"/>`;
        break;
      case "M07": // 几何回廊
        b = `<path d="M22 104H128V110H22Z" fill="${stone}"/>
             <path d="M30 46H120V52H30ZM40 16 75 32 110 16Z" fill="${accent}"/>
             ${[38, 62, 88, 112].map((x) => `<rect x="${x}" y="52" width="8" height="52" fill="${wall}" stroke="${dark}" stroke-width="1.5"/>`).join("")}
             <polygon points="50,94 75,64 95,94" fill="none" stroke="#d95d5d" stroke-width="2"/>`;
        break;
      case "M08": // 向量石桥
        b = `<path d="M15 88Q75 75 135 88" stroke="#7eb8cf" stroke-width="16" fill="none"/>
             <path d="M25 68H125V80H25Z" fill="${stone}" stroke="${dark}" stroke-width="2"/>
             <path d="M50 82 85 58" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
             <polygon points="85,58 75,59 81,67" fill="${accent}"/>
             <path d="M50 82H85" stroke="#999" stroke-width="2" stroke-dasharray="2,2"/>
             <path d="M85 82V58" stroke="#999" stroke-width="2" stroke-dasharray="2,2"/>`;
        break;
      case "M09": // 变化水钟塔
        b = `<path d="M45 106L52 35H98L105 106Z" fill="${wall}" stroke="${dark}" stroke-width="2"/>
             <path d="M48 35 75 14 102 35Z" fill="${accent}"/>
             <circle cx="75" cy="58" r="14" fill="#f8faff" stroke="${dark}"/>
             <path d="M75 58L83 52" stroke="#d95d5d" stroke-width="2"/>
             <path d="M60 88Q75 80 90 88" stroke="#7eb8cf" stroke-width="3" fill="none"/>
             <path d="M40 92L110 74" stroke="${accent}" stroke-width="2.5"/>`;
        break;
      case "M10": // 星空测绘所
        b = `<rect x="30" y="55" width="90" height="51" fill="${wall}" stroke="${dark}" stroke-width="2"/>
             <path d="M35 55a40 40 0 0 1 80 0Z" fill="${stone}" stroke="${dark}" stroke-width="2"/>
             <path d="M75 25L110 8" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
             <circle cx="112" cy="7" r="4" fill="#f8e5b8" stroke="${dark}"/>
             <circle cx="55" cy="40" r="1.5" fill="#f8e5b8"/>
             <circle cx="85" cy="42" r="1.5" fill="#f8e5b8"/>`;
        break;
    }

    return `<svg viewBox="0 0 150 120" class="mini-landmark" aria-hidden="true">${b}</svg>`;
  }

  const api = { portrait, landmark };

  if (typeof window !== "undefined") window.AtlasMathArt = api;
  if (typeof module !== "undefined") module.exports = api;
})();
