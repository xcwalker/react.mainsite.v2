import QRCode from "react-qr-code";
import Button from "./Button";
import Modal from "./Modal";

import css from "../styles/components/shareModal.module.css";

export default function ShareModal(props: {
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  visibility: boolean | "demo";
  url: string;
  title?: string;
}) {
  return (
    <Modal
      height="370px"
      title={props.title || "Share via QR Code"}
      setVisibility={props.setVisibility}
      visibility={props.visibility}
      footer={
        <>
          <Button
            onClick={() => props.setVisibility(false)}
            title="Close"
            centered
            style="primary"
          >
            Close
          </Button>
        </>
      }
    >
      <QRCode
        value={props.url}
        bgColor="var(--text-inverse)"
        fgColor="var(--text)"
        className={css.qrCode}
      />
      <span className={css.link}>{props.url}</span>
    </Modal>
  );
}
