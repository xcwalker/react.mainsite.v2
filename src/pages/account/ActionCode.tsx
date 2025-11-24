import { useSearchParams } from "react-router-dom";
import { separator, title } from "../../App";
import PageSeoWrapper from "../../components/PageSeoWrapper";
import AccountPage from "../../components/Security/AccountPage";
import css from "../../styles/pages/account/index.module.css";
import Button from "../../components/Button";
import { useState } from "react";
import FirebaseApplyActionCode from "../../functions/firebase/authentication/applyActionCode";
import Input from "../../components/Input";
import { firebaseResetPasswordFromEmail } from "../../functions/firebase/authentication/resetPassword";
import { useAuth } from "../../functions/firebase/authentication/useAuth";

export default function ActionCodePage() {
  const params = useSearchParams()[0];
  const currentUser = useAuth();
  const actionCode = params.get("oobCode");
  const actionMode = params.get("mode");
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const isVerifyEmail =
    actionMode === "verifyAndChangeEmail" || actionMode === "verifyEmail";
  const isResetPassword = actionMode === "resetPassword";

  return (
    <PageSeoWrapper
      title={`Update Account ${separator} Accounts ${separator} ${title}`}
      description={`Apply changes to your account on ${title}`}
    >
      <AccountPage id="accountLogin">
        {isVerifyEmail && (
          <>
            {!verified && (
              <>
                <h2 className={css.title}>Verify Email</h2>
                <Button
                  title="Verify Email"
                  onClick={() => {
                    if (!actionCode) return;

                    FirebaseApplyActionCode(actionCode)
                      .then(() => {
                        if (currentUser) {
                          currentUser.reload();
                        }

                        setVerified(true);
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  }}
                  style="primary"
                  centered
                  width="fit-content"
                >
                  Verify Email
                </Button>
              </>
            )}
            {verified && (
              <>
                <h2 className={css.title}>Email Verified Successfully</h2>
                <Button
                  title="Go to Login"
                  href="/account/login"
                  style="primary"
                  centered
                  width="fit-content"
                >
                  Login
                </Button>
              </>
            )}
          </>
        )}
        {isResetPassword && (
          <>
            {!verified && (
              <>
                <h2 className={css.title}>Reset Your Password</h2>
                <Input
                  id="newPassword"
                  label="New Password"
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  title="Reset Password"
                  onClick={() => {
                    if (!actionCode || !newPassword || newPassword.length < 6)
                      return;

                    firebaseResetPasswordFromEmail(actionCode, newPassword)
                      .then(() => {
                        setVerified(true);
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  }}
                  style="primary"
                  centered
                  width="fit-content"
                >
                  Reset Password
                </Button>
              </>
            )}
            {verified && (
              <>
                <h2 className={css.title}>Password Reset Successfully</h2>
                <Button
                  title="Go to Login"
                  href="/account/login"
                  style="primary"
                  centered
                  width="fit-content"
                >
                  Login
                </Button>
              </>
            )}
          </>
        )}
        {!isVerifyEmail && !isResetPassword && (
          <h2 className={css.title}>Invalid Action Mode</h2>
        )}
      </AccountPage>
    </PageSeoWrapper>
  );
}
