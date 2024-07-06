import { Navigate } from "react-router-dom";
import AccountPage from "../../components/Security/AccountPage";
import Protect from "../../components/Security/Protect";

export default function ManagePage() {
  return (
    <>
      <Protect notLoggedIn={<Navigate to={"../login"} />}>
        <AccountPage id="accountManage">
          <h2>Manage Page</h2>
        </AccountPage>
      </Protect>
    </>
  );
}
