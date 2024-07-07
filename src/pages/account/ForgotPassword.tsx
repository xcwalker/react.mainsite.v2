import { Link, Navigate } from "react-router-dom";
import AccountPage from "../../components/Security/AccountPage";
import css from "../../styles/pages/account/index.module.css";
import { useState } from "react";
import Protect from "../../components/Security/Protect";
import firebaseResetPassword from "../../functions/firebase/authentication/resetPassword";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(e: React.MouseEvent) {
    e.preventDefault();

    setLoading(true);

    firebaseResetPassword(email).then(() => {
      setLoading(false);
    });
  }

  return (
    <Protect isLoginPage={true} redirect={<Navigate to={"../manage"} />}>
      <AccountPage id="accountLogin" onSubmit={(e) => submit(e)}>
        <h2 className={css.title}>Forgotten Your Password</h2>
        <div className={css.inputContainer}>
          <label htmlFor="email" className={css.label}>
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className={css.input}
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" className={css.submit}>
          Reset Password
        </button>
        <span>
          <Link to={"../login"} className={css.link}>
            Login
          </Link>
        </span>
      </AccountPage>
    </Protect>
  );
}
