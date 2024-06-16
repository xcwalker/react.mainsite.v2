import Section from "./Section";
import css from "../styles/components/loading.module.css"

export default function LoadingPage() {
  return (
    <Section id="loading" container={{className: css.container}}>
      <h1 className={css.title}>
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
