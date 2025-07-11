import css from "../../styles/pages/home/recipes.module.css";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { RecipeItemProps as RecipeItemType } from "../../types";
import getDataByDateFromUser from "../../functions/firebase/storage/getDataByDateFromUser";
import Carousel from "../../components/Carousel";
import GridItem from "../../components/GridItem";

export default function UserRecipes(props: { userID: string }) {
  const [recipesArray, setRecipesArray] = useState<
    { id: string; value: RecipeItemType }[] | undefined
  >();

  useEffect(() => {
    getDataByDateFromUser("recipes", props.userID).then((data) => {
      setRecipesArray(data as { id: string; value: RecipeItemType }[]);
    });

    return () => {
      setRecipesArray(undefined);
    };
  }, []);

  return (
    <>
      {recipesArray && recipesArray.length > 0 && (
          <Carousel className={css.slider} title="Recipes" multipleViews={true} defaultView="column">
            {recipesArray.map((item, index) => {
              return (
                <Fragment key={index}>
                  <GridItem itemType="recipes" item={item.value} slug={item.id} href="recipes" />
                </Fragment>
              );
            })}
          </Carousel>
      )}
    </>
  );
}
