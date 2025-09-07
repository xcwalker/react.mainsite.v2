import { useEffect, useState } from "react";
import Section from "../../components/Section";
import SidebarUser from "../../components/SidebarUser";
import { useAuth } from "../../functions/firebase/authentication/useAuth";

import css from "../../styles/pages/newTab.module.css";
import firebaseGetData from "../../functions/firebase/storage/getData";
import { LinkItem as LinkItemType, NewTabLinks } from "../../types";
import ErrorPage from "../../ErrorPage";
import LoadingPage from "../../components/Loading";
import GFIcon from "../../components/GFIcon";
import Logo from "../../components/Logo";
import { Navigate } from "react-router-dom";
import { NewTabSearch } from "./Search";
import firebaseSetupNewTabData from "../../functions/firebase/storage/extra/setupNewTabData";
import { Helmet } from "react-helmet";
import { NewTabLinksAtom, separator, title } from "../../App";
import { useAtom } from "jotai";

export default function NewTab() {
  const user = useAuth();
  const [linkData, setLinkData] = useState<NewTabLinks | undefined>();
  const [error, setError] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [hasCMDKey, setHasCMDKey] = useState(false);
  const [modifierPressed, setModifierPressed] = useState(false);
  const [cachedData, setCachedData] = useAtom(NewTabLinksAtom);

  useEffect(() => {
    // page setup
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    setHasCMDKey(isMac);
  }, []);

  useEffect(() => {
    console.log("Link Data Changed", linkData);
    console.log("Cached Data", cachedData);
    if (cachedData && !linkData) {
      console.info("Loading From Cache");
      setLinkData(cachedData);
    }
  }, [cachedData, linkData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((!hasCMDKey && e.ctrlKey) || (hasCMDKey && e.metaKey)) {
        setModifierPressed(true);

        if (e.key.toLowerCase() === "e") {
          e.preventDefault();
          setEditMode((prev) => !prev);
        } else if (e.key.toLowerCase() === "s") {
          e.preventDefault();
          const searchInput = document.getElementById(
            "searchInput"
          ) as HTMLInputElement | null;
          if (searchInput) {
            searchInput.focus();
          }
        } else if (/^[0-9]$/.test(e.key)) {
          const index = e.key === "0" ? 9 : parseInt(e.key) - 1;
          if (linkData?.links[index]) {
            e.preventDefault();
            window.location.href = linkData.links[index].url;
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.key === "Meta") {
        setModifierPressed(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [linkData?.links, hasCMDKey]);

  useEffect(() => {
    if (!user?.uid) {
      console.error("User not authenticated");
      return;
    }

    firebaseGetData("newtab", user?.uid).then((data) => {
      if (data === undefined) {
        firebaseSetupNewTabData(user?.uid).then(() => {
          firebaseGetData("newtab", user?.uid).then((data) => {
            setLinkData(data as NewTabLinks);
            console.info("Updating Cache");
            setCachedData(data as NewTabLinks);
            setError(false);
            return;
          });
        });
        return;
      }
      setLinkData(data as NewTabLinks);
      console.info("Updating Cache");
      setCachedData(data as NewTabLinks);
      setError(false);
      return;
    });
    return () => {
      setLinkData(undefined);
      setError(false);
    };
  }, [user?.uid, setCachedData]);

  // focus on the search input when the component mounts
  useEffect(() => {
    const searchInput = document.getElementById(
      "searchInput"
    ) as HTMLInputElement | null;

    if (searchInput) {
      searchInput.focus();
    }
  }, [linkData]);

  return (
    <>
      {!error && !editMode && (
        <>
          <Helmet>
            <title>
              New Tab {separator} {title}
            </title>
          </Helmet>
          <Section
            id="new-tab"
            className={css.newTab}
            container={{ className: css.container }}
            style={
              {
                "--_color-page": linkData?.settings.color || "#000",
              } as React.CSSProperties
            }
          >
            {linkData && (
              <div className={css.background}>
                {linkData && linkData.settings.background.image ? (
                  <img
                    src={linkData.settings.background.image}
                    alt={"Background Image"}
                    className={css.backgroundImage}
                    style={{
                      filter: linkData.settings.background.filter
                        ? linkData.settings.background.filter
                        : "unset",
                    }}
                  />
                ) : (
                  <div
                    className={css.backgroundColor}
                    style={{
                      backgroundColor: linkData.settings.background.color,
                    }}
                  ></div>
                )}
              </div>
            )}
            {user?.uid !== undefined && (
              <SidebarUser userId={user.uid} className={css.user} />
            )}
            {linkData?.links && (
              <div className={css.links}>
                {linkData?.settings.showOrganization === true && (
                  <Logo type="xcwalker" className={css.logo} />
                )}
                <div className={css.search}>
                  {linkData.settings.showSearch && (
                    <NewTabSearch
                      hasCMDKey={hasCMDKey}
                      modifierPressed={modifierPressed}
                      queryURL={linkData.settings.search.queryURL}
                      searchProvider={linkData.settings.search.provider}
                    />
                  )}
                </div>
                <ul>
                  {linkData.links.map((link, index) => (
                    <LinkItem
                      key={index}
                      link={link}
                      hasCMDKey={hasCMDKey}
                      modifierPressed={modifierPressed}
                      index={index}
                    />
                  ))}
                </ul>
              </div>
            )}
            <div className={css.editButtonWrapper}>
              {!hasCMDKey && (
                <span
                  className={
                    css.editShortcut +
                    (modifierPressed ? " " + css.modifier : "")
                  }
                >
                  Ctrl + E
                </span>
              )}
              {hasCMDKey && (
                <span
                  className={
                    css.editShortcut +
                    (modifierPressed ? " " + css.modifier : "")
                  }
                >
                  ⌘ + E
                </span>
              )}
              <button
                className={css.edit}
                onClick={() => {
                  setEditMode(true);
                }}
              >
                <GFIcon className={css.icon}>edit</GFIcon>
                <span className={css.label}>Edit New Tab</span>
              </button>
            </div>
          </Section>
        </>
      )}
      {!error && editMode && <Navigate to={"./edit"} />}
      {error && <ErrorPage code={400} error="Error Loading New Tab" />}
      {!error && !linkData && <LoadingPage />}
    </>
  );
}

export function LinkItem(props: {
  link: LinkItemType;
  hasCMDKey: boolean;
  modifierPressed: boolean;
  index: number;
}) {
  // const matches = props.link.url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  // const domain = matches && matches[1];

  const url = isValidHttpUrl(props.link.url)
    ? new URL(props.link.url)
    : new URL("http://invalidurl"); // Fallback to http if no protocol is provided
  const hostname = url.hostname.replace(/^www\./, "");

  let shortcutIndex = props.index + 1;
  shortcutIndex === 10 && (shortcutIndex = 0); // Adjust for 0-based index

  return (
    <li
      className={
        css.linkItem + " " + (props.link.type === "wide" ? " " + css.wide : "")
      }
    >
      {shortcutIndex < 10 && (
        <>
          {!props.hasCMDKey && (
            <span
              className={
                css.editShortcut +
                (props.modifierPressed ? " " + css.modifier : "")
              }
            >
              Ctrl + {shortcutIndex}
            </span>
          )}
          {props.hasCMDKey && (
            <span
              className={
                css.editShortcut +
                (props.modifierPressed ? " " + css.modifier : "")
              }
            >
              ⌘ + {shortcutIndex}
            </span>
          )}
        </>
      )}
      <a
        href={props.link.url}
        style={{ "--_color": props.link.color } as React.CSSProperties}
        className={css.link}
      >
        <div className={css.background}>
          {props.link.background.type === "image" &&
          props.link.background.image ? (
            <img
              src={props.link.background.image}
              alt={props.link.title}
              className={css.backgroundImage}
            />
          ) : (
            <div
              className={css.backgroundColor}
              style={{ backgroundColor: props.link.background.color }}
            ></div>
          )}
        </div>
        <div className={css.iconWrapper}>
          <img
            src={
              props.link.icon
                ? props.link.icon
                : // : "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" +
                  //   props.link.url +
                  //   "&size=128"
                  "https://icon.horse/icon/" + hostname
            }
            alt={props.link.title}
            className={css.iconImage}
          />
        </div>
        {(props.link.showTitle === undefined ||
          props.link.showTitle === true) && (
          <span className={css.title}>{props.link.title}</span>
        )}
      </a>
      <span className={css.url}>
        {/* {domain !== null && domain.replace("www.", "")}
        {domain === null && props.link.url} */}
        {hostname}
      </span>
    </li>
  );
}

export function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
