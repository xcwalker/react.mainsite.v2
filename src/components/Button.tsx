import { Link } from "react-router-dom";
import css from "../styles/components/button.module.css";
import { ReactNode } from "react";

export default function Button(props: { children: ReactNode; onClick: () => void; className?: string; tabIndex?: number; }) {
  return (
    <button className={css.button + " " + props?.className} onClick={props.onClick} tabIndex={props.tabIndex}>
      <div className={css.corner} />
      <div className={css.corner} />
      <div className={css.corner} />
      <div className={css.corner} />
      {props.children}
    </button>
  );
}

export function ButtonLink(props: { children: ReactNode; className?: string; href: string; tabIndex?: number; type?: string; title?: string; }) {
  return (
    <Link to={props.href} className={css.button + " " + props?.className} tabIndex={props.tabIndex} target={props.type === "newTab" ? "_blank" : ""} title={props.title}>
      <div className={css.corner} />
      <div className={css.corner} />
      <div className={css.corner} />
      <div className={css.corner} />
      {props.children}
    </Link>
  );
}