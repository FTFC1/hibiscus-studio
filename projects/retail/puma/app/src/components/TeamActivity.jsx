export default function TeamActivity({ activities }) {
  return (
    <div className="activity-list">
      <div className="section-title">TEAM ACTIVITY</div>
      {activities.map((activity, i) => (
        <div className="activity-item" key={i}>
          <div className="activity-avatar">{activity.initial}</div>
          <div className="activity-text">
            <strong>{activity.name}</strong> {activity.action}
          </div>
        </div>
      ))}
    </div>
  )
}
