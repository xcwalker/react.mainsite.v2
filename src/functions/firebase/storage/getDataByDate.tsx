import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firebaseDB } from "./setup";
import { RecipeItem } from "../../../types";

export default async function getDataByDate(firebaseCollection: string) {
  const q = query(
    collection(firebaseDB, firebaseCollection),
    orderBy("metaData.date.modified")
  );

  const querySnapshot = await getDocs(q);

  const output: { id: string; value: RecipeItem }[] = [];

  querySnapshot.forEach((doc) => {
    output.push({ id: doc.id, value: doc.data() as RecipeItem });
  });

  return output;
}
