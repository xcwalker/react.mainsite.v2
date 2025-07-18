import { Fragment, useCallback, useEffect, useState } from "react";
import Logo from "./Logo";

import css from "../styles/components/header.module.css";
import radioCSS from "../styles/components/header/radio.module.css";
import GFIcon from "./GFIcon";
import { SocialsList } from "./Socials";
import Protect from "./Security/Protect";
import { useAtom } from "jotai";

import { RadioAtom } from "../App";
import Button from "./Button";

const navItems = [
  {
    title: "New Tab",
    href: "/newtab",
    gficon: "new_window",
    hidden: true,
  },
  {
    title: "home",
    href: "",
    gficon: "home",
  },
  {
    title: "Projects",
    href: "projects",
    gficon: "design_services",
  },
  {
    title: "Blog",
    href: "blog",
    gficon: "text_snippet",
  },
  {
    title: "Recipes",
    href: "recipes",
    gficon: "stockpot",
  },
  {
    title: "Albums",
    href: "albums",
    gficon: "image",
  },
  {
    title: "Fleet",
    href: "vehicles",
    gficon: "directions_car",
  },
  {
    title: "Profile",
    href: "user",
    gficon: "person",
    requireUser: true,
  },
  {
    title: "dashboard",
    href: "dashboard",
    gficon: "dashboard",
    requireUser: true,
  },
  {
    title: "account",
    href: "account",
    gficon: "settings",
  },
  {
    title: "Contact",
    href: "ticket",
    gficon: "contact_support",
  },
];

const navItemsSites = [
  {
    title: "Immersion",
    href: "https://immersion.xcwalker.dev/",
    gficon: "grid_view",
    // iconURL:
    // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Immersion.svg",
  },
  {
    title: "Searrson",
    href: "https://searrson.xcwalker.dev/",
    gficon: "wallpaper_slideshow",
    // iconURL:
    // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Searrson.svg",
  },
  {
    title: "Therwim",
    href: "https://therwim.xcwalker.dev/",
    gficon: "web",
    // iconURL:
    // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Therwim.svg",
  },
];

const rrItemsSites = [
  {
    title: "Desktop",
    href: "https://reactradio.dev/",
    gficon: "desktop_windows",
    // iconURL:
    // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Immersion.svg",
  },
  {
    title: "Mobile",
    href: "https://mobile.reactradio.dev/",
    gficon: "smartphone",
    // iconURL:
    // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Searrson.svg",
  },
  {
    title: "Legacy",
    href: "https://legacy.reactradio.dev/",
    gficon: "devices",
    // iconURL:
    // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Therwim.svg",
  },
];

export default function Header() {
  const api = "https://apiv2.simulatorradio.com/metadata/combined";
  const [ticking] = useState(true);
  const [count, setCount] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);

  const [navScrollLastKnown, setNavScrollLastKnown] = useState(0);
  const [radio, setRadio] = useAtom(RadioAtom);
  const [showRadioVolume, setShowRadioVolume] = useState(false);

  const audio = document.querySelector("audio#audioPlayer") as HTMLAudioElement;

  useEffect(() => {
    if (fetching || fetchCount === count) return;
    setFetching(true);

    fetch(api)
      .then(
        (data) => {
          data.json().then((res) => {
            const outNow = {
              title: "",
              artist: "",
              artwork: "",
            };

            if (res?.now_playing?.title) {
              outNow.title = res?.now_playing?.title;
            } else if (res?.title) {
              outNow.title = res.title;
            } else if (res?.data?.title) {
              outNow.title = res.data.title;
            } else {
              outNow.title = "";
            }

            if (res?.now_playing?.artists) {
              outNow.artist = res?.now_playing?.artists;
            } else if (res?.artist) {
              outNow.artist = res.artist;
            } else if (res?.data?.artist) {
              outNow.artist = res.data.artist;
            } else {
              outNow.artist = "";
            }

            if (res?.now_playing?.art) {
              outNow.artwork = res?.now_playing?.art;
            } else if (res?.art?.large) {
              outNow.artwork = res.art.large;
            } else if (res?.data?.album_art) {
              outNow.artwork = res.data.album_art;
            } else {
              outNow.artwork = "";
            }

            if (outNow.title === radio.nowPlaying.title) {
              return;
            }

            const outDJ = {
              name: "",
              show: "",
              image: "",
            };

            if (res?.djs?.now?.displayname) {
              outDJ.name = res.djs.now.displayname;
            }

            if (res?.djs?.now?.avatar) {
              outDJ.image =
                "https://simulatorradio.com/processor/avatar?size=256&name=" +
                res.djs.now.avatar;
            }

            if (res?.djs?.now?.details) {
              outDJ.show = res.djs.now.details;
            }

            setRadio((radio) => ({ ...radio, nowPlaying: outNow, dj: outDJ }));
          });
        },
        (error) => {
          console.error(error);
        }
      )
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setFetching(false);
        setFetchCount(count);
      });
  }, [count, fetching, fetchCount, api, setRadio, radio.nowPlaying.title]);

  useEffect(() => {
    const timer = setTimeout(
      () => ticking && setCount(count + 1),
      Math.min(6000, count * 1000)
    );

    return () => {
      clearTimeout(timer);
    };
  }, [count, ticking]);

  useEffect(() => {
    if (!audio) return;

    if (radio.state === "playing") {
      audio.src = "https://stream.simulatorradio.com/320";
      audio.play();
    } else if (radio.state === "paused") {
      audio.pause();
      audio.src = "";
    }
  }, [audio, radio.state]);

  const navScroll = useCallback(() => {
    if (navScrollLastKnown === window.scrollY) return;

    if (window.scrollY > navScrollLastKnown) {
      document.body.classList.remove("scrolledUp");
    } else if (window.scrollY < navScrollLastKnown - 5) {
      document.body.classList.add("scrolledUp");
    }

    setNavScrollLastKnown(window.scrollY);

    if (document.body.getBoundingClientRect().top >= 0) {
      document.body.classList.remove("scrolled");
    } else if (document.body.getBoundingClientRect().top < 0) {
      // console.log(document.body.getBoundingClientRect().top)
      document.body.classList.add("scrolled");
    }
  }, [navScrollLastKnown]);

  useEffect(() => {
    document.addEventListener("scroll", navScroll);

    return () => {
      document.removeEventListener("scroll", navScroll);
    };
  }, [navScroll]);

  return (
    <header className={css.header} id="header">
      <div className={css.container}>
        <Logo type="xcwalker" className={css.svg} />
        <Logo type="x" className={css.svgSmall} />
        <Button
          href="#main"
          className={css.skip}
          title="Jump to content"
          pageNavigation
          hidden="pageNavigation"
        >
          Jump to content
        </Button>
        <Button
          href="#player"
          className={css.skip}
          title="Jump to player"
          pageNavigation
          hidden="pageNavigation"
        >
          Jump to Player
        </Button>
        <nav>
          <ul className={css.links}>
            {navItems &&
              navItems.map((item, index) => {
                if (item.requireUser)
                  return (
                    <Fragment key={index}>
                      <Protect>
                        <Button
                          {...item}
                          icon={{ gficon: item.gficon, gfClassName: css.icon }}
                          hidden={item.hidden ? "siteNavigation" : undefined}
                        >
                          <span className={css.title}>{item.title}</span>
                        </Button>
                      </Protect>
                    </Fragment>
                  );
                return (
                  <Fragment key={index}>
                    <Button
                      {...item}
                      icon={{ gficon: item.gficon, gfClassName: css.icon }}
                      hidden={item.hidden ? "siteNavigation" : undefined}
                    >
                      <span className={css.title}>{item.title}</span>
                    </Button>
                  </Fragment>
                );
              })}
          </ul>
          <span className={css.listTitle}>Sites</span>
          <ul className={css.links}>
            {navItemsSites &&
              navItemsSites.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <Button
                      {...item}
                      icon={{ gficon: item.gficon, gfClassName: css.icon }}
                      external
                      externalClassName={css.external}
                    >
                      <span className={css.title}>{item.title}</span>
                    </Button>
                  </Fragment>
                );
              })}
          </ul>
          <span className={css.listTitle}>ReactRadio</span>
          <ul className={css.links}>
            {rrItemsSites &&
              rrItemsSites.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <Button
                      {...item}
                      icon={{ gficon: item.gficon, gfClassName: css.icon }}
                      external
                      externalClassName={css.external}
                    >
                      <span className={css.title}>{item.title}</span>
                    </Button>
                  </Fragment>
                );
              })}
          </ul>
          <span className={css.listTitle}>Socials</span>
          <SocialsList
            listClassName={css.links}
            buttonClassName={css.link}
            iconClassName={css.icon}
            externalClassName={css.external}
            contentClassName={css.content}
            textClassName={css.title}
            useUnstyledButton
          />
        </nav>
        <div
          className={
            radioCSS.radio +
            " " +
            (radio.inSidebar ? radioCSS.inSidebar : "") +
            " " +
            (radio.showDJ ? radioCSS.showDJ : "")
          }
          id="player"
        >
          <div
            className={
              radioCSS.volume + " " + (showRadioVolume ? radioCSS.show : "")
            }
          >
            <input
              type="range"
              name=""
              id=""
              value={radio.volume}
              min={0}
              max={100}
              step={1}
              onChange={(e) => {
                setRadio({
                  ...radio,
                  volume: parseInt(e.target.value),
                });
                const audio = document.querySelector("audio");
                if (audio) {
                  audio.volume = parseInt(e.target.value) / 100;
                }
              }}
              onLoad={() => {
                const audio = document.querySelector("audio");
                if (audio) {
                  audio.volume = radio.volume / 100;
                }
              }}
              title="Volume"
            />
          </div>
          <div className={radioCSS.dj + " " + radioCSS.container}>
            <img src={radio.dj.image} alt="" className={radioCSS.background} />
            <img src={radio.dj.image} alt="" className={radioCSS.image} />
            <div className={radioCSS.text}>
              <span className={radioCSS.title}>{radio.dj.name}</span>
              <span className={radioCSS.subTitle}>{radio.dj.show}</span>
            </div>
            <div className={radioCSS.controls}>
              <button
                onClick={() => {
                  setRadio({
                    ...radio,
                    showDJ: false,
                  });
                }}
              >
                <GFIcon>keyboard_arrow_down</GFIcon>
              </button>
            </div>
          </div>
          <div className={radioCSS.nowPlaying + " " + radioCSS.container}>
            <img
              src={radio.nowPlaying.artwork}
              alt=""
              className={radioCSS.background}
            />
            <img
              src={radio.nowPlaying.artwork}
              alt=""
              className={radioCSS.image}
            />
            <div
              className={
                radioCSS.text
                // + " " + (showRadioVolume ? radioCSS.hidden : "")
              }
            >
              <span className={radioCSS.title}>{radio.nowPlaying.title}</span>
              <span className={radioCSS.subTitle}>
                {radio.nowPlaying.artist}
              </span>
            </div>
            <div className={radioCSS.controls}>
              <button
                onClick={() => {
                  setRadio({
                    ...radio,
                    state: radio.state === "playing" ? "paused" : "playing",
                  });
                }}
                title={radio.state === "playing" ? "Pause" : "Play"}
              >
                <GFIcon>
                  {radio.state === "playing" ? "pause" : "play_arrow"}
                </GFIcon>
              </button>
              {/* volume control */}
              <button
                onClick={() => {
                  setShowRadioVolume(!showRadioVolume);
                }}
                title="Volume"
                tabIndex={-1}
              >
                <GFIcon>volume_up</GFIcon>
              </button>
              <button
                onClick={() => {
                  setRadio({
                    ...radio,
                    inSidebar: !radio.inSidebar,
                  });
                }}
                title={
                  radio.inSidebar ? "Move out of sidebar" : "Move to sidebar"
                }
              >
                {radio.inSidebar && <GFIcon>keyboard_arrow_right</GFIcon>}
                {!radio.inSidebar && <GFIcon>keyboard_arrow_left</GFIcon>}
              </button>
              {!radio.showDJ && !radio.inSidebar && (
                <button
                  onClick={() => {
                    setRadio({
                      ...radio,
                      showDJ: true,
                    });
                  }}
                  title="Show DJ"
                >
                  <GFIcon>keyboard_arrow_up</GFIcon>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// function Unused() {
//   const [navScrollLastKnown, setNavScrollLastKnown] = useState(0);
//
//   const navScroll = useCallback(() => {
//     if (navScrollLastKnown === window.scrollY) return;
//
//     if (window.scrollY > navScrollLastKnown) {
//       document.body.classList.remove("scrolledUp");
//     } else if (window.scrollY < navScrollLastKnown - 25) {
//       document.body.classList.add("scrolledUp");
//     }
//
//     setNavScrollLastKnown(window.scrollY);
//
//     if (document.body.getBoundingClientRect().top >= 0) {
//       document.body.classList.remove("scrolled");
//     } else if (document.body.getBoundingClientRect().top < 0) {
//       // console.log(document.body.getBoundingClientRect().top)
//       document.body.classList.add("scrolled");
//     }
//   }, [navScrollLastKnown]);
//
//   useEffect(() => {
//     document.addEventListener("scroll", navScroll);
//
//     return () => {
//       document.removeEventListener("scroll", navScroll);
//     };
//   }, [navScroll]);
// }
