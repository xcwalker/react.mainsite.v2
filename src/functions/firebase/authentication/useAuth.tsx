import { useEffect, useState } from "react";
import { firebaseAuth } from "./setup";
import { User, onAuthStateChanged } from "firebase/auth";

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return currentUser;
}
