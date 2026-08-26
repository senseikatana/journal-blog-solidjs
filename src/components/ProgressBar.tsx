import { onCleanup, onMount } from "solid-js";

export default function ProgressBar() {
  let barRef: HTMLDivElement | undefined;

  onMount(() => {
    const bar = barRef;
    if (!bar) return;
    const update = () => {
      const st = window.scrollY || document.documentElement.scrollTop;
      const sh = document.documentElement.scrollHeight - window.innerHeight;
      const p = sh > 0 ? Math.min(1, st / sh) : 0;
      bar.style.setProperty("--p", String(p));
      if (p > 0) {
        bar.setAttribute("data-value", "1");
      } else {
        bar.removeAttribute("data-value");
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    onCleanup(() => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    });
  });

  return <div class="progress-bar" id="progressBar" aria-hidden="true" ref={barRef} />;
}
