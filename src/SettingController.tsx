import { useEffect, useState } from "react";

import "./styles/themes/devView.css";
import "./styles/themes/trans-pride.css";
import "./styles/themes/midnight.css";
import "./styles/themes/naturist.css";
import "./styles/themes/purplur.css";
import "./styles/themes/custom.css";
import { useAuth } from "./functions/firebase/authentication/useAuth";
import firebaseGetRealtimeData from "./functions/firebase/storage/useRealtimeData";
import { userSettingsType } from "./types";

export default function SettingController(props: { children: React.ReactNode }) {
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
    document.documentElement.setAttribute("data-theme", userSettings?.theme || "system");

    if (userSettings?.theme === "custom" && userSettings.customThemeColor) {
      const root = document.documentElement;
      const themeColors = userSettings.customThemeColor;

      Object.entries(themeColors).forEach(([key, value]) => {
        root.style.setProperty(`--custom-${key}`, value);
      });
    }
  }, [userSettings]);

  return <>{props.children}</>;
}

export const availableThemes = [
  "system",
  "light",
  "dark",
  "DevView™",
  "trans-pride",
  "midnight",
  "naturist",
  "purplur",
  "custom"
];