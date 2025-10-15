import { firebaseLogout } from "../../functions/firebase/authentication/logout";
import { Helmet } from "react-helmet";
import { separator, title } from "../../App";
import { availableThemes } from "../../SettingController";
import firebaseSetData from "../../functions/firebase/storage/setData";
import { Fragment, useEffect, useState } from "react";
import firebaseGetRealtimeData from "../../functions/firebase/storage/useRealtimeData";
import LoadingPage from "../../components/Loading";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import {
  customThemeType,
  userSettingsDefault,
  userSettingsType,
} from "../../types";
import InputColor from "../../components/InputColor";
import invert from "invert-color";
import InputGroup from "../../components/InputGroup";
import Input from "../../components/Input";
import SideBySide from "../../components/SideBySide";
import css from "../../styles/pages/account/manage.module.css";
import Button from "../../components/Button";
import { User } from "firebase/auth";
import ButtonWithPreview from "../../components/ButtonWithPreview";
import SettingSection from "../../components/SettingSection";
import { Navigate, useParams } from "react-router-dom";
import { SidebarContainer } from "../../components/Sidebar/SidebarContainer";
import { RoleProtect } from "../../components/Security/Protect";
import SettingsNavigation from "./Settings/Navigation";

export default function ManagePage() {
  const currentUser = useAuth();
  const [userSettings, setUserSettings] = useState<userSettingsType | null>(
    null
  );
  const { page } = useParams();

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
        <Sidebar />
        <main className={css.main}>
          {pages.map((pageItem) => {
            if (page === pageItem.name) {
              const Component = pageItem.component;

              return (
                <Component
                  key={pageItem.name}
                  userSettings={userSettings}
                  currentUser={currentUser}
                />
              );
            }
            return null;
          })}
          {!page && <Navigate to={pages[0].name} replace={true} />}
        </main>
      </SideBySide>
    </>
  );
}
type PageItem = {
  name: string;
  title: string;
  icon: string;
  component: React.ComponentType<{
    userSettings: userSettingsType;
    currentUser: User;
  }>;
  adminOnly?: boolean;
};

const pages: PageItem[] = [
  {
    name: "themes",
    title: "Manage Themes",
    icon: "format_paint",
    component: Page_Themes,
  },
  {
    name: "radio",
    title: "Radio Settings",
    icon: "radio",
    component: Page_Radio,
  },
  {
    name: "navigation",
    title: "Navigation Settings",
    icon: "explore",
    component: SettingsNavigation,
  },
  {
    name: "home",
    title: "Home Settings",
    icon: "home",
    component: Page_Home,
  },
  {
    name: "admin",
    title: "Admin Settings",
    icon: "admin_panel_settings",
    adminOnly: true,
    component: Page_Admin,
  },
  {
    name: "dashboard",
    title: "Dashboard Settings",
    icon: "dashboard",
    component: Page_Dashboard,
  },
  {
    name: "newtab",
    title: "New Tab Settings",
    icon: "tab",
    component: Page_NewTab,
  },
  {
    name: "keyboardShortcuts",
    title: "Keyboard Shortcuts",
    icon: "keyboard",
    component: Page_KeyboardShortcuts,
  },
  {
    name: "account",
    title: "Manage Account",
    icon: "account_circle",
    component: Page_Account,
  },
];

export function Sidebar() {
  return (
    <SidebarContainer>
      <nav className={css.sidebarNav}>
        <ul>
          {pages.map((pageItem) => {
            if (pageItem.adminOnly) {
              return (
                <RoleProtect staffOnly>
                  <li key={pageItem.name}>
                    <Button
                      href={"../" + pageItem.name}
                      title={pageItem.title}
                      icon={{ gficon: pageItem.icon }}
                    >
                      {pageItem.title}
                    </Button>
                  </li>
                </RoleProtect>
              );
            } else {
              return (
                <li key={pageItem.name}>
                  <Button
                    href={"../" + pageItem.name}
                    title={pageItem.title}
                    icon={{ gficon: pageItem.icon }}
                  >
                    {pageItem.title}
                  </Button>
                </li>
              );
            }
          })}
        </ul>
      </nav>
    </SidebarContainer>
  );
}

function Page_Account() {
  return (
    <SettingSection id="accountSettings" title="Account Settings">
      <Button
        style="danger"
        title="Sign out of your account"
        icon={{ gficon: "logout" }}
        width="fit-content"
        onClick={() => {
          firebaseLogout();
        }}
      >
        Sign Out
      </Button>
    </SettingSection>
  );
}

function Page_Themes(props: {
  userSettings: userSettingsType;
  currentUser: User;
}) {
  const { currentUser, userSettings } = props;
  const [customThemeName, setCustomThemeName] = useState("");
  return (
    <SettingSection id="themeSettings" title="Theme Settings">
      <ul className={css.themeList}>
        {availableThemes.map((theme, index) => (
          <li key={index}>
            <ButtonWithPreview
              title="Click to select theme"
              style={userSettings.theme === theme ? "primary" : "secondary"}
              label={theme}
              onClick={() => {
                firebaseSetData("settings", currentUser.uid, {
                  ...userSettings,
                  theme: theme,
                });
              }}
            >
              {PreviewTheme({ themeName: theme })}
            </ButtonWithPreview>
          </li>
        ))}
      </ul>
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
    </SettingSection>
  );
}

function Page_Radio() {
  return (
    <SettingSection id="radioSettings" title="Radio Settings">
      <p>Radio settings coming soon!</p>
    </SettingSection>
  );
}



function Page_KeyboardShortcuts() {
  return (
    <SettingSection id="keyboardShortcuts" title="Keyboard Shortcuts">
      <p>Keyboard shortcuts coming soon!</p>
    </SettingSection>
  );
}

function Page_Home() {
  return (
    <SettingSection id="homeSettings" title="Home Settings">
      <p>Home settings coming soon!</p>
    </SettingSection>
  );
}

function Page_Admin() {
  return (
    <SettingSection id="adminSettings" title="Admin Settings">
      <p>Admin settings coming soon!</p>
    </SettingSection>
  );
}

function Page_Dashboard() {
  return (
    <SettingSection id="dashboardSettings" title="Dashboard Settings">
      <p>Dashboard settings coming soon!</p>
    </SettingSection>
  );
}

function Page_NewTab() {
  return (
    <SettingSection id="newTabSettings" title="New Tab Settings">
      <p>New tab settings coming soon!</p>
    </SettingSection>
  );
}

function PreviewTheme(props: {
  themeName: string;
  customThemeColors?: customThemeType;
}) {
  return (
    <div className="preview" data-theme={props.themeName}>
      Previewing theme: {props.themeName}
    </div>
  );
}
