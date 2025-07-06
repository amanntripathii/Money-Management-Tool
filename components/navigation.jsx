"use client"

import "./navigation.css"

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    { id: "income", name: "Income", icon: "💰" },
    { id: "expenses", name: "Expenses", icon: "💸" },
    { id: "savings", name: "Savings", icon: "🎯" },
    { id: "reports", name: "Reports", icon: "📈" },
    { id: "charts", name: "Charts", icon: "📉" },
    { id: "converter", name: "Converter", icon: "💱" },
  ]

  return (
    <nav className="navigation">
      <div className="nav-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-button ${activeTab === tab.id ? "active" : ""}`}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
