import css from "../../styles/pages/dashboard/radio.module.css";
import Logo from "../../components/Logo";
import { RadioAtom } from "../../App";
import { useAtom } from "jotai";
import GFIcon from "../../components/GFIcon";

export default function DashboardRadio() {
  const [radio, setRadio] = useAtom(RadioAtom);

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
        <div className={css.controls}>
          <button
            onClick={() => {
              setRadio({
                ...radio,
                state: radio.state === "playing" ? "paused" : "playing",
              });
            }}
            title={radio.state === "playing" ? "Pause" : "Play"}
          >
            <GFIcon>
              {radio.state === "playing" ? "pause" : "play_arrow"}
            </GFIcon>
          </button>
          <input
            type="range"
            name=""
            id=""
            value={radio.volume}
            min={0}
            max={100}
            step={1}
            onChange={(e) => {
              setRadio({
                ...radio,
                volume: parseInt(e.target.value),
              });
              const audio = document.querySelector("audio");
              if (audio) {
                audio.volume = parseInt(e.target.value) / 100;
              }
            }}
            onLoad={() => {
              const audio = document.querySelector("audio");
              if (audio) {
                audio.volume = radio.volume / 100;
              }
            }}
            title="Volume"
          />
        </div>
        {/* <div className={css.links}>
          <Link to="https://www.reactradio.dev" className={css.link}>
            ReactRadio
          </Link>
          <Link to="https://mobile.reactradio.dev" className={css.link}>
            Mobile
          </Link>
          <Link to="https://legacy.reactradio.dev" className={css.link}>
            Legacy
          </Link>
        </div> */}
      </div>
    </section>
  );
}
