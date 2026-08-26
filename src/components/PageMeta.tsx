import { Link, Meta, Title } from "@solidjs/meta";
import { useLocation } from "@solidjs/router";
import { SITE_URL } from "~/consts";

export default function PageMeta(props: { title: string; description: string }) {
  const location = useLocation();
  const url = () => `${SITE_URL}${location.pathname}`;

  return (
    <>
      <Title>{props.title}</Title>
      <Meta name="description" content={props.description} />
      <Link rel="canonical" href={url()} />
      <Meta property="og:type" content="website" />
      <Meta property="og:url" content={url()} />
      <Meta property="og:title" content={props.title} />
      <Meta property="og:description" content={props.description} />
      <Meta name="twitter:card" content="summary" />
    </>
  );
}
