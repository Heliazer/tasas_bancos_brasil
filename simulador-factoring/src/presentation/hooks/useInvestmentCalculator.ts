import { useState, useMemo, useCallback } from 'react';
import type { InvestmentInputDTO } from '../../application/dtos/InvestmentInputDTO';
import type { InvestmentOutputDTO } from '../../application/dtos/InvestmentOutputDTO';
import { calculateCompoundGrowth } from '../../utils/marketingCalculations';
import { INVESTMENT_LIMITS, INVESTMENT_RATES } from '../../utils/constants';

/**
 * Hook para manejar el estado y cálculos de la calculadora de inversión
 * Optimizado para performance con memoization
 */
export function useInvestmentCalculator() {
  // Estado de inputs
  const [amount, setAmount] = useState<number>(100000); // Default: R$ 100k
  const [months, setMonths] = useState<number>(12); // Default: 1 año
  const [autoReinvest, setAutoReinvest] = useState<boolean>(true); // Default: con reinversión
  const [monthlyRate, setMonthlyRate] = useState<number>(INVESTMENT_RATES.STANDARD); // Default: 3.8%

  // Cálculo memoizado - se recalcula solo cuando cambian los inputs
  const result: InvestmentOutputDTO = useMemo(() => {
    const input: InvestmentInputDTO = {
      amount,
      months,
      autoReinvest,
      monthlyRate,
    };

    return calculateCompoundGrowth(input);
  }, [amount, months, autoReinvest, monthlyRate]);

  // Handlers optimizados con useCallback
  const handleAmountChange = useCallback((value: number) => {
    const clampedValue = Math.max(
      INVESTMENT_LIMITS.MIN_AMOUNT,
      Math.min(INVESTMENT_LIMITS.MAX_AMOUNT, value)
    );
    setAmount(clampedValue);
  }, []);

  const handleMonthsChange = useCallback((value: number) => {
    const clampedValue = Math.max(
      INVESTMENT_LIMITS.MIN_MONTHS,
      Math.min(INVESTMENT_LIMITS.MAX_MONTHS, value)
    );
    setMonths(clampedValue);
  }, []);

  const handleAutoReinvestToggle = useCallback(() => {
    setAutoReinvest((prev) => !prev);
  }, []);

  const handleRateChange = useCallback((value: number) => {
    setMonthlyRate(value);
  }, []);

  // Reset a valores default
  const reset = useCallback(() => {
    setAmount(100000);
    setMonths(12);
    setAutoReinvest(true);
    setMonthlyRate(INVESTMENT_RATES.STANDARD);
  }, []);

  return {
    // Inputs actuales
    amount,
    months,
    autoReinvest,
    monthlyRate,

    // Resultado calculado
    result,

    // Handlers
    setAmount: handleAmountChange,
    setMonths: handleMonthsChange,
    toggleAutoReinvest: handleAutoReinvestToggle,
    setMonthlyRate: handleRateChange,
    reset,
  };
}
