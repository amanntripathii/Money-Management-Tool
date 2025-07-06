"use client"

import { useState } from "react"
import { formatCurrency, getExpensesByCategory } from "../utils/finance"
import TransactionForm from "./transaction-form"
import TransactionList from "./transaction-list"
import "./expenses.css"

export default function Expenses({ transactions, addTransaction, deleteTransaction }) {
  const [showForm, setShowForm] = useState(false)

  const expenseTransactions = transactions.filter((t) => t.type === "expense")
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
  const expensesByCategory = getExpensesByCategory(expenseTransactions)

  const handleAddExpense = (data) => {
    addTransaction({
      ...data,
      type: "expense",
    })
    setShowForm(false)
  }

  return (
    <div className="expenses-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h2 className="page-title">Expense Management</h2>
          <p className="page-subtitle">Track and categorize your expenses</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-danger">
          Add Expense
        </button>
      </div>

      {/* Total Expenses Card */}
      <div className="expenses-summary-card">
        <h3 className="expenses-summary-title">Total Expenses</h3>
        <p className="expenses-summary-amount">{formatCurrency(totalExpenses)}</p>
        <p className="expenses-summary-count">{expenseTransactions.length} transactions</p>
      </div>

      {/* Expenses by Category */}
      {Object.keys(expensesByCategory).length > 0 && (
        <div className="card">
          <div className="card-content">
            <h3 className="form-title">Expenses by Category</h3>
            <div className="category-grid">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="category-card">
                  <h4 className="category-name">{category}</h4>
                  <p className="category-amount">{formatCurrency(amount)}</p>
                  <p className="category-percentage">{Math.round((amount / totalExpenses) * 100)}% of total</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Form */}
      {showForm && (
        <div className="card">
          <div className="card-content">
            <h3 className="form-title">Add New Expense</h3>
            <TransactionForm type="expense" onSubmit={handleAddExpense} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Expense List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Expense History</h3>
        </div>
        <div className="card-content">
          {expenseTransactions.length > 0 ? (
            <TransactionList transactions={expenseTransactions} showActions={true} onDelete={deleteTransaction} />
          ) : (
            <div className="empty-state">
              <p>No expenses recorded yet.</p>
              <button onClick={() => setShowForm(true)} className="empty-state-button">
                Add your first expense
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
