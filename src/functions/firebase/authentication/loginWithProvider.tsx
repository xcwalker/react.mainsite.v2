import {
  GithubAuthProvider,
  GoogleAuthProvider,
  UserCredential,
  signInWithPopup,
} from "firebase/auth";
import {
  toastStyleDefault,
  toastStyleError,
  toastStyleSuccess,
} from "../../../toast";
import { firebaseAuth } from "./setup";
import toast from "react-hot-toast";
import { titleCase } from "title-case";

export default function firebaseProviderLogin(provider: string) {
  if (provider === "google") {
    return toast.promise(
      signInWithPopup(firebaseAuth, new GoogleAuthProvider()),
      {
        loading: "Signing In With " + titleCase(provider),
        success: (data: UserCredential) =>
          `Welcome Back ${data.user.displayName}`,
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
  } else if (provider === "github")
    return toast.promise(
      signInWithPopup(firebaseAuth, new GithubAuthProvider()),
      {
        loading: "Signing In With " + titleCase(provider),
        success: (data: UserCredential) =>
          `Welcome Back ${data.user.displayName}`,
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
