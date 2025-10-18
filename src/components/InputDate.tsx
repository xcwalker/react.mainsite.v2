import css from "../styles/components/InputDate.module.css";

export default function InputDate(props: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className={css.inputContainer}>
      <div className={css.labels}>
        <label htmlFor={props.id} className={css.label}>{props.label}</label>
      </div>
      <input
      className={css.input}
        type="date"
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        required={props.required}
      />
    </div>
  );
}
