import { RecipeItem } from "../../types";
import css from "../../styles/pages/recipe/sidebar.module.css";
import Button, { ButtonLink } from "../../components/Button";
import GFIcon from "../../components/GFIcon";
import { SocialIcon } from "../../components/SocialIcon";
import { Link } from "react-router-dom";

export function RecipeSidebar(props: { item: RecipeItem; slug: string }) {
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
      <picture className={css.image}>
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
      <div className={css.details}>
        <h2
          style={
            {
              "--_color-dark": item.metaData.colors.dark,
              "--_color-light": item.metaData.colors.light,
            } as React.CSSProperties
          }
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
          <picture className={css.image}>
            {item.metaData.author.image && (
              <>
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
              </>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 340 340"
              className={css.profile + " " + css.placeholder}
            >
              <path
                fill="#DDD"
                d="M169 .5a169 169 0 1 0 2 0zm0 86a76 76 0 1 1-2 0zM57 287q27-35 67-35h92q40 0 67 35a164 164 0 0 1-226 0"
              />
            </svg>
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
      <div className={css.quickLinks}>
        <span className={css.title}>Quick Links</span>
        <div className={css.container}>
          <a href="#ingredients">Ingredients</a>
          <a href="#prep">Prep</a>
          <a href="#instructions">Instructions</a>
        </div>
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
        {item.metaData.youtube && (
          <ButtonLink href={item.metaData.youtube}>
            <SocialIcon social="youtube" />
            YouTube
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
