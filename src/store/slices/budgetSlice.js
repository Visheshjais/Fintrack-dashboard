/* ============================================================
   src/store/slices/budgetSlice.js
   Redux slice for budget management.
   Users (Admin) can set monthly spending limits per category.
   ============================================================ */
import { createSlice } from "@reduxjs/toolkit";


/* ── Default budgets (sensible starting values) ── */
const DEFAULT_BUDGETS = {
  "Food & Dining":  8000,
  "Transport":      3000,
  "Shopping":       5000,
  "Entertainment":  2000,
  "Healthcare":     3000,
  "Utilities":      3000,
  "Rent":           25000,
  "Travel":         10000,
  "Education":      5000,
  "Investment":     10000,
  "Freelance":      0,   // income, no budget
  "Salary":         0,   // income, no budget
};

/* ── Load from localStorage or use defaults ── */
function loadBudgets() {
  try {
    const stored = localStorage.getItem("fintrack_budgets");
    return stored ? JSON.parse(stored) : DEFAULT_BUDGETS;
  } catch {
    return DEFAULT_BUDGETS;
  }
}

function saveBudgets(budgets) {
  localStorage.setItem("fintrack_budgets", JSON.stringify(budgets));
}

const budgetSlice = createSlice({
  name: "budget",
  initialState: {
    limits: loadBudgets(),   // { [category]: amount }
  },
  reducers: {
    /* Set/update budget for a single category */
    setBudget: (state, action) => {
      const { category, amount } = action.payload;
      state.limits[category] = Number(amount);
      saveBudgets(state.limits);
    },

    /* Reset all budgets to defaults */
    resetBudgets: (state) => {
      state.limits = DEFAULT_BUDGETS;
      saveBudgets(state.limits);
    },
  },
});

export const { setBudget, resetBudgets } = budgetSlice.actions;

/* ── Selectors ── */
export const selectBudgetLimits   = (state) => state.budget.limits;
export const selectBudgetForCat   = (cat) => (state) => state.budget.limits[cat] || 0;

export default budgetSlice.reducer;
