import { Link } from "react-router-dom";
import css from "../styles/components/listItem.module.css";

export default function ListItem(props: {
  title: string;
  subTitle: string;
  href: string;
  date: string;
}) {
  const date = new Date(props.date);
  return (
    <li className={css.listItem}>
      <Link to={props.href}>
        <div className={css.info}>
          <span className={css.title}>{props.title}</span>
          <span className={css.subTitle}>{props.subTitle}</span>
        </div>

        <div className={css.shortDate}>
          {date &&
            date.toLocaleDateString(undefined, {
              weekday: undefined,
              year: "2-digit",
              month: "numeric",
              day: "numeric",
            })}
        </div>
        <div className={css.extraInfo}>
          <span className={css.date}>
            {date &&
              date.toLocaleDateString(undefined, {
                weekday: undefined,
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </span>
        </div>
      </Link>
    </li>
  );
}
