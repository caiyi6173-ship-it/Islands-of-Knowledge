/* Site opening: its session marker is independent of all game saves. */
(() => {
  const host = document.getElementById("site-prologue");
  const D = window.AtlasSitePrologueData;
  if (!host || !D || !window.AtlasSitePrologueArt) { if (host) host.hidden = true; return; }
  const esc = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
  const libraries = {
    P: { data:window.AtlasPhysicsData, art:window.AtlasPhysicsPixelArt },
    M: { data:window.AtlasMathData, art:window.AtlasMathPixelArt },
    C: { data:window.AtlasChemistryData, art:window.AtlasChemistryArt },
  };
  const cast = new Map(), portraits = new Map(), unique = new Set();
  for (const library of Object.values(libraries)) for (const person of library.data?.levels || []) {
    cast.set(person.id, {...person, art:library.art});
    if (unique.has(person.english)) continue;
    unique.add(person.english);
    const svg = library.art?.portrait(person.id);
    if (svg) {
      const image = new Image();
      const bounds = svg.match(/viewBox="[\d.]+ [\d.]+ ([\d.]+) ([\d.]+)"/);
      const sprite = svg.replace(/<rect x="0" y="0" width="38" height="40"[^>]*\/>/, "")
        .replace(/<rect x="2" y="1" width="36" height="42"[^>]*\/>/, "")
        .replace("<svg ", `<svg ${svg.includes("xmlns=") ? "" : 'xmlns="http://www.w3.org/2000/svg" '}width="${bounds?.[1] || 38}" height="${bounds?.[2] || 40}" `);
      image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(sprite);
      portraits.set(person.id, image);
    }
  }
  const clock = ms => `${String(Math.floor(ms/60000)).padStart(2,"0")}:${String(Math.floor(ms/1000)%60).padStart(2,"0")}`;
  let current = null;

  function open() {
    if (current) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let elapsed = 0, paused = reducedMotion, last = null, lastPaint = -Infinity, raf = 0;
    let sceneIndex = -1, cueKey = "", active = true, sound = false, audio = null, gain = null, musicTimer = 0, note = 0;
    let speechOwned = false, narrator = null, narrationFailed = false, narratedCue = "", speechGeneration = 0;
    const synthesis = window.speechSynthesis;
    const previousFocus = document.activeElement;
    const background = [...document.body.children].filter(el => el !== host && !["SCRIPT","STYLE"].includes(el.tagName)).map(el => ({el,inert:el.inert}));
    for (const {el} of background) el.inert = true;
    host.hidden = false;
    host.dataset.state = "playing";
    host.classList.toggle("op-reduced", reducedMotion);
    host.innerHTML = `
      <div class="op-shell">
        <header class="op-header">
          <div class="op-brand"><span aria-hidden="true">✧</span><div><b>知识群岛</b><small>序章 · 答案之前</small></div></div>
          <div class="op-header-actions"><button data-opening="sound" aria-pressed="false" aria-label="开启中文旁白与像素配乐">♫ <span>声音 关</span></button><button data-opening="exit" class="op-skip">跳过序章 <span aria-hidden="true">↗</span></button></div>
        </header>
        <div class="op-chapter" aria-live="polite" aria-atomic="true"><p class="op-era"></p><h1 id="opening-title"></h1></div>
        <div class="op-stage"><canvas aria-hidden="true" width="960" height="440"></canvas><div class="op-stage-border" aria-hidden="true"></div><span class="op-scene-count" aria-hidden="true"></span><span class="op-film-tag" aria-hidden="true">A HISTORY OF ASKING</span></div>
        <div class="op-cast" aria-label="本幕中的游戏人物"></div>
        <div class="op-caption"><span class="op-quote-mark" aria-hidden="true">“</span><p aria-live="polite" aria-atomic="true"></p><small class="op-audio-status" role="status">${reducedMotion ? "已暂停自动播放 · 可以逐幕阅读" : "一颗微光，穿过人类提问的历史"}</small></div>
        <footer class="op-footer">
          <div class="op-timeline" aria-label="选择序章分幕">${D.scenes.map((scene,i) => `<button data-opening-scene="${i}" aria-label="第${i+1}幕：${esc(scene.title)}" title="${esc(scene.title)}"><i></i><span>${String(i+1).padStart(2,"0")}</span></button>`).join("")}</div>
          <div class="op-playback"><div class="op-readiness"><i></i><span class="op-load-state" role="status">正在展开地图…</span><span class="op-time" aria-hidden="true"></span></div><div class="op-controls"><button data-opening="previous" aria-label="上一幕">← <span>上一幕</span></button><button data-opening="pause" aria-pressed="${paused}" aria-label="${paused?"继续播放":"暂停播放"}">${paused?"▶ 继续":"Ⅱ 暂停"}</button><button data-opening="next" aria-label="下一幕"><span>下一幕</span> →</button><button data-opening="exit" class="op-launch" hidden>启航，进入群岛 ↗</button></div></div>
          <div class="op-progress" role="progressbar" aria-label="序章播放进度" aria-valuemin="0" aria-valuemax="96" aria-valuenow="0"><i></i></div>
        </footer>
      </div>`;
    const $ = selector => host.querySelector(selector);
    const painter = window.AtlasSitePrologueArt.create($("canvas"), portraits);
    const map = document.getElementById("world-art");
    function ready(error = false) {
      $(".op-load-state").textContent = error ? "地图插画暂不可用 · 仍可进入探索" : "地图已就绪 · 随时可以启航";
      $(".op-readiness").dataset.ready = String(!error);
    }
    const onMapLoad = () => ready();
    const onMapError = () => ready(true);
    map?.addEventListener("load", onMapLoad);
    map?.addEventListener("error", onMapError);
    if (map?.complete) ready(!map.naturalWidth);

    function voice() {
      return synthesis?.getVoices().find(item => /^zh(?:-|_)/i.test(item.lang) || item.lang === "zh");
    }
    function stopSpeech() {
      speechGeneration++;
      narratedCue = "";
      if (narrator) { narrator.pause(); try { narrator.currentTime = 0; } catch { /* An unloaded clip has nothing to rewind. */ } }
      if (speechOwned) synthesis?.cancel();
      speechOwned = false;
    }
    function speakFallback() {
      if (!active || !sound || paused || document.hidden || !voice() || !window.SpeechSynthesisUtterance) return;
      const frame = D.frameAt(elapsed);
      const utterance = new SpeechSynthesisUtterance(frame.scene.lines[frame.cue]);
      utterance.lang = voice().lang;
      utterance.voice = voice();
      utterance.rate = 1.08;
      utterance.volume = .9;
      speechOwned = true;
      narratedCue = `${frame.index}-${frame.cue}`;
      synthesis.speak(utterance);
    }
    function failNarration(generation) {
      if (!active || generation !== speechGeneration || narrationFailed) return;
      narrationFailed = true;
      narrator?.pause();
      soundStatus();
      speakFallback();
    }
    function playNarration() {
      const generation = speechGeneration;
      narrator?.play().catch(error => { if (error.name !== "AbortError") failNarration(generation); });
    }
    function speak() {
      stopSpeech();
      if (!sound || paused || document.hidden) return;
      if (narrationFailed) { speakFallback(); return; }
      const frame = D.frameAt(elapsed);
      if (!narrator) { narrator = new Audio(); narrator.preload = "none"; narrator.volume = .95; }
      const generation = speechGeneration;
      narratedCue = `${frame.index}-${frame.cue}`;
      narrator.onerror = () => failNarration(generation);
      narrator.src = `./assets/prologue/${frame.scene.id}-${frame.cue}.mp3`;
      playNarration();
    }
    function soundStatus() {
      if (!sound) return;
      $(".op-audio-status").textContent = !narrationFailed ? (audio ? "中文旁白与像素配乐已开启" : "本地中文旁白已开启") : voice() ? "音频暂不可用 · 已切换本机中文朗读" : audio ? "旁白暂不可用 · 字幕与配乐继续播放" : "当前浏览器无法播放声音 · 请阅读字幕";
    }
    function syncAudio() {
      const quiet = !sound || paused || document.hidden;
      if (quiet) {
        audio?.suspend().catch(() => {});
        narrator?.pause();
        if (speechOwned) synthesis?.pause();
      } else {
        audio?.resume().catch(() => {});
        if (narrator && !narrationFailed && narratedCue === cueKey) playNarration();
        else if (speechOwned) synthesis?.resume(); else speak();
      }
    }
    function musicNote() {
      if (!active || !audio || audio.state !== "running" || paused || document.hidden || !sound) return;
      const notes = [220, 329.63, 440, 293.66, 261.63, 392, 329.63, 293.66];
      const oscillator = audio.createOscillator(), envelope = audio.createGain();
      const start = audio.currentTime;
      oscillator.type = note % 4 === 0 ? "triangle" : "sine";
      oscillator.frequency.value = notes[note++ % notes.length] * (sceneIndex >= 7 ? 1 : .5);
      envelope.gain.setValueAtTime(0, start);
      envelope.gain.linearRampToValueAtTime(.04, start+.04);
      envelope.gain.exponentialRampToValueAtTime(.0001, start+.75);
      oscillator.connect(envelope); envelope.connect(gain);
      oscillator.start(start); oscillator.stop(start+.8);
      oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
    }
    function toggleSound() {
      sound = !sound;
      if (sound && !audio) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (Audio) {
          try { audio = new Audio(); gain = audio.createGain(); gain.gain.value = .65; gain.connect(audio.destination); musicTimer = setInterval(musicNote, 580); } catch { audio = null; }
        }
      }
      const button = $('[data-opening="sound"]');
      button.setAttribute("aria-pressed", String(sound));
      button.setAttribute("aria-label", sound ? "关闭中文旁白与像素配乐" : "开启中文旁白与像素配乐");
      button.querySelector("span").textContent = sound ? "声音 开" : "声音 关";
      if (sound) { soundStatus(); syncAudio(); }
      else { stopSpeech(); syncAudio(); $(".op-audio-status").textContent = "声音已关闭 · 字幕继续播放"; }
    }
    function update(force = false) {
      const frame = D.frameAt(elapsed);
      host.dataset.scene = frame.scene.id;
      host.dataset.elapsed = String(Math.floor(elapsed));
      host.dataset.paused = String(paused);
      host.style.setProperty("--op-accent", frame.scene.color);
      if (force || sceneIndex !== frame.index) {
        sceneIndex = frame.index;
        $(".op-era").textContent = frame.scene.era;
        $("#opening-title").textContent = frame.scene.title;
        $(".op-scene-count").textContent = `${String(frame.index+1).padStart(2,"0")} / 09`;
        $(".op-cast").innerHTML = frame.scene.cast.length ? frame.scene.cast.map(id => {
          const actor = cast.get(id);
          return `<div class="op-person" data-opening-person="${id}"><span aria-hidden="true">${actor?.art?.portrait(id) || ""}</span><b>${esc(actor?.person || "")}</b></div>`;
        }).join("") : `<p class="op-cast-note">${frame.index === 0 ? "在抵达答案之前，我们先回望提问的来处。" : "三座岛屿 · 三十场探索 · 从你的第一个问题开始"}</p>`;
        for (const [i,button] of [...host.querySelectorAll("[data-opening-scene]")].entries()) {
          if (i===frame.index) button.setAttribute("aria-current", "step"); else button.removeAttribute("aria-current");
          button.classList.toggle("op-played", i<frame.index);
        }
        $('[data-opening="previous"]').disabled = frame.index === 0;
        $('[data-opening="next"]').hidden = frame.index === D.scenes.length-1;
        $(".op-launch").hidden = frame.index !== D.scenes.length-1;
      }
      const cue = `${frame.index}-${frame.cue}`;
      if (force || cueKey !== cue) {
        cueKey = cue;
        $(".op-caption p").textContent = frame.scene.lines[frame.cue];
        speak();
      }
      for (const [i,bar] of [...host.querySelectorAll(".op-timeline i")].entries()) bar.style.transform = `scaleX(${i<frame.index?1:i===frame.index?frame.progress:0})`;
      $(".op-time").textContent = `${clock(elapsed)} / ${clock(D.totalDuration)}`;
      $(".op-progress").setAttribute("aria-valuenow", String(Math.floor(elapsed/1000)));
      $(".op-progress > i").style.transform = `scaleX(${elapsed/D.totalDuration})`;
      painter.draw(frame, reducedMotion, paused);
    }
    function pauseToggle() {
      paused = !paused; last = null;
      const button = $('[data-opening="pause"]');
      button.textContent = paused ? "▶ 继续" : "Ⅱ 暂停";
      button.setAttribute("aria-pressed", String(paused));
      button.setAttribute("aria-label", paused ? "继续播放" : "暂停播放");
      syncAudio(); update();
    }
    function goTo(index) {
      if (index<0 || index>=D.scenes.length) return;
      elapsed = D.scenes[index].start; last = null; stopSpeech(); update(true);
    }
    function finish() {
      if (!active) return;
      active = false;
      cancelAnimationFrame(raf); clearInterval(musicTimer); stopSpeech();
      if (narrator) { narrator.onerror = null; narrator.removeAttribute("src"); narrator.load(); narrator = null; }
      audio?.close().catch(() => {});
      map?.removeEventListener("load", onMapLoad); map?.removeEventListener("error", onMapError);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("pagehide", onPageHide);
      synthesis?.removeEventListener("voiceschanged", onVoices);
      host.removeEventListener("click", onClick);
      for (const {el,inert} of background) el.inert = inert;
      try { sessionStorage.setItem(D.sessionKey, "seen"); } catch { /* Playback remains optional when storage is unavailable. */ }
      host.hidden = true; host.dataset.state = "finished"; current = null;
      const target = previousFocus?.isConnected && previousFocus !== document.body && !previousFocus.closest("[hidden]") ? previousFocus : document.querySelector('button[data-subject="ALL"]');
      target?.focus({preventScroll:true});
    }
    function onClick(event) {
      const scene = event.target.closest("[data-opening-scene]");
      if (scene) { goTo(Number(scene.dataset.openingScene)); return; }
      const action = event.target.closest("[data-opening]")?.dataset.opening;
      if (action === "exit") finish();
      else if (action === "pause") pauseToggle();
      else if (action === "sound") toggleSound();
      else if (action === "next") goTo(sceneIndex+1);
      else if (action === "previous") goTo(sceneIndex-1);
    }
    function onKey(event) {
      if (!active) return;
      event.stopImmediatePropagation();
      if (event.key === "Escape") {event.preventDefault();finish();}
      else if (event.key === " " && event.target.tagName !== "BUTTON") {event.preventDefault();pauseToggle();}
      else if (event.key === "ArrowRight") {event.preventDefault();goTo(sceneIndex+1);}
      else if (event.key === "ArrowLeft") {event.preventDefault();goTo(sceneIndex-1);}
      else if (event.key === "Tab") {
        const buttons = [...host.querySelectorAll("button:not(:disabled)")].filter(button => !button.hidden && button.getClientRects().length);
        const first=buttons[0], final=buttons.at(-1);
        if (event.shiftKey && (document.activeElement===first || !host.contains(document.activeElement))) {event.preventDefault();final?.focus();}
        else if (!event.shiftKey && (document.activeElement===final || !host.contains(document.activeElement))) {event.preventDefault();first?.focus();}
      }
    }
    function onVisibility() { last=null;syncAudio();update(); }
    function onVoices() {if(narrationFailed){soundStatus();if(sound)speak();}}
    function onPageHide() { finish(); }
    function tick(timestamp) {
      if (!active) return;
      if (!paused && !document.hidden && last !== null) elapsed += Math.min(250, Math.max(0,timestamp-last));
      last = timestamp;
      if (elapsed>=D.totalDuration) {finish();return;}
      if (timestamp-lastPaint>50) {lastPaint=timestamp;update();}
      raf=requestAnimationFrame(tick);
    }
    host.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey, true);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    synthesis?.addEventListener("voiceschanged", onVoices);
    current={finish};update(true);
    // Focus the dialog itself, so Space pauses playback and Tab reaches its controls.
    host.focus({preventScroll:true});
    raf=requestAnimationFrame(tick);
  }
  window.AtlasSitePrologue={open, close:()=>current?.finish(), get isOpen(){return Boolean(current);}};
  // The courier's first job is the entry. The longer science film stays in Help.
  host.hidden=true;
})();
