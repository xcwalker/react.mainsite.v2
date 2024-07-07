import { Link, Navigate } from "react-router-dom";
import AccountPage from "../../components/Security/AccountPage";
import css from "../../styles/pages/account/index.module.css";
import { SocialIcon } from "../../components/SocialIcon";
import { useState } from "react";
import GFIcon from "../../components/GFIcon";
import firebaseLogin from "../../functions/firebase/authentication/login";
import Protect from "../../components/Security/Protect";
import firebaseProviderLogin from "../../functions/firebase/authentication/loginWithProvider";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function submit(e: React.MouseEvent) {
    e.preventDefault();

    setLoading(true);

    firebaseLogin(email, password).then(() => {
      setLoading(false);
    });
  }

  return (
    <Protect isLoginPage={true} redirect={<Navigate to={"../manage"} />}>
      <AccountPage id="accountRegister" onSubmit={(e) => submit(e)}>
        <h2 className={css.title}>Welcome To Awesome</h2>
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
          />
          <button
            onClick={() => setShowPassword((prev) => !prev)}
            className={css.visibility}
          >
            <GFIcon className={css.icon}>
              {showPassword ? "visibility_off" : "visibility"}
            </GFIcon>
          </button>
        </div>
        <div className={css.inputContainer}>
          <label htmlFor="password" className={css.label}>
            Repeat Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password2"
            id="password2"
            className={css.input + " " + css.password}
            required
            placeholder="●●●●●●●●●●●"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.currentTarget.value)}
            disabled={loading}
          />
          <button
            onClick={() => setShowPassword((prev) => !prev)}
            className={css.visibility}
          >
            <GFIcon className={css.icon}>
              {showPassword ? "visibility_off" : "visibility"}
            </GFIcon>
          </button>
        </div>
        <button type="submit" className={css.submit}>
          Register
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
          Existing User?{" "}
          <Link to={"../login"} className={css.link}>
            Sign In
          </Link>
        </span>
      </AccountPage>
    </Protect>
  );
}
