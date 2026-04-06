/* ============================================================
   src/index.js – Application Entry Point
   Wraps the app in Redux Provider and initializes theme.
   ============================================================ */
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/index";
import App from "./App";
import "./styles/index.css";

/* Apply persisted theme before first render (prevents flash) */
const savedTheme = localStorage.getItem("fintrack_dark");
const isDark     = savedTheme !== null ? savedTheme === "true" : true;
document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Redux Provider makes the store available to every component */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
