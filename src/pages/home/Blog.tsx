import Section from "../../components/Section";
import css from "../../styles/pages/home/projects.module.css";
import { Fragment } from "react/jsx-runtime";
import { ButtonLink } from "../../components/Button";
import { useEffect, useState } from "react";
import BlogItem from "../../components/BlogItem";
import { Link } from "react-router-dom";

export default function HomeBlog(props: {
  limit?: number;
  title: string;
  titleLink: boolean;
}) {
  const [projectsArray, setProjectsArray] = useState<
    [{ slug: string; collection: string }] | undefined
  >();

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/blog/index.json"
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
    <Section id="blog" container={{ className: css.container }}>
      {!props.titleLink && <h2>{props.title}</h2>}
      {props.titleLink && (
        <Link to="/blog" className={css.titleLink}>
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
                  <BlogItem slug={item.slug} />
                </Fragment>
              );
          })}
      </div>
      {props.limit && projectsArray && projectsArray.length > props.limit && (
        <ButtonLink href="/blog" className={css.viewMore}>
          View More
        </ButtonLink>
      )}
    </Section>
  );
}
