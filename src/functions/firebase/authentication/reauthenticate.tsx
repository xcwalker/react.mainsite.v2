import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from "firebase/auth";
import toast from "react-hot-toast";
import {
  toastStyleDefault,
  toastStyleError,
  toastStyleSuccess,
} from "../../../toast";

export default function firebaseReauthenticate(user: User, password: string) {
  const credential = EmailAuthProvider.credential(user.email!, password);
  return toast.promise(
    reauthenticateWithCredential(user, credential),
    {
      loading: "Reauthenticating...",
      success: "Reauthenticated successfully",
      error: "Failed to reauthenticate",
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
