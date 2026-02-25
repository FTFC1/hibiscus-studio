import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { missionList } from '../data/missions'
import { useUser } from '../context/UserContext'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import './Home.css'

// Configurable thresholds — change here, affects all manager logic
const THRESHOLDS = {
  inactiveDays: 2,
  minAvgScore: 70,
}

function getDaysInactive(dateStr) {
  if (!dateStr) return Infinity
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
}

function getLastActiveText(dateStr) {
  const days = getDaysInactive(dateStr)
  if (days === Infinity) return 'No activity'
  if (days === 0) return 'Active today'
  if (days === 1) return 'Active yesterday'
  return `Inactive ${days} days`
}

export default function Home() {
  const navigate = useNavigate()
  const { role, profile, userId } = useUser()

  const [completedIds, setCompletedIds] = useState(new Set())
  const [staffData, setStaffData] = useState([])
  const [recentBuzz, setRecentBuzz] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    if (!userId) return
    loadData()
  }, [userId, role])

  async function loadData() {
    setLoadingData(true)

    // Load user's own completions
    const { data: myCompletions } = await supabase
      .from('completions')
      .select('mission_id')
      .eq('user_id', userId)
    if (myCompletions) {
      setCompletedIds(new Set(myCompletions.map(c => c.mission_id)))
    }

    if (role === 'manager') {
      // Load manager dashboard
      const { data: dashboard } = await supabase
        .from('manager_dashboard')
        .select('*')
      if (dashboard) setStaffData(dashboard)
    }

    // Load recent completions for buzz
    const { data: recent } = await supabase
      .from('completions')
      .select('*, profiles(full_name, avatar_initials)')
      .order('completed_at', { ascending: false })
      .limit(3)
    if (recent) {
      setRecentBuzz(recent.map(r => ({
        initial: r.profiles?.avatar_initials?.[0] || '?',
        name: r.profiles?.full_name || 'Unknown',
        action: `completed ${missionList.find(m => m.id === r.mission_id)?.title || r.mission_id}`,
        time: getTimeAgo(r.completed_at),
        isDemoData: r.is_demo
      })))
    }

    setLoadingData(false)
  }

  function getTimeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  // Derive mission statuses from DB completions
  const enrichedMissions = missionList.map((m, i) => {
    if (completedIds.has(m.id)) return { ...m, status: 'completed' }
    // First non-completed mission is current
    const firstIncomplete = missionList.findIndex(mm => !completedIds.has(mm.id))
    if (i === firstIncomplete) return { ...m, status: 'current' }
    return { ...m, status: 'locked' }
  })

  const currentMission = enrichedMissions.find(m => m.status === 'current')
  const completedMissions = enrichedMissions.filter(m => m.status === 'completed')
  const completedCount = completedMissions.length
  const totalMissions = enrichedMissions.length

  // Manager: categorize staff using configurable thresholds
  const alerts = staffData.filter(s =>
    getDaysInactive(s.last_active) > THRESHOLDS.inactiveDays ||
    Number(s.avg_score) < THRESHOLDS.minAvgScore
  )
  const onTrack = staffData.filter(s =>
    getDaysInactive(s.last_active) <= THRESHOLDS.inactiveDays &&
    Number(s.avg_score) >= THRESHOLDS.minAvgScore
  )
  const teamCertPct = staffData.length > 0
    ? Math.round(staffData.reduce((sum, s) => sum + Number(s.cert_progress || 0), 0) / staffData.length)
    : 0

  const initials = profile?.avatar_initials || 'U'

  return (
    <>
      <Header brandSplit={['PUMA', 'Training']} initials={initials} />

      {role === 'staff' ? (
        <>
          {/* Hero Card */}
          {currentMission && (
            <div className="hero-card">
              <div className="hero-module-label">
                Module 1 · Mission {currentMission.number}
              </div>
              <div className="hero-title">{currentMission.title}</div>
              <div className="hero-desc">{currentMission.description}</div>

              <div className="hero-stats">
                <div className="hero-stat-pill">
                  <i className="ri-fire-line hero-stat-fire"></i> {completedCount} done
                </div>
                <div className="hero-stat-pill">
                  {completedCount}/{totalMissions} missions
                </div>
              </div>

              <button
                className="hero-cta"
                onClick={() => navigate(`/lesson/${currentMission.id}`)}
              >
                START SESSION
              </button>
            </div>
          )}

          {!currentMission && completedCount === totalMissions && (
            <div className="hero-card">
              <div className="hero-module-label">Module 1</div>
              <div className="hero-title">All Missions Complete</div>
              <div className="hero-desc">You've finished all missions. Review them below or check Games.</div>
            </div>
          )}

          {/* Team Pulse */}
          {recentBuzz.length > 0 && (
            <div className="team-pulse">
              <i className="ri-team-line team-pulse-icon"></i>
              <span className="team-pulse-text">
                {recentBuzz[0].name} {recentBuzz[0].action} · {recentBuzz[0].time}
              </span>
            </div>
          )}

          {/* Segmented Progress Bar */}
          <div className="progress-section">
            <div className="progress-segments">
              {enrichedMissions.map((m) => (
                <div
                  key={m.id}
                  className={`progress-seg ${
                    m.status === 'completed'
                      ? 'progress-seg-done'
                      : m.status === 'current'
                      ? 'progress-seg-current'
                      : 'progress-seg-locked'
                  }`}
                />
              ))}
            </div>
            <div className="progress-label">
              {completedCount}/{totalMissions} missions complete
            </div>
          </div>

          {/* Completed History */}
          {completedMissions.length > 0 && (
            <div className="completed-section">
              <div className="completed-title">Completed</div>
              <div className="completed-list">
                {completedMissions.map(m => (
                  <div
                    key={m.id}
                    className="completed-item"
                    onClick={() => navigate(`/lesson/${m.id}`)}
                  >
                    <div className="completed-check">
                      <i className="ri-check-line"></i>
                    </div>
                    <div className="completed-name">{m.title}</div>
                    <div className="completed-time">{m.readTime}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Manager View — Admin Dashboard Principle: Alerts > On Track */}

          {/* Store + team cert strip */}
          <div className="mgr-header-strip">
            <span className="mgr-store-name">Puma Lekki</span>
            <div className="mgr-cert-strip">
              <div className="mgr-cert-bar-mini">
                <div className="mgr-cert-bar-fill" style={{ width: `${teamCertPct}%` }} />
              </div>
              <span className="mgr-cert-pct">{teamCertPct}%</span>
            </div>
          </div>

          {/* NEEDS ATTENTION — first content block */}
          <div className="mgr-section">
            {alerts.length > 0 ? (
              <div className="mgr-alert-card">
                <div className="mgr-section-header mgr-alert-header">
                  <span className="mgr-dot mgr-dot-red" />
                  Needs Attention
                </div>
                {alerts.map(s => {
                  const activeText = getLastActiveText(s.last_active)
                  const isInactive = getDaysInactive(s.last_active) > THRESHOLDS.inactiveDays
                  return (
                    <div
                      key={s.user_id}
                      className="mgr-card mgr-card-alert mgr-card-tappable"
                      onClick={() => navigate(`/staff/${s.user_id}`)}
                    >
                      <div className="mgr-avatar mgr-avatar-alert">{s.avatar_initials}</div>
                      <div className="mgr-info">
                        <div className="mgr-name">{s.full_name}</div>
                        <div className="mgr-detail">
                          <span>{s.missions_completed}/6 missions</span>
                          <span>·</span>
                          <span className={isInactive ? 'mgr-detail-alert' : ''}>
                            {activeText}
                          </span>
                        </div>
                      </div>
                      <i className="ri-arrow-right-s-line mgr-chevron" />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="mgr-all-clear">
                <i className="ri-shield-check-line mgr-all-clear-icon" />
                <div>
                  <div className="mgr-all-clear-title">All clear</div>
                  <div className="mgr-all-clear-sub">Everyone is on track today</div>
                </div>
              </div>
            )}
          </div>

          {/* ON TRACK */}
          {onTrack.length > 0 && (
            <div className="mgr-section">
              <div className="mgr-section-header mgr-win-header">
                <span className="mgr-dot mgr-dot-green" />
                On Track
              </div>
              {onTrack.map(s => (
                <div
                  key={s.user_id}
                  className="mgr-card mgr-card-tappable"
                  onClick={() => navigate(`/staff/${s.user_id}`)}
                >
                  <div className="mgr-avatar mgr-avatar-on-track">{s.avatar_initials}</div>
                  <div className="mgr-info">
                    <div className="mgr-name">{s.full_name}</div>
                    <div className="mgr-detail">
                      <span>{s.missions_completed}/6 missions</span>
                      <span>·</span>
                      <span>{getLastActiveText(s.last_active)}</span>
                    </div>
                  </div>
                  <i className="ri-arrow-right-s-line mgr-chevron" />
                </div>
              ))}
            </div>
          )}

          {/* Full team — scoped out, coming soon */}
          <div className="mgr-full-team-link">
            Full team view
            <span className="mgr-coming-soon">coming soon</span>
          </div>
        </>
      )}
    </>
  )
}
