import { Money } from './Money';
import { Percentage } from './Percentage';
import { TaxRegime } from '../enums/TaxRegime';

export class CSLLCalculation {
  readonly taxBase: Money;
  readonly presumedProfitPercentage: Percentage;
  readonly taxableProfit: Money;
  readonly taxRate: Percentage;
  readonly taxAmount: Money;

  constructor(desagioAmount: Money, _taxRegime: TaxRegime) {
    this.taxBase = desagioAmount;

    // Factoring companies MUST use Lucro Real (Lei 9.718/98)
    // For simulation purposes, we use presumed profit of 32% (common estimate)
    this.presumedProfitPercentage = Percentage.fromPercentage(32);
    this.taxableProfit = this.taxBase.multiply(this.presumedProfitPercentage);
    this.taxRate = Percentage.fromPercentage(9); // 9% on profit

    this.taxAmount = this.taxableProfit
      .multiply(this.taxRate)
      .roundToTaxStandard();
  }
}
