import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firebaseDB } from "../setup";
import { RecipeItem } from "../../../../types";

export default async function getRecipesByDate() {
  const q = query(
    collection(firebaseDB, "recipes"),
    orderBy("metaData.date.modified")
  );

  const querySnapshot = await getDocs(q);

  var output: { id: string; value: RecipeItem }[] = [];

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots

    output.push({ id: doc.id, value: doc.data() as RecipeItem });
  });

  return output;
}
