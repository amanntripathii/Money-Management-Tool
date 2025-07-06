"use client"

import { formatCurrency } from "../utils/finance"
import "./transaction-list.css"

export default function TransactionList({ transactions, showActions = false, onDelete }) {
  if (transactions.length === 0) {
    return <p className="empty-transactions">No transactions found.</p>
  }

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="transaction-item">
          <div className="transaction-left">
            <div className={`transaction-indicator ${transaction.type}`}></div>
            <div className="transaction-details">
              <h4>{transaction.description}</h4>
              <p>
                {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="transaction-right">
            <span className={`transaction-amount ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </span>

            {showActions && onDelete && (
              <button onClick={() => onDelete(transaction.id)} className="delete-button" title="Delete transaction">
                🗑️
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
