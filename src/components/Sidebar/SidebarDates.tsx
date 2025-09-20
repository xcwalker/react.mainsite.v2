import css from "../../styles/components/sidebarDates.module.css";

export default function SidebarDates(props: { created: Date; modified: Date }) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: undefined,
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    second: undefined,
    minute: "numeric",
    hour: "numeric",
  };

  return (
    <div className={css.dates}>
      <div className={css.created}>
        {props.created.toLocaleDateString(undefined, dateOptions)}
      </div>
      {props.created.getTime() !== props.modified.getTime() && (
        <div className={css.modified}>
          Last Modified:{" "}
          {props.modified.toLocaleDateString(undefined, dateOptions) ===
          props.created.toLocaleDateString(undefined, dateOptions) ? (
            props.modified.toLocaleTimeString(undefined, timeOptions)
          ) : (
            props.modified.toLocaleDateString(undefined, dateOptions)
          )}
        </div>
      )}
    </div>
  );
} 