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
    toast?: boolean;
  }
) {
  if (options && options?.toast === false) {
    return await setDoc(doc(firebaseDB, pathID, docID), data);
  }

  await toast.promise(
    setDoc(doc(firebaseDB, pathID, docID), data),
    {
      loading: "Saving Data",
      success: "Data Saved Successfully",
      error: "Error Saving Data",
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
