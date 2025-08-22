import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import './App.css'
import ConsumerAnalysisPage from './pages/ConsumerAnalysisPage'
import TraceabilityPage from './pages/TraceabilityPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/consumer-analysis" element={<ConsumerAnalysisPage />} />
        <Route path="/traceability" element={<TraceabilityPage />} />
      </Routes>
    </Router>
  )
}

export default App
