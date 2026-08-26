import { For } from "solid-js";
import PageMeta from "~/components/PageMeta";
import RepoCard from "~/components/RepoCard";
import { resume } from "~/data/resume";

export default function Projects() {
  const featured = resume.projects.slice(0, 2);
  const others = resume.projects.slice(2);

  return (
    <>
      <PageMeta
        title={`Projects — ${resume.name}`}
        description="Open source projects by Sergio Jurado: small, focused utilities and libraries."
      />
      <section class="section page-hero">
        <div class="container">
          <div class="section-head">
            <div>
              <h2 class="section-title">
                <span class="index">[ projects ]</span>
                Open source, <em>live</em>
              </h2>
            </div>
            <p class="section-desc">
              Counters refresh every few seconds. Most of these are small utilities — I'd rather
              ship something focused than popular.
            </p>
          </div>

          <div class="stack-grid">
            <For each={featured}>
              {(p) => (
                <RepoCard repo={p.repo} owner={p.owner} desc={p.desc} stars={p.stars} forks={p.forks} />
              )}
            </For>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section class="section section--tight">
          <div class="container container--narrow">
            <div class="resume-section">
              <h3>[ other projects ]</h3>
              <For each={others}>
                {(p) => (
                  <div class="mini-project">
                    <div class="mini-project-head">
                      <span class="mini-project-name">
                        <a href={`https://github.com/${p.owner}/${p.repo}`}>{p.repo}</a>
                      </span>
                    </div>
                    <p class="mini-project-desc">{p.desc}</p>
                    <div class="chip-row">
                      <For each={p.tags}>{(t) => <span class="chip">{t}</span>}</For>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
