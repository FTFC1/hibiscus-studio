import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { missionList } from '../data/missions'
import { useUser } from '../context/UserContext'
import './StaffDetail.css'

// Configurable thresholds — change here, affects all logic
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
  if (days === Infinity) return 'No activity yet'
  if (days === 0) return 'Active today'
  if (days === 1) return 'Inactive yesterday'
  return `Inactive ${days} days`
}

export default function StaffDetail() {
  const { staffId } = useParams()
  const navigate = useNavigate()
  const { role } = useUser()

  const [staffProfile, setStaffProfile] = useState(null)
  const [completions, setCompletions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (role !== 'manager') { navigate('/'); return }
    loadStaffData()
  }, [staffId])

  async function loadStaffData() {
    setLoading(true)

    const [{ data: profile }, { data: completionData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', staffId).single(),
      supabase
        .from('completions')
        .select('mission_id, score, completed_at')
        .eq('user_id', staffId)
        .not('mission_id', 'like', 'game-%')
        .order('completed_at', { ascending: false }),
    ])

    if (profile) setStaffProfile(profile)
    if (completionData) setCompletions(completionData)
    setLoading(false)
  }

  if (loading) return <div className="sd-loading"><div className="loading-spinner" /></div>
  if (!staffProfile) return null

  const completedIds = new Set(completions.map(c => c.mission_id))
  const lastActive = completions.length > 0 ? completions[0].completed_at : null
  const daysInactive = getDaysInactive(lastActive)
  const isStaffInactive = daysInactive > THRESHOLDS.inactiveDays

  const enrichedMissions = missionList.map((m, i) => {
    if (completedIds.has(m.id)) return { ...m, state: 'done' }
    const firstIncomplete = missionList.findIndex(mm => !completedIds.has(mm.id))
    if (i === firstIncomplete) return { ...m, state: isStaffInactive ? 'overdue' : 'current' }
    return { ...m, state: 'locked' }
  })

  const completedCount = enrichedMissions.filter(m => m.state === 'done').length
  const certPct = Math.round((completedCount / 6) * 100)
  const isCertified = completedCount === 6
  const currentMission = enrichedMissions.find(m => m.state === 'overdue' || m.state === 'current')
  const isOverdue = currentMission?.state === 'overdue'
  const lastActiveText = getLastActiveText(lastActive)

  // Match EXACT same dual condition as Manager Home alerts filter
  const avgScore = completions.length > 0
    ? Math.round(completions.reduce((sum, c) => sum + (c.score || 0), 0) / completions.length)
    : 0
  const isAlertState = isStaffInactive || avgScore < THRESHOLDS.minAvgScore

  return (
    <div className="sd-page">

      {/* Back nav */}
      <div className="sd-nav">
        <button className="sd-back" onClick={() => navigate(-1)}>
          <i className="ri-arrow-left-s-line" />
          Back
        </button>
      </div>

      {/* Profile row */}
      <div className="sd-profile">
        <div className={`sd-avatar ${isAlertState ? 'sd-avatar-alert' : 'sd-avatar-ok'}`}>
          {staffProfile.avatar_initials}
        </div>
        <div className="sd-profile-info">
          <div className="sd-name">{staffProfile.full_name}</div>
          <div className="sd-role">
            Store Officer · {staffProfile.store || 'Puma Lekki'}
          </div>
        </div>
      </div>

      {/* Cert bar */}
      <div className="sd-cert">
        <div className="sd-cert-track">
          <div
            className={`sd-cert-fill ${isAlertState ? 'sd-cert-fill-alert' : 'sd-cert-fill-ok'}`}
            style={{ width: `${certPct}%` }}
          />
        </div>
        <div className="sd-cert-row">
          <span className="sd-cert-fraction">{completedCount} of 6 missions complete</span>
          <span className={`sd-cert-pct ${isAlertState ? 'sd-cert-pct-alert' : 'sd-cert-pct-ok'}`}>
            {certPct}%
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="sd-stats">
        <div className="sd-stat">
          <span className="sd-stat-label">Completed</span>
          <span className="sd-stat-value">{completedCount} / 6</span>
        </div>
        <div className="sd-stat sd-stat-mid">
          <span className="sd-stat-label">Last Active</span>
          <span className={`sd-stat-value ${isStaffInactive ? 'sd-stat-alert' : ''}`}>
            {lastActiveText}
          </span>
        </div>
        <div className="sd-stat">
          <span className="sd-stat-label">Status</span>
          <span className={`sd-stat-value ${isAlertState ? 'sd-stat-alert' : ''}`}>
            {isCertified ? 'Certified' : isAlertState ? 'Needs Attention' : 'On Track'}
          </span>
        </div>
      </div>

      <div className="sd-content">

        {/* Nudge action — when staff needs attention */}
        {!isCertified && isAlertState && currentMission && (
          <div className="sd-nudge">
            <a
              className="sd-nudge-btn"
              href={`tg://msg?text=${encodeURIComponent(`Hey ${staffProfile.full_name.split(' ')[0]}, how's Mission ${currentMission.number} going? Need any help?`)}`}
            >
              <i className="ri-telegram-line sd-nudge-icon" />
              Nudge via Telegram
            </a>
          </div>
        )}

        {/* Stuck callout — only when overdue */}
        {!isCertified && isOverdue && currentMission && (
          <div className="sd-stuck">
            <i className="ri-error-warning-line sd-stuck-icon" />
            <div>
              <div className="sd-stuck-label">Stuck here</div>
              <div className="sd-stuck-mission">{currentMission.title}</div>
              <div className="sd-stuck-detail">
                Not done · {lastActiveText.toLowerCase()}
              </div>
            </div>
          </div>
        )}

        {/* Certified state */}
        {isCertified && (
          <div className="sd-certified">
            <div className="sd-certified-emoji">🎉</div>
            <div className="sd-certified-title">Fully Certified</div>
            <div className="sd-certified-sub">
              {staffProfile.full_name} completed all 6 missions
            </div>
          </div>
        )}

        {/* Mission list */}
        {!isCertified && (
          <div className="sd-missions">
            <div className="sd-missions-header">Missions</div>
            {enrichedMissions.map((m) => {
              const iconState = m.state === 'done' ? 'done'
                : m.state === 'overdue' ? 'overdue'
                : 'locked'
              return (
                <div key={m.id} className="sd-mission-row">
                  <div className={`sd-mission-icon sd-mission-icon-${iconState}`}>
                    {m.state === 'done' && <i className="ri-check-line" />}
                    {m.state === 'overdue' && <i className="ri-time-line" />}
                    {(m.state === 'current' || m.state === 'locked') && <i className="ri-lock-line" />}
                  </div>
                  <div className="sd-mission-info">
                    <div className="sd-mission-num">Mission {m.number}</div>
                    <div className={`sd-mission-title sd-mission-title-${iconState}`}>
                      {m.title}
                    </div>
                    {m.state === 'overdue' && (
                      <div className="sd-mission-sub sd-mission-sub-overdue">
                        Not done · {lastActiveText.toLowerCase()}
                      </div>
                    )}
                    {(m.state === 'locked' || m.state === 'current') && (
                      <div className="sd-mission-sub sd-mission-sub-locked">
                        Not reached yet
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
