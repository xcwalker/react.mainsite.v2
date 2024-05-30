import { ProjectItem as ProjectItemType } from "../types";
import css from "../styles/components/projectItem.module.css";
import { Link } from "react-router-dom";

export default function ProjectItem(props: { item: ProjectItemType }) {
  const item = props.item;
  const date = new Date(item.metaData.date.modified);
  
  return (
    <Link className={css.project} to={"/project/" + item.metaData.slug}>
      <div className={css.thumbnail}>
        <img
          src={
            "https://raw.githubusercontent.com/xcwalker/gmod/main/" +
            item.metaData.slug +
            "/" +
            item.metaData.imageDirectory +
            "/" +
            item.data.thumbnail
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
          {date.toLocaleDateString(undefined, {
            weekday: undefined,
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h4>
      </div>
    </Link>
  );
}
