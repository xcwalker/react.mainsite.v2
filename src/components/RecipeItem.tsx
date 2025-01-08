import { RecipeItem as RecipeItemType } from "../types";
import { Link } from "react-router-dom";
import css from "../styles/components/recipeItem.module.css";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function RecipeItem(props: {
  item: RecipeItemType;
  slug: string;
  style?: React.CSSProperties;
}) {
  const [date, setDate] = useState<Date>();

  // useEffect(() => {
  //   fetch(
  //     "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/" +
  //       props.slug?.toLowerCase() +
  //       "/recipe.json"
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

  return (
    <>
      {props.item && (
        <Link
          className={css.recipe}
          to={"/recipe/" + props.slug}
          style={props.style}
        >
          <div className={css.thumbnail}>
            <picture className={css.image}>
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
                alt=""
              />
              <div className={css.thumbnail + " " + css.placeholder}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 180.12 139.79"
                >
                  <g
                    paintOrder="fill markers stroke"
                    transform="translate(-13.59 -66.639)"
                  >
                    <path
                      fill="#d0d0d0"
                      d="M13.591 66.639h180.12v139.79H13.591z"
                    />
                    <path
                      fill="#fff"
                      d="m118.51 133.51-34.249 34.249-15.968-15.968-41.938 41.937h152.37z"
                      opacity={0.675}
                    />
                    <circle
                      cx={58.217}
                      cy={108.56}
                      r={11.773}
                      fill="#fff"
                      opacity={0.675}
                    />
                    <path fill="none" d="M26.111 77.634h152.61v116.1H26.111z" />
                  </g>
                </svg>
              </div>
            </picture>
            {props.item.metaData.collection && (
              <span className={css.collection}>
                {props.item.metaData.collection}
              </span>
            )}
            {props.item.metaData.author &&
              props.item.metaData.author.name.toLowerCase() ===
                "xander walker" && (
                <div
                  className={css.logo}
                  style={
                    {
                      "--_color-dark": props.item.metaData.colors.dark,
                      "--_color-light": props.item.metaData.colors.light,
                    } as React.CSSProperties
                  }
                >
                  <Logo className={css.logoSVG} type="X" />
                </div>
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
          <div
            className={css.background}
            style={
              {
                "--_color-dark": props.item.metaData.colors.dark,
                "--_color-light": props.item.metaData.colors.light,
              } as React.CSSProperties
            }
          />
        </Link>
      )}
    </>
  );
}
