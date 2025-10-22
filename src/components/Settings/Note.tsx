import css from "../../styles/components/settings/Note.module.css";
import GFIcon from "../GFIcon";

export function SettingsNote(props: { children: React.ReactNode }) {
  return (
    <div className={css.note}>
      <GFIcon className={css.icon}>info</GFIcon>
      {props.children}
    </div>
  );
}
