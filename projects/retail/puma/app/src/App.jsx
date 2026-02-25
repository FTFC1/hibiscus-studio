import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { UserProvider, useUser } from './context/UserContext'
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

function AppInner() {
  const location = useLocation()
  const navigate = useNavigate()
  const { session, loading } = useUser()

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
  const activeIndex = navItems.findIndex(item => item.path === location.pathname)

  return (
    <>
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
          items={navItems}
          activeIndex={activeIndex >= 0 ? activeIndex : 0}
          onNavigate={(i) => navigate(navItems[i].path)}
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
