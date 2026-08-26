import { createSignal } from "solid-js";
import { showToast } from "~/lib/toast";

const snippet = `<span class="tok-com">// TokenBucket is a per-key rate limiter safe for concurrent use.</span>
<span class="tok-com">// Capacity=10, refill=1/sec → ~1 QPS sustained, burst of 10.</span>
<span class="tok-kw">type</span> <span class="tok-fn">TokenBucket</span> <span class="tok-kw">struct</span> {
    mu       <span class="tok-fn">sync</span>.<span class="tok-fn">Mutex</span>
    capacity <span class="tok-kw">float64</span>
    refill   <span class="tok-kw">float64</span> <span class="tok-com">// tokens per second</span>
    buckets  <span class="tok-kw">map</span>[<span class="tok-kw">string</span>]*<span class="tok-fn">bucket</span>
}

<span class="tok-kw">func</span> (tb *<span class="tok-fn">TokenBucket</span>) <span class="tok-fn">Allow</span>(key <span class="tok-kw">string</span>) <span class="tok-kw">bool</span> {
    tb.mu.<span class="tok-fn">Lock</span>()
    <span class="tok-kw">defer</span> tb.mu.<span class="tok-fn">Unlock</span>()

    b, ok := tb.buckets[key]
    <span class="tok-kw">if</span> !ok {
        b = &amp;<span class="tok-fn">bucket</span>{tokens: tb.capacity, last: <span class="tok-fn">time</span>.<span class="tok-fn">Now</span>()}
        tb.buckets[key] = b
    }
    <span class="tok-kw">return</span> b.<span class="tok-fn">take</span>(tb.capacity, tb.refill)
}`;

export default function CodeSnippet() {
  const [copied, setCopied] = createSignal(false);
  let codeRef: HTMLElement | undefined;
  let overlayRef: HTMLDivElement | undefined;
  let copiedTimer: ReturnType<typeof setTimeout> | undefined;

  const onCopy = async () => {
    const codeEl = codeRef;
    if (!codeEl) return;
    const text = codeEl.innerText;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }

    const overlay = overlayRef;
    if (overlay) {
      overlay.classList.remove("flashing");
      void overlay.offsetWidth; // reflow to restart animation
      overlay.classList.add("flashing");
    }

    setCopied(true);
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => setCopied(false), 1400);

    showToast("snippet copied to clipboard");
  };

  return (
    <section class="section section--tight">
      <div class="container">
        <div class="section-head">
          <div>
            <h2 class="section-title">
              <span class="index">[ 02 / snippet ]</span>A pattern I keep <em>reaching for</em>
            </h2>
          </div>
          <p class="section-desc">
            A small Go utility I copy into almost every service. Rate-limits per-key work without
            external dependencies.
          </p>
        </div>

        <div class="featured-snippet">
          <div class="code-block">
            <div class="code-block-head">
              <span class="code-block-lang">go</span>
              <span class="code-block-file">
                <span class="dir">ratelimit/</span>tokenbucket.go
              </span>
              <button
                type="button"
                class="copy-btn"
                classList={{ copied: copied() }}
                data-copy-target="snippet1"
                onClick={onCopy}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span class="copy-label">{copied() ? "copied!" : "copy"}</span>
              </button>
            </div>
            <pre class="code-body">
              <code id="snippet1" ref={codeRef} innerHTML={snippet} />
            </pre>
            <div class="flash-overlay" ref={overlayRef}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
