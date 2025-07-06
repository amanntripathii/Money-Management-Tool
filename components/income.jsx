"use client"

import { useState } from "react"
import { formatCurrency } from "../utils/finance"
import TransactionForm from "./transaction-form"
import TransactionList from "./transaction-list"
import "./income.css"

export default function Income({ transactions, addTransaction }) {
  const [showForm, setShowForm] = useState(false)

  const incomeTransactions = transactions.filter((t) => t.type === "income")
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)

  const handleAddIncome = (data) => {
    addTransaction({
      ...data,
      type: "income",
    })
    setShowForm(false)
  }

  return (
    <div className="income-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h2 className="page-title">Income Management</h2>
          <p className="page-subtitle">Track all your income sources</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-success">
          Add Income
        </button>
      </div>

      {/* Total Income Card */}
      <div className="income-summary-card">
        <h3 className="income-summary-title">Total Income</h3>
        <p className="income-summary-amount">{formatCurrency(totalIncome)}</p>
        <p className="income-summary-count">{incomeTransactions.length} income sources</p>
      </div>

      {/* Add Income Form */}
      {showForm && (
        <div className="card">
          <div className="card-content">
            <h3 className="form-title">Add New Income</h3>
            <TransactionForm type="income" onSubmit={handleAddIncome} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Income List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Income History</h3>
        </div>
        <div className="card-content">
          {incomeTransactions.length > 0 ? (
            <TransactionList transactions={incomeTransactions} showActions={false} />
          ) : (
            <div className="empty-state">
              <p>No income recorded yet.</p>
              <button onClick={() => setShowForm(true)} className="empty-state-button">
                Add your first income
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
