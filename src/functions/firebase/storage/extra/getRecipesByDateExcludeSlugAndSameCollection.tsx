import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firebaseDB } from "../setup";
import { RecipeItem } from "../../../../types";

export default async function getRecipesByDateExcludeSlugAndSameCollection(slugExclude: string, collectionStr: string) {
  const q = query(
    collection(firebaseDB, "recipes"),
    orderBy("metaData.date.modified"),
    where("Document ID", "!=", slugExclude),
    where("metaData.collection", "==", collectionStr)
  );

  const querySnapshot = await getDocs(q);

  var output: { id: string; value: RecipeItem }[] = [];

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots

    output.push({ id: doc.id, value: doc.data() as RecipeItem });
  });

  return output;
}
