import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import HomeIndex from "./pages/home/Index";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import ItemPage from "./pages/itemPage/Index";
import { Helmet } from "react-helmet";
import ErrorPage from "./ErrorPage";
import ViewAllPage from "./pages/ViewAll";
import ManagePage from "./pages/account/Manage";
import LoginPage from "./pages/account/Login";
import RegisterPage from "./pages/account/Register";
import ForgotPasswordPage from "./pages/account/ForgotPassword";
import { Toaster } from "react-hot-toast";
import UserIndex from "./pages/user/Index";
import UserPage from "./pages/user/User";
import DashboardIndex from "./pages/dashboard/Index";
import ItemCreate from "./pages/itemPage/Create";
import Protect from "./components/Security/Protect";
import { atomWithStorage } from "jotai/utils";
import BannerContainer from "./components/Banners/BannerContainer";
import NewTab from "./pages/newTab/Index";
import NewTabEdit from "./pages/newTab/Edit";
import { useAuth } from "./functions/firebase/authentication/useAuth";
import firebaseUpdateUserLastSeen from "./functions/firebase/user/updateUserLastSeen";
import ItemEdit from "./pages/itemPage/Edit";
import VehiclePage from "./pages/vehiclePage/Index";
import { FindVehiclePage } from "./pages/vehiclePage/Find";

export default function App() {
  const currentUser = useAuth();
  const [ticking] = useState(true);
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);
  const [focusState, setFocusState] = useState<"online" | "away">("online");

  const handlePageClose = useCallback(() => {
    if (currentUser === null || currentUser === undefined) return;

    firebaseUpdateUserLastSeen(currentUser.uid, "offline");
  }, [currentUser]);

  const handlePageAbandoned = () => {
    setCount2((count) => count + 1);
  };

  useEffect(() => {
    window.addEventListener("onMouseOver", () => {
      handlePageAbandoned();
    });

    window.addEventListener("onScroll", () => {
      handlePageAbandoned();
    });

    window.addEventListener("onKeyDown", () => {
      handlePageAbandoned();
    });

    window.addEventListener("focus", () => {
      handlePageAbandoned();
    });

    return () => {
      handlePageClose();

      window.removeEventListener("onMouseOver", () => {
        handlePageAbandoned();
      });

      window.removeEventListener("onScroll", () => {
        handlePageAbandoned();
      });

      window.removeEventListener("onKeyDown", () => {
        handlePageAbandoned();
      });

      window.removeEventListener("focus", () => {
        handlePageAbandoned();
      });
    };
  }, [handlePageClose]);

  useEffect(() => {
    if (currentUser === null || currentUser === undefined) return;

    firebaseUpdateUserLastSeen(currentUser.uid, focusState);
  }, [currentUser, count, focusState]);

  useEffect(() => {
    const timer = setTimeout(() => ticking && setCount(count + 1), 60000);

    return () => {
      clearTimeout(timer);
    };
  }, [count, ticking]);

  useEffect(() => {
    const timer = setTimeout(() => ticking && setFocusState("away"), 60000);

    return () => {
      clearTimeout(timer);
    };
  }, [count2, ticking]);

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Helmet>
          <title>{title}</title>
        </Helmet>

        <Toaster
          position="top-right"
          reverseOrder={true}
          containerStyle={{
            top: "1rem",
            right: "1rem",
          }}
        />

        <Header />

        <Main>
          <BannerContainer />
          <Routes>
            <Route path="/" element={<HomeIndex />} />

            {/* blog */}
            <Route path="blog">
              <Route
                index
                element={
                  <ViewAllPage
                    itemType="blog"
                    title="My Blog"
                    hasThumbnail={false}
                  />
                }
              />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} />}>
                    <ItemCreate itemType="blog" />
                  </Protect>
                }
              />
              <Route path=":slug">
                <Route index element={<ItemPage itemType="blog" />} />
                <Route path="edit" element={<ItemEdit itemType="blog" />} />
              </Route>
            </Route>

            {/* projects */}
            <Route path="projects">
              <Route
                index
                element={
                  <ViewAllPage
                    itemType="projects"
                    title="My Projects"
                    hasThumbnail={true}
                  />
                }
              />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} />}>
                    <ItemCreate itemType="projects" />
                  </Protect>
                }
              />
              <Route path=":slug">
                <Route index element={<ItemPage itemType="projects" />} />
                <Route path="edit" element={<ItemEdit itemType="projects" />} />
              </Route>
            </Route>

            {/* recipes */}
            <Route path="recipes">
              <Route
                index
                element={
                  <ViewAllPage
                    itemType="recipes"
                    title="My Recipes"
                    hasThumbnail={true}
                  />
                }
              />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} />}>
                    <ItemCreate itemType="recipes" />
                  </Protect>
                }
              />
              <Route path=":slug">
                <Route index element={<ItemPage itemType="recipes" />} />
                <Route path="edit" element={<ItemEdit itemType="recipes" />} />
              </Route>
            </Route>

            {/* vehicles */}
            <Route path="vehicles">
              <Route index element={<FindVehiclePage />} />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} />}>
                    <ItemCreate itemType="vehicles" />
                  </Protect>
                }
              />
              <Route path=":vrn/:vin6">
                <Route index element={<VehiclePage itemType="vehicles" />} />
                <Route path="edit" element={<ItemEdit itemType="vehicles" />} />
              </Route>
            </Route>

            {/* album */}
            <Route path="albums">
              <Route
                index
                element={
                  <ViewAllPage
                    itemType="albums"
                    title="My Albums"
                    hasThumbnail={true}
                  />
                }
              />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} />}>
                    <ItemCreate itemType="albums" />
                  </Protect>
                }
              />
              <Route path=":slug">
                <Route index element={<ItemPage itemType="albums" />} />
                <Route path="edit" element={<ItemEdit itemType="albums" />} />
              </Route>
            </Route>

            {/* accounts */}
            <Route path="account">
              <Route index element={<Navigate to={"manage"} />} />
              <Route path="manage" element={<ManagePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot" element={<ForgotPasswordPage />} />
            </Route>
            {/* user */}
            <Route path="user">
              <Route
                index
                element={
                  <Protect redirect={<Navigate to={"/account"} />}>
                    <UserIndex />
                  </Protect>
                }
              />

              <Route path=":uuid" element={<UserPage />} />
            </Route>

            {/* dashboard */}
            <Route
              path="dashboard"
              element={
                <Protect redirect={<Navigate to={"/account"} />}>
                  <DashboardIndex />
                </Protect>
              }
            />

            {/* new tab */}
            <Route path="newtab">
              <Route
                index
                element={
                  <Protect redirect={<Navigate to={"/account"} />}>
                    <NewTab />
                  </Protect>
                }
              />
              <Route
                path="edit"
                element={
                  <Protect redirect={<Navigate to={"/account"} />}>
                    <NewTabEdit />
                  </Protect>
                }
              />
            </Route>
            {/* 404 */}
            <Route
              path="*"
              element={<ErrorPage code={404} error="Page not found" />}
            />
          </Routes>
        </Main>

        <Footer />
      </BrowserRouter>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log(pathname);
    // window.scrollTo(0,0);
    setTimeout(() => window.scrollTo(0, 0), 10);
  }, [pathname]);

  return null;
}

export const title = "xcwalker";
export const separator = "|";

export const RadioAtom = atomWithStorage("radioSettings", {
  volume: 50,
  inSidebar: false,
  showDJ: true,
  state: "paused",
  nowPlaying: {
    title: "Steve’s Going to London",
    artist: "AJR",
    artwork: "https://i.scdn.co/image/ab67616d00001e0204a3ca0d3bf91c88f969f905",
  },
  dj: {
    name: "MadMatt",
    show: "Retro Requests",
    image:
      "https://simulatorradio.com/processor/avatar?size=256&name=1726140003584.png",
  },
});
