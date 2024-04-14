import { ReactNode } from "react";
import css from "../styles/components/autoGrid.module.css";

export default function AutoGrid(props: {width?: string, children: ReactNode }) {
  return (
    <ul className={css.autoGrid} style={{ "--_width": props.width } as React.CSSProperties}>
      {props.children}
    </ul>
  );
}