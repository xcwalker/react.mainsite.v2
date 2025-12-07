import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firebaseDB } from "./setup";

export default async function getDataByDateExcludeSlugAndDifferentCollection(
  firebaseCollection: string,
  slugExclude: string,
  collectionStr: string,
  sortDirection: "asc" | "desc" | "alpha-asc" | "alpha-desc" = "desc"
) {
  let q;
  if (sortDirection === "alpha-asc" || sortDirection === "alpha-desc") {
    const order = sortDirection === "alpha-asc" ? "asc" : "desc";
    q = query(
      collection(firebaseDB, firebaseCollection),
      orderBy("data.title", order),
      where("metaData.collection", "!=", collectionStr)
    );
  } else {
    q = query(
      collection(firebaseDB, firebaseCollection),
      orderBy("metaData.date.modified", sortDirection),
      where("metaData.collection", "!=", collectionStr)
    );
  }

  const querySnapshot = await getDocs(q);

  const output: { id: string; value: unknown }[] = [];

  querySnapshot.forEach((doc) => {
    if (doc.id !== slugExclude) {
      output.push({ id: doc.id, value: doc.data() });
    }
  });

  return output;
}
