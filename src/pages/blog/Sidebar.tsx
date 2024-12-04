import { BlogItem } from "../../types";
import css from "../../styles/pages/project/sidebar.module.css";
import GFIcon from "../../components/GFIcon";

export function BlogSidebar(props: { item: BlogItem; slug: string }) {
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
      {props.item.metaData.hasThumbnail && <img
        src={
          "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/projects/" +
          props.slug.toLowerCase() +
          "/images/thumbnail.jpg"
        }
        className={css.thumbnail}
        alt="Thumbnail"
      />}
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
        <div className={css.collection}>
          <GFIcon className={css.icon}>category</GFIcon>
          {item.metaData.collectionName}
        </div>
        {item.metaData.tags.map((tag, index) => {
          return (
            <div key={index} className={css.tag}>
              <GFIcon className={css.icon}>label</GFIcon>
              <span>{tag}</span>
            </div>
          );
        })}
      </div>

      {item.metaData.author && (
        <div className={css.author}>
          <picture>
            <source
              srcSet={
                "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/" +
                item.metaData.author.image.webpURL
              }
              type="image/webp"
            />
            <source
              srcSet={
                "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/" +
                item.metaData.author.image.webpURL
              }
              type="image/jpg"
            />
            <img
              src={
                "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/" +
                item.metaData.author.image.webpURL
              }
              className={css.profile}
              alt="Thumbnail"
            />
          </picture>
          <span className={css.title}>{item.metaData.author.name}</span>
        </div>
      )}
      <div className={css.links}>
      </div>
    </div>
  );
}
