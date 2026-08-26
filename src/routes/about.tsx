import PageMeta from "~/components/PageMeta";
import { AUTHOR } from "~/consts";

export default function About() {
  return (
    <>
      <PageMeta
        title={`About — ${AUTHOR}`}
        description="About Maren Hofstad: backend engineer in Oslo, writing about distributed systems, careful code, and the long quiet hours of running software in production."
      />
      <section class="section page-hero" id="about">
        <div class="container container--narrow">
          <h2 class="section-title">
            <span class="index">[ about ]</span>
            Hello, I'm <em>Maren</em>
          </h2>
          <div class="prose" style={{ "margin-top": "24px" }}>
            <p>
              I'm a backend engineer in Oslo — 63°N, which is a latitude that teaches you respect
              for uptime. By day I build services in Go and Rust; by night I read papers, run a
              small homelab, and write the occasional long essay about the things that break.
            </p>
            <p>
              This journal exists because most of the interesting things I've learned about
              distributed systems never fit in a pull request description. They were hard-earned,
              usually at 3am, and almost always started as a question I couldn't answer without
              writing my way through it.
            </p>
            <p>
              The rules are simple, and they're in the <code>manifest.md</code> pinned to the front
              page: no listicles, no ai-generated conclusions, cite the source commit. One long
              piece every other Sunday. Everything else is fair game.
            </p>
            <p>
              If you want to say hello, point out a bug in a post, or argue with a hot take I
              accidentally wrote, the best places to find me are the links in the footer. I read
              everything, eventually.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
