import { Routes, Route } from 'react-router-dom';
import { SimulatorPage } from './presentation/pages/SimulatorPage';
import { FormalReport } from './presentation/pages/FormalReport';
import { InformeFinanciera } from './presentation/pages/InformeFinanciera';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SimulatorPage />} />
      <Route path="/formal-report" element={<FormalReport />} />
      <Route path="/informe-financiera" element={<InformeFinanciera />} />
    </Routes>
  );
}

export default App;
