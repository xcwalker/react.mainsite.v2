import { Link } from "react-router-dom";
import css from "../styles/components/libraryCarousel.module.css";
import GFIcon from "./GFIcon";
import { ReactNode, UIEvent, useEffect, useRef, useState } from "react";
import { RoleProtect } from "./Security/Protect";
import Button from "./Button";
import toTitleCase from "../functions/toTitleCase";

export default function Carousel(props: {
  children: ReactNode;
  listView?: ReactNode;
  title: string;
  multipleViews: boolean;
  hasChildViews?: boolean;
  className: string;
  titleLink?: { text: string; href: string };
  defaultView: string;
  showCreateButton?: "recipes" | "projects" | "albums" | "blog";
}) {
  const carouselRef = useRef<HTMLElement>(null);
  const [scrolledDistance, setScrolledDistance] = useState(0);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [view, setView] = useState(props.defaultView);
  const [childView, setChildView] = useState("grid");

  function scrollRef(pixels: number) {
    if (carouselRef.current) {
      carouselRef.current.scrollBy(pixels, 0);
    }
  }

  function scrollRefTo(pixels: number) {
    if (carouselRef.current) {
      carouselRef.current.scrollTo(pixels, 0);
    }
  }

  function scrolled(e: UIEvent) {
    setScrolledDistance(e.currentTarget.scrollLeft);
  }

  useEffect(() => {
    if (carouselRef.current) {
      // @ts-expect-error is on firefox (suckers)
      setScrollDistance(carouselRef.current.scrollLeftMax);
    }

    return () => {
      setScrollDistance(0);
    };
  }, [view]);

  return (
    <section className={css.carouselContainer}>
      <header className={css.header + " view-" + view}>
        <div className={css.title}>
          {props.title && <h3>{props.title}</h3>}
          {props.titleLink && (
            <Link to={props.titleLink.href} className={css.titleLink}>{props.titleLink.text}</Link>
          )}

          {props.showCreateButton && (
            <RoleProtect staffOnly>
              <Button
                href={"/" + props.showCreateButton + "/create"}
                title={"Create " + toTitleCase(props.showCreateButton)}
                style="primary"
                icon={{ gficon: "add" }}
                width="fit-content"
                className={css.createButton}
              >
                Create {toTitleCase(props.showCreateButton)}
              </Button>
            </RoleProtect>
          )}
        </div>
        <div className={css.controls}>
          {view === "list" && props.hasChildViews && (
            <div className={css.group} id={css.childView}>
              <button
                className={css.button}
                onClick={() => setChildView("column")}
                disabled={childView === "column"}
              >
                <GFIcon className={css.icon}>view_column</GFIcon>
              </button>
              <button
                className={css.button}
                onClick={() => setChildView("grid")}
                disabled={childView === "grid"}
              >
                <GFIcon className={css.icon}>calendar_view_month</GFIcon>
              </button>
              {props.listView && (
                <button
                  className={css.button}
                  onClick={() => setChildView("list")}
                  disabled={childView === "list"}
                >
                  <GFIcon className={css.icon}>view_list</GFIcon>
                </button>
              )}
            </div>
          )}
          {props.multipleViews && (
            <div className={css.group}>
              <button
                className={css.button}
                onClick={() => setView("column")}
                disabled={view === "column"}
              >
                <GFIcon className={css.icon}>view_column</GFIcon>
              </button>
              <button
                className={css.button}
                onClick={() => setView("grid")}
                disabled={view === "grid"}
              >
                <GFIcon className={css.icon}>calendar_view_month</GFIcon>
              </button>
              {props.listView && (
                <button
                  className={css.button}
                  onClick={() => setView("list")}
                  disabled={view === "list"}
                >
                  <GFIcon className={css.icon}>view_list</GFIcon>
                </button>
              )}
            </div>
          )}
          {view !== "column" && (
            <div className={css.group}>
              <button
                className={css.button}
                id={css.toTop}
                onClick={() => {
                  // @ts-expect-error works
                  carouselRef.current.firstChild.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
              >
                <GFIcon className={css.icon}>first_page</GFIcon>
              </button>
              <button
                className={css.button}
                id={css.toBottom}
                onClick={() => {
                  if (carouselRef.current?.lastChild) {
                    (
                      carouselRef.current.lastChild as HTMLElement
                    ).scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
              >
                <GFIcon className={css.icon}>last_page</GFIcon>
              </button>
            </div>
          )}
          {view === "column" && (
            <div className={css.group}>
              {scrollDistance >= 4000 && (
                <button
                  className={css.button}
                  onClick={() => scrollRefTo(0)}
                  disabled={scrolledDistance === 0}
                >
                  <GFIcon className={css.icon}>first_page</GFIcon>
                </button>
              )}
              {scrollDistance >= 4000 && (
                <button
                  className={css.button}
                  onClick={() => scrollRef(-2000)}
                  disabled={scrolledDistance === 0}
                >
                  <GFIcon className={css.icon}>
                    keyboard_double_arrow_left
                  </GFIcon>
                </button>
              )}
              <button
                className={css.button}
                onClick={() => scrollRef(-1000)}
                disabled={scrolledDistance === 0}
              >
                <GFIcon className={css.icon}>keyboard_arrow_left</GFIcon>
              </button>
              <button
                className={css.button}
                onClick={() => scrollRef(1000)}
                disabled={scrolledDistance === scrollDistance}
              >
                <GFIcon className={css.icon}>keyboard_arrow_right</GFIcon>
              </button>
              {scrollDistance >= 4000 && (
                <button
                  className={css.button}
                  onClick={() => scrollRef(2000)}
                  disabled={scrolledDistance === scrollDistance}
                >
                  <GFIcon className={css.icon}>
                    keyboard_double_arrow_right
                  </GFIcon>
                </button>
              )}
              {scrollDistance >= 4000 && (
                <button
                  className={css.button}
                  onClick={() => scrollRefTo(scrollDistance)}
                  disabled={scrolledDistance === scrollDistance}
                >
                  <GFIcon className={css.icon}>last_page</GFIcon>
                </button>
              )}
            </div>
          )}
        </div>
      </header>
      <main
        className={css.carousel + " view-" + view + " " + props.className}
        ref={carouselRef}
        onScroll={(e) => scrolled(e)}
        onLoad={() => {
          // @ts-expect-error works
          setScrollDistance(carouselRef.current.scrollLeftMax);
        }}
      >
        {view !== "list" && props.children}
        {view === "list" && props.listView}
      </main>
    </section>
  );
}
