import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { SimulationOutputDTO } from '../application/dtos/SimulationOutputDTO';

interface SimulationData {
  amount: number;
  months: number;
  autoReinvest: boolean;
  finalAmount: number;
  totalGain: number;
  roiPercentage: number;
  monthlyAverage: number;
  effectiveRate: number;
  // Full simulation output for detailed reports
  fullOutput?: SimulationOutputDTO;
}

interface SimulationContextType {
  simulationData: SimulationData | null;
  setSimulationData: (data: SimulationData) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);

  return (
    <SimulationContext.Provider value={{ simulationData, setSimulationData }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
