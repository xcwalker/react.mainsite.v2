import { Link } from "react-router-dom";
import { ButtonLink } from "../../components/Button";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import css from "../../styles/pages/home/radio.module.css";
import Stack from "../../components/Stack";
import { useAtomValue } from "jotai";
import { RadioAtom } from "../../App";

export function HomeRadio() {
  const radio = useAtomValue(RadioAtom)

  return (
    <Section id="radio">
      {/* <h2>ReactRadio</h2> */}
      <div className={css.radio}>
        <div className={css.container}>
          <img
            src={radio.nowPlaying.artwork}
            alt=""
            className={css.background + " " + css.animated}
          />
          <SideBySide leftWidth="250px">
            <img src={radio.nowPlaying.artwork} alt="" className={css.image} />
            <Stack direction={css.stack}>
              <Stack gap="0">
                <span className={css.title}>{radio.nowPlaying.title}</span>
                <span className={css.subTitle}>{radio.nowPlaying.artist}</span>
              </Stack>
              <Stack direction={css.links} gap="0.5rem">
                <Stack direction="row">
                  <Link to="https://mobile.reactradio.dev" className={css.link}>
                    Mobile
                  </Link>
                  <Link to="https://legacy.reactradio.dev" className={css.link}>
                    Legacy
                  </Link>
                </Stack>
                <ButtonLink href="https://www.reactradio.dev">
                  Listen on ReactRadio
                </ButtonLink>
              </Stack>
            </Stack>
          </SideBySide>
        </div>
      </div>
    </Section>
  );
}
