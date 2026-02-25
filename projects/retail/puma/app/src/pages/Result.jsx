import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { missions } from '../data/missions'
import './Result.css'

// Ring math: r=66, circ=414.69
// dashoffset = 414.69 × (1 - score/100)
// end-cap dot: x = 80 + 66×sin(pct×360°), y = 80 - 66×cos(pct×360°)
const CIRC = 414.69
const R = 66
const CX = 80
const CY = 80

function getDotPos(score) {
  const pct = score / 100
  const angle = pct * 2 * Math.PI
  return {
    x: CX + R * Math.sin(angle),
    y: CY - R * Math.cos(angle)
  }
}

function getTheme(score) {
  if (score === 100) return { color: '#6ECC5B', label: 'Perfect Score', emoji: '⚡', cta: 'Next Mission', badge: true }
  if (score >= 67) return { color: '#3A7D44', label: 'Mission Complete', emoji: '✓', cta: 'Next Mission', badge: false }
  return { color: '#F59E0B', label: 'Mission Incomplete', emoji: '✗', cta: 'Try Again', badge: false, fail: true }
}

export default function Result() {
  const navigate = useNavigate()
  const { missionId } = useParams()
  const location = useLocation()
  const { score = 0, wrongAnswers = [] } = location.state || {}

  const mission = missions[missionId]
  const theme = getTheme(score)
  const dashOffset = CIRC * (1 - score / 100)
  const dot = getDotPos(score)
  const totalQuestions = mission?.quiz?.length || 3
  const correctCount = Math.round((score / 100) * totalQuestions)

  // Progress dots — all green on pass, all amber on fail
  const dotColor = theme.fail ? '#F59E0B' : theme.color

  const handleCta = () => {
    if (theme.fail) {
      // Try again — go back to lesson
      navigate(`/lesson/${missionId}`)
    } else {
      // Next mission
      const num = mission?.number || 1
      const nextId = `mission-${num + 1}`
      if (missions[nextId]) {
        navigate(`/lesson/${nextId}`)
      } else {
        navigate('/')
      }
    }
  }

  return (
    <div className="result-page">
      <header className="result-header">
        <button className="nav-btn back-btn" onClick={() => navigate('/')}>
          <i className="ri-arrow-left-line"></i>
        </button>
        <div className="progress-dots-inline">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className="dot dot-done"
              style={{ background: dotColor, borderColor: dotColor }}
            />
          ))}
        </div>
        <div style={{ width: 80 }} />
      </header>

      <div className="result-body">
        {/* Ring */}
        <div className="result-ring-wrap">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Track */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#111111" strokeWidth="5" />
            {/* Arc */}
            <circle
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke={theme.color}
              strokeWidth="5"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90, ${CX}, ${CY})`}
            />
            {/* End-cap dot */}
            {score > 0 && (
              <circle cx={dot.x} cy={dot.y} r="4.5" fill={theme.color} />
            )}
            {/* Score text */}
            <text x={CX} y={CY - 8} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="28" fontWeight="700" fontFamily="Inter, sans-serif">
              {score}%
            </text>
            <text x={CX} y={CY + 10} textAnchor="middle" dominantBaseline="middle" fill="#666" fontSize="11" fontFamily="Inter, sans-serif">
              {correctCount}/{totalQuestions} correct
            </text>
          </svg>
        </div>

        {/* Status */}
        <div className="result-status">
          <span className="result-status-icon" style={{ color: theme.color }}>{theme.emoji}</span>
          <h2 className="result-status-label" style={{ color: theme.color }}>{theme.label}</h2>
          <p className="result-mission-title">{mission?.title}</p>
        </div>

        {/* Wrong answer review (fail state only) */}
        {theme.fail && wrongAnswers.length > 0 && (
          <div className="result-wrong-section">
            <p className="result-wrong-heading">Review your answers</p>
            {wrongAnswers.map((wa, i) => (
              <div key={i} className="result-wrong-card">
                <p className="result-wrong-question">{wa.question}</p>
                <div className="result-answer-row">
                  <span className="result-answer result-answer-wrong">
                    <i className="ri-close-line"></i> {wa.selectedText}
                  </span>
                  <span className="result-answer result-answer-correct">
                    <i className="ri-check-line"></i> {wa.correctText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Badge card (100% only) */}
        {theme.badge && (
          <div className="result-badge-card">
            <div className="result-badge-icon-wrap" style={{ background: theme.color }}>
              <span style={{ fontSize: 20 }}>⚡</span>
            </div>
            <div>
              <p className="result-badge-name">Speed Opener</p>
              <p className="result-badge-desc">Mastered the 5-30-60 Rule</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <footer className="result-footer">
        <button
          className="result-cta-btn"
          style={{ background: theme.color }}
          onClick={handleCta}
        >
          {theme.cta} <span style={{ fontSize: 18 }}>&rarr;</span>
        </button>
        <p className="result-nav-hint">Lesson navigation: swipe ← →</p>
      </footer>
    </div>
  )
}
