import { useState } from "react";
import IconButton from "./IconButton";
import css from "../styles/components/inputList.module.css";

export default function InputList(props: {
  list: string[];
  onChange: (newList: string[]) => void;
  id: string;
  title: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [inputStyle, setInputStyle] = useState<"block" | "edit">("edit");

  const addItem = () => {
    if (inputValue.trim() === "") return;
    props.onChange([...props.list, inputValue.trim()]);
    setInputValue("");
  };

  const removeItem = (index: number) => {
    const newList = [...props.list];
    newList.splice(index, 1);
    props.onChange(newList);
  };

  return (
    <div className={css.inputList}>
      <header className={css.header}>
        <h3>{props.title}</h3>
        <div className={css.viewControls}>
          <IconButton
            icon={{ gficon: "text_ad" }}
            title="Add items to the list in block format, one item per line."
            onClick={() => {
              setInputStyle("block");
            }}
            style={inputStyle === "block" ? "primary" : "tertiary"}
          />

          <IconButton
            icon={{ gficon: "edit" }}
            title="Edit items in the list individually."
            onClick={() => {
              setInputStyle("edit");
            }}
            style={inputStyle === "edit" ? "primary" : "tertiary"}
          />
        </div>
      </header>
      <main className={css.main}>
        {inputStyle === "block" && (
          <div className="view-block">
            <textarea
              id={props.id + "-textarea"}
              value={props.list.join("\n")}
              onChange={(e) => {
                const newList = e.target.value
                  .split("\n")
                  .map((item) => item.trim());
                props.onChange(newList);
              }}
              rows={10}
              style={{ width: "100%" }}
            />
          </div>
        )}
        {inputStyle === "edit" && (
          <div className="view-edit">
            <ol className={css.itemList}>
              {props.list.map((item, index) => (
                <div key={index} className={css.editItem}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newList = [...props.list];
                      newList[index] = e.target.value;
                      props.onChange(newList);
                    }}
                    style={{ flexGrow: 1 }}
                    id={props.id + "-item-" + index}
                  />
                  <IconButton
                    onClick={() => removeItem(index)}
                    icon={{ gficon: "remove" }}
                    title="Remove Item"
                    width="fit-content"
                    style="danger"
                  />
                </div>
              ))}
            </ol>
            <div className={css.addInput}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem();
                  }
                }}
                id={props.id + "-input"}
              />
              <IconButton
                onClick={addItem}
                className={css.addButton}
                icon={{ gficon: "add" }}
                title="Add Item"
                style="primary"
                width="fit-content"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
