"use client"

import { useState } from "react"
import "./transaction-form.css"

export default function TransactionForm({ type, onSubmit, onCancel }) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const incomeCategories = ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"]
  const expenseCategories = [
    "Food",
    "Transportation",
    "Housing",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Shopping",
    "Education",
    "Other",
  ]

  const categories = type === "income" ? incomeCategories : expenseCategories

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || !description || !category) return

    onSubmit({
      amount: Number.parseFloat(amount),
      description,
      category,
      date,
    })

    // Reset form
    setAmount("")
    setDescription("")
    setCategory("")
    setDate(new Date().toISOString().split("T")[0])
  }

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            required
            className="form-input"
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="form-select"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat.toLowerCase()}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="form-input"
          placeholder={`Enter ${type} description`}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className={`btn ${type === "income" ? "btn-success" : "btn-danger"}`}>
          Add {type === "income" ? "Income" : "Expense"}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}
