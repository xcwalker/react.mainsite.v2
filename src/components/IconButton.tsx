import Button, { ButtonType } from "./Button";
import css from "../styles/components/IconButton.module.css";

export default function IconButton(
  props: ButtonType
) {
  return (
    <Button {...props} className={css.iconButton + ` ${props.className}`} children={<></>} />
  );
}
