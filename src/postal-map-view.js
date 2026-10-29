(() => {
  const S=window.AtlasPostalWorld,Art=window.AtlasPostalArt;
  const {P,C,M}=S.stations;
  const paths={PC:`M${P.x} ${P.y}Q1480 700 ${C.x} ${C.y}`,CM:`M${C.x} ${C.y}Q730 1030 ${M.x} ${M.y}`,MP:`M${M.x} ${M.y}Q780 610 ${P.x} ${P.y}`};
  const islands={
    P:{x:1210,y:270,index:'01',english:'PHYSICS',symbol:'<ellipse cx="20" cy="20" rx="18" ry="7"/><ellipse cx="20" cy="20" rx="18" ry="7" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="18" ry="7" transform="rotate(120 20 20)"/><circle cx="20" cy="20" r="2" fill="currentColor"/>'},
    M:{x:380,y:250,index:'02',english:'MATHEMATICS',symbol:'<path d="M5 33L19 6L35 33Z M5 33L26 17 M14 16L35 33"/><circle cx="20" cy="20" r="18" opacity=".4"/>'},
    C:{x:815,y:650,index:'03',english:'CHEMISTRY',symbol:'<path d="M9 13L20 6L31 13V26L20 33L9 26Z M9 13L20 20L31 13 M20 20V33"/><circle cx="9" cy="13" r="3" fill="currentColor"/><circle cx="31" cy="26" r="3" fill="currentColor"/>'},
  };
  function stations(snapshot) {
    return snapshot.places.map(p=>{
      const island=islands[p.id];
      return `<button class="island-identity" data-island="${p.id}" aria-label="探索${p.island}" title="单击查看介绍，双击进入${p.island}" style="left:${island.x}px;top:${island.y}px">
        <span class="island-title-head"><svg viewBox="0 0 40 40" aria-hidden="true">${island.symbol}</svg><span>${island.english}<small>ISLAND ${island.index}</small></span></span>
        <strong class="island-title-name">${p.island}</strong><span class="island-title-footer"><span>10 个故事现场</span><span aria-hidden="true">探索 ↗</span></span>
      </button><div class="postal-world-station ${p.localComplete?'has-record':''}" data-station="${p.id}" style="left:${p.x}px;top:${p.y}px">
        <button data-post-station="${p.id}" aria-label="到${p.name}" title="${p.name} · ${p.activity} · 单击或双击均可进入"><span class="postal-station-art">${Art.stationIcon(p.id,p)}<i aria-hidden="true">✉</i></span><strong>${p.name}</strong></button>
      </div>`;
    }).join('');
  }
  function routes(snapshot) {
    return `<defs><marker id="postal-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 1L6 4L0 7" fill="none" stroke="context-stroke" stroke-width="1.5"/></marker></defs>`+
      snapshot.routes.map(r=>`<path data-post-route="${r.id}" data-state="${r.state}" d="${paths[r.id]}" marker-end="url(#postal-arrow)" ${r.state==='night'?'marker-start="url(#postal-arrow)"':''}/>`).join('')+
      `<g class="postal-route-caption" transform="translate(790 482)"><rect x="-130" y="-23" width="260" height="46"/><text text-anchor="middle" y="-5">${snapshot.routeTitle}</text><text text-anchor="middle" y="14" class="postal-route-note">${snapshot.fullCircuit?'潮汐港 → 标本港 → 测绘台 → 潮汐港':snapshot.phase>=2?'实线：已接应 · 虚线：仍待整圈试航':snapshot.phase?'首船已到达 · 夜邮尚未成圈':'可自由前往三站，灰线只是邮路草图'}</text></g>`;
  }
  function localStation(subject,snapshot) {
    const p=snapshot.places.find(p=>p.id===subject);
    return p?`<button class="postal-local-station" data-post-station="${subject}" title="单击或双击进入${p.name}" style="left:${p.islandX}px;top:${p.islandY}px"><span>✉</span><strong>${p.name}</strong><small>${p.activity}</small></button>`:'';
  }
  function taskStrip(snapshot) {
    if(!snapshot.chapter)return '<span class="postal-task-end">✓ 五份回条已留存 · 三十个现场继续开放</span>';
    return snapshot.tasks.map(t=>`<button data-post-task="${t.id}" class="${t.complete?'is-complete':''}" aria-label="${t.title}，${t.complete?'已归档，可回访':'待核对，可直接前往'}">${t.complete?'✓':'○'} ${t.id} ${t.complete?'已归档':'前往'}</button>`).join('');
  }
  function quest(snapshot) {
    if(!snapshot.chapter)return {title:'整圈夜邮已回来',subtitle:'回邮局看看你的桌位，或继续自由探索',action:'office'};
    return {title:snapshot.phase===0?'四箱，寄给小禾':`${snapshot.chapter.id} · ${snapshot.chapter.title}`,
      subtitle:snapshot.ready?'三份成果齐了，可以共同交付':snapshot.chapter.need,action:snapshot.ready?'deliver':'research'};
  }
  window.AtlasPostalMapView={stations,routes,localStation,taskStrip,quest};
})();
