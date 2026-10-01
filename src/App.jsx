import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { Routes, Route, useLocation } from 'react-router-dom'


import Header from './components/Header.jsx'

import HomePage from './pages/HomePage.jsx'
import PlayerVSComputer from './pages/PlayerVSComputer.jsx'
import STT from './pages/STT.jsx';
import LoginPage from './pages/LoginPage.jsx';
import UserStats from './pages/UserStats.jsx'

function App() {
  const [count, setCount] = useState(0)
  const location = useLocation();

  return (
    <div className="bg-slate-900 min-h-screen">
      <main className="flex-grow">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path='/STT' element={<STT />} />
          <Route path="/player-vs-computer" element={<PlayerVSComputer />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/UserStats" element={<UserStats />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
