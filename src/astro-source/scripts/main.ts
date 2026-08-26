/* ============================================================
   sys.write() — interactive layer
   Ported from the original landing, guarded per page so it
   works on the homepage, the archive, posts and /about alike.
   ============================================================ */

/* ---------- 1. Typewriter hero greeting ---------- */
const greetings = [
	'shipping a distributed scheduler.',
	'debugging a slow consumer.',
	'reading the Raft paper again.',
	'writing postmortems that age well.',
	'thinking in types, not tests.',
];

interface TypewriterOptions {
	typeSpeed?: number;
	deleteSpeed?: number;
	hold?: number;
}

class Typewriter {
	el: HTMLElement;
	words: string[];
	typeSpeed: number;
	deleteSpeed: number;
	hold: number;
	i = 0;
	char = 0;
	deleting = false;

	constructor(el: HTMLElement, words: string[], opts: TypewriterOptions = {}) {
		this.el = el;
		this.words = words;
		this.typeSpeed = opts.typeSpeed || 55;
		this.deleteSpeed = opts.deleteSpeed || 28;
		this.hold = opts.hold || 1800;
		this.tick();
	}

	tick() {
		const word = this.words[this.i];
		if (this.deleting) {
			this.char = Math.max(0, this.char - 1);
		} else {
			this.char = Math.min(word.length, this.char + 1);
		}
		this.el.textContent = word.slice(0, this.char);
		let delay = this.deleting ? this.deleteSpeed : this.typeSpeed;
		if (!this.deleting && this.char === word.length) {
			delay = this.hold;
			this.deleting = true;
		} else if (this.deleting && this.char === 0) {
			this.deleting = false;
			this.i = (this.i + 1) % this.words.length;
			delay = 320;
		}
		setTimeout(() => this.tick(), delay);
	}
}

function initTypewriter() {
	const el = document.getElementById('typed');
	if (!el) return;
	new Typewriter(el, greetings);
}

/* ---------- 2. Live clock ---------- */
function initClock() {
	const el = document.getElementById('clock');
	if (!el) return;
	const updateClock = () => {
		const now = new Date();
		const h = String(now.getUTCHours()).padStart(2, '0');
		const m = String(now.getUTCMinutes()).padStart(2, '0');
		const s = String(now.getUTCSeconds()).padStart(2, '0');
		el.textContent = `${h}:${m}:${s} utc`;
	};
	updateClock();
	setInterval(updateClock, 1000);
}

/* ---------- 3. Reading progress bar ---------- */
function initProgress() {
	const progressBar = document.getElementById('progressBar');
	if (!progressBar) return;
	const updateProgress = () => {
		const st = window.scrollY || document.documentElement.scrollTop;
		const sh = document.documentElement.scrollHeight - window.innerHeight;
		const p = sh > 0 ? Math.min(1, st / sh) : 0;
		progressBar.style.setProperty('--p', String(p));
		if (p > 0) progressBar.setAttribute('data-value', '1');
		else progressBar.removeAttribute('data-value');
	};
	window.addEventListener('scroll', updateProgress, { passive: true });
	window.addEventListener('resize', updateProgress);
	updateProgress();
}

/* ---------- 4. 3-state theme toggle ---------- */
function getSavedTheme(): string {
	try {
		return localStorage.getItem('theme') || 'dark';
	} catch {
		return 'dark';
	}
}

function applyTheme(t: string) {
	document.documentElement.setAttribute('data-theme', t);
	const toggle = document.getElementById('themeToggle');
	if (!toggle) return;
	toggle.setAttribute('data-state', t);
	toggle.querySelectorAll('button').forEach((b) => {
		const active = b.getAttribute('data-theme-set') === t;
		b.classList.toggle('active', active);
		b.setAttribute('aria-checked', active ? 'true' : 'false');
	});
}

function setTheme(t: string) {
	applyTheme(t);
	try {
		localStorage.setItem('theme', t);
	} catch {
		/* storage unavailable */
	}
}

function initTheme() {
	const toggle = document.getElementById('themeToggle');
	if (!toggle) return;
	applyTheme(getSavedTheme());
	toggle.querySelectorAll('button').forEach((btn) => {
		btn.addEventListener('click', () => {
			const t = btn.getAttribute('data-theme-set');
			if (t) setTheme(t);
		});
	});
}

/* ---------- 5. Animated counters ---------- */
function animateCounter(el: HTMLElement, target: number, duration = 1600) {
	const start = 0;
	const startTime = performance.now();
	const step = (now: number) => {
		const t = Math.min(1, (now - startTime) / duration);
		const eased = 1 - Math.pow(1 - t, 3);
		const val = Math.floor(start + (target - start) * eased);
		el.textContent = val.toLocaleString();
		if (t < 1) requestAnimationFrame(step);
		else el.textContent = target.toLocaleString();
	};
	requestAnimationFrame(step);
}

function initStatCounters() {
	const bars = document.querySelectorAll('.stats-bar');
	if (bars.length === 0) return;
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.querySelectorAll('[data-count]').forEach((el) => {
					const target = parseInt(el.getAttribute('data-count') || '0', 10);
					animateCounter(el as HTMLElement, target);
				});
				observer.unobserve(entry.target);
			});
		},
		{ threshold: 0.3 },
	);
	bars.forEach((s) => observer.observe(s));
}

function initGhCounters() {
	const cards = document.querySelectorAll('.gh-card');
	if (cards.length === 0) return;
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.querySelectorAll('[data-stars], [data-forks]').forEach((el) => {
					const attr = el.hasAttribute('data-stars') ? 'data-stars' : 'data-forks';
					const target = parseInt(el.getAttribute(attr) || '0', 10);
					animateCounter(el as HTMLElement, target, 1400);
				});
				observer.unobserve(entry.target);
			});
		},
		{ threshold: 0.3 },
	);
	cards.forEach((c) => observer.observe(c));
}

/* ---------- 6. Live GitHub star/fork counter simulation ---------- */
function initLiveSim() {
	const cards = document.querySelectorAll('.gh-card');
	if (cards.length === 0) return;
	setInterval(() => {
		cards.forEach((card) => {
			// Occasionally bump a star
			if (Math.random() < 0.45) {
				const starEl = card.querySelector<HTMLElement>('[data-stars]');
				if (starEl) {
					let cur = parseInt(starEl.textContent?.replace(/[^\d]/g, '') || '0', 10);
					cur += 1;
					starEl.textContent = cur.toLocaleString();
					starEl.setAttribute('data-stars', String(cur));
					starEl.classList.add('bump');
					setTimeout(() => starEl.classList.remove('bump'), 500);

					const topStars = document.querySelector<HTMLElement>('#stat-stars .num');
					if (topStars) {
						let top = parseInt(topStars.textContent?.replace(/[^\d]/g, '') || '0', 10);
						top += 1;
						topStars.textContent = top.toLocaleString();
						const stat = document.getElementById('stat-stars');
						if (stat) {
							stat.classList.add('flash');
							setTimeout(() => stat.classList.remove('flash'), 800);
						}
					}
				}
			}
			// Rarely bump a fork
			if (Math.random() < 0.15) {
				const forkEl = card.querySelector<HTMLElement>('[data-forks]');
				if (forkEl) {
					let cur = parseInt(forkEl.textContent?.replace(/[^\d]/g, '') || '0', 10);
					cur += 1;
					forkEl.textContent = cur.toLocaleString();
					forkEl.setAttribute('data-forks', String(cur));
					forkEl.classList.add('bump');
					setTimeout(() => forkEl.classList.remove('bump'), 500);

					const topForks = document.querySelector<HTMLElement>('#stat-forks .num');
					if (topForks) {
						let top = parseInt(topForks.textContent?.replace(/[^\d]/g, '') || '0', 10);
						top += 1;
						topForks.textContent = top.toLocaleString();
						const stat = document.getElementById('stat-forks');
						if (stat) {
							stat.classList.add('flash');
							setTimeout(() => stat.classList.remove('flash'), 800);
						}
					}
				}
			}
		});
	}, 5000);
}

/* ---------- 7. Toast ---------- */
let toastTimer: number | undefined;

function showToast(msg: string) {
	const toast = document.getElementById('toast');
	const toastMsg = document.getElementById('toastMsg');
	if (!toast || !toastMsg) return;
	toastMsg.textContent = msg;
	toast.classList.add('show');
	clearTimeout(toastTimer);
	toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

/* ---------- 8. Copy-flash code blocks ---------- */
function initCopyButtons() {
	document.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach((btn) => {
		btn.addEventListener('click', async () => {
			const targetId = btn.getAttribute('data-copy-target');
			const codeEl = targetId ? document.getElementById(targetId) : null;
			if (!codeEl) return;

			const text = codeEl.innerText;
			const codeBlock = btn.closest('.code-block');
			const overlay = codeBlock?.querySelector('.flash-overlay');
			const label = btn.querySelector('.copy-label');

			try {
				await navigator.clipboard.writeText(text);
			} catch {
				const ta = document.createElement('textarea');
				ta.value = text;
				document.body.appendChild(ta);
				ta.select();
				document.execCommand('copy');
				ta.remove();
			}

			if (overlay) {
				overlay.classList.remove('flashing');
				void (overlay as HTMLElement).offsetWidth; // reflow to restart animation
				overlay.classList.add('flashing');
			}

			btn.classList.add('copied');
			const originalLabel = label ? label.textContent : 'copy';
			if (label) label.textContent = 'copied!';
			setTimeout(() => {
				btn.classList.remove('copied');
				if (label) label.textContent = originalLabel;
			}, 1400);

			showToast('snippet copied to clipboard');
		});
	});
}

/* ---------- 9. Active nav link (page + scrollspy) ---------- */
function navLink(key: string): HTMLElement | null {
	return document.querySelector<HTMLElement>(`.nav-link[data-nav="${key}"]`);
}

function setActiveNav(key: string) {
	document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
	navLink(key)?.classList.add('active');
}

function updateNav() {
	const path = window.location.pathname.replace(/\/+$/, '');
	if (path === '/blog' || path.startsWith('/blog/')) {
		setActiveNav('blog');
		return;
	}
	if (path === '/projects' || path.startsWith('/projects/')) {
		setActiveNav('projects');
		return;
	}
	if (path === '/resume' || path.startsWith('/resume/')) {
		setActiveNav('resume');
		return;
	}
	if (path === '/about' || path.startsWith('/about/')) {
		setActiveNav('about');
		return;
	}
	// Scrollspy only applies on the homepage.
	if (path !== '') return;
	const scrollY = window.scrollY + 120;
	let active = 'blog';
	(['stack', 'projects'] as const).forEach((key) => {
		const el = document.getElementById(key);
		if (el && el.offsetTop <= scrollY) active = key;
	});
	setActiveNav(active);
}

function initNav() {
	updateNav();
	window.addEventListener('scroll', updateNav, { passive: true });
}

/* ---------- 11. Subtle parallax on hero terminal ---------- */
function initParallax() {
	const terminal = document.querySelector<HTMLElement>('.terminal');
	const hero = document.querySelector<HTMLElement>('.hero');
	if (!terminal || !hero) return;
	hero.addEventListener('mousemove', (e) => {
		const rect = hero.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		terminal.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg) translateZ(0)`;
	});
	hero.addEventListener('mouseleave', () => {
		terminal.style.transform = '';
	});
}

/* ---------- 12. Keyboard shortcut: T to cycle theme ---------- */
document.addEventListener('keydown', (e) => {
	const target = e.target as HTMLElement;
	if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
	if (e.key === 't' || e.key === 'T') {
		const order = ['dark', 'light', 'hc'];
		const cur = document.documentElement.getAttribute('data-theme') || 'dark';
		const next = order[(order.indexOf(cur) + 1) % 3];
		if (next) setTheme(next);
	}
});

/* ---------- init ---------- */
initTypewriter();
initClock();
initProgress();
initTheme();
initStatCounters();
initGhCounters();
initLiveSim();
initCopyButtons();
initParallax();
initNav();
