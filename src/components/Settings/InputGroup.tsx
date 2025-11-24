import css from "../../styles/components/settings/inputGroup.module.css";

export default function SettingsInputGroup(props: {
  children: React.ReactNode;
  direction?: string;
}) {
  return <div className={css.inputGroup}>{props.children}</div>;
}
