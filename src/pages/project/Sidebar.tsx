import { ProjectItem } from "../../types";
import css from "../../styles/pages/project/sidebar.module.css";
import { ButtonLink } from "../../components/Button";
import { SocialIcon } from "../../components/SocialIcon";

export function Sidebar(props: { item: ProjectItem }) {
  const item = props.item;
  const dateModified = new Date(item.metaData.date.modified);
  const dateCreated = new Date(item.metaData.date.created);
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
    <div className={css.sidebar}>
      <img
        src={
          "https://raw.githubusercontent.com/xcwalker/gmod/main/" +
          item.metaData.slug +
          "/" +
          item.metaData.imageDirectory +
          "/" +
          item.data.thumbnail
        }
        className={css.thumbnail}
        alt="Thumbnail"
      />
      <div className={css.details}>
        <h3>{item.data.title}</h3>
        <h4>{item.data.subTitle}</h4>
      </div>
      <div className={css.dates}>
        <div className={css.created}>
          {dateCreated.toLocaleDateString(undefined, dateOptions)}
        </div>
        {item.metaData.date.created !== item.metaData.date.modified && (
          <div className={css.modified}>
            Last Modified:{" "}
            {dateModified.toLocaleDateString(undefined, dateOptions) ===
              dateCreated.toLocaleDateString(undefined, dateOptions) &&
              dateModified.toLocaleTimeString(undefined, timeOptions)}
            {dateModified.toLocaleDateString(undefined, dateOptions) !==
              dateCreated.toLocaleDateString(undefined, dateOptions) &&
              dateModified.toLocaleDateString(undefined, dateOptions)}
          </div>
        )}
      </div>

      <div className={css.tags}>
        {item.metaData.tags.map((tag, index) => {
          return <div key={index} className={css.tag}>{tag}</div>
        })}
      </div>

      <div className={css.links}>
        <ButtonLink
          href={
            "https://github.com/xcwalker/" +
            item.metaData.repoName +
            "/tree/main/" +
            item.metaData.slug
          }
          className={css.github}
        >
          <SocialIcon social="github" />
          Github Repo
        </ButtonLink>
        {item.metaData.workshop && (
          <ButtonLink href={item.metaData.workshop} className={css.steam}>
            <SocialIcon social="steam" />
            Workshop Page
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
