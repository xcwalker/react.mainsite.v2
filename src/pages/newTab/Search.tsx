import { useEffect, useState } from "react";
import css from "../../styles/pages/newTab/search.module.css";
import GFIcon from "../../components/GFIcon";
import tlds from "tlds";

export function NewTabSearch(props: {
  hasCMDKey: boolean;
  modifierPressed: boolean;
  searchProvider: string;
  queryURL: string;
}) {
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
      url: "https://www.amazon.co.uk/s?k=%s",
      icon: "amazon",
    },
    {
      bang: "aus",
      url: "https://www.amazon.com/s?k=%s",
      icon: "amazon.us",
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
    },
  ];

  const autoCompleteAPI =
    "https://proxy.corsfix.com/?https://suggestqueries.google.com/complete/search?client=chrome&output=toolbar&hl=en&q=";

  const [searchIsWebsite, setSearchIsWebsite] = useState(false);
  const [searchBang, setSearchBang] = useState<
    | undefined
    | {
        bang: string;
        url: string;
        icon: string;
      }
  >();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<
    { suggestion: string; type: string }[]
  >([]);

  useEffect(() => {
    if (search.length === 0) {
      setSuggestions([]);
    }

    const controller = new AbortController();
    const fetchSuggestions = async () => {
      if (search) {
        const response = await fetch(
          autoCompleteAPI + encodeURIComponent(search),
          { signal: controller.signal }
        );
        const data = await response.json();
        console.log(data);
        setSuggestions(
          data[1].map((item: string, index: number) => ({
            suggestion: item,
            type: data[4]["google:suggesttype"][index],
          }))
        );
      }
    };

    fetchSuggestions();

    return () => {
      setSuggestions([]);
      controller.abort();
    };
  }, [search]);

  return (
    <div className={css.searchWrapper}>
      {!props.hasCMDKey && (
        <span
          className={
            css.editShortcut + (props.modifierPressed ? " " + css.modifier : "")
          }
        >
          Ctrl + S
        </span>
      )}
      {props.hasCMDKey && (
        <span
          className={
            css.editShortcut + (props.modifierPressed ? " " + css.modifier : "")
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
              ? props.searchProvider
              : searchBang.icon) +
            ".svg"
          }
          alt=""
          className={css.icon}
        />
      )}
      {searchIsWebsite && <GFIcon className={css.icon}>language</GFIcon>}
      <input
        type="text"
        placeholder={"Search " + props.searchProvider}
        className={css.searchInput}
        id="searchInput"
        onInput={(e) => {
          const searchQuery = (e.target as HTMLInputElement).value;

          if (
            searchQuery.length !== 0 &&
            (searchQuery.startsWith("http://") ||
              searchQuery.startsWith("https://") ||
              searchQuery.startsWith("www.") ||
              tlds.some((tld: string) => searchQuery.endsWith("." + tld)))
          ) {
            setSearchIsWebsite(true);
          } else {
            setSearchIsWebsite(false);
          }

          // sorts bangs by bang length then finds the first bang that matches the search query
          const bangMatch = bangs
            .sort((a, b) => b.bang.length - a.bang.length)
            .find((bang) =>
              searchQuery.toLowerCase().includes("!" + bang.bang)
            );

          if (bangMatch) {
            setSearchBang(bangMatch);
          } else {
            setSearchBang(undefined);
          }
        }}
        onKeyDown={(e) => {
          const searchQuery = (e.target as HTMLInputElement).value;

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
                  searchQuery.replace("!" + searchBang.bang, "").trim()
                )
              );
            } else {
              searchUrl = props.queryURL + encodeURIComponent(searchQuery);
            }

            window.open(searchUrl, "_self");
            (e.target as HTMLInputElement).value = "";
            e.preventDefault();
          }
        }}
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <button className={css.searchButton}>
        <GFIcon>search</GFIcon>
      </button>
      {suggestions.length > 0 && (
        <div className={css.suggestionsBox}>
          {suggestions.length > 0 &&
            suggestions.map((suggestion, index) => {
              if (index < 5)
                return (
                  <a
                    key={index}
                    href={
                      suggestion.type === "NAVIGATION"
                        ? suggestion.suggestion
                        : props.queryURL +
                          encodeURIComponent(suggestion.suggestion)
                    }
                  >
                    {suggestion.type === "QUERY" && (
                      <img
                        src={
                          "/" +
                          (searchBang === undefined
                            ? props.searchProvider
                            : searchBang.icon) +
                          ".svg"
                        }
                        alt=""
                        className={css.icon}
                      />
                    )}
                    {suggestion.type === "NAVIGATION" && (
                      <GFIcon className={css.icon}>language</GFIcon>
                    )}
                    <div className={css.suggestion}>
                      {suggestion.suggestion}
                    </div>
                  </a>
                );
              else return null;
            })}
        </div>
      )}
    </div>
  );
}