import css from "../styles/components/SettingSection.module.css";
export default function SettingSection(props: { children: React.ReactNode; id?: string; className?: string; title: string }) {
  return (
    <section id={props.id} className={`${css.settingSection} ${props.className}`}>
      <h2>{props.title}</h2>
      {props.children}
    </section>
  );
}