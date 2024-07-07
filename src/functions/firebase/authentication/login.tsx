import { UserCredential, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "./setup";
import {
  toastStyleDefault,
  toastStyleError,
  toastStyleSuccess,
} from "../../../toast";
import toast from "react-hot-toast";

export default async function firebaseLogin(email: string, password: string) {
  return toast.promise(
    signInWithEmailAndPassword(firebaseAuth, email, password),
    {
      loading: "Signing In",
      success: (data: UserCredential ) => `Welcome Back ${data.user.displayName}`,
      error: "Unable To Sign In",
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
