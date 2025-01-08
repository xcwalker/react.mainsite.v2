import { Fragment } from "react/jsx-runtime";
import Section from "../../components/Section";
import css from "../../styles/pages/project/related.module.css";
import RecipeItem from "../../components/RecipeItem";
import { useEffect, useState } from "react";
import getRecipesByDateExcludeSlugAndSameCollection from "../../functions/firebase/storage/extra/getRecipesByDateExcludeSlugAndSameCollection";
import getRecipesByDateExcludeSlugAndDifferentCollection from "../../functions/firebase/storage/extra/getRecipesByDateExcludeSlugAndDifferentCollection";
import getRecipesByDateExcludeSlug from "../../functions/firebase/storage/extra/getRecipesByDateExcludeSlug";
import { RecipeItem as RecipeItemType } from "../../types";

export default function RecipeRelated(props: {
  slug: string;
  collection?: string;
  sameCollection: boolean;
  title: string;
}) {
  const [otherRecipes, setOtherRecipes] = useState<
    { id: string; value: RecipeItemType }[] | undefined
  >();

  useEffect(() => {
    // fetch(
    //   "https://raw.githubusercontent.com/xcwalker/mainsite.data/main/recipes/index.json"
    // )
    //   .then((res) => {
    //     return res.json();
    //   })
    if (props.collection && props.sameCollection === true) {
      getRecipesByDateExcludeSlugAndSameCollection(
        props.slug,
        props.collection
      ).then((data) => {
        setOtherRecipes(data);
      });
    } else if (props.collection && props.sameCollection === false) {
      getRecipesByDateExcludeSlugAndDifferentCollection(
        props.slug,
        props.collection
      ).then((data) => {
        setOtherRecipes(data);
      });
    } else {
      getRecipesByDateExcludeSlug(props.slug).then((data) => {
        setOtherRecipes(data);
      });
    }

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
                  <RecipeItem slug={item.id} item={item.value} />
                </Fragment>
              );
            })}
          </div>
        </Section>
      )}
    </>
  );
}
