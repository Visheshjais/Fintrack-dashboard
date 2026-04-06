/* ============================================================
   src/pages/DashboardPage.jsx
   Main overview: health score, KPI cards, charts,
   and recent transactions mini-list.
   ============================================================ */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTransactions } from "../store/slices/transactionsSlice";
import { setActivePage } from "../store/slices/uiSlice";
import WelcomeBanner        from "../components/Dashboard/WelcomeBanner";
import SummaryCards         from "../components/Dashboard/SummaryCards";
import BalanceTrend         from "../components/Dashboard/BalanceTrend";
import SpendingBreakdown    from "../components/Dashboard/SpendingBreakdown";
import FinancialHealthScore from "../components/Dashboard/FinancialHealthScore";
import { formatCurrency, formatDate } from "../utils/helpers";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../data/mockData";
import "../styles/Dashboard.css";

function DashboardPage() {
  const dispatch     = useDispatch();
  const transactions = useSelector(selectTransactions);

  /* Last 5 transactions sorted by date */
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      {/* ── Welcome Banner ── */}
      <WelcomeBanner />

      {/* ── Financial Health Score ── */}
      <FinancialHealthScore />

      {/* ── KPI Summary Cards ── */}
      <SummaryCards />

      {/* ── Charts Grid ── */}
      <div className="charts-grid">
        <BalanceTrend />
        <SpendingBreakdown />
      </div>

      {/* ── Recent Transactions ── */}
      <div className="recent-section card">
        <div className="section-header">
          <div>
            <div className="section-title">Recent Transactions</div>
            <div className="section-sub">Latest 5 entries</div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => dispatch(setActivePage("transactions"))}
          >
            View All →
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state" style={{ padding: "var(--space-xl)" }}>
            <span className="empty-icon">💸</span>
            <p>No transactions yet. Switch to Admin and add your first one!</p>
          </div>
        ) : (
          <div>
            {recent.map((tx, idx) => {
              const catColor = CATEGORY_COLORS[tx.category] || "var(--text-secondary)";
              const catIcon  = CATEGORY_ICONS[tx.category]  || "•";
              return (
                <div
                  key={tx.id}
                  className="recent-tx-row"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Left: dot + info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                    <div
                      className="tx-dot"
                      style={{ background: catColor, boxShadow: `0 0 6px ${catColor}60` }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div className="tx-desc">{tx.description}</div>
                      <div className="tx-meta">
                        {formatDate(tx.date)} · {catIcon} {tx.category}
                      </div>
                    </div>
                  </div>

                  {/* Right: amount */}
                  <div
                    className={`tx-amount mono ${tx.type === "income" ? "text-green" : "text-red"}`}
                  >
                    {tx.type === "income" ? "+" : "−"}{formatCurrency(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
