import { Fragment, useState } from "react";
import css from "../../styles/pages/itemPage/create.module.css";
import {
  AlbumItemProps,
  BlogItemProps,
  CombinedItemProps,
  ItemTypes,
  ProjectItemProps,
  RecipeItemProps,
} from "../../types";
import GFIcon from "../../components/GFIcon";
import firebaseSetData from "../../functions/firebase/storage/setData";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import Button from "../../components/Button";
import firebaseCreateData from "../../functions/firebase/storage/createData";
import Image from "../../components/Image";
import SideBySide from "../../components/SideBySide";

export default function ItemCreate(props: {
  itemType: ItemTypes;
  dataInput?: CombinedItemProps;
  slug?: string;
  admin?: boolean;
}) {
  const [data, setData] = useState<CombinedItemProps>(
    props.dataInput
      ? props.dataInput
      : ({
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
            thumbnail: "",
            images: [],
            youtube: "",
            tags: [],
            key: "",
            collection: "",
            collectionName: "",
            colors: {
              dark: "",
              light: "",
            },
            authorID: "",
            hasThumbnail: false,
            repoName: "",
            subRepo: false,
            workshop: "",
          },
        } as CombinedItemProps)
  );

  return (
    <section className={css.create}>
      <SideBySide leftWidth="350px">
        <Sidebar
          data={data}
          itemType={props.itemType}
          setData={setData}
          slug={props.slug}
          admin={props.admin}
        />
        <Main data={data} itemType={props.itemType} setData={setData} />
      </SideBySide>
    </section>
  );
}

function Sidebar(props: {
  itemType: ItemTypes;
  data: CombinedItemProps;
  setData: React.Dispatch<React.SetStateAction<CombinedItemProps>>;
  slug?: string;
  admin?: boolean;
}) {
  const navigate = useNavigate();
  const currentUser = useAuth();

  return (
    <div className={css.sidebar}>
      <div className={css.thumbnailContainer}>
        <Image
          src={props.data.metaData.thumbnail}
          alt="Thumbnail"
          className={css.thumbnail}
        />
        <TextInput
          value={props.data.metaData.thumbnail}
          valueName="thumbnail"
          classification="metaData"
          placeholder="example.com/thumbnail.jpg"
          setData={props.setData}
          title="Thumbnail url"
          className={css.thumbnailURL}
        />
      </div>
      {/* image */}
      <TextInput
        value={props.data.data.title}
        valueName="title"
        classification="data"
        placeholder="title"
        setData={props.setData}
        title="Title"
        className={css.title}
      />
      <TextInput
        value={props.data.data.subTitle}
        valueName="subTitle"
        classification="data"
        placeholder="SubTitle"
        setData={props.setData}
        title="SubTitle"
        className={css.subTitle}
      />
      <div className={css.collection}>
        <TextInput
          value={props.data.metaData.collection.replace(
            currentUser?.uid + "-",
            ""
          )}
          valueName="collection"
          classification="metaData"
          placeholder="Collection"
          setData={props.setData}
          title="Collection"
          className={css.collectionName}
        />
        <TextInput
          value={props.data.metaData.collectionName}
          valueName="collectionName"
          classification="metaData"
          placeholder="Collection Name"
          setData={props.setData}
          title="Collection Name"
          className={css.collectionName}
        />
      </div>

      <div className={css.tags}>
        {props.data.metaData.tags.map((tag, index) => {
          return (
            <Fragment key={index}>
              <TextInputList
                value={tag}
                valueName={index.toString()}
                classification="tag"
                placeholder={"Tag " + (index + 1)}
                setData={props.setData}
                title="Tag"
                className={css.tag}
                data={props.data}
              />
            </Fragment>
          );
        })}
        <button
          onClick={() => {
            const tagLength = props.data.metaData.tags.length;
            props.setData((prev) => {
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

      {props.itemType === "recipes" && (
        <div className={css.information}>
          <TextInput
            value={props.data.data.information.serves}
            valueName="information"
            classification="data"
            placeholder="Serves"
            setData={props.setData}
            title="Serves"
            className={css.serves}
            subValueName="serves"
          />
          <TextInput
            value={props.data.data.information.prepTime}
            valueName="information"
            classification="data"
            placeholder="Prep Time"
            setData={props.setData}
            title="Prep Time"
            className={css.prepTime}
            subValueName="prepTime"
          />
          <TextInput
            value={props.data.data.information.cookTime}
            valueName="information"
            classification="data"
            placeholder="Cook Time"
            setData={props.setData}
            title="Cook Time"
            className={css.cookTime}
            subValueName="cookTime"
          />
        </div>
      )}
      {currentUser && currentUser !== null && (
        <Button
          onClick={() => {
            if (props.slug) {
              // update existing item
              firebaseSetData(props.itemType, props.slug, {
                data: { ...props.data.data },
                metaData: {
                  ...props.data.metaData,
                  authorID: props.admin
                    ? props.data.metaData.authorID
                    : currentUser.uid,
                  date: {
                    created: props.data.metaData.date.created,
                    modified: new Date().toJSON(),
                  },
                  collection: props.admin
                    ? props.data.metaData.collection.startsWith(
                        props.data.metaData.authorID + "-"
                      )
                      ? props.data.metaData.collection
                      : props.data.metaData.authorID +
                        "-" +
                        props.data.metaData.collection
                    : props.data.metaData.collection.startsWith(
                        currentUser.uid + "-"
                      )
                    ? props.data.metaData.collection
                    : currentUser.uid + "-" + props.data.metaData.collection,
                },
              }).then((res) => {
                console.log(res);
                navigate("/" + props.itemType + "/" + props.slug?.toString());
              });
            } else {
              // create new item
              firebaseCreateData(props.itemType, {
                data: { ...props.data.data },
                metaData: {
                  ...props.data.metaData,
                  authorID: currentUser.uid,
                  date: {
                    created: new Date().toJSON(),
                    modified: new Date().toJSON(),
                  },
                  collection:
                    currentUser.uid + "-" + props.data.metaData.collection,
                },
              }).then((res) => {
                console.log(res);
                if (!res) return;
                navigate("/" + props.itemType + "/" + res.id);
              });
            }
          }}
          title={
            props.admin
              ? props.slug
                ? "Admin Save"
                : "Admin Publish"
              : props.slug
              ? "Save"
              : "Publish"
          }
          icon={{
            gficon: props.admin
              ? props.slug
                ? "save_as"
                : ""
              : props.slug
              ? "Save"
              : "Publish",
          }}
          style="primary"
        >
          {props.admin
            ? props.slug
              ? "Admin Save"
              : ""
            : props.slug
            ? "Save"
            : "Publish"}
        </Button>
      )}
    </div>
  );
}

function Main(props: {
  itemType: ItemTypes;
  data: CombinedItemProps;
  setData: React.Dispatch<React.SetStateAction<CombinedItemProps>>;
  isEdit?: boolean;
}) {
  return (
    <div className={css.main}>
      {/* description */}
      <TextInputLarge
        value={props.data.data.description?.toString() || ""}
        valueName="description"
        classification="data"
        placeholder="Description"
        setData={props.setData}
        title="Description"
        className={css.description}
      />

      {/* ingredients */}
      {props.itemType === "recipes" && (
        <div className={css.ingredients}>
          {props.data.data.ingredients &&
            props.data.data.ingredients.map((ingredient, index) => {
              return (
                <Fragment key={index}>
                  <TextInputList
                    value={ingredient}
                    valueName={index.toString()}
                    classification="ingredients"
                    placeholder={"Ingredient " + (index + 1)}
                    setData={props.setData}
                    title="Ingredient"
                    className={css.ingredient}
                    data={props.data}
                  />
                </Fragment>
              );
            })}
          <button
            onClick={() => {
              const ingredientLength = props.data.data.ingredients.length;
              props.setData((prev) => {
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
          {props.data.data.instructions.prep &&
            props.data.data.instructions.prep.map((instruction, index) => {
              return (
                <Fragment key={index}>
                  <TextInputList
                    value={instruction}
                    valueName={index.toString()}
                    classification="instructions"
                    instructionTag="prep"
                    placeholder={"Prep " + (index + 1)}
                    setData={props.setData}
                    title="Prep"
                    className={css.instruction}
                    data={props.data}
                  />
                </Fragment>
              );
            })}
          <button
            onClick={() => {
              const instructionLength =
                props.data.data.instructions.prep?.length || 0;
              props.setData((prev) => {
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
      {props.itemType === "recipes" && props.data.data.instructions && (
        <div className={css.cook}>
          {props.data.data.instructions.cook &&
            props.data.data.instructions.cook.map((instruction, index) => {
              return (
                <Fragment key={index}>
                  <TextInputList
                    value={instruction}
                    valueName={index.toString()}
                    classification="instructions"
                    instructionTag="cook"
                    placeholder={"Cook " + (index + 1)}
                    setData={props.setData}
                    title="Cook"
                    className={css.instruction}
                    data={props.data}
                  />
                </Fragment>
              );
            })}
          <button
            onClick={() => {
              const instructionLength =
                props.data.data.instructions.cook.length;
              props.setData((prev) => {
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
      {/* images */}
      <div className={css.images}>
        {props.data.metaData.images &&
          props.data.metaData.images.map((image, index) => {
            return (
              <Fragment key={index}>
                <TextInputList
                  value={image}
                  valueName={index.toString()}
                  classification="images"
                  placeholder={"Image " + (index + 1)}
                  setData={props.setData}
                  title="Images"
                  className={css.instruction}
                  data={props.data}
                />
              </Fragment>
            );
          })}
        <button
          onClick={() => {
            const imageLength = props.data.metaData.images.length || 0;
            props.setData((prev) => {
              const newValue = { ...prev };
              if (imageLength + 1 !== newValue.metaData.images.length) {
                newValue.metaData.images = [...prev.metaData.images, ""];
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
    </div>
  );
}

function TextInput(props: {
  value: string;
  classification:
    | "data"
    | "metaData"
    | "information"
    | "tag"
    | "ingredients"
    | "instructions";

  // keyof (
  //   | ProjectItemProps
  //   | RecipeItemProps
  //   | BlogItemProps
  //   | AlbumItemProps
  // );
  valueName:
    | keyof ProjectItemProps["data"]
    | keyof RecipeItemProps["data"]
    | keyof BlogItemProps["data"]
    | keyof AlbumItemProps["data"]
    | keyof ProjectItemProps["metaData"]
    | keyof RecipeItemProps["metaData"]
    | keyof BlogItemProps["metaData"]
    | keyof AlbumItemProps["metaData"];
  // | keyof (
  //     | ProjectItemProps["data"]
  //     | RecipeItemProps["data"]
  //     | BlogItemProps["data"]
  //     | AlbumItemProps["data"]
  //   )
  // | keyof (
  //     | ProjectItemProps["metaData"]
  //     | RecipeItemProps["metaData"]
  //     | BlogItemProps["metaData"]
  //     | AlbumItemProps["metaData"]
  //   );
  setData: React.Dispatch<React.SetStateAction<CombinedItemProps>>;
  data?: CombinedItemProps;
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
          props.setData((prev) => {
            const newValue = { ...prev };

            if (!props.subValueName) {
              // @ts-expect-error crappy but is easier than fixing types
              newValue[props.classification][props.valueName] = e.target.value;
            } else {
              // @ts-expect-error crappy but is easier than fixing types
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
  classification:
    | "information"
    | "tag"
    | "ingredients"
    | "instructions"
    | "images";
  valueName: string;
  setData: React.Dispatch<React.SetStateAction<CombinedItemProps>>;
  data?: CombinedItemProps;
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
          props.setData((prev) => {
            const newValue = { ...prev };

            if (props.classification === "information") {
              // @ts-expect-error crappy but is easier than fixing types
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
              // @ts-expect-error crappy but is easier than fixing types
              newValue.data.instructions[props.instructionTag][
                parseInt(props.valueName)
              ] = e.target.value;
            } else if (props.classification === "images") {
              // @ts-expect-error crappy but is easier than fixing types
              newValue.metaData.images[props.valueName] = e.target.value;
            }
            return newValue;
          });
        }}
        title={props.title}
        placeholder={props.placeholder}
        className={props.className}
      />
      {props.classification === "tag" && props.data !== undefined && (
        <button
          onClick={() => {
            const tagLength = props.data?.metaData.tags.length || 0;
            props.setData((prev) => {
              const newValue = { ...prev };
              if (tagLength - 1 !== newValue.metaData.tags.length) {
                newValue.metaData.tags = prev.metaData.tags.filter(
                  (_tag, index) => {
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
      {props.classification === "ingredients" && props.data !== undefined && (
        <button
          onClick={() => {
            const tagLength = props.data?.data.ingredients.length || 0;
            props.setData((prev) => {
              const newValue = { ...prev };
              if (tagLength - 1 !== newValue.data.ingredients.length) {
                newValue.data.ingredients = prev.data.ingredients.filter(
                  (_tag, index) => {
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
        props.data !== undefined && (
          <button
            onClick={() => {
              const tagLength =
                // @ts-expect-error crappy but is easier than fixing types
                props.data?.data.instructions[props.instructionTag].length;
              props.setData((prev) => {
                const newValue = { ...prev };
                if (
                  tagLength - 1 !==
                  // @ts-expect-error crappy but is easier than fixing types
                  newValue.data.instructions[props.instructionTag].length
                ) {
                  // @ts-expect-error crappy but is easier than fixing types
                  newValue.data.instructions[props.instructionTag] =
                    // @ts-expect-error crappy but is easier than fixing types
                    prev.data.instructions[props.instructionTag].filter(
                      (_tag: string, index: number) => {
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
  classification: keyof RecipeItemProps;
  valueName: keyof RecipeItemProps["data"] | keyof RecipeItemProps["metaData"];
  setData: React.Dispatch<React.SetStateAction<CombinedItemProps>>;

  title: string;
  placeholder: string;
  className: string;
}) {
  return (
    <div className={css.textInputLarge}>
      <textarea
        value={props.value}
        onChange={(e) => {
          props.setData((prev) => {
            const newValue = { ...prev };

            // @ts-expect-error crappy but is easier than fixing types
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
