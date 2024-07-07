import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "./setup";
import toast from "react-hot-toast";
import {
  toastStyleDefault,
  toastStyleError,
  toastStyleSuccess,
} from "../../../toast";

export default function firebaseResetPassword(email: string) {
  return toast.promise(
    sendPasswordResetEmail(firebaseAuth, email).catch((error) =>
      console.error(error)
    ),
    {
      loading: "Sending Reset Email",
      success: "Reset Email Sent To: " + email,
      error: "Failed To Send Email",
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
