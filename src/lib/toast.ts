import { createSignal } from "solid-js";

const [toastMessage, setToastMessage] = createSignal("");
const [toastVisible, setToastVisible] = createSignal(false);

let timer: ReturnType<typeof setTimeout> | undefined;

export function showToast(msg: string) {
  setToastMessage(msg);
  setToastVisible(true);
  clearTimeout(timer);
  timer = setTimeout(() => setToastVisible(false), 2400);
}

export { toastMessage, toastVisible };
