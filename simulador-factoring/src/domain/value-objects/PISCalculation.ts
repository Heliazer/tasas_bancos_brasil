import { Money } from './Money';
import { Percentage } from './Percentage';
import { TaxRegime } from '../enums/TaxRegime';

export enum PISTaxRegime {
  SIMPLES_NACIONAL = 'SIMPLES_NACIONAL',
  CUMULATIVE = 'CUMULATIVE',
  NON_CUMULATIVE = 'NON_CUMULATIVE'
}

export class PISCalculation {
  readonly taxBase: Money;
  readonly taxRate: Percentage;
  readonly taxAmount: Money;
  readonly regime: PISTaxRegime;

  constructor(desagioAmount: Money, _taxRegime: TaxRegime) {
    this.taxBase = desagioAmount;

    // Factoring companies MUST use Lucro Real (non-cumulative regime)
    // Lei 9.718/98 prohibits Simples Nacional and Lucro Presumido
    this.regime = PISTaxRegime.NON_CUMULATIVE;
    this.taxRate = Percentage.fromPercentage(1.65); // 1.65% for non-cumulative

    this.taxAmount = this.taxBase
      .multiply(this.taxRate)
      .roundToTaxStandard();
  }
}
