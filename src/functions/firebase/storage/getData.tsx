import { collection, doc, documentId, getDoc, getDocs, limit, query, where } from "firebase/firestore";
import { firebaseDB } from "./setup";
import devConsole from "../../devConsole";

export default async function firebaseGetData(
  pathID: string,
  docID: string,
) {
  try {
    const docSnap = await getDoc(doc(firebaseDB, pathID, docID));
    const data = docSnap.data();
    devConsole.log(data)
    return data;
  } catch (e) {
    devConsole.error("Error getting data: ", e);
  }
}


export async function firebaseGetDataWithKey(pathID: string, docID: string, key: string) {
  const q = query(
    collection(firebaseDB, pathID),
    where(documentId(), "==", docID),
    where("metaData.key", "==", key),
    limit(1) // Limit to one document
  );
  
    const querySnapshot = await getDocs(q);
  
    let output: unknown = undefined;
  
    querySnapshot.forEach((doc) => {
      if (doc.id !== docID) return;
      output = doc.data();
    });

    devConsole.log("Current data: ", output);

  return output;
}