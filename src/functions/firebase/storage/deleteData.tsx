import { doc, deleteDoc } from "firebase/firestore";
import { firebaseDB } from "./setup";
import devConsole from "../../devConsole";

export default async function firebaseDeleteData(
  pathID: string,
  docID: string
) {
  try {
    const docSnap = await deleteDoc(doc(firebaseDB, pathID, docID));
    devConsole.log(docSnap);
    return docSnap;
  } catch (e) {
    devConsole.error("Error getting data: ", e);
  }
}
