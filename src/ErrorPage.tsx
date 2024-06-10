import { Link } from "react-router-dom";
import Section from "./components/Section";
import css from "./styles/pages/errorPage.module.css";

export default function ErrorPage(props: { code: number, error: string}) {
  return (
    <Section id="404" className={css.page404} container={{ className: css.container }}>
      <h1>{props.error}</h1>
      <h2>{props.code}</h2>
      <Link to={"/"} className={css.link}>Return to safety</Link>
    </Section>
  );
}
