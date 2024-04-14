import { ReactNode } from "react";
import css from "../styles/components/gfIcons.module.css"

export default function GFIcon(props: {
  children: ReactNode,
}) {
  return <span className={css.gfIcons}>{props.children}</span>;
}