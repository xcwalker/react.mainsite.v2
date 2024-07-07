import { Navigate } from "react-router-dom";
import AccountPage from "../../components/Security/AccountPage";
import Protect from "../../components/Security/Protect";
import { firebaseLogout } from "../../functions/firebase/authentication/logout";

export default function ManagePage() {
  return (
    <>
      <Protect redirect={<Navigate to={"../login"} />}>
        <AccountPage
          id="accountManage"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <h2>Manage Page</h2>
          <button
            onClick={() => {
              firebaseLogout();
            }}
          >
            Sign Out
          </button>
        </AccountPage>
      </Protect>
    </>
  );
}
