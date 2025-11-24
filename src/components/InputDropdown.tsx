import { Fragment, useState } from "react";
import css from "../styles/components/inputDropdown.module.css";
import Button from "./Button";

export default function InputDropdown(props: {
  id: string;
  label: string;
  value: string;
  values: {
    icon?: string;
    label: string;
    value: string;
    selectable?: boolean;
  }[];
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={css.inputContainer}>
      <div className={css.labels}>
        <label htmlFor={props.id} className={css.label}>
          {props.label}
        </label>
      </div>
      <Button
        onClick={() => setIsOpen(true)}
        className={css.input}
        title="Select option"
        icon={{
          gficon:
            props.values.find((v) => v.value === props.value)?.icon ||
            undefined,
        }}
        onBlur={() => {
          if (!document.querySelector(`#${props.id}-dropdown:hover`)) {
            setIsOpen(false);
          }
        }}
      >
        {props.values.find((v) => v.value === props.value)?.label ||
          "Select..."}
      </Button>
      {isOpen && (
        <div
          className={css.dropdown}
          role="listbox"
          aria-labelledby={props.id}
          id={`${props.id}-dropdown`}
        >
          {props.values.map(
            (option) =>
              option.selectable !== false && (
                <Fragment key={option.value}>
                  <Button
                    onClick={() => {
                      props.onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={css.dropdownOption}
                    title={`Select ${option.label}`}
                    icon={option.icon ? { gficon: option.icon } : undefined}
                    style={
                      props.value === option.value ? "primary" : "secondary"
                    }
                  >
                    {option.label}
                  </Button>
                </Fragment>
              )
          )}
        </div>
      )}
    </div>
  );
}
