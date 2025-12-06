import css from "../styles/components/inputGroup.module.css";

export default function InputGroup(props: {
  children: React.ReactNode;
  direction?: string;
  fullWidth?: boolean;
  basis?: string;
  label?: string;
}) {
  return (
    <div className={css.wrapper}>
      {props.label && <label className={css.label}>{props.label}</label>}
      <div
        className={
          css.inputGroup +
          ` direction-${props.direction} ` +
          (props.fullWidth ? ` ${css.fullWidth}` : "")
        }
        style={{ "--_flex-basis": props.basis } as React.CSSProperties}
      >
        {props.children}
      </div>
    </div>
  );
}
