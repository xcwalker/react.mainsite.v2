import { Link } from "react-router-dom";
import css from "../styles/components/button.module.css";
import { ReactNode } from "react";

export default function Button(props: { children: ReactNode; onClick: () => void; className?: string }) {
  return (
    <button className={css.button + " " + props?.className} onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export function ButtonLink(props: { children: ReactNode; className?: string; href: string }) {
  return (
    <Link to={props.href} className={css.button + " " + props?.className}>
      {props.children}
    </Link>
  );
}