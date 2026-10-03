import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";

export async function startPreview() {
  const reservation = createServer();
  reservation.listen(0, "127.0.0.1");
  await once(reservation, "listening");
  const { port } = reservation.address();
  await new Promise((resolve, reject) => reservation.close((error) => error ? reject(error) : resolve()));

  const child = spawn(process.execPath, [
    "node_modules/astro/astro.js", "preview", "--host", "127.0.0.1", "--port", String(port),
  ], { env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" }, stdio: ["ignore", "pipe", "pipe"] });
  let output = "";
  let spawnError;
  child.on("error", (error) => { spawnError = error; });
  for (const stream of [child.stdout, child.stderr]) {
    stream.on("data", (chunk) => { output = `${output}${chunk}`.slice(-8000); });
  }
  const closed = once(child, "close");
  const stop = async () => {
    if (child.exitCode !== null || child.signalCode !== null) return;
    child.kill("SIGTERM");
    const timer = setTimeout(() => child.kill("SIGKILL"), 3000);
    timer.unref();
    try { await closed; } finally { clearTimeout(timer); }
  };
  const origin = `http://127.0.0.1:${port}`;
  try {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (spawnError) throw spawnError;
      if (child.exitCode !== null) throw new Error(`Preview exited early: ${output}`);
      try {
        const response = await fetch(origin, { signal: AbortSignal.timeout(1000) });
        if (response.ok) return { origin, stop };
      } catch { /* Wait for the preview socket, not a fixed startup sleep. */ }
      await delay(100);
    }
    throw new Error(`Preview did not become ready: ${output}`);
  } catch (error) {
    await stop();
    throw error;
  }
}
