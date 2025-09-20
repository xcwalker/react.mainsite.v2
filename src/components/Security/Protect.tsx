import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import firebaseGetRealtimeData from "../../functions/firebase/storage/useRealtimeData";
import { UserType } from "../../types";

export default function Protect(props: {
  children: ReactNode;
  isLoginPage?: boolean;
  redirect?: ReactNode;
}) {
  const user = useAuth();

  return (
    <>
      {props.isLoginPage && (
        <>
          {user === null && <>{props.children}</>}
          {user && props.redirect && <>{props.redirect}</>}
        </>
      )}
      {(props.isLoginPage === undefined || !props.isLoginPage) && (
        <>
          {user === null && props.redirect && <>{props.redirect}</>}
          {user && <>{props.children}</>}
        </>
      )}
    </>
  );
}

export function RoleProtect(props: {
  children: ReactNode;
  redirect?: ReactNode;
  staffOnly?: boolean;
}) {
  const user = useAuth();
  const [userData, setUserData] = useState<UserType | undefined>(undefined);

  useEffect(() => {
    if (user?.uid) {
      firebaseGetRealtimeData(
        "users",
        user.uid,
        setUserData as React.Dispatch<React.SetStateAction<unknown>>
      );
    }
  }, [user?.uid]);

  return (
    <>
      {userData !== undefined && (
        <>
          {props.staffOnly ? (
            <>
              {userData.info.role !== "unverified" &&
                userData.info.role !== "user" && <>{props.children}</>}
              {(userData.info.role === "unverified" ||
                userData.info.role === "user") &&
                props.redirect && <>{props.redirect}</>}
            </>
          ) : (
            <>
              {userData.info.role !== "unverified" && <>{props.children}</>}
              {userData.info.role === "unverified" && props.redirect && (
                <>{props.redirect}</>
              )}
            </>
          )}
        </>
      )}
      {userData === undefined && props.redirect && <>{props.redirect}</>}
    </>
  );
}
