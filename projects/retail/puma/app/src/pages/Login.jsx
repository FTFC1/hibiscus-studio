import { useState } from 'react'
import { useUser } from '../context/UserContext'

const DEMO_ACCOUNTS = {
  manager: { email: 'manager@pumatrial.com', password: 'PumaTrial2026!' },
  staff:   { email: 'staff1@pumatrial.com',  password: 'PumaTrial2026!' },
}

export default function Login() {
  const { signIn } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleDemo(role) {
    setError(null)
    setSubmitting(true)
    const { error } = await signIn(DEMO_ACCOUNTS[role].email, DEMO_ACCOUNTS[role].password)
    if (error) setError('Could not load demo. Try again.')
    setSubmitting(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error } = await signIn(email, password)
    if (error) setError(error.message)
    setSubmitting(false)
  }

  return (
    <div className="login-page">
      <div className="login-brand">
        <span className="login-brand-name">PUMA</span>
        <span className="login-brand-sub">train</span>
      </div>
      <p className="login-tagline">Staff training & development</p>

      {/* Demo entry — primary CTAs */}
      {!showForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
          <button
            className="login-btn"
            style={{ background: '#4CAF50', fontSize: '15px', padding: '16px' }}
            onClick={() => handleDemo('staff')}
            disabled={submitting}
          >
            {submitting ? 'Loading…' : 'Staff View'}
          </button>
          <button
            className="login-btn"
            style={{ background: 'transparent', border: '1px solid #4CAF50', color: '#4CAF50', fontSize: '15px', padding: '16px' }}
            onClick={() => handleDemo('manager')}
            disabled={submitting}
          >
            {submitting ? 'Loading…' : 'Manager View'}
          </button>
          {error && <div className="login-error">{error}</div>}
          <button
            style={{ background: 'none', border: 'none', color: '#666', fontSize: '12px', marginTop: '8px', cursor: 'pointer' }}
            onClick={() => setShowForm(true)}
          >
            Sign in with your account
          </button>
        </div>
      )}

      {/* Regular login form — collapsed by default */}
      {showForm && (
        <form className="login-form" onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="login-input"
            autoComplete="email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-input"
            autoComplete="current-password"
            required
          />
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
          <button
            type="button"
            style={{ background: 'none', border: 'none', color: '#666', fontSize: '12px', marginTop: '8px', cursor: 'pointer' }}
            onClick={() => setShowForm(false)}
          >
            ← Back to demo
          </button>
        </form>
      )}
    </div>
  )
}
