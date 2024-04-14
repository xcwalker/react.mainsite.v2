import { Fragment, useEffect, useCallback, useState } from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

import css from "../styles/components/header.module.css";

const navItems = [
  {
    title: "Test",
    href: "test",
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
        <ul className={css.links}>
          {navItems &&
            navItems.map((item, index) => {
              return (
                <Fragment key={index}>
                  <NavLink {...item} />
                </Fragment>
              );
            })}
        </ul>
      </div>
    </header>
  );
}

function NavLink(props: { href: string; title: string }) {
  return (
    <li className={css.link}>
      <Link to={props.href}>{props.title}</Link>
    </li>
  );
}
