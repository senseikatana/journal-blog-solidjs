import { useParams } from "@solidjs/router";
import { For } from "solid-js";
import Banner from "~/components/Banner";
import FormattedDate from "~/components/FormattedDate";
import NotFound from "~/components/NotFound";
import PageMeta from "~/components/PageMeta";
import { getPost, renderMarkdown } from "~/lib/posts";

export default function BlogPostRoute() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : (params.slug ?? "");
  const post = getPost(slug);

  if (!post) {
    return <NotFound />;
  }

  return (
    <>
      <PageMeta title={post.title} description={post.description} />
      <article class="post">
        <div class="container container--narrow">
          <div class="article-banner">
            <Banner pattern={post.pattern} accent={post.accent} id={post.id} />
          </div>
          <header class="article-head">
            <div class="article-meta">
              <For each={post.tags}>{(t) => <span class="tag">{t}</span>}</For>
              <span>
                <FormattedDate date={post.pubDate} />
              </span>
              <span class="sep">·</span>
              <span>{post.readTime} min read</span>
              {post.updatedDate && (
                <>
                  <span class="sep">·</span>
                  <span class="last-updated-on">
                    updated <FormattedDate date={post.updatedDate} />
                  </span>
                </>
              )}
            </div>
            <h1 class="article-title">{post.title}</h1>
            <p class="article-desc">{post.description}</p>
          </header>
          <div class="prose" innerHTML={renderMarkdown(post.body)} />
        </div>
      </article>
    </>
  );
}
