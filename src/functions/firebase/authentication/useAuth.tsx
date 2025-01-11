import { useEffect, useState } from "react";
import { firebaseAuth } from "./setup";
import { User, onAuthStateChanged } from "firebase/auth";

export function useAuth(falseValue: unknown) {
  const [currentUser, setCurrentUser] = useState<User | typeof falseValue>(
    undefined
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(falseValue);
      }
    });
    return unsubscribe;
  }, [falseValue]);

  return currentUser;
}
