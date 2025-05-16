import { ItemType, RecipeItem } from "../../types";
import { ButtonLink } from "../../components/Button";
import { SocialIcon } from "../../components/SocialIcon";
import GFIcon from "../../components/GFIcon";
import SidebarUser from "../../components/SidebarUser";

import css from "../../styles/pages/itemPage/sidebar.module.css";
import cssRecipeContent from "../../styles/pages/itemPage/sidebarRecipeContent.module.css";
import Image from "../../components/Image";

export function ItemSidebar(props: {
  item: ItemType;
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
      <Image
        src={
          "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/" +
          props.itemType +
          "/" +
          props.slug.toLowerCase() +
          "/images/thumbnail.jpg"
        }
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
              (item.metaData.subRepo ? "/tree/main/" + props.slug : "")
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
  const handleQuickLink = (link: string) => {
    const element = document.getElementById(link);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  
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
          <button onClick={() => handleQuickLink("ingredients")}>
            Ingredients
          </button>
          <button onClick={() => handleQuickLink("prep")}>Prep</button>
          <button onClick={() => handleQuickLink("instructions")} >
            Instructions
          </button>
        </div>
      </div>
    </>
  );
}
