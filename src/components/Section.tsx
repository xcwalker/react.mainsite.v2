import css from "../styles/components/section.module.css";
import { SectionType } from "../types";

export default function Section(props: SectionType) {
  return (
    <section className={css.section + " " + props.className} id={props.id} style={props.style}>
      {!props.container && <div className={css.container}>{props.children}</div>}
      {props.container && <div className={css.container + " " + props.container.className}>{props.children}</div>}
    </section>
  );
}
