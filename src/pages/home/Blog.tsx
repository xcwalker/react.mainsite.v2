import Section from "../../components/Section";
import css from "../../styles/pages/home/projects.module.css";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import BlogItem from "../../components/BlogItem";
import { BlogItem as BlogItemType } from "../../types";
import getDataByDateFromUser from "../../functions/firebase/storage/getDataByDateFromUser";
import Carousel from "../../components/Carousel";
import getDataByDate from "../../functions/firebase/storage/getDataByDate";
import ListItem from "../../components/ListItem";

export default function HomeBlog(props: {
  title: string;
  titleLink: boolean;
  onHome?: boolean;
}) {
  const [projectsArray, setProjectsArray] = useState<
    { id: string; value: BlogItemType }[] | undefined
  >();

  useEffect(() => {
    if (props.onHome) {
    getDataByDateFromUser("blog", import.meta.env.VITE_MAIN_USER_ID).then(
      (data) => {
        setProjectsArray(data as { id: string; value: BlogItemType }[]);
      }
    );
  } else {
    getDataByDate("blog").then((data) => {
      setProjectsArray(data as { id: string; value: BlogItemType }[]);
    });
  }

    return () => {
      setProjectsArray(undefined);
    };
  }, []);

  return (
    <Section id="blog" container={{ className: css.container }}>
      <Carousel
        className={css.slider}
        title={props.title}
        multipleViews={true}
        defaultView={props.onHome ? "column" : "grid"}
        titleLink={
          props.titleLink ? { text: "View All", href: "/blog" } : undefined
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
                              href={"/blog/" + item.id}
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
                    <BlogItem slug={item.id} item={item.value} />
                  </Fragment>
                );
            })}
        </>
      </Carousel>
    </Section>
  );
}
