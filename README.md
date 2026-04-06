<div align="center">

# 💰 FinTrack
### A Professional Personal Finance Dashboard

![FinTrack](https://img.shields.io/badge/FinTrack-Finance%20Dashboard-6c63ff?style=for-the-badge&logo=money&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/Redux-Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Charts-22b5bf?style=for-the-badge&logo=chartdotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/Pure_CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![localStorage](https://img.shields.io/badge/localStorage-Persistence-orange?style=for-the-badge&logo=databricks&logoColor=white)

**Track income. Manage budgets. Visualize your finances.**

[🌐 Live Demo](#) · [🐛 Report Bug](https://github.com/Visheshjais/FinTrack/issues) · [💡 Request Feature](https://github.com/Visheshjais/FinTrack/issues)

</div>

---

## 📖 What is FinTrack?

FinTrack is a **full-featured personal finance dashboard** built entirely on the frontend with React and Redux Toolkit. It lets users track transactions, set budgets, and visualize spending patterns through interactive charts — with no backend required.

All data is persisted to **localStorage** so your transactions, budgets, role, and theme survive page refreshes. Role-based access control (RBAC) separates Admin (full CRUD) from Viewer (read-only) experiences.

---

## ✨ Features

- 📊 **Dashboard Overview** — 4 KPI cards with animated counters, balance trend chart, spending donut, and financial health score
- 💸 **Transactions** — sortable, filterable, paginated table with group-by month/category and CSV/JSON export
- 🔐 **Role-Based UI** — Admin can add, edit, delete transactions and manage budgets; Viewer is read-only
- 💡 **Insights** — top spending category, monthly comparison, savings rate, radar chart, and auto-generated smart observations
- 🎯 **Budget Tracker** — per-category monthly limits with progress bars and over-budget alerts
- 🌙 **Dark / Light Mode** — theme toggle persisted to localStorage
- 📱 **Fully Responsive** — desktop, tablet, and mobile with hamburger sidebar
- 🔔 **Toast Notifications** — Redux-driven success/info/error popups with progress bars

---

## 🗂️ Project Structure

```
src/
├── store/
│   ├── index.js                   ← Redux configureStore (4 slices)
│   └── slices/
│       ├── transactionsSlice.js   ← CRUD + localStorage sync
│       ├── filtersSlice.js        ← Search, type, category, date, sort, group
│       ├── uiSlice.js             ← Page nav, role, dark mode, toasts, sidebar
│       └── budgetSlice.js         ← Per-category monthly budget limits
│
├── components/
│   ├── Layout/                    ← Sidebar, Header
│   ├── Common/                    ← Toast, AnimatedCounter
│   ├── Dashboard/                 ← SummaryCards, BalanceTrend, SpendingBreakdown, HealthScore
│   ├── Transactions/              ← FilterBar, TransactionList, AddTransactionModal
│   ├── Insights/                  ← InsightsSection
│   └── Budget/                    ← BudgetTracker
│
├── pages/                         ← DashboardPage, TransactionsPage, InsightsPage, BudgetPage
├── data/
│   └── mockData.js                ← 60 transactions across 12 categories
├── utils/
│   └── helpers.js                 ← Format, filter, export utilities
└── styles/                        ← CSS design token system (per-feature files)
```

---

## 🚀 Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/Visheshjais/FinTrack.git
cd FinTrack
```

### 2. Install & run

```bash
npm install
npm start
```

| Service | URL |
|---------|-----|
| App | http://localhost:3000 |

### 3. Build for production

```bash
npm run build
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| State Management | Redux Toolkit + React-Redux |
| Charts | Recharts (Area, Bar, Pie, Radar) |
| Styling | Pure CSS with CSS custom properties |
| Fonts | Inter + JetBrains Mono (Google Fonts) |
| Persistence | localStorage (transactions, budgets, prefs) |

---

## 🔐 Role-Based Access Control

Switch roles from the **sidebar footer dropdown** — persisted to localStorage.

| Feature | Admin | Viewer |
|---------|-------|--------|
| View all data | ✓ | ✓ |
| Add transactions | ✓ | – |
| Edit transactions | ✓ | – |
| Delete transactions | ✓ | – |
| Set budget limits | ✓ | – |
| Reset budgets | ✓ | – |

---

## 📡 Pages & Sections

### Dashboard
| Section | Description |
|---------|-------------|
| Summary Cards | Net Balance, Income, Expenses, Savings Rate with animated counters |
| Balance Trend | Area + Line chart — monthly Income / Expenses / Balance |
| Spending Breakdown | Interactive donut chart by category |
| Financial Health Score | SVG circular gauge (0–100) based on savings, budgets, diversity |

### Transactions
| Feature | Description |
|---------|-------------|
| Filter Bar | Search, type, category, date range, group by |
| Table | Sortable by date, description, amount — 10 rows/page |
| Export | Filtered data as `.csv` or `.json` |
| CRUD | Add, Edit, Delete (Admin only) |

### Insights
| Section | Description |
|---------|-------------|
| Top Category | Highest spend with % share and progress bar |
| Monthly Comparison | Last 2 months side-by-side with change % |
| Savings Rate | Color-coded progress + advice text |
| Radar Chart | Spending distribution across top 6 categories |
| Smart Observations | 6 auto-generated notes from live data |

### Budget Tracker
| Feature | Description |
|---------|-------------|
| Per-category limits | Set monthly budget per spending category |
| Progress bars | Visual spend vs limit with over-budget alerts |
| Reset | Clear all budgets (Admin only) |

---

## 🎨 Design System

All colors, spacing, radii, shadows, and transitions are CSS custom properties in `src/styles/index.css`. Theme switching toggles `data-theme="dark"` on `<html>` — no JavaScript re-renders needed.

```css
--accent-blue:      #6366f1;
--gradient-primary: linear-gradient(135deg, #6366f1, #a855f7);
--shadow-card:      0 4px 24px rgba(0,0,0,0.5);
--transition-fast:  0.15s ease;
```

---

## 📊 Mock Data

60 transactions across 6 months (Jan–Jun 2024) covering 12 categories:

`Food & Dining` · `Transport` · `Shopping` · `Entertainment` · `Healthcare` · `Utilities` · `Salary` · `Freelance` · `Investment` · `Rent` · `Travel` · `Education`

---

## 👨‍💻 Author

**Vishesh Jaiswal**
- GitHub: [@Visheshjais](https://github.com/Visheshjais)

---

<div align="center">

Made with ❤️ and lots of coffee by **Vishesh Jaiswal**

⭐ Star this repo if you liked it!

</div>
