import css from "../styles/components/separator.module.css";

export default function Separator(props: { size: string}) {
  return <div className={css.separator} style={{ "--_size": props.size } as React.CSSProperties} />;
}