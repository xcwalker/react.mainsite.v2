import { Link, Navigate } from "react-router-dom";
import AccountPage from "../../components/Security/AccountPage";
import css from "../../styles/pages/account/index.module.css";
import { useState } from "react";
import Protect from "../../components/Security/Protect";
import firebaseResetPassword from "../../functions/firebase/authentication/resetPassword";
import { separator, title } from "../../App";
import Button from "../../components/Button";
import Input from "../../components/Input";
import PageSeoWrapper from "../../components/PageSeoWrapper";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function submit() {
    // e: React.MouseEvent
    // e.preventDefault();

    setLoading(true);

    firebaseResetPassword(email).then(() => {
      setLoading(false);
    });
  }

  return (
    <Protect isLoginPage={true} redirect={<Navigate to={"../manage"} />}>
      <PageSeoWrapper
        title={`Forgot Password ${separator} Accounts ${separator} ${title}`}
        description={`Reset your password on ${title}`}
      >
        <AccountPage id="accountLogin" onSubmit={() => submit()}>
          <h2 className={css.title}>Forgotten Your Password</h2>
          <Input
            id="email"
            type="email"
            label="Email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            disabled={loading}
          />
          <Button
            style="primary"
            type="submit"
            title="Reset Password"
            width="14rem"
            centered
          >
            Reset Password
          </Button>
          <span>
            <Link to={"../login"} className={css.link}>
              Login
            </Link>
          </span>
        </AccountPage>
      </PageSeoWrapper>
    </Protect>
  );
}
