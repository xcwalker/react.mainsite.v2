import { ReactNode } from "react";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { Navigate } from "react-router-dom";

export default function Protect(props: {
  children: ReactNode;
  isLoginPage?: boolean;
  notLoggedIn: ReactNode;
}) {
  const user = useAuth(null);

  console.log(user, props.notLoggedIn)

  return (
    <>
      {props.isLoginPage && (
        <>
          {user === null && <>{props.children}</>}
          {user && <Navigate to={"/dashboard"} />}
        </>
      )}
      {(props.isLoginPage === undefined || !props.isLoginPage) && (
        <>
          {user === null && <>{props.notLoggedIn}</>}
          {user && <>{props.children}</>}
        </>
      )}
    </>
  );
}
