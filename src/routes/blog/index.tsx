import { For } from "solid-js";
import ArticleCard from "~/components/ArticleCard";
import PageMeta from "~/components/PageMeta";
import { SITE_TITLE } from "~/consts";
import { getPosts } from "~/lib/posts";

export default function BlogIndex() {
  const posts = getPosts();

  return (
    <>
      <PageMeta
        title={`Archive — ${SITE_TITLE}`}
        description="Long-form essays by Maren Hofstad. Each one starts as a question I couldn't answer without writing my way through it."
      />
      <section class="section page-hero">
        <div class="container">
          <div class="section-head">
            <div>
              <h2 class="section-title">
                <span class="index">[ 01 / writing ]</span>
                The <em>archive</em>
              </h2>
            </div>
            <p class="section-desc">
              Long-form essays. Each one starts as a question I couldn't answer without writing my
              way through it.
            </p>
          </div>

          <div class="articles-grid">
            <For each={posts}>{(post) => <ArticleCard post={post} />}</For>
          </div>
        </div>
      </section>
    </>
  );
}
