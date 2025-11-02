import { Fragment, useCallback, useEffect, useState } from "react";
import { Logos } from "./Logo";

import css from "../styles/components/header.module.css";
import radioCSS from "../styles/components/header/radio.module.css";
import GFIcon from "./GFIcon";
import { SocialsList } from "./Socials";
import Protect, { RoleProtect } from "./Security/Protect";
import { useAtom } from "jotai";
import { parseEntities } from "parse-entities";

import { RadioAtom } from "../App";
import Button from "./Button";
import { defaultNav, userSettingsType } from "../types";
import { useAuth } from "../functions/firebase/authentication/useAuth";
import firebaseGetRealtimeData from "../functions/firebase/storage/useRealtimeData";

export default function Header() {
  const currentUser = useAuth();
  const api = "https://apiv2.simulatorradio.com/metadata/combined";
  const [ticking] = useState(true);
  const [count, setCount] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);
  const [radio, setRadio] = useAtom(RadioAtom);

  const [navScrollLastKnown, setNavScrollLastKnown] = useState(0);

  const audio = document.querySelector("audio#audioPlayer") as HTMLAudioElement;

  const [nav, setNav] = useState(defaultNav);
  const [showSocials, setShowSocials] = useState(true);
  const [userSettings, setUserSettings] = useState<userSettingsType | null>(
    null
  );

  useEffect(() => {
    if (!currentUser) {
      setNav(defaultNav);
      return;
    }

    firebaseGetRealtimeData(
      "settings",
      currentUser.uid,
      setUserSettings as React.Dispatch<React.SetStateAction<unknown>>
    );
  }, [currentUser]);

  useEffect(() => {
    if (userSettings?.navigation) {
      setNav(userSettings.navigation);
    }

    if (userSettings?.navigationShowSocials !== undefined) {
      setShowSocials(userSettings?.navigationShowSocials);
    }
  }, [userSettings]);

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
    console.log("Radio state changed:", radio.state, radio.tabID, audio);
    if (!audio || radio.tabID === "") return;

    if (radio.state === "playing") {
      if (
        audio.src === "https://stream.simulatorradio.com/320" &&
        !audio.paused
      ) {
        audio.muted = false;
        return;
      } else {
        audio.src = "https://stream.simulatorradio.com/320";
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
          setRadio((prev) => ({ ...prev, state: "paused" }));
        });
        audio.muted = false;
      }
    } else if (radio.state === "paused") {
      audio.pause();
      audio.src = "";
    }
  }, [audio, radio.state, radio.tabID, setRadio]);

  //audio volume set
  useEffect(() => {
    if (!audio) return;

    audio.volume = radio.volume / 100;
  }, [audio, radio.volume]);

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
      // devConsole.log(document.body.getBoundingClientRect().top)
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
        <Logos.xcwalkeruk className={css.svg} />
        <Logos.x className={css.svgSmall} />
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
          {nav &&
            nav.map((set, index) => {
              return (
                <Fragment key={index}>
                  {!set.hideTitle && (
                    <span className={css.listTitle}>{set.title}</span>
                  )}
                  <ul className={css.links}>
                    {set.items.map((item, index) => {
                      if (
                        item.devOnly &&
                        import.meta.env.MODE !== "development"
                      )
                        return null;
                      else if (item.requireVerified) {
                        return (
                          <Fragment key={index}>
                            <RoleProtect staffOnly redirect={<></>}>
                              <Button
                                {...item}
                                icon={{
                                  gficon: item.gficon,
                                  gfClassName: css.icon,
                                }}
                                hidden={
                                  item.hidden ? "siteNavigation" : undefined
                                }
                                isBeta={item.isBeta}
                                betaTagClassName={css.betaTag}
                              >
                                <span className={css.title}>{item.title}</span>
                              </Button>
                            </RoleProtect>
                          </Fragment>
                        );
                      } else if (item.requireUser)
                        return (
                          <Fragment key={index}>
                            <Protect>
                              <Button
                                {...item}
                                icon={{
                                  gficon: item.gficon,
                                  gfClassName: css.icon,
                                }}
                                hidden={
                                  item.hidden ? "siteNavigation" : undefined
                                }
                                isBeta={item.isBeta}
                                betaTagClassName={css.betaTag}
                              >
                                <span className={css.title}>{item.title}</span>
                              </Button>
                            </Protect>
                          </Fragment>
                        );
                      else if (item.requireUser === false)
                        return (
                          <Fragment key={index}>
                            <Protect isLoginPage>
                              <Button
                                {...item}
                                icon={{
                                  gficon: item.gficon,
                                  gfClassName: css.icon,
                                }}
                                hidden={
                                  item.hidden ? "siteNavigation" : undefined
                                }
                                isBeta={item.isBeta}
                                betaTagClassName={css.betaTag}
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
                            icon={{
                              gficon: item.gficon,
                              gfClassName: css.icon,
                            }}
                            hidden={item.hidden ? "siteNavigation" : undefined}
                            isBeta={item.isBeta}
                            betaTagClassName={css.betaTag}
                          >
                            <span className={css.title}>{item.title}</span>
                          </Button>
                        </Fragment>
                      );
                    })}
                  </ul>
                </Fragment>
              );
            })}
          {showSocials && (
            <>
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
            </>
          )}
        </nav>
        {radio.inSidebar && <Radio />}
      </div>
      {!radio.inSidebar && <Radio />}
    </header>
  );
}

function Radio() {
  const [radio, setRadio] = useAtom(RadioAtom);
  const [showRadioVolume, setShowRadioVolume] = useState(false);

  return (
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
          <span className={radioCSS.title}>{parseEntities(radio.dj.name)}</span>
          <span className={radioCSS.subTitle}>
            {parseEntities(radio.dj.show)}
          </span>
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
        <img src={radio.nowPlaying.artwork} alt="" className={radioCSS.image} />
        <div
          className={
            radioCSS.text
            // + " " + (showRadioVolume ? radioCSS.hidden : "")
          }
        >
          <span className={radioCSS.title}>
            {parseEntities(radio.nowPlaying.title)}
          </span>
          <span className={radioCSS.subTitle}>
            {parseEntities(radio.nowPlaying.artist)}
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
            title={radio.inSidebar ? "Move out of sidebar" : "Move to sidebar"}
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
//       // devConsole.log(document.body.getBoundingClientRect().top)
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
