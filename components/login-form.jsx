"use client"

import { useState } from "react"
import "./login-form.css"

export default function LoginForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return
    }

    if (!isLogin && !formData.name) {
      setError("Please enter your name")
      return
    }

    if (isLogin) {
      // Login logic
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u) => u.email === formData.email && u.password === formData.password)

      if (user) {
        onLogin(user)
      } else {
        setError("Invalid email or password")
      }
    } else {
      // Register logic
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const existingUser = users.find((u) => u.email === formData.email)

      if (existingUser) {
        setError("User with this email already exists")
        return
      }

      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))
      onLogin(newUser)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Money Management Tool</h1>
          <p className="login-subtitle">{isLogin ? "Welcome back!" : "Create your account"}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary login-button">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
                setFormData({ name: "", email: "", password: "" })
              }}
              className="toggle-button"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials:</p>
          <p>Email: demo@example.com</p>
          <p>Password: demo123</p>
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: "Demo User",
                email: "demo@example.com",
                password: "demo123",
              })
            }}
            className="demo-button"
          >
            Use Demo Account
          </button>
        </div>
      </div>
    </div>
  )
}
