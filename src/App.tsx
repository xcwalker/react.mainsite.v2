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
import ProjectIndex from "./pages/project/Index";
import { Helmet } from "react-helmet";
import ErrorPage from "./ErrorPage";
import RecipeIndex from "./pages/recipe/Index";
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
import HideComponent from "./components/HideComponent";
import BlogPage from "./pages/Blog";
import BlogIndex from "./pages/blog/Index";

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
          <Routes>
            <Route path="/" element={<HomeIndex />} />

            {/* blog */}
            <Route path="blog">
              <Route index element={<BlogPage />} />
              <Route path=":slug" element={<BlogIndex />} />
            </Route>

            {/* projects */}
            <Route path="project">
              <Route index element={<ProjectsPage />} />
              <Route path=":slug" element={<ProjectIndex />} />
            </Route>

            {/* recipes */}
            <Route path="recipe">
              <Route index element={<RecipesPage />} />
              <Route path=":slug" element={<RecipeIndex />} />
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
