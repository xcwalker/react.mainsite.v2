import { applyActionCode } from "firebase/auth";
import { firebaseAuth } from "./setup";
import toast from "react-hot-toast";
import { toastStyleDefault, toastStyleError, toastStyleSuccess } from "../../../toast";

export default function FirebaseApplyActionCode(actionCode: string) {
  return toast.promise(
    applyActionCode(firebaseAuth, actionCode),
    {
      loading: "Applying action code...",
      success: "Action code applied successfully!",
      error: "Error applying action code",
    },
    {
      loading: {
        style: toastStyleDefault,
      },
      success: {
        style: toastStyleSuccess,
      },
      error: {
        style: toastStyleError,
      },
    }
  );
}
