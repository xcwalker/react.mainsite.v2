import css from "../../styles/pages/home/recipes.module.css";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ProjectItemProps } from "../../types";
import getDataByDateFromUser from "../../functions/firebase/storage/getDataByDateFromUser";
import GridItem from "../../components/GridItem";
import Carousel from "../../components/Carousel";

export default function UserProjects(props: { userID: string }) {
  const [projectsArray, setProjectsArray] = useState<
    { id: string; value: ProjectItemProps }[] | undefined
  >();

  useEffect(() => {
    getDataByDateFromUser("projects", props.userID).then((data) => {
      setProjectsArray(data as { id: string; value: ProjectItemProps }[]);
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
                  <GridItem itemType="projects" item={item.value} slug={item.id} href="projects" />
                </Fragment>
              );
            })}
          </Carousel>
      )}
    </>
  );
}
