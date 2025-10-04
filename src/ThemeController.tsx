import { useEffect } from "react";

import "./styles/themes/proton.css";

export default function ThemeController(props: { children: React.ReactNode }) {
  const theme = "";

  // proton

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{props.children}</>;
}
