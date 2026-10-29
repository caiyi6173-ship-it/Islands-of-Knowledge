/* Calculations shared by story scenes, outcomes and model checks. */
(() => {
  const VERSION = 3,
    clone = (v) => JSON.parse(JSON.stringify(v)),
    average = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);
  const isCleared = (r) =>
    Boolean(
      r &&
      r.version === VERSION &&
      Array.isArray(r.steps) &&
      r.steps.includes(0) &&
      r.steps.includes(1) &&
      r.letterSent === true,
    );
  const orbitCache = new Map();
  function orbit(speed) {
    if (orbitCache.has(speed)) return orbitCache.get(speed);
    if (!Number.isFinite(speed) || speed <= 0)
      throw new RangeError("Invalid orbital speed");
    const energy0 = (speed * speed) / 2 - 1;
    if (energy0 < 0) {
      const a = -1 / (2 * energy0),
        e = Math.abs(speed * speed - 1),
        sign = speed < 1 ? -1 : 1;
      const start = speed < 1 ? Math.PI : 0,
        path = [];
      let kind = "orbit";
      for (let i = 0; i <= 600; i++) {
        const mean = start + (2 * Math.PI * i) / 600;
        let anomaly = mean;
        for (let n = 0; n < 12; n++)
          anomaly -=
            (anomaly - e * Math.sin(anomaly) - mean) /
            (1 - e * Math.cos(anomaly));
        const x = sign * a * Math.sqrt(1 - e * e) * Math.sin(anomaly),
          y = -sign * a * (Math.cos(anomaly) - e);
        path.push([x, y]);
        if (Math.hypot(x, y) <= 0.68) {
          kind = "ground";
          break;
        }
      }
      const result = {
        path,
        kind,
        energy: energy0,
        period: 2 * Math.PI * Math.pow(a, 1.5),
      };
      if (orbitCache.size > 180) orbitCache.clear();
      orbitCache.set(speed, result);
      return result;
    }
    const dt = 0.008,
      path = [[0, -1]],
      energy = (speed * speed) / 2 - 1,
      period = energy < 0 ? 2 * Math.PI * Math.pow(-1 / (2 * energy), 1.5) : 14;
    let x = 0,
      y = -1,
      vx = speed,
      vy = 0,
      kind = "orbit";
    for (let t = 0; t < Math.min(period, 45); t += dt) {
      const r = Math.hypot(x, y),
        ax = -x / r ** 3,
        ay = -y / r ** 3;
      x += vx * dt + 0.5 * ax * dt * dt;
      y += vy * dt + 0.5 * ay * dt * dt;
      const nr = Math.hypot(x, y);
      vx += 0.5 * (ax - x / nr ** 3) * dt;
      vy += 0.5 * (ay - y / nr ** 3) * dt;
      path.push([x, y]);
      if (nr <= 0.68) {
        kind = "ground";
        break;
      }
      if (nr > 5) {
        kind = "escape";
        break;
      }
    }
    if (energy >= 0 && kind !== "ground") kind = "escape";
    return {
      path: path.filter((_, i) => i % 5 === 0).concat([path.at(-1)]),
      kind,
      energy,
      period,
    };
  }
  function evaluate(id, p, step = 0) {
    switch (id) {
      case "P01": {
        const capacity = { lump: 0.9, bowl: 4.2, wide: 6.4 }[p.shape],
          mass = 1.2 + p.cargo * 1.2;
        return {
          capacity,
          mass,
          floats: mass <= capacity,
          displacement: Math.min(capacity, mass),
          reserve: capacity - mass,
        };
      }
      case "P02": {
        const times = p.bells.map((x) =>
            Math.sqrt(x / (p.slope === "steep" ? 2 : 1)),
          ),
          gaps = [times[0], times[1] - times[0], times[2] - times[1]];
        return {
          times,
          gaps,
          even: Math.max(...gaps) - Math.min(...gaps) < 0.095,
        };
      }
      case "P03":
        return orbit(p.speed);
      case "P04": {
        const work = 196,
          heatAdded = p.connected ? work * (p.insulated ? 0.9 : 0.65) : 0;
        return {
          work,
          heatAdded,
          heat: (p.heat || 0) + heatAdded,
          temperature: ((p.heat || 0) + heatAdded) / 4180,
          drops: (p.drops || 0) + (p.connected ? 1 : 0),
        };
      }
      case "P05": {
        const wavelength = p.color === "blue" ? 450 : 600,
          intensity =
            p.slits === "two"
              ? Math.cos((Math.PI * p.gap * 0.5 * 600) / wavelength) ** 2
              : 1;
        return { intensity, wavelength, dark: intensity < 0.035 };
      }
      case "P06":
        return { ready: p.crank === true, position: p.magnetX };
      case "P07": {
        const receiver = step ? 5 : 3;
        return {
          receiver,
          strength: Math.exp(-3 * (p.frequency - receiver) ** 2),
          tuned: p.frequency === receiver,
        };
      }
      case "P08":
        return {
          means: Object.fromEntries(
            Object.entries(p.readings).map(([k, a]) => [k, average(a)]),
          ),
          counts: Object.fromEntries(
            Object.entries(p.readings).map(([k, a]) => [k, a.length]),
          ),
        };
      case "P09": {
        const temperature = p.temperature === "hot" ? 1.8 : 1;
        return {
          temperature,
          spectrum: (x, q) =>
            q
              ? x ** 3 / Math.expm1((2 * x) / temperature)
              : (x * x * temperature) / 2,
          quantized: p.model === "quanta",
        };
      }
      case "P10": {
        const frequency = { red: 4, blue: 7.5, uv: 10 }[p.color],
          photon = frequency * 0.41356677,
          workFunction = step ? 3.5 : 2.2,
          kinetic = Math.max(0, photon - workFunction);
        return {
          frequency,
          photon,
          workFunction,
          kinetic,
          electrons: kinetic > 0 ? p.intensity * 3 : 0,
        };
      }
      default:
        throw new RangeError("Unknown story");
    }
  }
  function outcome(id, step, p, clues = []) {
    const r = evaluate(id, p, step);
    let ok = false,
      message = "";
    switch (id) {
      case "P01":
        ok = r.floats && (step ? p.cargo === 4 : p.cargo === 0);
        message = !r.floats
          ? "船进水了。它在淹没前能排开的水，还托不起现在的总重量。"
          : step
            ? "船浮着，但四箱仪器还没有装齐。"
            : "先把货物留在岸上，比较船体本身。";
        break;
      case "P02":
        ok = r.even && (!step || p.slope === "steep");
        message = r.even
          ? "节拍已经均匀。这次，把坡度换成陡坡再听一次。"
          : "钟声还在挤到一起。越靠后的小钟，需要隔得越远。";
        break;
      case "P03":
        ok = step ? r.kind === "orbit" : r.kind === "ground";
        message =
          r.kind === "escape"
            ? "信筒离开了星球。试着减小初速度，留下一条封闭轨道。"
            : step
              ? "信落回了地面。再增加一点水平初速度。"
              : "信已经绕起来了。先观察一次较小速度的落地轨迹。";
        break;
      case "P04":
        ok = step
          ? p.connected && p.insulated && r.drops >= 3 && r.temperature >= 0.12
          : p.connected;
        message = p.connected
          ? "温度还在累计。再放下一次重物，隔热层会减少向外传出的能量。"
          : "重物落下了，但没有带动搅拌桨。先把绳轮接起来。";
        break;
      case "P05":
        ok = r.dark && p.slits === "two" && (!step || p.color === "blue");
        message =
          p.slits === "one"
            ? "这里只有一道光，没有形成双缝干涉。打开第二条缝试试。"
            : step && p.color !== "blue"
              ? "第一行已读出。这次换成蓝光，再寻找暗纹。"
              : "刻线还在亮处。改变缝距，看看条纹怎样移动。";
        break;
      case "P06":
        ok = step ? p.crank : clues.includes("in") && clues.includes("out");
        message = step
          ? "磁铁还没接上摇柄，先完成机械连接。"
          : "指针偏转了一次。让磁铁反向运动，再比较两次偏转。";
        break;
      case "P07":
        ok = r.tuned && (!step || p.code === "R");
        message = !r.tuned
          ? "对岸只有微弱的噪声。看看接收站旁标注的频段。"
          : "信号到了，电报码却不对。回信需要短—长—短：· — ·。";
        break;
      case "P08":
        ok = step
          ? r.counts.ore >= 2 && r.counts.fraction >= 2
          : r.counts.background >= 1 &&
            r.counts.uranium >= 1 &&
            r.counts.ore >= 1;
        message = step
          ? "矿石和强信号组分都需要至少两次读数。"
          : "把空白、铀参考样本、矿石都测一遍，才有比较基准。";
        break;
      case "P09":
        ok =
          r.quantized &&
          (step
            ? p.temperature === "hot"
            : clues.includes("mismatch") &&
              p.fed.includes(1) &&
              p.fed.includes(3));
        message = !r.quantized
          ? "高频一端预测超出实测。也许需要改变交换能量的规则。"
          : step
            ? "换成高温记录，让同一规则面对另一组证据。"
            : "先记录旧模型偏差，再给低频和高频振子送去适合的一份能量。";
        break;
      case "P10":
        ok = step
          ? r.electrons > 0
          : clues.includes("red-blocked") &&
            p.color === "blue" &&
            p.intensity <= 2 &&
            r.electrons > 0;
        message =
          r.electrons === 0
            ? "没有电子逸出。光的数量多，也不能弥补每个光子的能量不足。"
            : step
              ? "试着提高频率。"
              : "出现了电子。再完成强红光与弱蓝光的对照，把两个因素分开。";
        break;
    }
    return { ok, message, result: r };
  }
  function sanitize(id, record, level) {
    const p = clone(level.defaults),
      r = record && record.version === VERSION ? record : {},
      raw = r.params && typeof r.params === "object" ? r.params : {};
    const enums = {
      shape: ["lump", "bowl", "wide"],
      slope: ["gentle", "steep"],
      slits: ["one", "two"],
      sample: ["background", "uranium", "ore", "fraction"],
      model: ["continuous", "quanta"],
      temperature: ["warm", "hot"],
      code: ["R", "S", "O"],
    };
    for (const key of Object.keys(p)) {
      const v = raw[key];
      if (enums[key]) {
        if (enums[key].includes(v)) p[key] = v;
      } else if (key === "color") {
        if (
          (id === "P05" ? ["warm", "blue"] : ["red", "blue", "uv"]).includes(v)
        )
          p[key] = v;
      } else if (typeof p[key] === "boolean") {
        if (typeof v === "boolean") p[key] = v;
      } else if (typeof p[key] === "number" && Number.isFinite(v)) {
        const ranges = {
            cargo: [0, 4],
            speed: [0.4, 1.65],
            gap: [0.5, 3],
            magnetX: [0, 100],
            frequency: [1, 5],
            intensity: [1, 5],
            packet: [1, 3],
            drops: [0, 1000],
            heat: [0, 196000],
          },
          [a, b] = ranges[key] || [0, 100];
        if (
          v >= a &&
          v <= b &&
          (!["cargo", "frequency", "intensity", "packet", "drops"].includes(
            key,
          ) ||
            Number.isInteger(v))
        )
          p[key] = v;
      } else if (
        key === "bells" &&
        Array.isArray(v) &&
        v.length === 3 &&
        v.every((n) => Number.isFinite(n) && n >= 0.5 && n <= 10)
      )
        p.bells = [...v];
      else if (key === "fed" && Array.isArray(v))
        p.fed = [...new Set(v.filter((n) => [1, 2, 3].includes(n)))];
      else if (key === "readings" && v && typeof v === "object")
        for (const sample of Object.keys(p.readings))
          p.readings[sample] = Array.isArray(v[sample])
            ? v[sample]
                .filter((n) => Number.isFinite(n) && n >= 0 && n <= 1000)
                .slice(-20)
            : [];
    }
    const steps = Array.isArray(r.steps)
      ? [...new Set(r.steps.filter((n) => n === 0 || n === 1))]
      : [];
    if (!steps.includes(0) && steps.includes(1))
      steps.splice(steps.indexOf(1), 1);
    const clues = Array.isArray(r.clues)
      ? r.clues.filter((c) =>
          ["in", "out", "mismatch", "red-blocked"].includes(c),
        )
      : [];
    return {
      version: VERSION,
      steps,
      clues,
      step: r.step === 1 && steps.includes(0) ? 1 : 0,
      params: p,
      started: r.started === true,
      letterSent: r.letterSent === true && steps.length === 2,
    };
  }
  const api = {
    VERSION,
    clone,
    average,
    isCleared,
    evaluate,
    outcome,
    orbit,
    sanitize,
  };
  if (typeof window !== "undefined") window.AtlasPhysicsModels = api;
  if (typeof module !== "undefined") module.exports = api;
})();
