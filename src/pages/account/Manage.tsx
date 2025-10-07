import AccountPage from "../../components/Security/AccountPage";
import { firebaseLogout } from "../../functions/firebase/authentication/logout";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import { availableThemes } from "../../SettingController";
import firebaseSetData from "../../functions/firebase/storage/setData";
import { useEffect, useState } from "react";
import firebaseGetRealtimeData from "../../functions/firebase/storage/useRealtimeData";
import LoadingPage from "../../components/Loading";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { userSettingsType } from "../../types";

export default function ManagePage() {
  const currentUser = useAuth();
  const [userSettings, setUserSettings] = useState<userSettingsType | null>(
    null
  );

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    firebaseGetRealtimeData(
      "settings",
      currentUser.uid,
      setUserSettings as React.Dispatch<React.SetStateAction<unknown>>
    );
  }, [currentUser]);

  useEffect(() => {
    if (userSettings === undefined && currentUser) {
      firebaseSetData("settings", currentUser.uid, { theme: "system" });
    }
  }, [userSettings, currentUser]);

  if (!userSettings || !currentUser) {
    return <LoadingPage />;
  }

  return (
    <>
      <Helmet>
        <title>
          Manage {separator} Accounts {separator} {title}
        </title>
      </Helmet>
      <AccountPage id="accountManage">
        <h2>Manage Page</h2>
        <select
          name="theme"
          id=""
          defaultValue={"system"}
          onChange={(e) => {
            const theme = e.target.value;

            firebaseSetData("settings", currentUser.uid, {
              ...userSettings,
              theme: theme,
            });
          }}
          value={userSettings.theme}
        >
          {availableThemes.map((theme, index) => (
            <option value={theme} key={index}>
              {theme}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            firebaseLogout();
          }}
        >
          Sign Out
        </button>
      </AccountPage>
    </>
  );
}
