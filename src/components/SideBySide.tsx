import css from "../styles/components/sideBySide.module.css";
import { ReactNode } from "react";

export default function SideBySide(props: { leftWidth?: string; children: ReactNode }) {
  return (
    <div className={css.sideBySide} style={{ "--_width": props.leftWidth } as React.CSSProperties}>
      {props.children}
    </div>
  );
}
