import { Money } from './Money';
import { Percentage } from './Percentage';

export interface Municipality {
  code: string;
  name: string;
  issRateForFactoring: Percentage;
}

export class ISSCalculation {
  readonly taxBase: Money;
  readonly taxRate: Percentage;
  readonly taxAmount: Money;
  readonly municipality: Municipality;

  constructor(desagioAmount: Money, municipality: Municipality) {
    this.municipality = municipality;
    this.taxBase = desagioAmount;
    this.taxRate = this.getISSRate(municipality);
    this.taxAmount = this.taxBase
      .multiply(this.taxRate)
      .roundToTaxStandard();
  }

  private getISSRate(municipality: Municipality): Percentage {
    // Use municipality-specific rate or default to 3%
    return municipality.issRateForFactoring || Percentage.fromPercentage(3.0);
  }
}
