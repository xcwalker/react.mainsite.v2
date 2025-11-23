import { updateEmail, User } from "firebase/auth";
import { toast } from "react-hot-toast";
import { toastStyleError, toastStyleSuccess } from "../../../toast";

export function firebaseUpdateEmail(user: User, newEmail: string) {
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
      updateEmail(user, newEmail),
      {
        loading: "Updating email...",
        success: "Email updated successfully.",
        error: (err) => `Error updating email: ${err.message}`,
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
