export default function RewardsRow({ rewards }) {
  return (
    <div className="rewards-row">
      {rewards.map((reward, i) => (
        <div className={`reward-badge${reward.earned ? ' earned' : ''}`} key={i}>
          <i className={reward.icon}></i>
        </div>
      ))}
    </div>
  )
}
