import { useEffect, useState } from "react";
import { firebaseAuth } from "./setup";
import { User, onAuthStateChanged } from "firebase/auth";

export function useAuth(falseValue: any) {
  const [currentUser, setCurrentUser] = useState<User | typeof falseValue>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user === null) return;
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  if (currentUser === undefined) {
    setCurrentUser(falseValue);
  }

  console.log(currentUser)

  return currentUser;
}
