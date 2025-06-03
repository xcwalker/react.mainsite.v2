import { useEffect, useState } from "react";
import Section from "../components/Section";
import SidebarUser from "../components/SidebarUser";
import { useAuth } from "../functions/firebase/authentication/useAuth";

import css from "../styles/pages/newTab.module.css";
import firebaseGetData from "../functions/firebase/storage/getData";
import { LinkItem as LinkItemType, NewTabLinks } from "../types";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../components/Loading";
import GFIcon from "../components/GFIcon";

export default function NewTab() {
  const user = useAuth(null);
  const [linkData, setLinkData] = useState<NewTabLinks | undefined>();
  const [error, setError] = useState(false);

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

  return (
    <>
      {!error && (
        <Section
          id="new-tab"
          className={css.newTab}
          container={{ className: css.container }}
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
              <div className={css.search}>
                {linkData.settings.showSearch && (
                  <div className={css.searchWrapper}>
                    <img
                      src={"/" + linkData.settings.search.provider + ".svg"}
                      alt=""
                      className={css.icon}
                    />
                    <input
                      type="text"
                      placeholder={
                        "Search " + linkData.settings.search.provider
                      }
                      className={css.searchInput}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const searchQuery = (e.target as HTMLInputElement)
                            .value;
                          const searchUrl =
                            linkData.settings.search.queryURL +
                            encodeURIComponent(searchQuery);

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
                  <LinkItem key={index} link={link} />
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}
      {error && <ErrorPage code={400} error="Error Loading New Tab" />}
      {!error && !linkData && <LoadingPage />}
    </>
  );
}

function LinkItem(props: { link: LinkItemType }) {
  const matches = props.link.url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  const domain = matches && matches[1];
  return (
    <li>
      <a
        href={props.link.url}
        target="_blank"
        rel="noopener noreferrer"
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
        <span className={css.title}>{props.link.title}</span>
        <span className={css.url}>
          {domain !== null && domain.replace("www.", "")}
          {domain === null && props.link.url}
        </span>
      </a>
    </li>
  );
}
