/* ============================================================
   src/components/Budget/BudgetTracker.jsx
   Per-category budget limits with visual progress bars.
   Admins can edit budgets; viewers see read-only.
   Dispatches to budgetSlice and shows toast on save.
   ============================================================ */
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTransactions } from "../../store/slices/transactionsSlice";
import { selectBudgetLimits, selectBudgetForCat, setBudget, resetBudgets } from "../../store/slices/budgetSlice";
import { selectIsAdmin, addToast } from "../../store/slices/uiSlice";
import { getSpendingByCategory, formatCurrency, clamp } from "../../utils/helpers";
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from "../../data/mockData";
import "../../styles/Budget.css";

/* Colors for over/near/ok budget status */
function barColor(pct) {
  if (pct >= 100) return "linear-gradient(90deg, #ef4444, #b91c1c)";
  if (pct >= 80)  return "linear-gradient(90deg, #f59e0b, #b45309)";
  return "linear-gradient(90deg, #22c55e, #15803d)";
}

/* Single budget card */
function BudgetCard({ category, spent, isAdmin }) {
  const dispatch = useDispatch();
  const limit    = useSelector(selectBudgetForCat(category));
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const hasLimit  = limit > 0;
  const pct       = hasLimit ? clamp((spent / limit) * 100, 0, 150) : 0;
  const isOver    = hasLimit && spent > limit;
  const isNear    = hasLimit && pct >= 80 && pct < 100;
  const remaining = hasLimit ? limit - spent : null;
  const color     = CATEGORY_COLORS[category] || "#0d9488";
  const icon      = CATEGORY_ICONS[category]  || "•";

  function startEdit() {
    setInputVal(limit > 0 ? String(limit) : "");
    setEditing(true);
  }

  function saveEdit() {
    const val = Number(inputVal);
    if (!isNaN(val) && val >= 0) {
      dispatch(setBudget({ category, amount: val }));
      dispatch(addToast({ type: "success", message: `Budget set: ${category} → ${formatCurrency(val)}` }));
    }
    setEditing(false);
  }

  function cancelEdit() { setEditing(false); }

  return (
    <div className={`budget-category-card ${isOver ? "over-budget" : ""} ${!hasLimit ? "no-budget" : ""}`}>
      {/* Header */}
      <div className="budget-cat-header">
        <div className="budget-cat-left">
          <div className="budget-cat-icon" style={{ background: `${color}20` }}>
            {icon}
          </div>
          <div>
            <div className="budget-cat-name">{category}</div>
            <div className="budget-cat-type">{hasLimit ? "Monthly budget set" : "No budget set"}</div>
          </div>
        </div>

        {/* Status badge */}
        {hasLimit && (
          isOver
            ? <span className="budget-over-badge">Over Budget!</span>
            : isNear
            ? <span className="budget-over-badge" style={{ background: "rgba(245,158,11,0.12)", color: "var(--accent-yellow)", borderColor: "rgba(245,158,11,0.2)" }}>Near Limit</span>
            : <span className="budget-ok-badge">On Track ✓</span>
        )}
      </div>

      {/* Spent vs limit */}
      <div className="budget-amounts">
        <span
          className="budget-spent mono"
          style={{ color: isOver ? "var(--accent-red)" : isNear ? "var(--accent-yellow)" : "var(--text-primary)" }}
        >
          {formatCurrency(spent)}
        </span>
        <span className="budget-limit">
          {hasLimit ? <>of <span>{formatCurrency(limit)}</span></> : "No limit set"}
        </span>
      </div>

      {/* Progress bar */}
      {hasLimit && (
        <>
          <div className="budget-bar-track">
            <div
              className="budget-bar-fill"
              style={{
                width:      `${Math.min(100, pct)}%`,
                background: barColor(pct),
              }}
            />
          </div>

          <div className="budget-bar-info">
            <span>{pct.toFixed(1)}% used</span>
            <span style={{ color: isOver ? "var(--accent-red)" : "var(--text-muted)" }}>
              {isOver
                ? `${formatCurrency(spent - limit)} over`
                : `${formatCurrency(remaining)} left`}
            </span>
          </div>
        </>
      )}

      {/* Admin edit row */}
      {isAdmin && (
        <div className="budget-edit-row">
          {editing ? (
            <>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>₹</span>
              <input
                className="budget-edit-input"
                type="number"
                min="0"
                placeholder="Set limit (0 = no limit)"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                autoFocus
              />
              <button className="btn btn-primary btn-xs" onClick={saveEdit}>Save</button>
              <button className="btn btn-secondary btn-xs" onClick={cancelEdit}>✕</button>
            </>
          ) : (
            <button
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={startEdit}
            >
              {hasLimit ? "✎ Edit Budget" : "+ Set Budget"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* Main BudgetTracker component */
function BudgetTracker() {
  const dispatch     = useDispatch();
  const transactions = useSelector(selectTransactions);
  const budgetLimits = useSelector(selectBudgetLimits);
  const isAdmin      = useSelector(selectIsAdmin);

  /* Current spending per category */
  const spendMap = {};
  getSpendingByCategory(transactions).forEach(({ name, value }) => {
    spendMap[name] = value;
  });

  /* Summary stats */
  const totalBudgeted = Object.values(budgetLimits).reduce((s, v) => s + v, 0);
  const totalSpent    = Object.values(spendMap).reduce((s, v) => s + v, 0);
  const overCount     = CATEGORIES.filter((c) => {
    const l = budgetLimits[c];
    return l > 0 && (spendMap[c] || 0) > l;
  }).length;
  const onTrackCount  = CATEGORIES.filter((c) => {
    const l = budgetLimits[c];
    return l > 0 && (spendMap[c] || 0) <= l;
  }).length;

  function handleReset() {
    if (window.confirm("Reset all budgets to defaults?")) {
      dispatch(resetBudgets());
      dispatch(addToast({ type: "info", message: "All budgets reset to defaults." }));
    }
  }

  return (
    <div>
      {/* Viewer notice */}
      {!isAdmin && (
        <div className="budget-viewer-notice">
          <span>◎</span>
          <span>Switch to <strong>Admin</strong> role to set or edit budget limits.</span>
        </div>
      )}

      {/* Summary strip */}
      <div className="budget-summary-strip">
        {[
          { label: "Total Budgeted", value: formatCurrency(totalBudgeted), sub: "Monthly limit" },
          { label: "Total Spent",    value: formatCurrency(totalSpent),    sub: "This period" },
          { label: "Budget Used",    value: totalBudgeted > 0 ? `${((totalSpent/totalBudgeted)*100).toFixed(0)}%` : "—", sub: "Of total budget" },
          { label: "Over Budget",    value: overCount,                     sub: `${onTrackCount} on track` },
        ].map((s, i) => (
          <div key={i} className="budget-strip-card" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="budget-strip-label">{s.label}</div>
            <div className="budget-strip-value">{s.value}</div>
            <div className="budget-strip-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Action bar */}
      <div className="budget-page-header">
        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
          {isAdmin
            ? "Click + Set Budget on any category to define your monthly limit."
            : "Showing current spending vs budget limits."}
        </div>
        {isAdmin && (
          <button className="btn btn-secondary btn-sm" onClick={handleReset}>
            Reset All Budgets
          </button>
        )}
      </div>

      {/* Category grid */}
      <div className="budget-grid">
        {CATEGORIES.map((cat) => (
          <BudgetCard
            key={cat}
            category={cat}
            spent={spendMap[cat] || 0}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  );
}

export default BudgetTracker;
