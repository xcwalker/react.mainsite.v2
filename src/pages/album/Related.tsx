import { Fragment } from "react/jsx-runtime";
import GridItem from "../../components/GridItem";
import css from "../../styles/pages/project/related.module.css";
import { useEffect, useState } from "react";
import getDataByDateExcludeSlugAndSameCollection from "../../functions/firebase/storage/getDataByDateExcludeSlugAndSameCollection";
import getDataByDateExcludeSlugAndDifferentCollection from "../../functions/firebase/storage/getDataByDateExcludeSlugAndDifferentCollection";
import getDataByDateExcludeSlug from "../../functions/firebase/storage/getDataByDateExcludeSlug";
import { ProjectItem as ProjectItemType } from "../../types";
import Carousel from "../../components/Carousel";
import ListItem from "../../components/ListItem";

export default function AlbumRelated(props: {
  slug: string;
  collection?: string;
  sameCollection: boolean;
  title: string;
}) {
  const [otherProjects, setOtherProjects] = useState<
    { id: string; value: ProjectItemType }[] | undefined
  >();

  useEffect(() => {
    if (props.collection && props.sameCollection === true) {
          getDataByDateExcludeSlugAndSameCollection(
            "projects",
            props.slug,
            props.collection
          ).then((data) => {
            setOtherProjects(data as { id: string; value: ProjectItemType }[]);
          });
        } else if (props.collection && props.sameCollection === false) {
          getDataByDateExcludeSlugAndDifferentCollection(
            "projects",
            props.slug,
            props.collection
          ).then((data) => {
            setOtherProjects(data as { id: string; value: ProjectItemType }[]);
          });
        } else {
          getDataByDateExcludeSlug("projects", props.slug).then((data) => {
            setOtherProjects(data as { id: string; value: ProjectItemType }[]);
          });
        }

    return () => {
      setOtherProjects(undefined);
    };
  }, [props]);

  return (
    <>
      {otherProjects && otherProjects.length != 0 && (
        <Carousel
          className={css.scroller}
          title={props.title}
          multipleViews={true}
          defaultView="column"
          listView={
            <>
              {otherProjects.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <ListItem
                      date={item.value.metaData.date.created}
                      title={item.value.data.title}
                      subTitle={item.value.data.subTitle}
                      href={"/album/" + item.id}
                    />
                  </Fragment>
                );
              })}
            </>
          }
        >
          {otherProjects.map((item, index) => {
            return (
              <Fragment key={index}>
                <GridItem slug={item.id} item={item.value} href="album" />
              </Fragment>
            );
          })}
        </Carousel>
      )}
    </>
  );
}
