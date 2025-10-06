import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './presentation/pages/LandingPage';
import { BackofficeDashboard } from './presentation/pages/BackofficeDashboard';

/**
 * App principal con routing
 * Rutas:
 * - / : Landing page (marketing)
 * - /backoffice : Dashboard backoffice (análisis financiero)
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/backoffice" element={<BackofficeDashboard />} />
        {/* Futuras rutas:
        <Route path="/dashboard" element={<InvestorDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        */}
      </Routes>
    </Router>
  );
}

export default App;
