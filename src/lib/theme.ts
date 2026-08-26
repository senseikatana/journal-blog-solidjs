import { createSignal } from "solid-js";

export const THEMES = ["dark", "light", "hc"] as const;
export type Theme = (typeof THEMES)[number];

const [theme, setThemeSignal] = createSignal<Theme>("dark");

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
}

export function getSavedTheme(): Theme {
  try {
    const saved = localStorage.getItem("theme") as Theme | null;
    return saved && THEMES.includes(saved) ? saved : "dark";
  } catch {
    return "dark";
  }
}

export function initTheme() {
  const t = getSavedTheme();
  setThemeSignal(t);
  applyTheme(t);
}

export function setTheme(t: Theme) {
  setThemeSignal(t);
  applyTheme(t);
  try {
    localStorage.setItem("theme", t);
  } catch {
    /* storage unavailable */
  }
}

export function cycleTheme() {
  const cur = theme();
  const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
  setTheme(next);
}

export { theme };
