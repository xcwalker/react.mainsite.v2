import { doc, updateDoc } from "firebase/firestore";
import { firebaseDB } from "../storage/setup";

export default async function firebaseUpdateUserLastSeen(
  userID: string,
  time?: Date
) {
  try {
    await updateDoc(doc(firebaseDB, "users", userID), {
      "info.lastOnline":
        time !== undefined ? time.toJSON() : new Date().toJSON(),
    }).then(() => {
      console.info(
        "Updated User Last Seen as " +
          (time !== undefined ? time.toJSON() : new Date().toJSON())
      );
    });
  } catch (e) {
    console.error("Error Updated User Last Seen: ", e);
  }
}
