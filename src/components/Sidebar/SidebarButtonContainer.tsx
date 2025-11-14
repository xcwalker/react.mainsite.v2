import css from "../../styles/components/sidebarButtonContainer.module.css";

export default function SidebarButtonContainer(props: {
  children: React.ReactNode;
  navigation?: boolean;
}) {
  const { navigation } = props;

  if (navigation) {
    return (
      <nav>
        <ul className={css.container}>{props.children}</ul>
      </nav>
    );
  }

  return <div className={css.container}>{props.children}</div>;
}
