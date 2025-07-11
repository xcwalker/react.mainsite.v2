import { doc, updateDoc } from "firebase/firestore";
import { firebaseDB } from "../storage/setup";

export default async function firebaseUpdateUserLastSeen(
  userID: string,
  status: "online" | "offline" | "away"
) {
  try {
    await updateDoc(doc(firebaseDB, "users", userID), {
      "info.lastOnline": new Date().toJSON(),
      "about.status": status,
    }).then(() => {
      console.info("Updated User Last Seen as " + status);
    });
  } catch (e) {
    console.error("Error Updated User Last Seen: ", e);
  }
}
