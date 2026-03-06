import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', padding: '24px', background: '#080808', color: '#fff',
          fontFamily: "'Inter', sans-serif", textAlign: 'center'
        }}>
          <i className="ri-error-warning-line" style={{ fontSize: 48, color: '#FF6464', marginBottom: 16 }} />
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 8px' }}>Something went wrong</h2>
          <p style={{ fontSize: 14, color: '#999', margin: '0 0 24px', maxWidth: 300 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '12px 24px', borderRadius: 12, border: 'none',
              background: 'var(--green, #3A7D44)', color: '#fff',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              minHeight: 44
            }}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
