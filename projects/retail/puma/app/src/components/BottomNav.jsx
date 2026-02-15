export default function BottomNav({ items, activeIndex, onNavigate }) {
  return (
    <nav className="bottom-nav">
      {items.map((item, i) => (
        <button
          className={`nav-item${i === activeIndex ? ' active' : ''}`}
          key={i}
          onClick={() => onNavigate(i)}
        >
          <i className={item.icon}></i>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
