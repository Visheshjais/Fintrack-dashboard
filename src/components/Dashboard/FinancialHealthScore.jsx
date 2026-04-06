/* ============================================================
   src/components/Dashboard/FinancialHealthScore.jsx
   Circular gauge showing a 0-100 financial health score.
   Computed from savings rate, budget adherence, diversity.
   ============================================================ */
import React from "react";
import { useSelector } from "react-redux";
import { selectTransactions } from "../../store/slices/transactionsSlice";
import { selectBudgetLimits } from "../../store/slices/budgetSlice";
import { computeHealthScore } from "../../utils/helpers";
import "../../styles/Dashboard.css";

/* Circumference of the SVG circle (r=40) */
const RADIUS = 40;
const CIRC   = 2 * Math.PI * RADIUS;  // ~251.3

/* Color stops based on score */
function scoreColor(score) {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#0d9488";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

/* Label text based on score */
function scoreLabel(score) {
  if (score >= 80) return { text: "Excellent", color: "#22c55e" };
  if (score >= 60) return { text: "Good",      color: "#0d9488" };
  if (score >= 40) return { text: "Fair",       color: "#f59e0b" };
  return { text: "Needs Work",  color: "#ef4444" };
}

function FinancialHealthScore() {
  const transactions = useSelector(selectTransactions);
  const budgetLimits = useSelector(selectBudgetLimits);
  const score        = computeHealthScore(transactions, budgetLimits);
  const color        = scoreColor(score);
  const label        = scoreLabel(score);

  /* Stroke offset: 0 = full circle, CIRC = empty */
  const offset = CIRC - (score / 100) * CIRC;

  /* Scoring breakdown facts */
  const facts = [
    { icon: "◆", text: "Savings rate contributes up to 40 pts" },
    { icon: "◇", text: "Budget adherence contributes up to 30 pts" },
    { icon: "◈", text: "Category diversity contributes up to 15 pts" },
    { icon: "◉", text: "Income sources contribute up to 15 pts" },
  ];

  return (
    <div className="health-score-card">
      {/* Circular gauge */}
      <div className="health-score-ring">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Rotate so the arc begins at the top (12 o'clock) */}
          <g transform="rotate(-90 50 50)">
            {/* Background ring */}
            <circle
              className="health-score-ring-bg"
              cx="50" cy="50" r={RADIUS}
            />
            {/* Score fill ring */}
            <circle
              className="health-score-ring-fill"
              cx="50" cy="50" r={RADIUS}
              stroke={color}
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease" }}
            />
          </g>
        </svg>

        {/* Center text */}
        <div className="health-score-num">
          <span className="health-score-big" style={{ color }}>{score}</span>
          <span className="health-score-label">/100</span>
        </div>
      </div>

      {/* Text section */}
      <div className="health-facts">
        <div className="health-facts-title">
          Financial Health:{" "}
          <span style={{ color: label.color }}>{label.text}</span>
        </div>
        <div className="health-facts-list">
          {facts.map((f, i) => (
            <div key={i} className="health-fact-row">
              <span style={{ color, fontSize: "0.7rem" }}>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FinancialHealthScore;
