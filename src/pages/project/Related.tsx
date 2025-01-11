import { Fragment } from "react/jsx-runtime";
import Section from "../../components/Section";
import ProjectItem from "../../components/ProjectItem";
import css from "../../styles/pages/project/related.module.css";
import { useEffect, useState } from "react";
import getDataByDateExcludeSlugAndSameCollection from "../../functions/firebase/storage/getDataByDateExcludeSlugAndSameCollection";
import getDataByDateExcludeSlugAndDifferentCollection from "../../functions/firebase/storage/getDataByDateExcludeSlugAndDifferentCollection";
import getDataByDateExcludeSlug from "../../functions/firebase/storage/getDataByDateExcludeSlug";
import { ProjectItem as ProjectItemType } from "../../types";

export default function ProjectRelated(props: {
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
        <Section id="related" container={{ className: css.container }}>
          <h2>{props.title}</h2>
          <div className={css.scroller}>
            {otherProjects.map((item, index) => {
              return (
                <Fragment key={index}>
                  <ProjectItem slug={item.id} item={item.value} />
                </Fragment>
              );
            })}
          </div>
        </Section>
      )}
    </>
  );
}
