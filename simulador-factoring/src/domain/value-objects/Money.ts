import Decimal from 'decimal.js';
import { Currency } from '../enums/Currency';
import { DomainException } from '../exceptions/DomainException';
import { Percentage } from './Percentage';

export class Money {
  private readonly _amount: Decimal;
  private readonly _currency: Currency;

  constructor(amount: number | string | Decimal, currency: Currency = Currency.BRL) {
    this._amount = new Decimal(amount);
    this._currency = currency;

    // Validate decimal places (max 2 for currency)
    if (this._amount.decimalPlaces() > 2) {
      this._amount = this._amount.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    }
  }

  get amount(): Decimal {
    return this._amount;
  }

  get currency(): Currency {
    return this._currency;
  }

  // Arithmetic operations
  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this._amount.plus(other._amount), this._currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this._amount.minus(other._amount), this._currency);
  }

  multiply(multiplier: Decimal | Percentage | number): Money {
    let factor: Decimal;

    if (multiplier instanceof Percentage) {
      factor = multiplier.toDecimal();
    } else if (multiplier instanceof Decimal) {
      factor = multiplier;
    } else {
      factor = new Decimal(multiplier);
    }

    return new Money(this._amount.times(factor), this._currency);
  }

  divide(divisor: Decimal | number): Money {
    const factor = divisor instanceof Decimal ? divisor : new Decimal(divisor);
    return new Money(this._amount.dividedBy(factor), this._currency);
  }

  // Comparison operations
  isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount.greaterThan(other._amount);
  }

  isLessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount.lessThan(other._amount);
  }

  isLessThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount.lessThanOrEqualTo(other._amount);
  }

  isGreaterThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount.greaterThanOrEqualTo(other._amount);
  }

  // Rounding for tax calculations (Brazilian standard: ROUND_HALF_UP)
  roundToTaxStandard(): Money {
    return new Money(
      this._amount.toDecimalPlaces(2, Decimal.ROUND_HALF_UP),
      this._currency
    );
  }

  private ensureSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new DomainException('Cannot operate on different currencies');
    }
  }

  toNumber(): number {
    return this._amount.toNumber();
  }

  toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }
}
