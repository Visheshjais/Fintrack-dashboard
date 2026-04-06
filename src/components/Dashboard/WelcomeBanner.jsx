/* ============================================================
   src/components/Dashboard/WelcomeBanner.jsx
   Greeting banner with quick stats and action buttons.
   Clock is isolated in LiveClock; banner wrapped in memo.
   ============================================================ */
import React, { memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectRole, setActivePage } from "../../store/slices/uiSlice";
import { selectTransactions } from "../../store/slices/transactionsSlice";
import { computeSummary, formatCurrency } from "../../utils/helpers";
import { ROLES } from "../../data/mockData";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning",   icon: "🌤" };
  if (h < 17) return { text: "Good afternoon", icon: "☀️" };
  if (h < 21) return { text: "Good evening",   icon: "🌆" };
  return        { text: "Good night",          icon: "🌙" };
}

const WelcomeBanner = memo(function WelcomeBanner() {
  const dispatch     = useDispatch();
  const role         = useSelector(selectRole);
  const transactions = useSelector(selectTransactions);
  const isAdmin      = role === ROLES.ADMIN;

  const { totalIncome, totalExpenses, balance, savingsRate } =
    computeSummary(transactions);

  const greeting = getGreeting();

  const tip =
    savingsRate >= 20  ? "Great savings discipline! Keep investing the surplus." :
    savingsRate >= 10  ? "You're doing well — push savings past 20% for security." :
    balance < 0        ? "Expenses exceed income this period — review top categories." :
    "Set monthly budgets in the Budget page to stay on track.";

  const dateStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="welcome-banner">
      {/* Decorative blob */}
      <div className="welcome-blob" />

      {/* Left: greeting */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <span style={{ fontSize: "1.5rem" }}>{greeting.icon}</span>
          <span className="welcome-heading">
            {greeting.text}
            {isAdmin && <span className="welcome-role"> · Admin</span>}
          </span>
        </div>
        <div className="welcome-date">{dateStr}</div>
        <div className="welcome-tip">
          <span style={{ color: "var(--accent-yellow)", flexShrink: 0 }}>◆</span>
          <span>{tip}</span>
        </div>
      </div>

      {/* Centre: stats */}
      <div className="welcome-stats">
        {[
          { label: "Net Balance",    value: formatCurrency(Math.abs(balance)), prefix: balance >= 0 ? "+" : "−", color: balance >= 0 ? "var(--accent-green)" : "var(--accent-red)" },
          { label: "Savings Rate",   value: `${savingsRate.toFixed(1)}%`,       prefix: "", color: savingsRate >= 20 ? "var(--accent-green)" : savingsRate >= 10 ? "var(--accent-yellow)" : "var(--accent-red)" },
          { label: "Transactions",   value: transactions.length,                prefix: "", color: "var(--accent-primary)" },
        ].map((s) => (
          <div key={s.label} className="welcome-stat">
            <div className="welcome-stat-val" style={{ color: s.color }}>
              {s.prefix}{s.value}
            </div>
            <div className="welcome-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Right: quick actions */}
      <div className="welcome-actions">
        <button className="btn btn-primary btn-sm"
          onClick={() => dispatch(setActivePage("transactions"))}>
          Transactions →
        </button>
        <button className="btn btn-secondary btn-sm"
          onClick={() => dispatch(setActivePage("insights"))}>
          Insights →
        </button>
        {isAdmin && (
          <button className="btn btn-secondary btn-sm"
            onClick={() => dispatch(setActivePage("budget"))}>
            Budget →
          </button>
        )}
      </div>
    </div>
  );
});

export default WelcomeBanner;
