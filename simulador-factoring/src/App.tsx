import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './presentation/pages/LandingPage';

/**
 * App principal con routing
 * Actualmente solo tiene landing page, preparado para expandir
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
