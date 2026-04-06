/* ============================================================
   src/App.jsx – Root Application Component
   Uses Redux for navigation state instead of local useState.
   ============================================================ */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectActivePage,
  selectSidebarOpen,
  setSidebarOpen,
} from "./store/slices/uiSlice";
import Sidebar           from "./components/Layout/Sidebar";
import Header            from "./components/Layout/Header";
import ToastContainer    from "./components/Common/Toast";
import DashboardPage     from "./pages/DashboardPage";
import TransactionsPage  from "./pages/TransactionsPage";
import InsightsPage      from "./pages/InsightsPage";
import BudgetPage        from "./pages/BudgetPage";
import "./styles/Layout.css";

/* Map of page keys → page components */
const PAGES = {
  dashboard:    DashboardPage,
  transactions: TransactionsPage,
  insights:     InsightsPage,
  budget:       BudgetPage,
};

/* Page heading metadata */
const PAGE_META = {
  dashboard:    { title: "Dashboard",    description: "Your financial overview at a glance" },
  transactions: { title: "Transactions", description: "Explore, filter, and manage your transactions" },
  insights:     { title: "Insights",     description: "Understand your spending patterns & trends" },
  budget:       { title: "Budget",       description: "Set and track your monthly spending limits" },
};

function App() {
  const dispatch    = useDispatch();
  const activePage  = useSelector(selectActivePage);
  const sidebarOpen = useSelector(selectSidebarOpen);

  /* Resolve current page component and meta */
  const PageComponent = PAGES[activePage] || DashboardPage;
  const meta          = PAGE_META[activePage] || PAGE_META.dashboard;

  return (
    <div className="app-shell">
      {/* ── Sidebar (fixed left) ── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => dispatch(setSidebarOpen(false))}
      />

      {/* ── Main content area ── */}
      <div className="main-content">
        {/* Sticky top header */}
        <Header onMenuClick={() => dispatch(setSidebarOpen(true))} />

        {/* Page content */}
        <div className="page-wrapper">
          <div className="page-header">
            <h1 className="page-title">{meta.title}</h1>
            <p className="page-description">{meta.description}</p>
          </div>

          {/* Animated page render */}
          <PageComponent key={activePage} />
        </div>
      </div>

      {/* ── Global toast notifications ── */}
      <ToastContainer />
    </div>
  );
}

export default App;
