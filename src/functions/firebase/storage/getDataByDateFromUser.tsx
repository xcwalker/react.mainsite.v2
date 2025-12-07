import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firebaseDB } from "./setup";

export default async function getDataByDateFromUser(
  firebaseCollection: string,
  userId: string,
  sortDirection: "asc" | "desc" = "desc"
) {
  const q = query(
    collection(firebaseDB, firebaseCollection),
    orderBy("metaData.date.modified", sortDirection),
    where("metaData.authorID", "==", userId)
  );

  const querySnapshot = await getDocs(q);

  const output: { id: string; value: unknown }[] = [];

  querySnapshot.forEach((doc) => {
    output.push({ id: doc.id, value: doc.data() });
  });

  return output;
}
