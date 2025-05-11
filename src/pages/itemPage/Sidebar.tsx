import { ProjectItem, RecipeItem } from "../../types";
import { ButtonLink } from "../../components/Button";
import { SocialIcon } from "../../components/SocialIcon";
import GFIcon from "../../components/GFIcon";
import SidebarUser from "../../components/SidebarUser";

import css from "../../styles/pages/itemPage/sidebar.module.css";
import cssRecipeContent from "../../styles/pages/itemPage/sidebarRecipeContent.module.css";

export function ItemSidebar(props: {
  item: ProjectItem;
  slug: string;
  itemType: "projects" | "recipes" | "albums" | "blog";
}) {
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
              "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/" +
              props.itemType +
              "/" +
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
      {props.itemType === "recipes" && (
        <RecipeSidebarContent item={item as RecipeItem} />
      )}
      <div className={css.links}>
        {item.metaData.repoName && (
          <ButtonLink
            href={
              "https://github.com/xcwalker/" +
              item.metaData.repoName +
              (item.metaData.subRepo ? "/tree/main/" + item.metaData.slug : "")
            }
            className={css.github}
            type="newTab"
          >
            <SocialIcon social="github" />
            Github Repo
            <GFIcon className={css.icon}>open_in_new</GFIcon>
          </ButtonLink>
        )}
        {item.metaData.workshop && (
          <ButtonLink
            href={item.metaData.workshop}
            className={css.steam}
            type="newTab"
          >
            <SocialIcon social="steam" />
            Workshop Page
            <GFIcon className={css.icon}>open_in_new</GFIcon>
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

function RecipeSidebarContent(props: { item: RecipeItem }) {
  return (
    <>
      {props.item.data.information.prepTime &&
        props.item.data.information.cookTime &&
        props.item.data.information.serves && (
          <div className={cssRecipeContent.information}>
            {props.item.data.information.prepTime && (
              <div className={cssRecipeContent.info}>
                <span>Prep Time</span>
                <span>{props.item.data.information.prepTime}</span>
              </div>
            )}
            {props.item.data.information.cookTime && (
              <div className={cssRecipeContent.info}>
                <span>Cook Time</span>
                <span>{props.item.data.information.cookTime}</span>
              </div>
            )}
            {props.item.data.information.serves && (
              <div className={cssRecipeContent.info}>
                <span>Serves</span>
                <span>{props.item.data.information.serves}</span>
              </div>
            )}
          </div>
        )}
      <div className={cssRecipeContent.quickLinks}>
        <span className={cssRecipeContent.title}>Quick Links</span>
        <div className={cssRecipeContent.container}>
          <a href="#ingredients">Ingredients</a>
          <a href="#prep">Prep</a>
          <a href="#instructions">Instructions</a>
        </div>
      </div>
    </>
  );
}
