import { createSignal, For } from "solid-js";
import PageMeta from "~/components/PageMeta";
import { privateDocs, type PrivateDoc } from "~/data/docs";
import { resume } from "~/data/resume";

function DocCard(props: { doc: PrivateDoc }) {
  const [status, setStatus] = createSignal("");
  let inputRef: HTMLInputElement | undefined;

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    const input = inputRef;
    if (!input) return;
    const token = input.value.trim();
    if (!token) {
      setStatus("enter the access code");
      return;
    }

    setStatus("checking…");
    try {
      const res = await fetch(`/api/download/${props.doc.id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        setStatus(res.status === 401 ? "invalid access code" : "something went wrong");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${props.doc.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus("download started");
    } catch {
      setStatus("network error");
    }
  };

  return (
    <div class="resume-card">
      <div class="resume-card-top">
        <span class="resume-card-kicker">[ doc ]</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="doc-lock"
        >
          <rect x="3" y="11" width="18" height="11" rx="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <h4 class="resume-card-role">{props.doc.label}</h4>
      <p class="resume-card-desc">{props.doc.desc}</p>
      <form class="doc-form" data-doc={props.doc.id} onSubmit={onSubmit}>
        <div class="doc-row">
          <input
            class="doc-code"
            type="password"
            placeholder="access code"
            autocomplete="off"
            aria-label="Access code"
            ref={inputRef}
          />
          <button class="btn btn-primary doc-btn" type="submit">
            download
          </button>
        </div>
        <span class="doc-status" aria-live="polite">
          {status()}
        </span>
      </form>
    </div>
  );
}

export default function Docs() {
  return (
    <>
      <PageMeta
        title={`Private documents — ${resume.name}`}
        description="Private PDFs shared on request. Each document requires the access code I shared with you."
      />
      <section class="section page-hero">
        <div class="container container--narrow">
          <div class="section-head">
            <div>
              <h2 class="section-title">
                <span class="index">[ docs ]</span>
                Private <em>documents</em>
              </h2>
            </div>
            <p class="section-desc">
              These files are not listed anywhere and their URLs are never exposed. Enter the
              access code I shared with you to download.
            </p>
          </div>

          <div class="resume-cards">
            <For each={privateDocs}>{(doc) => <DocCard doc={doc} />}</For>
          </div>

          <p class="resume-lang" style={{ "margin-top": "24px" }}>
            Need a document? <a href={`mailto:${resume.contact.email}`}>Ask for it</a> and I'll send
            you the code.
          </p>
        </div>
      </section>
    </>
  );
}
