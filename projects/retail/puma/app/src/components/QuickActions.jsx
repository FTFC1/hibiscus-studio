export default function QuickActions({ actions }) {
  return (
    <>
      <div className="section-title">QUICK ACTIONS</div>
      <div className="scroller">
        {actions.map((action, i) => (
          <div
            className={`action-card${action.primary ? ' primary' : ''}`}
            key={i}
            onClick={action.onClick}
          >
            <div
              className="action-icon"
              style={!action.primary ? { color: 'var(--accent-lime)' } : undefined}
            >
              <i className={action.icon}></i>
            </div>
            <h4 dangerouslySetInnerHTML={{ __html: action.label }}></h4>
            <i className="ri-arrow-right-up-line action-arrow"></i>
          </div>
        ))}
      </div>
    </>
  )
}
