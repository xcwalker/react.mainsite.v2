import { doc, onSnapshot } from "firebase/firestore";
import { firebaseDB } from "./setup";

export default async function firebaseGetRealtimeData(
  pathID: string,
  docID: string,
  setData: React.Dispatch<React.SetStateAction<unknown>>,
  setError?: React.Dispatch<React.SetStateAction<boolean>>
) {
  const unsub = onSnapshot(
    doc(firebaseDB, pathID, docID),
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
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
  return unsub; 
}
