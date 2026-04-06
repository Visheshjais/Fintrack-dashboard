/* ============================================================
   src/components/Layout/Sidebar.jsx
   Navigation sidebar using Redux for active page + role state.
   ============================================================ */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectActivePage,
  selectRole,
  setActivePage,
  setRole,
} from "../../store/slices/uiSlice";
import { ROLES } from "../../data/mockData";
import "../../styles/Layout.css";

/* Nav items config – icon, label, page key, optional badge */
const NAV_ITEMS = [
  { icon: "⬡",  label: "Dashboard",    key: "dashboard"    },
  { icon: "⇄",  label: "Transactions", key: "transactions" },
  { icon: "◑",  label: "Insights",     key: "insights"     },
  { icon: "⊡",  label: "Budget",       key: "budget"       },
];

function Sidebar({ isOpen, onClose }) {
  const dispatch   = useDispatch();
  const activePage = useSelector(selectActivePage);
  const role       = useSelector(selectRole);
  const isAdmin    = role === ROLES.ADMIN;

  /* Navigate to a page and close mobile sidebar */
  function handleNav(key) {
    dispatch(setActivePage(key));
    onClose();
  }

  return (
    <>
      {/* ── Mobile overlay backdrop ── */}
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      />

      {/* ── Sidebar panel ── */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">💰</div>
          <span className="logo-text">Fin<span>Track</span></span>
        </div>

        {/* Navigation links */}
        <nav className="sidebar-nav">
          <span className="nav-section-label">Navigation</span>

          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`nav-link ${activePage === item.key ? "active" : ""}`}
              onClick={() => handleNav(item.key)}
              aria-current={activePage === item.key ? "page" : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {/* Optional nav badge */}
              {item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer – role switcher */}
        <div className="sidebar-footer">
          <span className="role-selector-label">Role</span>

          {/* Current role display */}
          <div className="role-badge-display">
            <span className={`role-dot ${isAdmin ? "admin" : "viewer"}`} />
            <span className="role-name">{isAdmin ? "Admin" : "Viewer"}</span>
            <span className="role-desc">{isAdmin ? "Full access" : "Read only"}</span>
          </div>

          {/* Role switcher dropdown */}
          <select
            className="select"
            value={role}
            onChange={(e) => dispatch(setRole(e.target.value))}
            aria-label="Switch role"
          >
            <option value={ROLES.VIEWER}>Viewer – Read Only</option>
            <option value={ROLES.ADMIN}>Admin – Full Access</option>
          </select>

          {/* Admin hint */}
          {isAdmin && (
            <p style={{
              fontSize: "0.7rem",
              color: "var(--accent-blue-2)",
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}>
              ✦ Admin: add, edit & delete transactions
            </p>
          )}
        </div>

        {/* Persistence status indicator */}
        <div className="persist-indicator">
          <span className="persist-dot" />
          <span>Data saved locally</span>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
