import { Fragment } from "react/jsx-runtime";
import Section from "../../components/Section";
import css from "../../styles/pages/project/related.module.css";
import RecipeItem from "../../components/RecipeItem";
import { useEffect, useState } from "react";

export default function Related(props: {
  slug: string;
  collection?: string;
  sameCollection: boolean;
  title: string;
}) {
  const [otherRecipes, setOtherRecipes] = useState<
    { slug: string; collection: string }[] | undefined
  >();

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/index.json"
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setOtherRecipes(
          data.filter(
            (recipe: { slug: string; collection: string }) =>
              props.slug &&
              recipe.slug.toLowerCase() !== props.slug.toLowerCase() &&
              ((!props.sameCollection &&
                recipe.collection !== props.collection) ||
                (props.sameCollection &&
                  recipe.collection === props.collection))
          )
        );
      });

    return () => {
      setOtherRecipes(undefined);
    };
  }, [props]);

  return (
    <>
      {otherRecipes && otherRecipes.length != 0 && (
        <Section id="related" container={{ className: css.container }}>
          <h2>{props.title}</h2>
          <div className={css.scroller}>
            {otherRecipes.map((item, index) => {
              return (
                <Fragment key={index}>
                  <RecipeItem slug={item.slug} />
                </Fragment>
              );
            })}
          </div>
        </Section>
      )}
    </>
  );
}
