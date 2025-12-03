import Section from "./Section";
import css from "../styles/components/loading.module.css";

export default function LoadingPage(props: { className?: string }) {
  return (
    <Section
      id="loading"
      className={props.className}
      container={{ className: css.container }}
      aria={{
        busy: true,
      }}
    >
      <h1 className={css.title} aria-label="Loading" aria-hidden="false">
        <span>L</span>
        <span>o</span>
        <span>a</span>
        <span>d</span>
        <span>i</span>
        <span>n</span>
        <span>g</span>
      </h1>
    </Section>
  );
}
