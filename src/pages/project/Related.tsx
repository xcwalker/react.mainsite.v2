import { Fragment } from "react/jsx-runtime";
import Section from "../../components/Section";
import ProjectItem from "../../components/ProjectItem";
import css from "../../styles/pages/project/related.module.css";
import { useEffect, useState } from "react";

export default function ProjectRelated(props: {
  slug: string;
  collection?: string;
  sameCollection: boolean;
  title: string;
}) {
  const [otherProjects, setOtherProjects] = useState<
    { slug: string; collection: string }[] | undefined
  >();

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/projects/index.json"
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setOtherProjects(
          data.filter(
            (project: { slug: string; collection: string }) =>
              props.slug &&
              project.slug.toLowerCase() !== props.slug.toLowerCase() &&
              ((!props.sameCollection &&
                project.collection !== props.collection) ||
                (props.sameCollection &&
                  project.collection === props.collection))
          )
        );
      });

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
              {
                console.log(item.collection, props.collection);
              }
              return (
                <Fragment key={index}>
                  <ProjectItem slug={item.slug} />
                </Fragment>
              );
            })}
          </div>
        </Section>
      )}
    </>
  );
}
