import css from "../../styles/components/sidebarTitle.module.css";

export default function SidebarTitle(props: { title: string; subtitle?: string }) {
  return (
    <div className={css.details}>
      <h2 className={css.title}>{props.title}</h2>
      {props.subtitle && <h3 className={css.subtitle}>{props.subtitle}</h3>}
    </div>
  );
}