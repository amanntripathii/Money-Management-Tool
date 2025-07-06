export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export const calculateTotals = (transactions) => {
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const totalSavings = totalIncome - totalExpenses

  return { totalIncome, totalExpenses, totalSavings }
}

export const getExpensesByCategory = (expenses) => {
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})
}

export const getMonthlyData = (transactions) => {
  const monthlyData = {}

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 }
    }

    if (transaction.type === "income") {
      monthlyData[monthKey].income += transaction.amount
    } else {
      monthlyData[monthKey].expenses += transaction.amount
    }
  })

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }),
      ...data,
      net: data.income - data.expenses,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
}
