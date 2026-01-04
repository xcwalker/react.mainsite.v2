import SettingSection from "../../components/SettingSection.tsx";
import { userSettingsDefault, userSettingsType } from "../../types.tsx";
import firebaseSetData from "../../functions/firebase/storage/setData.tsx";
import { User } from "firebase/auth";
import InputDropdown from "../../components/InputDropdown.tsx";
import InputToggle from "../../components/InputToggle.tsx";
import { useEffect } from "react";
import LoadingPage from "../../components/Loading.tsx";

export default function SettingsHome(props: {
  userSettings: userSettingsType;
  currentUser: User;
}) {
  const { userSettings, currentUser } = props;

  useEffect(() => {
    if (!userSettings.home) {
      firebaseSetData("settings", currentUser.uid, {
        ...userSettings,
        home: userSettingsDefault.home,
      });
    }
  }, [userSettings, currentUser]);

  if (!userSettings.home) {
    return <LoadingPage />;
  }

  return (
    <>
      <SettingSection id="homeSettings" title="Content">
        <InputDropdown
          id="itemsOnHome"
          label="Items"
          values={[
            { label: "Your Activity", value: "own" },
            { label: "All Activity", value: "all" },
            { label: "XCWalker's Activity", value: "xcwalker" },
          ]}
          value={userSettings.home.filter}
          onChange={(value) => {
            firebaseSetData("settings", currentUser.uid, {
              ...userSettings,
              home: {
                ...userSettings.home,
                filter: value as "own" | "all" | "xcwalker",
              },
            });
          }}
        />
        <InputDropdown
          id="defaultViewOnHome"
          label="Default View"
          values={[
            { label: "Column", value: "column" },
            { label: "Grid", value: "grid" },
            { label: "List", value: "list" },
          ]}
          value={userSettings.home.defaultView}
          onChange={(value) => {
            firebaseSetData("settings", currentUser.uid, {
              ...userSettings,
              home: {
                ...userSettings.home,
                defaultView: value as "column" | "grid" | "list",
              },
            });
          }}
        />
      </SettingSection>
      <SettingSection id="homeAppearanceSettings" title="Appearance">
        <InputToggle
          id="showRadioOnHome"
          label="Show Radio"
          checked={userSettings.home.showRadio}
          onChange={(checked) => {
            firebaseSetData("settings", currentUser.uid, {
              ...userSettings,
              home: {
                ...userSettings.home,
                showRadio: checked,
              },
            });
          }}
        />
        <InputToggle
          id="showSitesOnHome"
          label="Show Sites"
          checked={userSettings.home.showSites}
          onChange={(checked) => {
            firebaseSetData("settings", currentUser.uid, {
              ...userSettings,
              home: {
                ...userSettings.home,
                showSites: checked,
              },
            });
          }}
        />
        <InputToggle
          id="showHeroOnHome"
          label="Show Hero"
          checked={userSettings.home.showHero}
          onChange={(checked) => {
            firebaseSetData("settings", currentUser.uid, {
              ...userSettings,
              home: {
                ...userSettings.home,
                showHero: checked,
              },
            });
          }}
        />
      </SettingSection>
    </>
  );
}
