import { useParams } from "@solidjs/router";
import { For, Show } from "solid-js";
import ArticleCard from "~/components/ArticleCard";
import NotFound from "~/components/NotFound";
import PageMeta from "~/components/PageMeta";
import { getPosts, tagFromSlug } from "~/lib/posts";

export default function TagRoute() {
  const params = useParams();
  const slug = params.tag ?? "";
  const tag = tagFromSlug(slug) ?? slug;
  const posts = getPosts().filter((p) => p.tags.includes(tag));

  return (
    <Show when={posts.length > 0} fallback={<NotFound />}>
      <PageMeta
        title={`${tag} — journal archive`}
        description={`All journal entries tagged "${tag}".`}
      />
      <section class="section page-hero">
        <div class="container">
          <div class="section-head">
            <div>
              <h2 class="section-title">
                <span class="index">[ tag ]</span>
                Filed under <em>{tag}</em>
              </h2>
            </div>
            <p class="section-desc">
              {posts.length} {posts.length === 1 ? "entry" : "entries"} tagged{" "}
              <span class="tag">{tag}</span>. Each one starts as a question I couldn't answer
              without writing my way through it.
            </p>
          </div>

          <div class="articles-grid">
            <For each={posts}>{(post) => <ArticleCard post={post} />}</For>
          </div>
        </div>
      </section>
    </Show>
  );
}
