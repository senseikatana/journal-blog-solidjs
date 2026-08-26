import { A, useLocation, useNavigate } from "@solidjs/router";
import { createEffect, createSignal, For, onCleanup, onMount } from "solid-js";
import { SITE_TITLE } from "~/consts";
import { homeHref, homeSections, mainNav, type NavItem } from "~/lib/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = createSignal("");

  const pageNav = () => {
    const path = location.pathname.replace(/\/+$/, "");
    if (path.startsWith("/projects")) {
      return "projects";
    }
    if (path.startsWith("/resume")) {
      return "resume";
    }
    if (path.startsWith("/about")) {
      return "about";
    }
    return "";
  };

  const scrollSpy = () => {
    const scrollY = window.scrollY + 120;
    let a = "";
    homeSections.forEach((key) => {
      const el = document.getElementById(key);
      if (el && el.offsetTop <= scrollY) {
        a = key;
      }
    });
    return a;
  };

  createEffect(() => {
    location.pathname;
    const nav = pageNav();
    setActive(nav || scrollSpy());
  });

  onMount(() => {
    const update = () => {
      if (!pageNav()) {
        setActive(scrollSpy());
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", update));
  });

  // Anclas internas (/#stack): en la home dejamos actuar al ancla nativa,
  // que respeta el historial (back vuelve al inicio). Desde otra página,
  // navegamos en SPA a la home con el hash; el router hace scroll al
  // elemento por su id (scrollToHash).
  const onAnchorClick = (item: NavItem) => (e: MouseEvent) => {
    const onHome = location.pathname.replace(/\/+$/, "") === "";
    if (onHome) {
      return;
    }
    e.preventDefault();
    const section = item.href.replace(/^\/#/, "");
    navigate(`${homeHref}#${section}`);
  };

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
            {(item) =>
              item.kind === "anchor" ? (
                <a
                  class="nav-link"
                  classList={{ active: active() === item.key }}
                  data-nav={item.key}
                  href={item.href}
                  onClick={onAnchorClick(item)}
                >
                  {item.label}
                </a>
              ) : (
                <A
                  class="nav-link"
                  classList={{ active: active() === item.key }}
                  data-nav={item.key}
                  href={item.href}
                >
                  {item.label}
                </A>
              )
            }
          </For>
        </nav>
        <div class="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
