/* Deterministic models, independent from drawing speed and screen size. */
(() => {
  function flight({ v0, angle, g }) {
    if (![v0, angle, g].every(Number.isFinite) || v0 <= 0 || g <= 0)
      throw new RangeError("Invalid flight parameters");
    const radians = (angle * Math.PI) / 180;
    const vx = v0 * Math.cos(radians),
      vy = v0 * Math.sin(radians);
    const duration = (vy + Math.sqrt(vy * vy + 3 * g)) / g;
    const discriminant = vy * vy - 3 * g;
    const crossingTime =
      discriminant >= 0 ? (vy + Math.sqrt(discriminant)) / g : null;
    const crossingX = crossingTime === null ? null : vx * crossingTime;
    return {
      vx,
      vy,
      duration,
      peak: 1.5 + (vy * vy) / (2 * g),
      crossingTime,
      crossingX,
      hit:
        crossingX !== null &&
        crossingTime > vy / g &&
        Math.abs(crossingX - 12) <= 0.35,
      at: (t) => ({ x: vx * t, y: 1.5 + vy * t - (g * t * t) / 2 }),
    };
  }
  function matchesCurve(curve, target = { a: 0.5, h: 2, k: 1 }) {
    return ["a", "h", "k"].every(
      (key) =>
        Number.isFinite(curve[key]) &&
        Math.abs(curve[key] - target[key]) <= 0.05000001,
    );
  }
  const templates = [
    {
      name: "甲烷",
      formula: "CH₄",
      center: "C",
      hydrogens: 4,
      shape: "四面体",
      lonePairs: 0,
    },
    {
      name: "氨",
      formula: "NH₃",
      center: "N",
      hydrogens: 3,
      shape: "三角锥形",
      lonePairs: 1,
    },
    {
      name: "水",
      formula: "H₂O",
      center: "O",
      hydrogens: 2,
      shape: "弯曲形",
      lonePairs: 2,
    },
  ];
  function validateMolecule(atoms, bonds, task) {
    const template = templates[task];
    if (!template) return { ok: false, message: "未收录的分子任务。" };
    const centers = atoms.filter((a) => a.el === template.center),
      hydrogens = atoms.filter((a) => a.el === "H");
    if (
      centers.length !== 1 ||
      hydrogens.length !== template.hydrogens ||
      atoms.length !== template.hydrogens + 1
    )
      return {
        ok: false,
        message: `${template.formula} 需要 1 个 ${template.center} 和 ${template.hydrogens} 个 H。请检查原子种类和数量。`,
      };
    const center = centers[0];
    const unique = new Set(
      bonds.map((b) => [...b].sort((a, b) => a - b).join(":")),
    );
    if (unique.size !== bonds.length || bonds.length !== template.hydrogens)
      return { ok: false, message: "请将每个氢原子用一根单键连接到中心原子。" };
    const connected = new Set();
    for (const [from, to] of bonds) {
      const other = from === center.id ? to : to === center.id ? from : null;
      if (
        other === null ||
        !hydrogens.some((a) => a.id === other) ||
        connected.has(other)
      )
        return {
          ok: false,
          message: "本任务中每个氢只与中心原子相连一次，氢之间不相连。",
        };
      connected.add(other);
    }
    return {
      ok: true,
      message: `搭建成功！${template.name}呈${template.shape}。${template.lonePairs ? `中心原子还有 ${template.lonePairs} 对孤电子对，空间结构需要同时考虑它们。` : "四个成键方向在空间中形成四面体。"}`,
    };
  }
  const api = { flight, matchesCurve, templates, validateMolecule };
  if (typeof window !== "undefined") window.AtlasScience = api;
  if (typeof module !== "undefined") module.exports = api;
})();
