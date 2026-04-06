/* ============================================================
   src/components/Common/Toast.jsx
   Global toast notification system using Redux.
   Toasts auto-dismiss after their duration.
   ============================================================ */
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectToasts, removeToast } from "../../store/slices/uiSlice";
import "../../styles/Toast.css";

/* Icon per toast type */
const TOAST_ICONS = {
  success: "✓",
  error:   "✕",
  warning: "⚠",
  info:    "ℹ",
};

/* Individual toast item */
function ToastItem({ toast }) {
  const dispatch  = useDispatch();
  const timerRef  = useRef(null);
  const [removing, setRemoving] = React.useState(false);

  /* Auto-dismiss after duration */
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      handleRemove();
    }, toast.duration || 3500);

    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRemove() {
    setRemoving(true);
    /* Wait for slide-out animation before dispatching remove */
    setTimeout(() => dispatch(removeToast(toast.id)), 250);
  }

  return (
    <div className={`toast ${toast.type} ${removing ? "removing" : ""}`}>
      {/* Icon */}
      <span className="toast-icon">{TOAST_ICONS[toast.type] || "ℹ"}</span>

      {/* Message */}
      <div className="toast-body">
        <div className="toast-message">{toast.message}</div>
      </div>

      {/* Close button */}
      <button className="toast-close" onClick={handleRemove} aria-label="Dismiss">✕</button>

      {/* Progress bar shrinks over the toast duration */}
      <div
        className="toast-progress"
        style={{ animationDuration: `${toast.duration || 3500}ms` }}
      />
    </div>
  );
}

/* Container that renders all active toasts */
function ToastContainer() {
  const toasts = useSelector(selectToasts);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

export default ToastContainer;
