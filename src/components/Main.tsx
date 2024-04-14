import css from "../styles/components/main.module.css";
import { ReactNode } from "react";

export default function Main(props: { children: ReactNode }) {
  return <main className={css.main}>{props.children}</main>;
}