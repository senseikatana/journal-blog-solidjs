import { For } from "solid-js";
import ArticleCard from "~/components/ArticleCard";
import CodeSnippet from "~/components/CodeSnippet";
import Hero from "~/components/Hero";
import NewsletterSection from "~/components/NewsletterSection";
import PageMeta from "~/components/PageMeta";
import StatsBar from "~/components/StatsBar";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/consts";
import { getPosts } from "~/lib/posts";

export default function Home() {
  const posts = getPosts();

  return (
    <>
      <PageMeta title={SITE_TITLE} description={SITE_DESCRIPTION} />
      <Hero />
      <StatsBar />

      <section class="section" id="articles">
        <div class="container">
          <div class="section-head">
            <div>
              <h2 class="section-title">
                <span class="index">[ 01 / writing ]</span>
                Field notes from <em>production</em>
              </h2>
            </div>
            <p class="section-desc">
              Long-form essays. Each one starts as a question I couldn't answer without writing my
              way through it.
            </p>
          </div>

          <div class="articles-grid" id="articlesGrid">
            <For each={posts}>{(post) => <ArticleCard post={post} />}</For>
          </div>
        </div>
      </section>

      <CodeSnippet />
      <NewsletterSection />
    </>
  );
}
