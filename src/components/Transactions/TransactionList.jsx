/* ============================================================
   src/components/Transactions/TransactionList.jsx
   Full transaction table with filters, grouping, pagination,
   edit/delete (admin), and CSV/JSON export.
   All state from Redux.
   ============================================================ */
import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectTransactions,
  deleteTransaction,
  resetTransactions,
} from "../../store/slices/transactionsSlice";
import { selectFilters, setSort, resetFilters } from "../../store/slices/filtersSlice";
import { selectIsAdmin, addToast } from "../../store/slices/uiSlice";
import {
  applyFilters, groupTransactions,
  formatCurrency, formatDate,
  exportToCSV, exportToJSON,
} from "../../utils/helpers";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../../data/mockData";
import FilterBar           from "./FilterBar";
import AddTransactionModal from "./AddTransactionModal";
import "../../styles/Transactions.css";

const PAGE_SIZE = 10;

function TransactionList() {
  const dispatch     = useDispatch();
  const transactions = useSelector(selectTransactions);
  const filters      = useSelector(selectFilters);
  const isAdmin      = useSelector(selectIsAdmin);

  /* Modal state */
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  /* Pagination */
  const [page, setPage] = useState(1);

  /* Apply all filters and sorting */
  const filtered = useMemo(
    () => applyFilters(transactions, filters),
    [transactions, filters]
  );

  /* Group if groupBy is set */
  const grouped = useMemo(
    () => groupTransactions(filtered, filters.groupBy),
    [filtered, filters.groupBy]
  );

  /* Flatten for pagination when no grouping */
  const isGrouped    = filters.groupBy !== "none";
  const totalPages   = isGrouped ? 1 : Math.ceil(filtered.length / PAGE_SIZE);
  const currentRows  = isGrouped
    ? filtered
    : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Sort toggle */
  function handleSort(col) {
    dispatch(setSort({ sortBy: col }));
    setPage(1);
  }

  /* Sort icon */
  function sortIcon(col) {
    if (filters.sortBy !== col) return <span className="sort-icon">⇅</span>;
    return <span className="sort-icon active">{filters.sortDir === "desc" ? "↓" : "↑"}</span>;
  }

  /* Delete with confirmation */
  function handleDelete(id) {
    if (window.confirm("Delete this transaction? This cannot be undone.")) {
      dispatch(deleteTransaction(id));
      dispatch(addToast({ type: "success", message: "Transaction deleted." }));
    }
  }

  /* Open edit modal */
  function handleEdit(tx) {
    setEditTarget(tx);
    setModalOpen(true);
  }

  /* Open add modal */
  function handleAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }

  /* Export handlers */
  function handleExportCSV() {
    exportToCSV(filtered, "fintrack_transactions");
    dispatch(addToast({ type: "info", message: `Exported ${filtered.length} transactions to CSV.` }));
  }

  function handleExportJSON() {
    exportToJSON(filtered, "fintrack_transactions");
    dispatch(addToast({ type: "info", message: `Exported ${filtered.length} transactions to JSON.` }));
  }

  /* Reset all transactions to mock data (admin only) */
  function handleReset() {
    if (window.confirm("Reset all transactions to demo data? This cannot be undone.")) {
      dispatch(resetTransactions());
      dispatch(addToast({ type: "warning", message: "All transactions reset to demo data." }));
      setPage(1);
    }
  }

  /* Render a single transaction row */
  function renderRow(tx) {
    const catColor = CATEGORY_COLORS[tx.category] || "var(--text-secondary)";
    const catIcon  = CATEGORY_ICONS[tx.category]  || "•";
    return (
      <tr key={tx.id}>
        {/* Date */}
        <td style={{ whiteSpace: "nowrap", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
          {formatDate(tx.date)}
        </td>

        {/* Description */}
        <td className="desc-cell">{tx.description}</td>

        {/* Category pill */}
        <td className="col-category">
          <span className="category-pill" style={{ borderColor: `${catColor}40` }}>
            <span>{catIcon}</span>
            {tx.category}
          </span>
        </td>

        {/* Type badge */}
        <td>
          <span className={`badge badge-${tx.type}`}>
            {tx.type === "income" ? "▲" : "▼"} {tx.type}
          </span>
        </td>

        {/* Amount */}
        <td className={`amount-cell mono ${tx.type === "income" ? "text-green" : "text-red"}`}>
          {tx.type === "income" ? "+" : "−"}{formatCurrency(tx.amount)}
        </td>

        {/* Admin action buttons */}
        {isAdmin && (
          <td>
            <div className="actions-cell">
              <button className="btn-icon" title="Edit" onClick={() => handleEdit(tx)}>
                ✎
              </button>
              <button
                className="btn-icon"
                title="Delete"
                style={{ color: "var(--accent-red)" }}
                onClick={() => handleDelete(tx.id)}
              >
                ✕
              </button>
            </div>
          </td>
        )}
      </tr>
    );
  }

  /* Render grouped rows with group header */
  function renderGrouped() {
    return Object.entries(grouped).map(([groupKey, rows]) => {
      const groupTotal = rows.reduce(
        (acc, t) => acc + (t.type === "income" ? t.amount : -t.amount),
        0
      );
      return (
        <React.Fragment key={groupKey}>
          {/* Group header */}
          <tr className="group-header-row">
            <td colSpan={isAdmin ? 6 : 5}>
              {groupKey}
              <span className={`group-total mono ${groupTotal >= 0 ? "text-green" : "text-red"}`}>
                {groupTotal >= 0 ? "+" : "−"}{formatCurrency(Math.abs(groupTotal))}
              </span>
            </td>
          </tr>
          {rows.map(renderRow)}
        </React.Fragment>
      );
    });
  }

  return (
    <div>
      {/* Viewer notice */}
      {!isAdmin && (
        <div className="viewer-notice">
          <span>◎</span>
          <span>
            <strong>Viewer mode</strong> — Switch to Admin in the sidebar to add, edit or delete transactions.
          </span>
        </div>
      )}

      {/* Filter bar */}
      <FilterBar onPageReset={() => setPage(1)} />

      {/* Table wrapper */}
      <div className="table-wrapper">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="table-count">
            Showing <strong>{isGrouped ? filtered.length : currentRows.length}</strong> of{" "}
            <strong>{filtered.length}</strong> transactions
            {filtered.length !== transactions.length && (
              <span style={{ color: "var(--text-muted)" }}> (filtered from {transactions.length})</span>
            )}
          </div>

          <div className="table-actions">
            {/* Export buttons */}
            <button className="btn btn-secondary btn-sm" onClick={handleExportCSV} title="Export as CSV">
              ↓ CSV
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleExportJSON} title="Export as JSON">
              ↓ JSON
            </button>

            {/* Add Transaction – admin only */}
            {isAdmin && (
              <>
                <button className="btn btn-danger btn-sm" onClick={handleReset} title="Reset to demo data">
                  ↺ Reset
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleAdd}>
                  + Add
                </button>
              </>
            )}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>No transactions match your filters.</p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => dispatch(resetFilters())}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th className="sortable-th" onClick={() => handleSort("date")}>
                    Date {sortIcon("date")}
                  </th>
                  <th className="sortable-th" onClick={() => handleSort("description")}>
                    Description {sortIcon("description")}
                  </th>
                  <th className="col-category">Category</th>
                  <th>Type</th>
                  <th className="sortable-th" onClick={() => handleSort("amount")}>
                    Amount {sortIcon("amount")}
                  </th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {isGrouped ? renderGrouped() : currentRows.map(renderRow)}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination – only when not grouped */}
        {!isGrouped && totalPages > 1 && (
          <div className="pagination">
            <div className="page-info">Page {page} of {totalPages}</div>
            <div className="page-buttons">
              <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…" + p);
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  String(p).startsWith("…") ? (
                    <span key={p} className="page-btn" style={{ cursor: "default", opacity: 0.4 }}>…</span>
                  ) : (
                    <button
                      key={p}
                      className={`page-btn ${p === page ? "active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  )
                )}
              <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editData={editTarget}
      />
    </div>
  );
}

export default TransactionList;
