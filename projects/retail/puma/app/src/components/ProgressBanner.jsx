export default function ProgressBanner({ completed, total, streak }) {
  return (
    <div className="progress-banner">
      <div className="progress-info">
        <div className="spark-icon">
          <i className="ri-shining-fill"></i>
        </div>
        <div className="progress-text">{completed} of {total} missions</div>
      </div>
      <div className="streak-pill">
        🔥 {streak} day streak
      </div>
    </div>
  )
}
