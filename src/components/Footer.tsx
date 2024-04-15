import css from "../styles/components/footer.module.css";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <div className={css.column}>
          <Logo className={css.svg} />
          <div className={css.group}>
            <span className={css.span}>Copyright © 2022 XCWalker.</span>
            <span className={css.span}>All rights reserved.</span>
          </div>
          <Divider />
        </div>
      </div>
    </footer>
  );
}

function Divider() {
  return <div className={css.divider} />;
}
