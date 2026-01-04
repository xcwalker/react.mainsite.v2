import { separator, title } from "../../App.tsx";
import firebaseSetData from "../../functions/firebase/storage/setData.tsx";
import { Fragment, useEffect, useState } from "react";
import firebaseGetRealtimeData from "../../functions/firebase/storage/useRealtimeData.tsx";
import LoadingPage from "../../components/Loading.tsx";
import { useAuth } from "../../functions/firebase/authentication/useAuth.tsx";
import {
  userSettingsDefault,
  userSettingsType,
  UserType,
} from "../../types.tsx";
import css from "../../styles/pages/account/manage.module.css";
import Button from "../../components/Button.tsx";
import { User } from "firebase/auth";
import SettingSection from "../../components/SettingSection.tsx";
import { Navigate, useParams } from "react-router-dom";
import { SidebarContainer } from "../../components/Sidebar/SidebarContainer.tsx";
import { RoleProtect } from "../../components/Security/Protect.tsx";
import SettingsNavigation from "./Navigation.tsx";
import SettingsNewTab from "./NewTab.tsx";
import SettingsOrganizations from "./Organization.tsx";
import PageSeoWrapper from "../../components/PageSeoWrapper.tsx";
import toTitleCase from "../../functions/toTitleCase.tsx";
import { SettingsAccount } from "./Account.tsx";
import SettingsThemes from "./Themes.tsx";
import SideBySide from "../../components/SideBySide.tsx";
import SettingsRadio from "./Radio.tsx";
import SettingsHome from "./Home.tsx";

export default function SettingsPage() {
  const currentUser = useAuth();
  const [userSettings, setUserSettings] = useState<userSettingsType | null>(
    null
  );
  const [userData, setUserData] = useState<UserType | null>(null);
  const { page } = useParams();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    firebaseGetRealtimeData(
      "users",
      currentUser.uid,
      setUserData as React.Dispatch<React.SetStateAction<unknown>>
    );

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

  if (currentUser === null) {
    return <Navigate to="/account/login" replace={true} />;
  }

  if (page === undefined) {
    return <Navigate to="./themes" replace={true} />;
  }

  if (!userSettings || !currentUser || !userData) {
    return <LoadingPage />;
  }

  return (
    <PageSeoWrapper
      title={`${toTitleCase(page)} Settings ${separator} ${title}`}
      description={`Manage settings for ${title}`}
    >
      <SideBySide leftWidth="250px">
        <Sidebar />
        <main className={css.main}>
          {pages.map((pageItem) => {
            if (page === pageItem.name) {
              const Component = pageItem.component;

              return (
                <Fragment key={pageItem.name}>
                  <h1 className={css.pageTitle}>{pageItem.title}</h1>
                  <Component
                    key={pageItem.name}
                    userSettings={userSettings}
                    userData={userData}
                    currentUser={currentUser}
                  />
                </Fragment>
              );
            }
            return null;
          })}
        </main>
      </SideBySide>
    </PageSeoWrapper>
  );
}

type PageItem = {
  name: string;
  title: string;
  icon: string;
  component: React.ComponentType<{
    userSettings: userSettingsType;
    userData: UserType;
    currentUser: User;
  }>;
  adminOnly?: boolean;
};

const pages: PageItem[] = [
  {
    name: "themes",
    title: "Manage Themes",
    icon: "format_paint",
    component: SettingsThemes,
  },
  {
    name: "radio",
    title: "Radio Settings",
    icon: "radio",
    component: SettingsRadio,
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
    component: SettingsHome,
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
    component: SettingsNewTab,
  },
  {
    name: "shortcuts",
    title: "Keyboard Shortcuts",
    icon: "keyboard",
    component: Page_KeyboardShortcuts,
  },
  {
    name: "organization",
    title: "Organization Shortcuts",
    icon: "domain",
    component: SettingsOrganizations,
  },
  {
    name: "account",
    title: "Manage Account",
    icon: "account_circle",
    component: SettingsAccount,
  },
];

export function Sidebar() {
  return (
    <SidebarContainer>
      <nav className={css.sidebarNav}>
        <ul>
          {pages.map((pageItem, index) => {
            if (pageItem.adminOnly) {
              return (
                <Fragment key={index}>
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
                </Fragment>
              );
            } else {
              return (
                <Fragment key={index}>
                  <li key={pageItem.name}>
                    <Button
                      href={"../" + pageItem.name}
                      title={pageItem.title}
                      icon={{ gficon: pageItem.icon }}
                    >
                      {pageItem.title}
                    </Button>
                  </li>
                </Fragment>
              );
            }
          })}
        </ul>
      </nav>
    </SidebarContainer>
  );
}

function Page_KeyboardShortcuts() {
  return (
    <SettingSection id="keyboardShortcuts" title="Keyboard Shortcuts">
      <p>Keyboard shortcuts coming soon!</p>
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