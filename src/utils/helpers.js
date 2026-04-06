/* ============================================================
   src/utils/helpers.js – Utility / Helper Functions
   Pure functions used across the dashboard.
   ============================================================ */

/**
 * Format a number as Indian Rupee currency string.
 * e.g. 85000 → "₹85,000"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format currency compactly for small spaces.
 * e.g. 85000 → "₹85K"
 */
export function formatCurrencyCompact(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000)   return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

/**
 * Format an ISO date string to a readable format.
 * e.g. "2024-01-15" → "15 Jan 2024"
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

/**
 * Format date short (no year).
 * e.g. "2024-01-15" → "15 Jan"
 */
export function formatDateShort(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

/**
 * Get month label from ISO date key "YYYY-MM"
 * e.g. "2024-03" → "Mar 2024"
 */
export function monthLabel(key) {
  if (!key) return "—";
  const [year, month] = key.split("-");
  return new Date(year, month - 1).toLocaleDateString("en-IN", {
    month: "short", year: "numeric",
  });
}

/**
 * Compute summary totals from a list of transactions.
 * Returns { totalIncome, totalExpenses, balance, savingsRate }
 */
export function computeSummary(transactions) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance     = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

  return { totalIncome, totalExpenses, balance, savingsRate };
}

/**
 * Group expenses by category and return sorted array.
 * Returns [{ name, value }] sorted descending by value.
 */
export function getSpendingByCategory(transactions) {
  const map = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Get the highest spending category.
 * Returns { name, value } or null.
 */
export function getTopCategory(transactions) {
  const cats = getSpendingByCategory(transactions);
  return cats.length > 0 ? cats[0] : null;
}

/**
 * Compare spending between the last two months.
 * Returns comparison object or null if < 2 months.
 */
export function getMonthlyComparison(transactions) {
  const monthMap = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const key = t.date.slice(0, 7);
      monthMap[key] = (monthMap[key] || 0) + t.amount;
    });

  const sortedMonths = Object.keys(monthMap).sort();
  if (sortedMonths.length < 2) return null;

  const currKey       = sortedMonths[sortedMonths.length - 1];
  const prevKey       = sortedMonths[sortedMonths.length - 2];
  const currTotal     = monthMap[currKey];
  const prevTotal     = monthMap[prevKey];
  const change        = currTotal - prevTotal;
  const changePercent = ((change / prevTotal) * 100).toFixed(1);

  return { prevMonth: prevKey, currMonth: currKey, prevTotal, currTotal, change, changePercent };
}

/**
 * Generate monthly trend data from transactions array.
 * Returns [{ month, income, expenses, balance }]
 */
export function buildMonthlyTrend(transactions) {
  const monthMap = {};

  transactions.forEach((t) => {
    const key = t.date.slice(0, 7); // "YYYY-MM"
    if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0 };
    if (t.type === "income")  monthMap[key].income   += t.amount;
    if (t.type === "expense") monthMap[key].expenses += t.amount;
  });

  return Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, vals]) => ({
      month:    monthLabel(key),
      rawKey:   key,
      income:   vals.income,
      expenses: vals.expenses,
      balance:  vals.income - vals.expenses,
    }));
}

/**
 * Compute a financial health score (0–100) based on:
 *   • Savings rate (40 pts max)
 *   • Budget adherence (30 pts max)
 *   • Expense diversity (15 pts max)
 *   • Income consistency (15 pts max)
 */
export function computeHealthScore(transactions, budgetLimits) {
  if (transactions.length === 0) return 0;

  const { totalIncome, totalExpenses, savingsRate } = computeSummary(transactions);

  // 1. Savings score (0–40): scale savingsRate 0-30% to 0-40pts
  const savingsScore = Math.min(40, (savingsRate / 30) * 40);

  // 2. Budget adherence score (0–30): how many categories are under budget
  const byCategory = getSpendingByCategory(transactions);
  let budgetScore = 30; // start full, deduct for overages
  byCategory.forEach(({ name, value }) => {
    const limit = budgetLimits[name];
    if (limit > 0 && value > limit) {
      const overPct = (value - limit) / limit;
      budgetScore  -= Math.min(10, overPct * 10); // max 10pts per category
    }
  });
  budgetScore = Math.max(0, budgetScore);

  // 3. Expense diversity (0–15): more categories = healthier
  const numCategories = byCategory.length;
  const diversityScore = Math.min(15, numCategories * 2);

  // 4. Income consistency (0–15): multiple income sources = better
  const incomeCategories = new Set(
    transactions.filter((t) => t.type === "income").map((t) => t.category)
  ).size;
  const incomeScore = Math.min(15, incomeCategories * 5);

  const total = savingsScore + budgetScore + diversityScore + incomeScore;
  return Math.round(Math.min(100, Math.max(0, total)));
}

/**
 * Apply all filters and sorting to a transaction list.
 */
export function applyFilters(transactions, filters) {
  let result = [...transactions];

  // Text search (description + category)
  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  // Type filter
  if (filters.type && filters.type !== "all") {
    result = result.filter((t) => t.type === filters.type);
  }

  // Category filter
  if (filters.category && filters.category !== "all") {
    result = result.filter((t) => t.category === filters.category);
  }

  // Date range filter
  if (filters.dateFrom) {
    result = result.filter((t) => t.date >= filters.dateFrom);
  }
  if (filters.dateTo) {
    result = result.filter((t) => t.date <= filters.dateTo);
  }

  // Sorting
  const dir = filters.sortDir === "asc" ? 1 : -1;
  if (filters.sortBy === "date") {
    result.sort((a, b) => dir * (new Date(a.date) - new Date(b.date)));
  } else if (filters.sortBy === "amount") {
    result.sort((a, b) => dir * (a.amount - b.amount));
  } else if (filters.sortBy === "description") {
    result.sort((a, b) => dir * a.description.localeCompare(b.description));
  }

  return result;
}

/**
 * Group an array of transactions by month or category.
 */
export function groupTransactions(transactions, groupBy) {
  if (groupBy === "none") return { ungrouped: transactions };

  const groups = {};
  transactions.forEach((t) => {
    const key = groupBy === "month"
      ? monthLabel(t.date.slice(0, 7))
      : t.category;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });
  return groups;
}

/**
 * Generate a unique ID for new transactions.
 */
export function generateId(transactions) {
  if (transactions.length === 0) return 1;
  return Math.max(...transactions.map((t) => t.id)) + 1;
}

/**
 * Export transactions to a CSV file download.
 */
export function exportToCSV(transactions, filename = "transactions") {
  const headers = ["ID", "Date", "Description", "Category", "Type", "Amount (₹)"];
  const rows = transactions.map((t) => [
    t.id, t.date, `"${t.description}"`, t.category, t.type, t.amount,
  ]);
  const csv   = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob  = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url   = URL.createObjectURL(blob);
  const link  = document.createElement("a");
  link.href   = url;
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export transactions to a JSON file download.
 */
export function exportToJSON(transactions, filename = "transactions") {
  const json  = JSON.stringify(transactions, null, 2);
  const blob  = new Blob([json], { type: "application/json" });
  const url   = URL.createObjectURL(blob);
  const link  = document.createElement("a");
  link.href   = url;
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
