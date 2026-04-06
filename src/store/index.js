/* ============================================================
   src/store/index.js – Redux Store Configuration
   Combines all slices into a single store using Redux Toolkit.
   ============================================================ */
import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "./slices/transactionsSlice";
import filtersReducer      from "./slices/filtersSlice";
import uiReducer           from "./slices/uiSlice";
import budgetReducer       from "./slices/budgetSlice";

const store = configureStore({
  reducer: {
    transactions: transactionsReducer,  // All transaction data + CRUD
    filters:      filtersReducer,       // Filter & sort state
    ui:           uiReducer,            // Navigation, theme, role, toasts
    budget:       budgetReducer,        // Monthly budget limits per category
  },
  /* Redux DevTools is enabled automatically in development */
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
