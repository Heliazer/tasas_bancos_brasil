import Decimal from 'decimal.js';
import { Money } from './Money';
import { Percentage } from './Percentage';

export enum IOFEntityType {
  PESSOA_FISICA = 'PESSOA_FISICA',           // Individual person
  PESSOA_JURIDICA = 'PESSOA_JURIDICA',       // Legal entity (company)
  SIMPLES_NACIONAL_SMALL = 'SIMPLES_NACIONAL_SMALL'  // Simples Nacional < R$ 30k
}

/**
 * IOF (Imposto sobre Operações Financeiras) Calculation
 *
 * IOF applies to factoring operations despite companies not being financial institutions
 * because legislation defines factoring as "credit activity"
 *
 * The taxpayer is the person/company selling the credit rights to the factoring company,
 * but the factoring company acts as tax substitute (responsible for withholding and remitting)
 *
 * Based on Instrução Normativa RFB 1.543/2015
 */
export class IOFCalculation {
  readonly taxBase: Money;
  readonly entityType: IOFEntityType;
  readonly dailyRate: Percentage;
  readonly fixedRate: Percentage;
  readonly daysUntilMaturity: number;
  readonly dailyIOF: Money;
  readonly fixedIOF: Money;
  readonly totalIOFAmount: Money;
  readonly effectiveIOFRate: Percentage;

  constructor(
    netAmountPaid: Money,  // Amount paid to the seller (base for IOF)
    daysUntilMaturity: number,  // Days from operation date to maturity (max 365)
    entityType: IOFEntityType
  ) {
    this.taxBase = netAmountPaid;
    this.entityType = entityType;
    this.daysUntilMaturity = Math.min(daysUntilMaturity, 365); // Max 365 days

    // Set rates based on entity type (Instrução Normativa RFB 1.543/2015)
    switch (entityType) {
      case IOFEntityType.PESSOA_FISICA:
        this.dailyRate = Percentage.fromPercentage(0.0082); // 0.0082% per day
        this.fixedRate = Percentage.fromPercentage(0.38);    // 0.38% fixed
        break;

      case IOFEntityType.PESSOA_JURIDICA:
        this.dailyRate = Percentage.fromPercentage(0.0041); // 0.0041% per day
        this.fixedRate = Percentage.fromPercentage(0.38);    // 0.38% fixed
        break;

      case IOFEntityType.SIMPLES_NACIONAL_SMALL:
        // For Simples Nacional operations < R$ 30,000
        this.dailyRate = Percentage.fromPercentage(0.00137); // 0.00137% per day
        this.fixedRate = Percentage.fromPercentage(0.38);     // 0.38% fixed
        break;
    }

    // Calculate daily IOF: base * daily_rate * days
    const dailyRateDecimal = this.dailyRate.toDecimal();
    const dailyIOFDecimal = this.taxBase.amount
      .times(dailyRateDecimal)
      .times(new Decimal(this.daysUntilMaturity));

    this.dailyIOF = new Money(dailyIOFDecimal, this.taxBase.currency)
      .roundToTaxStandard();

    // Calculate fixed IOF: base * fixed_rate
    this.fixedIOF = this.taxBase
      .multiply(this.fixedRate)
      .roundToTaxStandard();

    // Total IOF = daily + fixed
    this.totalIOFAmount = this.dailyIOF
      .add(this.fixedIOF)
      .roundToTaxStandard();

    // Effective rate = total IOF / tax base
    this.effectiveIOFRate = Percentage.fromDecimal(
      this.totalIOFAmount.amount.dividedBy(this.taxBase.amount)
    );
  }

  /**
   * Returns a breakdown of the IOF calculation for display
   */
  getBreakdown(): {
    taxBase: number;
    entityType: string;
    daysUntilMaturity: number;
    dailyRate: number;
    fixedRate: number;
    dailyIOF: number;
    fixedIOF: number;
    totalIOF: number;
    effectiveRate: number;
  } {
    return {
      taxBase: this.taxBase.toNumber(),
      entityType: this.getEntityTypeLabel(),
      daysUntilMaturity: this.daysUntilMaturity,
      dailyRate: this.dailyRate.toPercentageValue().toNumber(),
      fixedRate: this.fixedRate.toPercentageValue().toNumber(),
      dailyIOF: this.dailyIOF.toNumber(),
      fixedIOF: this.fixedIOF.toNumber(),
      totalIOF: this.totalIOFAmount.toNumber(),
      effectiveRate: this.effectiveIOFRate.toPercentageValue().toNumber(),
    };
  }

  private getEntityTypeLabel(): string {
    switch (this.entityType) {
      case IOFEntityType.PESSOA_FISICA:
        return 'Pessoa Física';
      case IOFEntityType.PESSOA_JURIDICA:
        return 'Pessoa Jurídica';
      case IOFEntityType.SIMPLES_NACIONAL_SMALL:
        return 'Simples Nacional (< R$ 30k)';
    }
  }
}
