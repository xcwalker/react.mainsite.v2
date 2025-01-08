import Section from "../../components/Section";
import css from "../../styles/pages/home/recipes.module.css";
import { Fragment } from "react/jsx-runtime";
import RecipeItem from "../../components/RecipeItem";
import { ButtonLink } from "../../components/Button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RecipeItem as RecipeItemType } from "../../types";
import getDataByDate from "../../functions/firebase/storage/getDataByDate";

export default function HomeRecipes(props: {
  limit?: number;
  title: string;
  titleLink: boolean;
}) {
  const [recipesArray, setRecipesArray] = useState<
    { id: string; value: RecipeItemType }[] | undefined
  >();

  useEffect(() => {
    // fetch(
    //   "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/index.json"
    // )
    //   .then((res) => {
    //     return res.json();
    //   })

    getDataByDate("recipes")
      .then((data) => {
        setRecipesArray(data);
      });

    return () => {
      setRecipesArray(undefined);
    };
  }, []);

  return (
    <Section id="projects" container={{ className: css.container }}>
      {!props.titleLink && <h2>{props.title}</h2>}
      {props.titleLink && (
        <Link to="/recipe" className={css.titleLink}>
          <h2>{props.title}</h2>
        </Link>
      )}
      <div className={css.slider}>
        {recipesArray &&
          recipesArray.map((item, index) => {
            if (props.limit && index >= props.limit)
              return <Fragment key={index} />;
            else
              return (
                <Fragment key={index}>
                  <RecipeItem item={item.value} slug={item.id} />
                </Fragment>
              );
          })}
      </div>
      {props.limit && recipesArray && recipesArray.length > props.limit && (
        <ButtonLink href="/recipe" className={css.viewMore}>
          View More
        </ButtonLink>
      )}
    </Section>
  );
}
