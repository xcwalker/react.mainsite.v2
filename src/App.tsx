import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Project from "./pages/Project";
import { Helmet } from "react-helmet";
import ErrorPage from "./ErrorPage";
import Recipe from "./pages/Recipe";
import ProjectsPage from "./pages/Projects";
import RecipesPage from "./pages/Recipes";
import ManagePage from "./pages/account/Manage";
import LoginPage from "./pages/account/Login";
import RegisterPage from "./pages/account/Register";
import ForgotPasswordPage from "./pages/account/ForgotPassword";
import { Toaster } from "react-hot-toast";
import UserIndex from "./pages/user/Index";
import UserPage from "./pages/user/User";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Helmet>
          <title>{title}</title>
        </Helmet>

        <Toaster
          position="top-left"
          reverseOrder={true}
          containerStyle={{
            top: "calc(50px + 1rem)",
            left: "min(3rem, max(4vw, 1rem))",
          }}
        />

        <Header />
        <Main>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* projects */}
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="project">
              <Route index element={<Navigate to={"/projects"} />} />
              <Route path=":slug" element={<Project />} />
            </Route>

            {/* recipes */}
            <Route path="recipes" element={<RecipesPage />} />
            <Route path="recipe">
              <Route index element={<Navigate to={"/recipes"} />} />
              <Route path=":slug" element={<Recipe />} />
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
