import { Link, Navigate } from "react-router-dom";
import AccountPage from "../../components/Security/AccountPage";
import css from "../../styles/pages/account/index.module.css";
import { SocialIcon } from "../../components/SocialIcon";
import { useState } from "react";
import firebaseLogin from "../../functions/firebase/authentication/login";
import Protect from "../../components/Security/Protect";
import firebaseProviderLogin from "../../functions/firebase/authentication/loginWithProvider";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import devConsole from "../../functions/devConsole";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);

    firebaseLogin(email, password).then((res) => {
      devConsole.log(res);
      setLoading(false);
    }).catch((err) => {
      devConsole.error(err);
      setLoading(false);
    });
  }

  return (
    <Protect isLoginPage={true} redirect={<Navigate to={"/user"} replace />}>
      <>
        <Helmet>
          <title>
            Login {separator} Accounts {separator} {title}
          </title>
        </Helmet>
        <AccountPage id="accountLogin" onSubmit={() => submit()}>
          <h2 className={css.title}>Welcome Back</h2>
          <Input
            type="email"
            name="email"
            id="email"
            label="Email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            disabled={loading}
          />
          <Input
            label="Password"
            type={"password"}
            name="password"
            id="password"
            required
            placeholder="●●●●●●●●●●●"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            disabled={loading}
            onSubmit={() => submit()}
            forgotPasswordHref="../forgot"
          />
          <Button
            style="primary"
            type="submit"
            title="Login"
            width="14rem"
            centered
          >
            Login
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
              title="Login With Google"
            >
              <SocialIcon social="google" className={css.socialIcon} />
            </Button>
            <Button
              style="secondary"
              onClick={() => {
                firebaseProviderLogin("github");
              }}
              title="Login With GitHub"
            >
              <SocialIcon social="github" className={css.socialIcon} />
            </Button>
          </div>
          <span>
            New Here?{" "}
            <Link to={"../register"} className={css.link}>
              Register Now
            </Link>
          </span>
        </AccountPage>
      </>
    </Protect>
  );
}
