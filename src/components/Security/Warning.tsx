import { Dispatch, SetStateAction } from "react";
import Modal from "../Modal";
import Button, { ButtonLink } from "../Button";

export default function SecurityWarning(props: { setVisibility: Dispatch<SetStateAction<boolean>>; visibility: boolean; }) {
  return (
    <Modal
      visibility={props.visibility}
      setVisibility={props.setVisibility}
      footer={
        <>
          <ButtonLink className="return" href="https://www.google.com">
            Return
          </ButtonLink>
          <Button
            onClick={() => {
              props.setVisibility(false);
            }}
            title="Proceed to document"
            tabIndex={-1}
          >
            Proceed
          </Button>
        </>
      }
    >
      <p>You are attempting to view a classified document.</p>
      <p>
        Viewing this document without clearance is a violation of <a href="http://">SHIELD Title 18 Section 8</a> and{" "}
        <a href="">the National Security Policy</a>.
      </p>
      <p>
        Your request to view this document has been recorded and notified to the <a href="">security department</a>.
      </p>
      <p>By viewing this document without clearance you may face a penalty up to 10 years of prison time.</p>
    </Modal>
  );
}