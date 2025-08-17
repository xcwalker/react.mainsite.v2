import { useEffect, useState } from "react";
import css from "../../styles/pages/dashboard/links.module.css";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { NewTabLinks } from "../../types";
import firebaseGetData from "../../functions/firebase/storage/getData";
import LoadingPage from "../../components/Loading";
import ErrorPage from "../../ErrorPage";
import { LinkItem as NewTabLinkItem } from "../newTab/Index";
import firebaseSetupNewTabData from "../../functions/firebase/storage/extra/setupNewTabData";
import { Link } from "react-router-dom";

export default function DashboardLinks() {
  const user = useAuth();
  const [linkData, setLinkData] = useState<NewTabLinks | undefined>();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user === undefined) {
      console.error("User authentication state is undefined");
      return
    }
    
    if (!user?.uid) {
      console.error("User not authenticated");
      return;
    }

    firebaseGetData("newtab", user?.uid).then((data) => {
      if (data === undefined) {
        firebaseSetupNewTabData(user?.uid).then(() => {
          firebaseGetData("newtab", user?.uid).then((data) => {
            setLinkData(data as NewTabLinks);
            setError(false);
            return;
          });
        });
        return;
      }
      setLinkData(data as NewTabLinks);
      setError(false);
      return;
    });
    return () => {
      setLinkData(undefined);
      setError(false);
    };
  }, [user?.uid]);

  return (
    <section className={css.links}>
      {!error && linkData && (
        <>
          <h2>Your Links</h2>
          <div className={css.container}>
            {linkData.links.map((item, index) => {
              return (
                <NewTabLinkItem
                  hasCMDKey={false}
                  link={item}
                  index={index}
                  modifierPressed={false}
                />
              );
            })}
            {linkData.links.length === 0 && <Link to={"/newtab/edit"}>Add Links</Link>}
          </div>
        </>
      )}
      {!error && !linkData && <LoadingPage />}
      {error && <ErrorPage code={204} error="No Content" />}
    </section>
  );
}
