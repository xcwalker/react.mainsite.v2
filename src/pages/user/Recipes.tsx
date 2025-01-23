import css from "../../styles/pages/home/recipes.module.css";
import { Fragment } from "react/jsx-runtime";
import RecipeItem from "../../components/RecipeItem";
import { useEffect, useState } from "react";
import { RecipeItem as RecipeItemType } from "../../types";
import getDataByDateFromUser from "../../functions/firebase/storage/getDataByDateFromUser";
import Carousel from "../../components/Carousel";

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
          <Carousel className={css.slider} title="Recipes" multipleViews={true}>
            {recipesArray.map((item, index) => {
              return (
                <Fragment key={index}>
                  <RecipeItem item={item.value} slug={item.id} />
                </Fragment>
              );
            })}
          </Carousel>
      )}
    </>
  );
}
