import { addDoc, collection as fbc } from "firebase/firestore";
import { firebaseDB } from "./setup";
import devConsole from "../../devConsole";

export default async function firebaseCreateData(
  collection: string,
  data: unknown
) {
  devConsole.log("Creating new document in collection:", collection, "with data:", data);
  try {
    const docref = await addDoc(fbc(firebaseDB, collection), data);
    return docref;
  } catch (e) {
    console.error("Error getting data: ", e);
  }
}
