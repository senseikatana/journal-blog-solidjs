import matter from "gray-matter";
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

interface PostFrontmatter {
  title?: unknown;
  description?: unknown;
  pubDate?: unknown;
  updatedDate?: unknown;
  readTime?: unknown;
  tags?: unknown;
  accent?: unknown;
  pattern?: unknown;
}

const modules = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parsePost(raw: string, id: string): Post {
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;
  return {
    id,
    title: String(fm.title ?? id),
    description: String(fm.description ?? ""),
    pubDate: new Date(String(fm.pubDate ?? "")),
    updatedDate: fm.updatedDate ? new Date(String(fm.updatedDate)) : undefined,
    readTime: Number(fm.readTime ?? 0),
    tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
    accent: String(fm.accent ?? "#ff8c42"),
    pattern: (fm.pattern as Pattern) ?? "dots",
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
