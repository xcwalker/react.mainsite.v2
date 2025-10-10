import Button from "./Button";
import css from "../styles/components/ButtonWithPreview.module.css";

export default function ButtonWithPreview(
  props: React.ComponentProps<typeof Button> & { label: string }
) {
  return (
    <Button {...props} className={css.buttonWithPreview + " " + (props.style ? css[props.style] : '') + " " + props.className}>
      <span className={css.label}>{props.label}</span>
      <span className={css.preview}>{props.children}</span>
    </Button>
  );
}
