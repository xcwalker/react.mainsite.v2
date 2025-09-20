import { ItemType, ItemTypes, RecipeItemProps, UserType } from "../../types";
import Button from "../../components/Button";
import { SocialIcon } from "../../components/SocialIcon";
import GFIcon from "../../components/GFIcon";
import SidebarUser from "../../components/Sidebar/SidebarUser";

import css from "../../styles/pages/itemPage/sidebar.module.css";
import cssRecipeContent from "../../styles/pages/itemPage/sidebarRecipeContent.module.css";
import Image from "../../components/Image";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { useEffect, useState } from "react";
import firebaseGetRealtimeData from "../../functions/firebase/storage/useRealtimeData";
import { shortURL } from "../../App";
import { QRModal } from "../../components/QRModal";
import firebaseDeleteData from "../../functions/firebase/storage/deleteData";
import { Navigate } from "react-router-dom";
import QRCode from "react-qr-code";
import SidebarTitle from "../../components/Sidebar/SidebarTitle";
import SidebarDates from "../../components/Sidebar/SidebarDates";
import { SidebarContainer } from "../../components/Sidebar/SidebarContainer";

export function ItemSidebar(props: {
  item: ItemType;
  slug: string;
  itemType: ItemTypes;
  checklistMode: boolean;
  setChecklistMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const currentUser = useAuth();
  const [currentUserData, setCurrentUserData] = useState<
    UserType | undefined
  >();
  const item = props.item;
  const dateModified = new Date(item.metaData.date.modified);
  const dateCreated = new Date(item.metaData.date.created);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shopQRModal, setShopQRModal] = useState(false);

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
    <>
      <SidebarContainer>
        <Image
          src={props.item.metaData?.thumbnail}
          alt="Thumbnail"
          className={css.thumbnail}
        />
        <SidebarTitle title={item.data.title} subtitle={item.data.subTitle} />
        <SidebarDates created={dateCreated} modified={dateModified} />
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
          {props.itemType === "recipes" && (
            <Button
              icon={{
                gficon: props.checklistMode
                  ? "format_list_numbered"
                  : "checklist",
              }}
              style="secondary"
              onClick={() => props.setChecklistMode(!props.checklistMode)}
              title={
                (props.checklistMode ? "Numbered" : "Checklist") +
                "  Mode"
              }
            >
              {props.checklistMode ? "Numbered" : "Checklist"} Mode
            </Button>
          )}
          {item.metaData.youtube && item.metaData.youtube.length > 0 && (
            <Button
              href={item.metaData.youtube}
              external
              title="View on YouTube"
              icon={{ inline: <SocialIcon social="youtube" /> }}
              style="secondary"
            >
              YouTube
            </Button>
          )}
          {item.metaData.repoName && item.metaData.repoName.length > 0 && (
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
          {item.metaData.workshop && item.metaData.workshop.length > 0 && (
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
          <Button
            title="Share With QR Code"
            icon={{ gficon: "qr_code" }}
            onClick={() => {
              setShopQRModal(true);
            }}
            style="secondary"
          >
            Share Via QR
          </Button>
          {navigator.canShare &&
            navigator.canShare({
              title: item.data.title,
              text: item.data.subTitle,
              url: props.itemType.charAt(0) + shortURL + "/" + props.slug,
            }) && (
              <Button
                onClick={async () => {
                  await navigator.share({
                    title: item.data.title,
                    text: item.data.subTitle,
                    url: props.itemType.charAt(0) + shortURL + "/" + props.slug,
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
          {!navigator.canShare && (
            <Button
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    props.itemType.charAt(0) + "." + shortURL + "/" + props.slug
                  )
                  .then(() => {
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2000);
                  });
              }}
              title="Copy Link"
              icon={{ gficon: linkCopied ? "check" : "link" }}
              style={
                linkCopied
                  ? "success"
                  : currentUser?.uid === props.item.metaData.authorID
                  ? "secondary"
                  : "primary"
              }
              disabled={linkCopied}
            >
              {linkCopied ? "Link Copied!" : "Copy Link"}
            </Button>
          )}
          {currentUser?.uid === props.item.metaData.authorID && (
            <>
              <Button
                href={"./edit"}
                title={"Edit " + item.data.title}
                icon={{ gficon: "edit" }}
                style="primary"
              >
                Edit
              </Button>
              <Button
                icon={{ gficon: "delete" }}
                title="Delete"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this item? This action cannot be undone."
                    )
                  ) {
                    // delete item
                    firebaseDeleteData(props.itemType, props.slug);
                    Navigate({ to: "../" });
                  }
                }}
                style="danger"
              >
                Delete
              </Button>
            </>
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

        {/* print qr code */}
        <QRCode
          value={props.itemType.charAt(0) + "." + shortURL + "/" + props.slug}
          size={128}
          className={css.printQrCode}
          fgColor="var(--text)"
          bgColor="var(--background-100)"
        />
      </SidebarContainer>
      <QRModal
        close={() => {
          setShopQRModal(false);
        }}
        link={props.itemType.charAt(0) + "." + shortURL + "/" + props.slug}
        visible={shopQRModal}
      />
    </>
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
