import css from "../styles/components/InputDuration.module.css";

export function InputDuration(props: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={css.durationInput}>
      <label htmlFor={props.id}>{props.label}</label>
      <div className={css.duration}>
        <input
          type="range"
          id={props.id}
          name={props.label}
          min={props.min}
          max={props.max}
          step={props.step}
          value={props.value}
          onChange={props.onChange}
        />
        {props.value !== -1 && (
          <div className={css.value}>
            <span>{props.value} ms</span>
            <span>{(props.value / 1000).toFixed(2)} s</span>
          </div>
        )}
        {props.value === -1 && (
          <div className={css.value}>
            <span>Infinite</span>
          </div>
        )}
      </div>
    </div>
  );
}