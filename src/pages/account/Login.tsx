import { Link } from "react-router-dom";
import AccountPage from "../../components/Security/AccountPage";
import css from "../../styles/pages/account/login.module.css";
import { SocialIcon } from "../../components/SocialIcon";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e: React.MouseEvent) {
    e.preventDefault();

    console.log(email, password)
  }

  return (
    <AccountPage id="accountLogin">
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
        />
      </div>
      <div className={css.inputContainer}>
        <label htmlFor="password" className={css.label}>
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className={css.input + " " + css.password}
          required
          placeholder="•"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <Link to={"../forgot"} className={css.link}>
          Forgotten Your Password?
        </Link>
      </div>
      <button type="submit" className={css.submit} onClick={(e) => submit(e)}>
        Login
      </button>
      <div className={css.divider}>
        <span>OR</span>
      </div>
      <div className={css.socials}>
        <button className={css.social}>
          <SocialIcon social="google" />
        </button>
        <button className={css.social}>
          <SocialIcon social="facebook" />
        </button>
        <button className={css.social}>
          <SocialIcon social="apple" />
        </button>
      </div>
      <span>
        New Here?{" "}
        <Link to={"../register"} className={css.link}>
          Register Now
        </Link>
      </span>
    </AccountPage>
  );
}
