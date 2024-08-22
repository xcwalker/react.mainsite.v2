import Section from "../../components/Section";
import css from "../../styles/pages/home/recipes.module.css";
import { Fragment } from "react/jsx-runtime";
import RecipeItem from "../../components/RecipeItem";
import { ButtonLink } from "../../components/Button";
import { useEffect, useState } from "react";

export default function HomeRecipes(props: { limit?: number; title: string }) {
  const [recipesArray, setRecipesArray] =
    useState<[{ slug: string; collection: string }] | undefined>();

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/index.json"
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setRecipesArray(data);
      });

    return () => {
      setRecipesArray(undefined);
    };
  }, []);

  return (
    <Section id="projects" container={{ className: css.container }}>
      <h2>{props.title}</h2>
      <div className={css.slider}>
        {recipesArray &&
          recipesArray.map((item, index) => {
            if (props.limit && index >= props.limit)
              return <Fragment key={index} />;
            else
              return (
                <Fragment key={index}>
                  <RecipeItem slug={item.slug} />
                </Fragment>
              );
          })}
      </div>
      {props.limit && recipesArray && recipesArray.length > props.limit && (
        <ButtonLink href="/recipes" className={css.viewMore}>
          View More
        </ButtonLink>
      )}
    </Section>
  );
}
