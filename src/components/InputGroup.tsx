import css from "../styles/components/inputGroup.module.css";

export default function InputGroup(props: {
  children: React.ReactNode;
  direction?: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={
        css.inputGroup +
        ` direction-${props.direction} ` +
        (props.fullWidth ? ` ${css.fullWidth}` : "")
      }
    >
      {props.children}
    </div>
  );
}
