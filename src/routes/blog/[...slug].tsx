import { useParams } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";
import { For } from "solid-js";
import Banner from "~/components/Banner";
import FormattedDate from "~/components/FormattedDate";
import PageMeta from "~/components/PageMeta";
import { getPost, renderMarkdown } from "~/lib/posts";

export default function BlogPostRoute() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : (params.slug ?? "");
  const post = getPost(slug);

  if (!post) {
    return (
      <>
        <PageMeta title="Post not found" description="This essay does not exist in the archive." />
        <section class="section page-hero">
          <div class="container container--narrow">
            <HttpStatusCode code={404} />
            <h2 class="section-title">
              <span class="index">[ 404 ]</span>
              Post not <em>found</em>
            </h2>
          </div>
        </section>
      </>
    );
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
