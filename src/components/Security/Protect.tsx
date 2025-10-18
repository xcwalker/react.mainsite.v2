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
  loading?: ReactNode;
}) {
  const user = useAuth();
  const [userData, setUserData] = useState<UserType | undefined | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    if (uid === user?.uid) return;

    if (user?.uid) {
      console.info("Checking User: ", user.uid, " for RoleProtect");
      setUid(user.uid);
      firebaseGetRealtimeData(
        "users",
        user.uid,
        setUserData as React.Dispatch<React.SetStateAction<unknown>>
      );
    } else if (user === null) {
      setUserData(undefined);
    }
  }, [user, uid]);

  return (
    <>
      {userData === null && props.loading && <>{props.loading}</>}
      {userData !== undefined && userData !== null && (
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

export function RoleProtectInline(
  staffOnly?: boolean
) {
  const user = useAuth();
  const [userData, setUserData] = useState<UserType | undefined | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    if (uid === user?.uid) return;

    if (user?.uid) {
      console.info("Checking User: ", user.uid, " for RoleProtect");
      setUid(user.uid);
      firebaseGetRealtimeData(
        "users",
        user.uid,
        setUserData as React.Dispatch<React.SetStateAction<unknown>>
      );
    } else if (user === null) {
      setUserData(undefined);
    }
  }, [user, uid]);

  if (userData === null) {
    return null; // or a loading indicator
  }

  if (userData === undefined) {
    return false; // or a loading indicator
  }

  if (staffOnly) {
    if (userData.info.role === "unverified" ||
      userData.info.role === "user" ) return false
      else return true
  } 

  if (userData.info.role !== "unverified") {
    return true;
  } else {
    return false;
  }
}

export function DevModeProtect(props: {
  children: ReactNode;
  redirect?: ReactNode;
}) {
  const devMode = import.meta.env.VITE_IS_DEVELOPMENT_BUILD === "true";

  return <>{devMode ? <>{props.children}</> : <>{props.redirect}</>}</>;
}
