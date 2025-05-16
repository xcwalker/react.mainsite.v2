import Section from "../../components/Section";
import css from "../../styles/pages/home/projects.module.css";
import { Fragment } from "react/jsx-runtime";
import GridItem from "../../components/GridItem";
import { useEffect, useState } from "react";
import { ItemType } from "../../types";
import getDataByDateFromUser from "../../functions/firebase/storage/getDataByDateFromUser";
import Carousel from "../../components/Carousel";
import getDataByDate from "../../functions/firebase/storage/getDataByDate";
import ListItem from "../../components/ListItem";

export default function HomeCarousel(props: {
  title: string;
  titleLink?: "projects" | "albums" | "recipes" | "blog";
  onHome?: boolean;
  itemType: "projects" | "albums" | "recipes" | "blog";
}) {
  const [projectsArray, setProjectsArray] = useState<
    { id: string; value: ItemType }[] | undefined
  >();

  useEffect(() => {
    if (props.onHome) {
      getDataByDateFromUser(
        props.itemType,
        import.meta.env.VITE_MAIN_USER_ID
      ).then((data) => {
        setProjectsArray(data as { id: string; value: ItemType }[]);
      });
    } else {
      getDataByDate(props.itemType).then((data) => {
        setProjectsArray(data as { id: string; value: ItemType }[]);
      });
    }

    return () => {
      setProjectsArray(undefined);
    };
  }, [props.onHome, props.itemType]);

  return (
    <Section id={props.itemType} container={{ className: css.container }}>
      <Carousel
        className={css.slider}
        title={props.title}
        multipleViews={true}
        defaultView={props.onHome ? "column" : "grid"}
        titleLink={
          props.titleLink
            ? { text: "View All", href: "/" + props.titleLink }
            : undefined
        }
        listView={
          <>
            {projectsArray &&
              projectsArray.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <ListItem
                      title={item.value.data.title}
                      subTitle={item.value.data.subTitle}
                      date={item.value.metaData.date.created}
                      href={"/" + props.itemType + "/" + item.id}
                    />
                  </Fragment>
                );
              })}
          </>
        }
      >
        <>
          {projectsArray &&
            projectsArray.map((item, index) => {
              return (
                <Fragment key={index}>
                  <GridItem
                    itemType={props.itemType}
                    slug={item.id}
                    item={item.value}
                    href={props.itemType}
                  />
                </Fragment>
              );
            })}
        </>
      </Carousel>
    </Section>
  );
}
