import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firebaseDB } from "./setup";

export default async function getDataByDateExcludeSlugAndSameCollection(firebaseCollection: string, slugExclude: string, collectionStr: string) {
  const q = query(
    collection(firebaseDB, firebaseCollection),
    orderBy("metaData.date.modified"),
    where("metaData.collection", "==", collectionStr)
  );

  const querySnapshot = await getDocs(q);

  const output: { id: string; value: unknown }[] = [];

  querySnapshot.forEach((doc) => {
    if (doc.id !== slugExclude) {
      output.push({ id: doc.id, value: doc.data() });
    }
  });

  return output;
}
