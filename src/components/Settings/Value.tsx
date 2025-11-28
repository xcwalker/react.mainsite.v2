import css from "../../styles/components/settings/SettingField.module.css";
import IconButton from "../IconButton";

export default function Value(props: {
  label: string;
  value: string;
  canCopy?: boolean;
}) {
  return (
    <div className={css.infoRow}>
      <div className={css.infoStack}>
        <span className={css.infoLabel}>{props.label}:</span>{" "}
        <span className={css.infoValue}>{props.value || "Not Available"}</span>
      </div>
      {props.canCopy && (
        <IconButton
          title={`Copy ${props.label}`}
          icon={{ gficon: "content_copy" }}
          onClick={() => {
            navigator.clipboard.writeText(props.value || "");
          }}
          width="fit-content"
          className={css.copyButton}
        />
      )}
    </div>
  );
}
