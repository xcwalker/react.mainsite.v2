import css from "../styles/components/sideBySide.module.css";
import { ReactNode } from "react";

export default function SideBySide(props: {
  leftWidth?: string;
  printLeftWidth?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        css.sideBySide + (props.className ? " " + props.className : "")
      }
      style={
        {
          "--_width": props.leftWidth,
          "--_print-width": props.printLeftWidth,
        } as React.CSSProperties
      }
    >
      {props.children}
    </div>
  );
}
