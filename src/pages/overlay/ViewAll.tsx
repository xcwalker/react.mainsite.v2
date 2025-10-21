import { Fragment } from "react/jsx-runtime";
import Carousel from "../../components/Carousel";
import Section from "../../components/Section";
import css from "../../styles/pages/overlay/viewAll.module.css";
import { Preview } from "./Preview";
import { overlayType } from "../../types";
import { useEffect, useState } from "react";
import ListItem from "../../components/ListItem";
import getDataByDateFromUser from "../../functions/firebase/storage/getDataByDateFromUser";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { Link } from "react-router-dom";
import devConsole from "../../functions/devConsole";

export function OverlayViewAll() {
  const [overlays, setOverlays] = useState<({value: overlayType, id:string})[]>([]);
  const currentUser = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    getDataByDateFromUser("overlays", currentUser.uid).then((data) => {
      devConsole.log(data);
      setOverlays(data as { value: overlayType; id: string }[]);
    });
  }, [currentUser]);

  return <Section id="overlay-view-all">
    <Carousel
      className={css.carousel}
      title="Your Overlays"
      multipleViews={true}
      defaultView="grid"
      showCreateButton="overlay"
      listView={
        <>
          {overlays.map((overlay, index) => (
            <Fragment key={index}>
              <ListItem
                title={overlay.value.data.title}
                subTitle=""
                date={overlay.value.metaData.date.modified}
                href={"./" + overlay.id}
              />
            </Fragment>
          ))}
        </>
      }
    >
      <>
      {overlays.map(overlay => (
        <Fragment key={overlay.id}>
          <OverlayCard overlay={overlay.value} id={overlay.id} />
        </Fragment>
      ))}
      </>
    </Carousel>
  </Section>;
}

function OverlayCard(props: { overlay: overlayType; id: string }) {
  return (
    <Link to={`./${props.id}`} className={css.card}>
      <Preview overlay={props.overlay} className={css.preview} size="small" />
      <div className={css.details}>
        <h3 className={css.title}>{props.overlay.data.title}</h3>
        <h4 className={css.date}>
          {new Date(props.overlay.metaData.date.modified).toLocaleDateString(
            undefined,
            {
              weekday: undefined,
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}
        </h4>
      </div>
    </Link>
  );
}