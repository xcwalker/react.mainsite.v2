import { doc, setDoc } from "firebase/firestore";
import { firebaseDB } from "../storage/setup";
import { userSetup } from "../../../types";
import toast from "react-hot-toast";
import {
  toastStyleDefault,
  toastStyleError,
  toastStyleSuccess,
} from "../../../toast";
import { getAuth, updateProfile } from "firebase/auth";
import devConsole from "../../devConsole";

export default async function firebaseSetupUserData(userID: string) {
  const auth = getAuth();
  devConsole.log(userSetup);

  if (!auth.currentUser) {
    devConsole.error("No authenticated user found.");
    return;
  }

  updateProfile(auth.currentUser, {
    displayName: userSetup.about.displayName,
    photoURL: userSetup.images.profile,
  })
    .then(() => {
      devConsole.info("User profile updated successfully.");
    })
    .catch((error) => {
      devConsole.error("Error updating user profile:", error);
    });

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
