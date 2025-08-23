import { doc, onSnapshot } from "firebase/firestore";
import { firebaseDB } from "../storage/setup";
import { UserType } from "../../../types";

export default async function firebaseGetRealtimeUserData(
  userID: string,
  setData: React.Dispatch<React.SetStateAction<unknown>>,
  setError?: React.Dispatch<React.SetStateAction<boolean>>
) {
  const unsub = onSnapshot(
    doc(firebaseDB, "users", userID),
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserType;
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
  return unsub;
}
