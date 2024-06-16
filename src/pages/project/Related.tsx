import { Fragment } from "react/jsx-runtime";
import Section from "../../components/Section";
import { projectsArray } from "../../temp";
import ProjectItem from "../../components/ProjectItem";
import css from "../../styles/pages/project/related.module.css";

export default function Related(props: {
  slug: string;
  collection?: string;
  sameCollection: boolean;
  title: string;
}) {
  const otherProjects = projectsArray.filter(
    (project) =>
      props.slug &&
      project.slug.toLowerCase() !== props.slug.toLowerCase() &&
      ((!props.sameCollection && project.collection !== props.collection) ||
        (props.sameCollection && project.collection === props.collection))
  );

  return (
    <>
      {otherProjects.length != 0 && (
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
