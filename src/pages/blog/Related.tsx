import { Fragment } from "react/jsx-runtime";
import Section from "../../components/Section";
import css from "../../styles/pages/project/related.module.css";
import { useEffect, useState } from "react";
import { BlogItem as BlogItemType } from "../../types";
import getDataByDateExcludeSlugAndSameCollection from "../../functions/firebase/storage/getDataByDateExcludeSlugAndSameCollection";
import getDataByDateExcludeSlugAndDifferentCollection from "../../functions/firebase/storage/getDataByDateExcludeSlugAndDifferentCollection";
import getDataByDateExcludeSlug from "../../functions/firebase/storage/getDataByDateExcludeSlug";
import BlogItem from "../../components/BlogItem";

export default function BlogRelated(props: {
  slug: string;
  collection?: string;
  sameCollection: boolean;
  title: string;
}) {
  const [otherBlogPosts, setOtherBlogPosts] = useState<
    { id: string; value: BlogItemType }[] | undefined
  >();

  useEffect(() => {
    if (props.collection && props.sameCollection === true) {
      getDataByDateExcludeSlugAndSameCollection(
        "blog",
        props.slug,
        props.collection
      ).then((data) => {
        setOtherBlogPosts(data as { id: string; value: BlogItemType }[]);
      });
    } else if (props.collection && props.sameCollection === false) {
      getDataByDateExcludeSlugAndDifferentCollection(
        "blog",
        props.slug,
        props.collection
      ).then((data) => {
        setOtherBlogPosts(data as { id: string; value: BlogItemType }[]);
      });
    } else {
      getDataByDateExcludeSlug("blog", props.slug).then((data) => {
        setOtherBlogPosts(data as { id: string; value: BlogItemType }[]);
      });
    }

    return () => {
      setOtherBlogPosts(undefined);
    };
  }, [props]);

  return (
    <>
      {otherBlogPosts && otherBlogPosts.length != 0 && (
        <Section id="related" container={{ className: css.container }}>
          <h2>{props.title}</h2>
          <div className={css.scroller}>
            {otherBlogPosts.map((item, index) => {
              return (
                <Fragment key={index}>
                  <BlogItem slug={item.id} item={item.value} />
                </Fragment>
              );
            })}
          </div>
        </Section>
      )}
    </>
  );
}
