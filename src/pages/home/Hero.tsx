import React, { Fragment, useState } from "react";
import GFIcon from "../../components/GFIcon";
import Logo from "../../components/Logo";
import Section from "../../components/Section";

import css from "../../styles/pages/home/hero/slideshow.module.css";
import defaultHeroCSS from "../../styles/pages/home/hero/defaultHero.module.css";
import christmasHeroCSS from "../../styles/pages/home/hero/christmasHero.module.css";
import halloweenHeroCSS from "../../styles/pages/home/hero/halloweenHero.module.css";
import { Link } from "react-router-dom";

export default function HomeHero() {
  const date = new Date();
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [slideshowItems, setSlideshowItems] = useState([
    {
      // This is a placeholder for the christmas theme
      id: 2,
      component: <ChristmasHero />,
      dateRange: {
        start: new Date(date.getFullYear() + "-05-01"),
        end: new Date(date.getFullYear() + "-05-25"),
      },
    },
    {
      // This is a placeholder for the Halloween theme
      id: 3,
      component: <HalloweenHero />,
      dateRange: {
        start: new Date(date.getFullYear() + "-05-01"),
        end: new Date(date.getFullYear() + "-05-31"),
      },
    },
    {
      id: 1,
      component: <DefaultHero />,
    },
    {
      id: 4,
      component: <DefaultHero />,
    },
    {
      id: 5,
      component: <DefaultHero />,
    },
  ]);
  const [slideshowActive, setSlideshowActive] = useState<number[]>(
    slideshowItems
      .filter((item) => {
        return item.dateRange
          ? new Date() >= item.dateRange?.start &&
              new Date() <= item.dateRange?.end
          : true;
      })
      .map((item) => item.id)
  );

  return (
    <>
      <Section
        id="hero"
        className={css.slideshow}
        container={{ className: css.container }}
      >
        <button
          type="button"
          onClick={() =>
            setSlideshowIndex((prev) => {
              return Math.max(prev - 1, 0);
            })
          }
          className={css.left}
          disabled={slideshowIndex === 0}
        >
          <GFIcon>arrow_left</GFIcon>
        </button>
        <button
          type="button"
          onClick={() =>
            setSlideshowIndex((prev) => {
              return Math.min(prev + 1, slideshowActive.length - 1);
            })
          }
          className={css.right}
          disabled={slideshowIndex === slideshowActive.length - 1}
        >
          <GFIcon>arrow_right</GFIcon>
        </button>
        <div
          className={css.heros}
          style={{
            transform: `translateX(calc(-${slideshowIndex * 100}% - ${
              slideshowIndex * 0.5
            }rem))`,
          }}
        >
          {slideshowItems.map((item, index) => {
            const isActive = index + 1 === slideshowIndex;

            const isVisible = item.dateRange
              ? new Date() >= item.dateRange?.start &&
                new Date() <= item.dateRange?.end
              : true;

            console.log(item.dateRange);

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
        <div className={css.dots}>
          {slideshowActive.map((item, index) => {
            return (
              <div
                key={index}
                className={`${css.dot} ${
                  index === slideshowIndex ? css.active : ""
                }`}
                onClick={() => setSlideshowIndex(index)}
              />
            );
          })}
        </div>
      </Section>
    </>
  );
}

function DefaultHero() {
  return (
    <div className={defaultHeroCSS.container}>
      <img src="/background.svg" alt="" className={defaultHeroCSS.background} />
      <div className={defaultHeroCSS.backdrop}></div>
      <Logo type="xcwalker" className={defaultHeroCSS.logo} />
    </div>
  );
}

function ChristmasHero(props: {isActive?: boolean}) {
  return (
    <div className={christmasHeroCSS.container}>
      <img
        src="/christmas_background.svg"
        alt=""
        className={defaultHeroCSS.background}
      />
      <div className={defaultHeroCSS.backdrop} />
      <Logo type="xcwalker" className={christmasHeroCSS.logo} />
      <h1 className={christmasHeroCSS.heading}>Merry Christmas</h1>
      {!props.isActive && <Link
        to="https://www.vecteezy.com/vector-art/7718340-hand-drawn-christmas-pattern-design-background"
        className={defaultHeroCSS.attribution}
      >
        Wallpaper from Vecteezy
      </Link>}
    </div>
  );
}

function HalloweenHero() {
  return (
    <div className={halloweenHeroCSS.container}>
      <img
        src="/halloween_background.svg"
        alt=""
        className={defaultHeroCSS.background}
      />
      <div className={defaultHeroCSS.backdrop} />
      <Logo type="xcwalker" className={halloweenHeroCSS.logo} />
      <h1 className={halloweenHeroCSS.heading}>Happy Halloween</h1>
      <Link
        to="https://www.vecteezy.com/vector-art/11356859-seamless-happy-halloween-vector-background-illustration-with-haunted-mansion-full-moon-haunted-tree-ghosts-and-pumpkins-horizontally-repeatable"
        className={defaultHeroCSS.attribution}
      >
        Wallpaper from Vecteezy
      </Link>
    </div>
  );
}
