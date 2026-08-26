import { createSignal, onCleanup, onMount } from "solid-js";

const greetings = [
  "shipping a distributed scheduler.",
  "debugging a slow consumer.",
  "reading the Raft paper again.",
  "writing postmortems that age well.",
  "thinking in types, not tests.",
];

export default function Hero() {
  const [typed, setTyped] = createSignal("");
  const [clock, setClock] = createSignal("--:--:--");
  let heroRef: HTMLElement | undefined;
  let terminalRef: HTMLDivElement | undefined;

  onMount(() => {
    // Typewriter greeting
    let i = 0;
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      const word = greetings[i];
      if (deleting) char = Math.max(0, char - 1);
      else char = Math.min(word.length, char + 1);
      setTyped(word.slice(0, char));
      let delay = deleting ? 28 : 55;
      if (!deleting && char === word.length) {
        delay = 1800;
        deleting = true;
      } else if (deleting && char === 0) {
        deleting = false;
        i = (i + 1) % greetings.length;
        delay = 320;
      }
      timer = setTimeout(tick, delay);
    };
    tick();

    // Live UTC clock
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");
      setClock(`${h}:${m}:${s} utc`);
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // Subtle parallax on the terminal
    const hero = heroRef!;
    const terminal = terminalRef!;
    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      terminal.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg) translateZ(0)`;
    };
    const onLeave = () => {
      terminal.style.transform = "";
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);

    onCleanup(() => {
      clearTimeout(timer);
      clearInterval(clockInterval);
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    });
  });

  return (
    <section class="hero" ref={heroRef}>
      <div class="container">
        <div class="hero-grid">
          <div>
            <div class="hero-meta">
              <span class="dot"></span>
              <span>system online</span>
              <span class="divider">/</span>
              <span id="clock">{clock()}</span>
              <span class="divider">/</span>
              <span>oslo, 63°N</span>
            </div>
            <h1 class="hero-greeting">
              <span class="static">Hello, I'm Maren —</span>
              <br />
              <span class="typed" id="typed">
                {typed()}
              </span>
              <span class="hero-caret"></span>
            </h1>
            <p class="hero-lede">
              Backend engineer writing about <em>distributed systems</em>, the strange poetry of
              type theory, and the unglamorous craft of keeping production calm at 3am. No hot
              takes. Mostly logs.
            </p>
            <div class="hero-cta">
              <a href="#articles" class="btn btn-primary">
                read the journal
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </a>
            </div>
          </div>

          <div class="terminal" aria-hidden="true" ref={terminalRef}>
            <div class="terminal-head">
              <div class="terminal-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span class="terminal-title">maren@hal9k — zsh</span>
            </div>
            <div class="terminal-body" id="terminal">
              <div>
                <span class="prompt">$</span> <span class="path">~/journal</span> cat manifest.md
              </div>
              <div class="out" style={{ "margin-top": "8px" }}>
                <div>
                  <span class="key"># purpose</span>
                </div>
                <div>write clearly about hard systems.</div>
                <div style={{ "margin-top": "10px" }}>
                  <span class="key"># cadence</span>
                </div>
                <div>one long piece every other sunday.</div>
                <div style={{ "margin-top": "10px" }}>
                  <span class="key"># rules</span>
                </div>
                <div>
                  <span class="str">- no listicles</span>
                </div>
                <div>
                  <span class="str">- no ai-generated conclusions</span>
                </div>
                <div>
                  <span class="str">- cite the source commit</span>
                </div>
                <div style={{ "margin-top": "12px" }}>
                  <span class="prompt">$</span> <span class="cursor"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
