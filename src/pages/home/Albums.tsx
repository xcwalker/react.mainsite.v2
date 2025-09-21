import Section from "../../components/Section";
import css from "../../styles/pages/home/projects.module.css";
import { Fragment } from "react/jsx-runtime";
import GridItem from "../../components/GridItem";
import { useEffect, useState } from "react";
import { AlbumItemProps as AlbumItemType } from "../../types";
import getDataByDateFromUser from "../../functions/firebase/storage/getDataByDateFromUser";
import Carousel from "../../components/Carousel";
import getDataByDate from "../../functions/firebase/storage/getDataByDate";
import ListItem from "../../components/ListItem";

export default function HomeAlbums(props: {
  title: string;
  titleLink: boolean;
  onHome?: boolean;
}) {
  const [albumsArray, setAlbumsArray] = useState<
    { id: string; value: AlbumItemType }[] | undefined
  >();

  useEffect(() => {
    if (props.onHome) {
      getDataByDateFromUser("albums", import.meta.env.VITE_MAIN_USER_ID).then(
        (data) => {
          setAlbumsArray(data as { id: string; value: AlbumItemType }[]);
        }
      );
    } else {
      getDataByDate("albums").then((data) => {
        setAlbumsArray(data as { id: string; value: AlbumItemType }[]);
      });
    }

    return () => {
      setAlbumsArray(undefined);
    };
  }, [props.onHome]);

  return (
    <Section id="projects" container={{ className: css.container }}>
      <Carousel
        className={css.slider}
        title={props.title}
        multipleViews={true}
        defaultView={props.onHome ? "column" : "grid"}
        titleLink={
          props.titleLink ? { text: "View All", href: "/albums" } : undefined
        }
        listView={
          <>
            {albumsArray &&
              albumsArray.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <ListItem
                      title={item.value.data.title}
                      subTitle={item.value.data.subTitle}
                      date={item.value.metaData.date.created}
                      href={"/albums/" + item.id}
                    />
                  </Fragment>
                );
              })}
          </>
        }
      >
        <>
          {albumsArray &&
            albumsArray.map((item, index) => {
              return (
                <Fragment key={index}>
                  <GridItem
                    slug={item.id}
                    item={item.value}
                    href="albums"
                  />
                </Fragment>
              );
            })}
        </>
      </Carousel>
    </Section>
  );
}
