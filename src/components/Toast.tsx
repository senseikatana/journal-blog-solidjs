import { toastMessage, toastVisible } from "~/lib/toast";

export default function Toast() {
  return (
    <div class="toast" classList={{ show: toastVisible() }} role="status" aria-live="polite">
      <span class="check">✓</span>
      <span>{toastMessage()}</span>
    </div>
  );
}
