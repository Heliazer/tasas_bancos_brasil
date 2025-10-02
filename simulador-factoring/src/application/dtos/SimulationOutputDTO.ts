export interface TaxDetailDTO {
  taxBase: number;
  rate: number;
  amount: number;
}

export interface IOFDetailDTO {
  taxBase: number;
  dailyRate: number;
  fixedRate: number;
  dailyIOF: number;
  fixedIOF: number;
  amount: number;
  daysUntilMaturity: number;
}

export interface RateCalculationDTO {
  baseMonthlyRate: number;
  riskAdjustment: number;
  modalityAdjustment: number;
  volumeDiscount: number;
  finalMonthlyRate: number;
  effectiveAnnualRate: number;
  desagioPercentage: number;
  desagioAmount: number;
}

export interface TaxCalculationsDTO {
  iss: TaxDetailDTO;
  pis: TaxDetailDTO;
  cofins: TaxDetailDTO;
  irpj: TaxDetailDTO;
  csll: TaxDetailDTO;
  iof: IOFDetailDTO;
  totalTaxAmount: number;
  effectiveTaxRate: number;
}

export interface NetCalculationDTO {
  duplicataFaceValue: number;
  totalDesagio: number;
  totalTaxes: number;
  netAmount: number;
  effectiveDiscount: number;
}

export interface SimulationOutputDTO {
  // Duplicata info
  duplicataNumber: string;
  faceValue: number;
  dueDate: string;
  daysToMaturity: number;
  termInMonths: number;
  debtorName: string;
  debtorDocument: string;

  // Calculations
  rateCalculation: RateCalculationDTO;
  taxCalculations: TaxCalculationsDTO;
  netCalculation: NetCalculationDTO;

  // Metadata
  simulatedAt: string;
}
