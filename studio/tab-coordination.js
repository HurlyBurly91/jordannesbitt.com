// Advisory browser presence only. Authoritative CAS lives in the private store.
export function coordinateArtworkTabs({ isDirty, onStatus, onSaved, onReturn }) {
  const tab = crypto.randomUUID(), local = new Map(), peers = new Map();
  const validId = (id) => typeof id === "string" && /^[a-z][a-z0-9-]{0,79}$/.test(id);
  let channel = null, sequence = 0, suspended = false;
  try { if (globalThis.BroadcastChannel) channel = new BroadcastChannel("studio-tabs-v1"); } catch {}
  function send(type, data = {}) { channel?.postMessage({ type, tab, sequence: ++sequence, ...data }); }
  function status() { send("status", { drafts: [...local].map(([id, dirty]) => ({ id, dirty })) }); }
  channel?.addEventListener("message", ({ data }) => {
    if (!data || typeof data.tab !== "string" || data.tab === tab || !Number.isSafeInteger(data.sequence)) return;
    const previous = peers.get(data.tab);
    if (previous && previous.sequence >= data.sequence) return;
    if (peers.size >= 64 && !previous) peers.delete(peers.keys().next().value);
    const peer = { sequence: data.sequence, seen: Date.now(), drafts: previous?.drafts ?? new Map() };
    peers.set(data.tab, peer);
    if (data.type === "return" && typeof data.nonce === "string" && /^[a-f0-9-]{36}$/.test(data.nonce)) { onReturn(data.nonce); return; }
    if (data.type === "query") { if (!suspended) status(); return; }
    if (data.type === "status" && Array.isArray(data.drafts)) {
      peer.drafts = new Map(data.drafts.slice(0, 1024).filter((draft) => draft && validId(draft.id)).map((draft) => [draft.id, draft.dirty === true]));
      onStatus();
    }
    if (data.type === "closed") { peer.drafts.clear(); onStatus(); }
    if (data.type === "saved" && validId(data.id)) { peer.drafts.set(data.id, false); onStatus(); onSaved(data.id); }
  });
  setInterval(() => {
    if (!suspended) status();
    let expired = false;
    for (const [id, peer] of peers) if (Date.now() - peer.seen > 4000) { peers.delete(id); expired = true; }
    if (expired) onStatus();
  }, 1000);
  window.addEventListener("pagehide", () => { suspended = true; send("closed"); });
  window.addEventListener("pageshow", () => { suspended = false; status(); send("query"); });
  return {
    supported: Boolean(channel),
    sync(ids) { local.clear(); for (const id of ids) if (validId(id)) local.set(id, Boolean(isDirty(id))); status(); },
    announce(id) { if (validId(id)) { local.set(id, Boolean(isDirty(id))); status(); } },
    hasDirty(id) { return [...peers.values()].some((peer) => Date.now() - peer.seen <= 4000 && peer.drafts.get(id)); },
    query: () => send("query"), saved: (id) => send("saved", { id }), returnToOwner: (nonce) => send("return", { nonce }),
  };
}
