import { ItemType, ItemTypes, RecipeItemProps, UserType } from "../../types";
import Button from "../../components/Button";
import { SocialIcon } from "../../components/SocialIcon";
import GFIcon from "../../components/GFIcon";
import SidebarUser from "../../components/SidebarUser";

import css from "../../styles/pages/itemPage/sidebar.module.css";
import cssRecipeContent from "../../styles/pages/itemPage/sidebarRecipeContent.module.css";
import Image from "../../components/Image";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { useEffect, useState } from "react";
import firebaseGetRealtimeData from "../../functions/firebase/storage/useRealtimeData";

export function ItemSidebar(props: {
  item: ItemType;
  slug: string;
  itemType: ItemTypes;
}) {
  const currentUser = useAuth();
  const [currentUserData, setCurrentUserData] = useState<UserType | undefined>();
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

  useEffect(() => {
    if (currentUser?.uid) {
      firebaseGetRealtimeData(
        "users",
        currentUser.uid,
        setCurrentUserData as React.Dispatch<React.SetStateAction<unknown>>
      );
    }
  }, [currentUser?.uid]);

  return (
    <div className={css.sidebar}>
      <Image
        src={props.item.metaData?.thumbnail}
        alt="Thumbnail"
        className={css.thumbnail}
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
        <RecipeSidebarContent item={item as RecipeItemProps} />
      )}
      <div className={css.links}>
        {item.metaData.repoName && (
          <Button
            href={
              "https://github.com/xcwalker/" +
              item.metaData.repoName +
              (item.metaData.subRepo
                ? "/tree/main/" + item.metaData.subRepo
                : "")
            }
            external
            title="Github Repo"
            icon={{ inline: <SocialIcon social="github" /> }}
            style="secondary"
          >
            Github Repo
          </Button>
        )}
        {item.metaData.workshop && (
          <Button
            href={item.metaData.workshop}
            external
            title="Steam Workshop Page"
            icon={{ inline: <SocialIcon social="steam" /> }}
            style="secondary"
          >
            Workshop Page
          </Button>
        )}
        {navigator.canShare &&
          navigator.canShare({
            title: item.data.title,
            text: item.data.subTitle,
            url: window.location.href,
          }) && (
            <Button
              onClick={async () => {
                await navigator.share({
                  title: item.data.title,
                  text: item.data.subTitle,
                  url: window.location.href,
                });
              }}
              title="Share"
              icon={{ gficon: "share" }}
              style={
                currentUser?.uid === props.item.metaData.authorID
                  ? "secondary"
                  : "primary"
              }
            >
              Share
            </Button>
          )}
        {currentUser?.uid === props.item.metaData.authorID && (
          <Button
            href={"./edit"}
            title={"Edit " + item.data.title}
            icon={{ gficon: "edit" }}
            style="primary"
          >
            Edit
          </Button>
        )}
        {currentUserData?.info.role &&
          currentUserData?.info.role !== "user" &&
          currentUserData?.info.role !== "unverified" && (
            <Button
              href={"./admin-edit"}
              title={"Edit " + item.data.title}
              icon={{ gficon: "person_edit" }}
              style="primary"
            >
              Admin Edit
            </Button>
          )}
      </div>
    </div>
  );
}

function RecipeSidebarContent(props: { item: RecipeItemProps }) {
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
          <button onClick={() => handleQuickLink("instructions")}>
            Instructions
          </button>
        </div>
      </div>
    </>
  );
}
