import { type JSX, onCleanup, onMount } from "solid-js";
import { cycleTheme, initTheme } from "~/lib/theme";
import Footer from "./Footer";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import Toast from "./Toast";

export default function SiteChrome(props: { children: JSX.Element }) {
  onMount(() => {
    initTheme();

    const onKeydown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "t" || e.key === "T") {
        cycleTheme();
      }
    };
    document.addEventListener("keydown", onKeydown);
    onCleanup(() => document.removeEventListener("keydown", onKeydown));
  });

  return (
    <>
      <div class="bg-grid" />
      <div class="bg-glow" />
      <div class="bg-noise" />
      <ProgressBar />
      <Header />
      <main>{props.children}</main>
      <Footer />
      <Toast />
    </>
  );
}
