import { ReactNode } from "react";
import css from "../styles/components/gfIcons.module.css"

export default function GFIcon(props: {
  children: ReactNode,
  className?: string,
}) {
  return <span className={css.gfIcons + " " + props.className}>{props.children}</span>;
}