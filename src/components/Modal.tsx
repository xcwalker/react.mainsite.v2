import { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import css from "../styles/components/modal.module.css";
import Button from "./Button";
import GFIcon from "./GFIcon";

export default function Modal(props: { setVisibility: Dispatch<SetStateAction<boolean>>; visibility: boolean; children: ReactNode; footer: ReactNode }) {
  useEffect(() => {
    if (props.visibility) {
      document.body.classList.add("modalVisible");
    } else {
      document.body.classList.remove("modalVisible");
    }
  }, [props.visibility]);

  return (
    <>
      <div className={css.mainContainer + " " + (props.visibility === true ? css.visible : "")}>
        <div className={css.corner}></div>
        <div className={css.corner}></div>
        <div className={css.corner}></div>
        <div className={css.corner}></div>
        <div className={css.modal}>
          <div className={css.container}>
            <header>
              <h2>Warning</h2>
              <Button
                onClick={() => {
                  props.setVisibility(false);
                }}
              >
                <GFIcon>close</GFIcon>
              </Button>
            </header>
            <main>{props.children}</main>
            <footer>{props.footer}</footer>
          </div>
        </div>
        <div
          className={css.backdrop}
          onClick={() => {
            props.setVisibility(false);
          }}
        />
      </div>
    </>
  );
}
