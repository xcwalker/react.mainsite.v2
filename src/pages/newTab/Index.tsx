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
import tlds from "tlds";
import Logo from "../../components/Logo";
import { Navigate } from "react-router-dom";

const bangs = [
  { bang: "g", url: "https://www.google.com/search?q=%s", icon: "google" },
  { bang: "b", url: "https://www.bing.com/search?q=%s", icon: "bing" },
  {
    bang: "d",
    url: "https://duckduckgo.com/?q=%s",
    icon: "duckduckgo",
  },
  {
    bang: "w",
    url: "https://www.wikipedia.org/w/index.php?search=%s",
    icon: "wikipedia",
  },
  {
    bang: "y",
    url: "https://www.youtube.com/results?search_query=%s",
    icon: "youtube",
  },
  {
    bang: "m",
    url: "https://music.youtube.com/search?q=%s",
    icon: "youtube-music",
  },
  {
    bang: "t",
    url: "https://twitter.com/search?q=%s",
    icon: "twitter",
  },
  {
    bang: "r",
    url: "https://www.reddit.com/search?q=%s",
    icon: "reddit",
  },
  {
    bang: "i",
    url: "https://www.instagram.com/explore/tags/%s/",
    icon: "instagram",
  },
  {
    bang: "f",
    url: "https://www.facebook.com/search/top/?q=%s",
    icon: "facebook",
  },
  {
    bang: "l",
    url: "https://www.linkedin.com/search/results/all/?keywords=%s",
    icon: "linkedin",
  },
  {
    bang: "p",
    url: "https://www.pinterest.com/search/pins/?q=%s",
    icon: "pinterest",
  },
  {
    bang: "a",
    url: "https://www.amazon.com/s?k=%s",
    icon: "amazon",
  },
  {
    bang: "e",
    url: "https://www.ebay.com/sch/i.html?_nkw=%s",
    icon: "ebay",
  },
  {
    bang: "gplay",
    url: "https://play.google.com/store/search?q=%s",
    icon: "google-play",
  },
  {
    bang: "appstore",
    url: "https://www.apple.com/app-store/search/?q=%s",
    icon: "app-store",
  },
  {
    bang: "maps",
    url: "https://www.google.com/maps/search/%s",
    icon: "google-maps",
  },
  {
    bang: "news",
    url: "https://news.google.com/search?q=%s",
    icon: "google-news",
  },
  {
    bang: "docs",
    url: "https://www.google.com/search?q=%s&tbm=isch",
    icon: "google-docs",
  },
  {
    bang: "images",
    url: "https://www.google.com/search?q=%s&tbm=isch",
    icon: "google-images",
  },
  {
    bang: "mdn",
    url: "https://developer.mozilla.org/en-US/search?q=%s",
    icon: "mdn",
  },
  {
    bang: "github",
    url: "https://github.com/search?&type=repositorie&q=%s",
    icon: "github",
  },
  {
    bang: "npm",
    url: "https://www.npmjs.com/search?q=%s",
    icon: "npm",
  },
  {
    bang: "stackoverflow",
    url: "https://stackoverflow.com/search?q=%s",
    icon: "stackoverflow",
  },
  {
    bang: "use",
    url: "https://caniuse.com/?search=%s",
    icon: "caniuse",
  },
  {
    bang: "plex",
    url: "https://app.plex.tv/desktop/#!/search?pivot=top&query=%s",
    icon: "plex",
  },
  {
    bang: "drive",
    url: "https://drive.google.com/drive/search?q=%s",
    icon: "google-drive",
  }
];

export default function NewTab() {
  const user = useAuth(null);
  const [linkData, setLinkData] = useState<NewTabLinks | undefined>();
  const [error, setError] = useState(false);
  const [searchIsWebsite, setSearchIsWebsite] = useState(false);
  const [searchBang, setSearchBang] = useState<
    | undefined
    | {
        bang: string;
        url: string;
        icon: string;
      }
  >();
  const [editMode, setEditMode] = useState(false);
  const [hasCMDKey, setHasCMDKey] = useState(false);
  const [modifierPressed, setModifierPressed] = useState(false);

  useEffect(() => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    setHasCMDKey(isMac);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        setModifierPressed(true);

        if (e.key.toLowerCase() === "e") {
          e.preventDefault();
          setEditMode((prev) => !prev);
        } else if (e.key.toLowerCase() === "s") {
          e.preventDefault();
          const searchInput = document.querySelector(
            `.${css.searchInput}`
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
  }, [linkData?.links]);

  useEffect(() => {
    if (!user?.uid) {
      console.error("User not authenticated");
      return;
    }

    firebaseGetData("newtab", user?.uid).then((data) => {
      if (data === undefined) {
        console.error("User data not found");
        setError(true);
        return;
      }
      setLinkData(data as NewTabLinks);
      setError(false);
      return;
    });
    return () => {
      setLinkData(undefined);
      setError(false);
    };
  }, [user?.uid]);

  // focus on the search input when the component mounts
  useEffect(() => {
    const searchInput = document.querySelector(
      `.${css.searchInput}`
    ) as HTMLInputElement | null;

    if (searchInput) {
      searchInput.focus();
    }
  }, [linkData]);

  return (
    <>
      {!error && !editMode && (
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
                  <div className={css.searchWrapper}>
                    {!hasCMDKey && (
                      <span
                        className={
                          css.editShortcut +
                          (modifierPressed ? " " + css.modifier : "")
                        }
                      >
                        Ctrl + S
                      </span>
                    )}
                    {hasCMDKey && (
                      <span
                        className={
                          css.editShortcut +
                          (modifierPressed ? " " + css.modifier : "")
                        }
                      >
                        ⌘ + S
                      </span>
                    )}
                    {!searchIsWebsite && (
                      <img
                        src={
                          "/" +
                          (searchBang === undefined
                            ? linkData.settings.search.provider
                            : searchBang.icon) +
                          ".svg"
                        }
                        alt=""
                        className={css.icon}
                      />
                    )}
                    {searchIsWebsite && (
                      <GFIcon className={css.icon}>language</GFIcon>
                    )}
                    <input
                      type="text"
                      placeholder={
                        "Search " + linkData.settings.search.provider
                      }
                      className={css.searchInput}
                      onInput={(e) => {
                        const searchQuery = (e.target as HTMLInputElement)
                          .value;

                        if (
                          searchQuery.length !== 0 &&
                          (searchQuery.startsWith("http://") ||
                            searchQuery.startsWith("https://") ||
                            searchQuery.startsWith("www.") ||
                            tlds.some((tld: string) =>
                              searchQuery.endsWith("." + tld)
                            ))
                        ) {
                          setSearchIsWebsite(true);
                        } else {
                          setSearchIsWebsite(false);
                        }

                        // sorts bangs by bang length then finds the first bang that matches the search query
                        const bangMatch = bangs
                          .sort((a, b) => b.bang.length - a.bang.length)
                          .find((bang) =>
                            searchQuery.includes("!" + bang.bang)
                          );

                        if (bangMatch) {
                          setSearchBang(bangMatch);
                        } else {
                          setSearchBang(undefined);
                        }
                      }}
                      onKeyDown={(e) => {
                        const searchQuery = (e.target as HTMLInputElement)
                          .value;

                        if (e.key === "Enter") {
                          let searchUrl = "";

                          if (searchIsWebsite) {
                            searchUrl =
                              searchQuery.startsWith("http://") ||
                              searchQuery.startsWith("https://")
                                ? searchQuery
                                : "https://" + searchQuery;
                          } else if (searchBang !== undefined) {
                            searchUrl = searchBang.url.replace(
                              "%s",
                              encodeURIComponent(
                                searchQuery
                                  .replace("!" + searchBang.bang, "")
                                  .trim()
                              )
                            );
                          } else {
                            searchUrl =
                              linkData.settings.search.queryURL +
                              encodeURIComponent(searchQuery);
                          }

                          window.open(searchUrl, "_self");
                          (e.target as HTMLInputElement).value = "";
                          e.preventDefault();
                        }
                      }}
                    />
                    <button className={css.searchButton}>
                      <GFIcon>search</GFIcon>
                    </button>
                  </div>
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
                  css.editShortcut + (modifierPressed ? " " + css.modifier : "")
                }
              >
                Ctrl + E
              </span>
            )}
            {hasCMDKey && (
              <span
                className={
                  css.editShortcut + (modifierPressed ? " " + css.modifier : "")
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
      )}
      {!error && editMode && <Navigate to={"./edit"} />}
      {error && <ErrorPage code={400} error="Error Loading New Tab" />}
      {!error && !linkData && <LoadingPage />}
    </>
  );
}

function LinkItem(props: {
  link: LinkItemType;
  hasCMDKey: boolean;
  modifierPressed: boolean;
  index: number;
}) {
  const matches = props.link.url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  const domain = matches && matches[1];

  let shortcutIndex = props.index + 1;
  shortcutIndex === 10 && (shortcutIndex = 0); // Adjust for 0-based index

  return (
    <li className={props.link.type === "wide" ? " " + css.wide : ""}>
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
                : "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" +
                  props.link.url +
                  "&size=50"
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
        {domain !== null && domain.replace("www.", "")}
        {domain === null && props.link.url}
      </span>
    </li>
  );
}
