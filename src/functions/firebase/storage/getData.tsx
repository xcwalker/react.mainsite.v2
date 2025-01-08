import { doc, getDoc } from "firebase/firestore";
import { firebaseDB } from "./setup";

export default async function firebaseGetData(
  pathID: string,
  docID: string,
) {
  try {
    const docSnap = await getDoc(doc(firebaseDB, pathID, docID));
    const data = docSnap.data();
    console.log(data)
    return data;
  } catch (e) {
    console.error("Error getting data: ", e);
  }
}
