import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { missionList } from '../data/missions'
import Header from '../components/Header'
import StatsStrip from '../components/StatsStrip'
import QuickActions from '../components/QuickActions'
import TeamActivity from '../components/TeamActivity'
import './Home.css'

const teamActivities = [
  { initial: 'P', name: 'Peter', action: 'completed Mission 4' },
  { initial: 'A', name: 'Adedolapo', action: 'scored 92% on Quiz' },
]

const stats = [
  { value: '12', label: 'XP Earned' },
  { value: '85%', label: 'Accuracy' },
  { value: '#4', label: 'Ranking' },
]

const managerStats = [
  { value: '5', label: 'Staff' },
  { value: '68%', label: 'Avg Score' },
  { value: '3/5', label: 'Active' },
]

const staffRoster = [
  { name: 'Peter', initials: 'PO', missions: '5/6', score: '88%', streak: 7, status: 'ahead' },
  { name: 'Adedolapo', initials: 'AD', missions: '4/6', score: '92%', streak: 5, status: 'ahead' },
  { name: 'Chidi', initials: 'CE', missions: '3/6', score: '75%', streak: 2, status: 'on-track' },
  { name: 'Junior', initials: 'JM', missions: '3/6', score: '85%', streak: 4, status: 'on-track' },
  { name: 'Molade', initials: 'MK', missions: '1/6', score: '60%', streak: 0, status: 'behind' },
]

const completedCount = missionList.filter(m => m.status === 'completed').length

export default function Home() {
  const navigate = useNavigate()
  const [view, setView] = useState('staff')

  const currentMission = missionList.find(m => m.status === 'current')

  const quickActions = [
    { icon: 'ri-gamepad-line', label: `Play<br/>Mission ${currentMission?.number || 4}`, primary: true, onClick: () => navigate(`/lesson/${currentMission?.id || 'mission-4'}`) },
    { icon: 'ri-checkbox-circle-line', label: 'Review<br/>Today', primary: false, onClick: () => navigate('/practice') },
    { icon: 'ri-line-chart-line', label: 'View<br/>Progress', primary: false, onClick: () => navigate('/activity') },
  ]

  return (
    <>
      <Header brandSplit={['PUMA', 'Training']} initials="JM" />

      {/* View Switcher */}
      <div className="view-switcher">
        <button
          className={`vs-tab ${view === 'staff' ? 'vs-tab-active' : ''}`}
          onClick={() => setView('staff')}
        >
          <i className="ri-user-line"></i> My Training
        </button>
        <button
          className={`vs-tab ${view === 'manager' ? 'vs-tab-active' : ''}`}
          onClick={() => setView('manager')}
        >
          <i className="ri-team-line"></i> Manager
        </button>
      </div>

      {view === 'staff' ? (
        <>
          {/* Module Header — replaces ProgressBanner + section title */}
          <div className="module-header">
            <div className="module-header-icon">
              <i className="ri-chat-smile-3-line"></i>
            </div>
            <div className="module-header-info">
              <div className="module-header-label">Module 1</div>
              <div className="module-header-title">Customer Engagement</div>
              <div className="module-header-meta">
                {completedCount}/6 missions
                <span className="module-header-streak"><i className="ri-fire-line"></i> 4d streak</span>
              </div>
            </div>
          </div>

          {/* Mission List — THE HERO, immediately after module header */}
          <div className="mission-list">
            {missionList.map((m) => {
              const isLocked = m.status === 'locked'
              const isCurrent = m.status === 'current'
              const isCompleted = m.status === 'completed'

              return (
                <div
                  key={m.id}
                  className={`ml-card ${isCurrent ? 'ml-card-current' : ''} ${isLocked ? 'ml-card-locked' : ''}`}
                  onClick={() => !isLocked && navigate(`/lesson/${m.id}`)}
                >
                  <div className={`ml-number ${isCompleted ? 'ml-number-done' : ''} ${isCurrent ? 'ml-number-current' : ''}`}>
                    {isCompleted ? <i className="ri-check-line"></i> : m.number}
                  </div>
                  <div className="ml-content">
                    <div className="ml-title">{m.title}</div>
                    <div className="ml-desc">{m.description}</div>
                  </div>
                  <div className="ml-right">
                    {isLocked ? (
                      <i className="ri-lock-line ml-lock-icon"></i>
                    ) : isCurrent ? (
                      <div className="ml-start-pill">Start <i className="ri-arrow-right-s-line"></i></div>
                    ) : (
                      <span className="ml-time">{m.readTime}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Actions — moved up, before stats */}
          <QuickActions actions={quickActions} />
          <StatsStrip stats={stats} />
        </>
      ) : (
        <>
          <StatsStrip stats={managerStats} />

          <div className="section-title" style={{ marginTop: 8 }}>Team Progress</div>
          <div className="staff-roster">
            {staffRoster.map((s) => (
              <div key={s.name} className={`sr-card sr-card-${s.status}`}>
                <div className="sr-avatar">{s.initials}</div>
                <div className="sr-info">
                  <div className="sr-name">{s.name}</div>
                  <div className="sr-detail">
                    {s.missions} missions &middot; {s.score} avg
                    {s.streak > 0 && <span className="sr-streak"><i className="ri-fire-line"></i>{s.streak}d</span>}
                  </div>
                </div>
                <div className={`sr-status-pill sr-pill-${s.status}`}>
                  {s.status === 'ahead' ? 'Ahead' : s.status === 'on-track' ? 'On Track' : 'Behind'}
                </div>
              </div>
            ))}
          </div>

          <TeamActivity activities={teamActivities} />
        </>
      )}
    </>
  )
}
