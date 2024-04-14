import Logo from "../../components/Logo";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import css from "../../styles/pages/home/hero.module.css";

export default function Hero() {
  return (
    <>
      <Section id="hero" className={css.hero} container={{ className: css.container }}>
        <SideBySide leftWidth="1fr">
          <div className={css.side}>
            <Logo type="xcwalker" className={css.logo} />
          </div>
          <div className={css.side}></div>
        </SideBySide>
      </Section>
    </>
  );
}
