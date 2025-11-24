import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import SettingSection from "../../components/SettingSection";
import { firebaseLogout } from "../../functions/firebase/authentication/logout";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { useNavigate } from "react-router-dom";
import { firebaseUpdatePassword } from "../../functions/firebase/authentication/updatePassword";
import firebaseVerifyEmail from "../../functions/firebase/authentication/verifyEmail";
import css from "../../styles/pages/settings/account.module.css";
import IconButton from "../../components/IconButton";
import SettingsInputGroup from "../../components/Settings/InputGroup";

export function SettingsAccount() {
  const navigate = useNavigate();
  const currentUser = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  return (
    <>
      <SettingSection id="accountInfo" title="Account Information">
        <div className={css.info}>
          <div className={css.infoRow}>
            <div className={css.infoStack}>
              <span className={css.infoLabel}>Email:</span>{" "}
              <span className={css.infoValue}>
                {currentUser?.email || "Not Available"}
              </span>
            </div>
            <IconButton
              title="Copy Email"
              icon={{ gficon: "content_copy" }}
              onClick={() => {
                navigator.clipboard.writeText(currentUser?.email || "");
              }}
              width="fit-content"
              className={css.copyButton}
            />
          </div>
          <div className={css.infoRow}>
            <div className={css.infoStack}>
              <span className={css.infoLabel}>User ID:</span>{" "}
              <span className={css.infoValue}>
                {currentUser?.uid || "Not Available"}
              </span>
            </div>
            <IconButton
              title="Copy User ID"
              icon={{ gficon: "content_copy" }}
              onClick={() => {
                navigator.clipboard.writeText(currentUser?.uid || "");
              }}
              width="fit-content"
              className={css.copyButton}
            />
          </div>
        </div>
      </SettingSection>
      <SettingSection id="accountChangePassword" title="Change Password">
        <SettingsInputGroup>
          <Input
            id="newPassword"
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            width="45ch"
          />
          <Button
            style="primary"
            title="Change your account password"
            icon={{ gficon: "lock" }}
            width="fit-content"
            onClick={() => {
              firebaseUpdatePassword(currentUser!, newPassword)
                .catch((err) => {
                  if (err.message.startsWith("412")) {
                    navigate(
                      "/account/reauthenticate?redirect=/settings/account"
                    );
                  }
                })
                .then(() => {
                  currentUser?.reload();
                  setNewPassword("");
                });
            }}
          >
            Change Password
          </Button>
        </SettingsInputGroup>
      </SettingSection>
      <SettingSection id="accountChangeEmail" title="Update Email">
        <SettingsInputGroup>
          <Input
            id="newEmail"
            label="New Email Address"
            type="email"
            placeholder="Enter your new email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            width="45ch"
          />
          <Button
            style="primary"
            title="Change your account email"
            icon={{ gficon: "email" }}
            width="fit-content"
            onClick={() => {
              firebaseVerifyEmail(currentUser!, newEmail)
                .catch((err) => {
                  if (err.message.startsWith("412")) {
                    navigate(
                      "/account/reauthenticate?redirect=/settings/account"
                    );
                  } else {
                    console.error(err);
                  }
                })
                .then(() => {
                  currentUser?.reload();
                  setNewEmail("");
                });
            }}
          >
            Change Email
          </Button>
        </SettingsInputGroup>
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
      <SettingSection id="accountDelete" title="Delete Account">
        <Button
          style="danger"
          title="Delete your account permanently"
          icon={{ gficon: "delete" }}
          width="fit-content"
          onClick={() => {
            navigate("/account/delete");
          }}
        >
          Delete Account
        </Button>
      </SettingSection>
    </>
  );
}
