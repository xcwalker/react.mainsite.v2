import Section from "../../components/Section";
import css from "../../styles/pages/home/recipes.module.css";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { BlogItem as BlogItemType } from "../../types";
import getDataByDateFromUser from "../../functions/firebase/storage/getDataByDateFromUser";
import BlogItem from "../../components/BlogItem";

export default function UserBlog(props: { userID: string }) {
  const [BlogPosts, setBlogPosts] = useState<
    { id: string; value: BlogItemType }[] | undefined
  >();

  useEffect(() => {
    getDataByDateFromUser("blog", props.userID).then((data) => {
      setBlogPosts(data as { id: string; value: BlogItemType }[]);
    });

    return () => {
      setBlogPosts(undefined);
    };
  }, []);

  return (
    <>
      {BlogPosts && BlogPosts.length > 0 && (
        <Section id="projects" container={{ className: css.container }}>
          <h2>Blog</h2>
          <div className={css.slider}>
            {BlogPosts.map((item, index) => {
              return (
                <Fragment key={index}>
                  <BlogItem item={item.value} slug={item.id} />
                </Fragment>
              );
            })}
          </div>
        </Section>
      )}
    </>
  );
}
