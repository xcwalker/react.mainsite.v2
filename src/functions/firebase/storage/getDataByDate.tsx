import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firebaseDB } from "./setup";

export default async function getDataByDate(firebaseCollection: string) {
  const q = query(
    collection(firebaseDB, firebaseCollection),
    orderBy("metaData.date.modified")
  );

  const querySnapshot = await getDocs(q);

  const output: { id: string; value: unknown }[] = [];

  querySnapshot.forEach((doc) => {
    output.push({ id: doc.id, value: doc.data() });
  });

  return output;
}
