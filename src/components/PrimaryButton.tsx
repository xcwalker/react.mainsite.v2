import css from "../styles/components/primaryButton.module.css";
import { ReactNode } from "react";
import Button, { ButtonLink } from "./Button";

export default function PrimaryButton(props: { children: ReactNode; onClick: () => void }) {
  return (
    <Button className={css.primaryButton} onClick={props.onClick}>
      {props.children}
    </Button>
  );
}

export function PrimaryButtonLink(props: { children: ReactNode; href: string }) {
  return (
    <ButtonLink href={props.href} className={css.primaryButton}>
      {props.children}
    </ButtonLink>
  );
}
