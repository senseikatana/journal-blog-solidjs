import { HttpStatusCode } from "@solidjs/start";
import PageMeta from "~/components/PageMeta";

export default function NotFound() {
  return (
    <>
      <PageMeta title="Page not found" description="The page you requested does not exist." />
      <section class="section page-hero">
        <div class="container container--narrow">
          <HttpStatusCode code={404} />
          <h2 class="section-title">
            <span class="index">[ 404 ]</span>
            Page not <em>found</em>
          </h2>
          <p class="section-desc">
            The URL you requested doesn't exist in this journal. Try the{" "}
            <a href="/blog/">archive</a> instead.
          </p>
        </div>
      </section>
    </>
  );
}
