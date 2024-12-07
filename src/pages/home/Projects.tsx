import Section from "../../components/Section";
import css from "../../styles/pages/home/projects.module.css";
import { Fragment } from "react/jsx-runtime";
import ProjectItem from "../../components/ProjectItem";
import { ButtonLink } from "../../components/Button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HomeProjects(props: {
  limit?: number;
  title: string;
  titleLink: boolean;
}) {
  const [projectsArray, setProjectsArray] = useState<
    [{ slug: string; collection: string }] | undefined
  >();

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/projects/index.json"
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProjectsArray(data);
      });

    return () => {
      setProjectsArray(undefined);
    };
  }, []);

  return (
    <Section id="projects" container={{ className: css.container }}>
      {!props.titleLink && <h2>{props.title}</h2>}
      {props.titleLink && (
        <Link to="/project" className={css.titleLink}>
          <h2>{props.title}</h2>
        </Link>
      )}
      <div className={css.slider}>
        {projectsArray &&
          projectsArray.map((item, index) => {
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
      {props.limit && projectsArray && projectsArray.length > props.limit && (
        <ButtonLink href="/project" className={css.viewMore}>
          View More
        </ButtonLink>
      )}
    </Section>
  );
}
