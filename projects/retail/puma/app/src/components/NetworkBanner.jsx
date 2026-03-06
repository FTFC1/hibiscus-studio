import { useOnlineStatus } from '../hooks/useOnlineStatus'
import './NetworkBanner.css'

export default function NetworkBanner() {
  const online = useOnlineStatus()

  if (online) return null

  return (
    <div className="network-banner" role="alert">
      <i className="ri-wifi-off-line" />
      <span>You're offline. Some features may not work.</span>
    </div>
  )
}
