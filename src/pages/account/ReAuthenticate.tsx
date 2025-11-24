import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import AccountPage from "../../components/Security/AccountPage";
import css from "../../styles/pages/account/index.module.css";
import { SocialIcon } from "../../components/SocialIcon";
import { useState } from "react";
import Protect from "../../components/Security/Protect";
import firebaseProviderLogin from "../../functions/firebase/authentication/loginWithProvider";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { separator, title } from "../../App";
import devConsole from "../../functions/devConsole";
import PageSeoWrapper from "../../components/PageSeoWrapper";
import firebaseReauthenticate from "../../functions/firebase/authentication/reauthenticate";
import { useAuth } from "../../functions/firebase/authentication/useAuth";

export default function ReAuthenticatePage() {
  const currentUser = useAuth();
  const params = useSearchParams()[0];
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!currentUser) return;
    setLoading(true);

    firebaseReauthenticate(currentUser!, password)
      .then((res) => {
        devConsole.log(res);
        setLoading(false);
        navigate(params.get("redirect") || "/settings/account", {
          replace: true,
        });
      })
      .catch((err) => {
        devConsole.error(err);
        setLoading(false);
      });
  }

  return (
    <Protect redirect={<Navigate to={"/account/login"} replace />}>
      <PageSeoWrapper
        title={`Login ${separator} Accounts ${separator} ${title}`}
        description={`Login to your account on ${title}`}
      >
        <AccountPage id="accountLogin" onSubmit={() => submit()}>
          <h2 className={css.title}>Please Reauthenticate</h2>
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
            Reauthenticate
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
      </PageSeoWrapper>
    </Protect>
  );
}
