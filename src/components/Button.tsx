import { Link, NavLink } from "react-router-dom";
import css from "../styles/components/button.module.css";
import { ReactNode } from "react";
import GFIcon from "./GFIcon";

export default function Button(props: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  // type is used to determine the type of button, e.g. submit for forms
  className?: string;
  tabIndex?: number;
  href?: string;
  title: string;
  target?: string;
  icon?: {
    gficon?: string;
    gfClassName?: string;
    inline?: ReactNode;
  };
  external?: boolean;
  externalClassName?: string;
  style?: "primary" | "secondary" | "danger";
  pageNavigation?: boolean;
  // pageNavigation is used to determine if the button is used for page navigation with # links
  hidden?: "siteNavigation" | "pageNavigation";
  // hidden is used to hide the button, e.g. for the jump to content or new tab buttons
  loading?: boolean;
  // loading is used to show a loading state for the button
  width?: string;
  // width is used to set the width of the button
  isBeta?: boolean;
  // isBeta is used to show a beta tag on the button
  betaTagClassName?: string;
}) {
  return (
    <>
      {props.href !== undefined && props.pageNavigation && (
        <a
          href={props.href}
          className={
            css.button +
            " " +
            props?.className +
            (props.icon ? " " + css.hasIcon : "") +
            (props.style ? ` ${css[props.style]}` : "") +
            (props.hidden === "siteNavigation" ? " " + css.siteHidden : "") +
            (props.hidden === "pageNavigation" ? " " + css.pageHidden : "")
          }
          style={{ width: props.width ? props.width : "" }}
          tabIndex={props.tabIndex}
          target={props.target === "newTab" ? "_blank" : ""}
          title={props.title}
          aria-disabled={props.loading ? "true" : "false"}
        >
          {props.icon?.gficon && (
            <GFIcon
              className={
                css.icon +
                (props.icon.gfClassName ? " " + props.icon.gfClassName : "")
              }
            >
              {props.icon?.gficon}
            </GFIcon>
          )}
          {props.icon?.inline && <>{props.icon?.inline}</>}
          {props.children}
          {props.isBeta && (
            <span
              className={
                css.betaTag +
                (props.betaTagClassName ? " " + props.betaTagClassName : "")
              }
            >
              Beta
            </span>
          )}
        </a>
      )}
      {props.href !== undefined && props.external && !props.pageNavigation && (
        <Link
          to={props.href}
          className={
            css.button +
            " " +
            props?.className +
            " " +
            css.external +
            (props.icon ? " " + css.hasIcon : "") +
            (props.style ? ` ${css[props.style]}` : "") +
            (props.hidden === "siteNavigation" ? " " + css.siteHidden : "") +
            (props.hidden === "pageNavigation" ? " " + css.pageHidden : "")
          }
          style={{ width: props.width ? props.width : "" }}
          tabIndex={props.tabIndex}
          target={props.target === "newTab" ? "_blank" : ""}
          title={props.title}
          aria-disabled={props.loading ? "true" : "false"}
        >
          {props.icon?.gficon && (
            <GFIcon
              className={
                css.icon +
                (props.icon.gfClassName ? " " + props.icon.gfClassName : "")
              }
            >
              {props.icon?.gficon}
            </GFIcon>
          )}
          {props.icon?.inline && <>{props.icon?.inline}</>}
          {props.children}
          {props.isBeta && (
            <span
              className={
                css.betaTag +
                (props.betaTagClassName ? " " + props.betaTagClassName : "")
              }
            >
              Beta
            </span>
          )}
          <GFIcon
            className={
              css.external +
              (props.externalClassName ? " " + props.externalClassName : "")
            }
          >
            open_in_new
          </GFIcon>
        </Link>
      )}
      {props.href !== undefined && !props.external && !props.pageNavigation && (
        <NavLink
          to={props.href}
          className={({ isActive }) =>
            (isActive ? css.button + " " + css.active : css.button) +
            " " +
            props?.className +
            (props.icon ? " " + css.hasIcon : "") +
            (props.style ? ` ${css[props.style]}` : "") +
            (props.hidden === "siteNavigation" ? " " + css.siteHidden : "") +
            (props.hidden === "pageNavigation" ? " " + css.pageHidden : "")
          }
          style={{ width: props.width ? props.width : "" }}
          tabIndex={props.tabIndex}
          target={props.target === "newTab" ? "_blank" : ""}
          title={props.title}
          aria-disabled={props.loading ? "true" : "false"}
        >
          {props.icon?.gficon && (
            <GFIcon
              className={
                css.icon +
                (props.icon.gfClassName ? " " + props.icon.gfClassName : "")
              }
            >
              {props.icon?.gficon}
            </GFIcon>
          )}
          {props.icon?.inline && <>{props.icon?.inline}</>}
          {props.children}
          {props.isBeta && (
            <span
              className={
                css.betaTag +
                (props.betaTagClassName ? " " + props.betaTagClassName : "")
              }
            >
              Beta
            </span>
          )}
        </NavLink>
      )}
      {(props.onClick || props.type) && (
        <button
          className={
            css.button +
            " " +
            props?.className +
            (props.icon ? " " + css.hasIcon : "") +
            (props.style ? ` ${css[props.style]}` : "") +
            (props.hidden === "siteNavigation" ? " " + css.siteHidden : "") +
            (props.hidden === "pageNavigation" ? " " + css.pageHidden : "")
          }
          style={{ width: props.width ? props.width : "" }}
          onClick={props.onClick}
          tabIndex={props.tabIndex}
          title={props.title}
          type={props.type ? props.type : "button"}
          disabled={props.loading ? true : false}
        >
          {props.icon?.gficon && (
            <GFIcon
              className={
                css.icon +
                (props.icon.gfClassName ? " " + props.icon.gfClassName : "")
              }
            >
              {props.icon?.gficon}
            </GFIcon>
          )}
          {props.icon?.inline && <>{props.icon?.inline}</>}
          {props.children}
          {props.isBeta && (
            <span
              className={
                css.betaTag +
                (props.betaTagClassName ? " " + props.betaTagClassName : "")
              }
            >
              Beta
            </span>
          )}
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
