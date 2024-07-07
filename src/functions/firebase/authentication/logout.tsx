import { signOut } from "firebase/auth";
import { firebaseAuth } from "./setup";
import toast from "react-hot-toast";
import { toastStyleDefault, toastStyleError, toastStyleSuccess } from "../../../toast";

export function firebaseLogout() {
  return toast.promise(
    signOut(firebaseAuth),
    {
      loading: "Signing Out",
      success: "Signed Out",
      error: "Unable To Sign Out",
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
