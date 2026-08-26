import { createSignal, onCleanup, onMount } from "solid-js";
import { animateCounter } from "~/lib/animate";
import { bumpForks, bumpStars } from "~/lib/repoStats";

interface RepoCardProps {
  repo: string;
  desc: string;
  stars: number;
  forks: number;
  owner?: string;
}

export default function RepoCard(props: RepoCardProps) {
  const owner = () => props.owner ?? "maren-h";
  const [stars, setStars] = createSignal(0);
  const [forks, setForks] = createSignal(0);
  const [starsBump, setStarsBump] = createSignal(false);
  const [forksBump, setForksBump] = createSignal(false);
  let cardRef: HTMLDivElement | undefined;

  onMount(() => {
    const card = cardRef;
    if (!card) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          animateCounter(setStars, props.stars, 1400);
          animateCounter(setForks, props.forks, 1400);
          observer.unobserve(card);
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(card);

    const interval = setInterval(() => {
      if (Math.random() < 0.45) {
        setStars((v) => v + 1);
        setStarsBump(true);
        setTimeout(() => setStarsBump(false), 500);
        bumpStars();
      }
      if (Math.random() < 0.15) {
        setForks((v) => v + 1);
        setForksBump(true);
        setTimeout(() => setForksBump(false), 500);
        bumpForks();
      }
    }, 5000);

    onCleanup(() => {
      clearInterval(interval);
      observer.disconnect();
    });
  });

  return (
    <div class="gh-card" data-repo={props.repo} ref={cardRef}>
      <div class="gh-head">
        <div class="gh-icon">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
          </svg>
        </div>
        <div>
          <div class="gh-name">
            <span class="at">{owner()}/</span>
            {props.repo}
          </div>
          <div class="gh-desc" style={{ "margin-top": "2px" }}>
            {props.desc}
          </div>
        </div>
      </div>
      <div class="gh-stats">
        <div class="gh-stat">
          <div class="gh-stat-icon">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div class="gh-stat-data">
            <span class="gh-stat-num" classList={{ bump: starsBump() }} data-stars={props.stars}>
              {stars().toLocaleString()}
            </span>
            <span class="gh-stat-label">stars</span>
          </div>
        </div>
        <div class="gh-stat">
          <div class="gh-stat-icon">
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M18 6v6a6 6 0 0 1-6 6H9" />
            </svg>
          </div>
          <div class="gh-stat-data">
            <span class="gh-stat-num" classList={{ bump: forksBump() }} data-forks={props.forks}>
              {forks().toLocaleString()}
            </span>
            <span class="gh-stat-label">forks</span>
          </div>
        </div>
      </div>
      <a class="gh-link" href={`https://github.com/${owner()}/${props.repo}`}>
        view repository
        <svg
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </div>
  );
}
