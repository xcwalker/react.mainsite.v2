import { Fragment, useCallback, useEffect, useState } from "react";
import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";

import css from "../styles/components/header.module.css";
import GFIcon from "./GFIcon";
import { SocialsList } from "./Socials";

const navItems = [
  {
    title: "home",
    href: "",
    gficon: "home",
  },
  {
    title: "Recipes",
    href: "recipe",
    gficon: "menu_book",
  },
  {
    title: "Projects",
    href: "project",
    gficon: "code",
  },
  {
    title: "account",
    href: "account",
    gficon: "person",
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
    type: "normal",
    gficon: "grid_view",
    // iconURL:
    // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Immersion.svg",
  },
  {
    title: "Searrson",
    href: "https://searrson.xcwalker.dev/",
    type: "normal",
    gficon: "wallpaper_slideshow",
    // iconURL:
    // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Searrson.svg",
  },
  {
    title: "Therwim",
    href: "https://therwim.xcwalker.dev/",
    type: "normal",
    gficon: "web",
    // iconURL:
    // "https://raw.githubusercontent.com/XCWalker/Default/main/iconSVG/Therwim.svg",
  },
];

export default function Header() {
  const [navScrollLastKnown, setNavScrollLastKnown] = useState(0);

  const navScroll = useCallback(() => {
    if (navScrollLastKnown === window.scrollY) return;

    if (window.scrollY > navScrollLastKnown) {
      document.body.classList.remove("scrolledUp");
    } else if (window.scrollY < navScrollLastKnown - 25) {
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
    <header className={css.header}>
      <div className={css.container}>
        <Logo type="xcwalker" className={css.svg} />
        <Logo type="x" className={css.svgSmall} />
        <ul className={css.links}>
          {navItems &&
            navItems.map((item, index) => {
              return (
                <Fragment key={index}>
                  <NavLinkInternal {...item} />
                </Fragment>
              );
            })}
        </ul>
        <span className={css.title}>Sites</span>
        <ul className={css.links}>
          {navItemsSites &&
            navItemsSites.map((item, index) => {
              return (
                <Fragment key={index}>
                  <NavLinkExternal {...item} />
                </Fragment>
              );
            })}
        </ul>
        <span className={css.title}>Socials</span>
        <SocialsList
          listClassName={css.links}
          buttonClassName={css.link}
          iconClassName={css.icon}
          externalClassName={css.external}
          contentClassName={css.content}
          textClassName={css.text}
          useUnstyledButton
        />
      </div>
    </header>
  );
}

function NavLinkInternal(props: {
  href: string;
  title: string;
  gficon: string;
}) {
  return (
    <li className={css.link}>
      <NavLink to={props.href}>
        <div className={css.content}>
          {props.gficon && props.gficon !== "" && (
            <GFIcon className={css.icon}>{props.gficon}</GFIcon>
          )}
          <span className={css.text}>{props.title}</span>
        </div>
        <div />
      </NavLink>
    </li>
  );
}

function NavLinkExternal(props: {
  href: string;
  title: string;
  iconURL?: string;
  gficon?: string;
}) {
  return (
    <li className={css.link}>
      <Link to={props.href}>
        <div className={css.content}>
          {props.iconURL && props.iconURL !== "" && (
            <img className={css.icon} src={props.iconURL} />
          )}
          {props.gficon && props.gficon !== "" && (
            <GFIcon className={css.icon}>{props.gficon}</GFIcon>
          )}
          <span className={css.text}>{props.title}</span>
        </div>
        <GFIcon className={css.icon + " " + css.external}>open_in_new</GFIcon>
      </Link>
    </li>
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
