import { doc, deleteDoc } from "firebase/firestore";
import { firebaseDB } from "./setup";

export default async function firebaseDeleteData(
  pathID: string,
  docID: string
) {
  try {
    const docSnap = await deleteDoc(doc(firebaseDB, pathID, docID));
    console.log(docSnap);
    return docSnap;
  } catch (e) {
    console.error("Error getting data: ", e);
  }
}
