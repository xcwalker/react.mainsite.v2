import { ReactNode } from "react";
import Section from "../Section";
import SideBySide from "../SideBySide";
import css from "../../styles/components/accountPage.module.css";

export default function AccountPage(props: {
  id: string;
  children: ReactNode;
}) {
  return (
    <Section
      id={props.id}
      className={css.accountPage}
      container={{ className: css.container }}
    >
      <SideBySide leftWidth="1fr" className={css.sides}>
        <div className={css.left}>
          <img
            src="https://images.unsplash.com/photo-1548890232-88737d2917c4"
            alt=""
            className={css.image}
          />
          <span className={css.title}>Catchy Title</span>
          <span className={css.subTitle}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus
            porro sequi suscipit deserunt?
          </span>
        </div>
        <div className={css.right}>{props.children}</div>
      </SideBySide>
    </Section>
  );
}
