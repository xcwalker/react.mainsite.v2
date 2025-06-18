import css from "../styles/components/input/Checkbox.module.css";
import GFIcon from "./GFIcon";

export default function Checkbox(props: {
  id: string;
  label: string;
  showLabel?: boolean;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <div
      className={`${css.checkbox} ${
        props.checked ? css.checked : css.unchecked
      } ${props.className || ""}`}
    >
      <div className={css.input}>
        <input
          type="checkbox"
          id={props.id}
          checked={props.checked}
          onChange={(e) => props.onChange?.(e.target.checked)}
          className={css.default}
        />
        <div className={css.check}>
          <GFIcon className={css.tick}>check</GFIcon>
        </div>
      </div>
      {(props.showLabel === undefined || props.showLabel === true) && (
        <label htmlFor={props.id} className={css.label}>
          {props.label}
        </label>
      )}
    </div>
  );
}
