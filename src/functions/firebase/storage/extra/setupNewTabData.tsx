import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { firebaseDB } from "../setup";
import { toastStyleDefault, toastStyleError, toastStyleSuccess } from "../../../../toast";
import { NewTabLinksDefault } from "../../../../types";

export default async function firebaseSetupNewTabData(userID: string) {
  return toast.promise(
    setDoc(doc(firebaseDB, "newtab", userID), NewTabLinksDefault),
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
