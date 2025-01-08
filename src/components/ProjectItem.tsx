import { ProjectItem as ProjectItemType } from "../types";
import { Link } from "react-router-dom";
import css from "../styles/components/projectItem.module.css";
import { useEffect, useState } from "react";

export default function ProjectItem(props: {
  slug: string;
  style?: React.CSSProperties;
  item: ProjectItemType;
}) {
  // const [item, setItem] = useState<ProjectItemType | undefined>(undefined);
  const [date, setDate] = useState<Date>();

  // useEffect(() => {
  //   fetch(
  //     "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/projects/" +
  //       props.slug?.toLowerCase() +
  //       "/project.json"
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
          className={css.project}
          to={"/project/" + props.item.metaData.slug}
          style={props.style}
        >
          <div className={css.thumbnail}>
            <img
              src={
                "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/projects/" +
                props.slug.toLowerCase() +
                "/images/thumbnail.jpg"
              }
              alt="Thumbnail"
            />
            {props.item.metaData.collection && (
              <span className={css.collection}>
                {props.item.metaData.collection}
              </span>
            )}
          </div>
          <div className={css.details}>
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
          </div>
        </Link>
      )}
    </>
  );
}
