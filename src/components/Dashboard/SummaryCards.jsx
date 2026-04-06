/* ============================================================
   src/components/Dashboard/SummaryCards.jsx
   Four KPI cards with animated counters and trend indicators.
   Reads from Redux store.
   ============================================================ */
import React from "react";
import { useSelector } from "react-redux";
import { selectTransactions } from "../../store/slices/transactionsSlice";
import { computeSummary } from "../../utils/helpers";
import AnimatedCounter from "../Common/AnimatedCounter";
import "../../styles/Dashboard.css";

/* Rupee formatter for AnimatedCounter */
function rupeeFmt(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function SummaryCards() {
  const transactions = useSelector(selectTransactions);
  const { totalIncome, totalExpenses, balance, savingsRate } =
    computeSummary(transactions);

  const incomeCount  = transactions.filter((t) => t.type === "income").length;
  const expenseCount = transactions.filter((t) => t.type === "expense").length;

  /* Card configurations */
  const cards = [
    {
      key:        "balance",
      icon:       "⬡",
      iconClass:  "blue",
      label:      "Net Balance",
      value:      balance,
      valueClass: balance >= 0 ? "positive" : "negative",
      trend:      balance >= 0 ? "up" : "down",
      trendLabel: balance >= 0 ? "Surplus" : "Deficit",
      sub:        `${savingsRate.toFixed(1)}% savings rate`,
      className:  "balance",
    },
    {
      key:        "income",
      icon:       "▲",
      iconClass:  "green",
      label:      "Total Income",
      value:      totalIncome,
      valueClass: "positive",
      trend:      "up",
      trendLabel: `${incomeCount} txns`,
      sub:        `${incomeCount} income transactions`,
      className:  "income",
    },
    {
      key:        "expense",
      icon:       "▼",
      iconClass:  "red",
      label:      "Total Expenses",
      value:      totalExpenses,
      valueClass: "negative",
      trend:      "down",
      trendLabel: `${expenseCount} txns`,
      sub:        `${expenseCount} expense transactions`,
      className:  "expense",
    },
    {
      key:        "savings",
      icon:       "◐",
      iconClass:  "yellow",
      label:      "Savings Rate",
      value:      null, // rendered differently
      savingsRate,
      valueClass: savingsRate >= 20 ? "positive" : savingsRate >= 10 ? "neutral" : "negative",
      trend:      savingsRate >= 20 ? "up" : savingsRate >= 10 ? "flat" : "down",
      trendLabel: savingsRate >= 20 ? "Great" : savingsRate >= 10 ? "Fair" : "Low",
      sub:        savingsRate >= 20 ? "Excellent savings!" : savingsRate >= 10 ? "Aim for 20%+" : "Review expenses",
      className:  "savings",
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div key={card.key} className={`summary-card ${card.className}`}>
          {/* Top row: icon + trend */}
          <div className="card-top">
            <div className={`card-icon-wrap ${card.iconClass}`}>
              {card.icon}
            </div>
            <div className={`card-trend ${card.trend}`}>
              {card.trendLabel}
            </div>
          </div>

          {/* Label */}
          <div className="card-label">{card.label}</div>

          {/* Main animated value */}
          <div className={`card-value mono ${card.valueClass}`}>
            {card.key === "savings" ? (
              /* Savings rate shown as percentage */
              <>
                <AnimatedCounter
                  value={Math.abs(card.savingsRate)}
                  duration={1000}
                  formatter={(n) => `${n.toFixed(1)}%`}
                />
              </>
            ) : (
              /* Currency values */
              <>
                {card.key === "balance" && balance < 0 && "-"}
                <AnimatedCounter
                  value={Math.abs(card.value)}
                  duration={900}
                  formatter={rupeeFmt}
                />
              </>
            )}
          </div>

          {/* Sub text */}
          <div className="card-sub">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
