import { formatCurrency, getExpensesByCategory, getMonthlyData } from "../utils/finance"
import "./reports.css"

export default function Reports({ transactions }) {
  const incomeTransactions = transactions.filter((t) => t.type === "income")
  const expenseTransactions = transactions.filter((t) => t.type === "expense")

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
  const netBalance = totalIncome - totalExpenses

  const expensesByCategory = getExpensesByCategory(expenseTransactions)
  const monthlyData = getMonthlyData(transactions)

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="page-title-section">
        <h2 className="page-title">Financial Reports</h2>
        <p className="page-subtitle">Analyze your financial patterns and trends</p>
      </div>

      {/* Summary Cards */}
      <div className="reports-summary-grid">
        <div className="card">
          <div className="card-content">
            <h3 className="card-title">Income vs Expenses</h3>
            <div className="summary-list">
              <div className="summary-item">
                <span className="text-green-600">Income:</span>
                <span className="font-semibold text-green-600">{formatCurrency(totalIncome)}</span>
              </div>
              <div className="summary-item">
                <span className="text-red-600">Expenses:</span>
                <span className="font-semibold text-red-600">{formatCurrency(totalExpenses)}</span>
              </div>
              <hr className="summary-divider" />
              <div className="summary-item">
                <span className="font-semibold">Net:</span>
                <span className={`font-semibold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(netBalance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <h3 className="card-title">Transaction Count</h3>
            <div className="summary-list">
              <div className="summary-item">
                <span>Income transactions:</span>
                <span className="font-semibold">{incomeTransactions.length}</span>
              </div>
              <div className="summary-item">
                <span>Expense transactions:</span>
                <span className="font-semibold">{expenseTransactions.length}</span>
              </div>
              <hr className="summary-divider" />
              <div className="summary-item">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">{transactions.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <h3 className="card-title">Average Transaction</h3>
            <div className="summary-list">
              <div className="summary-item">
                <span>Avg Income:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(incomeTransactions.length > 0 ? totalIncome / incomeTransactions.length : 0)}
                </span>
              </div>
              <div className="summary-item">
                <span>Avg Expense:</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(expenseTransactions.length > 0 ? totalExpenses / expenseTransactions.length : 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Categories */}
      {Object.keys(expensesByCategory).length > 0 && (
        <div className="card">
          <div className="card-content">
            <h3 className="card-title">Expense Breakdown by Category</h3>
            <div className="category-breakdown">
              {Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = (amount / totalExpenses) * 100
                  return (
                    <div key={category} className="category-breakdown-item">
                      <div className="category-breakdown-header">
                        <span className="category-breakdown-name">{category}</span>
                        <div className="category-breakdown-values">
                          <span className="font-semibold">{formatCurrency(amount)}</span>
                          <span className="category-breakdown-percentage">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill red" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Trends */}
      {monthlyData.length > 0 && (
        <div className="card">
          <div className="card-content">
            <h3 className="card-title">Monthly Trends</h3>
            <div className="monthly-trends-table">
              <table className="trends-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Income</th>
                    <th>Expenses</th>
                    <th>Net</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((month) => (
                    <tr key={month.month}>
                      <td>{month.month}</td>
                      <td className="text-green-600">{formatCurrency(month.income)}</td>
                      <td className="text-red-600">{formatCurrency(month.expenses)}</td>
                      <td className={`font-semibold ${month.net >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(month.net)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {transactions.length === 0 && (
        <div className="empty-state-card">
          <p className="empty-state-text">No data available for reports.</p>
          <p className="empty-state-subtext">Start adding transactions to see your financial insights!</p>
        </div>
      )}
    </div>
  )
}
