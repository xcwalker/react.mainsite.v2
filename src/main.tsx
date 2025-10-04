import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles/defaults/page-setup.css";
import "./styles/defaults/transitions.css";
import "./styles/defaults/variables.css";

import "./fonts/fonts.css";
import "./fonts/EmotionalRescueRegular.ttf";
import ThemeController from "./ThemeController.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeController>
      <App />
    </ThemeController>
  </React.StrictMode>
);
