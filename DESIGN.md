# Design system

This document describes the design system for `journal-blog-solidjs`, a dark-first editorial journal called "sys.write()". It covers colors, typography, layout, components, motion, accessibility, and the tooling that generates the CSS. Use it as the source of truth when you add pages, sections, or components.

## TL;DR

The site uses a custom CSS design system in `src/app.css` with three themes (dark, light, and high contrast), Fraunces for display text and JetBrains Mono for body and code, a terminal-inspired aesthetic, and an orange accent. Tailwind CSS v4 provides a utility layer on top, configured through `@theme`. Keep the design system classes for anything thematic; reach for Tailwind utilities for one-off layout tweaks.

## Design principles

Four principles drive every visual decision. When you add something new, check it against this list first.

- **Dark first**: the default theme is dark. Light and high contrast themes override tokens only, never individual components.
- **Editorial, not marketing**: long-form content leads the page. Avoid carousels, gradients for decoration, or anything that competes with the text.
- **Terminal accent**: monospace, prompts, cursors, and log-style details carry the personality. Use them sparingly.
- **Calm and quiet**: transitions are slow (0.3 s to 0.6 s), shadows are soft, and motion never loops loudly. The page should feel like reading, not watching.

## Color tokens

Colors are semantic CSS custom properties defined in `:root` in `src/app.css`. Each theme overrides them with a `[data-theme]` selector, so components reference the semantic name and never a raw color value. All colors use the OKLCH space: `oklch(L C H)` for opaque colors and `oklch(L C H / a)` for alpha.

| Token | Dark (default) | Light | High contrast | Purpose |
| --- | --- | --- | --- | --- |
| `--bg` | `oklch(0.164 0.005 264.4)` | `oklch(0.955 0.021 91.6)` | `oklch(0 0 0)` | Page background |
| `--bg-elevated` | `oklch(0.209 0.009 264.4)` | `oklch(1 0 89.9)` | `oklch(0.145 0 89.9)` | Header and elevated surfaces |
| `--bg-card` | `oklch(0.192 0.008 274.5)` | `oklch(0.986 0.014 84.6)` | `oklch(0.115 0 89.9)` | Cards and panels |
| `--bg-inset` | `oklch(0.139 0.005 262.8)` | `oklch(0.922 0.025 91.6)` | `oklch(0 0 0)` | Inset areas, footer, inputs |
| `--fg` | `oklch(0.928 0.015 90.2)` | `oklch(0.203 0.01 67.2)` | `oklch(1 0 89.9)` | Primary text |
| `--fg-muted` | `oklch(0.617 0.02 89.4)` | `oklch(0.503 0.025 83.2)` | `oklch(0.783 0 89.9)` | Secondary text |
| `--fg-dim` | `oklch(0.395 0.014 84.6)` | `oklch(0.747 0.028 85.7)` | `oklch(0.468 0 89.9)` | Tertiary text and comments |
| `--accent` | `oklch(0.754 0.164 50.4)` | `oklch(0.583 0.165 41.2)` | `oklch(0.968 0.211 109.8)` | Primary accent, links, highlights |
| `--accent-2` | `oklch(0.855 0.125 181.1)` | `oklch(0.6 0.104 184.7)` | `oklch(0.905 0.155 194.8)` | Secondary accent, success, prompts |
| `--border` | `oklch(0.267 0.021 276.8)` | `oklch(0.856 0.033 89.2)` | `oklch(0.285 0 89.9)` | Default borders |
| `--border-strong` | `oklch(0.352 0.023 278.3)` | `oklch(0.747 0.028 85.7)` | `oklch(1 0 89.9)` | Strong borders |
| `--danger` | `oklch(0.686 0.206 15)` | `oklch(0.505 0.19 27.5)` | `oklch(0.628 0.258 29.2)` | Errors and destructive states |
| `--code-bg` | `oklch(0.139 0.005 262.8)` | `oklch(0.203 0.01 67.2)` | `oklch(0 0 0)` | Code blocks and terminals |

Related tokens include `--accent-soft` and `--accent-glow` for soft fills and glows, `--grid-line` for the background grid, and `--selection` for text selection.

## Typography

The site loads two fonts from Google Fonts with `font-display: swap`: **Fraunces** (serif) for display text and headings, and **JetBrains Mono** for body text, labels, and code.

| Role | Font | Weight | Notes |
| --- | --- | --- | --- |
| Headings and hero | Fraunces | 300 to 500 | Tight letter spacing, lowercase-friendly display |
| Body and UI labels | JetBrains Mono | 400 to 800 | 15 px base, 1.6 line height |
| Code | JetBrains Mono | 400 | 13 px in blocks, 0.85 em inline |

Fluid heading sizes use `clamp()`, for example `clamp(32px, 4vw, 48px)` for section titles. Uppercase labels use `letter-spacing: 0.08em` or more for the terminal feel.

## Layout

The page uses a centered container of 1240 px with 32 px horizontal padding (20 px below 640 px), and a narrow variant of 760 px for posts and prose pages. The sticky header holds the brand, the primary navigation, and the theme toggle. Sections stack vertically with 80 px of padding, and the stats bar separates the hero from the writing section.

The background layers (`bg-grid`, `bg-glow`, `bg-noise`) are fixed, non-interactive, and sit behind the content. The reading progress bar stays at the top with `z-index: 100`.

## Components

This section lists the core component classes. Each component already lives in `src/components` as a Solid component, so prefer reusing the component over copying markup.

| Class | Component | Notes |
| --- | --- | --- |
| `.btn`, `.btn-primary`, `.btn-ghost` | Buttons and CTAs | Primary has a hard offset shadow; ghost has a border and soft hover fill |
| `.card` | `ArticleCard` | Hover lifts 8 px and shows the accent gradient line on top |
| `.terminal` | Hero and 404 | Window chrome with dots, title, and blinking cursor |
| `.code-block` | `CodeSnippet` | Copy button, flash overlay, and syntax tokens |
| `.stats-bar`, `.stat` | `StatsBar` | Animated counters; totals flash orange on update |
| `.theme-toggle` | `ThemeToggle` | Segmented three-state control with a sliding indicator |
| `.toast` | `Toast` | Bottom center, `aria-live="polite"`, auto hides after 2.4 s |
| `.newsletter` | `NewsletterSection` | Two-column card with a radial accent glow |
| `.gh-card` | `RepoCard` | Repository card with simulated live counters |
| `.chip`, `.tag` | Various | Small monospace labels for skills and categories |

## Motion and effects

Animations follow the same calm principle: transform and opacity only, no `transition: all`. Theme changes animate background and color over 0.6 s. Hover states lift cards 8 px and brighten borders. The background glow breathes over 14 s, and the caret and status dot blink once per second.

Every animation respects `prefers-reduced-motion`, which collapses animation and transition durations to 0.01 ms.

## Accessibility

The site follows the Web Interface Guidelines. The key rules, as implemented, are below.

- **Semantic HTML first**: links are `<a>`, actions are `<button type="button">`, navigation is `<nav>`, and sections are `<section>`.
- **Labels**: icon-only buttons and the theme toggle expose `aria-label`. The theme toggle is a `radiogroup` with `role="radio"` buttons and `aria-checked`.
- **Decorative icons**: inline SVGs that add no meaning carry `aria-hidden="true"`.
- **Live regions**: the toast uses `role="status"` with `aria-live="polite"`, and form status messages do the same.
- **Focus**: the design relies on visible focus through native outlines. Never add `outline: none` without a replacement.
- **Reduced motion**: the `prefers-reduced-motion` media query disables all animation and transitions.
- **Print**: a print media query hides the chrome and switches to a white background so the resume prints cleanly.

## Theming

The theme is a three-state value (`dark`, `light`, `hc`) stored in the `data-theme` attribute of `<html>`. A small inline script in the document head restores the saved theme before first paint to avoid a flash. The toggle persists the choice in `localStorage`, and pressing `T` cycles themes when no input is focused.

The Tailwind `@theme` block in `src/styles/tailwind.css` mirrors the dark theme tokens as utility values. For themed components, keep using the semantic CSS variables from `src/app.css`, because Tailwind utilities are static and do not switch with the theme.

## Tooling

The CSS pipeline has two layers, in order of import: Tailwind and the design system. The design system wins any cascade conflict because it loads last.

- **Tailwind CSS v4** (`@tailwindcss/vite`): provides utilities configured through `@theme` in `src/styles/tailwind.css`. Unused classes are purged at build time, so only what the code references ships.
- **Design system** (`src/app.css`): the source of truth for the journal look. Write thematic styles here.
- **Biome** (`biome.json`): formats and lints everything, including CSS. Run `bun run check` before committing and `bun run format` to fix.

When you add a style, ask which layer it belongs to: a reusable utility goes to Tailwind, a component or page style goes to the design system.

## Content voice

Site copy is English, active voice, and direct address. Write like the narrator of a production postmortem: calm, specific, and curious. Keep the house rules from the terminal manifesto in mind: no listicles, no AI-generated conclusions, and cite the source commit.

Typographic details that keep the voice consistent:

- Use real ellipses (`…`), curly quotes (`“ ”` and `‘ ’`), and spaces with units (`14 min`, `63°N`).
- Code and identifiers go in backticks; UI labels get bold.
- Headings are sentence case; navigation labels are title case.
- One idea per paragraph. Long-form posts live in `src/content/blog` with frontmatter driving the card display.

## Do's and don'ts

A quick checklist for review. If a change violates a "don't", reconsider it.

**Do:**

- Reuse the Solid components instead of writing new markup for existing patterns.
- Reference semantic CSS variables for colors so all three themes keep working.
- Add `aria-hidden="true"` to decorative SVGs and labels to interactive controls.
- Respect `prefers-reduced-motion` and print styles.
- Run `bun run check` and `bun run build` before committing.

**Don't:**

- Hardcode color values in components.
- Use `transition: all`, `outline: none` without a replacement, or loops that never stop.
- Introduce a fourth theme without updating this document and the Tailwind `@theme` block.
- Add horizontal rules or em dashes in documentation prose.
