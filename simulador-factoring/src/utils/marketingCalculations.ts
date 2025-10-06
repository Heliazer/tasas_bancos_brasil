import Decimal from 'decimal.js';
import type { InvestmentInputDTO } from '../application/dtos/InvestmentInputDTO';
import type { InvestmentOutputDTO, MonthlyProjectionDTO } from '../application/dtos/InvestmentOutputDTO';
import { INVESTMENT_RATES } from './constants';

/**
 * Calcula el crecimiento de una inversión con reinversión automática
 * Usa interés compuesto: A = P(1 + r)^n
 */
export function calculateCompoundGrowth(input: InvestmentInputDTO): InvestmentOutputDTO {
  const { amount, months, autoReinvest, monthlyRate = INVESTMENT_RATES.STANDARD } = input;

  const principal = new Decimal(amount);
  const rate = new Decimal(monthlyRate);
  const term = new Decimal(months);

  let finalAmount: Decimal;
  let monthlyProjection: MonthlyProjectionDTO[] = [];

  if (autoReinvest) {
    // Interés compuesto: A = P(1 + r)^n
    const onePlusRate = rate.plus(1);
    finalAmount = principal.times(onePlusRate.pow(term.toNumber()));

    // Generar proyección mensual
    let currentCapital = principal;
    for (let month = 1; month <= months; month++) {
      const interest = currentCapital.times(rate);
      currentCapital = currentCapital.plus(interest);

      monthlyProjection.push({
        month,
        capital: currentCapital.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
        interest: interest.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
        cumulativeGain: currentCapital.minus(principal).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      });
    }
  } else {
    // Interés simple: A = P + (P * r * n)
    const simpleInterest = principal.times(rate).times(term);
    finalAmount = principal.plus(simpleInterest);

    // Generar proyección mensual
    const monthlyInterest = principal.times(rate);
    for (let month = 1; month <= months; month++) {
      monthlyProjection.push({
        month,
        capital: principal.toNumber(),
        interest: monthlyInterest.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
        cumulativeGain: monthlyInterest.times(month).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      });
    }
  }

  const totalGain = finalAmount.minus(principal);
  const monthlyAverage = totalGain.dividedBy(term);
  const roiPercentage = totalGain.dividedBy(principal).times(100);

  return {
    initialAmount: principal.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
    finalAmount: finalAmount.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
    totalGain: totalGain.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
    monthlyAverage: monthlyAverage.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
    roiPercentage: roiPercentage.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
    effectiveRate: monthlyRate,
    monthlyProjection,
  };
}

/**
 * Calcula comparaciones con otras inversiones (para la tabla comparativa)
 */
export interface ComparisonResult {
  name: string;
  initialAmount: number;
  finalAmount: number;
  totalGain: number;
  annualRate: number;
  emoji: string;
}

export function calculateComparisons(
  initialAmount: number,
  months: number
): ComparisonResult[] {
  const principal = new Decimal(initialAmount);
  const years = new Decimal(months).dividedBy(12);

  // Poupança (6% anual simple)
  const poupancaAnnualRate = new Decimal(0.06);
  const poupancaGain = principal.times(poupancaAnnualRate).times(years);
  const poupancaFinal = principal.plus(poupancaGain);

  // CDI (13% anual compuesto)
  const cdiAnnualRate = new Decimal(0.13);
  const cdiFinal = principal.times(cdiAnnualRate.plus(1).pow(years.toNumber()));
  const cdiGain = cdiFinal.minus(principal);

  // Nuestra plataforma (3.8% mensual compuesto)
  const platformMonthlyRate = new Decimal(INVESTMENT_RATES.STANDARD);
  const platformFinal = principal.times(platformMonthlyRate.plus(1).pow(months));
  const platformGain = platformFinal.minus(principal);

  return [
    {
      name: 'Poupança',
      initialAmount: principal.toNumber(),
      finalAmount: poupancaFinal.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      totalGain: poupancaGain.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      annualRate: 6,
      emoji: '😴',
    },
    {
      name: 'CDI',
      initialAmount: principal.toNumber(),
      finalAmount: cdiFinal.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      totalGain: cdiGain.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      annualRate: 13,
      emoji: '😐',
    },
    {
      name: 'Tasa Brasil',
      initialAmount: principal.toNumber(),
      finalAmount: platformFinal.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      totalGain: platformGain.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      annualRate: 56, // 3.8% mensual ~56% anual
      emoji: '🚀',
    },
  ];
}

/**
 * Convierte tasa mensual a anual efectiva: (1 + r)^12 - 1
 */
export function monthlyToAnnualRate(monthlyRate: number): number {
  const monthly = new Decimal(monthlyRate);
  const annual = monthly.plus(1).pow(12).minus(1);
  return annual.times(100).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
}

/**
 * Convierte tasa anual a mensual efectiva: (1 + r)^(1/12) - 1
 */
export function annualToMonthlyRate(annualRate: number): number {
  const annual = new Decimal(annualRate);
  const monthly = annual.plus(1).pow(1 / 12).minus(1);
  return monthly.times(100).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
}
