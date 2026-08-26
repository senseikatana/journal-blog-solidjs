import { For } from "solid-js";
import ArticleCard from "~/components/ArticleCard";
import CodeSnippet from "~/components/CodeSnippet";
import Hero from "~/components/Hero";
import NewsletterSection from "~/components/NewsletterSection";
import PageMeta from "~/components/PageMeta";
import RepoCard from "~/components/RepoCard";
import StackSection from "~/components/StackSection";
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
      <StackSection />

      <section class="section" id="projects">
        <div class="container">
          <div class="section-head">
            <div>
              <h2 class="section-title">
                <span class="index">[ 04 / repos ]</span>
                Open source, <em>live</em>
              </h2>
            </div>
            <p class="section-desc">
              Counters refresh every few seconds. Most of these are small utilities — I'd rather
              ship something focused than popular.
            </p>
          </div>

          <div class="stack-grid">
            <RepoCard
              repo="quartz"
              desc="Embeddable Raft consensus library, ~2k LOC, zero deps."
              stars={2847}
              forks={213}
            />
            <RepoCard
              repo="fjord"
              desc="A streaming log structured storage engine, in pure Rust."
              stars={1532}
              forks={98}
            />
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
