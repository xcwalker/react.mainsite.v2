import Logo from "../../components/Logo";
import Section from "../../components/Section";
import css from "../../styles/pages/home/hero.module.css";

export default function HomeHero() {
  return (
    <>
      <Section id="hero" className={css.hero} container={{ className: css.container }}>
            <img src="/background.svg" alt="" className={css.background} />
            <div className={css.backdrop}></div>
            <Logo type="xcwalker" className={css.logo} />
      </Section>
    </>
  );
}
