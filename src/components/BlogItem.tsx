import { Link } from "react-router-dom";
import css from "../styles/components/blogItem.module.css";
import { useEffect, useState } from "react";
import { BlogItem as BlogItemType } from "../types";

export default function BlogItem(props: {
  slug: string;
  style?: React.CSSProperties;
  item: BlogItemType;
}) {
  // const [item, setItem] = useState<ProjectItemType | undefined>(undefined);
  const [date, setDate] = useState<Date>();

  // useEffect(() => {
  //   fetch(
  //     "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/blog/" +
  //       props.slug?.toLowerCase() +
  //       "/blog.json"
  //   )
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setItem(data);
  //       setDate(new Date(data.metaData.date.modified));
  //     });

  //   return () => {
  //     setItem(undefined);
  //     setDate(undefined);
  //   };
  // }, [props.slug]);

  useEffect(() => {
    setDate(new Date(props.item.metaData.date.modified));
  }, [props.item]);

  return (
    <>
      {props.item && (
        <Link
          className={css.blog}
          to={"/blog/" + props.slug}
          style={props.style}
        >
          <h3>{props.item.data.title}</h3>
          <h4>
            {props.item.data.subTitle} |{" "}
            {date &&
              date.toLocaleDateString(undefined, {
                weekday: undefined,
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </h4>
        </Link>
      )}
    </>
  );
}
