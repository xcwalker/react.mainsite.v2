import css from "../../styles/components/settings/Note.module.css";

export function SettingsNote(props: { children: React.ReactNode }) {
  return <div className={css.note}>{props.children}</div>;
}