import css from "../../styles/pages/dashboard/radio.module.css";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";
import { RadioAtom } from "../../App";
import { useAtomValue } from "jotai";

export default function DashboardRadio() {
  const radio = useAtomValue(RadioAtom)

  return (
    <section className={css.radio}>
      <div className={css.container}>
        <Logo type="ReactRadio" className={css.logo} />
        <img src={radio.nowPlaying.artwork} alt="" className={css.background} />
        <img src={radio.nowPlaying.artwork} alt="" className={css.image} />
        <div className={css.text}>
          <span className={css.title}>{radio.nowPlaying.title}</span>
          <span className={css.subTitle}>{radio.nowPlaying.artist}</span>
        </div>
        <div className={css.links}>
          <Link to="https://www.reactradio.dev" className={css.link}>
            ReactRadio
          </Link>
          <Link to="https://mobile.reactradio.dev" className={css.link}>
            Mobile
          </Link>
          <Link to="https://legacy.reactradio.dev" className={css.link}>
            Legacy
          </Link>
        </div>
      </div>
    </section>
  );
}
