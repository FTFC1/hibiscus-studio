import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { useUser } from '../context/UserContext'
import { supabase } from '../lib/supabase'
import './Profile.css'

const badgeTemplates = [
  { icon: 'ri-medal-fill', label: 'First Mission', check: (c) => c >= 1 },
  { icon: 'ri-flashlight-fill', label: 'Quick Learner', check: (c) => c >= 3 },
  { icon: 'ri-trophy-line', label: 'Quiz Master', check: (c, avg) => avg >= 90 },
  { icon: 'ri-vip-diamond-line', label: 'Top Seller', check: () => false },
  { icon: 'ri-shield-flash-line', label: 'Perfect Week', check: () => false },
  { icon: 'ri-fire-line', label: '7-Day Streak', check: () => false },
]

export default function Profile() {
  const { profile, role, isManager, setRole, signOut, userId } = useUser()
  const [stats, setStats] = useState({ completed: 0, avgScore: 0, gameScores: {} })

  useEffect(() => {
    if (!userId) return
    loadStats()
  }, [userId])

  async function loadStats() {
    const { data } = await supabase
      .from('completions')
      .select('score, mission_id')
      .eq('user_id', userId)
    if (data) {
      const avg = data.length > 0
        ? Math.round(data.reduce((s, c) => s + c.score, 0) / data.length)
        : 0
      // Best scores per game
      const gameScores = {}
      data.forEach(c => {
        if (c.mission_id?.startsWith('game-')) {
          const key = c.mission_id.replace('game-', '')
          if (!gameScores[key] || c.score > gameScores[key]) gameScores[key] = c.score
        }
      })
      setStats({ completed: data.length, avgScore: avg, gameScores })
    }
  }

  const initials = profile?.avatar_initials || 'U'
  const name = profile?.full_name || 'User'
  const store = profile?.store || 'PUMA Store'
  const certProgress = Math.round((stats.completed / 6) * 100)

  const badges = badgeTemplates.map(b => ({
    ...b,
    earned: b.check(stats.completed, stats.avgScore)
  }))

  return (
    <>
      <Header title="Profile" initials={initials} />
      <div className="profile-page">

        {/* User Card */}
        <div className="profile-user-card">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-name">{name}</div>
          <div className="profile-store-info">{store}</div>
          <div className="profile-role-pill">{isManager ? 'Store Manager' : 'Sales Associate'}</div>
        </div>

        {/* Certification Card */}
        <div className="profile-cert-card">
          <div className="profile-cert-label">PUMA Certified</div>
          <div className="profile-cert-title">Customer Engagement Expert</div>
          <div className="profile-cert-bar-track">
            <div className="profile-cert-bar-fill" style={{ width: `${certProgress}%` }} />
          </div>
          <div className="profile-cert-remaining">
            {6 - stats.completed > 0
              ? `${6 - stats.completed} more missions to certify`
              : 'Certification complete!'
            }
          </div>
        </div>

        {/* Stats Grid */}
        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <div className="profile-stat-value">{stats.completed}/6</div>
            <div className="profile-stat-label">Missions</div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-value">{stats.avgScore}%</div>
            <div className="profile-stat-label">Accuracy</div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-value">{certProgress}%</div>
            <div className="profile-stat-label">Certified</div>
          </div>
        </div>

        {/* Performance Bars */}
        <div className="profile-section-title">Performance</div>
        <div className="profile-perf-card">
          <div className="profile-perf-row">
            <span className="profile-perf-label">Overall</span>
            <div className="profile-perf-track">
              <div
                className={`profile-perf-fill ${stats.avgScore >= 80 ? 'perf-high' : stats.avgScore >= 50 ? 'perf-mid' : 'perf-low'}`}
                style={{ width: `${stats.avgScore}%` }}
              />
            </div>
            <span className="profile-perf-val">{stats.avgScore}%</span>
          </div>
          {Object.entries(stats.gameScores).map(([game, score]) => (
            <div key={game} className="profile-perf-row">
              <span className="profile-perf-label">{game === 'approach' ? 'Approach' : game === 'basket' ? 'Basket' : game}</span>
              <div className="profile-perf-track">
                <div
                  className={`profile-perf-fill ${score >= 80 ? 'perf-high' : score >= 50 ? 'perf-mid' : 'perf-low'}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="profile-perf-val">{score}%</span>
            </div>
          ))}
          {Object.keys(stats.gameScores).length === 0 && (
            <div className="profile-perf-empty">Play some games to see your scores here</div>
          )}
          <div className="profile-perf-legend">
            <span className="profile-perf-legend-item"><span className="perf-dot perf-dot-high" /> 80%+ Great</span>
            <span className="profile-perf-legend-item"><span className="perf-dot perf-dot-mid" /> 50-79% Improving</span>
            <span className="profile-perf-legend-item"><span className="perf-dot perf-dot-low" /> &lt;50% Needs Practice</span>
          </div>
        </div>

        {/* Badges */}
        <div className="profile-section-title">Badges</div>
        <div className="profile-badges-grid">
          {badges.map((b, i) => {
            let cls = 'profile-badge'
            if (b.earned) cls += ' profile-badge-earned'
            return (
              <div key={i} className={cls}>
                <i className={`${b.icon} profile-badge-icon`} />
                <div className="profile-badge-label">{b.label}</div>
              </div>
            )
          })}
        </div>

        {/* Your Store */}
        <div className="profile-store-card">
          <div className="profile-store-title">
            <i className="ri-store-2-line" />
            Your Store
          </div>
          <div className="profile-store-rows">
            <div className="profile-store-row">{store}</div>
            <div className="profile-store-row">{certProgress}% certified</div>
          </div>
        </div>

        {/* Role Switcher — only for managers */}
        {isManager && (
          <div className="profile-role-switcher">
            <div className="profile-section-title" style={{ marginBottom: 8 }}>View Mode</div>
            <div className="profile-role-options">
              <button
                className={`profile-role-btn${role === 'staff' ? ' profile-role-btn-active' : ''}`}
                onClick={() => setRole('staff')}
              >
                <i className="ri-user-3-line" />
                <span>Sales Associate</span>
              </button>
              <button
                className={`profile-role-btn${role === 'manager' ? ' profile-role-btn-active' : ''}`}
                onClick={() => setRole('manager')}
              >
                <i className="ri-team-line" />
                <span>Manager</span>
              </button>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="profile-settings">
          <div className="profile-settings-item">
            <i className="ri-notification-3-line" />
            <span>Notifications</span>
          </div>
          <div className="profile-settings-item">
            <i className="ri-customer-service-2-line" />
            <span>Support</span>
          </div>
          <div className="profile-settings-item profile-settings-item-logout" onClick={signOut}>
            <i className="ri-logout-box-r-line" />
            <span>Log Out</span>
          </div>
        </div>

      </div>
    </>
  )
}
