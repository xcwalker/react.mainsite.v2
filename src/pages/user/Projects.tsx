import css from "../../styles/pages/home/recipes.module.css";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ProjectItem as ProjectItemType } from "../../types";
import getDataByDateFromUser from "../../functions/firebase/storage/getDataByDateFromUser";
import ProjectItem from "../../components/ProjectItem";
import Carousel from "../../components/Carousel";

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
          <Carousel className={css.slider} title="Projects" multipleViews={true} defaultView="column">
            {projectsArray.map((item, index) => {
              return (
                <Fragment key={index}>
                  <ProjectItem item={item.value} slug={item.id} />
                </Fragment>
              );
            })}
          </Carousel>
      )}
    </>
  );
}
