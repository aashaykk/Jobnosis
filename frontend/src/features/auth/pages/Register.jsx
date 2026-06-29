import React, { useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState("")

  const { loading, handleRegister } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!agree) {
      setError("Please agree to the Terms and Privacy Policy.")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address (e.g., name@domain.com).")
      return
    }

    // Password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.")
      return
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.")
      return
    }
    if (!/\d/.test(password)) {
      setError("Password must contain at least one number.")
      return
    }
    if (!/[@$!%*?&#]/.test(password)) {
      setError("Password must contain at least one special character (e.g., @$!%*?&#).")
      return
    }

    const result = await handleRegister({ username, email, password })
    if (result && result.success) {
      navigate('/')
    } else {
      setError(result?.error || "Registration failed. Please try again.")
    }
  }

  if (loading) {
    return (
      <main className="auth-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div className="brand-header" style={{ marginBottom: 0 }}>
            <span>Jobnosis</span>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(99, 102, 241, 0.1)',
            borderTopColor: '#6366f1',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-page">
      {/* Brand Header */}
      <div className="brand-header">
        <span>Jobnosis</span>
      </div>

      {/* Main Form Card */}
      <div className="form-card">
        {/* Avatar badge at top */}
        <div className="avatar-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        </div>

        <h1>Ready to <i>crush it</i>?</h1>
        <p className="subtitle">Sign up and start your journey today.</p>

        {error && (
          <div className="error-message" style={{
            color: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: '1px solid rgba(239, 68, 68, 0.15)',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username input group */}
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                onChange={(e) => { setUsername(e.target.value) }}
                type="text"
                id="username"
                name="username"
                value={username}
                required
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Email input group */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                onChange={(e) => { setEmail(e.target.value) }}
                type="email"
                id="email"
                name="email"
                value={email}
                required
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password input group */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                onChange={(e) => { setPassword(e.target.value) }}
                type="password"
                id="password"
                name="password"
                value={password}
                required
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Terms checkbox row */}
          <div className="terms-row" onClick={() => setAgree(!agree)}>
            <input
              type="checkbox"
              id="agree"
              name="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
            />
            <label htmlFor="agree" onClick={(e) => e.stopPropagation()}>
              I agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="button primary-button submit-button">
            Continue with Email
          </button>
        </form>

        {/* Footer Toggle Link */}
        <p className="footer-text">
          Already have an account?
          <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  )
}

export default Register
