import { doc, setDoc } from "firebase/firestore";
import { firebaseDB } from "../storage/setup";
import { userSetup } from "../../../types";
import toast from "react-hot-toast";
import { toastStyleDefault, toastStyleError, toastStyleSuccess } from "../../../toast";

export default async function firebaseSetupUserData(userID: string) {
  console.log(userSetup)
  return toast.promise(
    setDoc(doc(firebaseDB, "users", userID), userSetup),
    {
      loading: "Setting Up Profile",
      success: "Welcome New User",
      error: "Unable To Setup",
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
