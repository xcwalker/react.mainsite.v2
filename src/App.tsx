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

export default function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Helmet>
          <title>{title}</title>
        </Helmet>

        <Header />
        <Main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project">
              <Route index element={<Navigate to={"/#projects"} />} />
              <Route path=":slug" element={<Project />} />
            </Route>
            <Route path="*" element={<ErrorPage code={404} error="Page not found" />} />
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
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const title = "xcwalker";
export const separator = "|";
