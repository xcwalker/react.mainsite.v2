import { addDoc, collection as fbc } from "firebase/firestore";
import { firebaseDB } from "./setup";

export default async function firebaseCreateData(
  collection: string,
  data: unknown
) {
  try {
    const docref = await addDoc(fbc(firebaseDB, collection), data);
    return docref;
  } catch (e) {
    console.error("Error getting data: ", e);
  }
}
