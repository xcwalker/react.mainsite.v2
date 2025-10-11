import { firebaseLogout } from "../../functions/firebase/authentication/logout";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import { availableThemes } from "../../SettingController";
import firebaseSetData from "../../functions/firebase/storage/setData";
import { Fragment, useEffect, useState } from "react";
import firebaseGetRealtimeData from "../../functions/firebase/storage/useRealtimeData";
import LoadingPage from "../../components/Loading";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import { userSettingsDefault, userSettingsType } from "../../types";
import InputColor from "../../components/InputColor";
import invert from "invert-color";
import InputGroup from "../../components/InputGroup";
import Input from "../../components/Input";
import SideBySide from "../../components/SideBySide";
import css from "../../styles/pages/account/manage.module.css";
import Button from "../../components/Button";
import { User } from "firebase/auth";

export default function ManagePage() {
  const currentUser = useAuth();
  const [userSettings, setUserSettings] = useState<userSettingsType | null>(
    null
  );
  const [page, setPage] = useState("themes");

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
      firebaseSetData("settings", currentUser.uid, userSettingsDefault);
    }

    if (userSettings?.theme === "custom" && !userSettings.customThemeColor) {
      firebaseSetData("settings", currentUser?.uid as string, {
        ...userSettings,
        customThemeColor: {
          text: "#000000",
          textAlt: "#333333",
          background: "#ffffff",
          primary: "#0000ff",
          secondary: "#00ff00",
          accent: "#ff0000",
          textInverse: "#ffffff",
        },
        customThemes: [],
      });
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
      <SideBySide leftWidth="250px">
        <Sidebar 
          page={page}
          setPage={setPage}
        />
        <main className={css.main}>
          {page === "themes" && <Page_Themes
            userSettings={userSettings}
            currentUser={currentUser}
          />}
          {page === "account" && <Page_Account />}
        </main>
      </SideBySide>
    </>
  );
}

export function Sidebar(props: {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { page, setPage } = props;

  const pages = [
    { name: "themes", title: "Manage Themes", icon: "format_paint" },
    { name: "account", title: "Manage Account", icon: "account_circle" },
  ];

  return (
    <div className={css.sidebar}>
      <nav>
        <ul>
          {pages.map((pageItem) => (
            <li key={pageItem.name}>
              <Button
                onClick={() => {
                  setPage(pageItem.name);
                }}
                style={page === pageItem.name ? "primary" : "secondary"}
                title={pageItem.title}
                icon={{ gficon: pageItem.icon }}
              >
                {pageItem.title}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function Page_Account() {
  return (
    <div>
      <h2>Account Settings</h2>

      <button
        onClick={() => {
          firebaseLogout();
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

function Page_Themes(props: {
  userSettings: userSettingsType;
  currentUser: User;
}) {
  const { currentUser, userSettings } = props;
  const [customThemeName, setCustomThemeName] = useState("");
  return (
    <div>
      <h2>Theme Settings</h2>
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
      {userSettings.theme === "custom" && userSettings.customThemeColor && (
        <InputGroup direction="row">
          <InputGroup>
            <InputColor
              label="Background Color"
              value={userSettings.customThemeColor.background}
              onChange={(color) => {
                firebaseSetData("settings", currentUser.uid, {
                  ...userSettings,
                  customThemeColor: {
                    ...userSettings.customThemeColor,
                    background: color,
                  },
                });
              }}
            />
            <InputColor
              label="Text Color"
              value={userSettings.customThemeColor.text}
              onChange={(color) => {
                firebaseSetData("settings", currentUser.uid, {
                  ...userSettings,
                  customThemeColor: {
                    ...userSettings.customThemeColor,
                    text: color,
                    textInverse: invert(color),
                  },
                });
              }}
            />
            <InputColor
              label="Text Alt Color"
              value={userSettings.customThemeColor.textAlt}
              onChange={(color) => {
                firebaseSetData("settings", currentUser.uid, {
                  ...userSettings,
                  customThemeColor: {
                    ...userSettings.customThemeColor,
                    textAlt: color,
                  },
                });
              }}
            />
            <InputColor
              label="Primary Color"
              value={userSettings.customThemeColor.primary}
              onChange={(color) => {
                firebaseSetData("settings", currentUser.uid, {
                  ...userSettings,
                  customThemeColor: {
                    ...userSettings.customThemeColor,
                    primary: color,
                  },
                });
              }}
            />
            <InputColor
              label="Secondary Color"
              value={userSettings.customThemeColor.secondary}
              onChange={(color) => {
                firebaseSetData("settings", currentUser.uid, {
                  ...userSettings,
                  customThemeColor: {
                    ...userSettings.customThemeColor,
                    secondary: color,
                  },
                });
              }}
            />
            <InputColor
              label="Accent Color"
              value={userSettings.customThemeColor.accent}
              onChange={(color) => {
                firebaseSetData("settings", currentUser.uid, {
                  ...userSettings,
                  customThemeColor: {
                    ...userSettings.customThemeColor,
                    accent: color,
                  },
                });
              }}
            />
          </InputGroup>
          <InputGroup>
            {/* Save Custom Theme */}
            <Input
              label="Custom Theme Name"
              value={customThemeName}
              onChange={(e) => setCustomThemeName(e.target.value)}
              placeholder={`Custom Theme ${
                userSettings.customThemes?.length + 1
              }`}
              id="customThemeName"
            />
            <button
              onClick={() => {
                firebaseSetData("settings", currentUser.uid, {
                  ...userSettings,
                  customThemes: [
                    ...(userSettings.customThemes || []),
                    {
                      name:
                        customThemeName ||
                        `Custom Theme ${userSettings.customThemes?.length + 1}`,
                      colors: userSettings.customThemeColor,
                    },
                  ],
                });
                setCustomThemeName("");
              }}
            >
              Save Custom Theme
            </button>
            <div>
              {userSettings.customThemes &&
              userSettings.customThemes.length > 0 ? (
                userSettings.customThemes.map((theme, index) => (
                  <Fragment key={index}>
                    <Button
                      onClick={() => {
                        firebaseSetData("settings", currentUser.uid, {
                          ...userSettings,
                          theme: "custom",
                          customThemeColor: theme.colors,
                        });
                      }}
                      style="secondary"
                      title={"Click to apply theme " + theme.name}
                      className={css.customThemeButton}
                    >
                      {theme.name}

                      <Button
                        onClick={() => {
                          const newCustomThemes = [
                            ...(userSettings.customThemes || []),
                          ];
                          newCustomThemes.splice(index, 1);

                          firebaseSetData("settings", currentUser.uid, {
                            ...userSettings,
                            customThemes: newCustomThemes,
                          });
                        }}
                        style="danger"
                        title={"Delete theme " + theme.name}
                        icon={{ gficon: "delete" }}
                        className={css.deleteButton}
                        width="fit-content"
                      >
                        <></>
                      </Button>
                    </Button>
                  </Fragment>
                ))
              ) : (
                <p>No custom themes saved.</p>
              )}
            </div>
          </InputGroup>
        </InputGroup>
      )}
    </div>
  );
}