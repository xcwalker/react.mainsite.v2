import css from "../styles/components/button.module.css";
import { ReactNode } from "react";

export default function Button(props: { children: ReactNode; onClick: () => void }) {
  return (
    <button className={css.button} onClick={props.onClick}>
      {props.children}
    </button>
  );
}