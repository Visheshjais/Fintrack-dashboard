/* ============================================================
   src/store/slices/uiSlice.js
   Redux slice for all UI/UX state:
     • Active page navigation
     • Dark mode toggle (persisted)
     • Current user role (persisted)
     • Sidebar open state (mobile)
     • Toast notification queue
   ============================================================ */
import { createSlice } from "@reduxjs/toolkit";
import { ROLES } from "../../data/mockData";

/* ── Load persisted preferences ── */
const storedRole = localStorage.getItem("fintrack_role") || ROLES.VIEWER;
const storedDark = localStorage.getItem("fintrack_dark");
const isDark     = storedDark !== null ? storedDark === "true" : true; // default: dark

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    activePage:  "dashboard",    // "dashboard" | "transactions" | "insights" | "budget"
    role:        storedRole,     // "admin" | "viewer"
    darkMode:    isDark,         // boolean
    sidebarOpen: false,          // mobile sidebar toggle
    toasts:      [],             // [{id, type, message, duration}]
  },
  reducers: {
    /* Navigate to a page */
    setActivePage: (state, action) => {
      state.activePage  = action.payload;
      state.sidebarOpen = false; // always close mobile sidebar on navigate
    },

    /* Change user role */
    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem("fintrack_role", action.payload);
    },

    /* Toggle dark/light mode */
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("fintrack_dark", state.darkMode);
      /* Apply immediately to <html> element */
      document.documentElement.setAttribute(
        "data-theme",
        state.darkMode ? "dark" : "light"
      );
    },

    /* Open/close mobile sidebar */
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },

    /* Push a new toast notification */
    addToast: (state, action) => {
      const { type = "info", message, duration = 3500 } = action.payload;
      state.toasts.push({
        id:      Date.now() + Math.random(), // unique ID
        type,
        message,
        duration,
      });
    },

    /* Remove toast by id */
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  setActivePage,
  setRole,
  toggleDarkMode,
  setSidebarOpen,
  addToast,
  removeToast,
} = uiSlice.actions;

/* ── Selectors ── */
export const selectActivePage  = (state) => state.ui.activePage;
export const selectRole        = (state) => state.ui.role;
export const selectIsAdmin     = (state) => state.ui.role === ROLES.ADMIN;
export const selectDarkMode    = (state) => state.ui.darkMode;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectToasts      = (state) => state.ui.toasts;

export default uiSlice.reducer;
