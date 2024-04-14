import css from "../styles/components/horizontalAutoGrid.module.css";
import { ReactNode } from "react";

export default function HorizontalAutoGrid(props: { width?: string; children: ReactNode }) {
  return (
    <ul className={css.horizontalAutoGrid} style={{ "--_width": props.width } as React.CSSProperties}>
      {props.children}
    </ul>
  );
}