import { UserCredential, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "./setup";
import {
  toastStyleDefault,
  toastStyleError,
  toastStyleSuccess,
} from "../../../toast";
import toast from "react-hot-toast";

export default async function firebaseRegister(email: string, password: string) {
  return toast.promise(
    createUserWithEmailAndPassword(firebaseAuth, email, password),
    {
      loading: "Registering",
      success: (data: UserCredential) =>
        `Welcome ${data.user.displayName}`,
      error: "Unable To Register",
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
