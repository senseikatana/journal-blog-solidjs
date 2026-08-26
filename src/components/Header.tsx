import { A, useLocation } from "@solidjs/router";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { SITE_TITLE } from "~/consts";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const location = useLocation();
  const [active, setActive] = createSignal("blog");

  const pageNav = () => {
    const path = location.pathname.replace(/\/+$/, "");
    if (path.startsWith("/blog")) return "blog";
    if (path.startsWith("/projects")) return "projects";
    if (path.startsWith("/resume")) return "resume";
    if (path.startsWith("/about")) return "about";
    return "";
  };

  const scrollSpy = () => {
    const scrollY = window.scrollY + 120;
    let a = "blog";
    (["stack", "projects"] as const).forEach((key) => {
      const el = document.getElementById(key);
      if (el && el.offsetTop <= scrollY) a = key;
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
      if (!pageNav()) setActive(scrollSpy());
    };
    window.addEventListener("scroll", update, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", update));
  });

  return (
    <header class="site-header">
      <div class="header-inner">
        <A href="/" class="brand" aria-label={SITE_TITLE}>
          <span class="brand-mark">{"{}"}</span>
          <span class="brand-text">
            sys.write<span class="paren">()</span>
            <span class="cursor">_</span>
          </span>
        </A>
        <nav class="primary" aria-label="Primary">
          <A class="nav-link" classList={{ active: active() === "blog" }} data-nav="blog" href="/blog/">
            writing
          </A>
          <a class="nav-link" classList={{ active: active() === "stack" }} data-nav="stack" href="/#stack">
            stack
          </a>
          <A class="nav-link" classList={{ active: active() === "projects" }} data-nav="projects" href="/projects/">
            projects
          </A>
          <A class="nav-link" classList={{ active: active() === "resume" }} data-nav="resume" href="/resume/">
            resume
          </A>
          <A class="nav-link" classList={{ active: active() === "about" }} data-nav="about" href="/about/">
            about
          </A>
        </nav>
        <div class="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
