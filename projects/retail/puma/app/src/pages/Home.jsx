import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { missionList } from '../data/missions'
import { useUser } from '../context/UserContext'
import { supabase } from '../lib/supabase'
import { getDueMissions } from '../lib/spacedRepetition'
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

function formatDate() {
  const d = new Date()
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

// SVG progress ring component
function ProgressRing({ current, total }) {
  const r = 34
  const circ = 2 * Math.PI * r // ~213.6
  const progress = total > 0 ? current / total : 0
  const offset = circ - progress * circ

  return (
    <div className="ring-wrap">
      <svg viewBox="0 0 80 80">
        <circle className="ring-bg" cx="40" cy="40" r={r} />
        <circle
          className="ring-fill"
          cx="40"
          cy="40"
          r={r}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-text">
        <div className="ring-num">{current}</div>
        <div className="ring-label">of {total}</div>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { role, profile, userId } = useUser()

  const [completedIds, setCompletedIds] = useState(new Set())
  const [dueMissions, setDueMissions] = useState([])
  const [staffData, setStaffData] = useState([])
  const [recentBuzz, setRecentBuzz] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [loadError, setLoadError] = useState(null)

  // Stat grid data
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [quizAccuracy, setQuizAccuracy] = useState(null)
  const [dayStreak, setDayStreak] = useState(0)

  // Manager filter state
  const [activeFilter, setActiveFilter] = useState(null)

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    if (!userId) return
    loadData()
  }, [userId, role])

  async function loadData() {
    setLoadingData(true)
    setLoadError(null)

    try {
      // Load user's own completions (with score + timestamp for spaced repetition)
      const { data: myCompletions, error: compErr } = await supabase
        .from('completions')
        .select('mission_id, score, completed_at')
        .eq('user_id', userId)
      if (compErr) throw compErr
      if (myCompletions) {
        setCompletedIds(new Set(myCompletions.map(c => c.mission_id)))
        setDueMissions(getDueMissions(myCompletions))

        // Calculate games played
        const games = myCompletions.filter(c => c.mission_id?.startsWith('game-'))
        setGamesPlayed(games.length)

        // Calculate quiz accuracy (avg score of non-game completions)
        const quizScores = myCompletions.filter(c => !c.mission_id?.startsWith('game-') && c.score != null)
        if (quizScores.length > 0) {
          const avg = Math.round(quizScores.reduce((sum, c) => sum + Number(c.score), 0) / quizScores.length)
          setQuizAccuracy(avg)
        }
      }

      // Calculate day streak from practice_logs
      if (role === 'staff') {
        const { data: practiceLogs } = await supabase
          .from('practice_logs')
          .select('date')
          .eq('user_id', userId)
          .order('date', { ascending: false })

        if (practiceLogs && practiceLogs.length > 0) {
          const uniqueDays = [...new Set(practiceLogs.map(l => l.date))]
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const daySet = new Set(uniqueDays)
          let streak = 0
          for (let i = 0; i < 30; i++) {
            const d = new Date(today)
            d.setDate(d.getDate() - i)
            const key = d.toISOString().split('T')[0]
            if (daySet.has(key)) streak++
            else break
          }
          setDayStreak(streak)
        }
      }

      if (role === 'manager') {
        const { data: dashboard, error: dashErr } = await supabase
          .from('manager_dashboard')
          .select('*')
        if (dashErr) throw dashErr
        if (dashboard) setStaffData(dashboard)
      }

      // Load recent completions for buzz
      const { data: recent, error: buzzErr } = await supabase
        .from('completions')
        .select('*, profiles(full_name, avatar_initials)')
        .order('completed_at', { ascending: false })
        .limit(3)
      if (buzzErr) throw buzzErr
      if (recent) {
        setRecentBuzz(recent.map(r => ({
          initial: r.profiles?.avatar_initials?.[0] || '?',
          name: r.profiles?.full_name || 'Unknown',
          action: `completed ${missionList.find(m => m.id === r.mission_id)?.title || r.mission_id}`,
          time: getTimeAgo(r.completed_at),
          isDemoData: r.is_demo
        })))
      }
    } catch (err) {
      console.error('Home data load failed:', err)
      setLoadError(err?.message || 'Failed to load data')
    } finally {
      setLoadingData(false)
    }
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
    const firstIncomplete = missionList.findIndex(mm => !completedIds.has(mm.id))
    if (i === firstIncomplete) return { ...m, status: 'current' }
    return { ...m, status: 'locked' }
  })

  const currentMission = enrichedMissions.find(m => m.status === 'current')
  const completedMissions = enrichedMissions.filter(m => m.status === 'completed')
  const completedCount = completedMissions.length
  const totalMissions = enrichedMissions.length

  // Manager: categorize staff using configurable thresholds
  const certified = staffData.filter(s => Number(s.missions_completed) >= totalMissions)
  const alerts = staffData.filter(s =>
    Number(s.missions_completed) < totalMissions && (
      getDaysInactive(s.last_active) > THRESHOLDS.inactiveDays ||
      Number(s.avg_score) < THRESHOLDS.minAvgScore
    )
  )
  const onTrack = staffData.filter(s =>
    Number(s.missions_completed) < totalMissions &&
    getDaysInactive(s.last_active) <= THRESHOLDS.inactiveDays &&
    Number(s.avg_score) >= THRESHOLDS.minAvgScore
  )
  const teamCertPct = staffData.length > 0
    ? Math.round(staffData.reduce((sum, s) => sum + Number(s.cert_progress || 0), 0) / staffData.length)
    : 0

  const initials = profile?.avatar_initials || 'U'

  // Manager: get staff status for card styling
  function getStaffStatus(s) {
    if (Number(s.missions_completed) >= totalMissions) return 'certified'
    if (getDaysInactive(s.last_active) > THRESHOLDS.inactiveDays || Number(s.avg_score) < THRESHOLDS.minAvgScore) return 'atrisk'
    return 'ontrack'
  }

  // Manager: filter staff by tile tap
  function handleTileFilter(status) {
    setActiveFilter(prev => prev === status ? null : status)
  }

  // Manager: get filtered staff list
  function getFilteredStaff() {
    const allStaff = staffData.map(s => ({ ...s, _status: getStaffStatus(s) }))
    // Sort: certified first, then on track, then at risk
    allStaff.sort((a, b) => {
      const order = { certified: 0, ontrack: 1, atrisk: 2 }
      return (order[a._status] || 1) - (order[b._status] || 1)
    })
    if (!activeFilter) return allStaff
    return allStaff.filter(s => s._status === activeFilter)
  }

  if (loadError) {
    return (
      <>
        <Header brandSplit={['PUMA', 'Training']} initials={initials} />
        <div className="error-card">
          <i className="ri-wifi-off-line" aria-hidden="true" style={{ fontSize: 32, color: '#FF6464' }} />
          <p style={{ color: '#ccc', margin: '12px 0' }}>{loadError}</p>
          <button className="hero-cta" onClick={loadData} style={{ width: 'auto', padding: '10px 24px' }}>
            Retry
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Header brandSplit={['PUMA', 'Training']} initials={initials} />

      {role === 'staff' ? (
        <>
          {/* Today heading + date */}
          <div className="today-section">
            <div className="today-heading">Today</div>
            <div className="today-date">{formatDate()}</div>
          </div>

          {/* STATE: New User (0 completed) */}
          {completedCount === 0 && currentMission && (
            <div className="welcome-card">
              <div className="welcome-icon"><i className="ri-rocket-2-line"></i></div>
              <div className="welcome-title">Ready to start?</div>
              <div className="welcome-desc">
                {totalMissions} missions to master selling PUMA.<br />Each takes about 5 minutes.
              </div>
              <button
                className="welcome-cta"
                onClick={() => navigate(`/lesson/${currentMission.id}`)}
              >
                <i className="ri-play-fill"></i> Start Mission 1
              </button>
            </div>
          )}

          {/* STATE: All Complete */}
          {completedCount === totalMissions && (
            <div className="all-complete">
              <div className="all-complete-icon"><i className="ri-trophy-line"></i></div>
              <div className="all-complete-title">All missions complete</div>
              <div className="all-complete-desc">Keep your skills sharp in Games</div>
              <button
                className="all-complete-cta"
                onClick={() => navigate('/games')}
              >
                <i className="ri-gamepad-line"></i> Go to Games
              </button>
            </div>
          )}

          {/* STATE: In Progress — Hero Mission Card */}
          {completedCount > 0 && currentMission && (
            <div className="hero-mission">
              <ProgressRing current={currentMission.number} total={totalMissions} />
              <div className="hero-info">
                <div className="hero-module-label">
                  Module 1 &middot; Mission {currentMission.number}
                </div>
                <div className="hero-title">{currentMission.title}</div>
                <div className="hero-desc">{currentMission.description}</div>
                <button
                  className="hero-cta"
                  onClick={() => navigate(`/lesson/${currentMission.id}`)}
                >
                  <i className="ri-play-fill"></i> Continue
                </button>
              </div>
            </div>
          )}

          {/* 2x2 Stat Grid */}
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon stat-icon-green"><i className="ri-book-open-line"></i></div>
              <div className={`stat-value${completedCount === 0 ? ' stat-value-empty' : ''}`}>
                {completedCount}
              </div>
              <div className="stat-label">Missions done</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-purple"><i className="ri-gamepad-line"></i></div>
              <div className={`stat-value${gamesPlayed === 0 ? ' stat-value-empty' : ''}`}>
                {gamesPlayed}
              </div>
              <div className="stat-label">Games played</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-orange"><i className="ri-bar-chart-2-line"></i></div>
              <div className={`stat-value${quizAccuracy === null ? ' stat-value-empty' : ''}`}>
                {quizAccuracy !== null ? `${quizAccuracy}%` : '--'}
              </div>
              <div className="stat-label">Quiz accuracy</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-blue"><i className="ri-fire-line"></i></div>
              <div className={`stat-value${dayStreak === 0 ? ' stat-value-empty' : ''}`}>
                {dayStreak}
              </div>
              <div className="stat-label">Day streak</div>
            </div>
          </div>

          {/* Review Due Card */}
          {dueMissions.length > 0 && (
            <div
              className="review-due-card"
              onClick={() => navigate(`/lesson/${dueMissions[0].missionId}`, { state: { isReview: true } })}
              role="button"
              tabIndex={0}
              aria-label={`Review ${missionList.find(m => m.id === dueMissions[0].missionId)?.title || 'mission'}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/lesson/${dueMissions[0].missionId}`, { state: { isReview: true } }) }}
            >
              <div className="review-due-top">
                <i className="ri-time-line review-due-icon"></i>
                <div className="review-due-info">
                  <div className="review-due-title">
                    {missionList.find(m => m.id === dueMissions[0].missionId)?.title || 'Mission'}
                  </div>
                  <div className="review-due-sub">
                    Last reviewed {dueMissions[0].daysSince}d ago
                  </div>
                </div>
              </div>
              <button className="review-due-cta">Review Now</button>
              {dueMissions.length > 1 && (
                <div className="review-due-more">+{dueMissions.length - 1} more review{dueMissions.length > 2 ? 's' : ''} due</div>
              )}
            </div>
          )}

          {/* Team Pulse */}
          {recentBuzz.length > 0 && (
            <div className="team-pulse">
              <i className="ri-team-line team-pulse-icon"></i>
              <span className="team-pulse-text">
                <strong>{recentBuzz[0].name}</strong> {recentBuzz[0].action} &middot; {recentBuzz[0].time}
              </span>
            </div>
          )}

          {/* Completed Chips */}
          {completedMissions.length > 0 && (
            <div className="completed-section">
              <div className="completed-heading">Completed</div>
              <div className="completed-chips">
                {completedMissions.map(m => (
                  <div
                    key={m.id}
                    className="completed-chip"
                    onClick={() => navigate(`/lesson/${m.id}`)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Review ${m.title}`}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/lesson/${m.id}`) }}
                  >
                    <i className="ri-check-line"></i> {m.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* ══════════════════════════════════
             MANAGER VIEW
             ══════════════════════════════════ */}

          {/* Hero KPI */}
          <div className="mgr-hero-kpi">
            <div className={`mgr-hero-number${teamCertPct < 50 ? ' amber' : ''}`}>
              {teamCertPct}%
            </div>
            <div className="mgr-hero-label">Team certification progress</div>
          </div>

          {/* 3 Metric Tiles */}
          <div className="mgr-metric-tiles">
            <div
              className={`mgr-metric-tile tile-green${activeFilter === 'ontrack' ? ' tile-active' : ''}`}
              onClick={() => handleTileFilter('ontrack')}
            >
              <div className="mgr-tile-value green">{onTrack.length}</div>
              <div className="mgr-tile-label">On Track</div>
            </div>
            <div
              className={`mgr-metric-tile tile-danger${activeFilter === 'atrisk' ? ' tile-active' : ''}`}
              onClick={() => handleTileFilter('atrisk')}
            >
              <div className="mgr-tile-value danger">{alerts.length}</div>
              <div className="mgr-tile-label">At Risk</div>
            </div>
            <div
              className={`mgr-metric-tile tile-gold${activeFilter === 'certified' ? ' tile-active' : ''}`}
              onClick={() => handleTileFilter('certified')}
            >
              <div className="mgr-tile-value gold">{certified.length}</div>
              <div className="mgr-tile-label">Certified</div>
            </div>
          </div>

          {/* Deadline bar (placeholder — could be dynamic) */}
          <div className="mgr-deadline-bar">
            <i className="ri-timer-line"></i>
            <span>Training deadline approaching</span>
          </div>

          {/* Staff list */}
          <div className="mgr-section-label">
            {activeFilter
              ? `${activeFilter === 'ontrack' ? 'On Track' : activeFilter === 'atrisk' ? 'At Risk' : 'Certified'} (${getFilteredStaff().length})`
              : `Team (${staffData.length} staff)`
            }
          </div>
          <div className="mgr-staff-list">
            {getFilteredStaff().map(s => {
              const status = s._status
              const activeText = getLastActiveText(s.last_active)
              const isInactive = getDaysInactive(s.last_active) > THRESHOLDS.inactiveDays
              const progress = totalMissions > 0
                ? Math.round((Number(s.missions_completed) / totalMissions) * 100)
                : 0

              return (
                <div
                  key={s.user_id}
                  className={`mgr-staff-card card-${status === 'atrisk' ? 'alert' : status === 'certified' ? 'certified' : 'ok'}`}
                  onClick={() => navigate(`/staff/${s.user_id}`)}
                >
                  <div className={`mgr-staff-avatar av-${status === 'atrisk' ? 'alert' : status === 'certified' ? 'certified' : 'ok'}`}>
                    {s.avatar_initials}
                  </div>
                  <div className="mgr-staff-info">
                    <div className="mgr-staff-name-row">
                      <div className="mgr-staff-name">{s.full_name}</div>
                      <div className={`mgr-chip mgr-chip-${status === 'atrisk' ? 'atrisk' : status === 'certified' ? 'certified' : 'ontrack'}`}>
                        {status === 'atrisk' && <i className="ri-error-warning-line"></i>}
                        {status === 'certified' && <i className="ri-shield-check-line"></i>}
                        {status === 'atrisk' ? 'At Risk' : status === 'certified' ? 'Certified' : 'On Track'}
                      </div>
                    </div>
                    <div className="mgr-staff-detail">
                      <span>{s.missions_completed}/{totalMissions} missions</span>
                      <span>&middot;</span>
                      <span className={isInactive ? 'mgr-staff-detail-alert' : ''}>
                        {activeText}
                      </span>
                    </div>
                    <div className="mgr-staff-progress">
                      <div
                        className={`mgr-staff-progress-fill fill-${status === 'atrisk' ? 'danger' : status === 'certified' ? 'gold' : 'green'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mgr-staff-right">
                    <div
                      className="mgr-staff-score"
                      style={status === 'atrisk' ? { color: 'var(--alert-red)' } : status === 'certified' ? { color: 'var(--progress-gold)' } : {}}
                    >
                      {s.avg_score ? `${Math.round(Number(s.avg_score))}%` : '--'}
                    </div>
                    <i className="ri-arrow-right-s-line mgr-staff-chevron"></i>
                  </div>
                </div>
              )
            })}
          </div>

          {staffData.length === 0 && !loadingData && (
            <div className="mgr-all-clear">
              <i className="ri-shield-check-line mgr-all-clear-icon" />
              <div>
                <div className="mgr-all-clear-title">No staff data</div>
                <div className="mgr-all-clear-sub">Staff will appear here once they join</div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
