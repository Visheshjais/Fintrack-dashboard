/* ============================================================
   src/components/Insights/InsightsSection.jsx
   Insights page: top category, monthly comparison, savings
   rate, quick observations, category bar chart.
   All data from Redux.
   ============================================================ */
import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis,
} from "recharts";
import { useSelector } from "react-redux";
import { selectTransactions } from "../../store/slices/transactionsSlice";
import {
  getTopCategory, getMonthlyComparison, getSpendingByCategory,
  computeSummary, formatCurrency, monthLabel,
} from "../../utils/helpers";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../../data/mockData";
import "../../styles/Insights.css";

/* Bar chart tooltip */
function BarTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "10px 14px", fontSize: "0.82rem", boxShadow: "var(--shadow-card)" }}>
      <strong style={{ color: "var(--text-primary)" }}>{label}</strong><br />
      <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-green)" }}>
        {formatCurrency(payload[0].value)}
      </span>
    </div>
  );
}

function InsightsSection() {
  const transactions = useSelector(selectTransactions);

  const topCategory  = getTopCategory(transactions);
  const comparison   = getMonthlyComparison(transactions);
  const byCategory   = getSpendingByCategory(transactions);
  const { totalIncome, totalExpenses, balance, savingsRate } = computeSummary(transactions);

  const grandTotal = byCategory.reduce((s, c) => s + c.value, 0);

  /* Build radar chart data (top 6 expense categories, normalized) */
  const radarData = byCategory.slice(0, 6).map((c) => ({
    category: c.name.split(" ")[0],  // short name
    amount:   c.value,
    max:      grandTotal > 0 ? Math.round((c.value / grandTotal) * 100) : 0,
  }));

  /* Quick observation messages */
  const observations = [
    topCategory && {
      icon: "⚠",
      color: "var(--accent-yellow)",
      text: `${topCategory.name} is your biggest expense at ${formatCurrency(topCategory.value)}.`,
    },
    comparison && comparison.change < 0 && {
      icon: "✓",
      color: "var(--accent-green)",
      text: `Great job! Spending reduced by ${formatCurrency(Math.abs(comparison.change))} vs last month.`,
    },
    comparison && comparison.change > 0 && {
      icon: "◉",
      color: "var(--accent-red)",
      text: `Spending raised by ${formatCurrency(comparison.change)} compared to last month.`,
    },
    {
      icon: "◆",
      color: "var(--accent-primary-2)",
      text: `${transactions.filter(t => t.type === "income").length} income & ${transactions.filter(t => t.type === "expense").length} expense entries tracked.`,
    },
    savingsRate > 0 && {
      icon: "⬡",
      color: "var(--accent-purple)",
      text: `Saving ${savingsRate.toFixed(1)}% of income. ${savingsRate >= 20 ? "Excellent! Keep it up." : "Target: 20%+."}`,
    },
    byCategory.length > 0 && {
      icon: "◈",
      color: "var(--accent-orange)",
      text: `Spending across ${byCategory.length} categories. Diversity helps budget balance.`,
    },
  ].filter(Boolean);

  return (
    <div className="insights-grid">

      {/* ── Card 1: Top Spending Category ── */}
      <div className="insight-card">
        <div className="insight-card-header">
          <div className="insight-icon orange">🔥</div>
          <div className="insight-meta">
            <div className="insight-title">Top Spending Category</div>
            <div className="insight-subtitle">Where most money goes</div>
          </div>
        </div>

        {topCategory ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "var(--space-sm)" }}>
              <span style={{ fontSize: "1.6rem" }}>{CATEGORY_ICONS[topCategory.name] || "•"}</span>
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: CATEGORY_COLORS[topCategory.name] || "var(--text-primary)" }}>
                  {topCategory.name}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {formatCurrency(topCategory.value)}
                </div>
              </div>
            </div>

            <div className="insight-desc">
              Accounts for{" "}
              <strong style={{ color: "var(--accent-yellow)" }}>
                {grandTotal > 0 ? ((topCategory.value / grandTotal) * 100).toFixed(1) : 0}%
              </strong>{" "}
              of total expenses.
            </div>

            <div className="top-category-bar" style={{ marginTop: "var(--space-md)" }}>
              <div className="bar-label">
                <span>Expense share</span>
                <span>{grandTotal > 0 ? ((topCategory.value / grandTotal) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width:      `${grandTotal > 0 ? (topCategory.value / grandTotal) * 100 : 0}%`,
                    background: CATEGORY_COLORS[topCategory.name] || "var(--accent-green)",
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="insight-desc text-muted">No expense data available yet.</div>
        )}
      </div>

      {/* ── Card 2: Monthly Comparison ── */}
      <div className="insight-card">
        <div className="insight-card-header">
          <div className="insight-icon blue">📅</div>
          <div className="insight-meta">
            <div className="insight-title">Monthly Comparison</div>
            <div className="insight-subtitle">Spending vs last month</div>
          </div>
        </div>

        {comparison ? (
          <>
            <div className="comparison-row">
              <div className="month-block">
                <div className="month-name">{monthLabel(comparison.prevMonth)}</div>
                <div className="month-amount">{formatCurrency(comparison.prevTotal)}</div>
              </div>
              <div className="vs-divider">vs</div>
              <div className="month-block">
                <div className="month-name">{monthLabel(comparison.currMonth)}</div>
                <div className="month-amount">{formatCurrency(comparison.currTotal)}</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--space-md)" }}>
              <div className={`change-pill ${comparison.change > 0 ? "up" : "down"}`}>
                {comparison.change > 0 ? "▲" : "▼"}{" "}
                {Math.abs(comparison.changePercent)}%{" "}
                {comparison.change > 0 ? "increase" : "decrease"}
              </div>
            </div>

            <div className="insight-desc" style={{ marginTop: "var(--space-md)", textAlign: "center" }}>
              {comparison.change > 0
                ? `Spent ${formatCurrency(Math.abs(comparison.change))} more this month.`
                : `Saved ${formatCurrency(Math.abs(comparison.change))} more this month! 🎉`}
            </div>
          </>
        ) : (
          <div className="insight-desc text-muted">Need at least 2 months of data to compare.</div>
        )}
      </div>

      {/* ── Card 3: Savings Rate ── */}
      <div className="insight-card">
        <div className="insight-card-header">
          <div className="insight-icon green">💰</div>
          <div className="insight-meta">
            <div className="insight-title">Savings Rate</div>
            <div className="insight-subtitle">Net balance ÷ total income</div>
          </div>
        </div>

        <div className="savings-rate-display">
          <span className="savings-big">{savingsRate.toFixed(1)}</span>
          <span className="savings-unit">%</span>
        </div>

        <div className="savings-bar">
          <div
            className="savings-fill"
            style={{
              width: `${Math.min(100, Math.max(0, savingsRate))}%`,
              background: savingsRate >= 20
                ? "linear-gradient(90deg, var(--accent-green), #16a34a)"
                : savingsRate >= 10
                ? "linear-gradient(90deg, var(--accent-yellow), #b45309)"
                : "linear-gradient(90deg, var(--accent-red), #b91c1c)",
            }}
          />
        </div>

        <div className="insight-desc">
          {savingsRate >= 20 && "🟢 Excellent! You're saving more than 20% of income."}
          {savingsRate >= 10 && savingsRate < 20 && "🟡 Good. Aim for 20%+ for financial security."}
          {savingsRate > 0 && savingsRate < 10 && "🔴 Low savings rate. Review top expense categories."}
          {savingsRate <= 0 && "⚠️ Expenses exceed income. Immediate review recommended."}
        </div>

        {/* Quick stats */}
        <div style={{ display: "flex", gap: "var(--space-lg)", marginTop: "var(--space-md)", flexWrap: "wrap" }}>
          {[
            { label: "Income",   val: formatCurrency(totalIncome),   color: "var(--accent-green)" },
            { label: "Expenses", val: formatCurrency(totalExpenses), color: "var(--accent-red)"   },
            { label: "Saved",    val: formatCurrency(balance),       color: balance >= 0 ? "var(--accent-green)" : "var(--accent-red)" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-mono)", color: s.color, fontSize: "0.88rem", fontWeight: 700 }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Card 4: Quick Observations ── */}
      <div className="insight-card">
        <div className="insight-card-header">
          <div className="insight-icon purple">◉</div>
          <div className="insight-meta">
            <div className="insight-title">Quick Observations</div>
            <div className="insight-subtitle">Smart notes on your data</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "var(--space-sm)" }}>
          {observations.map((obs, idx) => (
            <div key={idx} className="observation-card">
              <span style={{ color: obs.color, fontSize: "1rem", flexShrink: 0 }}>{obs.icon}</span>
              <span>{obs.text}</span>
            </div>
          ))}
          {observations.length === 0 && (
            <div className="insight-desc text-muted">Add transactions to see observations.</div>
          )}
        </div>
      </div>

      {/* ── Card 5 (wide): Category Chart + Ranked List ── */}
      <div className="insight-card wide">
        <div className="insight-card-header">
          <div className="insight-icon orange">◑</div>
          <div className="insight-meta">
            <div className="insight-title">Spending by Category</div>
            <div className="insight-subtitle">Full expense breakdown</div>
          </div>
        </div>

        {byCategory.length === 0 ? (
          <div className="empty-state"><span className="empty-icon">📭</span><p>No expense data yet.</p></div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)", alignItems: "start" }}>
            {/* Horizontal bar chart */}
            <ResponsiveContainer width="100%" height={Math.max(260, byCategory.length * 36)}>
              <BarChart data={byCategory} layout="vertical" margin={{ top: 0, right: 20, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<BarTip />} />
                <Bar dataKey="value" radius={[0, 5, 5, 0]} maxBarSize={22}>
                  {byCategory.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#0d9488"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Ranked list */}
            <div className="category-list">
              {byCategory.map((entry, idx) => {
                const pct   = grandTotal > 0 ? ((entry.value / grandTotal) * 100).toFixed(1) : 0;
                const color = CATEGORY_COLORS[entry.name] || "#0d9488";
                return (
                  <div key={entry.name} className="category-row">
                    <span className="category-rank">#{idx + 1}</span>
                    <div className="category-color-bar" style={{ background: color }} />
                    <div className="category-info">
                      <div className="category-name">
                        {CATEGORY_ICONS[entry.name]} {entry.name}
                      </div>
                      <div className="category-pct">{pct}% of expenses</div>
                    </div>
                    <div className="category-amount">{formatCurrency(entry.value)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Card 6 (wide): Radar Chart ── */}
      {radarData.length >= 3 && (
        <div className="insight-card wide">
          <div className="insight-card-header">
            <div className="insight-icon purple">◎</div>
            <div className="insight-meta">
              <div className="insight-title">Spending Radar</div>
              <div className="insight-subtitle">Top category share distribution</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              />
              <Radar
                name="Share %"
                dataKey="max"
                stroke="var(--accent-primary)"
                fill="var(--accent-primary)"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default InsightsSection;
