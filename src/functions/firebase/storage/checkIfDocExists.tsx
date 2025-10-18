import { doc, getDoc } from "firebase/firestore";
import { firebaseDB } from "./setup";

export async function checkIfDocExists(pathID: string, docId: string) {
  try {
    const docSnap = await getDoc(doc(firebaseDB, pathID, docId));
    return docSnap.exists();
  } catch (e) {
    console.error("Error getting data for document: ", e);
    return false;
  }
}
