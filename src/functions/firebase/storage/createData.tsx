import { addDoc, collection } from "firebase/firestore";
import { firebaseDB } from "./setup";

export default async function firebaseCreateData(
  pathID: string,
  data: unknown
) {
  try {
    const docref = await addDoc(collection(firebaseDB, pathID), data);
    return docref;
  } catch (e) {
    console.error("Error getting data: ", e);
  }
}
