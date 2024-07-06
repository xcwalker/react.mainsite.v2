import { getAuth } from "firebase/auth";
import { firebaseApp } from "../config";

// Initialize Firebase Authentication and get a reference to the service
export const firebaseAuth = getAuth(firebaseApp);
