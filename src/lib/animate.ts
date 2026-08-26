export function animateCounter(set: (value: number) => void, target: number, duration = 1600) {
  const start = 0;
  const startTime = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    set(Math.floor(start + (target - start) * eased));
    if (t < 1) requestAnimationFrame(step);
    else set(target);
  };
  requestAnimationFrame(step);
}
