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
      <label htmlFor={props.id} className={css.label}>
        {props.label}
      </label>
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
      <div
        className={css.dropdown + (isOpen ? " " + css.open : " " + css.closed)}
        role="listbox"
        aria-labelledby={props.id}
        id={`${props.id}-dropdown`}
        onClick={() => {
          setIsOpen(true);
        }}
        onBlur={() => {
          // only close if not hovering over the dropdown
          if (!document.querySelector(`#${props.id}-dropdown:hover`)) {
            setIsOpen(false);
          }
        }}
      >
        {props.values.map(
          (option) =>
            option.selectable !== false && (
              <Fragment key={option.value}>
                <Button
                  onClick={() => {
                    props.onChange(option.value);
                    setTimeout(() => {
                      setIsOpen(false);
                    }, 100);
                  }}
                  className={css.dropdownOption}
                  title={`Select ${option.label}`}
                  icon={option.icon ? { gficon: option.icon } : undefined}
                  style={props.value === option.value ? "primary" : "secondary"}
                >
                  {option.label}
                </Button>
              </Fragment>
            )
        )}
      </div>
    </div>
  );
}

export function InputDropdownPill(props: {
  id: string;
  value: string | number;
  values: {
    icon?: string;
    label: string;
    value: string | number;
    selectable?: boolean;
  }[];
  onChange: (value: string | number) => void;
  className?: string;
  inverted?: boolean;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const placeholder = props.placeholder || "Select...";

  return (
    <div
      className={
        css.pillInputContainer + (props.className ? " " + props.className : "")
      }
    >
      <Button
        onClick={() => setIsOpen(true)}
        className={css.input}
        title="Select option"
        icon={
          props.values.find((v) => v.value === props.value)?.icon
            ? {
                gficon: props.values.find((v) => v.value === props.value)?.icon,
              }
            : undefined
        }
        onBlur={() => {
          if (!document.querySelector(`#${props.id}-dropdown:hover`)) {
            setIsOpen(false);
          }
        }}
      >
        {props.values.find((v) => v.value === props.value)?.label ||
          placeholder}
      </Button>
      <div
        className={css.dropdown + (isOpen ? " " + css.open : " " + css.closed) + (props.inverted ? " " + css.inverted : "")}
        role="listbox"
        aria-labelledby={props.id}
        id={`${props.id}-dropdown`}
        onClick={() => {
          setIsOpen(true);
        }}
        onBlur={() => {
          // only close if not hovering over the dropdown
          if (!document.querySelector(`#${props.id}-dropdown:hover`)) {
            setIsOpen(false);
          }
        }}
      >
        {props.values.map(
          (option) =>
            option.selectable !== false && (
              <Fragment key={option.value}>
                <Button
                  onClick={() => {
                    props.onChange(option.value);
                    setTimeout(() => {
                      setIsOpen(false);
                    }, 100);
                  }}
                  className={css.dropdownOption}
                  title={`Select ${option.label}`}
                  icon={option.icon ? { gficon: option.icon } : undefined}
                  style={props.value === option.value ? "primary" : "secondary"}
                >
                  {option.label}
                </Button>
              </Fragment>
            )
        )}
      </div>
    </div>
  );
}
