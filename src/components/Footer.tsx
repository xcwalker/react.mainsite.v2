import css from "../styles/components/footer.module.css";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <div className={css.column}>
          <Logo className={css.svg} />
          <span className={css.span}>
            An <a href="https://xcw.one">xcwalker</a> development
          </span>
        </div>
      </div>
    </footer>
  );
}
