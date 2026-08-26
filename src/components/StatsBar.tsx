import { createSignal, onCleanup, onMount } from "solid-js";
import { animateCounter } from "~/lib/animate";
import { forksFlash, starsFlash, totalForks, totalStars } from "~/lib/repoStats";

export default function StatsBar() {
  const [essays, setEssays] = createSignal(0);
  const [words, setWords] = createSignal(0);
  let barRef: HTMLDivElement | undefined;

  onMount(() => {
    const bar = barRef;
    if (!bar) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          animateCounter(setEssays, 47);
          animateCounter(setWords, 184_320);
          observer.unobserve(bar);
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(bar);
    onCleanup(() => observer.disconnect());
  });

  return (
    <div class="stats-bar" ref={barRef}>
      <div class="container">
        <div class="stats-grid">
          <div class="stat" id="stat-stars" classList={{ flash: starsFlash() }}>
            <span class="stat-label">github stars</span>
            <span class="stat-value">
              <span class="num">{totalStars().toLocaleString()}</span>
              <span class="unit">★</span>
            </span>
            <span class="stat-sub">
              <span class="arrow">↗</span> +14 this week
            </span>
          </div>
          <div class="stat" id="stat-forks" classList={{ flash: forksFlash() }}>
            <span class="stat-label">forks across repos</span>
            <span class="stat-value">
              <span class="num">{totalForks().toLocaleString()}</span>
              <span class="unit">⑂</span>
            </span>
            <span class="stat-sub">
              <span class="arrow">↗</span> +3 this week
            </span>
          </div>
          <div class="stat">
            <span class="stat-label">essays published</span>
            <span class="stat-value">
              <span class="num">{essays().toLocaleString()}</span>
            </span>
            <span class="stat-sub">since 2021</span>
          </div>
          <div class="stat">
            <span class="stat-label">words in the archive</span>
            <span class="stat-value">
              <span class="num">{words().toLocaleString()}</span>
            </span>
            <span class="stat-sub">~14 min avg read</span>
          </div>
        </div>
      </div>
    </div>
  );
}
