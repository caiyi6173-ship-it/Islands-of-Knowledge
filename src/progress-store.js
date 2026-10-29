/* Merge independent edits; an older page must never replace a newer run. */
(() => {
  const copy = (value) => JSON.parse(JSON.stringify(value));
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const isMap = (value) =>
    value !== null && typeof value === "object" && !Array.isArray(value);
  const metadata = new Set([
    "version",
    "storageRevision",
    "storageWriter",
    "storageReset",
  ]);

  function merge(base, local, remote) {
    const record = copy(remote),
      conflicts = [];
    function choose(before, mine, theirs, path) {
      if (equal(mine, before)) return theirs;
      if (equal(theirs, before) || equal(mine, theirs)) return mine;
      if (
        Array.isArray(before) &&
        Array.isArray(mine) &&
        Array.isArray(theirs) &&
        before.every((value) => mine.includes(value) && theirs.includes(value))
      )
        return [...new Set([...theirs, ...mine])];
      conflicts.push(path);
      return theirs;
    }
    for (const key of new Set([...Object.keys(base), ...Object.keys(local)])) {
      if (metadata.has(key)) continue;
      if (isMap(base[key]) && isMap(local[key]) && isMap(remote[key])) {
        record[key] = copy(remote[key]);
        for (const id of new Set([
          ...Object.keys(base[key]),
          ...Object.keys(local[key]),
        ])) {
          const value = choose(
            base[key][id],
            local[key][id],
            remote[key][id],
            `${key}.${id}`,
          );
          if (value === undefined) delete record[key][id];
          else record[key][id] = copy(value);
        }
      } else {
        const value = choose(base[key], local[key], remote[key], key);
        if (value === undefined) delete record[key];
        else record[key] = copy(value);
      }
    }
    return { record, conflicts };
  }

  function create({ storage, key, initial, raw = null }) {
    let baseline = copy(initial),
      lastRaw = raw,
      lastWriteBase = null;
    const writer = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    function save(local, { replace = false } = {}) {
      const currentRaw = storage.getItem(key);
      let nextRaw = currentRaw;
      const remoteChanged = currentRaw !== lastRaw;
      let decoded,unreadable=false;
      try {
        decoded=currentRaw===null?{}:JSON.parse(currentRaw);
        if(!isMap(decoded)||(decoded.version!==undefined&&decoded.version!==2))throw new Error("Unrecognized progress record");
      } catch(error) {
        // Only the player's confirmed reset may replace unreadable input.
        // Keep one exact recovery copy; ordinary play must never rewrite it.
        if(!replace)throw error;
        if(currentRaw!==null)storage.setItem(`${key}-unreadable`,currentRaw);
        decoded={};unreadable=true;
      }
      const remote=remoteChanged||unreadable?decoded:copy(baseline);
      // localStorage has no compare-and-swap: two pages may both write revision N.
      // Rebase our acknowledged edit if another writer won that exact race.
      const racedWrite =
        remoteChanged &&
        lastWriteBase &&
        baseline.storageWriter === writer &&
        remote.storageWriter !== writer &&
        remote.storageRevision === baseline.storageRevision;
      const resetChanged =
        remoteChanged && remote.storageReset !== baseline.storageReset;
      const result = replace
        ? { record: copy(local), conflicts: remoteChanged ? ["reset"] : [] }
        : resetChanged
          ? {
              record: remote,
              conflicts: equal(local, baseline) ? [] : ["reset"],
            }
          : merge(racedWrite ? lastWriteBase : baseline, local, remote);
      if (result.conflicts.length) {
        // One bounded recovery copy, without overwriting the newer shared record.
        storage.setItem(
          `${key}-conflict`,
          JSON.stringify({
            savedAt: new Date().toISOString(),
            progress: local,
          }),
        );
        result.record = remote;
      } else if (replace || !equal(result.record, remote)) {
        const revision = Number.isSafeInteger(remote.storageRevision)
          ? remote.storageRevision
          : 0;
        result.record = {
          ...result.record,
          version: 2,
          storageRevision: revision + 1,
          storageWriter: writer,
          ...(replace ? { storageReset: `${writer}-${revision + 1}` } : {}),
        };
        nextRaw = JSON.stringify(result.record);
        storage.setItem(key, nextRaw);
        lastWriteBase = copy(remote);
      }
      if (result.record.storageWriter !== writer) lastWriteBase = null;
      baseline = copy(result.record);
      lastRaw = nextRaw;
      return { ...result, remoteChanged, resetChanged };
    }
    return { save };
  }
  const api = { create };
  if (typeof window !== "undefined") window.AtlasProgressStore = api;
  if (typeof module !== "undefined") module.exports = api;
})();
