import { ReactNode } from "react";
import { useAuth } from "../../functions/firebase/authentication/useAuth";

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
