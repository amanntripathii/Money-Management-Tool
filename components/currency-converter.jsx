"use client"

import { useState, useEffect } from "react"
import "./currency-converter.css"

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [exchangeRate, setExchangeRate] = useState(null)
  const [convertedAmount, setConvertedAmount] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState(null)

  // Popular currencies
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  ]

  // Mock exchange rates (in a real app, you'd fetch from an API)
  const mockExchangeRates = {
    USD: { EUR: 0.85, GBP: 0.73, JPY: 110, CAD: 1.25, AUD: 1.35, CHF: 0.92, CNY: 6.45, INR: 74.5, BRL: 5.2 },
    EUR: { USD: 1.18, GBP: 0.86, JPY: 129, CAD: 1.47, AUD: 1.59, CHF: 1.08, CNY: 7.6, INR: 87.8, BRL: 6.1 },
    GBP: { USD: 1.37, EUR: 1.16, JPY: 150, CAD: 1.71, AUD: 1.85, CHF: 1.26, CNY: 8.84, INR: 102, BRL: 7.1 },
    JPY: {
      USD: 0.0091,
      EUR: 0.0077,
      GBP: 0.0067,
      CAD: 0.011,
      AUD: 0.012,
      CHF: 0.0084,
      CNY: 0.059,
      INR: 0.68,
      BRL: 0.047,
    },
    CAD: { USD: 0.8, EUR: 0.68, GBP: 0.58, JPY: 88, AUD: 1.08, CHF: 0.74, CNY: 5.16, INR: 59.6, BRL: 4.16 },
    AUD: { USD: 0.74, EUR: 0.63, GBP: 0.54, JPY: 81.5, CAD: 0.93, CHF: 0.68, CNY: 4.78, INR: 55.2, BRL: 3.85 },
    CHF: { USD: 1.09, EUR: 0.93, GBP: 0.79, JPY: 119, CAD: 1.36, AUD: 1.47, CNY: 7.03, INR: 81.2, BRL: 5.66 },
    CNY: { USD: 0.155, EUR: 0.132, GBP: 0.113, JPY: 17.1, CAD: 0.194, AUD: 0.209, CHF: 0.142, INR: 11.55, BRL: 0.806 },
    INR: {
      USD: 0.0134,
      EUR: 0.0114,
      GBP: 0.0098,
      JPY: 1.47,
      CAD: 0.0168,
      AUD: 0.0181,
      CHF: 0.0123,
      CNY: 0.0866,
      BRL: 0.0698,
    },
    BRL: { USD: 0.192, EUR: 0.164, GBP: 0.141, JPY: 21.3, CAD: 0.24, AUD: 0.26, CHF: 0.177, CNY: 1.24, INR: 14.3 },
  }

  const fetchExchangeRate = async () => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1)
      setLastUpdated(new Date())
      return
    }

    setLoading(true)
    setError("")

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Use mock data
      const rate = mockExchangeRates[fromCurrency]?.[toCurrency]
      if (rate) {
        setExchangeRate(rate)
        setLastUpdated(new Date())
      } else {
        setError("Exchange rate not available for this currency pair")
      }
    } catch (err) {
      setError("Failed to fetch exchange rate")
    } finally {
      setLoading(false)
    }
  }

  const handleConvert = () => {
    if (!amount || !exchangeRate) return
    const result = Number.parseFloat(amount) * exchangeRate
    setConvertedAmount(result)
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setExchangeRate(null)
    setConvertedAmount(null)
  }

  useEffect(() => {
    fetchExchangeRate()
  }, [fromCurrency, toCurrency])

  useEffect(() => {
    if (amount && exchangeRate) {
      handleConvert()
    } else {
      setConvertedAmount(null)
    }
  }, [amount, exchangeRate])

  const formatCurrency = (amount, currencyCode) => {
    const currency = currencies.find((c) => c.code === currencyCode)
    return `${currency?.symbol || currencyCode} ${amount.toFixed(2)}`
  }

  return (
    <div className="converter-page">
      {/* Header */}
      <div className="page-title-section">
        <h2 className="page-title">Currency Converter</h2>
        <p className="page-subtitle">Convert between different currencies</p>
      </div>

      {/* Converter Card */}
      <div className="converter-card">
        <div className="converter-form">
          {/* Amount Input */}
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input amount-input"
              placeholder="Enter amount"
              step="0.01"
              min="0"
            />
          </div>

          {/* Currency Selection */}
          <div className="currency-row">
            <div className="currency-group">
              <label htmlFor="fromCurrency" className="form-label">
                From
              </label>
              <select
                id="fromCurrency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="form-select"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="button" onClick={handleSwapCurrencies} className="swap-button" title="Swap currencies">
              ⇄
            </button>

            <div className="currency-group">
              <label htmlFor="toCurrency" className="form-label">
                To
              </label>
              <select
                id="toCurrency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="form-select"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Exchange Rate Display */}
          {loading && (
            <div className="exchange-rate-info loading">
              <div className="loading-spinner small"></div>
              <span>Fetching exchange rate...</span>
            </div>
          )}

          {error && (
            <div className="exchange-rate-info error">
              <span>⚠️ {error}</span>
            </div>
          )}

          {exchangeRate && !loading && !error && (
            <div className="exchange-rate-info">
              <span>
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </span>
              {lastUpdated && <span className="last-updated">Updated: {lastUpdated.toLocaleTimeString()}</span>}
            </div>
          )}

          {/* Conversion Result */}
          {convertedAmount !== null && amount && (
            <div className="conversion-result">
              <div className="result-from">{formatCurrency(Number.parseFloat(amount), fromCurrency)}</div>
              <div className="result-equals">=</div>
              <div className="result-to">{formatCurrency(convertedAmount, toCurrency)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Popular Conversions */}
      <div className="popular-conversions-card">
        <h3 className="card-title">Popular Conversions</h3>
        <div className="popular-grid">
          {[
            { from: "USD", to: "EUR" },
            { from: "USD", to: "GBP" },
            { from: "EUR", to: "GBP" },
            { from: "USD", to: "JPY" },
            { from: "GBP", to: "USD" },
            { from: "EUR", to: "USD" },
          ].map((pair) => {
            const rate = mockExchangeRates[pair.from]?.[pair.to]
            return (
              <button
                key={`${pair.from}-${pair.to}`}
                onClick={() => {
                  setFromCurrency(pair.from)
                  setToCurrency(pair.to)
                }}
                className="popular-conversion-item"
              >
                <span className="conversion-pair">
                  {pair.from} → {pair.to}
                </span>
                <span className="conversion-rate">{rate ? rate.toFixed(4) : "N/A"}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Currency Info */}
      <div className="currency-info-card">
        <h3 className="card-title">Currency Information</h3>
        <div className="currency-info-grid">
          <div className="currency-info-item">
            <h4>{currencies.find((c) => c.code === fromCurrency)?.name}</h4>
            <p>Code: {fromCurrency}</p>
            <p>Symbol: {currencies.find((c) => c.code === fromCurrency)?.symbol}</p>
          </div>
          <div className="currency-info-item">
            <h4>{currencies.find((c) => c.code === toCurrency)?.name}</h4>
            <p>Code: {toCurrency}</p>
            <p>Symbol: {currencies.find((c) => c.code === toCurrency)?.symbol}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
