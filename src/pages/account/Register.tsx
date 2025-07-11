import { Link, Navigate } from "react-router-dom";
import AccountPage from "../../components/Security/AccountPage";
import css from "../../styles/pages/account/index.module.css";
import { SocialIcon } from "../../components/SocialIcon";
import { useState } from "react";
import firebaseLogin from "../../functions/firebase/authentication/login";
import Protect from "../../components/Security/Protect";
import firebaseProviderLogin from "../../functions/firebase/authentication/loginWithProvider";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
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

        <Input
          type="email"
          name="email"
          label="Email"
          id="email"
          required
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          disabled={loading}
        />
        <Input
          type="password"
          name="password"
          id="password"
          label="Password"
          required
          placeholder="●●●●●●●●●●●"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          disabled={loading}
        />
        <Input
          type="password"
          name="password2"
          id="password2"
          label="Repeat Password"
          required
          placeholder="●●●●●●●●●●●"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.currentTarget.value)}
          disabled={loading}
        />
        <Button type="submit" style="primary" title="Register">
          Register
        </Button>
        <div className={css.divider}>
          <span>OR</span>
        </div>
        <div className={css.socials}>
          <Button
            style="secondary"
            onClick={() => {
              firebaseProviderLogin("google");
            }}
            title="Register With Google"
          >
            <SocialIcon social="google" className={css.socialIcon} />
          </Button>
          <Button
            style="secondary"
            onClick={() => {
              firebaseProviderLogin("github");
            }}
            title="Register With GitHub"
          >
            <SocialIcon social="github" className={css.socialIcon} />
          </Button>
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
