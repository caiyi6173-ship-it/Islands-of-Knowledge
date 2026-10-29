/* Chemistry landmarks use Physics Island's ink, stone and brass miniature style. */
(() => {
  const wall = "#f3e8cf",
    dark = "#465b58",
    glass = "#aac0ad",
    brass = "#dfc798";
  function chemistry(id) {
    const i = Number(id.slice(1)) - 1,
      roof = [
        "#8da479",
        "#c38d65",
        "#89a56d",
        "#a88baa",
        "#8b83b4",
        "#ac8caf",
        "#c08d60",
        "#b79b62",
        "#76a792",
        "#7c9fac",
      ][i];
    const house = (x = 27, y = 52, w = 100, h = 54) =>
      `<path d="M${x} ${y}h${w}v${h}H${x}Z" fill="${wall}" stroke="${roof}"/><path d="M${x - 7} ${y} ${x + w / 2} ${y - 24} ${x + w + 7} ${y}Z" fill="${roof}" stroke="${dark}"/><path d="M${x + 12} ${y + 14}h13v18h-13ZM${x + w - 26} ${y + 14}h13v18h-13Z" fill="${glass}"/>`;
    const circle = (x, y, r, fill = brass) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${dark}" stroke-width="1.2"/>`;
    const flask = (x, y, h = 35) =>
      `<path d="M${x} ${y}v${h * 0.35}l-10 ${h * 0.65}h30l-10-${h * 0.65}V${y}Z" fill="${glass}" stroke="${dark}"/><path d="M${x - 2} ${y}h14" stroke="${roof}" stroke-width="3"/><path d="M${x - 6} ${y + h - 9}h23" stroke="${brass}" stroke-width="6"/>`;
    const balance = (x, y) =>
      `<path d="M${x} ${y}v56M${x - 34} ${y + 10}h68M${x - 24} ${y + 11}l-12 25h24ZM${x + 24} ${y + 11}l-12 25h24Z" stroke="${dark}" fill="${brass}" stroke-width="2"/>`;
    let body = "";
    switch (i) {
      case 0:
        body =
          house(25, 55, 102, 49) +
          `<path d="M10 109H143M25 114H137" stroke="${brass}" stroke-width="6"/>` +
          flask(54, 36, 44) +
          flask(93, 36, 44);
        break;
      case 1:
        body =
          house(24, 64, 108, 40) +
          balance(78, 9) +
          `<path d="M53 105h50" stroke="${dark}" stroke-width="4"/>`;
        break;
      case 2:
        body = `<path d="M20 105V51a57 57 0 0 1 114 0v54Z" fill="${glass}" stroke="${dark}" stroke-width="1.5"/><path d="M77 5v100M48 15l-9 90M105 15l10 90M21 49h112M20 76h114" stroke="${wall}" stroke-width="3"/><path d="M41 102V85h20v17M92 102V85h20v17" fill="${roof}"/>`;
        break;
      case 3:
        body =
          house() +
          `<path d="M51 47V25h50v22" stroke="${brass}" stroke-width="4" fill="none"/>` +
          circle(51, 40, 13, glass) +
          circle(101, 40, 13, glass) +
          circle(74, 40, 3) +
          circle(82, 40, 3) +
          `<path d="M65 106V75h25v31" fill="${roof}"/>`;
        break;
      case 4:
        body =
          house() +
          `<path d="M51 82h52M77 61v33" stroke="${dark}" stroke-width="3"/>` +
          circle(51, 82, 8) +
          circle(103, 82, 8) +
          circle(77, 61, 9, glass) +
          `<path d="M9 110h137" stroke="${brass}" stroke-width="5"/>`;
        break;
      case 5:
        body =
          `<path d="M21 105V49L77 5l57 44v56Z" fill="${wall}" stroke="${dark}"/><path d="M21 49h113M77 5v100M21 49l56 56 57-56M77 5l-25 77h50Z" fill="none" stroke="${roof}" stroke-width="2"/>` +
          circle(77, 29, 8, glass) +
          circle(50, 81, 8) +
          circle(102, 81, 8) +
          circle(77, 105, 7, glass);
        break;
      case 6:
        body =
          house(33, 77, 88, 28) +
          `<path d="M77 21v58M26 30h103M35 25l-11 5 11 5M119 25l12 5-12 5" stroke="${dark}" fill="none" stroke-width="3"/>` +
          circle(42, 48, 9, glass) +
          circle(77, 48, 9, brass) +
          circle(112, 48, 9, glass) +
          `<path d="M48 78h58" stroke="${roof}" stroke-width="4"/>`;
        break;
      case 7:
        body =
          house(22, 68, 112, 37) +
          balance(78, 5) +
          `<path d="M61 105V83h33v22" fill="${glass}" stroke="${dark}"/>`;
        break;
      case 8:
        body =
          house(24, 53, 108, 52) +
          `<path d="M35 52V24h86v28M49 25V9M108 25V9M37 17h24M96 17h24" fill="none" stroke="${dark}" stroke-width="3"/>` +
          flask(54, 67, 30) +
          flask(96, 67, 30) +
          `<path d="M64 36h26l-8-5m8 5-8 5" stroke="${brass}" stroke-width="3" fill="none"/>`;
        break;
      case 9:
        body =
          `<path d="M26 53h36v50H26ZM94 53h36v50H94Z" fill="${glass}" stroke="${dark}"/><path d="M39 35v58M112 35v58" stroke="${roof}" stroke-width="8"/><path d="M55 65V29h47v36" stroke="${brass}" stroke-width="7" fill="none"/><path d="M40 35V10h72v25" stroke="${dark}" stroke-width="2.5" fill="none"/>` +
          circle(76, 10, 12, wall) +
          `<path d="M76 17l6-12" stroke="${roof}" stroke-width="2"/>`;
        break;
    }
    return `<svg viewBox="0 0 155 120" aria-hidden="true" class="landmark-drawing"><ellipse cx="78" cy="109" rx="65" ry="8" fill="${dark}" opacity=".18"/>${body}</svg>`;
  }
  function math(id) {
    const i = Number(id.slice(1)),
      roof = [
        "#ac8caf",
        "#c38d65",
        "#7c9fac",
        "#89a56d",
        "#b27859",
        "#a88baa",
        "#8da479",
        "#7c9fac",
        "#76a792",
        "#8b83b4",
      ][i - 1];
    const house = (x = 25, y = 53, w = 105, h = 52) =>
      `<path d="M${x} ${y}h${w}v${h}H${x}Z" fill="${wall}" stroke="${roof}"/><path d="M${x - 8} ${y} ${x + w / 2} ${y - 25} ${x + w + 8} ${y}Z" fill="${roof}" stroke="${dark}"/><path d="M${x + 12} ${y + 15}h13v18h-13ZM${x + w - 25} ${y + 15}h13v18h-13Z" fill="${glass}"/>`;
    let body = "";
    switch (i) {
      case 1:
        body = `<path d="M21 105h112M35 102V35M120 102V35M27 35h101" stroke="${dark}" stroke-width="4" fill="none"/><path d="M45 36v59m13-59v59m13-59v59m13-59v59m13-59v59m13-59v59" stroke="${brass}" stroke-width="2"/><path d="M35 105 59 81h75" stroke="${roof}" stroke-width="5" fill="none"/><path d="M27 35 76 12l52 23Z" fill="${wall}" stroke="${roof}"/>`;
        break;
      case 2:
        return chemistry("C02");
      case 3:
        body =
          house() +
          `<path d="M49 95V63h58M57 69v26M77 69v26M97 69v26M49 79h58" stroke="${dark}" stroke-width="1.3" fill="none"/><circle cx="89" cy="74" r="4" fill="${brass}" stroke="${dark}"/><path d="M15 105 29 49 43 105M29 48l20-14" stroke="${roof}" stroke-width="3" fill="none"/>`;
        break;
      case 4:
        body =
          house() +
          `<g fill="${glass}" stroke="${dark}" stroke-width="2"><circle cx="59" cy="77" r="17"/><circle cx="98" cy="77" r="17"/></g><path d="M59 59v36M41 77h36M98 59v36M80 77h36" stroke="${brass}" stroke-width="3"/>`;
        break;
      case 5:
        body = `<path d="M10 105V65h28v40M117 105V65h28v40" fill="${wall}" stroke="${dark}"/><path d="M23 68Q78-5 132 68" fill="none" stroke="${roof}" stroke-width="12"/><path d="M23 74Q78 9 132 74" fill="none" stroke="${brass}" stroke-width="3"/><path d="M10 110h135" stroke="${glass}" stroke-width="7"/>`;
        break;
      case 6:
        body =
          house() +
          `<path d="M44 103V61h26v42M86 103V61h26v42" fill="${glass}" stroke="${dark}"/><path d="M48 75l16 17H49ZM90 75l16 17H91Z" fill="${wall}" stroke="${brass}"/>`;
        break;
      case 7:
        body = `<path d="M15 54 77 8l63 46Z" fill="${roof}" stroke="${dark}"/><path d="M25 55v48M51 55v48M103 55v48M128 55v48" stroke="${wall}" stroke-width="12"/><path d="M16 105h125M24 112h110" stroke="${brass}" stroke-width="5"/><path d="M65 86V64h24Z" fill="none" stroke="${dark}" stroke-width="2"/>`;
        break;
      case 8:
        body = `<path d="M9 92h137M28 90V53h99v37" fill="none" stroke="${wall}" stroke-width="12"/><path d="M54 92a25 25 0 0 1 50 0" fill="${glass}" stroke="${dark}"/><path d="M34 36h86l-12-7m12 7-12 7" stroke="${roof}" stroke-width="4" fill="none"/><path d="M4 107q25-8 50 0t50 0t50 0" stroke="${glass}" stroke-width="5" fill="none"/>`;
        break;
      case 9:
        body =
          house(45, 32, 63, 74) +
          `<path d="M37 32 77 1 117 32Z" fill="${roof}"/><circle cx="77" cy="54" r="17" fill="${glass}" stroke="${dark}"/><path d="M77 40v15l11 7" fill="none" stroke="${dark}" stroke-width="2"/><path d="M77 78q-16 19 0 21q16-2 0-21Z" fill="${glass}" stroke="${dark}"/>`;
        break;
      case 10:
        return window.AtlasPhysicsArt.landmark("P03");
    }
    return `<svg viewBox="0 0 155 120" aria-hidden="true" class="landmark-drawing"><ellipse cx="78" cy="109" rx="65" ry="8" fill="${dark}" opacity=".18"/>${body}</svg>`;
  }
  window.AtlasSubjectMapArt = { chemistry, math };
})();
