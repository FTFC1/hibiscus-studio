import { useState, useEffect, useOptimistic } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useUser } from '../context/UserContext'
import { supabase } from '../lib/supabase'
import './Practice.css'

// Course content — source of truth
const missionList = [
  {
    id: 'mission-1', name: 'The 5-30-60 Rule',
    description: 'Acknowledge in 5s, approach in 30s, engage by 60s.',
    tasks: [
      'Count to 5 every time a customer walks in — eye contact before you hit 5',
      'Set a 60-second mental timer — approach if you haven\'t yet',
      'Try "What brings you in today?" instead of "Can I help you?"',
      'End of shift: count how many you greeted within 30 seconds',
    ],
    reference: {
      rule: '5s → Acknowledge | 30s → Approach | 60s → Engage',
      phrases: ['"Hey! Welcome. What brings you in today?"', '"I love those — looking for something similar?"', '"Shopping for yourself or a gift?"'],
      watchFor: '"Just looking" → "No problem, I\'m right here" — stay visible, check back in 3 min',
    },
  },
  {
    id: 'mission-2', name: 'Kill "Can I Help You?"',
    description: '5 warm openings that invite conversation instead of "just looking."',
    tasks: [
      'Pick ONE warm opening to use all day',
      'If short answer, follow up: "What kind of [X] are you looking for?"',
      'Count how many engage vs say "just looking"',
      'End of day: write down your engagement percentage',
    ],
    reference: {
      rule: 'Open-ended questions only. Never give them a yes/no exit.',
      phrases: ['"What brings you in today?"', '"Looking for something specific, or just seeing what\'s new?"', '"That one\'s popular — want to try it?"'],
      watchFor: '90% say "just looking" to closed questions. 60%+ engage with warm openings.',
    },
  },
  {
    id: 'mission-3', name: 'The 70/30 Rule',
    description: 'Customer talks 70%, you talk 30%. Listen more, sell more.',
    tasks: [
      'Pick 3 customers — use all 4 questions in order',
      'Count: are they talking more than you?',
      'Only show products AFTER all 4 questions answered',
      'Write down what you learned at end of shift',
    ],
    reference: {
      rule: '4 questions: Occasion → Problem → Priority → Decision',
      phrases: ['"What are you buying for?"', '"What\'s not working now?"', '"What matters most?"', '"Buying today or browsing?"'],
      watchFor: 'If you\'re doing most of the talking, you\'re doing it wrong.',
    },
  },
  {
    id: 'mission-4', name: '"I\'ll Think About It"',
    description: 'Handle the most common objection without being pushy.',
    tasks: [
      'Pick 3 customers who say "I\'ll think about it"',
      'Use: "That\'s fair — what\'s making you think it over?"',
      'Listen for the REAL objection behind the words',
      'How many reopened after you used the bridge phrase?',
    ],
    reference: {
      rule: '3 steps: Acknowledge → Probe → Bridge',
      phrases: ['"That\'s totally fair. What\'s making you think it over?"', '"Is it the price, or not sure it\'s right?"', '"Want me to hold this for 24 hours?"'],
      watchFor: '9 out of 10 who say this never come back. Don\'t surrender, don\'t push.',
    },
  },
  {
    id: 'mission-5', name: '"It\'s Too Expensive"',
    description: 'Handle price objections without discounting.',
    tasks: [
      'When 3 customers say "too expensive" — ask their budget first',
      'Anchor value to THEIR specific need, not generic brand talk',
      'Show cheaper option side-by-side (often sells the premium)',
      'End of day: how many held full price?',
    ],
    reference: {
      rule: '4 steps: Ask Budget → Anchor Value → Show Down → Payment Flex',
      phrases: ['"What were you thinking price-wise?"', '"The reason this costs more is [their specific need]"', '"Want to see the cheaper version side-by-side?"'],
      watchFor: 'Price objections = buying signals. Don\'t discount until you\'ve tried all 4 steps.',
    },
  },
  {
    id: 'mission-6', name: 'Exit Protocol',
    description: 'Capture info from non-buyers. Today\'s browser = tomorrow\'s buyer.',
    tasks: [
      'Capture info from 3 customers who leave without buying',
      'Use: "Before you go — can I grab your name and number?"',
      'Set a specific trigger: "I\'ll text you if [sale/restock]"',
      'End with: "I\'m [your name], nice meeting you!"',
    ],
    reference: {
      rule: 'Capture: Name + Number + Need + Trigger. Follow up in 3-7 days.',
      phrases: ['"No problem! Before you go..."', '"I\'ll text you if this goes on sale"', '"I\'ll let you know when your size is back"'],
      watchFor: '40% would buy later if you follow up. 0% come back if you don\'t capture info.',
    },
  },
]

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function getShiftPhase() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'end-of-day'
}

function isBehind(tasksDone, shiftPhase) {
  if (shiftPhase === 'morning') return false
  return tasksDone === 0
}

// ── Root: route by role ──────────────────────────────────────
export default function Practice() {
  const { profile, role } = useUser()
  const navigate = useNavigate()
  const isManager = role === 'manager'

  return isManager
    ? <ManagerPractice profile={profile} navigate={navigate} />
    : <StaffPractice profile={profile} />
}

// ── Staff View ───────────────────────────────────────────────
function StaffPractice({ profile }) {
  const [missionsCompleted, setMissionsCompleted] = useState(null)
  const [todayLogs, setTodayLogs] = useState([])
  const [refOpen, setRefOpen] = useState(false)
  // StaffPractice intentionally does NOT subscribe to Supabase Realtime.
  // Realtime is manager-only. Staff sync via re-fetch after each write.
  // This avoids the Realtime + optimistic update race condition (R10).

  const [optimisticLogs, applyOptimistic] = useOptimistic(
    todayLogs,
    (state, { mission_id, task_idx, checked }) => {
      if (checked) {
        const already = state.some(l => l.mission_id === mission_id && l.task_idx === task_idx)
        return already ? state : [...state, { mission_id, task_idx }]
      }
      return state.filter(l => !(l.mission_id === mission_id && l.task_idx === task_idx))
    }
  )

  useEffect(() => {
    if (!profile?.id) return
    const today = getToday()

    supabase
      .from('manager_dashboard')
      .select('missions_completed')
      .eq('user_id', profile.id)
      .single()
      .then(({ data }) => setMissionsCompleted(data?.missions_completed ?? 0))

    supabase
      .from('practice_logs')
      .select('mission_id, task_idx')
      .eq('user_id', profile.id)
      .eq('date', today)
      .then(({ data }) => { if (data) setTodayLogs(data) })
  }, [profile?.id])

  async function toggleTask(mission_id, task_idx) {
    const checked = !optimisticLogs.some(l => l.mission_id === mission_id && l.task_idx === task_idx)
    // Optimistic update — synchronous, immediate UI feedback (R9)
    applyOptimistic({ mission_id, task_idx, checked })
    const today = getToday()
    if (checked) {
      await supabase.from('practice_logs').upsert(
        { user_id: profile.id, mission_id, task_idx, date: today, completed: true, checked_at: new Date().toISOString() },
        { onConflict: 'user_id,mission_id,task_idx,date' }
      )
    } else {
      await supabase.from('practice_logs').delete()
        .eq('user_id', profile.id).eq('mission_id', mission_id)
        .eq('task_idx', task_idx).eq('date', today)
    }
    // Sync state after write
    const { data } = await supabase
      .from('practice_logs').select('mission_id, task_idx')
      .eq('user_id', profile.id).eq('date', today)
    if (data) setTodayLogs(data)
  }

  if (missionsCompleted === null) return (
    <>
      <Header title="Practice" initials={profile?.avatar_initials || '?'} />
      <div className="practice-page"><div className="prac-loading">Loading...</div></div>
    </>
  )

  const certDone = missionsCompleted >= 6
  const currentMission = !certDone ? missionList[missionsCompleted] : null
  const completedMissions = missionList.slice(0, missionsCompleted)
  const lockedMissions = !certDone ? missionList.slice(missionsCompleted + 1) : []

  const doneCount = currentMission
    ? currentMission.tasks.filter((_, i) => optimisticLogs.some(l => l.mission_id === currentMission.id && l.task_idx === i)).length
    : 0
  const allDone = currentMission ? doneCount === currentMission.tasks.length : false
  const pct = currentMission ? Math.round((doneCount / currentMission.tasks.length) * 100) : 0

  return (
    <>
      <Header title="Practice" initials={profile?.avatar_initials || '?'} />
      <div className="practice-page">

        {certDone ? (
          <div className="prac-certified">
            <div className="prac-certified-icon">🎉</div>
            <div className="prac-certified-text">All 6 missions complete. Certified.</div>
          </div>
        ) : (
          <>
            {/* Current mission */}
            <div className={`prac-mission-card${allDone ? ' all-done' : ''}`}>
              <div className="prac-mission-label">Mission {missionsCompleted + 1} of 6</div>
              <div className="prac-mission-name">{currentMission.name}</div>
              <div className="prac-mission-desc">{currentMission.description}</div>
            </div>

            <div className="prac-section-label">Today's Tasks</div>

            {/* Tasks */}
            <div className="prac-tasks">
              {currentMission.tasks.map((task, i) => {
                const done = optimisticLogs.some(l => l.mission_id === currentMission.id && l.task_idx === i)
                return (
                  <div key={i} className="prac-task-row" onClick={() => toggleTask(currentMission.id, i)}>
                    <div className={`prac-check${done ? ' checked' : ''}`}>
                      {done && <span className="prac-check-icon">✓</span>}
                    </div>
                    <span className={`prac-task-text${done ? ' done' : ''}`}>{task}</span>
                  </div>
                )
              })}
            </div>

            {/* Progress */}
            <div className="prac-progress-row">
              <span className="prac-progress-text">{doneCount} of {currentMission.tasks.length} done</span>
              <div className="prac-progress-bar">
                <div className="prac-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="prac-progress-pct" style={{ color: doneCount > 0 ? 'var(--cta-green)' : 'var(--text-secondary)' }}>
                {pct}%
              </span>
            </div>

            {/* Reference card */}
            <div className="prac-ref-toggle" onClick={() => setRefOpen(o => !o)}>
              <span className="prac-ref-label">Quick reference</span>
              <span className={`prac-ref-arrow${refOpen ? ' open' : ''}`}>›</span>
            </div>
            {refOpen && (
              <div className="prac-ref-card">
                <div className="prac-ref-section-label">Rule</div>
                <div className="prac-ref-text">{currentMission.reference.rule}</div>
                <div className="prac-ref-section-label">Key Phrases</div>
                <div className="prac-ref-phrases">
                  {currentMission.reference.phrases.map((p, i) => (
                    <span key={i} className="prac-ref-phrase">{p}</span>
                  ))}
                </div>
                <div className="prac-ref-section-label">Watch For</div>
                <div className="prac-ref-text">{currentMission.reference.watchFor}</div>
              </div>
            )}
          </>
        )}

        {/* Completed missions row */}
        {completedMissions.length > 0 && (
          <div className="prac-compact-row">
            <span className="prac-compact-label">Done</span>
            <div className="prac-chips">
              {completedMissions.map((_, i) => (
                <span key={i} className="prac-chip prac-chip-done">✓ M{i + 1}</span>
              ))}
            </div>
          </div>
        )}

        {/* Locked missions row */}
        {lockedMissions.length > 0 && (
          <div className="prac-compact-row">
            <span className="prac-compact-label">Locked</span>
            <div className="prac-chips">
              {lockedMissions.map((_, i) => (
                <span key={i} className="prac-chip prac-chip-locked">🔒 M{missionsCompleted + 2 + i}</span>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  )
}

// ── Manager View ─────────────────────────────────────────────
function ManagerPractice({ profile, navigate }) {
  const [teamData, setTeamData] = useState([])
  const shiftPhase = getShiftPhase()
  const today = getToday()

  useEffect(() => {
    fetchTeamData()

    // Live updates via Supabase Realtime
    const channel = supabase
      .channel('team-practice-today')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'practice_logs',
      }, () => fetchTeamData())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchTeamData() {
    const [{ data: staff }, { data: logs }] = await Promise.all([
      supabase
        .from('manager_dashboard')
        .select('user_id, full_name, avatar_initials, missions_completed')
        .neq('user_id', profile?.id ?? ''),
      supabase
        .from('practice_logs')
        .select('user_id')
        .eq('date', today),
    ])
    if (!staff) return

    const logCounts = {}
    ;(logs || []).forEach(l => { logCounts[l.user_id] = (logCounts[l.user_id] || 0) + 1 })

    const enriched = staff.map(s => ({
      ...s,
      tasks_done: logCounts[s.user_id] || 0,
      tasks_total: 4,
      missionName: s.missions_completed < 6
        ? missionList[s.missions_completed]?.name ?? ''
        : 'Certified',
      missionNum: Math.min(s.missions_completed + 1, 6),
    })).sort((a, b) => b.tasks_done - a.tasks_done)

    setTeamData(enriched)
  }

  const totalDone = teamData.reduce((sum, s) => sum + s.tasks_done, 0)
  const totalPossible = teamData.length * 4

  return (
    <>
      <Header title="Practice" initials={profile?.avatar_initials || '?'} />
      <div className="practice-page">

        <div className="prac-mgr-header">
          <div className="prac-mgr-title">Team Practice Today</div>
          <div className="prac-mgr-total">{totalDone} / {totalPossible} tasks done</div>
        </div>

        {teamData.map(s => {
          const behind = isBehind(s.tasks_done, shiftPhase)
          const complete = s.tasks_done >= s.tasks_total
          const pct = Math.round((s.tasks_done / s.tasks_total) * 100)

          return (
            <div
              key={s.user_id}
              className={`prac-staff-card${behind ? ' alert' : complete ? ' complete' : ''}`}
              onClick={() => navigate(`/staff/${s.user_id}`)}
            >
              <div className="prac-staff-top">
                <div className={`prac-staff-avatar${behind ? ' avatar-alert' : complete ? ' avatar-complete' : ' avatar-ok'}`}>
                  {s.avatar_initials}
                </div>
                <div className="prac-staff-info">
                  <div className="prac-staff-name">{s.full_name}</div>
                  <div className="prac-staff-mission">Mission {s.missionNum} · {s.missionName}</div>
                </div>
                <div className="prac-staff-flag">
                  <div className={`prac-dot${behind ? ' dot-red' : ' dot-green'}`} />
                  {behind && <span className="prac-behind">Behind</span>}
                </div>
              </div>
              <div className="prac-staff-bar-wrap">
                <div
                  className={`prac-staff-bar-fill${behind ? ' bar-alert' : complete ? ' bar-complete' : ' bar-progress'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className={`prac-staff-count${behind ? ' count-alert' : complete ? ' count-complete' : ''}`}>
                {s.tasks_done}/{s.tasks_total}
                <span className="prac-staff-count-sub">
                  {complete ? ' · All tasks done' : behind ? ' · No tasks done today' : ' · tasks done'}
                </span>
              </div>
            </div>
          )
        })}

      </div>
    </>
  )
}
