import { Money } from './Money';
import { Percentage } from './Percentage';
import { TaxRegime } from '../enums/TaxRegime';

export enum COFINSTaxRegime {
  SIMPLES_NACIONAL = 'SIMPLES_NACIONAL',
  CUMULATIVE = 'CUMULATIVE',
  NON_CUMULATIVE = 'NON_CUMULATIVE'
}

export class COFINSCalculation {
  readonly taxBase: Money;
  readonly taxRate: Percentage;
  readonly taxAmount: Money;
  readonly regime: COFINSTaxRegime;

  constructor(desagioAmount: Money, _taxRegime: TaxRegime) {
    this.taxBase = desagioAmount;

    // Factoring companies MUST use Lucro Real (non-cumulative regime)
    // Lei 9.718/98 prohibits Simples Nacional and Lucro Presumido
    this.regime = COFINSTaxRegime.NON_CUMULATIVE;
    this.taxRate = Percentage.fromPercentage(7.6); // 7.6% for non-cumulative

    this.taxAmount = this.taxBase
      .multiply(this.taxRate)
      .roundToTaxStandard();
  }
}
