import Decimal from 'decimal.js';
import { DomainException } from '../exceptions/DomainException';

export class Percentage {
  private readonly _value: Decimal; // Stored as decimal (e.g., 0.05 for 5%)

  constructor(value: number | string | Decimal, isPercentageFormat: boolean = false) {
    // If isPercentageFormat=true, value=5 means 5%, otherwise value=0.05 means 5%
    this._value = isPercentageFormat
      ? new Decimal(value).dividedBy(100)
      : new Decimal(value);

    this.validate();
  }

  private validate(): void {
    if (this._value.isNegative()) {
      throw new DomainException('Percentage cannot be negative');
    }

    if (this._value.greaterThan(10)) { // 1000%
      throw new DomainException('Percentage value seems unrealistic');
    }
  }

  // Create from percentage format (5 = 5%)
  static fromPercentage(value: number | string): Percentage {
    return new Percentage(value, true);
  }

  // Create from decimal format (0.05 = 5%)
  static fromDecimal(value: number | string | Decimal): Percentage {
    return new Percentage(value, false);
  }

  toDecimal(): Decimal {
    return this._value;
  }

  toPercentageValue(): Decimal {
    return this._value.times(100);
  }

  add(other: Percentage): Percentage {
    return new Percentage(this._value.plus(other._value), false);
  }

  subtract(other: Percentage): Percentage {
    return new Percentage(this._value.minus(other._value), false);
  }

  multiply(factor: Decimal | number): Percentage {
    const multiplier = factor instanceof Decimal ? factor : new Decimal(factor);
    return new Percentage(this._value.times(multiplier), false);
  }

  isGreaterThan(other: Percentage): boolean {
    return this._value.greaterThan(other._value);
  }

  toString(): string {
    return `${this.toPercentageValue().toFixed(2)}%`;
  }

  toNumber(): number {
    return this._value.toNumber();
  }
}
