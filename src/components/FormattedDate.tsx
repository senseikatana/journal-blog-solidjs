export default function FormattedDate(props: { date: Date }) {
  return (
    <time datetime={props.date.toISOString()}>
      {props.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      })}
    </time>
  );
}
