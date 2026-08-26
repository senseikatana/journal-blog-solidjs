import { A } from "@solidjs/router";
import { For } from "solid-js";
import { AUTHOR } from "~/consts";
import type { Post } from "~/lib/posts";
import Banner from "./Banner";

export default function ArticleCard(props: { post: Post }) {
  const { post } = props;
  const dateLabel = post.pubDate
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase();

  return (
    <A class="card" href={`/blog/${post.id}/`} aria-label={post.title}>
      <div class="card-banner">
        <Banner pattern={post.pattern} accent={post.accent} id={post.id} />
        <div class="tags">
          <For each={post.tags}>{(current) => <span class="tag">{current}</span>}</For>
        </div>
        <span class="read-time">{post.readTime} min</span>
      </div>
      <div class="card-body">
        <div class="card-date">
          <span>{dateLabel}</span>
          <span class="sep">·</span>
          <span>{post.readTime} min read</span>
        </div>
        <h3 class="card-title">{post.title}</h3>
        <p class="card-excerpt">{post.description}</p>
        <div class="card-foot">
          <div class="card-author">
            <span class="avatar">MH</span>
            <span>{AUTHOR}</span>
          </div>
          <span class="card-readmore">read →</span>
        </div>
      </div>
    </A>
  );
}
