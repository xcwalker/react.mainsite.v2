import { User, verifyBeforeUpdateEmail } from "firebase/auth";
import toast from "react-hot-toast";
import { toastStyleError, toastStyleSuccess } from "../../../toast";

export default function firebaseVerifyEmail(user: User, newEmail: string) {
  if (user) {
    // check when the user last signed in
    if (
      Date.now() -
        (user.metadata.lastSignInTime
          ? new Date(user.metadata.lastSignInTime).getTime()
          : 0) >
      5 * 60 * 1000
    ) {
      const errorMessage =
        "412: Please re-authenticate before updating your email.";

      toast.error(errorMessage, {
        style: toastStyleError,
      });

      return Promise.reject(new Error(errorMessage));
    }

    return toast.promise(
      verifyBeforeUpdateEmail(user, newEmail),
      {
        loading: "Sending verification email...",
        success: "Verification email sent successfully.",
        error: (err) =>
          `Error sending verification email: ${err.message} ${err.code}`,
      },
      {
        loading: {
          style: toastStyleSuccess,
        },
        success: {
          style: toastStyleSuccess,
        },
        error: {
          style: toastStyleError,
        },
      }
    );
  } else {
    const errorMessage = "No user is currently signed in.";
    toast.error(errorMessage, {
      style: toastStyleError,
    });
    return Promise.reject(new Error(errorMessage));
  }
}
