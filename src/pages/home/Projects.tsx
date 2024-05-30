import Section from "../../components/Section";
import css from "../../styles/pages/home/projects.module.css";
import { projectsArray } from "../../temp";
import { Fragment } from "react/jsx-runtime";
import ProjectItem from "../../components/ProjectItem";

export default function Projects() {
  return (
    <Section id="projects" container={{ className: css.container }}>
      <h2>Some of our projects</h2>
      <div className={css.slider}>
        {projectsArray.map((item, index) => {
          return (
            <Fragment key={index}>
              <ProjectItem item={item} />
            </Fragment>
          );
        })}
      </div>
    </Section>
  );
}
