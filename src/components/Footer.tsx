import { A } from "@solidjs/router";
import { SITE_TITLE } from "~/consts";
import { resume } from "~/data/resume";

export default function Footer() {
  return (
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <A href="/" class="brand" aria-label={SITE_TITLE}>
              <span class="brand-mark">{"{}"}</span>
              <span class="brand-text">
                sys.write<span class="paren">()</span>
              </span>
            </A>
            <p>
              A personal journal by Maren Hofstad. Backend engineer in Oslo, writing about
              distributed systems, careful code, and the long quiet hours of running software in
              production.
            </p>
          </div>
          <div class="footer-col">
            <h4>Read</h4>
            <ul>
              <li>
                <A href="/blog/">Latest</A>
              </li>
              <li>
                <A href="/blog/">Archive</A>
              </li>
              <li>
                <A href="/projects/">Projects</A>
              </li>
              <li>
                <A href="/resume/">Resume</A>
              </li>
              <li>
                <a href="/rss.xml">RSS feed</a>
              </li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Elsewhere</h4>
            <ul>
              <li>
                <a href={resume.contact.github}>GitHub</a>
              </li>
              <li>
                {/* biome-ignore lint/a11y/useValidAnchor: placeholder del diseño, pendiente de URL real */}
                <a href="#">Mastodon</a>
              </li>
              <li>
                {/* biome-ignore lint/a11y/useValidAnchor: placeholder del diseño, pendiente de URL real */}
                <a href="#">Bluesky</a>
              </li>
              <li>
                {/* biome-ignore lint/a11y/useValidAnchor: placeholder del diseño, pendiente de URL real */}
                <a href="#">Read.cv</a>
              </li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Meta</h4>
            <ul>
              <li>
                <A href="/docs/">Docs</A>
              </li>
              <li>
                {/* biome-ignore lint/a11y/useValidAnchor: placeholder del diseño, pendiente de URL real */}
                <a href="#">Colophon</a>
              </li>
              <li>
                {/* biome-ignore lint/a11y/useValidAnchor: placeholder del diseño, pendiente de URL real */}
                <a href="#">Uses</a>
              </li>
              <li>
                {/* biome-ignore lint/a11y/useValidAnchor: placeholder del diseño, pendiente de URL real */}
                <a href="#">Speaking</a>
              </li>
              <li>
                <a href={`mailto:${resume.contact.email}`}>Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2024 Maren Hofstad · written in Neovim, built by hand</span>
          <span class="build">
            <span>build: 1.0.4</span>
            <span class="ok">●</span>
            <span>all systems nominal</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
