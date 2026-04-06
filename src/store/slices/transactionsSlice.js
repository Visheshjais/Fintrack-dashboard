/* ============================================================
   src/store/slices/transactionsSlice.js
   Redux slice for ALL transaction-related state.
   Handles: add, update, delete, reset operations.
   Persists to localStorage on every change.
   ============================================================ */
import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_TRANSACTIONS } from "../../data/mockData";
import { generateId } from "../../utils/helpers";

/* ── Load transactions from localStorage (or fall back to mock data) ── */
function loadTransactions() {
  try {
    const stored = localStorage.getItem("fintrack_transactions");
    return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

/* ── Save transactions to localStorage ── */
function saveTransactions(txns) {
  localStorage.setItem("fintrack_transactions", JSON.stringify(txns));
}

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    list: loadTransactions(),      // Full transaction array
    loading: false,                // For simulated async API calls
    lastUpdated: null,             // Timestamp of last change
  },
  reducers: {
    /* Add a new transaction */
    addTransaction: (state, action) => {
      const newId = generateId(state.list);
      const newTx = {
        ...action.payload,
        id:     newId,
        amount: Number(action.payload.amount),
      };
      state.list.unshift(newTx);  // Add to beginning (newest first)
      state.lastUpdated = Date.now();
      saveTransactions(state.list);
    },

    /* Update an existing transaction by id */
    updateTransaction: (state, action) => {
      const { id, updates } = action.payload;
      const idx = state.list.findIndex((t) => t.id === id);
      if (idx !== -1) {
        state.list[idx] = {
          ...state.list[idx],
          ...updates,
          amount: Number(updates.amount ?? state.list[idx].amount),
        };
      }
      state.lastUpdated = Date.now();
      saveTransactions(state.list);
    },

    /* Delete a transaction by id */
    deleteTransaction: (state, action) => {
      state.list = state.list.filter((t) => t.id !== action.payload);
      state.lastUpdated = Date.now();
      saveTransactions(state.list);
    },

    /* Reset all transactions back to mock data */
    resetTransactions: (state) => {
      state.list = INITIAL_TRANSACTIONS;
      state.lastUpdated = Date.now();
      saveTransactions(state.list);
    },

    /* Simulate loading state (for mock API demo) */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  resetTransactions,
  setLoading,
} = transactionsSlice.actions;

/* ── Selectors ── */
export const selectTransactions     = (state) => state.transactions.list;
export const selectTransactionsLoading = (state) => state.transactions.loading;
export const selectLastUpdated      = (state) => state.transactions.lastUpdated;

export default transactionsSlice.reducer;
