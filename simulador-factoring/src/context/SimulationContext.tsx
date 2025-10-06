import { createContext, useContext, useState, ReactNode } from 'react';

interface SimulationData {
  amount: number;
  months: number;
  autoReinvest: boolean;
  finalAmount: number;
  totalGain: number;
  roiPercentage: number;
  monthlyAverage: number;
  effectiveRate: number;
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
