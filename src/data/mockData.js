/* ============================================================
   src/data/mockData.js – Static Mock Data
   Expanded dataset for a richer dashboard experience.
   ============================================================ */

/* ── Transaction Categories ── */
export const CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Utilities",
  "Salary",
  "Freelance",
  "Investment",
  "Rent",
  "Travel",
  "Education",
];

/* ── Category icons ── */
export const CATEGORY_ICONS = {
  "Food & Dining":  "🍽️",
  "Transport":      "🚗",
  "Shopping":       "🛍️",
  "Entertainment":  "🎬",
  "Healthcare":     "🏥",
  "Utilities":      "⚡",
  "Salary":         "💼",
  "Freelance":      "💻",
  "Investment":     "📈",
  "Rent":           "🏠",
  "Travel":         "✈️",
  "Education":      "📚",
};

/* ── Color map for each category ── */
export const CATEGORY_COLORS = {
  "Food & Dining":  "#4ade80",
  "Transport":      "#facc15",
  "Shopping":       "#60a5fa",
  "Entertainment":  "#f472b6",
  "Healthcare":     "#34d399",
  "Utilities":      "#06b6d4",
  "Salary":         "#22d3ee",
  "Freelance":      "#fb923c",
  "Investment":     "#e2e8f0",
  "Rent":           "#f87171",
  "Travel":         "#fbbf24",
  "Education":      "#0ea5e9",
};

/* ── Initial Transactions Dataset (60 records, 6 months) ── */
export const INITIAL_TRANSACTIONS = [
  // January
  { id: 1,  date: "2024-01-03", description: "Monthly Salary",        category: "Salary",         amount: 85000, type: "income"  },
  { id: 2,  date: "2024-01-05", description: "Grocery Store",          category: "Food & Dining",  amount: 3200,  type: "expense" },
  { id: 3,  date: "2024-01-07", description: "Metro Card Recharge",    category: "Transport",      amount: 500,   type: "expense" },
  { id: 4,  date: "2024-01-10", description: "Netflix Subscription",   category: "Entertainment",  amount: 649,   type: "expense" },
  { id: 5,  date: "2024-01-12", description: "House Rent",             category: "Rent",           amount: 22000, type: "expense" },
  { id: 6,  date: "2024-01-14", description: "Freelance Project",      category: "Freelance",      amount: 15000, type: "income"  },
  { id: 7,  date: "2024-01-18", description: "Electricity Bill",       category: "Utilities",      amount: 1800,  type: "expense" },
  { id: 8,  date: "2024-01-20", description: "Restaurant Dinner",      category: "Food & Dining",  amount: 1450,  type: "expense" },
  { id: 9,  date: "2024-01-25", description: "Mutual Fund SIP",        category: "Investment",     amount: 5000,  type: "expense" },
  { id: 10, date: "2024-01-28", description: "Amazon Shopping",        category: "Shopping",       amount: 2300,  type: "expense" },

  // February
  { id: 11, date: "2024-02-01", description: "Monthly Salary",         category: "Salary",         amount: 85000, type: "income"  },
  { id: 12, date: "2024-02-03", description: "Swiggy Orders",          category: "Food & Dining",  amount: 1800,  type: "expense" },
  { id: 13, date: "2024-02-05", description: "Uber Rides",             category: "Transport",      amount: 1200,  type: "expense" },
  { id: 14, date: "2024-02-08", description: "Doctor Visit",           category: "Healthcare",     amount: 800,   type: "expense" },
  { id: 15, date: "2024-02-10", description: "House Rent",             category: "Rent",           amount: 22000, type: "expense" },
  { id: 16, date: "2024-02-14", description: "Valentine's Dinner",     category: "Food & Dining",  amount: 3500,  type: "expense" },
  { id: 17, date: "2024-02-18", description: "Online Course",          category: "Education",      amount: 2999,  type: "expense" },
  { id: 18, date: "2024-02-20", description: "Freelance Design Work",  category: "Freelance",      amount: 12000, type: "income"  },
  { id: 19, date: "2024-02-22", description: "Internet Bill",          category: "Utilities",      amount: 999,   type: "expense" },
  { id: 20, date: "2024-02-26", description: "Clothing Purchase",      category: "Shopping",       amount: 4200,  type: "expense" },

  // March
  { id: 21, date: "2024-03-01", description: "Monthly Salary",         category: "Salary",         amount: 85000, type: "income"  },
  { id: 22, date: "2024-03-04", description: "Zomato Orders",          category: "Food & Dining",  amount: 2100,  type: "expense" },
  { id: 23, date: "2024-03-06", description: "Petrol Refill",          category: "Transport",      amount: 2800,  type: "expense" },
  { id: 24, date: "2024-03-10", description: "House Rent",             category: "Rent",           amount: 22000, type: "expense" },
  { id: 25, date: "2024-03-12", description: "Movie Tickets",          category: "Entertainment",  amount: 900,   type: "expense" },
  { id: 26, date: "2024-03-15", description: "Dividend Income",        category: "Investment",     amount: 3500,  type: "income"  },
  { id: 27, date: "2024-03-18", description: "Water & Gas Bill",       category: "Utilities",      amount: 650,   type: "expense" },
  { id: 28, date: "2024-03-20", description: "Pharmacy",               category: "Healthcare",     amount: 450,   type: "expense" },
  { id: 29, date: "2024-03-24", description: "Weekend Trip Goa",       category: "Travel",         amount: 12000, type: "expense" },
  { id: 30, date: "2024-03-28", description: "Electronics Purchase",   category: "Shopping",       amount: 8500,  type: "expense" },

  // April
  { id: 31, date: "2024-04-01", description: "Monthly Salary",         category: "Salary",         amount: 92000, type: "income"  },
  { id: 32, date: "2024-04-03", description: "Restaurant Lunch",       category: "Food & Dining",  amount: 950,   type: "expense" },
  { id: 33, date: "2024-04-05", description: "Ola Rides",              category: "Transport",      amount: 780,   type: "expense" },
  { id: 34, date: "2024-04-08", description: "House Rent",             category: "Rent",           amount: 22000, type: "expense" },
  { id: 35, date: "2024-04-10", description: "Spotify Premium",        category: "Entertainment",  amount: 119,   type: "expense" },
  { id: 36, date: "2024-04-12", description: "Freelance Content",      category: "Freelance",      amount: 8000,  type: "income"  },
  { id: 37, date: "2024-04-15", description: "Electricity Bill",       category: "Utilities",      amount: 2100,  type: "expense" },
  { id: 38, date: "2024-04-18", description: "Eye Checkup",            category: "Healthcare",     amount: 600,   type: "expense" },
  { id: 39, date: "2024-04-22", description: "Stock Market SIP",       category: "Investment",     amount: 5000,  type: "expense" },
  { id: 40, date: "2024-04-28", description: "Book Shopping",          category: "Shopping",       amount: 1200,  type: "expense" },

  // May
  { id: 41, date: "2024-05-01", description: "Monthly Salary",         category: "Salary",         amount: 92000, type: "income"  },
  { id: 42, date: "2024-05-03", description: "Bakery & Cafe",          category: "Food & Dining",  amount: 1600,  type: "expense" },
  { id: 43, date: "2024-05-07", description: "Train Ticket",           category: "Transport",      amount: 1800,  type: "expense" },
  { id: 44, date: "2024-05-10", description: "House Rent",             category: "Rent",           amount: 22000, type: "expense" },
  { id: 45, date: "2024-05-14", description: "Concert Tickets",        category: "Entertainment",  amount: 3500,  type: "expense" },
  { id: 46, date: "2024-05-18", description: "Freelance App Dev",      category: "Freelance",      amount: 20000, type: "income"  },
  { id: 47, date: "2024-05-20", description: "Internet + Mobile Bill", category: "Utilities",      amount: 1499,  type: "expense" },
  { id: 48, date: "2024-05-23", description: "Gym Membership",         category: "Healthcare",     amount: 2500,  type: "expense" },
  { id: 49, date: "2024-05-26", description: "Summer Travel Kerala",   category: "Travel",         amount: 18000, type: "expense" },
  { id: 50, date: "2024-05-30", description: "Fashion Shopping",       category: "Shopping",       amount: 5600,  type: "expense" },

  // June
  { id: 51, date: "2024-06-01", description: "Monthly Salary",         category: "Salary",         amount: 92000, type: "income"  },
  { id: 52, date: "2024-06-04", description: "Food Delivery Apps",     category: "Food & Dining",  amount: 2800,  type: "expense" },
  { id: 53, date: "2024-06-06", description: "Auto Rickshaw",          category: "Transport",      amount: 650,   type: "expense" },
  { id: 54, date: "2024-06-10", description: "House Rent",             category: "Rent",           amount: 22000, type: "expense" },
  { id: 55, date: "2024-06-12", description: "Amazon Prime",           category: "Entertainment",  amount: 1499,  type: "expense" },
  { id: 56, date: "2024-06-15", description: "Freelance Branding",     category: "Freelance",      amount: 18000, type: "income"  },
  { id: 57, date: "2024-06-18", description: "Phone Bill",             category: "Utilities",      amount: 799,   type: "expense" },
  { id: 58, date: "2024-06-22", description: "Dental Checkup",         category: "Healthcare",     amount: 1200,  type: "expense" },
  { id: 59, date: "2024-06-25", description: "Mutual Fund SIP",        category: "Investment",     amount: 5000,  type: "expense" },
  { id: 60, date: "2024-06-28", description: "Udemy Courses",          category: "Education",      amount: 1499,  type: "expense" },
];

/* ── Monthly Balance Trend Data (for line/area chart) ── */
export const MONTHLY_TREND = [
  { month: "Jan", income: 100000, expenses: 36899, balance: 63101 },
  { month: "Feb", income: 97000,  expenses: 35298, balance: 61702 },
  { month: "Mar", income: 88500,  expenses: 47300, balance: 41200 },
  { month: "Apr", income: 100000, expenses: 31749, balance: 68251 },
  { month: "May", income: 112000, expenses: 54999, balance: 57001 },
  { month: "Jun", income: 110000, expenses: 34447, balance: 75553 },
];

/* ── Role Definitions ── */
export const ROLES = {
  ADMIN:  "admin",   // Can add / edit / delete transactions, set budgets
  VIEWER: "viewer",  // Read-only view
};

/* ── Financial health score thresholds ── */
export const HEALTH_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD:      60,
  FAIR:      40,
};
