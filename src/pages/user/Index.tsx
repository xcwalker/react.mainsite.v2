import { useAuth } from "../../functions/firebase/authentication/useAuth";
import UserPage from "./User";

export default function UserIndex() {
  const user = useAuth(null);

  return <>{user && <UserPage id={user.uid} />}</>;
}
