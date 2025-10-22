import { CompactPicker } from "react-color";
import css from "../styles/components/inputColor.module.css";

export default function InputColor(props: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={css.inputColor} id={props.id}>
      <label className={css.label}>{props.label}</label>
      <CompactPicker
        onChange={(e) => {
          props.onChange(e.hex);
        }}
        color={props.value}
        className={css.colorPicker}
      />
    </div>
  );
}