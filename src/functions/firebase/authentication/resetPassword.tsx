import {
  confirmPasswordReset,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
} from "firebase/auth";
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

export function firebaseResetPasswordFromEmail(
  actionCode: string,
  newPassword: string
) {
  return toast.promise(
    verifyPasswordResetCode(firebaseAuth, actionCode)
      .catch((error) => console.error(error))
      .then((email) => {
        return toast.promise(
          confirmPasswordReset(firebaseAuth, actionCode, newPassword).catch(
            (error) => console.error(error)
          ),
          {
            loading: "Resetting Password...",
            success: "Password Reset Successfully for: " + email,
            error: "Failed to Reset Password for: " + email,
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
      }),
    {
      loading: "Verifying Reset Code...",
      success: "Password Reset Successfully!",
      error: "Failed to Reset Password",
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
