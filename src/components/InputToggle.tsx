import css from "../styles/components/inputToggle.module.css";

export default function InputToggle(props: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className={css.inputContainer}>
      <label
        className={`${css.switch}  ${props.checked ? css.checked : ""}`}
        htmlFor={props.id}
      >
        <span className={`${css.slider}`} />
      </label>
      <label htmlFor={props.id} className={css.label}>
        {props.label}
      </label>
      <input
        className={css.input}
        type="checkbox"
        id={props.id}
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
        disabled={props.disabled}
      />
    </div>
  );
}
