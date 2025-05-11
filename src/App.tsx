import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import HomeIndex from "./pages/home/Index";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import ItemPage from "./pages/itemPage/Index";
import { Helmet } from "react-helmet";
import ErrorPage from "./ErrorPage";
import ProjectsPage from "./pages/Projects";
import RecipesPage from "./pages/Recipes";
import ManagePage from "./pages/account/Manage";
import LoginPage from "./pages/account/Login";
import RegisterPage from "./pages/account/Register";
import ForgotPasswordPage from "./pages/account/ForgotPassword";
import { Toaster } from "react-hot-toast";
import UserIndex from "./pages/user/Index";
import UserPage from "./pages/user/User";
import DashboardIndex from "./pages/dashboard/Index";
import BlogPage from "./pages/Blog";
import ItemCreate from "./pages/itemPage/Create";
import Protect from "./components/Security/Protect";
import { atomWithStorage } from "jotai/utils";
import BannerContainer from "./components/Banners/BannerContainer";
import AlbumsPage from "./pages/Albums";

export default function App() {
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
              <Route index element={<BlogPage />} />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} />}>
                    <ItemCreate />
                  </Protect>
                }
              />

              <Route path=":slug" element={<ItemPage itemType="blog" />} />
            </Route>

            {/* projects */}
            <Route path="projects">
              <Route index element={<ProjectsPage />} />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} />}>
                    <ItemCreate />
                  </Protect>
                }
              />
              <Route path=":slug" element={<ItemPage itemType="projects" />} />
            </Route>

            {/* recipes */}
            <Route path="recipes">
              <Route index element={<RecipesPage />} />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} />}>
                    <ItemCreate />
                  </Protect>
                }
              />

              <Route path=":slug" element={<ItemPage itemType="recipes" />} />
            </Route>

            {/* album */}
            <Route path="albums">
              <Route index element={<AlbumsPage />} />
              <Route
                path="create"
                element={
                  <Protect redirect={<Navigate to={"/account"} />}>
                    <ItemCreate />
                  </Protect>
                }
              />
              <Route path=":slug" element={<ItemPage itemType="albums" />} />
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
              <Route index element={<UserIndex />} />
              <Route path=":uuid" element={<UserPage />} />
            </Route>

            {/* dashboard */}
            <Route path="dashboard" element={<DashboardIndex />} />

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
