import { Money } from './Money';
import { Percentage } from './Percentage';

export class NetCalculation {
  readonly duplicataFaceValue: Money;
  readonly totalDesagio: Money;
  readonly totalTaxes: Money;
  readonly netAmount: Money;
  readonly effectiveDiscount: Percentage;

  constructor(
    faceValue: Money,
    desagioAmount: Money,
    taxAmount: Money
  ) {
    this.duplicataFaceValue = faceValue;
    this.totalDesagio = desagioAmount;
    this.totalTaxes = taxAmount;
    this.netAmount = faceValue.subtract(desagioAmount).subtract(taxAmount);

    // Effective discount = (Face Value - Net Amount) / Face Value
    const totalDiscount = faceValue.subtract(this.netAmount);
    this.effectiveDiscount = Percentage.fromDecimal(
      totalDiscount.amount.dividedBy(faceValue.amount)
    );
  }

  getTotalDeductions(): Money {
    return this.totalDesagio.add(this.totalTaxes);
  }
}
