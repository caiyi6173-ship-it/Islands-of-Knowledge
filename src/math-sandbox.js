/* Math sandbox live telemetry and DOM diffing engine. */
(() => {
  const G = window.AtlasMathScenarios;
  const M = window.AtlasMathModels;

  function telemetry(id, round, params) {
    const result = G.test(id, round, params);
    const p = result.params;
    let metrics = result.readings;

    if (id === "M01" && round === 1) {
      const q = M.evaluate(id, p, round);
      metrics = [
        ...metrics,
        ["本次观察", q.closeEnough ? "残差较小，但不为零" : "当前残差较大"],
      ];
    } else if (id === "M05" && round === 1) {
      const q = M.evaluate(id, p, round);
      metrics = [
        ...metrics,
        ["拱下安全余量", `${(q.clearanceAt3 - 3.5).toFixed(2)} 米`],
      ];
    } else if (id === "M08" && round === 0) {
      const q = M.evaluate(id, p, round);
      metrics = [...metrics, ["合航向速度", `${q.resultant.toFixed(2)} m/s`]];
    }

    return {
      metrics,
      statusText: result.detail,
      statusKind: result.success ? "eureka" : "neutral",
      isSuccess: result.success,
      result,
    };
  }

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
      const seconds = elapsed - changedAt;
      if (id === "M01" && round === 0)
        host.querySelectorAll("[data-live-string]").forEach((string, i) => {
          const length = Number(string.dataset.length),
            y = i ? 235 : 190;
          const amplitude =
            Math.sin(seconds * (i ? 19 : 13)) *
            3 *
            Math.exp(-(seconds % 4) * 0.35);
          string.setAttribute(
            "d",
            `M187 ${y}Q${187 + length / 2} ${y + amplitude} ${187 + length} ${y}`,
          );
        });
      if (id === "M08") {
        const q = M.evaluate(id, params, round),
          boat = host.querySelector("[data-live-boat]");
        const duration = q.vy > 0.01 ? 205 / (q.vy * 12) : 6,
          time = seconds % (Math.min(12, duration) + 0.8);
        if (boat)
          boat.style.transform = `translate(${Math.max(-175, Math.min(280, q.vx * time * 12))}px,${-Math.min(205, Math.max(0, q.vy * time * 12))}px)`;
      }
      if (id === "M07" && round === 0 && params.shapeType === "quadrilateral") {
        const shift = 45 + 18 * Math.sin(seconds * 2),
          rise = Math.sqrt(45 ** 2 + 160 ** 2 - shift ** 2);
        const points = [
          [230, 310],
          [525, 310],
          [525 + shift, 310 - rise],
          [230 + shift, 310 - rise],
        ];
        host
          .querySelector('[data-live-frame="quad"]')
          ?.setAttribute("points", points.map((p) => p.join(",")).join(" "));
        host.querySelectorAll("[data-frame-joint]").forEach((joint, i) => {
          joint.setAttribute("cx", points[i][0]);
          joint.setAttribute("cy", points[i][1]);
        });
      }
    }

    function tick(time) {
      if (previous && !paused && !reduced.matches)
        elapsed += Math.min(0.05, (time - previous) / 1000);
      previous = time;
      draw();
      frame = requestAnimationFrame(tick);
    }

    if (["M01", "M07", "M08"].includes(id)) frame = requestAnimationFrame(tick);

    return {
      update(nextRound, nextParams) {
        if (
          round !== nextRound ||
          JSON.stringify(params) !== JSON.stringify(nextParams)
        )
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
        host
          .querySelectorAll(".math-svg-slot *")
          .forEach((node) =>
            node
              .getAnimations()
              .forEach((animation) => (animation.currentTime = 0)),
          );
      },
      destroy() {
        cancelAnimationFrame(frame);
        host.classList.remove("sandbox-paused");
      },
    };
  }

  const api = { telemetry, patch, patchNode, create };

  if (typeof window !== "undefined") window.AtlasMathSandbox = api;
  if (typeof module !== "undefined") module.exports = api;
})();
