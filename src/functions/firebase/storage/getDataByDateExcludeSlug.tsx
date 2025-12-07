import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firebaseDB } from "./setup";

export default async function getDataByDateExcludeSlug(
  firebaseCollection: string,
  slugExclude: string,
  sortDirection: "asc" | "desc" | "alpha-asc" | "alpha-desc" = "desc"
) {
  let q;
  if (sortDirection === "alpha-asc" || sortDirection === "alpha-desc") {
    const order = sortDirection === "alpha-asc" ? "asc" : "desc";
    q = query(
      collection(firebaseDB, firebaseCollection),
      orderBy("data.title", order),
      where("Document ID", "!=", slugExclude)
    );
  } else {
    q = query(
      collection(firebaseDB, firebaseCollection),
      orderBy("metaData.date.modified", sortDirection),
      where("Document ID", "!=", slugExclude)
    );
  }

  const querySnapshot = await getDocs(q);

  const output: { id: string; value: unknown }[] = [];

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots

    output.push({ id: doc.id, value: doc.data() });
  });

  return output;
}
