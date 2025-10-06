import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import { LandingPage } from './presentation/pages/LandingPage';
import { BackofficeDashboard } from './presentation/pages/BackofficeDashboard';
import { FormalReport } from './presentation/pages/FormalReport';
import { InformeFinanciera } from './presentation/pages/InformeFinanciera';

/**
 * App principal con routing
 * Rutas:
 * - / : Landing page (marketing)
 * - /informe : Informe formal detallado (vista cliente/inversor)
 * - /informe-financiera : Informe contable (vista financiera/backoffice)
 * - /backoffice : Dashboard backoffice (análisis financiero)
 */
function App() {
  return (
    <SimulationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/informe" element={<FormalReport />} />
          <Route path="/informe-financiera" element={<InformeFinanciera />} />
          <Route path="/backoffice" element={<BackofficeDashboard />} />
          {/* Futuras rutas:
          <Route path="/dashboard" element={<InvestorDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          */}
        </Routes>
      </Router>
    </SimulationProvider>
  );
}

export default App;
