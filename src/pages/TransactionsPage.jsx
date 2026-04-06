/* ============================================================
   src/pages/TransactionsPage.jsx
   Thin page wrapper — the heavy lifting is in TransactionList.
   ============================================================ */
import React from "react";
import TransactionList from "../components/Transactions/TransactionList";

function TransactionsPage() {
  return <TransactionList />;
}

export default TransactionsPage;
