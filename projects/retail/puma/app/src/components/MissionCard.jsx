export default function MissionCard({ title, description, readTime, onStart }) {
  return (
    <div className="mission-card">
      <div className="mission-header">
        <span className="mission-label">Next Mission</span>
        <div className="mission-icon">
          <i className="ri-function-line"></i>
        </div>
      </div>
      <div className="mission-content">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="mission-footer">
        <div className="meta-group">
          <span className="meta-label">Read time</span>
          <span className="meta-value">{readTime}</span>
        </div>
        <button className="start-btn" onClick={onStart}>
          Start <i className="ri-arrow-right-up-line"></i>
        </button>
      </div>
    </div>
  )
}
