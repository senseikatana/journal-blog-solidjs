import { makeBanner, type Pattern } from "~/lib/banners";

export default function Banner(props: { pattern: Pattern; accent: string; id: string }) {
  return <div innerHTML={makeBanner(props.pattern, props.accent, props.id)} />;
}
