import css from "../../styles/components/settings/ValueStack.module.css";

export default function ValueStack(props: { children: React.ReactNode }) {
  return (
    <div className={css.valueStack}>
      {props.children}
    </div>
  );
}
