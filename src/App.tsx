import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/consumer-analysis" element={<div className="p-8 text-center">Consumer Analysis Page - Coming Soon</div>} />
        <Route path="/beef-interactive" element={<div className="p-8 text-center">Beef Interactive Page - Coming Soon</div>} />
      </Routes>
    </Router>
  )
}

export default App
