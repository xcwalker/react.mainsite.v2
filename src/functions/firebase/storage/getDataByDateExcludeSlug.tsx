import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firebaseDB } from "./setup";
import { RecipeItem } from "../../../types";

export default async function getDataByDateExcludeSlug(firebaseCollection: string, slugExclude: string) {
  const q = query(
    collection(firebaseDB, firebaseCollection),
    orderBy("metaData.date.modified"),
    where("Document ID", "!=", slugExclude)
  );

  const querySnapshot = await getDocs(q);

  const output: { id: string; value: RecipeItem }[] = [];

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots

    output.push({ id: doc.id, value: doc.data() as RecipeItem });
  });

  return output;
}
