import Section from "../../components/Section";
import css from "../../styles/pages/home/projects.module.css";
import { projectsArray } from "../../temp";
import { Fragment } from "react/jsx-runtime";
import ProjectItem from "../../components/ProjectItem";
import { ButtonLink } from "../../components/Button";

export default function Projects(props: { limit?: number; title: string }) {
  return (
    <Section id="projects" container={{ className: css.container }}>
      <h2>{props.title}</h2>
      <div className={css.slider}>
        {projectsArray.map((item, index) => {
          if (props.limit && index >= props.limit)
            return <Fragment key={index} />;
          else
            return (
              <Fragment key={index}>
                <ProjectItem slug={item.slug} />
              </Fragment>
            );
        })}
      </div>
      {props.limit && projectsArray.length > props.limit && (
        <ButtonLink href="/projects" className={css.viewMore}>
          View More
        </ButtonLink>
      )}
    </Section>
  );
}
