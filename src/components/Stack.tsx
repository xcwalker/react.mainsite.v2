import css from "../styles/components/stack.module.css";
import { StackType } from "../types";

export default function Stack(props: StackType) {
  return (
    <div className={css.stack + " " + props.direction} style={{ "--_gap": props.gap } as React.CSSProperties}>
      {props.children}
    </div>
  );
}