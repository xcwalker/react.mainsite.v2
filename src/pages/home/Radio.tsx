import { Link } from "react-router-dom";
import { ButtonLink } from "../../components/Button";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import css from "../../styles/pages/home/radio.module.css";
import Stack from "../../components/Stack";
import { useEffect, useState } from "react";

export function HomeRadio() {
  const api = "https://apiv2.simulatorradio.com/metadata/combined";
  const [ticking] = useState(true);
  const [count, setCount] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);

  const [nowPlaying, setNowPlaying] = useState({
    title: "",
    artists: "",
    art: "",
  });

  useEffect(() => {
    if (fetching || fetchCount === count) return;
    setFetching(true);

    fetch(api)
      .then(
        (data) => {
          data.json().then((res) => {
            const outNow = {
              title: "",
              artists: "",
              art: "",
            };

            if (res?.now_playing?.title) {
              outNow.title = res?.now_playing?.title;
            } else if (res?.title) {
              outNow.title = res.title;
            } else if (res?.data?.title) {
              outNow.title = res.data.title;
            } else {
              outNow.title = "";
            }

            if (res?.now_playing?.artists) {
              outNow.artists = res?.now_playing?.artists;
            } else if (res?.artist) {
              outNow.artists = res.artist;
            } else if (res?.data?.artist) {
              outNow.artists = res.data.artist;
            } else {
              outNow.artists = "";
            }

            if (res?.now_playing?.art) {
              outNow.art = res?.now_playing?.art;
            } else if (res?.art?.large) {
              outNow.art = res.art.large;
            } else if (res?.data?.album_art) {
              outNow.art = res.data.album_art;
            } else {
              outNow.art = "";
            }

            setNowPlaying(outNow);
          });
        },
        (error) => {
          console.error(error);
        }
      )
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setFetching(false);
        setFetchCount(count);
      });
  }, [count, fetching, fetchCount, api]);

  useEffect(() => {
    const timer = setTimeout(() => ticking && setCount(count + 1), Math.min(6000, count * 1000));
    return () => {
      clearTimeout(timer);
    };
  }, [count, ticking]);

  

  return (
    <Section id="radio">
      {/* <h2>ReactRadio</h2> */}
      <div className={css.radio}>
        <div className={css.container}>
          <img src={nowPlaying.art} alt="" className={css.background + " " + css.animated} />
          <SideBySide leftWidth="250px">
            <img src={nowPlaying.art} alt="" className={css.image} />
            <Stack direction={css.stack}>
              <Stack gap="0">
                <span className={css.title}>{nowPlaying.title}</span>
                <span className={css.subTitle}>{nowPlaying.artists}</span>
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
