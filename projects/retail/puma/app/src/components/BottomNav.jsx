export default function BottomNav({ items, activeIndex, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item, i) => (
        <button
          className={`nav-item${i === activeIndex ? ' active' : ''}`}
          key={i}
          onClick={() => onNavigate(i)}
          aria-label={item.label}
          aria-current={i === activeIndex ? 'page' : undefined}
        >
          <i className={item.icon} aria-hidden="true"></i>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
