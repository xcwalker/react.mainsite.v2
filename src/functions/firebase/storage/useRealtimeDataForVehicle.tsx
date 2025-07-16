import {
  collection,
  documentId,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firebaseDB } from "./setup";
import { UserType, VehicleItemType } from "../../../types";
import firebaseGetData from "./getData";

export default async function firebaseGetRealtimeDataForVehicle(
  firebaseCollection: string,
  vrn: string,
  vin6: string,
  setData: React.Dispatch<React.SetStateAction<VehicleItemType | undefined>>,
  setError?: React.Dispatch<React.SetStateAction<boolean>>
) {
  const q = query(
    collection(firebaseDB, firebaseCollection),
    where(documentId(), "==", vrn),
    where("metaData.key", "==", vin6),
    limit(1) // Limit to one document
  );

  const unsubscribe = onSnapshot(
    q,
    async (querySnapshot) => {
      if (querySnapshot.docs[0]) {
        const data = querySnapshot.docs[0].data() as VehicleItemType;

        if (data.data.history.length > 0) {
          // Sort history and fetch technician data asynchronously
          const sortedHistory = data.data.history.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          await Promise.all(
            sortedHistory.map(async (entry) => {
              if (entry.technicianRef) {
                entry.technician = (await firebaseGetData(
                  "users",
                  entry.technicianRef.id
                )) as UserType;
              }
            })
          );

          setData({
            ...data,
            data: { ...data.data, history: sortedHistory },
          });
        } else {
          setData(data);
        }

        if (setError) setError(false);
      } else {
        console.log("No such document!");
        if (setError) setError(true);
        setData(undefined);
      }
    },
    (error) => {
      console.error("Error getting realtime data: ", error);
      if (setError) setError(true);
      setData(undefined);
    }
  );

  // Return the unsubscribe function to stop listening
  return unsubscribe;
}
