// Browser-only ownership. Peer announcements never authorize writes or carry drafts.
export function coordinateArtworkTabs({ isDirty, onStatus, onFocus, onReturn }) {
  const supported = Boolean(navigator.locks && globalThis.BroadcastChannel);
  const tab = crypto.randomUUID(), held = new Map(), pending = new Map(), peers = new Map();
  const channel = supported ? new BroadcastChannel("studio-tabs-v1") : null;
  const validId = (id) => typeof id === "string" && /^[a-z][a-z0-9-]*$/.test(id);
  let sequence = 0;
  function send(type, data = {}) { channel?.postMessage({ type, tab, sequence: ++sequence, ...data }); }
  function announce(id) { if (held.has(id)) send("status", { id, dirty: Boolean(isDirty(id)) }); }
  channel?.addEventListener("message", ({ data }) => {
    if (!data || typeof data.tab !== "string" || data.tab === tab || !Number.isSafeInteger(data.sequence)) return;
    const previous = peers.get(data.tab);
    if (previous && previous.sequence >= data.sequence) return;
    if (peers.size >= 64 && !previous) peers.delete(peers.keys().next().value);
    peers.set(data.tab, { sequence: data.sequence });
    if (data.type === "return" && typeof data.nonce === "string" && /^[a-f0-9-]{36}$/.test(data.nonce)) { onReturn(data.nonce); return; }
    if (!validId(data.id)) return;
    if (data.type === "query") announce(data.id);
    if (data.type === "focus" && held.has(data.id)) onFocus(data.id);
    if (["status", "released", "saved"].includes(data.type)) onStatus({ id: data.id, type: data.type, dirty: data.dirty === true });
  });
  function release(id) {
    pending.get(id)?.cancel();
    const entry = held.get(id);
    if (entry) { held.delete(id); entry.release(); send("released", { id }); }
  }
  async function acquire(id) {
    if (!supported || !validId(id)) return false;
    if (held.has(id)) return true;
    if (pending.has(id)) return pending.get(id).ready;
    let answer, unlock, cancelled = false;
    const ready = new Promise((done) => { answer = done; });
    const lifetime = new Promise((done) => { unlock = done; });
    pending.set(id, { ready, cancel: () => { cancelled = true; } });
    navigator.locks.request(`studio-artwork-${id}`, { ifAvailable: true }, async (lock) => {
      pending.delete(id);
      if (!lock || cancelled) { answer(false); send("query", { id }); return; }
      held.set(id, { release: unlock }); answer(true); announce(id);
      await lifetime;
    }).catch(() => { pending.delete(id); answer(false); });
    return ready;
  }
  window.addEventListener("pagehide", () => { for (const id of new Set([...held.keys(), ...pending.keys()])) release(id); });
  return {
    supported, acquire, release, owns: (id) => held.has(id), announce,
    query: (id) => send("query", { id }), focus: (id) => send("focus", { id }),
    saved: (id) => send("saved", { id }), returnToOwner: (nonce) => send("return", { nonce }),
  };
}
