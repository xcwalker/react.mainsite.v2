import css from "../styles/components/inputToggle.module.css";

export default function InputToggle(props: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className={css.inputContainer}>
      <div className={css.labels}>
        <label htmlFor={props.id} className={css.label}>
          {props.label}
        </label>
      </div>
      <input
        className={css.input}
        type="checkbox"
        id={props.id}
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
      />
    </div>
  );
}
