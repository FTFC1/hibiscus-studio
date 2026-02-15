import Header from '../components/Header'

const todaysPractice = [
  { mission: 'The 5-30-60 Rule', items: [
    'Count to 5 every time a customer walks in — eye contact before you hit 5',
    'Set a 60-second mental timer — approach if you haven\'t yet',
    'Kill "Can I help you?" — try "What brings you in today?"',
  ]},
  { mission: 'Kill "Can I Help You?"', items: [
    'Pick ONE warm opening to use all day',
    'Count how many engage vs say "just looking"',
  ]},
]

export default function Practice() {
  return (
    <>
      <Header title="Practice" initials="JM" />
      <div style={{ padding: '0 20px' }}>
        <div className="section-title">Today's Focus</div>
        {todaysPractice.map((group, i) => (
          <div key={i} style={{
            marginBottom: 12,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: 16,
          }}>
            <div style={{ fontSize: 11, color: '#DCEE56', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
              {group.mission}
            </div>
            {group.items.map((item, j) => (
              <div key={j} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0',
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.2)',
                  flexShrink: 0, marginTop: 1
                }}></div>
                <span style={{ fontSize: 14, color: '#fff', lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
