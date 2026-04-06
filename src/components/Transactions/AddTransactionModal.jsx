/* ============================================================
   src/components/Transactions/AddTransactionModal.jsx
   Modal form for adding OR editing a transaction.
   Admin-only. Dispatches to Redux transactionsSlice.
   ============================================================ */
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTransaction, updateTransaction } from "../../store/slices/transactionsSlice";
import { addToast } from "../../store/slices/uiSlice";
import { CATEGORIES } from "../../data/mockData";
import "../../styles/Transactions.css";

const EMPTY_FORM = {
  date:        new Date().toISOString().slice(0, 10),
  description: "",
  category:    CATEGORIES[0],
  amount:      "",
  type:        "expense",
};

function AddTransactionModal({ isOpen, onClose, editData = null }) {
  const dispatch = useDispatch();
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  /* Populate form when editing, reset when adding */
  useEffect(() => {
    if (editData) {
      setForm({
        date:        editData.date,
        description: editData.description,
        category:    editData.category,
        amount:      String(editData.amount),
        type:        editData.type,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editData, isOpen]);

  /* Update a single field */
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  /* Validate form */
  function validate() {
    const errs = {};
    if (!form.date)              errs.date        = "Date is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = "Enter a valid positive amount";
    return errs;
  }

  /* Submit form */
  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (editData) {
      dispatch(updateTransaction({ id: editData.id, updates: form }));
      dispatch(addToast({ type: "success", message: `"${form.description}" updated successfully.` }));
    } else {
      dispatch(addTransaction(form));
      dispatch(addToast({ type: "success", message: `"${form.description}" added successfully.` }));
    }

    onClose();
    setForm(EMPTY_FORM);
  }

  /* Close on Escape key */
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {editData ? "✎ Edit Transaction" : "+ Add Transaction"}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Form */}
        <div className="modal-form">
          {/* Type toggle */}
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-btn ${form.type === "income" ? "active-income" : ""}`}
                onClick={() => handleChange("type", "income")}
              >
                ▲ Income
              </button>
              <button
                type="button"
                className={`type-btn ${form.type === "expense" ? "active-expense" : ""}`}
                onClick={() => handleChange("type", "expense")}
              >
                ▼ Expense
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              className="input"
              type="text"
              placeholder="e.g. Monthly Salary, Grocery Store…"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              maxLength={80}
              autoFocus
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          {/* Date + Amount */}
          <div className="modal-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="input"
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                className="input"
                type="number"
                placeholder="0"
                min="1"
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                style={{ fontFamily: "var(--font-mono)" }}
              />
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="select"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary"   onClick={handleSubmit}>
            {editData ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTransactionModal;
