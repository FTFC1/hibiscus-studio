import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Lesson from './pages/Lesson'
import Practice from './pages/Practice'
import Activity from './pages/Activity'
import Profile from './pages/Profile'
import BottomNav from './components/BottomNav'

const navItems = [
  { icon: 'ri-home-5-line', label: 'Home', path: '/' },
  { icon: 'ri-focus-3-line', label: 'Practice', path: '/practice' },
  { icon: 'ri-bar-chart-box-line', label: 'Activity', path: '/activity' },
  { icon: 'ri-user-3-line', label: 'Profile', path: '/profile' },
]

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const isLessonPage = location.pathname.startsWith('/lesson')
  const activeIndex = navItems.findIndex(item => item.path === location.pathname)

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson/:missionId" element={<Lesson />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {!isLessonPage && (
        <BottomNav
          items={navItems}
          activeIndex={activeIndex >= 0 ? activeIndex : 0}
          onNavigate={(i) => navigate(navItems[i].path)}
        />
      )}
    </>
  )
}

export default App
