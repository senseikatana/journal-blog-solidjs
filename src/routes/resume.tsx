import { For } from "solid-js";
import PageMeta from "~/components/PageMeta";
import { resume } from "~/data/resume";

export default function Resume() {
  return (
    <>
      <PageMeta title={`Resume — ${resume.name}`} description={resume.summary} />
      <section class="section page-hero">
        <div class="container container--narrow">
          <div class="resume-head">
            <div>
              <div class="resume-name">{resume.name}</div>
              <div class="resume-role">{resume.title}</div>
            </div>
            <div class="resume-contact">
              <span>{resume.location}</span>
              <a href={`mailto:${resume.contact.email}`}>{resume.contact.email}</a>
              <a href={resume.contact.github}>
                {resume.contact.github.replace(/^https?:\/\//, "")}
              </a>
              <a href={resume.contact.website}>
                {resume.contact.website.replace(/^https?:\/\//, "")}
              </a>
              <a class="btn btn-primary resume-download" href="/cv.pdf" download="">
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                download cv — pdf
              </a>
              <button
                type="button"
                class="btn btn-ghost resume-print"
                onClick={() => window.print()}
              >
                print — save as pdf
              </button>
              <a class="resume-docs-link" href="/docs/">
                private docs — access code required
              </a>
            </div>
          </div>
          <p class="resume-summary">{resume.summary}</p>
        </div>
      </section>

      <section class="section section--tight" id="experience">
        <div class="container container--narrow">
          <div class="resume-section">
            <h3>[ experience ]</h3>
            <div class="resume-cards">
              <For each={resume.experience}>
                {(job, i) => (
                  <div class="resume-card">
                    <div class="resume-card-top">
                      <span class="resume-card-kicker">
                        [ exp {String(i() + 1).padStart(2, "0")} ]
                      </span>
                      <span class="resume-card-period">{job.period}</span>
                    </div>
                    <h4 class="resume-card-role">{job.role}</h4>
                    <div class="resume-card-company">@ {job.company}</div>
                    <ul>
                      <For each={job.bullets}>{(b) => <li>{b}</li>}</For>
                    </ul>
                    <div class="chip-row">
                      <For each={job.tech}>{(t) => <span class="chip">{t}</span>}</For>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--tight" id="skills">
        <div class="container container--narrow">
          <div class="resume-section">
            <h3>[ skills ]</h3>
            <div class="skill-groups">
              <For each={resume.skills}>
                {(group) => (
                  <div class="skill-group">
                    <h4>{group.name}</h4>
                    <For each={group.items}>{(item) => <span class="chip">{item}</span>}</For>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--tight" id="education">
        <div class="container container--narrow">
          <div class="resume-section">
            <h3>[ education & languages ]</h3>
            <div class="resume-cards">
              <For each={resume.education}>
                {(edu) => (
                  <div class="resume-card">
                    <div class="resume-card-top">
                      <span class="resume-card-kicker">[ edu ]</span>
                      <span class="resume-card-period">{edu.period}</span>
                    </div>
                    <h4 class="resume-card-role">{edu.degree}</h4>
                    <div class="resume-card-company">{edu.school}</div>
                  </div>
                )}
              </For>
            </div>
            <div style={{ "margin-top": "24px" }}>
              <For each={resume.languages}>
                {(lang) => (
                  <div class="resume-lang">
                    <strong>{lang.name}</strong>
                    <span>{lang.level}</span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
