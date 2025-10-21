import { Dispatch } from "react";
import Modal from "./Modal";
import { SetStateAction } from "jotai";
import Button from "./Button";

export default function DeleteWarning(props: {
  setVisibility: Dispatch<SetStateAction<boolean>>;
  visibility: boolean;
  deleteAction: () => void;
}) {
  return (
    <Modal
      title="Delete Confirmation"
      visibility={props.visibility}
      setVisibility={props.setVisibility}
      footer={
        <>
          <Button
            onClick={() => {
              props.setVisibility(false);
            }}
            title="Cancel Deletion"
            tabIndex={-1}
            centered
            style="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Handle delete action
              props.setVisibility(false);

              setTimeout(() => {
                props.deleteAction();
              }, 1000);
            }}
            title="Confirm Deletion"
            tabIndex={-1}
            centered
            style="danger"
          >
            Delete
          </Button>
        </>
      }
    >
      <p>Are you sure you want to delete this item?</p>
    </Modal>
  );
}
