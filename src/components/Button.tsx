import { Link, NavLink } from "react-router-dom";
import css from "../styles/components/button.module.css";
import { ReactNode } from "react";
import GFIcon from "./GFIcon";

export default function Button(props: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  tabIndex?: number;
  href?: string;
  title: string;
  target?: string;
  icon?: {
    gficon?: string;
    inline?: ReactNode;
  };
  external?: boolean;
  style?: "primary" | "secondary" | "danger";
}) {
  return (
    <>
      {props.href && props.external && (
        <Link
          to={props.href}
          className={
            css.button +
            " " +
            props?.className +
            (props.icon ? " " + css.hasIcon : "") +
            (props.style ? ` ${css[props.style]}` : "")
          }
          tabIndex={props.tabIndex}
          target={props.target === "newTab" ? "_blank" : ""}
          title={props.title}
        >
          {props.icon?.gficon && (
            <GFIcon className={css.icon}>{props.icon?.gficon}</GFIcon>
          )}
          {props.icon?.inline && <>{props.icon?.inline}</>}
          {props.children}
          <GFIcon className={css.external}>open_in_new</GFIcon>
        </Link>
      )}
      {props.href && !props.external && (
        <NavLink
          to={props.href}
          className={({ isActive }) =>
            (isActive ? css.button + " " + css.active : css.button) +
            " " +
            props?.className +
            (props.icon ? " " + css.hasIcon : "") +
            (props.style ? ` ${css[props.style]}` : "")
          }
          tabIndex={props.tabIndex}
          target={props.target === "newTab" ? "_blank" : ""}
          title={props.title}
        >
          {props.icon?.gficon && <GFIcon>{props.icon?.gficon}</GFIcon>}
          {props.icon?.inline && <>{props.icon?.inline}</>}
          {props.children}
        </NavLink>
      )}
      {props.onClick && (
        <button
          className={
            css.button +
            " " +
            props?.className +
            (props.icon ? " " + css.hasIcon : "") +
            (props.style ? ` ${css[props.style]}` : "")
          }
          onClick={props.onClick}
          tabIndex={props.tabIndex}
          title={props.title}
        >
          {props.icon?.gficon && <GFIcon>{props.icon?.gficon}</GFIcon>}
          {props.icon?.inline && <>{props.icon?.inline}</>}
          {props.children}
        </button>
      )}
    </>
  );
}

export function ButtonLink(props: {
  children: ReactNode;
  className?: string;
  href: string;
  tabIndex?: number;
  type?: string;
  title?: string;
}) {
  return (
    <Link
      to={props.href}
      className={css.button + " " + props?.className}
      tabIndex={props.tabIndex}
      target={props.type === "newTab" ? "_blank" : ""}
      title={props.title}
    >
      {/* <div className={css.corner} />
      <div className={css.corner} />
      <div className={css.corner} />
      <div className={css.corner} /> */}
      {props.children}
    </Link>
  );
}
