import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { UserProvider, useUser } from './context/UserContext'
import useAutoUpdate from './hooks/useAutoUpdate'
import Home from './pages/Home'
import Lesson from './pages/Lesson'
import Practice from './pages/Practice'
import Activity from './pages/Activity'
import Profile from './pages/Profile'
import Games from './pages/Games'
import Login from './pages/Login'
import StaffDetail from './pages/StaffDetail'
import Result from './pages/Result'
import Review from './pages/Review'
import BottomNav from './components/BottomNav'

const navItems = [
  { icon: 'ri-home-5-line', label: 'Home', path: '/' },
  { icon: 'ri-focus-3-line', label: 'Practice', path: '/practice' },
  { icon: 'ri-gamepad-line', label: 'Games', path: '/games' },
  { icon: 'ri-bar-chart-box-line', label: 'Activity', path: '/activity' },
  { icon: 'ri-user-3-line', label: 'Profile', path: '/profile' },
]

function UpdateToast() {
  return (
    <div style={{
      position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
      background: '#3A7D44', color: 'white', padding: '10px 20px',
      borderRadius: 12, fontSize: 13, fontWeight: 600, zIndex: 9999,
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)', fontFamily: 'Inter, sans-serif',
    }}>
      Updating...
    </div>
  )
}

function AppInner() {
  const location = useLocation()
  const navigate = useNavigate()
  const { session, loading, isManager } = useUser()
  const updateAvailable = useAutoUpdate()
  const [wasLoggedOut, setWasLoggedOut] = useState(false)

  // Track logout→login transitions to redirect to Home
  useEffect(() => {
    if (!session) {
      setWasLoggedOut(true)
    } else if (wasLoggedOut) {
      setWasLoggedOut(false)
      // After fresh login, always land on Home
      if (location.pathname !== '/') {
        navigate('/', { replace: true })
      }
    }
  }, [session])

  // Dev-only review route — bypasses auth
  if (location.pathname === '/review') {
    return <Review />
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!session) {
    return <Login />
  }

  const isLessonPage = location.pathname.startsWith('/lesson')
  const isResultPage = location.pathname.startsWith('/result')
  const isStaffDetailPage = location.pathname.startsWith('/staff')
  // Hide Activity tab for managers
  const visibleNav = isManager ? navItems.filter(n => n.path !== '/activity') : navItems
  const activeIndex = visibleNav.findIndex(item => item.path === location.pathname)

  return (
    <>
      {updateAvailable && <UpdateToast />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson/:missionId" element={<Lesson />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/games" element={<Games />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/staff/:staffId" element={<StaffDetail />} />
        <Route path="/result/:missionId" element={<Result />} />
      </Routes>

      {!isLessonPage && !isResultPage && !isStaffDetailPage && (
        <BottomNav
          items={visibleNav}
          activeIndex={activeIndex >= 0 ? activeIndex : 0}
          onNavigate={(i) => navigate(visibleNav[i].path)}
        />
      )}
    </>
  )
}

function App() {
  return (
    <UserProvider>
      <AppInner />
    </UserProvider>
  )
}

export default App
