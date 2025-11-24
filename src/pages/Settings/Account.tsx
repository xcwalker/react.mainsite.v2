import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import SettingSection from "../../components/SettingSection";
import { firebaseLogout } from "../../functions/firebase/authentication/logout";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { useNavigate } from "react-router-dom";
import { firebaseUpdatePassword } from "../../functions/firebase/authentication/updatePassword";
import firebaseVerifyEmail from "../../functions/firebase/authentication/verifyEmail";

export function SettingsAccount() {
  const navigate = useNavigate();
  const currentUser = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  return (
    <>
      <SettingSection id="accountInfo" title="Account Information">
        <p>
          <strong>Email:</strong> {currentUser?.email || "Not Available"}
        </p>
        <p>
          <strong>User ID:</strong> {currentUser?.uid || "Not Available"}
        </p>
      </SettingSection>
      <SettingSection id="accountChangePassword" title="Change Password">
        <Input
          id="newPassword"
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button
          style="primary"
          title="Change your account password"
          icon={{ gficon: "lock" }}
          width="fit-content"
          onClick={() => {
            firebaseUpdatePassword(currentUser!, newPassword).catch((err) => {
              if (err.message.startsWith("412")) {
                navigate("/account/reauthenticate?redirect=/settings/account");
              }
            }).then(() => {
              currentUser?.reload();
              setNewPassword("");
            });
          }}
        >
          Change Password
        </Button>
      </SettingSection>
      <SettingSection id="accountChangeEmail" title="Update Email">
        <Input
          id="newEmail"
          label="New Email Address"
          type="email"
          placeholder="Enter your new email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}

         />
        <Button
          style="primary"
          title="Change your account email"
          icon={{ gficon: "email" }}
          width="fit-content"
          onClick={() => {
            firebaseVerifyEmail(currentUser!, newEmail).catch((err) => {
              if (err.message.startsWith("412")) {
                navigate("/account/reauthenticate?redirect=/settings/account");
              } else {
                console.error(err);
              }
            }).then(() => {
              currentUser?.reload();
              setNewEmail("");
            });
          }}
        >
          Change Email
        </Button>
      </SettingSection>
      <SettingSection id="accountLogout" title="Account Logout">
        <Button
          style="danger"
          title="Sign out of your account"
          icon={{ gficon: "logout" }}
          width="fit-content"
          onClick={() => {
            firebaseLogout();
          }}
        >
          Sign Out
        </Button>
      </SettingSection>
    </>
  );
}
