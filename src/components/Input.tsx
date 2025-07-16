import { useState } from "react";
import GFIcon from "./GFIcon";
import css from "../styles/components/input.module.css";
import { Link } from "react-router-dom";

export default function Input(props: {
  id: string;
  label: string;
  name?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  required?: boolean;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  forgotPasswordHref?: string;
  maxLength?: number;
  minLength?: number;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordHover, setShowPasswordHover] = useState(false);

  return (
    <div className={css.inputContainer}>
      <div className={css.labels}>
        <label htmlFor={props.id} className={css.label}>
          {props.label}
        </label>
        {props.type === "password" && (
          <>
            <span
              className={
                css.passwordLabel +
                " " +
                css.label +
                " " +
                (showPasswordHover ? css.show : css.hidden)
              }
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </span>
            {props.forgotPasswordHref && (
              <Link
                to={props.forgotPasswordHref}
                className={
                  css.passwordLabel +
                  " " +
                  css.label +
                  " " +
                  (showPasswordHover ? css.hidden : css.show)
                }
              >
                Forgot Password?
              </Link>
            )}
          </>
        )}
      </div>
      <input
        type={
          props.type
            ? props.type === "password"
              ? showPassword
                ? "test"
                : "password"
              : props.type
            : "text"
        }
        name={props.name}
        id={props.id}
        className={css.input}
        required={props.required}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
        maxLength={props.maxLength}
        minLength={props.minLength}
      />
      {props.type === "password" && (
        <button
          type="button"
          className={css.visibility}
          onClick={() => {
            setShowPassword((prev) => !prev);
          }}
          onMouseEnter={() => setShowPasswordHover(true)}
          onMouseLeave={() => setShowPasswordHover(false)}
        >
          <GFIcon>{showPassword ? "visibility_off" : "visibility"}</GFIcon>
        </button>
      )}
    </div>
  );
}
