import css from "../../styles/pages/home/recipes.module.css";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { BlogItemProps } from "../../types";
import getDataByDateFromUser from "../../functions/firebase/storage/getDataByDateFromUser";
import BlogItem from "../../components/BlogItem";
import Carousel from "../../components/Carousel";

export default function UserBlog(props: { userID: string }) {
  const [BlogPosts, setBlogPosts] = useState<
    { id: string; value: BlogItemProps }[] | undefined
  >();

  useEffect(() => {
    getDataByDateFromUser("blog", props.userID).then((data) => {
      setBlogPosts(data as { id: string; value: BlogItemProps }[]);
    });

    return () => {
      setBlogPosts(undefined);
    };
  }, [props.userID]);

  return (
    <>
      {BlogPosts && BlogPosts.length > 0 && (
        <Carousel
          className={css.slider}
          title="Blog"
          multipleViews={true}
          defaultView="column"
        >
          {BlogPosts.map((item, index) => {
            return (
              <Fragment key={index}>
                <BlogItem item={item.value} slug={item.id} />
              </Fragment>
            );
          })}
        </Carousel>
      )}
    </>
  );
}
