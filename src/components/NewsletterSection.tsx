import { showToast } from "~/lib/toast";

export default function NewsletterSection() {
  let inputRef: HTMLInputElement | undefined;

  const onSubmit = (e: Event) => {
    e.preventDefault();
    const input = inputRef;
    if (!input) return;
    const email = input.value.trim();
    if (!email) return;
    input.value = "";
    showToast(`subscribed — welcome aboard, ${email.split("@")[0]}`);
  };

  return (
    <section class="section" id="newsletter">
      <div class="container">
        <div class="newsletter">
          <div class="newsletter-content">
            <h3>
              Get the next essay <em>in your inbox</em>
            </h3>
            <p>
              One email every other Sunday. Long-form pieces about the systems I'm building and the
              bugs I'm chasing. No tracking, no sponsors, unsubscribe with a single click.
            </p>
          </div>
          <form class="newsletter-form" id="newsletterForm" onSubmit={onSubmit}>
            <input
              type="email"
              class="newsletter-input"
              placeholder="you@somewhere.dev"
              required
              aria-label="Email"
              ref={inputRef}
            />
            <button type="submit" class="newsletter-submit">
              subscribe — every other sunday
            </button>
            <span class="newsletter-note">2,841 readers · no spam · RSS also available</span>
          </form>
        </div>
      </div>
    </section>
  );
}
