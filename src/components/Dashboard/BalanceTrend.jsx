/* ============================================================
   src/components/Dashboard/BalanceTrend.jsx
   Composed area+line chart showing income/expense/balance.
   Builds data dynamically from Redux transactions.
   ============================================================ */
import React, { useState } from "react";
import {
  ResponsiveContainer, ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { useSelector } from "react-redux";
import { selectTransactions } from "../../store/slices/transactionsSlice";
import { buildMonthlyTrend, formatCurrency } from "../../utils/helpers";
import "../../styles/Dashboard.css";

/* Chart view modes */
const VIEWS = [
  { key: "all",      label: "All"      },
  { key: "income",   label: "Income"   },
  { key: "expenses", label: "Expenses" },
];

/* Custom tooltip */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border-light)",
      borderRadius: "10px", padding: "12px 16px", boxShadow: "var(--shadow-card)",
      minWidth: "190px",
    }}>
      <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)", marginBottom: "8px" }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{
          display: "flex", justifyContent: "space-between",
          gap: "16px", fontSize: "0.8rem", marginBottom: "4px",
        }}>
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function BalanceTrend() {
  const transactions = useSelector(selectTransactions);
  const trendData    = buildMonthlyTrend(transactions);
  const [view, setView] = useState("all");

  if (trendData.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Balance Trend</div>
            <div className="chart-subtitle">Monthly overview</div>
          </div>
        </div>
        <div className="empty-state">
          <span className="empty-icon">📈</span>
          <p>No data yet. Add transactions to see trends.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      {/* Header */}
      <div className="chart-card-header">
        <div>
          <div className="chart-title">Balance Trend</div>
          <div className="chart-subtitle">Monthly income vs expenses</div>
        </div>

        {/* View mode tabs */}
        <div style={{ display: "flex", gap: "4px" }}>
          {VIEWS.map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              style={{
                padding:      "4px 12px",
                borderRadius: "var(--radius-full)",
                border:       "1px solid var(--border)",
                background:   view === v.key ? "var(--accent-blue)" : "transparent",
                color:        view === v.key ? "#fff" : "var(--text-muted)",
                fontSize:     "0.72rem",
                fontWeight:   600,
                cursor:       "pointer",
                transition:   "all var(--transition-fast)",
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={265}>
        <ComposedChart data={trendData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#22c55e" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#ef4444" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={false} tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Income area */}
          {(view === "all" || view === "income") && (
            <Area
              type="monotone" dataKey="income" name="Income"
              stroke="#22c55e" strokeWidth={2} fill="url(#incomeGrad)"
              dot={{ fill: "#22c55e", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
            />
          )}

          {/* Expense area */}
          {(view === "all" || view === "expenses") && (
            <Area
              type="monotone" dataKey="expenses" name="Expenses"
              stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)"
              dot={{ fill: "#ef4444", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
            />
          )}

          {/* Balance line */}
          {view === "all" && (
            <Line
              type="monotone" dataKey="balance" name="Balance"
              stroke="#0d9488" strokeWidth={2.5} strokeDasharray="6 3"
              dot={{ fill: "#0d9488", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="chart-legend" style={{ marginTop: "var(--space-sm)", paddingTop: "var(--space-sm)", borderTop: "1px solid var(--border)" }}>
        <div className="legend-item"><div className="legend-dot" style={{ background: "#22c55e" }} />Income</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: "#ef4444" }} />Expenses</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: "#0d9488" }} />Balance</div>
      </div>
    </div>
  );
}

export default BalanceTrend;
