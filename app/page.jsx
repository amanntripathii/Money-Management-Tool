"use client"

import { useState, useEffect } from "react"
import Dashboard from "../components/dashboard"
import Income from "../components/income"
import Expenses from "../components/expenses"
import Savings from "../components/savings"
import Reports from "../components/reports"
import Charts from "../components/charts"
import CurrencyConverter from "../components/currency-converter"
import Navigation from "../components/navigation"
import LoginForm from "../components/login-form"
import "./styles.css"

export default function MoneyManagementApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [transactions, setTransactions] = useState([])
  const [savingsGoals, setSavingsGoals] = useState([])
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing user session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      const userTransactions = localStorage.getItem(`transactions_${user.id}`)
      const userSavingsGoals = localStorage.getItem(`savingsGoals_${user.id}`)

      if (userTransactions) {
        setTransactions(JSON.parse(userTransactions))
      }

      if (userSavingsGoals) {
        setSavingsGoals(JSON.parse(userSavingsGoals))
      }
    } else {
      setTransactions([])
      setSavingsGoals([])
    }
  }, [user])

  // Save data to localStorage whenever transactions or savings goals change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions))
    }
  }, [transactions, user])

  useEffect(() => {
    if (user) {
      localStorage.setItem(`savingsGoals_${user.id}`, JSON.stringify(savingsGoals))
    }
  }, [savingsGoals, user])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem("currentUser", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    setActiveTab("dashboard")
  }

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions((prev) => [newTransaction, ...prev])
  }

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const addSavingsGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
    }
    setSavingsGoals((prev) => [...prev, newGoal])
  }

  const updateSavingsGoal = (id, updates) => {
    setSavingsGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)))
  }

  const deleteSavingsGoal = (id) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id))
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard transactions={transactions} savingsGoals={savingsGoals} />
      case "income":
        return <Income transactions={transactions} addTransaction={addTransaction} />
      case "expenses":
        return (
          <Expenses transactions={transactions} addTransaction={addTransaction} deleteTransaction={deleteTransaction} />
        )
      case "savings":
        return (
          <Savings
            savingsGoals={savingsGoals}
            addSavingsGoal={addSavingsGoal}
            updateSavingsGoal={updateSavingsGoal}
            deleteSavingsGoal={deleteSavingsGoal}
          />
        )
      case "reports":
        return <Reports transactions={transactions} />
      case "charts":
        return <Charts transactions={transactions} />
      case "converter":
        return <CurrencyConverter />
      default:
        return <Dashboard transactions={transactions} savingsGoals={savingsGoals} />
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="app-container">
      <div className="max-width-container">
        <header className="app-header">
          <div className="header-content">
            <div>
              <h1 className="app-title">Money Management Tool</h1>
              <p className="app-subtitle">Welcome back, {user.name}!</p>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary logout-btn">
              Logout
            </button>
          </div>
        </header>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="main-content">{renderActiveComponent()}</main>
      </div>
    </div>
  )
}
