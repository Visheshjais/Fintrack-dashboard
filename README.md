# FinTrack – Professional Finance Dashboard

A clean, interactive, and feature-rich personal finance dashboard built with **React**, **Redux Toolkit**, and **Recharts**. Designed as a frontend internship assignment submission.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Build for production
npm run build
```

Runs on **http://localhost:3000**

---

## 🏗️ Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| UI Framework   | React 18                            |
| State Management | Redux Toolkit + React-Redux       |
| Charts         | Recharts (Area, Bar, Pie, Radar)    |
| Styling        | Pure CSS (custom properties / tokens) |
| Fonts          | Inter + JetBrains Mono (Google Fonts)|
| Persistence    | localStorage (transactions + prefs) |

---

## 📁 Project Structure

```
src/
├── store/
│   ├── index.js                   ← Redux configureStore (4 slices)
│   └── slices/
│       ├── transactionsSlice.js   ← CRUD + localStorage
│       ├── filtersSlice.js        ← Search, type, category, date, sort, group
│       ├── uiSlice.js             ← Page nav, role, dark mode, toasts, sidebar
│       └── budgetSlice.js         ← Per-category monthly budget limits
│
├── components/
│   ├── Layout/
│   │   ├── Sidebar.jsx            ← Nav links + role switcher
│   │   └── Header.jsx             ← Sticky header + theme toggle + balance chip
│   ├── Common/
│   │   ├── Toast.jsx              ← Global toast notification system
│   │   └── AnimatedCounter.jsx    ← rAF-based smooth number count-up
│   ├── Dashboard/
│   │   ├── SummaryCards.jsx       ← 4 KPI cards with animated counters
│   │   ├── BalanceTrend.jsx       ← Area+line chart (Income/Expenses/Balance)
│   │   ├── SpendingBreakdown.jsx  ← Interactive donut chart by category
│   │   └── FinancialHealthScore.jsx ← SVG circular gauge (0–100 score)
│   ├── Transactions/
│   │   ├── FilterBar.jsx          ← Search, type, category, date range, groupBy
│   │   ├── TransactionList.jsx    ← Paginated table with sort, group, export
│   │   └── AddTransactionModal.jsx ← Add/Edit form (Admin only)
│   ├── Insights/
│   │   └── InsightsSection.jsx    ← Top category, comparison, savings, radar
│   └── Budget/
│       └── BudgetTracker.jsx      ← Per-category budget cards with progress bars
│
├── pages/
│   ├── DashboardPage.jsx
│   ├── TransactionsPage.jsx
│   ├── InsightsPage.jsx
│   └── BudgetPage.jsx
│
├── data/
│   └── mockData.js                ← 60 transactions, categories, colors, icons
│
├── utils/
│   └── helpers.js                 ← Pure utility functions (format, filter, export)
│
└── styles/
    ├── index.css                  ← Global design tokens (CSS variables)
    ├── Layout.css                 ← App shell, sidebar, header
    ├── Dashboard.css              ← Cards, charts, recent list
    ├── Transactions.css           ← Filter bar, table, modal
    ├── Insights.css               ← Insights cards and charts
    ├── Budget.css                 ← Budget tracker cards
    └── Toast.css                  ← Toast notifications
```

---

## ✅ Features Implemented

### Core Requirements

#### 1. Dashboard Overview
- **4 KPI Summary Cards** – Net Balance, Total Income, Total Expenses, Savings Rate  
  Each with an animated counter (counts up on load), trend badge, and accent color bar
- **Balance Trend Chart** – ComposedChart (Area + Line) showing monthly Income / Expenses / Balance  
  Includes view-mode toggle: All / Income / Expenses
- **Spending Breakdown** – Interactive donut chart grouped by category with hover tooltips  
  Center label shows active category % or total when idle
- **Financial Health Score** – SVG circular gauge (0–100) computed from:
  - Savings rate (0–40 pts)
  - Budget adherence (0–30 pts)
  - Category diversity (0–15 pts)
  - Income source count (0–15 pts)

#### 2. Transactions Section
- Sortable table by **Date**, **Description**, **Amount**
- **FilterBar**: search text, type (income/expense), category dropdown, date range (from/to)
- **Group By**: None / Month / Category with per-group subtotals
- Pagination with ellipsis (10 rows/page)
- Admin: Add, Edit, Delete with confirmation dialogs

#### 3. Role-Based UI (RBAC)
| Feature               | Admin | Viewer |
|-----------------------|-------|--------|
| View all data         | ✓     | ✓      |
| Add transactions      | ✓     | –      |
| Edit transactions     | ✓     | –      |
| Delete transactions   | ✓     | –      |
| Set budget limits     | ✓     | –      |
| Reset budgets         | ✓     | –      |

Role is switched via the **sidebar dropdown** and persisted to `localStorage`.

#### 4. Insights Section
- **Top Spending Category** – name, amount, % share with animated progress bar
- **Monthly Comparison** – last two months side-by-side with change % pill
- **Savings Rate** – large number display + color-coded progress bar + advice text
- **Quick Observations** – 6 auto-generated smart notes from live data
- **Spending by Category** – Horizontal bar chart + ranked list with color bars
- **Radar Chart** – Polar distribution of top 6 category shares

#### 5. State Management (Redux Toolkit)
Four independent Redux slices with zero prop-drilling:
- **transactionsSlice** – list + CRUD + auto-persist to localStorage
- **filtersSlice** – all filter/sort/group state
- **uiSlice** – active page, role, dark mode, sidebar, toast queue
- **budgetSlice** – category limits + auto-persist

#### 6. UI/UX
- Fully responsive (desktop → tablet → mobile with hamburger sidebar)
- Dark mode default + light mode toggle (persisted)
- Empty state illustrations for every data-less scenario
- Staggered entrance animations (`fadeInUp` with `animation-delay`)
- All interactive elements have hover/focus states

---

### Optional Enhancements (All Implemented)

| Enhancement              | Implementation                                              |
|--------------------------|-------------------------------------------------------------|
| ✅ Dark mode              | Toggle in header, persisted to `localStorage`               |
| ✅ Data persistence       | Transactions, role, dark mode, budgets all in `localStorage`|
| ✅ Animations/transitions | Counters, card hovers, modal scale-in, toast slide-in/out   |
| ✅ Export CSV             | Filtered transactions → dated `.csv` download               |
| ✅ Export JSON            | Filtered transactions → dated `.json` download              |
| ✅ Advanced filtering     | Date range, groupBy month/category, multi-sort              |
| ✅ Budget tracking        | Per-category monthly limits with over-budget alerts         |
| ✅ Financial Health Score | Composite 0–100 gauge with multi-factor scoring             |
| ✅ Radar chart            | Spending distribution across top categories                 |
| ✅ Toast notifications    | Redux-driven success/info/error popups with progress bars   |
| ✅ Animated counters      | `requestAnimationFrame` smooth ease-out count-up            |

---

## 🎨 Design Decisions

### CSS Design Token System
All colors, spacing, radii, shadows, and transitions are defined as CSS custom properties in `src/styles/index.css`. Theme switching works by toggling `data-theme="dark"` on `<html>` — no JavaScript re-renders needed.

```css
/* Example tokens */
--accent-blue:   #6366f1;
--gradient-primary: linear-gradient(135deg, #6366f1, #a855f7);
--shadow-card:   0 4px 24px rgba(0,0,0,0.5);
--transition-fast: 0.15s ease;
```

### Redux Architecture
Each slice owns one domain of state and exposes:
- **Actions** (reducers) for mutations
- **Selectors** for memoized reads
- **Side effects** (localStorage sync) inside reducers using Immer

Components connect via `useSelector` / `useDispatch` — no Context required.

### No External UI Libraries
All UI components (cards, modals, tables, badges, buttons, toasts, progress bars) are custom-built with plain CSS to demonstrate design and CSS skills.

---

## 🔑 Role Switching

Switch roles from the **sidebar footer dropdown**:
- **Viewer (default)** – read-only, all data visible, no mutations
- **Admin** – full CRUD on transactions, budget editing enabled

Role is saved to `localStorage` and restored on next visit.

---

## 📊 Mock Data

60 transactions across 6 months (Jan–Jun 2024) covering 12 categories:  
Food & Dining, Transport, Shopping, Entertainment, Healthcare, Utilities, Salary, Freelance, Investment, Rent, Travel, Education

Data resets are available via the **Reset Transactions** button (accessible in the admin role from Transactions page toolbar).

---

## 🌐 Browser Support

Chrome 90+, Firefox 90+, Safari 14+, Edge 90+  
(Requires CSS custom properties, `backdrop-filter`, and `requestAnimationFrame`)
