import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firebaseDB } from "./setup";

export default async function FirebaseGetRealtimeUsersByLastOnlineExcludeHidden(
  setData: React.Dispatch<React.SetStateAction<unknown>>
) {
  const q = query(
    collection(firebaseDB, "users"),
    where("info.hidden", "!=", true),
    orderBy("info.lastOnline", "desc")
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const output: { id: string; value: unknown }[] = [];

      querySnapshot.forEach((doc) => {
        output.push({ id: doc.id, value: doc.data() });
      });

      setData(output);
    },
    (error) => {
      console.error("Error getting data by date: ", error);
    }
  );

  return unsubscribe; // Return the unsubscribe function to stop listening
}
