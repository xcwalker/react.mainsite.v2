import { RecipeItem } from "../../types";
import css from "../../styles/pages/recipe/sidebar.module.css";
import Button from "../../components/Button";
import GFIcon from "../../components/GFIcon";

export function Sidebar(props: { item: RecipeItem; slug: string }) {
  const item = props.item;
  const shareOutput = {
    title: item.data.title + " | " + item.data.subTitle,
    url: "https://xcwalker.dev/recipes/" + props.slug.toLowerCase(),
  };
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
      <picture>
        <source
          srcSet={
            "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/" +
            props.slug.toLowerCase() +
            "/images/thumbnail.webp"
          }
          type="image/webp"
        />
        <source
          srcSet={
            "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/" +
            props.slug.toLowerCase() +
            "/images/thumbnail.jpg"
          }
          type="image/jpg"
        />
        <img
          src={
            "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/" +
            props.slug.toLowerCase() +
            "/images/thumbnail.webp"
          }
          className={css.thumbnail}
          alt="Thumbnail"
        />
      </picture>
      <div className={css.details}>
        <h2
          style={{
            "--_color-dark": item.metaData.colors.dark,
            "--_color-light": item.metaData.colors.light,
          } as React.CSSProperties}
        >
          {item.data.title}
        </h2>
        <span>Recipe • {item.data.subTitle}</span>
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
      <div className={css.information}>
        <div className={css.info}>
          <span>Prep Time</span>
          <span>{item.data.information.prepTime}</span>
        </div>
        <div className={css.info}>
          <span>Cook Time</span>
          <span>{item.data.information.cookTime}</span>
        </div>
        <div className={css.info}>
          <span>Serves</span>
          <span>{item.data.information.serves}</span>
        </div>
      </div>
      <div className={css.ingredients}>
        <h3>Ingredients</h3>
        <ul>
          {item.data.ingredients &&
            item.data.ingredients.map((item, index) => {
              return <li key={index}>{item}</li>;
            })}
        </ul>
      </div>
      <div className={css.links}>
        {navigator.canShare && navigator.canShare(shareOutput) && (
          <Button
            onClick={() => {
              navigator.share(shareOutput);
            }}
          >
            <GFIcon className={css.gficon}>share</GFIcon>
            Share
          </Button>
        )}
      </div>
    </div>
  );
}
