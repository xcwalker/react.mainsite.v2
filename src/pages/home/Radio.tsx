import Button from "../../components/Button";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import css from "../../styles/pages/home/radio.module.css";
import Stack from "../../components/Stack";
import { useAtomValue } from "jotai";
import { HomeSettingsAtom, RadioAtom } from "../../App";

export function HomeRadio() {
  const radio = useAtomValue(RadioAtom)
  const homeSettings = useAtomValue(HomeSettingsAtom);

  if (homeSettings?.showRadio === false) {
    return <></>;
  }

  return (
    <Section id="radio">
      {/* <h2>ReactRadio</h2> */}
      <div className={css.radio}>
        <div className={css.container}>
          <img
            src={radio.nowPlaying.artwork}
            alt=""
            className={
              css.background
              //  + " " + css.animated
            }
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
                  <Button
                    href="https://mobile.reactradio.dev"
                    title="Listen on ReactRadio Mobile"
                    style="secondary"
                    width="fit-content"
                  >
                    Mobile
                  </Button>
                  <Button
                    href="https://legacy.reactradio.dev"
                    title="Listen on ReactRadio Legacy"
                    style="secondary"
                    width="fit-content"
                  >
                    Legacy
                  </Button>
                </Stack>
                <Button
                  href="https://www.reactradio.dev"
                  title="Listen on ReactRadio"
                  style="primary"
                  width="fit-content"
                >
                  Listen on ReactRadio
                </Button>
              </Stack>
            </Stack>
          </SideBySide>
        </div>
      </div>
    </Section>
  );
}
