import { Fragment } from "react/jsx-runtime";
import css from "../../styles/pages/project/related.module.css";
import RecipeItem from "../../components/RecipeItem";
import { useEffect, useState } from "react";
import { RecipeItem as RecipeItemType } from "../../types";
import getDataByDateExcludeSlugAndSameCollection from "../../functions/firebase/storage/getDataByDateExcludeSlugAndSameCollection";
import getDataByDateExcludeSlugAndDifferentCollection from "../../functions/firebase/storage/getDataByDateExcludeSlugAndDifferentCollection";
import getDataByDateExcludeSlug from "../../functions/firebase/storage/getDataByDateExcludeSlug";
import Carousel from "../../components/Carousel";
import ListItem from "../../components/ListItem";

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
        <Carousel
          className={css.scroller}
          title={props.title}
          multipleViews={true}
          defaultView="column"
          listView={
            <>
              {otherRecipes.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <ListItem
                      date={item.value.metaData.date.created}
                      title={item.value.data.title}
                      subTitle={item.value.data.subTitle}
                      href={"/recipe/" + item.id}
                    />
                  </Fragment>
                );
              })}
            </>
          }
        >
          {otherRecipes.map((item, index) => {
            return (
              <Fragment key={index}>
                <RecipeItem slug={item.id} item={item.value} />
              </Fragment>
            );
          })}
        </Carousel>
      )}
    </>
  );
}
