import { doc, setDoc } from "firebase/firestore";
import { firebaseDB } from "./setup";
import toast from "react-hot-toast";
import {
  toastStyleDefault,
  toastStyleError,
  toastStyleSuccess,
} from "../../../toast";

export default async function firebaseSetData(
  pathID: string,
  docID: string,
  data: unknown,
  options?: {
    toast?: {
      noToast?: boolean;
      loading?: string;
      success?: string;
      error?: string;
    };
  },
) {
  if (
    options?.toast?.noToast ||
    !options ||
    !options?.toast?.loading ||
    !options?.toast?.success ||
    !options?.toast?.error ||
    options?.toast === undefined
  ) {
    return await setDoc(doc(firebaseDB, pathID, docID), data);
  }

  return await toast.promise(
    setDoc(doc(firebaseDB, pathID, docID), data),
    {
      loading: options?.toast?.loading || "Saving Data",
      success: options?.toast?.success || "Data Saved Successfully",
      error: options?.toast?.error || "Error Saving Data",
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
    },
  );
}
