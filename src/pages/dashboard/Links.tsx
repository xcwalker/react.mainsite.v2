import { useEffect, useState } from "react";
import css from "../../styles/pages/dashboard/links.module.css";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { NewTabLinks } from "../../types";
import firebaseGetData from "../../functions/firebase/storage/getData";
import LoadingPage from "../../components/Loading";
import ErrorPage from "../../ErrorPage";
import { LinkItem as NewTabLinkItem } from "../newTab/Index";

export default function DashboardLinks() {
  const user = useAuth();
  const [linkData, setLinkData] = useState<NewTabLinks | undefined>();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      console.error("User not authenticated");
      return;
    }

    firebaseGetData("newtab", user?.uid).then((data) => {
      if (data === undefined) {
        console.error("User data not found");
        setError(true);
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
          </div>
        </>
      )}
      {!error && !linkData && <LoadingPage />}
      {error && <ErrorPage code={204} error="No Content" />}
    </section>
  );
}
