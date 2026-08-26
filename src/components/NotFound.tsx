import { A, useLocation } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";
import PageMeta from "./PageMeta";

export default function NotFound() {
  const location = useLocation();
  const path = () => location.pathname || "/that/page";

  return (
    <>
      <PageMeta
        title="404 — page not found"
        description="The page you requested was deleted, renamed, or never committed."
      />
      <section class="section page-hero">
        <div class="container container--narrow">
          <HttpStatusCode code={404} />
          <div class="section-head">
            <div>
              <h2 class="section-title">
                <span class="index">[ 404 / segfault ]</span>
                This page was <em>never committed</em>
              </h2>
            </div>
          </div>

          <div class="terminal">
            <div class="terminal-head">
              <div class="terminal-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span class="terminal-title">sys.write — error.log</span>
            </div>
            <div class="terminal-body">
              <div>
                <span class="prompt">$</span> <span class="path">~/journal</span> curl -I
                {path()}
              </div>
              <div class="out" style={{ "margin-top": "8px" }}>
                <div>
                  <span class="key">HTTP/1.1</span> <span class="str">404 Not Found</span>
                </div>
                <div>
                  <span class="key">cause:</span> deleted, renamed, or never existed
                </div>
                <div>
                  <span class="key">exit code:</span> 1{" "}
                  <span class="comment">{"// nothing to see here"}</span>
                </div>
                <div style={{ "margin-top": "12px" }}>
                  <span class="prompt">$</span> <span class="cursor"></span>
                </div>
              </div>
            </div>
          </div>

          <div class="hero-cta" style={{ "margin-top": "24px" }}>
            <A href="/" class="btn btn-primary">
              back to home
            </A>
            <A href="/blog/" class="btn btn-ghost">
              browse the archive
            </A>
          </div>
        </div>
      </section>
    </>
  );
}
