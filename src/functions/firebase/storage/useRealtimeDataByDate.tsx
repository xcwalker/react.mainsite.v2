import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { firebaseDB } from "./setup";
import devConsole from "../../devConsole";

export default async function FirebaseGetRealtimeDataByDate(
  firebaseCollection: string,
  setData: React.Dispatch<React.SetStateAction<unknown>>
) {
  const q = query(
    collection(firebaseDB, firebaseCollection),
    orderBy("metaData.date.modified")
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const output: { id: string; value: unknown }[] = [];

      querySnapshot.forEach((doc) => {
        output.push({ id: doc.id, value: doc.data() });
      });

      devConsole.log("Fetched data by date: ", output);
      setData(output);
    },
    (error) => {
      devConsole.error("Error getting data by date: ", error);
    }
  );

  return unsubscribe; // Return the unsubscribe function to stop listening
}
