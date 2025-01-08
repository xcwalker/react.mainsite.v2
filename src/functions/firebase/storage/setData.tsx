import { doc, setDoc } from "firebase/firestore";
import { firebaseDB } from "./setup";

export default async function firebaseSetData(
  pathID: string,
  docID: string,
  data: any
) {
  try {
    await setDoc(doc(firebaseDB, pathID, docID), data);
    return;
  } catch (e) {
    console.error("Error getting data: ", e);
  }
}
