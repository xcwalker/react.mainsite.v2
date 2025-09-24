import { decode } from "html-entities";
import { RecipeItemProps } from "../../types";

import css from "../../styles/pages/itemPage/recipeContent.module.css";
import { Fragment, useState } from "react";
import Button from "../../components/Button";

export default function RecipeContent(props: {
  item: RecipeItemProps;
  checklistMode: boolean;
}) {
  const [ingredientsCheckedItems, setIngredientsCheckedItems] = useState<
    string[]
  >([]);
  const [prepCheckedItems, setPrepCheckedItems] = useState<string[]>([]);
  const [cookCheckedItems, setCookCheckedItems] = useState<string[]>([]);

  return (
    <>
      {props.item.data.ingredients && (
        <div
          className={css.instructions + " " + css.ingredients}
          id="ingredients"
        >
          <div className={css.header}>
            <h3>Ingredients</h3>
            {props.checklistMode && (
              <>
                <Button
                  icon={{ gficon: "clear_all" }}
                  style="secondary"
                  onClick={() => {
                    setIngredientsCheckedItems([]);
                  }}
                  title="Uncheck all items in the checklist"
                >
                  <></>
                </Button>
                <Button
                  icon={{ gficon: "sweep" }}
                  style="secondary"
                  onClick={() => {
                    setIngredientsCheckedItems(props.item.data.ingredients);
                  }}
                  title="Check all items in the checklist"
                >
                  <></>
                </Button>
              </>
            )}
          </div>
          <ul>
            {props.item.data.ingredients.map((item, index) => {
              return (
                <Fragment key={index}>
                  <InstructionItem
                    item={item}
                    checklistMode={props.checklistMode}
                    checkedItems={ingredientsCheckedItems}
                    setCheckedItems={setIngredientsCheckedItems}
                  />
                </Fragment>
              );
            })}
          </ul>
        </div>
      )}
      {props.item.data.instructions.prep && (
        <div className={css.instructions + " " + css.prep} id="prep">
          <div className={css.header}>
            <h3>Prep</h3>
            {props.checklistMode && (
              <>
                <Button
                  icon={{ gficon: "clear_all" }}
                  style="secondary"
                  onClick={() => {
                    setPrepCheckedItems([]);
                  }}
                  title="Uncheck all items in the checklist"
                >
                  <></>
                </Button>
                <Button
                  icon={{ gficon: "sweep" }}
                  style="secondary"
                  onClick={() => {
                    setPrepCheckedItems(
                      props.item.data.instructions.prep ?? []
                    );
                  }}
                  title="Check all items in the checklist"
                >
                  <></>
                </Button>
              </>
            )}
          </div>
          <ul>
            {props.item.data.instructions.prep.map((item, index) => {
              return (
                <Fragment key={index}>
                  <InstructionItem
                    item={item}
                    checklistMode={props.checklistMode}
                    checkedItems={prepCheckedItems}
                    setCheckedItems={setPrepCheckedItems}
                  />
                </Fragment>
              );
            })}
          </ul>
        </div>
      )}
      {props.item.data.instructions.cook && (
        <div className={css.instructions + " " + css.cook} id="instructions">
          <div className={css.header}>
            <h3>Instructions</h3>
            {props.checklistMode && (
              <>
                <Button
                  icon={{ gficon: "clear_all" }}
                  style="secondary"
                  onClick={() => {
                    setCookCheckedItems([]);
                  }}
                  title="Uncheck all items in the checklist"
                >
                  <></>
                </Button>
                <Button
                  icon={{ gficon: "sweep" }}
                  style="secondary"
                  onClick={() => {
                    setCookCheckedItems(props.item.data.instructions.cook);
                  }}
                  title="Check all items in the checklist"
                >
                  <></>
                </Button>
              </>
            )}
          </div>
          <ul>
            {props.item.data.instructions.cook.map((item, index) => {
              return (
                <Fragment key={index}>
                  <InstructionItem
                    item={item}
                    checklistMode={props.checklistMode}
                    checkedItems={cookCheckedItems}
                    setCheckedItems={setCookCheckedItems}
                  />
                </Fragment>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

function InstructionItem(props: {
  item: string;
  checklistMode: boolean;
  checkedItems: string[];
  setCheckedItems: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const checked = props.checkedItems.includes(props.item);

  function toggleChecked() {
    if (checked) {
      props.setCheckedItems((prev) => prev.filter((i) => i !== props.item));
    } else {
      props.setCheckedItems((prev) => [...prev, props.item]);
    }
  }

  return (
    <li
      className={props.checklistMode ? css.checklistItem : ""}
      onClick={() => {
        toggleChecked();
      }}
    >
      {props.checklistMode && (
        <input
          type="checkbox"
          checked={checked}
          onChange={() => {
            toggleChecked();
          }}
          className={css.checklistCheckbox}
          aria-label="Mark instruction as completed"
        />
      )}
      <span className={checked ? css.checked : ""}>{decode(props.item)}</span>
    </li>
  );
}
