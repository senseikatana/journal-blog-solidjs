import { marked } from "marked";
import type { Pattern } from "./banners";

export interface Post {
  id: string;
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  readTime: number;
  tags: string[];
  accent: string;
  pattern: Pattern;
  body: string;
}

/**
 * Mini-parser de frontmatter YAML (sin dependencias, seguro en navegador).
 * Soporta los tipos simples que usan los posts: string, número, fecha y
 * arrays de strings entre corchetes.
 */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^['"]|['"]$/g, ""));
    } else if (/^-?\d+(\.\d+)?$/.test(value)) {
      data[key] = Number(value);
    } else {
      data[key] = value.replace(/^['"]|['"]$/g, "");
    }
  }
  return { data, content: match[2].trimStart() };
}

const modules = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parsePost(raw: string, id: string): Post {
  const { data, content } = parseFrontmatter(raw);
  return {
    id,
    title: String(data.title ?? id),
    description: String(data.description ?? ""),
    pubDate: new Date(String(data.pubDate ?? "")),
    updatedDate: data.updatedDate ? new Date(String(data.updatedDate)) : undefined,
    readTime: Number(data.readTime ?? 0),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    accent: String(data.accent ?? "#ff8c42"),
    pattern: (data.pattern as Pattern) ?? "dots",
    body: content,
  };
}

const posts: Post[] = Object.entries(modules)
  .map(([path, raw]) => {
    const id = path.split("/").pop()!.replace(/\.md$/, "");
    return parsePost(raw, id);
  })
  .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

export function getPosts(): Post[] {
  return posts;
}

export function getPost(id: string): Post | undefined {
  return posts.find((p) => p.id === id);
}

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}
