import { createSignal } from "solid-js";

// Top-of-page aggregate counters, bumped by the live GitHub simulation
// running in RepoCard (port of the original script's #stat-stars/#stat-forks sync).
const [totalStars, setTotalStars] = createSignal(0);
const [totalForks, setTotalForks] = createSignal(0);
const [starsFlash, setStarsFlash] = createSignal(false);
const [forksFlash, setForksFlash] = createSignal(false);

let starsTimer: ReturnType<typeof setTimeout> | undefined;
let forksTimer: ReturnType<typeof setTimeout> | undefined;

export function bumpStars() {
  setTotalStars((v) => v + 1);
  setStarsFlash(true);
  clearTimeout(starsTimer);
  starsTimer = setTimeout(() => setStarsFlash(false), 800);
}

export function bumpForks() {
  setTotalForks((v) => v + 1);
  setForksFlash(true);
  clearTimeout(forksTimer);
  forksTimer = setTimeout(() => setForksFlash(false), 800);
}

export { totalStars, totalForks, starsFlash, forksFlash };
