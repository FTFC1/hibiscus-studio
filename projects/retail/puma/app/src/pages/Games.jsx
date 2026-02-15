import Header from '../components/Header'

const leaderboard = [
  { rank: 1, name: 'Adedolapo', xp: 340, trend: 'up' },
  { rank: 2, name: 'Peter', xp: 285, trend: 'up' },
  { rank: 3, name: 'Chidi', xp: 260, trend: 'down' },
  { rank: 4, name: 'You', xp: 245, trend: 'up', isYou: true },
  { rank: 5, name: 'Molade', xp: 190, trend: 'same' },
]

export default function Games() {
  return (
    <>
      <Header title="Games" initials="JM" />
      <div style={{ padding: '0 20px' }}>
        <div className="section-title">Weekly Leaderboard</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
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

        <div className="section-title">Challenges</div>
        <div style={{
          padding: 24, borderRadius: 16,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center'
        }}>
          <i className="ri-gamepad-line" style={{ fontSize: 32, color: '#8E9BA0', marginBottom: 8, display: 'block' }}></i>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Coming Soon</div>
          <div style={{ fontSize: 12, color: '#8E9BA0' }}>
            Head-to-head sales challenges unlock after Module 1
          </div>
        </div>
      </div>
    </>
  )
}
