import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firebaseDB } from "./setup";

export default async function getRealtimeDataByDateFromOrganization(
  firebaseCollection: string,
  organizationId: string,
  setData: React.Dispatch<React.SetStateAction<unknown>>,
  sortDirection: "asc" | "desc" | "alpha-asc" | "alpha-desc" = "desc"
) {
  let q;
  if (sortDirection === "alpha-asc" || sortDirection === "alpha-desc") {
    const order = sortDirection === "alpha-asc" ? "asc" : "desc";
    q = query(
      collection(firebaseDB, firebaseCollection),
      orderBy("data.title", order),
      where("metaData.organizationID", "==", organizationId)
    );
  } else {
    q = query(
      collection(firebaseDB, firebaseCollection),
      orderBy("metaData.date.modified", sortDirection),
      where("metaData.organizationID", "==", organizationId)
    );
  }

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
