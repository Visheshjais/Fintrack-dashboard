/* ============================================================
   src/components/Dashboard/SpendingBreakdown.jsx
   Donut chart with interactive hover and category legend.
   ============================================================ */
import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useSelector } from "react-redux";
import { selectTransactions } from "../../store/slices/transactionsSlice";
import { getSpendingByCategory, formatCurrency } from "../../utils/helpers";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../../data/mockData";
import "../../styles/Dashboard.css";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border-light)",
      borderRadius: "8px", padding: "10px 14px", fontSize: "0.82rem",
      boxShadow: "var(--shadow-card)",
    }}>
      <strong style={{ color: "var(--text-primary)" }}>{item.name}</strong>
      <br />
      <span style={{ fontFamily: "var(--font-mono)", color: item.payload.fill }}>
        {formatCurrency(item.value)}
      </span>
    </div>
  );
}

function SpendingBreakdown() {
  const transactions = useSelector(selectTransactions);
  const data         = getSpendingByCategory(transactions);
  const [activeIdx, setActiveIdx] = useState(null);

  const totalExpenses = data.reduce((s, d) => s + d.value, 0);
  const topFive       = data.slice(0, 5);

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Spending Breakdown</div>
            <div className="chart-subtitle">By category</div>
          </div>
        </div>
        <div className="empty-state">
          <span className="empty-icon">🍩</span>
          <p>No expense data to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <div className="chart-title">Spending Breakdown</div>
          <div className="chart-subtitle">By category</div>
        </div>
      </div>

      {/* Donut chart with center label */}
      <div style={{ position: "relative" }}>
        <ResponsiveContainer width="100%" height={185}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={58} outerRadius={82}
              paddingAngle={2} dataKey="value"
              onMouseEnter={(_, idx) => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.name] || "#8892a4"}
                  opacity={activeIdx === null || activeIdx === index ? 1 : 0.4}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label showing active or total */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center", pointerEvents: "none",
        }}>
          {activeIdx !== null && data[activeIdx] ? (
            <>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                {data[activeIdx].name}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>
                {((data[activeIdx].value / totalExpenses) * 100).toFixed(0)}%
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>
                {formatCurrency(totalExpenses)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top 5 legend */}
      <div className="pie-legend">
        {topFive.map((entry, idx) => {
          const pct   = ((entry.value / totalExpenses) * 100).toFixed(1);
          const color = CATEGORY_COLORS[entry.name] || "#8892a4";
          const icon  = CATEGORY_ICONS[entry.name] || "•";
          return (
            <div
              key={entry.name}
              className="pie-legend-item"
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              style={{ cursor: "pointer", transition: "opacity 0.15s", opacity: activeIdx === null || activeIdx === idx ? 1 : 0.5 }}
            >
              <div className="pie-legend-left">
                <div className="pie-color-dot" style={{ background: color }} />
                <span style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}>
                  {icon} {entry.name}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>{pct}%</span>
              </div>
              <span className="pie-legend-value">{formatCurrency(entry.value)}</span>
            </div>
          );
        })}
        {data.length > 5 && (
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", paddingLeft: "14px", paddingTop: "4px" }}>
            +{data.length - 5} more categories
          </div>
        )}
      </div>
    </div>
  );
}

export default SpendingBreakdown;
