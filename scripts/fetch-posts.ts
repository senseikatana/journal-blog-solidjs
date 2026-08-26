/**
 * Script: fetch dummyjson posts and generate markdown files for the blog.
 *
 * Usage:  bun run scripts/fetch-posts.ts
 *         bun run scripts/fetch-posts.ts --count 10
 *
 * Reads apis.json, uses the ApiManager to build the URL, fetches
 * posts from DummyJSON, and writes one .md per post in src/content/blog/.
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
  const words = body.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function _generateBannerSvg(_pattern: string, color: string, _uid: string): string {
  // Minimal SVG banner placeholder — real banner comes from lib/banners.ts at render time
  return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice"><rect width="320" height="180" fill="${color}" opacity="0.15"/></svg>`;
}

// ---------------------------------------------------------------------------
// Generate markdown files
// ---------------------------------------------------------------------------
mkdirSync(BLOG_DIR, { recursive: true });

const existing = new Set(readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")));
let _created = 0;

for (const post of payload.posts) {
  const slug = slugify(post.title);

  // Skip if file already exists
  if (existing.has(`${slug}.md`)) {
    continue;
  }

  const accent = ACCENTS[post.id % ACCENTS.length];
  const pattern = PATTERNS[post.id % PATTERNS.length];
  const readTime = estimateReadTime(post.body);
  const pubDate = new Date(Date.now() - post.id * 86_400_000);

  const md = [
    "---",
    `title: '${post.title.replace(/'/g, "''")}'`,
    `description: '${post.body.slice(0, 150).replace(/'/g, "''")}...'`,
    `pubDate: ${pubDate.toISOString().slice(0, 10)}`,
    `readTime: ${readTime}`,
    `tags: [${post.tags.map((t) => `'${t}'`).join(", ")}]`,
    `accent: '${accent}'`,
    `pattern: ${pattern}`,
    `reactions: ${post.reactions.likes}`,
    `views: ${post.views}`,
    "---",
    "",
    post.body,
    "",
  ].join("\n");

  writeFileSync(resolve(BLOG_DIR, `${slug}.md`), md);
  _created++;
}
