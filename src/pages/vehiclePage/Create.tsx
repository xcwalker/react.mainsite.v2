import { useState } from "react";
import css from "../../styles/pages/itemPage/create.module.css";
import {
  ItemTypes,
  RecipeItemProps,
  VehicleItemType,
} from "../../types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import Button from "../../components/Button";
import firebaseCreateData from "../../functions/firebase/storage/createData";

export default function ItemCreate(props: {
  itemType: ItemTypes;
  dataInput?: VehicleItemType;
}) {
  const [data, setData] = useState<VehicleItemType>(
    props.dataInput
      ? props.dataInput
      : ({
          data: {
            description: "",
            make: "",
            model: "",
            year: new Date().getFullYear(),
            engine: {
              size: 2000,
              fuel: "petrol",
            },
            transmission: "manual",
            history: [],
          },
          metaData: {
            authorID: "",
            date: {
              created: new Date().toJSON(),
              modified: new Date().toJSON(),
            },
            key: "",
            vin: "",
            thumbnail: "",
          },
        } as VehicleItemType)
  );

  return (
    <section className={css.create}>
      <Sidebar data={data} itemType={props.itemType} setData={setData} />
      <Main data={data} itemType={props.itemType} setData={setData} />
    </section>
  );
}

function Sidebar(props: {
  itemType: ItemTypes;
  data: VehicleItemType;
  setData: React.Dispatch<React.SetStateAction<VehicleItemType>>;
}) {
  const navigate = useNavigate();
  const currentUser = useAuth();

  return (
    <div className={css.sidebar}>
      {/* image */}
      <TextInput
        value={props.data.data.make}
        valueName="make"
        classification="data"
        placeholder="title"
        setData={props.setData}
        title="Title"
        className={css.title}
      />
      <TextInput
        value={props.data.data.model}
        valueName="model"
        classification="data"
        placeholder="SubTitle"
        setData={props.setData}
        title="SubTitle"
        className={css.subTitle}
      />
      {currentUser && currentUser !== null && (
        <Button
          onClick={() => {
            // create new item
            firebaseCreateData("vehicles", {
              data: { ...props.data.data },
              metaData: {
                ...props.data.metaData,
                authorID: currentUser.uid,
                date: {
                  created: new Date().toJSON(),
                  modified: new Date().toJSON(),
                },
              },
            }).then((res) => {
              console.log(res);
              if (!res) return;
              navigate("/" + props.itemType + "/" + res.id);
            });
          }}
          title={"Publish"}
          icon={{
            gficon: "Publish",
          }}
          style="primary"
        >
          {"Publish"}
        </Button>
      )}
    </div>
  );
}

function Main(props: {
  itemType: ItemTypes;
  data: VehicleItemType;
  setData: React.Dispatch<React.SetStateAction<VehicleItemType>>;
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
    </div>
  );
}

function TextInput(props: {
  value: string;
  classification: "data" | "metaData";
  valueName: keyof VehicleItemType["data"] | keyof VehicleItemType["metaData"];
  setData: React.Dispatch<React.SetStateAction<VehicleItemType>>;
  data?: VehicleItemType;
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

// function TextInputList(props: {
//   value: string;
//   classification: "information" | "tag" | "ingredients" | "instructions";
//   valueName: string;
//   setData: React.Dispatch<React.SetStateAction<CombinedItemProps>>;
//   data?: CombinedItemProps;
//   instructionTag?: string;

//   title: string;
//   placeholder: string;
//   className: string;
// }) {
//   return (
//     <div className={css.textInputList}>
//       <input
//         type="text"
//         value={props.value}
//         onChange={(e) => {
//           props.setData((prev) => {
//             const newValue = { ...prev };

//             if (props.classification === "information") {
//               // @ts-expect-error crappy but is easier than fixing types
//               newValue.data.information[props.valueName] = e.target.value;
//             } else if (props.classification === "tag") {
//               newValue.metaData.tags[parseInt(props.valueName)] =
//                 e.target.value;
//             } else if (props.classification === "ingredients") {
//               newValue.data.ingredients[parseInt(props.valueName)] =
//                 e.target.value;
//             } else if (
//               props.classification === "instructions" &&
//               props.instructionTag
//             ) {
//               // @ts-expect-error crappy but is easier than fixing types
//               newValue.data.instructions[props.instructionTag][
//                 parseInt(props.valueName)
//               ] = e.target.value;
//             }
//             return newValue;
//           });
//         }}
//         title={props.title}
//         placeholder={props.placeholder}
//         className={props.className}
//       />
//       {props.classification === "tag" && props.data !== undefined && (
//         <button
//           onClick={() => {
//             const tagLength = props.data?.metaData.tags.length || 0;
//             props.setData((prev) => {
//               const newValue = { ...prev };
//               if (tagLength - 1 !== newValue.metaData.tags.length) {
//                 newValue.metaData.tags = prev.metaData.tags.filter(
//                   (tag, index) => {
//                     return index !== parseInt(props.valueName);
//                   }
//                 );
//               }
//               return newValue;
//             });
//           }}
//         >
//           <GFIcon>remove</GFIcon>
//         </button>
//       )}
//       {props.classification === "ingredients" && props.data !== undefined && (
//         <button
//           onClick={() => {
//             const tagLength = props.data?.data.ingredients.length || 0;
//             props.setData((prev) => {
//               const newValue = { ...prev };
//               if (tagLength - 1 !== newValue.data.ingredients.length) {
//                 newValue.data.ingredients = prev.data.ingredients.filter(
//                   (tag, index) => {
//                     return index !== parseInt(props.valueName);
//                   }
//                 );
//               }
//               return newValue;
//             });
//           }}
//         >
//           <GFIcon>remove</GFIcon>
//         </button>
//       )}
//       {props.classification === "instructions" &&
//         props.instructionTag &&
//         props.data !== undefined && (
//           <button
//             onClick={() => {
//               const tagLength =
//                 // @ts-expect-error crappy but is easier than fixing types
//                 props.data?.data.instructions[props.instructionTag].length;
//               props.setData((prev) => {
//                 const newValue = { ...prev };
//                 if (
//                   tagLength - 1 !==
//                   // @ts-expect-error crappy but is easier than fixing types
//                   newValue.data.instructions[props.instructionTag].length
//                 ) {
//                   // @ts-expect-error crappy but is easier than fixing types
//                   newValue.data.instructions[props.instructionTag] =
//                     // @ts-expect-error crappy but is easier than fixing types
//                     prev.data.instructions[props.instructionTag].filter(
//                       (_tag: string, index: number) => {
//                         return index !== parseInt(props.valueName);
//                       }
//                     );
//                 }
//                 return newValue;
//               });
//             }}
//           >
//             <GFIcon>remove</GFIcon>
//           </button>
//         )}
//     </div>
//   );

//   // props.classification === "ingredients" ||
// }

function TextInputLarge(props: {
  value: string;
  classification: keyof RecipeItemProps;
  valueName: keyof VehicleItemType["data"] | keyof VehicleItemType["metaData"];
  setData: React.Dispatch<React.SetStateAction<VehicleItemType>>;

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
