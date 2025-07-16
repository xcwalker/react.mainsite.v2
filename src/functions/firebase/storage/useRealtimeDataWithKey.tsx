import { collection, documentId, limit, onSnapshot, query, where } from "firebase/firestore";
import { firebaseDB } from "./setup";

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
      console.log("Current data: ", querySnapshot.size);
      if (querySnapshot.docs[0]) {
        const data = querySnapshot.docs[0].data();
        console.log("Current data: ", data);
        setData(data);
        if (setError) setError(false);
      } else {
        console.log("No such document!");
        if (setError) setError(true);
        setData(undefined);
      }
    },
    (error) => {
      console.error("Error getting realtime data: ", error);
      if (setError) setError(true);
      setData(undefined);
    }
  );

  // Return the unsubscribe function to stop listening
  return unsubscribe;
}
