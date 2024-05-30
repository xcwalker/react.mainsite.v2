import { Fragment } from "react/jsx-runtime";
import Section from "../../components/Section";
import { projectsArray } from "../../temp";
import { ProjectItem as ProjectItemType } from "../../types";
import ProjectItem from "../../components/ProjectItem";
import css from "../../styles/pages/project/related.module.css";

export default function Related(props: {
  item: ProjectItemType;
  sameCollection: boolean;
  title: string;
}) {
  const otherProjects = projectsArray.filter(
    (project) =>
      project.metaData.slug !== props.item.metaData.slug &&
      ((!props.sameCollection &&
        project.metaData.collection !== props.item.metaData.collection) ||
        (props.sameCollection &&
          project.metaData.collection === props.item.metaData.collection))
  );
  projectsArray.filter((project) =>
    console.log(
      props.sameCollection,
      project.metaData.slug,
      props.item.metaData.slug,
      project.metaData.slug !== props.item.metaData.slug,
      !props.sameCollection &&
        project.metaData.collection !== props.item.metaData.collection,
      props.sameCollection &&
        project.metaData.collection === props.item.metaData.collection
    )
  );

  return (
    <>
      {otherProjects.length != 0 && <Section id="related" container={{ className: css.container }}>
        <h2>{props.title}</h2>
        <div className={css.scroller}>
          {otherProjects.map((item, index) => {
            return (
              <Fragment key={index}>
                <ProjectItem item={item} />
              </Fragment>
            );
          })}
        </div>
      </Section>}
    </>
  );
}
