import { Link, Navigate } from "react-router-dom";
import AccountPage from "../../components/Security/AccountPage";
import css from "../../styles/pages/account/index.module.css";
import { SocialIcon } from "../../components/SocialIcon";
import { useState } from "react";
import GFIcon from "../../components/GFIcon";
import firebaseLogin from "../../functions/firebase/authentication/login";
import Protect from "../../components/Security/Protect";
import firebaseProviderLogin from "../../functions/firebase/authentication/loginWithProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    firebaseLogin(email, password).then(() => {
      setLoading(false);
    });
  }

  return (
    <Protect isLoginPage={true} redirect={<Navigate to={"../manage"} />}>
      <AccountPage id="accountLogin" onSubmit={(e) => submit(e)}>
        <h2 className={css.title}>Welcome Back</h2>
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
        <div className={css.inputContainer}>
          <label htmlFor="password" className={css.label}>
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            className={css.input + " " + css.password}
            required
            placeholder="●●●●●●●●●●●"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            disabled={loading}
            onSubmit={(e) => submit(e)}
          />
          <button
            onClick={() => setShowPassword((prev) => !prev)}
            className={css.visibility}
            type="button"
          >
            <GFIcon className={css.icon}>
              {showPassword ? "visibility_off" : "visibility"}
            </GFIcon>
          </button>
          <Link to={"../forgot"} className={css.link}>
            Forgotten Your Password?
          </Link>
        </div>
        <button type="submit" className={css.submit}>
          Login
        </button>
        <div className={css.divider}>
          <span>OR</span>
        </div>
        <div className={css.socials}>
          <button
            className={css.social}
            onClick={() => {
              firebaseProviderLogin("google");
            }}
          >
            <SocialIcon social="google" />
          </button>
          <button
            className={css.social}
            onClick={() => {
              firebaseProviderLogin("github");
            }}
          >
            <SocialIcon social="github" />
          </button>
        </div>
        <span>
          New Here?{" "}
          <Link to={"../register"} className={css.link}>
            Register Now
          </Link>
        </span>
      </AccountPage>
    </Protect>
  );
}
