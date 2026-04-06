/* ============================================================
   src/components/Transactions/FilterBar.jsx
   Full-featured filter bar: search, type, category,
   date range, groupBy, and sort controls.
   All state lives in Redux filtersSlice.
   ============================================================ */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFilters,
  selectActiveFilterCount,
  setFilter,
  resetFilters,
} from "../../store/slices/filtersSlice";
import { CATEGORIES } from "../../data/mockData";
import "../../styles/Transactions.css";

function FilterBar({ onPageReset }) {
  const dispatch     = useDispatch();
  const filters      = useSelector(selectFilters);
  const activeCount  = useSelector(selectActiveFilterCount);

  /* Dispatch a single filter change and reset pagination */
  function handleChange(key, value) {
    dispatch(setFilter({ key, value }));
    if (onPageReset) onPageReset();
  }

  function handleReset() {
    dispatch(resetFilters());
    if (onPageReset) onPageReset();
  }

  return (
    <div className="filter-bar">
      {/* ── Search ── */}
      <div className="form-group wide">
        <label className="form-label">Search</label>
        <input
          className="input"
          type="text"
          placeholder="Search description or category…"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
        />
      </div>

      {/* ── Type ── */}
      <div className="form-group">
        <label className="form-label">Type</label>
        <select
          className="select"
          value={filters.type}
          onChange={(e) => handleChange("type", e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* ── Category ── */}
      <div className="form-group">
        <label className="form-label">Category</label>
        <select
          className="select"
          value={filters.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* ── Date From ── */}
      <div className="form-group date hide-mobile">
        <label className="form-label">From</label>
        <input
          className="input"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => handleChange("dateFrom", e.target.value)}
        />
      </div>

      {/* ── Date To ── */}
      <div className="form-group date hide-mobile">
        <label className="form-label">To</label>
        <input
          className="input"
          type="date"
          value={filters.dateTo}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => handleChange("dateTo", e.target.value)}
        />
      </div>

      {/* ── Group By ── */}
      <div className="form-group hide-mobile">
        <label className="form-label">Group By</label>
        <div className="groupby-tabs">
          {["none", "month", "category"].map((g) => (
            <button
              key={g}
              className={`groupby-tab ${filters.groupBy === g ? "active" : ""}`}
              onClick={() => handleChange("groupBy", g)}
            >
              {g === "none" ? "None" : g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Reset button ── */}
      <div className="filter-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleReset}
          disabled={activeCount === 0}
        >
          Reset
          {activeCount > 0 && (
            <span className="filter-active-badge">{activeCount}</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
