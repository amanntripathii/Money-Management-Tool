"use client"

import { useState, useEffect } from "react"
import "./savings-goal-form.css"

export default function SavingsGoalForm({ goal, onSubmit, onCancel }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [currentAmount, setCurrentAmount] = useState("")
  const [targetDate, setTargetDate] = useState("")

  useEffect(() => {
    if (goal) {
      setName(goal.name)
      setDescription(goal.description)
      setTargetAmount(goal.targetAmount.toString())
      setCurrentAmount(goal.currentAmount.toString())
      setTargetDate(goal.targetDate)
    }
  }, [goal])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !targetAmount || !targetDate) return

    onSubmit({
      name,
      description,
      targetAmount: Number.parseFloat(targetAmount),
      currentAmount: Number.parseFloat(currentAmount) || 0,
      targetDate,
    })

    // Reset form if not editing
    if (!goal) {
      setName("")
      setDescription("")
      setTargetAmount("")
      setCurrentAmount("")
      setTargetDate("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="savings-goal-form">
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Goal Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="form-input"
          placeholder="e.g., Emergency Fund, Vacation, New Car"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="form-textarea"
          placeholder="Brief description of your savings goal"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="targetAmount" className="form-label">
            Target Amount
          </label>
          <input
            type="number"
            id="targetAmount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            step="0.01"
            min="0"
            required
            className="form-input"
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="currentAmount" className="form-label">
            Current Amount
          </label>
          <input
            type="number"
            id="currentAmount"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            step="0.01"
            min="0"
            className="form-input"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="targetDate" className="form-label">
          Target Date
        </label>
        <input
          type="date"
          id="targetDate"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-purple">
          {goal ? "Update Goal" : "Create Goal"}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}
