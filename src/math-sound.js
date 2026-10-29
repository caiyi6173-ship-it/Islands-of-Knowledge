/* ==========================================================================
   AtlasMathSound (8-Bit 像素晶体管音效合成器)
   基于原生 Web Audio API，专为数学岛打造的音律与几何和弦合成器
   ========================================================================== */

(() => {
  let ctx = null;
  let muted = false;

  try {
    muted = localStorage.getItem("atlas_math_sound_muted") === "true";
  } catch {
    muted = false;
  }

  function getContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function playClick() {
    if (muted) return;
    const c = getContext();
    if (!c) return;
    try {
      const now = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // ignore
    }
  }

  function playParam() {
    if (muted) return;
    const c = getContext();
    if (!c) return;
    try {
      const now = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.05); // E5
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  function playEureka() {
    if (muted) return;
    const c = getContext();
    if (!c) return;
    try {
      const now = c.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.09, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.24);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.26);
      });
    } catch {
      // ignore
    }
  }

  function playFail() {
    if (muted) return;
    const c = getContext();
    if (!c) return;
    try {
      const now = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.16);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // ignore
    }
  }

  function playStamp() {
    if (muted) return;
    const c = getContext();
    if (!c) return;
    try {
      const now = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // ignore
    }
  }

  function isMuted() {
    return muted;
  }
  function playRatio(ratio) {
    if (muted) return;
    const [a, b] = String(ratio).split(":").map(Number);
    if (!(a > 0 && b > 0)) return;
    const c = getContext();
    if (!c) return;
    const now = c.currentTime;
    [220, (220 * b) / a].forEach((frequency) => {
      const osc = c.createOscillator(),
        gain = c.createGain();
      osc.type = "triangle";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now);
      osc.stop(now + 1.7);
    });
  }

  function toggleMute() {
    muted = !muted;
    try {
      localStorage.setItem("atlas_math_sound_muted", String(muted));
    } catch {
      // ignore
    }
    return muted;
  }

  const api = {
    playRatio,
    playClick,
    playParam,
    playEureka,
    playFail,
    playStamp,
    isMuted,
    toggleMute,
  };

  if (typeof window !== "undefined") window.AtlasMathSound = api;
  if (typeof module !== "undefined") module.exports = api;
})();
