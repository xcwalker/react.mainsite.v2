import Section from "../../components/Section";
import css from "../../styles/pages/home/recipes.module.css";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ProjectItem as ProjectItemType } from "../../types";
import getDataByDateFromUser from "../../functions/firebase/storage/getDataByDateFromUser";
import ProjectItem from "../../components/ProjectItem";

export default function UserProjects(props: { userID: string }) {
  const [projectsArray, setProjectsArray] = useState<
    { id: string; value: ProjectItemType }[] | undefined
  >();

  useEffect(() => {
    getDataByDateFromUser("projects", props.userID).then((data) => {
      setProjectsArray(data as { id: string; value: ProjectItemType }[]);
    });

    return () => {
      setProjectsArray(undefined);
    };
  }, []);

  return (
    <>
      {projectsArray && projectsArray.length > 0 && (
        <Section id="projects" container={{ className: css.container }}>
          <h2>Projects</h2>
          <div className={css.slider}>
            {projectsArray.map((item, index) => {
              return (
                <Fragment key={index}>
                  <ProjectItem item={item.value} slug={item.id} />
                </Fragment>
              );
            })}
          </div>
        </Section>
      )}
    </>
  );
}
