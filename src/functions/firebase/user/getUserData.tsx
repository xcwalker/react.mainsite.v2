import { doc, getDoc } from "firebase/firestore";
import { firebaseDB } from "../storage/setup";
import { UserType } from "../../../types";

export default async function firebaseGetUserData(userID: string) {
  try {
    const docSnap = await getDoc(doc(firebaseDB, "users", userID));
    return docSnap.data() as UserType;
  } catch (e) {
    console.error("Error getting user: ", e);
  }
}