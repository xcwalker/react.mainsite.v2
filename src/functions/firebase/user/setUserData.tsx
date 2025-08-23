import { doc, setDoc } from "firebase/firestore";
import { firebaseDB } from "../storage/setup";
import { UserType } from "../../../types";
import { updateProfile } from "firebase/auth";
import { firebaseAuth } from "../authentication/setup";
import toast from "react-hot-toast";
import { toastStyleDefault, toastStyleError, toastStyleSuccess } from "../../../toast";

export default async function firebaseSetUserData(
  docID: string,
  data: UserType
) {
  if (firebaseAuth.currentUser === null) {
    console.error("No authenticated user found.");
    return;
  }

  await toast.promise(
    updateProfile(firebaseAuth.currentUser, {
      displayName: data.about.displayName,
      photoURL: data.images.profile,
    })
      .then(() => {
        console.info("User profile updated successfully.");
        return;
      })
      .catch((error) => {
        console.error("Error updating user profile:", error);
      }),
    {
      loading: "Updating Profile",
      success: "Profile Updated Successfully",
      error: "Error Updating Profile",
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

  await toast.promise(
    setDoc(doc(firebaseDB, "users", docID), data).catch((e) => {
      console.error("Error getting data: ", e);
    }),
    {
      loading: "Saving User Data",
      success: "User Data Saved Successfully",
      error: "Error Saving User Data",
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
