/* Live previews share exactly the same model as a committed experiment. */
(() => {
  const G = window.AtlasPhysicsScenarios;
  const M = window.AtlasPhysicsModels;
  function telemetry(id, round, params) {
    const result = G.test(id, round, params);
    const p = result.params;
    let metrics = result.readings;
    if (id === "P01") {
      const q = M.evaluate(id, { ...p, cargo: round === 1 ? 4 : 0 });
      metrics = [
        ...metrics.slice(0, 2),
        ["承载余量", `${q.reserve.toFixed(1)} kg`],
      ];
    } else if (id === "P02") {
      const bells = { equal: [1, 2, 3], square: [1, 4, 9], linear: [2, 4, 6] }[
        p.layout
      ];
      const q = M.evaluate(id, {
        bells,
        slope: round === 1 ? "steep" : "gentle",
      });
      metrics = [
        ["到达时刻 / 示意 s", q.times.map((v) => v.toFixed(2)).join(" / ")],
        ["钟声间隔 / 示意 s", q.gaps.map((v) => v.toFixed(2)).join(" / ")],
      ];
    } else if (id === "P03") {
      const q = M.orbit(p.speed);
      metrics = [...metrics, ["比机械能 / 归一化", q.energy.toFixed(3)]];
    } else if (id === "P07") {
      const q = M.evaluate(id, p, round);
      metrics = [
        ["接收刻度", String(q.receiver)],
        ["相对响应", `${Math.round(q.strength * 100)}%`],
        ["发送内容", p.code || "试探信号"],
      ];
    }
    return {
      metrics,
      statusText: result.detail,
      statusKind: result.success ? "eureka" : "neutral",
      isSuccess: result.success,
      result,
    };
  }

  // Keep existing elements, animation clocks, focus and scroll whenever possible.
  function patchNode(current, next) {
    if (
      current.nodeType !== next.nodeType ||
      current.nodeName !== next.nodeName
    ) {
      current.replaceWith(next.cloneNode(true));
      return;
    }
    if (current.nodeType !== Node.ELEMENT_NODE) {
      if (current.nodeValue !== next.nodeValue)
        current.nodeValue = next.nodeValue;
      return;
    }
    for (const attr of [...current.attributes])
      if (
        !next.hasAttribute(attr.name) &&
        !(current.tagName === "DETAILS" && attr.name === "open")
      )
        current.removeAttribute(attr.name);
    for (const attr of next.attributes)
      if (current.getAttribute(attr.name) !== attr.value)
        current.setAttribute(attr.name, attr.value);
    if (current instanceof HTMLInputElement && current.value !== next.value)
      current.value = next.value;
    const key = (node) =>
      node.nodeType === 1
        ? node.id || node.getAttribute("data-live-key")
        : null;
    for (let i = 0; i < next.childNodes.length; i++) {
      const desired = next.childNodes[i];
      let existing = current.childNodes[i];
      const desiredKey = key(desired);
      if (desiredKey && key(existing || {}) !== desiredKey) {
        const found = [...current.childNodes]
          .slice(i)
          .find((node) => key(node) === desiredKey);
        if (found) current.insertBefore(found, existing || null);
        else current.insertBefore(desired.cloneNode(true), existing || null);
        existing = current.childNodes[i];
      }
      if (existing) patchNode(existing, desired);
      else current.appendChild(desired.cloneNode(true));
    }
    while (current.childNodes.length > next.childNodes.length)
      current.lastChild.remove();
  }
  function patch(host, html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    const shell = host.cloneNode(false);
    shell.append(template.content);
    patchNode(host, shell);
  }

  function create({ host, id }) {
    let round = 0,
      params = {},
      frame = 0,
      elapsed = 0,
      previous = 0,
      paused = false,
      changedAt = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    function draw() {
      if (id === "P02") {
        const factor = round === 1 ? 2 : 1;
        const duration = Math.sqrt(9 / factor),
          t = elapsed % (duration + 0.8);
        const distance = Math.min(9, factor * t * t),
          x = 28 * distance;
        const ball = host.querySelector("[data-live-key='rolling-ball']");
        if (ball) ball.style.transform = `translate(${x}px, ${x * 0.29}px)`;
        const distances = {
          equal: [1, 2, 3],
          square: [1, 4, 9],
          linear: [2, 4, 6],
        }[params.layout] || [1, 2, 3];
        host.querySelectorAll("[data-bell-index]").forEach((bell, i) => {
          const ringing =
            t <= duration &&
            Math.abs(t - Math.sqrt(distances[i] / factor)) < 0.13;
          bell.classList.toggle("sandbox-bell-ringing", ringing);
        });
      }
      if (id === "P06") {
        const seconds = elapsed - changedAt;
        const t = Math.min(1, Math.max(0, seconds / 1.3));
        const magnet = host.querySelector("[data-live-key='magnet']");
        const needle = host.querySelector("[data-live-key='needle']");
        const cycling = ["in", "turn"].includes(params.motion);
        const phase = (seconds * Math.PI) / 2;
        if (magnet)
          magnet.style.transform =
            params.motion === "turn"
              ? `rotate(${seconds * 90}deg)`
              : `translateX(${cycling ? Math.sin(phase) * 25 : params.motion === "hold" ? t * 25 : 0}px)`;
        if (needle)
          needle.style.rotate = `${cycling ? (params.motion === "turn" ? Math.sin(phase) : Math.cos(phase)) * 22 : params.motion === "hold" && t < 0.7 ? Math.sin((t / 0.7) * Math.PI) * 22 : 0}deg`;
      }
    }
    function tick(time) {
      if (previous && !paused && !reduced.matches)
        elapsed += Math.min(0.05, (time - previous) / 1000);
      previous = time;
      draw();
      frame = requestAnimationFrame(tick);
    }
    if (["P02", "P06"].includes(id)) frame = requestAnimationFrame(tick);
    return {
      update(nextRound, nextParams) {
        if (params.motion !== nextParams.motion || round !== nextRound)
          changedAt = elapsed;
        round = nextRound;
        params = { ...nextParams };
        draw();
      },
      pause(value) {
        paused = value;
        host.classList.toggle("sandbox-paused", value);
      },
      replay() {
        elapsed = previous = changedAt = 0;
        draw();
        host.querySelectorAll(".event-stage-visual svg *").forEach((node) =>
          node.getAnimations().forEach((animation) => {
            animation.currentTime = 0;
          }),
        );
      },
      destroy() {
        cancelAnimationFrame(frame);
        host.classList.remove("sandbox-paused");
      },
    };
  }
  window.AtlasPhysicsSandbox = { telemetry, patch, patchNode, create };
})();
