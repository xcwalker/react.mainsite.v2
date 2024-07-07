import { ReactNode } from "react";
import Section from "../Section";
import css from "../../styles/components/accountPage.module.css";

export default function AccountPage(props: {
  id: string;
  children: ReactNode;
  onSubmit: (e: any) => void;
}) {
  return (
    <Section
      id={props.id}
      className={css.accountPage}
      container={{className: css.content}}
    >
      <form action="" onSubmit={props.onSubmit} className={css.container}>
        {props.children}
      </form>
    </Section>
  );
}
