export default function StatsStrip({ stats }) {
  return (
    <div className="stats-strip">
      {stats.map((stat, i) => (
        <div className="stat-item" key={i}>
          <span className="stat-val">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
