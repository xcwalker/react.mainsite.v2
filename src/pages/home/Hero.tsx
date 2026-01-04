import React, { Fragment, useEffect, useState } from "react";
import GFIcon from "../../components/GFIcon";
import { Logos } from "../../components/Logo";
import Section from "../../components/Section";

import css from "../../styles/pages/home/hero/slideshow.module.css";
import defaultHeroCSS from "../../styles/pages/home/hero/defaultHero.module.css";
import christmasHeroCSS from "../../styles/pages/home/hero/christmasHero.module.css";
import boxingDayHeroCSS from "../../styles/pages/home/hero/boxingDayHero.module.css";
import newYearHeroCSS from "../../styles/pages/home/hero/newYearHero.module.css";
import halloweenHeroCSS from "../../styles/pages/home/hero/halloweenHero.module.css";
import birthdayHeroCSS from "../../styles/pages/home/hero/birthdayHero.module.css";
import noKingsHeroCSS from "../../styles/pages/home/hero/noKingsHero.module.css";
import { Link } from "react-router-dom";

export default function HomeHero(props: {
  logo?: {
    src: string;
    onDark: string;
    onLight: string;
  };
  showHero: boolean;
}) {
  const date = new Date();
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const slideshowItems = [
    {
      id: 2,
      component: <ChristmasHero {...props} />,
      dateRange: {
        start: new Date(date.getFullYear() + "-12-01"),
        end: new Date(date.getFullYear() + "-12-25 23:59:59"),
      },
    },
    {
      id: 3,
      component: <HalloweenHero {...props} />,
      dateRange: {
        start: new Date(date.getFullYear() + "-10-01"),
        end: new Date(date.getFullYear() + "-10-31 23:59:59"),
      },
    },
    {
      id: 4,
      component: <NewYearsHero {...props} />,
      dateRange: {
        start: new Date(
          (date.getMonth() !== 0
            ? date.getFullYear()
            : date.getFullYear() - 1) + "-12-31"
        ),
        end: new Date(
          (date.getMonth() !== 0
            ? date.getFullYear() + 1
            : date.getFullYear()) + "-01-01 23:59:59"
        ),
      },
    },
    {
      id: 5,
      component: <BoxingDaysHero {...props} />,
      dateRange: {
        start: new Date(date.getFullYear() + "-12-26"),
        end: new Date(date.getFullYear() + "-12-26 23:59:59"),
      },
    },
    {
      id: 6,
      component: <BirthdayHero {...props} />,
      dateRange: {
        start: new Date(date.getFullYear() + "-11-27"),
        end: new Date(date.getFullYear() + "-11-27 23:59:59"),
      },
    },
    {
      id: 1,
      component: <NoKingsHero {...props} />,
    },
    {
      id: 1,
      component: <DefaultHero {...props} />,
    },
  ];

  const slideshowActive = slideshowItems
    .filter((item) => {
      if (import.meta.env.VITE_IS_DEBUG_ALL_HEROS === "true") return true;
      return item.dateRange
        ? date >= item.dateRange?.start && date <= item.dateRange?.end
        : true;
    })
    .map((item) => item.id);

  useEffect(() => {
    if (userInteracted) return;

    // Move through slideshow every 10 seconds
    const interval = setInterval(() => {
      setSlideshowIndex((prev) => {
        return (prev + 1) % slideshowActive.length;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [slideshowActive.length, userInteracted]);

  const handleUserInteraction = () => {
    setUserInteracted(true);
  };

  useEffect(() => {
    if (!userInteracted) return;

    const timeout = setTimeout(() => {
      setUserInteracted(false);
    }, 20000); // 20 seconds of inactivity resets to auto slideshow

    return () => clearTimeout(timeout);
  }, [userInteracted]);

  if (props?.showHero === false) {
    return <></>;
  }

  return (
    <>
      <Section
        id="hero"
        className={css.slideshow}
        container={{ className: css.container }}
      >
        <div
          className={css.heros}
          style={{
            transform: `translateX(calc(-${slideshowIndex * 100}% - ${
              slideshowIndex * 0.5
            }rem))`,
          }}
        >
          {slideshowItems.map((item, index) => {
            const isActive = index === slideshowIndex;

            let isVisible = item.dateRange
              ? date >= item.dateRange?.start && date <= item.dateRange?.end
              : true;

            if (import.meta.env.VITE_IS_DEBUG_ALL_HEROS === "true") {
              isVisible = true;
            }

            return (
              <Fragment key={index}>
                {isVisible && (
                  <section
                    className={`${css.hero} ${isActive ? css.active : ""}`}
                  >
                    {React.cloneElement(item.component, { isActive: isActive })}
                  </section>
                )}
              </Fragment>
            );
          })}
        </div>
        <div className={css.buttons}>
          <button
            type="button"
            onClick={() => {
              setSlideshowIndex((prev) => {
                return Math.max(prev - 1, 0);
              });
              handleUserInteraction();
            }}
            className={css.left}
            disabled={slideshowIndex === 0}
          >
            <GFIcon>arrow_left</GFIcon>
          </button>
          <button
            type="button"
            onClick={() => {
              setSlideshowIndex((prev) => {
                return Math.min(prev + 1, slideshowActive.length - 1);
              });
              handleUserInteraction();
            }}
            className={css.right}
            disabled={slideshowIndex === slideshowActive.length - 1}
          >
            <GFIcon>arrow_right</GFIcon>
          </button>
        </div>
        <div className={css.dots}>
          {slideshowActive.map((_item, index) => {
            return (
              <div
                key={index}
                className={`${css.dot} ${
                  index === slideshowIndex ? css.active : ""
                } ${userInteracted ? css.userInteracted : css.timed}`}
                onClick={() => {
                  setSlideshowIndex(index);
                  handleUserInteraction();
                }}
              />
            );
          })}
        </div>
      </Section>
    </>
  );
}

function DefaultHero(props: {
  logo?: { src: string; onDark: string; onLight: string };
}) {
  return (
    <div className={defaultHeroCSS.container}>
      <img src="/background.svg" alt="" className={defaultHeroCSS.background} />
      <div className={defaultHeroCSS.backdrop}></div>
      {!props.logo && <Logos.xcwalkeruk className={defaultHeroCSS.logo} />}
      {props.logo && (
        <img
          src={props.logo.onLight}
          alt="Organization Logo"
          className={defaultHeroCSS.logo}
        />
      )}
    </div>
  );
}

function NewYearsHero(props: {
  isActive?: boolean;
  logo?: { src: string; onDark: string; onLight: string };
}) {
  return (
    <div className={newYearHeroCSS.container}>
      <img
        src="/newyear_background.svg"
        alt=""
        className={newYearHeroCSS.background}
      />
      <div className={defaultHeroCSS.backdrop} />
      {!props.logo && <Logos.xcwalkeruk className={newYearHeroCSS.logo} />}
      {props.logo && (
        <img
          src={props.logo.onDark}
          alt="Organization Logo"
          className={newYearHeroCSS.logo}
        />
      )}
      <h1 className={newYearHeroCSS.heading}>Happy New Year</h1>
      <Link
        to="https://www.freepik.com/free-vector/festive-firework-abstract-background_4429603.htm"
        className={defaultHeroCSS.attribution}
        aria-hidden={!props.isActive}
        tabIndex={props.isActive ? 0 : -1}
      >
        Wallpaper from Freepik
      </Link>
    </div>
  );
}

function BoxingDaysHero(props: {
  isActive?: boolean;
  logo?: { src: string; onDark: string; onLight: string };
}) {
  return (
    <div className={boxingDayHeroCSS.container}>
      <img
        src="/boxingDay_background.svg"
        alt=""
        className={boxingDayHeroCSS.background}
      />
      <div className={defaultHeroCSS.backdrop} />
      {!props.logo && <Logos.xcwalkeruk className={boxingDayHeroCSS.logo} />}
      {props.logo && (
        <img
          src={props.logo.onDark}
          alt="Organization Logo"
          className={boxingDayHeroCSS.logo}
        />
      )}
      <h1 className={boxingDayHeroCSS.heading}>Happy Boxing Day</h1>
      <Link
        to="https://www.freepik.com/free-vector/festive-firework-abstract-background_4429603.htm"
        className={defaultHeroCSS.attribution}
        aria-hidden={!props.isActive}
        tabIndex={props.isActive ? 0 : -1}
      >
        Wallpaper from Freepik
      </Link>
    </div>
  );
}

function ChristmasHero(props: {
  isActive?: boolean;
  logo?: { src: string; onDark: string; onLight: string };
}) {
  return (
    <div className={christmasHeroCSS.container}>
      <img
        src="/christmas_background.svg"
        alt=""
        className={defaultHeroCSS.background}
      />
      <div className={defaultHeroCSS.backdrop} />
      {!props.logo && <Logos.xcwalkeruk className={christmasHeroCSS.logo} />}
      {props.logo && (
        <img
          src={props.logo.onDark}
          alt="Organization Logo"
          className={christmasHeroCSS.logo}
        />
      )}
      <h1 className={christmasHeroCSS.heading}>Merry Christmas</h1>
      <Link
        to="https://www.vecteezy.com/vector-art/7718340-hand-drawn-christmas-pattern-design-background"
        className={defaultHeroCSS.attribution}
        aria-hidden={!props.isActive}
        tabIndex={props.isActive ? 0 : -1}
      >
        Wallpaper from Vecteezy
      </Link>
    </div>
  );
}

function HalloweenHero(props: {
  isActive?: boolean;
  logo?: { src: string; onDark: string; onLight: string };
}) {
  return (
    <div className={halloweenHeroCSS.container}>
      <img
        src="/halloween_background.svg"
        alt=""
        className={defaultHeroCSS.background}
      />
      <div className={defaultHeroCSS.backdrop} />
      {!props.logo && <Logos.xcwalkeruk className={halloweenHeroCSS.logo} />}
      {props.logo && (
        <img
          src={props.logo.onLight}
          alt="Organization Logo"
          className={halloweenHeroCSS.logo}
        />
      )}
      <h1 className={halloweenHeroCSS.heading}>Happy Halloween</h1>
      <Link
        to="https://www.vecteezy.com/vector-art/11356859-seamless-happy-halloween-vector-background-illustration-with-haunted-mansion-full-moon-haunted-tree-ghosts-and-pumpkins-horizontally-repeatable"
        className={defaultHeroCSS.attribution}
        aria-hidden={!props.isActive}
        tabIndex={props.isActive ? 0 : -1}
      >
        Wallpaper from Vecteezy
      </Link>
    </div>
  );
}

function BirthdayHero(props: {
  isActive?: boolean;
  logo?: { src: string; onDark: string; onLight: string };
}) {
  return (
    <div className={birthdayHeroCSS.container}>
      <img
        src="/birthday_background.svg"
        alt=""
        className={defaultHeroCSS.background}
      />
      <div className={defaultHeroCSS.backdrop} />
      {!props.logo && <Logos.xcwalkeruk className={birthdayHeroCSS.logo} />}
      {props.logo && (
        <img
          src={props.logo.onLight}
          alt="Organization Logo"
          className={birthdayHeroCSS.logo}
        />
      )}
      <h1 className={birthdayHeroCSS.heading}>Oh god, I'm old.</h1>
      <Link
        to="https://www.freepik.com/free-vector/hand-drawn-colorful-birthday-background_18775765.htm"
        className={defaultHeroCSS.attribution}
        aria-hidden={!props.isActive}
        tabIndex={props.isActive ? 0 : -1}
      >
        Wallpaper from Freepik
      </Link>
    </div>
  );
}

function NoKingsHero(props: {
  isActive?: boolean;
  logo?: { src: string; onDark: string; onLight: string };
}) {
  return (
    <div className={noKingsHeroCSS.container}>
      <img
        src="/NoKingsBackground.png"
        alt=""
        className={defaultHeroCSS.background}
      />
      <div className={defaultHeroCSS.backdropAlt} />
      {!props.logo && <Logos.xcwalkeruk className={noKingsHeroCSS.logo} />}
      {props.logo && (
        <img
          src={props.logo.onDark}
          alt="Organization Logo"
          className={noKingsHeroCSS.logo}
        />
      )}
      <img
        src="/No Kings Logo_Horizontal_ForDarkBackgrounds.svg"
        alt=""
        className={noKingsHeroCSS.kingsLogo}
      />
      <h1 className={defaultHeroCSS.heading}>Supporting No Kings</h1>
      <Link
        to="https://nokings.org"
        className={defaultHeroCSS.attribution}
        aria-hidden={!props.isActive}
        tabIndex={props.isActive ? 0 : -1}
      >
        Learn More at nokings.org
      </Link>
    </div>
  );
}
