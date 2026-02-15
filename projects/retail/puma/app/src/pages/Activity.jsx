import Header from '../components/Header'
import TeamActivity from '../components/TeamActivity'

const leaderboard = [
  { rank: 1, name: 'Adedolapo', xp: 340, trend: 'up' },
  { rank: 2, name: 'Peter', xp: 285, trend: 'up' },
  { rank: 3, name: 'Chidi', xp: 260, trend: 'down' },
  { rank: 4, name: 'You', xp: 245, trend: 'up', isYou: true },
  { rank: 5, name: 'Molade', xp: 190, trend: 'same' },
]

const teamActivities = [
  { initial: 'P', name: 'Peter', action: 'completed Mission 4' },
  { initial: 'A', name: 'Adedolapo', action: 'scored 92% on Quiz' },
  { initial: 'C', name: 'Chidi', action: 'started Mission 4' },
]

export default function Activity() {
  return (
    <>
      <Header title="Activity" initials="JM" />
      <div style={{ padding: '0 20px' }}>
        <div className="section-title">Weekly Leaderboard</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {leaderboard.map((p) => (
            <div
              key={p.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                background: p.isYou ? 'rgba(220, 238, 86, 0.08)' : 'rgba(255,255,255,0.05)',
                border: p.isYou ? '1px solid rgba(220, 238, 86, 0.25)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
              }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: p.rank <= 3 ? 'rgba(220,238,86,0.15)' : 'rgba(255,255,255,0.08)',
                color: p.rank <= 3 ? '#DCEE56' : '#8E9BA0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, flexShrink: 0
              }}>
                {p.rank}
              </span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: p.isYou ? 600 : 400, color: p.isYou ? '#DCEE56' : '#fff' }}>
                {p.name}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#8E9BA0' }}>{p.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      <TeamActivity activities={teamActivities} />
    </>
  )
}
