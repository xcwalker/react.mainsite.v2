import css from "../../styles/components/sidebarContainer.module.css";

export function SidebarContainer(props: { children: React.ReactNode, className?: string }) {
  return <div className={`${css.sidebar} ${props.className ?? ""}`}>{props.children}</div>;
}