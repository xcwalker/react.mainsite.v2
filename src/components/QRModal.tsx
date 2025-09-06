import css from "../styles/components/qrModal.module.css";
import Button from "./Button";
import QRCode from "react-qr-code";

export function QRModal(props: {
  link: string;
  close: () => void;
  visible: boolean;
}) {
  return (
    <>
      <div
        className={
          css.qrModalBackdrop + (props.visible ? " " + css.visible : "")
        }
        onClick={props.close}
      />
      <div
        className={css.qrModal + (props.visible ? " " + css.visible : "")}
        aria-hidden={props.visible ? "true" : "false"}
      >
        <div className={css.content}>
          <h3>Share Via QR Code</h3>
          <p>Scan the QR code below to open the link.</p>
          {/* <img
            src={
              "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
              encodeURIComponent(props.link)
            }
            alt="QR Code"
            className={css.qrCode}
          /> */}
          <QRCode
            value={props.link}
            bgColor="var(--background-200)"
            fgColor="white"
            className={css.qrCode}
          />
          <span className={css.link}>{props.link}</span>
          <Button
            onClick={props.close}
            title="Close"
            icon={{ gficon: "close" }}
            style="primary"
            width="100%"
            disabled={!props.visible}
          >
            Close
          </Button>
        </div>
      </div>
    </>
  );
}
