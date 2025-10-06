/**
 * DTO simplificado para inputs de inversión de marketing
 * Orientado a la calculadora de landing page
 */
export interface InvestmentInputDTO {
  /** Monto inicial de inversión en BRL */
  amount: number;

  /** Cantidad de meses de inversión */
  months: number;

  /** Si se reinvierten automáticamente las ganancias mensuales */
  autoReinvest: boolean;

  /** Tasa mensual esperada (default: 3.8%) */
  monthlyRate?: number;
}
