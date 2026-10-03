for (const player of document.querySelectorAll<HTMLElement>("[data-media-player]")) {
  const video = player.querySelector<HTMLVideoElement>("[data-local-video]");
  if (video) {
    const button = player.querySelector<HTMLButtonElement>("[data-video-toggle]")!;
    const error = player.querySelector<HTMLElement>("[data-media-error]")!;
    const fail = () => { error.hidden = false; button.textContent = "Retry film"; };
    const toggle = async () => {
      error.hidden = true;
      try { if (video.paused) { await video.play(); video.focus(); } else video.pause(); }
      catch { fail(); }
    };
    button.addEventListener("click", toggle);
    video.addEventListener("keydown", (event) => { if (event.key === " " && event.target === video && !event.repeat) { event.preventDefault(); void toggle(); } });
    video.addEventListener("play", () => { button.textContent = "Pause film"; });
    video.addEventListener("pause", () => { button.textContent = "Play film"; });
    video.addEventListener("error", fail);
    for (const source of video.querySelectorAll("source")) source.addEventListener("error", fail);
  }
  const button = player.querySelector<HTMLButtonElement>("[data-load-embed]");
  if (button) button.addEventListener("click", () => {
    const template = player.querySelector<HTMLTemplateElement>("[data-embed-template]")!;
    player.querySelector("[data-embed-target]")!.append(template.content.cloneNode(true));
    button.disabled = true;
    player.querySelector<HTMLElement>("[data-embed-status]")!.textContent = "External player requested. If unavailable, use the external source link.";
  }, { once: true });
}
