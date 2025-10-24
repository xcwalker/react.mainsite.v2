import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firebaseDB } from "./setup";
import { UserType } from "../../../types";
import devConsole from "../../devConsole";

export default async function FirebaseGetRealtimeUsersByLastOnlineOfAnOrgByID(
  organizationId: string,
  setData: React.Dispatch<
    React.SetStateAction<{ userId: string; userData: UserType }[]>
  >
) {
  const q = query(
    collection(firebaseDB, "users"),
    where("organization.id", "==", organizationId),
    where("settings.showOrganization", "!=", false),
    orderBy("info.lastOnline", "desc")
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const output: { userId: string; userData: UserType }[] = [];

      querySnapshot.forEach((doc) => {
        output.push({ userId: doc.id, userData: doc.data() as UserType });
      });

      devConsole.log(
        `Fetched ${output.length} users for organization ID: ${organizationId}`, output
      );

      setData(output);
    },
    (error) => {
      console.error("Error getting data by date: ", error);
    }
  );

  return unsubscribe; // Return the unsubscribe function to stop listening
}
