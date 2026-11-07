import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import ToastHost from './components/ToastHost'
import Intro from './pages/Intro'
import Welcome from './pages/Welcome'
import Kingdom from './pages/Kingdom'
import LevelSelect from './pages/LevelSelect'
import Mission from './pages/Mission'
import Summary from './pages/Summary'
import Achievements from './pages/Achievements'
import Profile from './pages/Profile'
import { useGameStore } from './store/gameStore'

function MissionRoute() {
  const { levelId } = useParams()
  return <Mission key={levelId} />
}

function AppContent() {
  const location = useLocation()
  const isIntro = location.pathname === '/intro'

  return (
    <div className="app-bg relative min-h-screen">
      {!isIntro && <ToastHost />}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/kingdom" element={<Kingdom />} />
          <Route path="/levels" element={<LevelSelect />} />
          <Route path="/mission/:levelId" element={<MissionRoute />} />
          <Route path="/summary/:levelId" element={<Summary />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  const checkDailyStreak = useGameStore((state) => state.checkDailyStreak)

  useEffect(() => {
    checkDailyStreak()
  }, [checkDailyStreak])

  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}
