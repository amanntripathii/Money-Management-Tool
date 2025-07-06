"use client"

import { useState } from "react"
import { formatCurrency } from "../utils/finance"
import SavingsGoalForm from "./savings-goal-form"
import "./savings.css"

export default function Savings({ savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal }) {
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  const totalTargetAmount = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalCurrentAmount = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0

  const handleAddGoal = (goalData) => {
    addSavingsGoal(goalData)
    setShowForm(false)
  }

  const handleUpdateGoal = (goalData) => {
    if (editingGoal) {
      updateSavingsGoal(editingGoal.id, goalData)
      setEditingGoal(null)
    }
  }

  const handleAddMoney = (goalId, amount) => {
    const goal = savingsGoals.find((g) => g.id === goalId)
    if (goal) {
      updateSavingsGoal(goalId, {
        currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount),
      })
    }
  }

  return (
    <div className="savings-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h2 className="page-title">Savings Goals</h2>
          <p className="page-subtitle">Set and track your savings targets</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-purple">
          Add Goal
        </button>
      </div>

      {/* Overall Progress */}
      <div className="savings-summary-card">
        <h3 className="savings-summary-title">Overall Savings Progress</h3>
        <p className="savings-summary-amount">{formatCurrency(totalCurrentAmount)}</p>
        <p className="savings-summary-target">of {formatCurrency(totalTargetAmount)} target</p>
        <div className="progress-bar">
          <div className="progress-fill white" style={{ width: `${Math.min(overallProgress, 100)}%` }}></div>
        </div>
        <p className="savings-summary-percentage">{Math.round(overallProgress)}% complete</p>
      </div>

      {/* Add/Edit Goal Form */}
      {(showForm || editingGoal) && (
        <div className="card">
          <div className="card-content">
            <h3 className="form-title">{editingGoal ? "Edit Savings Goal" : "Add New Savings Goal"}</h3>
            <SavingsGoalForm
              goal={editingGoal}
              onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
              onCancel={() => {
                setShowForm(false)
                setEditingGoal(null)
              }}
            />
          </div>
        </div>
      )}

      {/* Savings Goals List */}
      <div className="savings-goals-grid">
        {savingsGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          const isCompleted = goal.currentAmount >= goal.targetAmount

          return (
            <div key={goal.id} className="savings-goal-card">
              <div className="savings-goal-header">
                <div className="savings-goal-info">
                  <h4 className="savings-goal-title">{goal.name}</h4>
                  <p className="savings-goal-description">{goal.description}</p>
                </div>
                <div className="savings-goal-actions">
                  <button onClick={() => setEditingGoal(goal)} className="action-button">
                    ✏️
                  </button>
                  <button onClick={() => deleteSavingsGoal(goal.id)} className="action-button delete">
                    🗑️
                  </button>
                </div>
              </div>

              <div className="savings-goal-progress">
                <div className="progress-header">
                  <span className="progress-label">Progress</span>
                  <span className="progress-amounts">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${isCompleted ? "green" : "purple"}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <p className="progress-percentage">
                  {Math.round(progress)}% complete
                  {isCompleted && " 🎉"}
                </p>
              </div>

              <div className="savings-goal-footer">
                <span className="target-date">Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                {!isCompleted && (
                  <button
                    onClick={() => {
                      const amount = prompt("How much would you like to add?")
                      if (amount && !isNaN(Number(amount))) {
                        handleAddMoney(goal.id, Number(amount))
                      }
                    }}
                    className="add-money-button"
                  >
                    Add Money
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {savingsGoals.length === 0 && (
        <div className="empty-state-card">
          <p className="empty-state-text">No savings goals yet.</p>
          <button onClick={() => setShowForm(true)} className="empty-state-button">
            Create your first savings goal
          </button>
        </div>
      )}
    </div>
  )
}
