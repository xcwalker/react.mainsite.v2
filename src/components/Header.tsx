import { Fragment } from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

import css from "../styles/components/header.module.css";
import { PrimaryButtonLink } from "./PrimaryButton";

const navItems = [
  {
    title: "Test",
    href: "test",
    type: "normal",
  },
  {
    title: "Contact",
    href: "ticket",
    type: "primary",
  },
];

export default function Header() {
  return (
    <header className={css.header}>
      <div className={css.container}>
        <Link to={"/"}>
          <Logo type="xcwalker" className={css.svg} />
        </Link>
        <ul className={css.links}>
          {navItems &&
            navItems.map((item, index) => {
              return (
                <Fragment key={index}>
                  {item.type === "normal" && <NavLink {...item} />}
                  {item.type === "primary" && <PrimaryButtonLink href={item.href}>{item.title}</PrimaryButtonLink>}
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