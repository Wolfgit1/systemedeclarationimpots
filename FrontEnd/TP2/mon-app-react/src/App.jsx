import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import Declaration from './pages/Declaration'
import Suivi from './pages/Suivi'
import AvisAuto from './pages/AvisAuto'
import AvisPersonnalise from './pages/AvisPersonnalise'
import AdminDashboard from './pages/AdminDashboard' // Ajoutez cette ligne
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/connexion" replace />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/declaration" element={<Declaration />} />
        <Route path="/suivi" element={<Suivi />} />
        <Route path="/avis-auto" element={<AvisAuto />} />
        <Route path="/avis-personnalise" element={<AvisPersonnalise />} />
        <Route path="/admin" element={<AdminDashboard />} /> {/* Ajoutez cette route */}
      </Routes>
    </Router>
  )
}

export default App