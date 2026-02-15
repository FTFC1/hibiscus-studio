import Header from '../components/Header'

const badges = [
  { icon: 'ri-medal-fill', label: 'First Mission', earned: true },
  { icon: 'ri-flashlight-fill', label: 'Quick Learner', earned: true },
  { icon: 'ri-trophy-line', label: 'Quiz Master', earned: false },
  { icon: 'ri-vip-diamond-line', label: 'Top Seller', earned: false },
  { icon: 'ri-shield-flash-line', label: 'Perfect Week', earned: false },
  { icon: 'ri-fire-line', label: '7-Day Streak', earned: false },
]

export default function Profile() {
  return (
    <>
      <Header title="Profile" initials="JM" />
      <div style={{ padding: '0 20px' }}>
        {/* User card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, padding: 24, textAlign: 'center', marginBottom: 24
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(220,238,86,0.15)', border: '2px solid rgba(220,238,86,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 600, color: '#DCEE56', margin: '0 auto 12px'
          }}>JM</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Junior Member</div>
          <div style={{ fontSize: 13, color: '#8E9BA0' }}>PUMA Ikeja Store</div>
        </div>

        {/* Stats grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24
        }}>
          {[
            { value: '3/6', label: 'Missions' },
            { value: '85%', label: 'Accuracy' },
            { value: '4', label: 'Day Streak' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '14px 8px', textAlign: 'center'
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#DCEE56' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#8E9BA0', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="section-title">Badges</div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8
        }}>
          {badges.map((b, i) => (
            <div key={i} style={{
              background: b.earned ? 'rgba(220,238,86,0.08)' : 'rgba(255,255,255,0.03)',
              border: b.earned ? '1px solid rgba(220,238,86,0.2)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: 14, textAlign: 'center',
              opacity: b.earned ? 1 : 0.4
            }}>
              <i className={b.icon} style={{
                fontSize: 24, color: b.earned ? '#DCEE56' : '#8E9BA0',
                display: 'block', marginBottom: 6
              }}></i>
              <div style={{ fontSize: 10, color: b.earned ? '#fff' : '#8E9BA0', fontWeight: 500 }}>{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
