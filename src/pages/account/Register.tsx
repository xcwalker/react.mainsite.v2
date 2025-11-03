import { Link, Navigate } from "react-router-dom";
import AccountPage from "../../components/Security/AccountPage";
import css from "../../styles/pages/account/index.module.css";
import { SocialIcon } from "../../components/SocialIcon";
import { useState } from "react";
import Protect from "../../components/Security/Protect";
import firebaseProviderLogin from "../../functions/firebase/authentication/loginWithProvider";
import Input from "../../components/Input";
import Button from "../../components/Button";
import firebaseRegister from "../../functions/firebase/authentication/register";
import toast from "react-hot-toast";
import { toastStyleError } from "../../toast";
import toTitleCase from "../../functions/toTitleCase";
import { separator, title } from "../../App";
import PageSeoWrapper from "../../components/PageSeoWrapper";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [loading, setLoading] = useState(false);

  function submit() {
    setLoading(true);

    firebaseRegister(email, password)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Registration failed:", error);
        // Handle error (e.g., show a toast notification)
        toast.error(
          toTitleCase(error.code.replace("auth/", "").replaceAll("-", " ")),
          {
            style: toastStyleError,
          }
        );
      });
  }

  return (
    <Protect isLoginPage={true} redirect={<Navigate to={"/me"} replace />}>
      <PageSeoWrapper
        title={`Register ${separator} Accounts ${separator} ${title}`}
        description={`Create a new account on ${title}`}
      >
        <AccountPage id="accountRegister" onSubmit={() => submit()}>
          <h2 className={css.title}>
            <span>Welcome To</span>
            <span className={css.fancy}>Awesome</span>
          </h2>

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
          <Button
            type="submit"
            style="primary"
            title="Register"
            width="14rem"
            centered
          >
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
      </PageSeoWrapper>
    </Protect>
  );
}
