import css from "../../styles/components/sidebarContainer.module.css";

export function SidebarContainer(props: { children: React.ReactNode }) {
  return <div className={css.sidebar}>{props.children}</div>;
}