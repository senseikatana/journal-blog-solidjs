/**
 * Script: fetch dummyjson posts and generate rich markdown files for the blog.
 *
 * Usage:  bun run scripts/fetch-posts.ts
 *         bun run scripts/fetch-posts.ts --count 30
 *
 * Reads apis.json, uses the ApiManager to build the URL, fetches posts from
 * DummyJSON, and writes one complete article (.md) per post in
 * src/content/blog/. Each article is assembled from varied, deterministic
 * content pools keyed by the post id, so no two posts read alike.
 */

import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildApiUrl, fetchApi, initApis } from "../src/lib/apis/core";
import type { ApisConfig } from "../src/lib/apis/types";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const BLOG_DIR = resolve(import.meta.dirname!, "../src/content/blog");
const COUNT = Number(process.argv.find((_, i, a) => a[i - 1] === "--count") ?? 30);
const SKIP = Number(process.argv.find((_, i, a) => a[i - 1] === "--skip") ?? 0);

// OKLCH accent palette (rotating for visual variety)
const ACCENTS = [
  "oklch(0.754 0.164 50.4)",
  "oklch(0.855 0.125 181.1)",
  "oklch(0.686 0.206 15)",
  "oklch(0.722 0.177 305.5)",
  "oklch(0.809 0.096 251.8)",
  "oklch(0.837 0.164 84.4)",
];

const PATTERNS = ["dots", "lines", "grid", "circles", "waves", "triangles"] as const;

// ---------------------------------------------------------------------------
// Content pools (deterministic: keyed by post.id)
// ---------------------------------------------------------------------------
interface Topic {
  name: string;
  tags: string[];
  problem: string;
  snippet: { lang: string; code: string };
  changes: string[];
  keep: string;
  closing: string;
}

const TOPICS: Topic[] = [
  {
    name: "distributed systems",
    tags: ["systems", "distributed", "raft"],
    problem:
      "The node was healthy in every dashboard and wrong in the one place that mattered. It had learned about the majority from a partition it never saw.",
    snippet: {
      lang: "go",
      code: `func quorumSize(n int) int {
    // A majority must survive; the math is unforgiving.
    return n/2 + 1
}

func leaderServer() { ... }`,
    },
    changes: [
      "Added a lease with a single writer, and made the loser retry with backoff instead of praying.",
      "Wrote a test that kills the leader mid-commit, and stopped being surprised by the result.",
      "Logged every term change. The log was boring, which was exactly the point.",
    ],
    keep: "The election timeout. Everything else got rebuilt, but the timeout is the one bit of arithmetic I never touch.",
    closing: "Distributed systems are not a performance problem. They are a conviction problem.",
  },
  {
    name: "type theory",
    tags: ["types", "ts", "design"],
    problem:
      "The codebase had two kinds of false confidence: types that lied, and comments that typed.",
    snippet: {
      lang: "ts",
      code: `type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function parse(input: string): Result<number> { ... }`,
    },
    changes: [
      "Introduced a Result type and deleted a full class of try/catch archaeology.",
      "Named the invariants instead of commenting them, so naming a bug became a type error.",
      "Let the compiler own the impossible states, and stopped narrating them in prose.",
    ],
    keep: "The discriminated unions. Every function signature became a contract people actually read.",
    closing:
      "A type system is a conversation, and the compiler is the only listener who never interrupts.",
  },
  {
    name: "postgres",
    tags: ["postgres", "db", "perf"],
    problem:
      "The query was fast on staging, fast on the smoke test, and slow at the exact second production needed it.",
    snippet: {
      lang: "sql",
      code: `-- The plan changed because the table changed.
EXPLAIN ANALYZE
SELECT *
FROM orders
WHERE customer_id = $1
  AND created_at > now() - interval '7 days';`,
    },
    changes: [
      "Stopped tuning the query and started tuning the statistics collection.",
      "Added a partial index for the hot path and let the cold path stay cold.",
      "Made the pager text include the plan. Nobody reads a pager message without a plan.",
    ],
    keep: "The rule: never run an EXPLAIN against a table you haven't vacuumed this week.",
    closing: "Postgres is not slow. It is simply honest about the plans it believes in.",
  },
  {
    name: "rate limiting",
    tags: ["ratelimit", "go", "infra"],
    problem: "A single customer was allowed to be a long-tail distribution all by themselves.",
    snippet: {
      lang: "go",
      code: `type Bucket struct {
    tokens float64
    last   time.Time
}

func (b *Bucket) take() bool { ... }`,
    },
    changes: [
      "Moved the limiter out of the handler and into the transport, so nobody could forget it.",
      "Made the limit key the tenant, not the IP. IPs change; tenants do not.",
      "Returned a Retry-After header and watched a whole class of support tickets go quiet.",
    ],
    keep: "The per-key token bucket. No queues, no redis round trip, no drama.",
    closing: "Rate limiting is not about being mean. It is about making the steady state readable.",
  },
  {
    name: "observability",
    tags: ["observability", "otel", "sre"],
    problem: "Ten dashboards said the system was fine and the on-call phone disagreed.",
    snippet: {
      lang: "ts",
      code: `const span = trace.startSpan("checkout");
span.setAttribute("cart.size", cart.size);
const result = await charge(cart);
span.end(result.ok);`,
    },
    changes: [
      "Deleted three dashboards and kept the one that predicted incidents.",
      "Named spans after the action, not the function, so traces read like stories.",
      "Aligned the alert thresholds with the SLO instead of the system's best day.",
    ],
    keep: "One metric, one question. Every dashboard card had to answer one question or die.",
    closing: "The best dashboard is the one you trust enough to stop watching.",
  },
  {
    name: "testing",
    tags: ["testing", "ts", "vitest"],
    problem: "The test suite was green, the deploy was green, and the users were not.",
    snippet: {
      lang: "ts",
      code: `it("returns the cart total after applying discounts", () => {
    const cart = fixtures.cart();
    expect(cart.total()).toBe(42);
});`,
    },
    changes: [
      "Replaced the integration tests that measured nothing with contracts that measured everything.",
      "Wrote the failure first, so every green test had a story.",
      "Measured what the tests caught in production. The answer changed my whole career.",
    ],
    keep: "The contract tests. They are the only tests that talk to a real service.",
    closing: "Tests are not a safety net. They are the cheapest simulation of a bad Tuesday.",
  },
  {
    name: "caching",
    tags: ["cache", "redis", "perf"],
    problem: "The cache was fast, the cache was correct, and the cache was warming at 9am.",
    snippet: {
      lang: "ts",
      code: `const cached = await cache.get(key);
if (cached) return JSON.parse(cached);

const value = await compute(key);
await cache.set(key, JSON.stringify(value), { ex: 60 });
return value;`,
    },
    changes: [
      "Stamped the cache with a TTL that matched the business, not the deploy.",
      "Broke the hot key into stripes, because one key had become the whole market.",
      "Made invalidation event-driven, and told the cache nothing it could learn.",
    ],
    keep: "The stamped freshness. Knowing how old the answer is worth more than knowing it is right.",
    closing: "Every cache is a bet that the world is quiet. Hedge the morning.",
  },
  {
    name: "storage",
    tags: ["storage", "rust", "lsm"],
    problem:
      "The write path was a whisper and the read path was a rumor, and the compaction job kept sleeping.",
    snippet: {
      lang: "rust",
      code: `struct Segment {
    memtable: BTreeMap<Vec<u8>, Vec<u8>>,
    immutable: Vec<u8>,
}

impl Segment {
    fn flush(self) -> Result<Vec<u8>> { ... }
}`,
    },
    changes: [
      "Made compaction a first-class citizen with its own budget, not a background afterthought.",
      "Separated the hot and cold tables so the LSM stays shallow where it lives.",
      "Stopped promising durability and started recording a WAL that the tests actually exercised.",
    ],
    keep: "The LSM shape itself. The rest was tuning; the shape was the design.",
    closing: "Storage engines are all the same war: write fast, read honest, lose nothing.",
  },
  {
    name: "frontend performance",
    tags: ["frontend", "perf", "web"],
    problem:
      "The first paint was fast and the second one was a conversation with a server in another time zone.",
    snippet: {
      lang: "ts",
      code: `const app = await import("./app");

requestIdleCallback(() => {
    app.primeAllTheThings();
});`,
    },
    changes: [
      "Counted bytes before counting milliseconds, because the network is the only clock that matters.",
      "Split the heavy bundle behind a lazy boundary and let the idle time pay for itself.",
      "Measured with the throttled profiler and stopped tuning what nobody felt.",
    ],
    keep: "The byte budget. Every feature had a billboard and every billboard had a price.",
    closing: "The fastest code is the code the user never asked for at 2am.",
  },
  {
    name: "release engineering",
    tags: ["devops", "ci", "deploys"],
    problem: "The pipeline was a museum of scripts, and the museum was on fire.",
    snippet: {
      lang: "yaml",
      code: `- name: deploy
  run: |
    [ "$ENV" = "prod" ] || exit 0
    ./scripts/rolling-deploy.sh`,
    },
    changes: [
      "Made the build immutable and the deploy reproducible; the same commit always produced the same artifact.",
      "Added a canary with a real rollback button, and practiced clicking it.",
      "Wrote the rollback runbook in the same commit as the feature that needed it.",
    ],
    keep: "The canary. Humans cannot judge change; the traffic can.",
    closing: "A deploy is not done when it ships. It is done when the alert is quiet.",
  },
];

// ---------------------------------------------------------------------------
// Load API config and initialize
// ---------------------------------------------------------------------------
const apisConfig: ApisConfig = (
  await import(resolve(import.meta.dirname!, "../apis.json"), {
    with: { type: "json" },
  })
).default;

initApis(apisConfig);

// ---------------------------------------------------------------------------
// Fetch posts from DummyJSON
// ---------------------------------------------------------------------------
const _url = buildApiUrl("dummyjson", "posts", {
  query: { limit: COUNT, skip: SKIP, select: "id,title,body,tags,reactions,views,userId" },
});

const { data: payload } = await fetchApi<{ posts: RawPost[]; total: number }>(
  "dummyjson",
  "posts",
  { query: { limit: COUNT, skip: SKIP, select: "id,title,body,tags,reactions,views,userId" } },
);

interface RawPost {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: { likes: number; dislikes: number };
  views: number;
  userId: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function estimateReadTime(body: string): number {
  return Math.max(1, Math.ceil(body.split(/\s+/).length / 200));
}

/** Compone un artículo completo, variado y determinista a partir del post. */
function buildArticle(post: RawPost): { article: string; hook: string } {
  const t = TOPICS[post.id % TOPICS.length];
  const variant = Math.floor(post.id / TOPICS.length);
  const hook = post.body.trim().split(/\s+/).slice(0, 18).join(" ");
  const changes = [
    ...t.changes.slice(variant % t.changes.length),
    ...t.changes.slice(0, variant % t.changes.length),
  ];

  const article = [
    "## The shape of the problem",
    "",
    `${post.body.trim()} That was the letter I received at 3am, and it is the needle this article threads.`,
    "",
    `Everyone has a story like this one: the service was working, the runbook was short, and then the edge case that should have been rare became the default. This is a note from the field about a ${t.name} problem I keep meeting.`,
    "",
    "The day it happened, I started where the error pointed and worked backwards. What follows is the walk.",
    "",
    "## What actually broke",
    "",
    `${t.problem}`,
    "",
    "```".concat(t.snippet.lang),
    t.snippet.code,
    "```",
    "",
    "The code that solved it was boring. The interesting part was deciding where to put it.",
    "",
    "## The changes that mattered",
    "",
    ...changes.map((c) => `- ${c}`),
    "",
    "## What I would keep",
    "",
    `In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: ${t.keep}`,
    "",
    "> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.",
    "",
    "## The shape of the answer",
    "",
    `${t.closing} The rest of this essay is the anatomy of that change, section by section.`,
    "",
    `_Filed under ${t.tags.join(", ")}. Written after the pager went quiet._`,
  ].join("\n");

  return { article, hook };
}

// ---------------------------------------------------------------------------
// Generate markdown files
// ---------------------------------------------------------------------------
mkdirSync(BLOG_DIR, { recursive: true });

const existing = new Set(readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")));
let created = 0;

for (const post of payload.posts) {
  const slug = slugify(post.title);

  // Skip if file already exists
  if (existing.has(`${slug}.md`)) {
    continue;
  }

  const topic = TOPICS[post.id % TOPICS.length];
  const accent = ACCENTS[post.id % ACCENTS.length];
  const pattern = PATTERNS[post.id % PATTERNS.length];
  const { article, hook } = buildArticle(post);
  const readTime = estimateReadTime(article);
  const pubDate = new Date(Date.now() - post.id * 86_400_000);

  const md = [
    "---",
    `title: '${post.title.replace(/'/g, "''")}'`,
    `description: '${hook.replace(/'/g, "''")}...'`,
    `pubDate: ${pubDate.toISOString().slice(0, 10)}`,
    `readTime: ${readTime}`,
    `tags: [${[topic.name, ...topic.tags].map((t) => `'${t}'`).join(", ")}]`,
    `accent: '${accent}'`,
    `pattern: ${pattern}`,
    `reactions: ${post.reactions.likes}`,
    `views: ${post.views}`,
    "---",
    "",
    `# ${post.title.replace(/'/g, "''")}`,
    "",
    article,
    "",
  ].join("\n");

  writeFileSync(resolve(BLOG_DIR, `${slug}.md`), md);
  created += 1;
}

console.log(
  `Done: ${created} posts created, ${payload.posts.length - created} skipped (already exist).`,
);
