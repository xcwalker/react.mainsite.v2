import { ProjectItem as ProjectItemType } from "../types";
import { Link } from "react-router-dom";
import css from "../styles/components/projectItem.module.css";
import { useEffect, useState } from "react";

export default function ProjectItem(props: {
  slug: string;
  style?: React.CSSProperties;
}) {
  const [item, setItem] = useState<ProjectItemType | undefined>(undefined);
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/projects/" +
        props.slug?.toLowerCase() +
        "/project.json"
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setItem(data);
        setDate(new Date(data.metaData.date.modified));
      });

    return () => {
      setItem(undefined);
      setDate(undefined);
    };
  }, [props.slug]);

  return (
    <>
      {item && (
        <Link
          className={css.project}
          to={"/project/" + item.metaData.slug}
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
            {item.metaData.collection && (
              <span className={css.collection}>{item.metaData.collection}</span>
            )}
          </div>
          <div className={css.details}>
            <h3>{item.data.title}</h3>
            <h4>
              {item.data.subTitle} |{" "}
              {date && date.toLocaleDateString(undefined, {
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
