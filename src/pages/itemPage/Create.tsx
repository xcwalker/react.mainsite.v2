import { Fragment, useState } from "react";
import css from "../../styles/pages/itemPage/create.module.css";
import { RecipeItem } from "../../types";
import GFIcon from "../../components/GFIcon";
import firebaseSetData from "../../functions/firebase/storage/setData";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../functions/firebase/authentication/useAuth";

export default function ItemCreate(props: {
  itemType: "projects" | "recipes" | "albums" | "blog";
}) {
  const [recipe, setRecipe] = useState<RecipeItem>({
    data: {
      title: "",
      subTitle: "",
      description: "",
      instructions: {
        prep: [],
        cook: [],
      },
      ingredients: [],
      information: {
        prepTime: "",
        cookTime: "",
        serves: "",
      },
    },
    metaData: {
      date: {
        created: "",
        modified: "",
      },
      imageCount: 0,
      youtube: "",
      tags: [],
      collection: "",
      collectionName: "",
      colors: {
        dark: "",
        light: "",
      },
      authorID: "",
      author: {
        name: "",
        image: {
          webpURL: "",
          jpgURL: "",
        },
      },
    },
  });

  return (
    <section className={css.create}>
      <Sidebar
        recipe={recipe}
        itemType={props.itemType}
        setRecipe={setRecipe}
      />
      <Main recipe={recipe} itemType={props.itemType} setRecipe={setRecipe} />
    </section>
  );
}

function Sidebar(props: {
  itemType: "projects" | "recipes" | "albums" | "blog";
  recipe: RecipeItem;
  setRecipe: React.Dispatch<React.SetStateAction<RecipeItem>>;
}) {
  const [slug, setSlug] = useState<string>("");
  const navigate = useNavigate();
  const currentUser = useAuth(null);

  return (
    <div className={css.sidebar}>
      {/* image */}
      <TextInput
        value={props.recipe.data.title}
        valueName="title"
        classification="data"
        placeholder="title"
        setRecipe={props.setRecipe}
        title="Title"
        className={css.title}
      />
      <TextInput
        value={props.recipe.data.subTitle}
        valueName="subTitle"
        classification="data"
        placeholder="SubTitle"
        setRecipe={props.setRecipe}
        title="SubTitle"
        className={css.subTitle}
      />
      <div className={css.textInput}>
        <input
          type="text"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
          }}
          title="Slug"
          placeholder="Slug"
          className={css.slug}
        />
      </div>
      <div className={css.collection}>
        <TextInput
          value={props.recipe.metaData.collection}
          valueName="collection"
          classification="metaData"
          placeholder="Collection"
          setRecipe={props.setRecipe}
          title="Collection"
          className={css.collectionName}
        />
        <TextInput
          value={props.recipe.metaData.collectionName}
          valueName="collectionName"
          classification="metaData"
          placeholder="Collection Name"
          setRecipe={props.setRecipe}
          title="Collection Name"
          className={css.collectionName}
        />
      </div>

      <div className={css.tags}>
        {props.recipe.metaData.tags.map((tag, index) => {
          return (
            <Fragment key={index}>
              <TextInputList
                value={tag}
                valueName={index.toString()}
                classification="tag"
                placeholder={"Tag " + (index + 1)}
                setRecipe={props.setRecipe}
                title="Tag"
                className={css.tag}
                recipe={props.recipe}
              />
            </Fragment>
          );
        })}
        <button
          onClick={() => {
            const tagLength = props.recipe.metaData.tags.length;
            props.setRecipe((prev) => {
              const newValue = { ...prev };
              if (tagLength + 1 !== newValue.metaData.tags.length) {
                newValue.metaData.tags = [...prev.metaData.tags, ""];
              }
              return newValue;
            });
          }}
          className={css.addButton}
        >
          <GFIcon>add</GFIcon>
        </button>
      </div>

      {props.itemType === "recipes" && <div className={css.information}>
        <TextInput
          value={props.recipe.data.information.serves}
          valueName="information"
          classification="data"
          placeholder="Serves"
          setRecipe={props.setRecipe}
          title="Serves"
          className={css.serves}
          subValueName="serves"
        />
        <TextInput
          value={props.recipe.data.information.prepTime}
          valueName="information"
          classification="data"
          placeholder="Prep Time"
          setRecipe={props.setRecipe}
          title="Prep Time"
          className={css.prepTime}
          subValueName="prepTime"
        />
        <TextInput
          value={props.recipe.data.information.cookTime}
          valueName="information"
          classification="data"
          placeholder="Cook Time"
          setRecipe={props.setRecipe}
          title="Cook Time"
          className={css.cookTime}
          subValueName="cookTime"
        />
      </div>}
      <button
        onClick={() =>
          firebaseSetData(props.itemType, slug, {
            data: { ...props.recipe.data },
            metaData: {
              ...props.recipe.metaData,
              authorID: currentUser.uid,
              date: {
                created: new Date().toJSON(),
                modified: new Date().toJSON(),
              },
            },
          }).then((res) => {
            console.log(res);
            navigate("/" + props.itemType + "/" + slug.toString());
          })
        }
        className={css.publish}
      >
        Publish
      </button>
    </div>
  );
}

function Main(props: {
  itemType: "projects" | "recipes" | "albums" | "blog";
  recipe: RecipeItem;
  setRecipe: React.Dispatch<React.SetStateAction<RecipeItem>>;
}) {
  return (
    <div className={css.main}>
      {/* description */}
      <TextInputLarge
        value={props.recipe.data.description?.toString() || ""}
        valueName="description"
        classification="data"
        placeholder="Description"
        setRecipe={props.setRecipe}
        title="Description"
        className={css.description}
      />
      
      {/* ingredients */}
      {props.itemType === "recipes" && (
        <div className={css.ingredients}>
          {props.recipe.data.ingredients &&
            props.recipe.data.ingredients.map((ingredient, index) => {
              return (
                <Fragment key={index}>
                  <TextInputList
                    value={ingredient}
                    valueName={index.toString()}
                    classification="ingredients"
                    placeholder={"Ingredient " + (index + 1)}
                    setRecipe={props.setRecipe}
                    title="Ingredient"
                    className={css.ingredient}
                    recipe={props.recipe}
                  />
                </Fragment>
              );
            })}
          <button
            onClick={() => {
              const ingredientLength = props.recipe.data.ingredients.length;
              props.setRecipe((prev) => {
                const newValue = { ...prev };
                if (ingredientLength + 1 !== newValue.data.ingredients.length) {
                  newValue.data.ingredients = [...prev.data.ingredients, ""];
                }
                return newValue;
              });
            }}
            className={css.addButton}
          >
            <GFIcon>add</GFIcon>
          </button>
        </div>
      )}
      {/* prep */}
      {props.itemType === "recipes" && (
        <div className={css.prep}>
          {props.recipe.data.instructions.prep &&
            props.recipe.data.instructions.prep.map((instruction, index) => {
              return (
                <Fragment key={index}>
                  <TextInputList
                    value={instruction}
                    valueName={index.toString()}
                    classification="instructions"
                    instructionTag="prep"
                    placeholder={"Prep " + (index + 1)}
                    setRecipe={props.setRecipe}
                    title="Prep"
                    className={css.instruction}
                    recipe={props.recipe}
                  />
                </Fragment>
              );
            })}
          <button
            onClick={() => {
              const instructionLength =
                props.recipe.data.instructions.prep?.length || 0;
              props.setRecipe((prev) => {
                const newValue = { ...prev };
                if (
                  instructionLength + 1 !==
                  newValue.data.instructions.prep?.length
                ) {
                  newValue.data.instructions.prep = [
                    ...(prev.data.instructions.prep ?? []),
                    "",
                  ];
                }
                return newValue;
              });
            }}
            className={css.addButton}
          >
            <GFIcon>add</GFIcon>
          </button>
        </div>
      )}
      {/* cook */}
      {props.itemType === "recipes" && (
        <div className={css.cook}>
          {props.recipe.data.instructions.cook &&
            props.recipe.data.instructions.cook.map((instruction, index) => {
              return (
                <Fragment key={index}>
                  <TextInputList
                    value={instruction}
                    valueName={index.toString()}
                    classification="instructions"
                    instructionTag="cook"
                    placeholder={"Cook " + (index + 1)}
                    setRecipe={props.setRecipe}
                    title="Cook"
                    className={css.instruction}
                    recipe={props.recipe}
                  />
                </Fragment>
              );
            })}
          <button
            onClick={() => {
              const instructionLength =
                props.recipe.data.instructions.cook.length;
              props.setRecipe((prev) => {
                const newValue = { ...prev };
                if (
                  instructionLength + 1 !==
                  newValue.data.instructions.cook.length
                ) {
                  newValue.data.instructions.cook = [
                    ...prev.data.instructions.cook,
                    "",
                  ];
                }
                return newValue;
              });
            }}
            className={css.addButton}
          >
            <GFIcon>add</GFIcon>
          </button>
          {/* buttons */}
        </div>
      )}
    </div>
  );
}

function TextInput(props: {
  value: string;
  classification: keyof RecipeItem;
  valueName: keyof RecipeItem["data"] | keyof RecipeItem["metaData"];
  setRecipe: React.Dispatch<React.SetStateAction<RecipeItem>>;
  recipe?: RecipeItem;
  subValueName?: string;

  title: string;
  placeholder: string;
  className: string;
}) {
  return (
    <div className={css.textInput}>
      <input
        type="text"
        value={props.value}
        onChange={(e) => {
          props.setRecipe((prev) => {
            const newValue = { ...prev };

            if (!props.subValueName) {
              newValue[props.classification][props.valueName] = e.target.value;
            } else {
              newValue[props.classification][props.valueName][
                props.subValueName
              ] = e.target.value;
            }

            return newValue;
          });
        }}
        title={props.title}
        placeholder={props.placeholder}
        className={props.className}
      />
    </div>
  );

  // props.classification === "ingredients" ||
}

function TextInputList(props: {
  value: string;
  classification: "information" | "tag" | "ingredients" | "instructions";
  valueName: string;
  setRecipe: React.Dispatch<React.SetStateAction<RecipeItem>>;
  recipe?: RecipeItem;
  instructionTag?: string;

  title: string;
  placeholder: string;
  className: string;
}) {
  return (
    <div className={css.textInputList}>
      <input
        type="text"
        value={props.value}
        onChange={(e) => {
          props.setRecipe((prev) => {
            const newValue = { ...prev };

            if (props.classification === "information") {
              newValue.data.information[props.valueName] = e.target.value;
            } else if (props.classification === "tag") {
              newValue.metaData.tags[parseInt(props.valueName)] =
                e.target.value;
            } else if (props.classification === "ingredients") {
              newValue.data.ingredients[parseInt(props.valueName)] =
                e.target.value;
            } else if (
              props.classification === "instructions" &&
              props.instructionTag
            ) {
              newValue.data.instructions[props.instructionTag][
                parseInt(props.valueName)
              ] = e.target.value;
            }
            return newValue;
          });
        }}
        title={props.title}
        placeholder={props.placeholder}
        className={props.className}
      />
      {props.classification === "tag" && props.recipe !== undefined && (
        <button
          onClick={() => {
            const tagLength = props.recipe.metaData.tags.length;
            props.setRecipe((prev) => {
              const newValue = { ...prev };
              if (tagLength - 1 !== newValue.metaData.tags.length) {
                newValue.metaData.tags = prev.metaData.tags.filter(
                  (tag, index) => {
                    return index !== parseInt(props.valueName);
                  }
                );
              }
              return newValue;
            });
          }}
        >
          <GFIcon>remove</GFIcon>
        </button>
      )}
      {props.classification === "ingredients" && props.recipe !== undefined && (
        <button
          onClick={() => {
            const tagLength = props.recipe?.data.ingredients.length;
            props.setRecipe((prev) => {
              const newValue = { ...prev };
              if (tagLength - 1 !== newValue.data.ingredients.length) {
                newValue.data.ingredients = prev.data.ingredients.filter(
                  (tag, index) => {
                    return index !== parseInt(props.valueName);
                  }
                );
              }
              return newValue;
            });
          }}
        >
          <GFIcon>remove</GFIcon>
        </button>
      )}
      {props.classification === "instructions" &&
        props.instructionTag &&
        props.recipe !== undefined && (
          <button
            onClick={() => {
              const tagLength =
                props.recipe?.data.instructions[props.instructionTag].length;
              props.setRecipe((prev) => {
                const newValue = { ...prev };
                if (
                  tagLength - 1 !==
                  newValue.data.instructions[props.instructionTag].length
                ) {
                  newValue.data.instructions[props.instructionTag] =
                    prev.data.instructions[props.instructionTag].filter(
                      (tag, index) => {
                        return index !== parseInt(props.valueName);
                      }
                    );
                }
                return newValue;
              });
            }}
          >
            <GFIcon>remove</GFIcon>
          </button>
        )}
    </div>
  );

  // props.classification === "ingredients" ||
}

function TextInputLarge(props: {
  value: string;
  classification: keyof RecipeItem;
  valueName: keyof RecipeItem["data"] | keyof RecipeItem["metaData"];
  setRecipe: React.Dispatch<React.SetStateAction<RecipeItem>>;

  title: string;
  placeholder: string;
  className: string;
}) {
  return (
    <div className={css.textInputLarge}>
      <textarea
        value={props.value}
        onChange={(e) => {
          props.setRecipe((prev) => {
            const newValue = { ...prev };

            /* eslint-disable-next-line no-alert */
            newValue[props.classification][props.valueName] = e.target.value;

            return newValue;
          });
        }}
        title={props.title}
        placeholder={props.placeholder}
        className={props.className}
      />
    </div>
  );
}
