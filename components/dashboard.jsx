import { calculateTotals, formatCurrency } from "../utils/finance"
import TransactionList from "./transaction-list"
import "./dashboard.css"

export default function Dashboard({ transactions, savingsGoals }) {
  const { totalIncome, totalExpenses, totalSavings } = calculateTotals(transactions)
  const recentTransactions = transactions.slice(0, 5)

  const totalSavingsGoals = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)

  return (
    <div className="dashboard">
      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-card-content">
            <div className="summary-icon bg-green-100">
              <span className="text-green-600">💰</span>
            </div>
            <div className="summary-content">
              <p className="summary-label">Total Income</p>
              <p className="summary-value text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-content">
            <div className="summary-icon bg-red-100">
              <span className="text-red-600">💸</span>
            </div>
            <div className="summary-content">
              <p className="summary-label">Total Expenses</p>
              <p className="summary-value text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-content">
            <div className="summary-icon bg-blue-100">
              <span className="text-blue-600">💵</span>
            </div>
            <div className="summary-content">
              <p className="summary-label">Net Balance</p>
              <p className={`summary-value ${totalIncome - totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(totalIncome - totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-content">
            <div className="summary-icon bg-purple-100">
              <span className="text-purple-600">🎯</span>
            </div>
            <div className="summary-content">
              <p className="summary-label">Savings Progress</p>
              <p className="summary-value text-purple-600">
                {totalSavingsGoals > 0 ? `${Math.round((totalSaved / totalSavingsGoals) * 100)}%` : "0%"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Transactions</h2>
        </div>
        <div className="card-content">
          {recentTransactions.length > 0 ? (
            <TransactionList transactions={recentTransactions} showActions={false} />
          ) : (
            <p className="empty-state">No transactions yet. Start by adding your income or expenses!</p>
          )}
        </div>
      </div>

      {/* Savings Goals Overview */}
      {savingsGoals.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Savings Goals</h2>
          </div>
          <div className="card-content">
            <div className="savings-goals-list">
              {savingsGoals.slice(0, 3).map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100
                return (
                  <div key={goal.id} className="savings-goal-item">
                    <div className="savings-goal-header">
                      <span className="savings-goal-name">{goal.name}</span>
                      <span className="savings-goal-amount">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill purple" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
