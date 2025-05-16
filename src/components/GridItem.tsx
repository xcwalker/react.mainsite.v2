import { GridItem as GridItemType } from "../types";
import { Link } from "react-router-dom";
import css from "../styles/components/gridItem.module.css";
import { useEffect, useState } from "react";
import Image from "./Image";

export default function GridItem(props: {
  slug: string;
  style?: React.CSSProperties;
  item: GridItemType;
  href?: string;
  itemType: "projects" | "recipes" | "albums" | "blog";
  hasThumbnail?: boolean;
}) {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    setDate(new Date(props.item.metaData.date.modified));
  }, [props.item]);

  return (
    <>
      {props.item && (
        <Link
          className={
            css.gridItem +
            " " +
            (props.hasThumbnail === false && props.hasThumbnail !== undefined
              ? css.noThumbnail
              : "")
          }
          to={"/" + props.href + "/" + props.slug}
          style={props.style}
        >
          {(props.hasThumbnail === undefined ||
            props.hasThumbnail === true) && (
            <Image
              src={props.item.metaData?.thumbnail}
              alt="Thumbnail"
              className={css.thumbnail}
            >
              {props.item.metaData.collection && (
                <span className={css.collection}>
                  {props.item.metaData.collection}
                </span>
              )}
            </Image>
          )}
          {/* <div className={css.thumbnail}>
            <img
              src={
                "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/" +
                props.itemType +
                "/" +
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
          </div> */}
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
