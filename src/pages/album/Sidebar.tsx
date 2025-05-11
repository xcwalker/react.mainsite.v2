import { AlbumItem } from "../../types";
import css from "../../styles/pages/project/sidebar.module.css";
import GFIcon from "../../components/GFIcon";
import SidebarUser from "../../components/SidebarUser";

export function AlbumSidebar(props: { item: AlbumItem; slug: string }) {
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
      <div className={css.thumbnail}>
        <picture className={css.image}>
          <img
            src={
              "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/projects/" +
              props.slug.toLowerCase() +
              "/images/thumbnail.jpg"
            }
            className={css.thumbnail}
            alt=""
          />
          <div className={css.thumbnail + " " + css.placeholder}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180.12 139.79">
              <g
                paintOrder="fill markers stroke"
                transform="translate(-13.59 -66.639)"
              >
                <path fill="#d0d0d0" d="M13.591 66.639h180.12v139.79H13.591z" />
                <path
                  fill="#fff"
                  d="m118.51 133.51-34.249 34.249-15.968-15.968-41.938 41.937h152.37z"
                  opacity={0.675}
                />
                <circle
                  cx={58.217}
                  cy={108.56}
                  r={11.773}
                  fill="#fff"
                  opacity={0.675}
                />
                <path fill="none" d="M26.111 77.634h152.61v116.1H26.111z" />
              </g>
            </svg>
          </div>
        </picture>
      </div>

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
      {item.metaData.authorID && (
        <SidebarUser userId={item.metaData.authorID} />
      )}
    </div>
  );
}
