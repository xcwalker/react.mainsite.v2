import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../config";

export const firebaseDB = getFirestore(firebaseApp);