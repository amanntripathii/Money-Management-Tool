"use client"

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { formatCurrency, getExpensesByCategory, getMonthlyData } from "../utils/finance"
import "./charts.css"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C"]

export default function Charts({ transactions }) {
  const expenseTransactions = transactions.filter((t) => t.type === "expense")
  const expensesByCategory = getExpensesByCategory(expenseTransactions)
  const monthlyData = getMonthlyData(transactions)

  // Prepare pie chart data
  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount,
  }))

  // Prepare bar chart data for monthly savings vs spending
  const barChartData = monthlyData.map((month) => ({
    month: month.month.split(" ")[0], // Get just the month name
    income: month.income,
    expenses: month.expenses,
    savings: month.net > 0 ? month.net : 0,
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-value" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value" style={{ color: payload[0].color }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="charts-page">
      {/* Header */}
      <div className="page-title-section">
        <h2 className="page-title">Financial Charts</h2>
        <p className="page-subtitle">Visual analysis of your financial data</p>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Expense Categories Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Expense Categories</h3>
            <p className="chart-subtitle">Distribution of expenses by category</p>
          </div>
          <div className="chart-container">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">
                <p>No expense data available</p>
                <p className="empty-chart-subtitle">Add some expenses to see the breakdown</p>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Income vs Expenses Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Monthly Overview</h3>
            <p className="chart-subtitle">Income, expenses, and savings by month</p>
          </div>
          <div className="chart-container">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="income" fill="#10B981" name="Income" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  <Bar dataKey="savings" fill="#8B5CF6" name="Savings" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">
                <p>No monthly data available</p>
                <p className="empty-chart-subtitle">Add transactions to see monthly trends</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Legend */}
      {pieChartData.length > 0 && (
        <div className="chart-legend-card">
          <h3 className="chart-title">Expense Categories Legend</h3>
          <div className="legend-grid">
            {pieChartData.map((entry, index) => (
              <div key={entry.name} className="legend-item">
                <div className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="legend-name">{entry.name}</span>
                <span className="legend-value">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart Statistics */}
      {transactions.length > 0 && (
        <div className="chart-stats-card">
          <h3 className="chart-title">Chart Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Categories:</span>
              <span className="stat-value">{pieChartData.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Months Tracked:</span>
              <span className="stat-value">{barChartData.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Largest Expense Category:</span>
              <span className="stat-value">
                {pieChartData.length > 0
                  ? pieChartData.reduce((max, cat) => (cat.value > max.value ? cat : max)).name
                  : "N/A"}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Best Savings Month:</span>
              <span className="stat-value">
                {barChartData.length > 0
                  ? barChartData.reduce((max, month) => (month.savings > max.savings ? month : max)).month
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
