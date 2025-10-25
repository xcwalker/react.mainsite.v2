import css from "../../styles/components/sidebarButtonContainer.module.css";

export default function SidebarButtonContainer(props: { children: React.ReactNode }) {
  return <div className={css.container}>{props.children}</div>;
}