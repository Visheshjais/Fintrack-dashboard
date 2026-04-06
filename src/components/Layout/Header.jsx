/* ============================================================
   src/components/Layout/Header.jsx
   Sticky top bar. React.memo prevents re-renders unless Redux
   state actually changes. Clock is isolated in LiveClock.
   ============================================================ */
import React, { memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectActivePage,
  selectRole,
  selectDarkMode,
  toggleDarkMode,
} from "../../store/slices/uiSlice";
import { selectTransactions, selectLastUpdated } from "../../store/slices/transactionsSlice";
import { ROLES } from "../../data/mockData";
import { computeSummary, formatCurrencyCompact } from "../../utils/helpers";
import LiveClock from "../Common/LiveClock";
import "../../styles/Layout.css";

const PAGE_META = {
  dashboard:    { title: "Dashboard",    subtitle: "Your financial overview" },
  transactions: { title: "Transactions", subtitle: "Manage your transactions" },
  insights:     { title: "Insights",     subtitle: "Spending patterns & trends" },
  budget:       { title: "Budget",       subtitle: "Monthly spending limits" },
};

/* SavedChip only re-renders when lastUpdated changes */
const SavedChip = memo(function SavedChip({ lastUpdated }) {
  if (!lastUpdated) return null;
  const secs = Math.round((Date.now() - lastUpdated) / 1000);
  let label;
  if (secs < 5)  label = "just saved";
  else if (secs < 60) label = `saved ${secs}s ago`;
  else label = `saved ${Math.floor(secs / 60)}m ago`;
  return (
    <span className="saved-chip hide-mobile">✓ {label}</span>
  );
});

const Header = memo(function Header({ onMenuClick }) {
  const dispatch     = useDispatch();
  const activePage   = useSelector(selectActivePage);
  const role         = useSelector(selectRole);
  const darkMode     = useSelector(selectDarkMode);
  const transactions = useSelector(selectTransactions);
  const lastUpdated  = useSelector(selectLastUpdated);
  const isAdmin      = role === ROLES.ADMIN;

  const meta    = PAGE_META[activePage] || PAGE_META.dashboard;
  const { balance } = computeSummary(transactions);

  return (
    <header className="header">
      {/* Left: hamburger + title */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button className="hamburger" onClick={onMenuClick} aria-label="Open navigation">
          <span /><span /><span />
        </button>
        <div className="header-left">
          <div className="header-title">{meta.title}</div>
          <div className="header-subtitle">{meta.subtitle}</div>
        </div>
      </div>

      {/* Right: actions */}
      <div className="header-actions">
        {/* Net balance quick chip */}
        <div
          className="hide-mobile"
          style={{
            fontFamily:  "var(--font-mono)",
            fontSize:    "0.8rem",
            fontWeight:  700,
            color:       balance >= 0 ? "var(--accent-green)" : "var(--accent-red)",
            background:  balance >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            border:      "1px solid",
            borderColor: balance >= 0 ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)",
            padding:     "4px 12px",
            borderRadius:"var(--radius-full)",
          }}
        >
          {balance >= 0 ? "▲" : "▼"} {formatCurrencyCompact(Math.abs(balance))}
        </div>

        {/* Isolated clock — only it re-renders every second */}
        <LiveClock />

        {/* Last saved — only re-renders when lastUpdated changes */}
        <SavedChip lastUpdated={lastUpdated} />

        {/* Role badge */}
        <span className={`badge ${isAdmin ? "badge-admin" : "badge-viewer"}`}>
          {isAdmin ? "◆ Admin" : "◎ Viewer"}
        </span>

        {/* Theme toggle */}
        <button
          className="theme-toggle"
          onClick={() => dispatch(toggleDarkMode())}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
        >
          {darkMode ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
});

export default Header;
