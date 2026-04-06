/* ============================================================
   src/store/slices/filtersSlice.js
   Redux slice for transaction filter & sort state.
   ============================================================ */
import { createSlice } from "@reduxjs/toolkit";

/* ── Default / reset filter state ── */
export const DEFAULT_FILTERS = {
  search:    "",
  type:      "all",       // "all" | "income" | "expense"
  category:  "all",       // "all" | any category name
  dateFrom:  "",          // ISO date string for range filter
  dateTo:    "",          // ISO date string for range filter
  sortBy:    "date",      // "date" | "amount" | "description"
  sortDir:   "desc",      // "asc" | "desc"
  groupBy:   "none",      // "none" | "month" | "category"
};

const filtersSlice = createSlice({
  name: "filters",
  initialState: DEFAULT_FILTERS,
  reducers: {
    /* Update a single filter key */
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },

    /* Toggle sort direction or change sort column */
    setSort: (state, action) => {
      const { sortBy } = action.payload;
      if (state.sortBy === sortBy) {
        state.sortDir = state.sortDir === "desc" ? "asc" : "desc";
      } else {
        state.sortBy  = sortBy;
        state.sortDir = "desc";
      }
    },

    /* Reset all filters to defaults */
    resetFilters: () => DEFAULT_FILTERS,
  },
});

export const { setFilter, setSort, resetFilters } = filtersSlice.actions;

/* ── Selectors ── */
export const selectFilters  = (state) => state.filters;
export const selectSortBy   = (state) => state.filters.sortBy;
export const selectSortDir  = (state) => state.filters.sortDir;

/* Count how many filters are active (not default) */
export const selectActiveFilterCount = (state) => {
  const f = state.filters;
  return [
    f.search !== "",
    f.type !== "all",
    f.category !== "all",
    f.dateFrom !== "",
    f.dateTo !== "",
  ].filter(Boolean).length;
};

export default filtersSlice.reducer;
