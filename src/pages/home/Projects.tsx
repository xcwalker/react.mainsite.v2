import Section from "../../components/Section";
import css from "../../styles/pages/home/projects.module.css";
import { Fragment } from "react/jsx-runtime";
import ProjectItem from "../../components/ProjectItem";
import { useEffect, useState } from "react";
import { ProjectItem as ProjectItemType } from "../../types";
import getDataByDateFromUser from "../../functions/firebase/storage/getDataByDateFromUser";
import Carousel from "../../components/Carousel";
import getDataByDate from "../../functions/firebase/storage/getDataByDate";
import ListItem from "../../components/ListItem";

export default function HomeProjects(props: {
  title: string;
  titleLink: boolean;
  onHome?: boolean;
}) {
  const [projectsArray, setProjectsArray] = useState<
    { id: string; value: ProjectItemType }[] | undefined
  >();

  useEffect(() => {
    if (props.onHome) {
    getDataByDateFromUser("projects", import.meta.env.VITE_MAIN_USER_ID).then(
      (data) => {
        setProjectsArray(data as { id: string; value: ProjectItemType }[]);
      }
    );
  } else {
    getDataByDate("projects").then((data) => {
      setProjectsArray(data as { id: string; value: ProjectItemType }[]);
    });
  }

    return () => {
      setProjectsArray(undefined);
    };
  }, []);

  return (
    <Section id="projects" container={{ className: css.container }}>
      <Carousel
        className={css.slider}
        title={props.title}
        multipleViews={true}
        defaultView={props.onHome ? "column" : "grid"}
        titleLink={
          props.titleLink ? { text: "View All", href: "/project" } : undefined
        }
        listView={
          <>
            {projectsArray &&
              projectsArray.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <ListItem
                      title={item.value.data.title}
                      subTitle={item.value.data.subTitle}
                      date={item.value.metaData.date.created}
                      href={"/project/" + item.id}
                    />
                  </Fragment>
                );
              })}
          </>
        }
      >
        <>
          {projectsArray &&
            projectsArray.map((item, index) => {
              return (
                <Fragment key={index}>
                  <ProjectItem slug={item.id} item={item.value} />
                </Fragment>
              );
            })}
        </>
      </Carousel>
    </Section>
  );
}
