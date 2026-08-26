export default function StackSection() {
  return (
    <section class="section" id="stack">
      <div class="container">
        <div class="section-head">
          <div>
            <h2 class="section-title">
              <span class="index">[ 03 / stack ]</span>
              Tools I'm <em>actually</em> using
            </h2>
          </div>
          <p class="section-desc">
            Not a "tech I love" list. These are the things currently installed on my machine and the
            repos I'm actively maintaining.
          </p>
        </div>

        <div class="stack-grid">
          <div class="stack-card">
            <div class="stack-card-head">
              <div class="stack-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <span class="stack-name">Daily driver</span>
            </div>
            <p class="stack-desc">
              Go for services, Postgres for state, Redis for the hot path, and a stubborn amount of
              shell scripts that should probably be cron jobs.
            </p>
            <div class="stack-badges">
              <span class="chip">go 1.22</span>
              <span class="chip">postgres 16</span>
              <span class="chip">redis 7</span>
              <span class="chip">rabbitmq</span>
              <span class="chip">k8s</span>
            </div>
          </div>

          <div class="stack-card">
            <div class="stack-card-head">
              <div class="stack-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 2 2 7l10 5 10-5-10-5Z"></path>
                  <path d="m2 17 10 5 10-5"></path>
                  <path d="m2 12 10 5 10-5"></path>
                </svg>
              </div>
              <span class="stack-name">For thinking</span>
            </div>
            <p class="stack-desc">
              Rust when I want to model a problem precisely, Python for notebooks and one-off
              analysis, TypeScript for the occasional internal tool that needs a UI.
            </p>
            <div class="stack-badges">
              <span class="chip">rust</span>
              <span class="chip">python 3.12</span>
              <span class="chip">typescript</span>
              <span class="chip">sqlite</span>
              <span class="chip">duckdb</span>
            </div>
          </div>

          <div class="stack-card">
            <div class="stack-card-head">
              <div class="stack-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <span class="stack-name">Observability</span>
            </div>
            <p class="stack-desc">
              OpenTelemetry for traces, a self-hosted Grafana + Loki stack, and a curated set of
              alerts I actually trust. Most of my outages start with a slow query, not a crash.
            </p>
            <div class="stack-badges">
              <span class="chip">otel</span>
              <span class="chip">grafana</span>
              <span class="chip">loki</span>
              <span class="chip">prometheus</span>
              <span class="chip">sentry</span>
            </div>
          </div>

          <div class="stack-card">
            <div class="stack-card-head">
              <div class="stack-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M4 17 9 12 4 7"></path>
                  <path d="M12 19h8"></path>
                </svg>
              </div>
              <span class="stack-name">Editor &amp; shell</span>
            </div>
            <p class="stack-desc">
              Neovim with a config I keep promising to publish, tmux for sessions, fish as my shell,
              and a Model 100 keyboard that runs my own QMK firmware.
            </p>
            <div class="stack-badges">
              <span class="chip">neovim</span>
              <span class="chip">tmux</span>
              <span class="chip">fish</span>
              <span class="chip">qmk</span>
              <span class="chip">ghostty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
