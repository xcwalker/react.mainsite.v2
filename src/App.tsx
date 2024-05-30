import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Project from "./pages/Project";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />

        <Header />
        <Main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project">
              <Route index element={<Navigate to={"/#projects"} />} />
              <Route path=":slug" element={<Project />} />
            </Route>
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
