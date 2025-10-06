/**
 * DTO simplificado para outputs de inversión de marketing
 * Contiene solo los números que importan al inversor
 */
export interface InvestmentOutputDTO {
  /** Monto inicial invertido */
  initialAmount: number;

  /** Monto final después del período */
  finalAmount: number;

  /** Ganancia total (finalAmount - initialAmount) */
  totalGain: number;

  /** Ganancia promedio mensual */
  monthlyAverage: number;

  /** Retorno total en porcentaje (totalGain / initialAmount * 100) */
  roiPercentage: number;

  /** Tasa efectiva aplicada */
  effectiveRate: number;

  /** Proyección mensual detallada (opcional, para gráficos) */
  monthlyProjection?: MonthlyProjectionDTO[];
}

export interface MonthlyProjectionDTO {
  /** Número de mes (1-based) */
  month: number;

  /** Capital al final del mes */
  capital: number;

  /** Intereses ganados en el mes */
  interest: number;

  /** Ganancia acumulada hasta este mes */
  cumulativeGain: number;
}
