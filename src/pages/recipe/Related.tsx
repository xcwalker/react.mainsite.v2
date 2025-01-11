import { Fragment } from "react/jsx-runtime";
import Section from "../../components/Section";
import css from "../../styles/pages/project/related.module.css";
import RecipeItem from "../../components/RecipeItem";
import { useEffect, useState } from "react";
import { RecipeItem as RecipeItemType } from "../../types";
import getDataByDateExcludeSlugAndSameCollection from "../../functions/firebase/storage/getDataByDateExcludeSlugAndSameCollection";
import getDataByDateExcludeSlugAndDifferentCollection from "../../functions/firebase/storage/getDataByDateExcludeSlugAndDifferentCollection";
import getDataByDateExcludeSlug from "../../functions/firebase/storage/getDataByDateExcludeSlug";

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
      getDataByDateExcludeSlugAndSameCollection(
        "recipes",
        props.slug,
        props.collection
      ).then((data) => {
        setOtherRecipes(data as { id: string; value: RecipeItemType }[]);
      });
    } else if (props.collection && props.sameCollection === false) {
      getDataByDateExcludeSlugAndDifferentCollection(
        "recipes",
        props.slug,
        props.collection
      ).then((data) => {
        setOtherRecipes(data as { id: string; value: RecipeItemType }[]);
      });
    } else {
      getDataByDateExcludeSlug("recipes", props.slug).then((data) => {
        setOtherRecipes(data as { id: string; value: RecipeItemType }[]);
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
