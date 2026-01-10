import { initializeFirestore } from "firebase/firestore";
import { firebaseApp } from "../config";
import { CACHE_SIZE_UNLIMITED, persistentLocalCache } from "firebase/firestore";



export const firebaseDB = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({ cacheSizeBytes: CACHE_SIZE_UNLIMITED }) ,
  ignoreUndefinedProperties: true,
});