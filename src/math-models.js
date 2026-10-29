/* Calculations and mathematical models shared by story scenes, telemetry and outcomes. */
(() => {
  const VERSION = 4,
    clone = (v) => JSON.parse(JSON.stringify(v)),
    average = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);

  const isCleared = (r) =>
    Boolean(
      r &&
      r.version === VERSION &&
      Array.isArray(r.steps) &&
      r.steps.includes(0) &&
      r.steps.includes(1) &&
      r.cleared === true,
    );

  function evaluate(id, p, step = 0) {
    const number = (key, fallback) =>
      Number.isFinite(Number(p[key])) && p[key] !== null && p[key] !== ""
        ? Number(p[key])
        : fallback;
    switch (id) {
      case "M01": {
        const ratio = p.ratio || "2:3";
        const harmonious = ["1:2", "2:3", "3:4"].includes(ratio);
        const approx = p.approximation || "7:5";
        const [num, den] = approx.split(":").map(Number);
        const val = den ? num / den : 1.4;
        const err = Math.abs(val * val - 2);
        return {
          ratio,
          harmonious,
          val,
          err,
          closeEnough: err < 0.05,
          exact: den !== 0 && num * num - 2 * den * den === 0,
        };
      }
      case "M02": {
        const elimPouch = Number(p.eliminatePouch) || 0;
        const elimWeight = Number(p.eliminateWeight) || 0;
        const leftPouches = 2 - elimPouch;
        const leftWeights = 3 - elimWeight;
        const rightPouches = 1 - elimPouch;
        const rightWeights = 7 - elimWeight;
        const validRemoval =
          Number.isInteger(elimPouch) &&
          Number.isInteger(elimWeight) &&
          elimPouch >= 0 &&
          elimPouch <= 1 &&
          elimWeight >= 0 &&
          elimWeight <= 3;
        const balanced1 =
          validRemoval &&
          leftPouches * 4 + leftWeights === rightPouches * 4 + rightWeights &&
          leftPouches === 1 &&
          rightPouches === 0 &&
          leftWeights === 0;
        const reduced = p.reduceStep === "subtract" || p.reduceStep === "done";
        const solved = p.reduceStep === "done" || p.solvedX === 7;
        return {
          leftPouches,
          validRemoval,
          leftWeights,
          rightPouches,
          rightWeights,
          balanced1,
          reduced,
          solved,
        };
      }
      case "M03": {
        const x = Number(p.targetX) || 0;
        const y = Number(p.targetY) || 0;
        const dist = Math.hypot(x - 4, y - 3);
        const slope = Number(p.lineSlope) || 0;
        const onLine = Math.abs(slope - 2) < 0.01;
        return {
          x,
          y,
          dist,
          targeted: dist < 0.1,
          slope,
          onLine,
        };
      }
      case "M04": {
        const k = Number(p.factorK) || 0;
        const b = Number(p.offsetB) || 0;
        const testInputs = [1, 3, 5];
        const outputs = testInputs.map((x) => k * x + b);
        const linearMatch = Math.abs(k - 2) < 0.01 && Math.abs(b - 1) < 0.01;
        const singleValued = p.mappingType === "single";
        return {
          k,
          b,
          outputs,
          linearMatch,
          singleValued,
        };
      }
      case "M05": {
        const a = number("archA", -0.125);
        const h = number("archH", 6);
        const k = number("archK", 5);
        const leftH = a * (0 - h) ** 2 + k;
        const rightH = a * (12 - h) ** 2 + k;
        const endsAligned =
          Math.abs(leftH - 0.5) < 0.15 &&
          Math.abs(rightH - 0.5) < 0.15 &&
          a < 0;
        const clearanceAt3 = a * (3 - h) ** 2 + k;
        const clearanceAt9 = a * (9 - h) ** 2 + k;
        const safeClearance =
          endsAligned && clearanceAt3 >= 3.5 && clearanceAt9 >= 3.5;
        return {
          a,
          h,
          k,
          leftH,
          rightH,
          endsAligned,
          clearanceAt3,
          clearanceAt9,
          safeClearance,
        };
      }
      case "M06": {
        const sx = Number(p.shiftX) || 0;
        const sy = Number(p.shiftY) || 0;
        const rot = Number(p.rotateDeg) || 0;
        const s = number("scaleS", 1);
        const rigidAligned =
          Math.abs(sx - 3) < 0.1 &&
          Math.abs(sy - 2) < 0.1 &&
          (Math.abs(rot - 90) < 1 || Math.abs(rot + 270) < 1);
        const areaRatio = s * s;
        const scaleValid = Math.abs(s - 2) < 0.05;
        return {
          sx,
          sy,
          rot,
          s,
          rigidAligned,
          areaRatio,
          scaleValid,
        };
      }
      case "M07": {
        const isTri = p.shapeType === "triangle";
        const a = number("sideA", 3);
        const b = number("sideB", 4);
        const c = number("sideC", 5);
        const validTriangle =
          a > 0 && b > 0 && c > 0 && a + b > c && a + c > b && b + c > a;
        const pythagorean =
          validTriangle && Math.abs(a * a + b * b - c * c) < 0.01;
        return {
          isTri,
          rigid: isTri,
          angleSum: isTri ? 180 : 360,
          a,
          b,
          c,
          pythagorean,
          validTriangle,
        };
      }
      case "M08": {
        const speed = number("boatSpeed", 5);
        const angle = number("boatAngle", 126.87);
        const flow = number("riverFlow", 3);
        const rad = (angle * Math.PI) / 180;
        const vx = speed * Math.cos(rad) + flow;
        const vy = speed * Math.sin(rad);
        const straightAcross = Math.abs(vx) < 0.25 && vy > 3.5;
        const minTimeAngle = Math.abs(angle - 90) < 5;
        return {
          speed,
          angle,
          flow,
          vx,
          vy,
          resultant: Math.hypot(vx, vy),
          straightAcross,
          minTimeAngle,
        };
      }
      case "M09": {
        const t0 = number("evalT", 10);
        const dt = number("deltaT", 0.2);
        // h(t) = 100 - 8t + 0.2t^2
        const h0 = 100 - 8 * t0 + 0.2 * t0 * t0;
        const h1 = 100 - 8 * (t0 + dt) + 0.2 * (t0 + dt) * (t0 + dt);
        const avgSlope = (h1 - h0) / dt;
        const trueSlope = -8 + 0.4 * t0; // -4 at t=10
        const slopeDiff = Math.abs(avgSlope - trueSlope);
        const tangentClose = dt <= 0.5 && slopeDiff < 0.15;
        const zeroSlopeT = number("zeroSlopeT", 20);
        const isStationary = Math.abs(zeroSlopeT - 20) < 0.5;
        return {
          t0,
          dt,
          avgSlope,
          trueSlope,
          tangentClose,
          zeroSlopeT,
          isStationary,
        };
      }
      case "M10": {
        const a = number("modelA", 0.05);
        const b = number("modelB", -1.2);
        const c = number("modelC", 15);
        // Observed points: (0, 15.2), (10, 8.1), (20, 11.0)
        const obs = [
          [0, 15.2],
          [10, 8.1],
          [20, 11.0],
        ];
        const residuals = obs.map(([x, y]) => {
          const pred = a * x * x + b * x + c;
          return (y - pred) ** 2;
        });
        const rss = residuals.reduce((sum, v) => sum + v, 0);
        const fitted = rss < 0.25;
        const predT = number("predT", 24);
        const predY = a * predT * predT + b * predT + c;
        const targetPred = 15; // approx for Ceres return
        const verified =
          fitted && predT === 24 && Math.abs(predY - targetPred) < 1.5;
        return {
          a,
          b,
          c,
          rss,
          fitted,
          predT,
          predY,
          verified,
        };
      }
      default:
        throw new RangeError("Unknown math story: " + id);
    }
  }

  function outcome(id, step, p, clues = []) {
    const r = evaluate(id, p, step);
    let ok = false,
      message = "";
    switch (id) {
      case "M01":
        ok = step ? r.closeEnough : r.harmonious;
        message = !step
          ? r.harmonious
            ? "纯正的和声响起！整数比例带来了悦耳的共鸣。"
            : "琴声杂乱刺耳。试试简单的整数比，例如 2:3 或 3:4。"
          : r.closeEnough
            ? "这个分数的平方已经很接近 2，但残差仍不为零。逼近提供线索；√2 的无理性要用逻辑证明。"
            : "精度还不够，试着用更高阶的有理数（如 7:5 或 17:12）逼近 √2。";
        break;
      case "M02":
        ok = step ? r.solved : r.balanced1;
        message = !step
          ? r.balanced1
            ? "天平两边拿掉相同负荷！左侧只剩一个包裹，右侧清晰显示为 4 磅。"
            : !r.validRemoval
              ? "盘上没有那么多包裹或砝码，不能移走不存在的物件。"
              : "两端仍然保持等价，但未知量还没有单独留下。继续对消相同项。"
          : r.solved
            ? "还原成功！两边消去常数并均分，解出香料重量为 7 磅。"
            : p.reduceStep === "divide"
              ? "原式两边仅除以 3 得到 x + 5/3 = 26/3，常数仍在。选择先减去 5、再除以 3 的完整过程。"
              : "两边减去 5 后得到 3x = 21，还需两边除以 3。选择完整求解过程。";
        break;
      case "M03":
        ok = step ? r.onLine : r.targeted;
        message = !step
          ? r.targeted
            ? "准星锁定！一对数字 (4, 3) 准确指出了平面上的几何目标。"
            : "准星偏离了目标。先数横轴 x（向东 4 格），再数纵轴 y（向北 3 格）。"
          : r.onLine
            ? "航线连通！所有满足 y = 2x 的点连成了一条笔直的引导航线。"
            : "斜率不匹配，航线未能穿透航标。尝试设定斜率为 2。";
        break;
      case "M04":
        ok = step ? r.singleValued : r.linearMatch;
        message = !step
          ? r.linearMatch
            ? "齿轮联动顺畅！每一份输入都精确产出了预期的输出。"
            : "输出读数与测试数据不符。调整齿轮比 k 与偏置 b 使其满足 f(x) = 2x + 1。"
          : r.singleValued
            ? "单值映射验证通过！每个输入严格对应唯一的输出，函数法则坚实可靠。"
            : "发现了多值歧义！一个输入绝不能产生两个不确定的输出。";
        break;
      case "M05":
        ok = step ? r.safeClearance : r.endsAligned;
        message = !step
          ? r.endsAligned
            ? "几何端点已落在两侧桥基上。这里满足尺寸条件，不据此判断真实结构的承重安全。"
            : "桥拱端点未落在基座上，或开口方向错误。设定 a = -0.125, h = 6, k = 5。"
          : r.safeClearance
            ? "净空条件满足：中央 6 米区间内，曲线高度不低于 3.5 米。这是几何模型的检验。"
            : "中央通行空间被桥拱压低，请微调高度使通航区域留足净空。";
        break;
      case "M06":
        ok = step ? r.scaleValid : r.rigidAligned;
        message = !step
          ? r.rigidAligned
            ? "平移与旋转吻合！全等变换下的边长与角度完全守恒。"
            : "钥匙未对准锁孔。尝试平移 (3, 2) 并顺时针旋转 90 度。"
          : r.scaleValid
            ? "放大验证完成！形状与内角丝毫不变，面积按比例因子的平方（4 倍）增长。"
            : "缩放因子未调至 2 倍，或内角比例受损。";
        break;
      case "M07":
        ok = step ? r.pythagorean : r.rigid && r.angleSum === 180;
        message = !step
          ? r.rigid
            ? "三边锁定！三角形具有坚不可摧的几何刚性，内角和恒为 180°。"
            : "形状容易变形。选择三角形并扣合三边。"
          : r.pythagorean
            ? "拼图严丝合缝！3² + 4² = 5²，两条直角边正方形面积之和等于斜边正方形。"
            : "面积拼图未闭合，检查勾股数是否满足 a² + b² = c²。";
        break;
      case "M08":
        ok = step ? r.minTimeAngle : r.straightAcross;
        message = !step
          ? r.straightAcross
            ? "合速度垂直对岸！船只稳稳向正对岸码头驶去，航向精准。"
            : "渡船被冲向下游或推向上游。调整船头航向角以抵消 3 m/s 的东向水流。"
          : r.minTimeAngle
            ? "船头正对对岸（90°）！垂直过河分量达到最大，过河用时最短。"
            : "要追求最短渡河时间，应当让全部划桨力量集中在垂直过河方向上。";
        break;
      case "M09":
        ok = step ? r.isStationary : r.tangentClose;
        message = !step
          ? r.tangentClose
            ? "割线收敛为切线！时间步长缩至微小时，斜率稳定在 -4 cm/s。"
            : "时间间隔 Δt 依然偏大，割线与瞬时切线存在明显误差。将步长继续缩小。"
          : r.isStationary
            ? "找到驻点 t = 20！导数由负变正，示意水位达到最低值 h(20) = 20；二阶导数为 0.4，这里是极小值而非拐点。"
            : "驻点尚未找到。令导数 -8 + 0.4t = 0，求解斜率为 0 的时刻。";
        break;
      case "M10":
        ok = step ? r.verified : r.fitted;
        message = !step
          ? r.fitted
            ? "残差平方和降至最低！最佳拟合二次轨道穿过了所有噪点的中心。"
            : "曲线与观测点偏差过大。微调参数 a, b, c 使总残差降到 0.25 以下。"
          : r.verified
            ? "望远镜在预报视场中捕捉到了谷神星！数学建模让迷雾中的天体无所遁形。"
            : "外推预报误差超出观测窗口，请检查拟合参数并代入目标时间计算。";
        break;
      default:
        throw new RangeError("Unknown math outcome: " + id);
    }
    return { ok, message, result: r };
  }

  function cleanParams(id, round, params = {}) {
    const raw = clone(params);
    const p = {};
    switch (id) {
      case "M01":
        p.ratio = ["1:2", "2:3", "3:4", "5:7"].includes(raw.ratio)
          ? raw.ratio
          : "2:3";
        p.approximation = ["7:5", "17:12", "41:29", "99:70", "3:2"].includes(
          raw.approximation,
        )
          ? raw.approximation
          : "7:5";
        break;
      case "M02":
        p.eliminatePouch = Math.max(
          0,
          Math.min(2, Math.trunc(Number(raw.eliminatePouch) || 0)),
        );
        p.eliminateWeight = Math.max(
          0,
          Math.min(3, Math.trunc(Number(raw.eliminateWeight) || 0)),
        );
        p.reduceStep = ["subtract", "divide", "done"].includes(raw.reduceStep)
          ? raw.reduceStep
          : "subtract";
        p.solvedX = Math.trunc(Number(raw.solvedX) || 0);
        break;
      case "M03":
        p.targetX = Math.max(
          0,
          Math.min(8, Math.round(Number(raw.targetX) || 0)),
        );
        p.targetY = Math.max(
          0,
          Math.min(6, Math.round(Number(raw.targetY) || 0)),
        );
        p.lineSlope = Number.isFinite(Number(raw.lineSlope))
          ? Number(raw.lineSlope)
          : 2;
        break;
      case "M04":
        p.factorK = Number.isFinite(Number(raw.factorK))
          ? Number(raw.factorK)
          : 2;
        p.offsetB = Number.isFinite(Number(raw.offsetB))
          ? Number(raw.offsetB)
          : 1;
        p.mappingType = ["single", "multiple"].includes(raw.mappingType)
          ? raw.mappingType
          : "single";
        break;
      case "M05":
        p.archA = Number.isFinite(Number(raw.archA))
          ? Math.max(-0.5, Math.min(-0.01, Number(raw.archA)))
          : -0.125;
        p.archH = Math.max(2, Math.min(10, Number(raw.archH) || 6));
        p.archK = Math.max(1, Math.min(8, Number(raw.archK) || 5));
        break;
      case "M06":
        p.shiftX = Math.max(-5, Math.min(5, Number(raw.shiftX) || 0));
        p.shiftY = Math.max(-5, Math.min(5, Number(raw.shiftY) || 0));
        p.rotateDeg = [0, 90, 180, 270].includes(Number(raw.rotateDeg))
          ? Number(raw.rotateDeg)
          : 90;
        p.scaleS = Math.max(0.5, Math.min(3, Number(raw.scaleS) || 1));
        break;
      case "M07":
        p.shapeType = ["triangle", "quadrilateral"].includes(raw.shapeType)
          ? raw.shapeType
          : "triangle";
        p.sideA = Math.max(1, Math.min(10, Number(raw.sideA) || 3));
        p.sideB = Math.max(1, Math.min(10, Number(raw.sideB) || 4));
        p.sideC = Math.max(1, Math.min(10, Number(raw.sideC) || 5));
        break;
      case "M08":
        p.boatSpeed = Math.max(1, Math.min(10, Number(raw.boatSpeed) || 5));
        p.boatAngle = Math.max(0, Math.min(180, Number(raw.boatAngle) || 90));
        p.riverFlow = 3;
        break;
      case "M09":
        p.evalT = 10;
        p.deltaT = Math.max(0.05, Math.min(5, Number(raw.deltaT) || 1));
        p.zeroSlopeT = Math.max(0, Math.min(30, Number(raw.zeroSlopeT) || 10));
        break;
      case "M10":
        p.modelA = Number.isFinite(Number(raw.modelA))
          ? Number(raw.modelA)
          : 0.05;
        p.modelB = Number.isFinite(Number(raw.modelB))
          ? Number(raw.modelB)
          : -1.2;
        p.modelC = Number.isFinite(Number(raw.modelC))
          ? Number(raw.modelC)
          : 15;
        p.predT = Number.isFinite(Number(raw.predT)) ? Number(raw.predT) : 24;
        break;
      default:
        break;
    }
    return p;
  }

  function sanitize(id, record, level) {
    const r = record && typeof record === "object" ? record : {};
    const p = cleanParams(id, 0, r.params || level.defaults);
    const steps = Array.isArray(r.steps)
      ? [...new Set(r.steps.filter((n) => n === 0 || n === 1))]
      : [];
    if (!steps.includes(0) && steps.includes(1)) {
      steps.splice(steps.indexOf(1), 1);
    }
    const clues = Array.isArray(r.clues)
      ? r.clues.filter((c) => typeof c === "string")
      : [];
    return {
      version: VERSION,
      id,
      steps,
      clues,
      step: r.step === 1 && steps.includes(0) ? 1 : 0,
      params: p,
      started: r.started === true,
      cleared: r.cleared === true && steps.length === 2,
    };
  }

  const api = {
    VERSION,
    clone,
    average,
    isCleared,
    evaluate,
    outcome,
    cleanParams,
    sanitize,
  };

  if (typeof window !== "undefined") window.AtlasMathModels = api;
  if (typeof module !== "undefined") module.exports = api;
})();
