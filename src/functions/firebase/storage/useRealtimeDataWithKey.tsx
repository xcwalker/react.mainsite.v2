import { collection, documentId, limit, onSnapshot, query, where } from "firebase/firestore";
import { firebaseDB } from "./setup";
import devConsole from "../../devConsole";

export default async function firebaseGetRealtimeDataWithKey(
  firebaseCollection: string,
  docID: string,
  key: string,
  setData: React.Dispatch<React.SetStateAction<unknown>>,
  setError?: React.Dispatch<React.SetStateAction<boolean>>
) {
  const q = query(
    collection(firebaseDB, firebaseCollection),
    where(documentId(), "==", docID),
    where("metaData.key", "==", key),
    limit(1) // Limit to one document
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      devConsole.log("Current data: ", querySnapshot.size);
      if (querySnapshot.docs[0]) {
        const data = querySnapshot.docs[0].data();
        devConsole.log("Current data: ", data);
        setData(data);
        if (setError) setError(false);
      } else {
        devConsole.log("No such document!");
        if (setError) setError(true);
        setData(undefined);
      }
    },
    (error) => {
      devConsole.error("Error getting realtime data: ", error);
      if (setError) setError(true);
      setData(undefined);
    }
  );

  // Return the unsubscribe function to stop listening
  return unsubscribe;
}
