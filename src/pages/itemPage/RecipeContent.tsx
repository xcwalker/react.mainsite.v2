import { decode } from "html-entities";
import { RecipeItemProps } from "../../types";

import css from "../../styles/pages/itemPage/recipeContent.module.css";

export default function RecipeContent(props: {
  item: RecipeItemProps;
}) {
  return (
    <>
      {props.item.data.ingredients && (
        <div
          className={css.instructions + " " + css.ingredients}
          id="ingredients"
        >
          <h3>Ingredients</h3>
          <ul>
            {props.item.data.ingredients.map((item, index) => {
              return <li key={index}>{decode(item)}</li>;
            })}
          </ul>
        </div>
      )}
      {props.item.data.instructions.prep && (
        <div className={css.instructions + " " + css.prep} id="prep">
          <h3>Prep</h3>
          <ul>
            {props.item.data.instructions.prep.map((item, index) => {
              return <li key={index}>{decode(item)}</li>;
            })}
          </ul>
        </div>
      )}
      {props.item.data.instructions.cook && (
        <div className={css.instructions + " " + css.cook} id="instructions">
          <h3>Instructions</h3>
          <ul>
            {props.item.data.instructions.cook.map((item, index) => {
              return <li key={index}>{decode(item)}</li>;
            })}
          </ul>
        </div>
      )}
    </>
  );
}