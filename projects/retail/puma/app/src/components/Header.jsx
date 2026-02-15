import { useNavigate } from 'react-router-dom'

export default function Header({ title, initials, brandSplit }) {
  const navigate = useNavigate()
  return (
    <header className="header">
      {brandSplit ? (
        <div className="header-brand">
          <span className="header-brand-name">{brandSplit[0]}</span>
          <span className="header-brand-sub">{brandSplit[1]}</span>
        </div>
      ) : (
        <h1>{title}</h1>
      )}
      <div className="avatar" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>{initials}</div>
    </header>
  )
}
