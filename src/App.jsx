import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'


import Header from './components/Header.jsx'

import HomePage from './pages/HomePage.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-slate-900 min-h-screen">
      <Header />
      <HomePage />
    </div>
  )
}

export default App
