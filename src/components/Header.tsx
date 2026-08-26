import { A, useLocation } from "@solidjs/router";
import { createEffect, createSignal, For } from "solid-js";
import { SITE_TITLE } from "~/consts";
import { homeHref, mainNav } from "~/lib/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const location = useLocation();
  const [active, setActive] = createSignal("");

  createEffect(() => {
    const path = location.pathname.replace(/\/+$/, "");
    if (path.startsWith("/projects")) {
      setActive("projects");
    } else if (path.startsWith("/resume")) {
      setActive("resume");
    } else if (path.startsWith("/about")) {
      setActive("about");
    } else {
      setActive("");
    }
  });

  return (
    <header class="site-header">
      <div class="header-inner">
        <A href={homeHref} class="brand" aria-label={SITE_TITLE}>
          <span class="brand-mark">{"{}"}</span>
          <span class="brand-text">
            sys.write<span class="paren">()</span>
            <span class="cursor">_</span>
          </span>
        </A>
        <nav class="primary" aria-label="Primary">
          <For each={mainNav}>
            {(item) => (
              <A
                class="nav-link"
                classList={{ active: active() === item.key }}
                data-nav={item.key}
                href={item.href}
              >
                {item.label}
              </A>
            )}
          </For>
        </nav>
        <div class="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
