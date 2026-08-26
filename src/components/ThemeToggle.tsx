import { For } from "solid-js";
import { setTheme, THEMES, theme } from "~/lib/theme";

export default function ThemeToggle() {
  return (
    <div
      class="theme-toggle"
      id="themeToggle"
      data-state={theme()}
      role="radiogroup"
      aria-label="Theme"
    >
      <span class="indicator" aria-hidden="true"></span>
      <For each={THEMES}>
        {(t) => (
          <button
            data-theme-set={t}
            classList={{ active: theme() === t }}
            role="radio"
            aria-checked={theme() === t ? "true" : "false"}
            onClick={() => setTheme(t)}
          >
            {t}
          </button>
        )}
      </For>
    </div>
  );
}
