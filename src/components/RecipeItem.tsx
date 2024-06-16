import { RecipeItem as RecipeItemType } from "../types";
import { Link } from "react-router-dom";
import css from "../styles/components/recipeItem.module.css";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function RecipeItem(props: {
  slug: string;
  style?: React.CSSProperties;
}) {
  const [item, setItem] = useState<RecipeItemType | undefined>(undefined);
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/" +
        props.slug?.toLowerCase() +
        "/recipe.json"
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
          className={css.recipe}
          to={"/recipe/" + props.slug}
          style={props.style}
        >
          <div className={css.thumbnail}>
            <picture>
              <source
                srcSet={
                  "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/" +
                  props.slug.toLowerCase() +
                  "/images/thumbnail.webp"
                }
                type="image/webp"
              />
              <source
                srcSet={
                  "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/" +
                  props.slug.toLowerCase() +
                  "/images/thumbnail.jpg"
                }
                type="image/jpg"
              />
              <img
                src={
                  "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/" +
                  props.slug.toLowerCase() +
                  "/images/thumbnail.webp"
                }
                className={css.thumbnail}
                alt="Thumbnail"
              />
            </picture>
            {item.metaData.collection && (
              <span className={css.collection}>{item.metaData.collection}</span>
            )}
            {item.metaData.author &&
              item.metaData.author.name.toLowerCase() === "xander walker" && (
                <div
                  className={css.logo}
                  style={
                    {
                      "--_color-dark": item.metaData.colors.dark,
                      "--_color-light": item.metaData.colors.light,
                    } as React.CSSProperties
                  }
                >
                  <Logo className={css.logoSVG} type="X" />
                </div>
              )}
          </div>
          <div className={css.details}>
            <h3>{item.data.title}</h3>
            <h4>
              {item.data.subTitle} |{" "}
              {date &&
                date.toLocaleDateString(undefined, {
                  weekday: undefined,
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </h4>
          </div>
          <div
            className={css.background}
            style={
              {
                "--_color-dark": item.metaData.colors.dark,
                "--_color-light": item.metaData.colors.light,
              } as React.CSSProperties
            }
          />
        </Link>
      )}
    </>
  );
}
