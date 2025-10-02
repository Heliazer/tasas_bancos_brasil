# Architecture Design: Simulador de Factoring
## Clean Architecture Design for Brazilian Fintech Factoring Platform

**Version**: 1.0
**Date**: 2025-10-02
**Author**: Claude Code (Fintech Architecture Specialist)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Domain Model Design](#domain-model-design)
3. [Use Case Layer](#use-case-layer)
4. [Business Rules & Calculation Logic](#business-rules--calculation-logic)
5. [Clean Architecture Layers](#clean-architecture-layers)
6. [Calculation Breakdown Structure](#calculation-breakdown-structure)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Testing Strategy](#testing-strategy)
9. [Regulatory Compliance Considerations](#regulatory-compliance-considerations)

---

## Executive Summary

The **Simulador de Factoring** is a core feature that allows users to simulate factoring operations following Brazilian regulations and tax laws. The system calculates the net amount a client receives after deducting the deságio (discount rate) and all applicable taxes (ISS, PIS, COFINS, and potentially IRPJ/CSLL).

### Key Design Principles

1. **Domain-Driven Design**: Business rules are central and independent of infrastructure
2. **Clean Architecture**: Strict separation of concerns across layers
3. **Precision First**: All financial calculations use exact decimal arithmetic
4. **Regulatory Compliance**: Built-in compliance with Lei nº 9.430/96 and Brazilian tax regulations
5. **Testability**: Every calculation is unit-testable without dependencies
6. **Auditability**: Complete traceability of all calculations

### Technology-Agnostic Design

This architecture is designed to be implemented in any modern language (TypeScript, Python, Java, C#). Key requirements:
- Decimal/BigDecimal types for financial calculations (avoid floating-point)
- Strong typing for domain entities
- Dependency injection support
- Event-driven capabilities for audit logging

---

## Domain Model Design

### 1. Core Domain Entities

#### 1.1 FactoringSimulation (Aggregate Root)

**Purpose**: Represents a complete factoring simulation with all calculations and results.

```typescript
// Domain Entity: FactoringSimulation
class FactoringSimulation {
  private readonly id: SimulationId;
  private readonly duplicata: Duplicata;
  private readonly operationParameters: OperationParameters;
  private readonly rateCalculation: RateCalculation;
  private readonly taxCalculations: TaxCalculations;
  private readonly netCalculation: NetCalculation;
  private readonly simulatedAt: DateTime;
  private readonly status: SimulationStatus;

  // Aggregate root ensures business invariants
  constructor(
    duplicata: Duplicata,
    operationParameters: OperationParameters,
    ratingEngine: IRatingEngine,
    taxEngine: ITaxEngine
  ) {
    // Validation rules
    this.validateDuplicata(duplicata);
    this.validateOperationParameters(operationParameters);

    // Calculate rates based on risk and parameters
    this.rateCalculation = ratingEngine.calculateRate(
      duplicata,
      operationParameters
    );

    // Calculate all applicable taxes
    this.taxCalculations = taxEngine.calculateTaxes(
      duplicata,
      this.rateCalculation
    );

    // Calculate final net amount
    this.netCalculation = this.calculateNetAmount();

    this.simulatedAt = DateTime.now();
    this.status = SimulationStatus.COMPLETED;
  }

  private calculateNetAmount(): NetCalculation {
    const duplicataAmount = this.duplicata.faceValue;
    const desagioAmount = this.rateCalculation.desagioAmount;
    const totalTaxes = this.taxCalculations.totalTaxAmount;

    const netAmount = duplicataAmount
      .subtract(desagioAmount)
      .subtract(totalTaxes);

    return new NetCalculation(
      duplicataAmount,
      desagioAmount,
      totalTaxes,
      netAmount
    );
  }

  // Business rule: Simulation must be profitable for both parties
  private validateBusinessViability(): void {
    if (this.netCalculation.netAmount.isLessThanOrEqual(ZERO)) {
      throw new DomainException(
        "Simulation results in zero or negative net amount"
      );
    }

    if (this.rateCalculation.effectiveAnnualRate.isGreaterThan(MAX_ALLOWED_RATE)) {
      throw new DomainException(
        "Calculated rate exceeds maximum allowed rate"
      );
    }
  }

  // Query methods
  getBreakdown(): SimulationBreakdown {
    return new SimulationBreakdown(
      this.duplicata,
      this.rateCalculation,
      this.taxCalculations,
      this.netCalculation
    );
  }
}
```

#### 1.2 Duplicata (Entity)

**Purpose**: Represents the Brazilian credit instrument being factored.

```typescript
class Duplicata {
  private readonly number: DuplicataNumber; // e.g., "DUP-2025-001234"
  private readonly issueDate: Date;
  private readonly dueDate: Date;
  private readonly faceValue: Money; // Valor de face
  private readonly debtor: Debtor; // Sacado (quem deve pagar)
  private readonly creditor: Creditor; // Cedente (empresa que vende o crédito)
  private readonly economicSector: EconomicSector;
  private readonly documentType: DuplicataType; // Duplicata de serviço ou mercadoria

  constructor(params: DuplicataParams) {
    this.validateDuplicataNumber(params.number);
    this.validateDates(params.issueDate, params.dueDate);
    this.validateAmount(params.faceValue);

    this.number = params.number;
    this.issueDate = params.issueDate;
    this.dueDate = params.dueDate;
    this.faceValue = params.faceValue;
    this.debtor = params.debtor;
    this.creditor = params.creditor;
    this.economicSector = params.economicSector;
    this.documentType = params.documentType;
  }

  // Business rule: Duplicata must not be expired
  private validateDates(issueDate: Date, dueDate: Date): void {
    if (dueDate <= issueDate) {
      throw new DomainException("Due date must be after issue date");
    }

    if (dueDate < DateTime.now()) {
      throw new DomainException("Cannot factor expired duplicata");
    }
  }

  // Business rule: Minimum and maximum values
  private validateAmount(amount: Money): void {
    if (amount.isLessThan(MIN_DUPLICATA_VALUE)) {
      throw new DomainException(
        `Duplicata value must be at least ${MIN_DUPLICATA_VALUE}`
      );
    }

    if (amount.isGreaterThan(MAX_DUPLICATA_VALUE)) {
      throw new DomainException(
        `Duplicata value exceeds maximum of ${MAX_DUPLICATA_VALUE}`
      );
    }
  }

  // Calculate days until maturity
  getDaysToMaturity(): number {
    return DateTime.now().daysUntil(this.dueDate);
  }

  // Calculate term in months for rate calculations
  getTermInMonths(): Decimal {
    return new Decimal(this.getDaysToMaturity()).divide(30);
  }
}
```

#### 1.3 OperationParameters (Value Object)

**Purpose**: Encapsulates the parameters that affect the factoring operation.

```typescript
class OperationParameters {
  readonly modality: FactoringModality; // WITH_RECOURSE | WITHOUT_RECOURSE
  readonly clientRiskProfile: RiskProfile; // A, B, C, D, E
  readonly debtorCreditRating: CreditRating;
  readonly operationVolume: OperationVolume; // SMALL | MEDIUM | LARGE
  readonly isRecurringClient: boolean;
  readonly taxRegime: TaxRegime; // SIMPLES_NACIONAL | LUCRO_PRESUMIDO | LUCRO_REAL
  readonly municipality: Municipality; // For ISS calculation

  constructor(params: OperationParametersInput) {
    this.validateParameters(params);
    Object.assign(this, params);
  }

  private validateParameters(params: OperationParametersInput): void {
    if (!params.modality) {
      throw new DomainException("Factoring modality is required");
    }

    if (!params.taxRegime) {
      throw new DomainException("Tax regime is required");
    }

    if (!params.municipality) {
      throw new DomainException("Municipality is required for ISS calculation");
    }
  }
}
```

### 2. Value Objects

#### 2.1 Money (Value Object)

**Purpose**: Represents monetary values with proper precision and currency.

```typescript
class Money {
  private readonly amount: Decimal; // Using decimal for precision
  private readonly currency: Currency;

  constructor(amount: number | string | Decimal, currency: Currency = Currency.BRL) {
    this.amount = new Decimal(amount);
    this.currency = currency;

    if (this.amount.decimalPlaces() > 2) {
      throw new DomainException("Money cannot have more than 2 decimal places");
    }
  }

  // Arithmetic operations
  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount.add(other.amount), this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount.subtract(other.amount), this.currency);
  }

  multiply(multiplier: Decimal | Percentage): Money {
    const factor = multiplier instanceof Percentage
      ? multiplier.toDecimal()
      : multiplier;
    return new Money(this.amount.multiply(factor), this.currency);
  }

  // Comparison operations
  isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amount.greaterThan(other.amount);
  }

  isLessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amount.lessThan(other.amount);
  }

  // Rounding for tax calculations (Brazilian standard: ROUND_HALF_UP)
  roundToTaxStandard(): Money {
    return new Money(
      this.amount.toDecimalPlaces(2, Decimal.ROUND_HALF_UP),
      this.currency
    );
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new DomainException("Cannot operate on different currencies");
    }
  }
}
```

#### 2.2 Percentage (Value Object)

**Purpose**: Represents percentage values with proper precision.

```typescript
class Percentage {
  private readonly value: Decimal; // Stored as decimal (e.g., 0.05 for 5%)

  constructor(value: number | string | Decimal, isPercentageFormat: boolean = false) {
    // If isPercentageFormat=true, value=5 means 5%, otherwise value=0.05 means 5%
    this.value = isPercentageFormat
      ? new Decimal(value).divide(100)
      : new Decimal(value);

    this.validate();
  }

  private validate(): void {
    if (this.value.isNegative()) {
      throw new DomainException("Percentage cannot be negative");
    }

    if (this.value.greaterThan(10)) { // 1000%
      throw new DomainException("Percentage value seems unrealistic");
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
    return this.value;
  }

  toPercentageValue(): Decimal {
    return this.value.multiply(100);
  }

  add(other: Percentage): Percentage {
    return new Percentage(this.value.add(other.value), false);
  }

  multiply(factor: Decimal): Percentage {
    return new Percentage(this.value.multiply(factor), false);
  }

  toString(): string {
    return `${this.toPercentageValue().toFixed(2)}%`;
  }
}
```

#### 2.3 RateCalculation (Value Object)

**Purpose**: Encapsulates all rate-related calculations including deságio.

```typescript
class RateCalculation {
  readonly baseMonthlyRate: Percentage; // Taxa base mensal
  readonly riskAdjustment: Percentage; // Ajuste de risco
  readonly modalityAdjustment: Percentage; // Ajuste por modalidade
  readonly volumeDiscount: Percentage; // Desconto por volume
  readonly finalMonthlyRate: Percentage; // Taxa final mensal
  readonly effectiveAnnualRate: Percentage; // Taxa efetiva anual
  readonly desagioPercentage: Percentage; // Deságio % sobre o valor de face
  readonly desagioAmount: Money; // Deságio em R$
  readonly calculationMetadata: CalculationMetadata;

  constructor(
    duplicata: Duplicata,
    parameters: OperationParameters,
    ratingFactors: RatingFactors
  ) {
    // Calculate base rate from market conditions
    this.baseMonthlyRate = this.calculateBaseRate(parameters);

    // Apply risk adjustments
    this.riskAdjustment = this.calculateRiskAdjustment(
      parameters.clientRiskProfile,
      parameters.debtorCreditRating,
      ratingFactors
    );

    // Modality adjustment (with recourse = lower, without = higher)
    this.modalityAdjustment = this.calculateModalityAdjustment(
      parameters.modality
    );

    // Volume discount (larger operations get better rates)
    this.volumeDiscount = this.calculateVolumeDiscount(
      duplicata.faceValue,
      parameters.operationVolume
    );

    // Calculate final monthly rate
    this.finalMonthlyRate = this.baseMonthlyRate
      .add(this.riskAdjustment)
      .add(this.modalityAdjustment)
      .multiply(new Decimal(1).subtract(this.volumeDiscount.toDecimal()));

    // Convert to effective annual rate: (1 + r)^12 - 1
    const monthlyDecimal = this.finalMonthlyRate.toDecimal();
    const annualFactor = monthlyDecimal.add(1).pow(12).subtract(1);
    this.effectiveAnnualRate = Percentage.fromDecimal(annualFactor);

    // Calculate deságio based on term
    this.desagioPercentage = this.calculateDesagio(
      this.finalMonthlyRate,
      duplicata.getTermInMonths()
    );

    this.desagioAmount = duplicata.faceValue
      .multiply(this.desagioPercentage)
      .roundToTaxStandard();

    this.calculationMetadata = new CalculationMetadata(
      DateTime.now(),
      ratingFactors
    );
  }

  private calculateBaseRate(parameters: OperationParameters): Percentage {
    // Base rate varies by sector and market conditions
    // This would typically come from a rate table or market data service
    const sectorRates = {
      [EconomicSector.RETAIL]: Percentage.fromPercentage(2.5),
      [EconomicSector.SERVICES]: Percentage.fromPercentage(3.0),
      [EconomicSector.INDUSTRY]: Percentage.fromPercentage(2.8),
      [EconomicSector.CONSTRUCTION]: Percentage.fromPercentage(3.5),
      [EconomicSector.HEALTHCARE]: Percentage.fromPercentage(2.3),
    };

    return sectorRates[parameters.economicSector] || Percentage.fromPercentage(3.0);
  }

  private calculateRiskAdjustment(
    clientProfile: RiskProfile,
    debtorRating: CreditRating,
    factors: RatingFactors
  ): Percentage {
    // Risk profiles: A (best) to E (worst)
    const clientRiskPremium = {
      [RiskProfile.A]: Percentage.fromPercentage(0.0),
      [RiskProfile.B]: Percentage.fromPercentage(0.3),
      [RiskProfile.C]: Percentage.fromPercentage(0.7),
      [RiskProfile.D]: Percentage.fromPercentage(1.2),
      [RiskProfile.E]: Percentage.fromPercentage(2.0),
    };

    const debtorRiskPremium = {
      [CreditRating.AAA]: Percentage.fromPercentage(0.0),
      [CreditRating.AA]: Percentage.fromPercentage(0.2),
      [CreditRating.A]: Percentage.fromPercentage(0.4),
      [CreditRating.BBB]: Percentage.fromPercentage(0.7),
      [CreditRating.BB]: Percentage.fromPercentage(1.0),
      [CreditRating.B]: Percentage.fromPercentage(1.5),
      [CreditRating.CCC]: Percentage.fromPercentage(2.5),
    };

    return clientRiskPremium[clientProfile]
      .add(debtorRiskPremium[debtorRating]);
  }

  private calculateModalityAdjustment(modality: FactoringModality): Percentage {
    // Without recourse is riskier, so higher premium
    return modality === FactoringModality.WITHOUT_RECOURSE
      ? Percentage.fromPercentage(1.0)
      : Percentage.fromPercentage(0.0);
  }

  private calculateVolumeDiscount(
    faceValue: Money,
    volume: OperationVolume
  ): Percentage {
    // Larger operations get better rates
    const discounts = {
      [OperationVolume.SMALL]: Percentage.fromPercentage(0.0),    // 0%
      [OperationVolume.MEDIUM]: Percentage.fromPercentage(5.0),   // 5%
      [OperationVolume.LARGE]: Percentage.fromPercentage(10.0),   // 10%
    };

    return discounts[volume];
  }

  private calculateDesagio(
    monthlyRate: Percentage,
    termInMonths: Decimal
  ): Percentage {
    // Deságio calculation: simple interest for short-term operations
    // Formula: Deságio = Rate × Term
    // For operations < 3 months, use simple interest
    // For operations >= 3 months, could use compound interest

    if (termInMonths.lessThanOrEqualTo(3)) {
      // Simple interest: D = r × t
      return Percentage.fromDecimal(
        monthlyRate.toDecimal().multiply(termInMonths)
      );
    } else {
      // Compound interest: D = 1 - (1 / (1 + r)^t)
      const onePlusRate = monthlyRate.toDecimal().add(1);
      const compoundFactor = onePlusRate.pow(termInMonths.toNumber());
      const desagioDecimal = new Decimal(1).subtract(
        new Decimal(1).divide(compoundFactor)
      );
      return Percentage.fromDecimal(desagioDecimal);
    }
  }
}
```

#### 2.4 TaxCalculations (Value Object)

**Purpose**: Encapsulates all tax calculations for the factoring operation.

```typescript
class TaxCalculations {
  readonly issCalculation: ISSCalculation;
  readonly pisCalculation: PISCalculation;
  readonly cofinsCalculation: COFINSCalculation;
  readonly irpjCalculation?: IRPJCalculation; // Optional, depends on tax regime
  readonly csllCalculation?: CSLLCalculation; // Optional, depends on tax regime
  readonly iofCalculation?: IOFCalculation; // Rarely applicable
  readonly totalTaxAmount: Money;
  readonly effectiveTaxRate: Percentage;

  constructor(
    duplicata: Duplicata,
    rateCalculation: RateCalculation,
    parameters: OperationParameters
  ) {
    // ISS is calculated on the deságio (service fee)
    this.issCalculation = new ISSCalculation(
      rateCalculation.desagioAmount,
      parameters.municipality
    );

    // PIS/COFINS on gross revenue (deságio)
    this.pisCalculation = new PISCalculation(
      rateCalculation.desagioAmount,
      parameters.taxRegime
    );

    this.cofinsCalculation = new COFINSCalculation(
      rateCalculation.desagioAmount,
      parameters.taxRegime
    );

    // IRPJ/CSLL only if using Lucro Real or Lucro Presumido
    if (parameters.taxRegime !== TaxRegime.SIMPLES_NACIONAL) {
      this.irpjCalculation = new IRPJCalculation(
        rateCalculation.desagioAmount,
        parameters.taxRegime
      );

      this.csllCalculation = new CSLLCalculation(
        rateCalculation.desagioAmount,
        parameters.taxRegime
      );
    }

    // Calculate totals
    this.totalTaxAmount = this.calculateTotalTax();

    this.effectiveTaxRate = Percentage.fromDecimal(
      this.totalTaxAmount.amount.divide(duplicata.faceValue.amount)
    );
  }

  private calculateTotalTax(): Money {
    let total = this.issCalculation.taxAmount
      .add(this.pisCalculation.taxAmount)
      .add(this.cofinsCalculation.taxAmount);

    if (this.irpjCalculation) {
      total = total.add(this.irpjCalculation.taxAmount);
    }

    if (this.csllCalculation) {
      total = total.add(this.csllCalculation.taxAmount);
    }

    if (this.iofCalculation) {
      total = total.add(this.iofCalculation.taxAmount);
    }

    return total.roundToTaxStandard();
  }
}
```

#### 2.5 Individual Tax Calculations

```typescript
class ISSCalculation {
  readonly taxBase: Money; // Base de cálculo (deságio)
  readonly taxRate: Percentage; // Alíquota (2% a 5%)
  readonly taxAmount: Money; // Valor do imposto
  readonly municipality: Municipality;

  constructor(desagioAmount: Money, municipality: Municipality) {
    this.municipality = municipality;
    this.taxBase = desagioAmount;

    // ISS rate varies by municipality (2% to 5%)
    this.taxRate = this.getISSRate(municipality);

    this.taxAmount = this.taxBase
      .multiply(this.taxRate)
      .roundToTaxStandard();
  }

  private getISSRate(municipality: Municipality): Percentage {
    // This would come from a municipality tax table
    // Most municipalities: 2% to 5% for factoring services
    return municipality.issRateForFactoring || Percentage.fromPercentage(3.0);
  }
}

class PISCalculation {
  readonly taxBase: Money;
  readonly taxRate: Percentage;
  readonly taxAmount: Money;
  readonly regime: PISTaxRegime;

  constructor(desagioAmount: Money, taxRegime: TaxRegime) {
    this.taxBase = desagioAmount;

    // PIS rate depends on regime
    if (taxRegime === TaxRegime.SIMPLES_NACIONAL) {
      // Simples Nacional has combined rate
      this.regime = PISTaxRegime.SIMPLES_NACIONAL;
      this.taxRate = Percentage.fromPercentage(0); // Included in DAS
    } else if (taxRegime === TaxRegime.LUCRO_PRESUMIDO) {
      this.regime = PISTaxRegime.CUMULATIVE;
      this.taxRate = Percentage.fromPercentage(0.65);
    } else {
      // Lucro Real - non-cumulative
      this.regime = PISTaxRegime.NON_CUMULATIVE;
      this.taxRate = Percentage.fromPercentage(1.65);
    }

    this.taxAmount = this.taxBase
      .multiply(this.taxRate)
      .roundToTaxStandard();
  }
}

class COFINSCalculation {
  readonly taxBase: Money;
  readonly taxRate: Percentage;
  readonly taxAmount: Money;
  readonly regime: COFINSTaxRegime;

  constructor(desagioAmount: Money, taxRegime: TaxRegime) {
    this.taxBase = desagioAmount;

    // COFINS rate depends on regime
    if (taxRegime === TaxRegime.SIMPLES_NACIONAL) {
      this.regime = COFINSTaxRegime.SIMPLES_NACIONAL;
      this.taxRate = Percentage.fromPercentage(0); // Included in DAS
    } else if (taxRegime === TaxRegime.LUCRO_PRESUMIDO) {
      this.regime = COFINSTaxRegime.CUMULATIVE;
      this.taxRate = Percentage.fromPercentage(3.0);
    } else {
      // Lucro Real - non-cumulative
      this.regime = COFINSTaxRegime.NON_CUMULATIVE;
      this.taxRate = Percentage.fromPercentage(7.6);
    }

    this.taxAmount = this.taxBase
      .multiply(this.taxRate)
      .roundToTaxStandard();
  }
}

class IRPJCalculation {
  readonly taxBase: Money;
  readonly presumedProfitPercentage: Percentage;
  readonly taxableProfit: Money;
  readonly taxRate: Percentage;
  readonly taxAmount: Money;

  constructor(desagioAmount: Money, taxRegime: TaxRegime) {
    this.taxBase = desagioAmount;

    if (taxRegime === TaxRegime.LUCRO_PRESUMIDO) {
      // Lucro Presumido: 32% of revenue is considered profit
      this.presumedProfitPercentage = Percentage.fromPercentage(32);
      this.taxableProfit = this.taxBase.multiply(this.presumedProfitPercentage);
      this.taxRate = Percentage.fromPercentage(15); // 15% on profit

      this.taxAmount = this.taxableProfit
        .multiply(this.taxRate)
        .roundToTaxStandard();
    } else {
      // Lucro Real: calculated on actual profit (would need full P&L)
      // For simulation, we can estimate or mark as "to be calculated"
      this.presumedProfitPercentage = Percentage.fromPercentage(0);
      this.taxableProfit = new Money(0);
      this.taxRate = Percentage.fromPercentage(15);
      this.taxAmount = new Money(0);
    }
  }
}

class CSLLCalculation {
  readonly taxBase: Money;
  readonly presumedProfitPercentage: Percentage;
  readonly taxableProfit: Money;
  readonly taxRate: Percentage;
  readonly taxAmount: Money;

  constructor(desagioAmount: Money, taxRegime: TaxRegime) {
    this.taxBase = desagioAmount;

    if (taxRegime === TaxRegime.LUCRO_PRESUMIDO) {
      // CSLL also uses 32% presumed profit
      this.presumedProfitPercentage = Percentage.fromPercentage(32);
      this.taxableProfit = this.taxBase.multiply(this.presumedProfitPercentage);
      this.taxRate = Percentage.fromPercentage(9); // 9% on profit

      this.taxAmount = this.taxableProfit
        .multiply(this.taxRate)
        .roundToTaxStandard();
    } else {
      this.presumedProfitPercentage = Percentage.fromPercentage(0);
      this.taxableProfit = new Money(0);
      this.taxRate = Percentage.fromPercentage(9);
      this.taxAmount = new Money(0);
    }
  }
}
```

#### 2.6 NetCalculation (Value Object)

```typescript
class NetCalculation {
  readonly duplicataFaceValue: Money;
  readonly totalDesagio: Money;
  readonly totalTaxes: Money;
  readonly netAmount: Money; // What client receives
  readonly effectiveDiscount: Percentage; // Total discount %

  constructor(
    faceValue: Money,
    desagioAmount: Money,
    taxAmount: Money,
    netAmount: Money
  ) {
    this.duplicataFaceValue = faceValue;
    this.totalDesagio = desagioAmount;
    this.totalTaxes = taxAmount;
    this.netAmount = netAmount;

    // Effective discount = (Face Value - Net Amount) / Face Value
    const totalDiscount = faceValue.subtract(netAmount);
    this.effectiveDiscount = Percentage.fromDecimal(
      totalDiscount.amount.divide(faceValue.amount)
    );
  }

  getTotalDeductions(): Money {
    return this.totalDesagio.add(this.totalTaxes);
  }
}
```

### 3. Domain Services

#### 3.1 IRatingEngine (Domain Service Interface)

```typescript
interface IRatingEngine {
  calculateRate(
    duplicata: Duplicata,
    parameters: OperationParameters
  ): RateCalculation;

  getRatingFactors(
    clientId: ClientId,
    debtorId: DebtorId
  ): Promise<RatingFactors>;
}
```

#### 3.2 ITaxEngine (Domain Service Interface)

```typescript
interface ITaxEngine {
  calculateTaxes(
    duplicata: Duplicata,
    rateCalculation: RateCalculation,
    parameters: OperationParameters
  ): TaxCalculations;

  getMunicipalityTaxRates(
    municipality: Municipality
  ): MunicipalityTaxRates;
}
```

### 4. Enumerations

```typescript
enum FactoringModality {
  WITH_RECOURSE = "WITH_RECOURSE",        // Com regresso
  WITHOUT_RECOURSE = "WITHOUT_RECOURSE"   // Sem regresso
}

enum RiskProfile {
  A = "A", // Best
  B = "B",
  C = "C",
  D = "D",
  E = "E"  // Worst
}

enum CreditRating {
  AAA = "AAA",
  AA = "AA",
  A = "A",
  BBB = "BBB",
  BB = "BB",
  B = "B",
  CCC = "CCC"
}

enum TaxRegime {
  SIMPLES_NACIONAL = "SIMPLES_NACIONAL",
  LUCRO_PRESUMIDO = "LUCRO_PRESUMIDO",
  LUCRO_REAL = "LUCRO_REAL"
}

enum EconomicSector {
  RETAIL = "RETAIL",
  SERVICES = "SERVICES",
  INDUSTRY = "INDUSTRY",
  CONSTRUCTION = "CONSTRUCTION",
  HEALTHCARE = "HEALTHCARE",
  AGRICULTURE = "AGRICULTURE",
  TECHNOLOGY = "TECHNOLOGY",
  OTHER = "OTHER"
}

enum OperationVolume {
  SMALL = "SMALL",     // < R$ 50,000
  MEDIUM = "MEDIUM",   // R$ 50,000 - R$ 500,000
  LARGE = "LARGE"      // > R$ 500,000
}

enum SimulationStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}
```

---

## Use Case Layer

### Primary Use Case: SimulateFactoring

**Purpose**: Orchestrates the factoring simulation workflow, coordinating domain services and entities.

```typescript
// Application Layer: Use Case
class SimulateFactoringUseCase {
  constructor(
    private readonly ratingEngine: IRatingEngine,
    private readonly taxEngine: ITaxEngine,
    private readonly simulationRepository: ISimulationRepository,
    private readonly eventBus: IEventBus,
    private readonly logger: ILogger
  ) {}

  async execute(
    request: SimulateFactoringRequest
  ): Promise<SimulateFactoringResponse> {
    try {
      // 1. Validate input
      this.validateRequest(request);

      // 2. Build domain entities from DTOs
      const duplicata = this.buildDuplicata(request.duplicataData);
      const operationParameters = this.buildOperationParameters(
        request.operationParameters
      );

      // 3. Fetch rating factors (external data)
      const ratingFactors = await this.ratingEngine.getRatingFactors(
        request.clientId,
        request.duplicataData.debtorId
      );

      // 4. Create simulation (domain logic executes here)
      const simulation = new FactoringSimulation(
        duplicata,
        operationParameters,
        this.ratingEngine,
        this.taxEngine
      );

      // 5. Persist simulation for audit trail
      await this.simulationRepository.save(simulation);

      // 6. Publish domain event
      await this.eventBus.publish(
        new FactoringSimulationCompletedEvent(simulation.id)
      );

      // 7. Return response DTO
      return this.buildResponse(simulation);

    } catch (error) {
      this.logger.error("Simulation failed", { error, request });

      if (error instanceof DomainException) {
        throw new ApplicationException(error.message, error);
      }

      throw new ApplicationException("Unexpected error during simulation");
    }
  }

  private validateRequest(request: SimulateFactoringRequest): void {
    if (!request.duplicataData) {
      throw new ValidationException("Duplicata data is required");
    }

    if (!request.operationParameters) {
      throw new ValidationException("Operation parameters are required");
    }

    if (!request.clientId) {
      throw new ValidationException("Client ID is required");
    }
  }

  private buildDuplicata(data: DuplicataInputDTO): Duplicata {
    return new Duplicata({
      number: new DuplicataNumber(data.number),
      issueDate: new Date(data.issueDate),
      dueDate: new Date(data.dueDate),
      faceValue: new Money(data.faceValue),
      debtor: new Debtor(data.debtor),
      creditor: new Creditor(data.creditor),
      economicSector: data.economicSector,
      documentType: data.documentType
    });
  }

  private buildOperationParameters(
    data: OperationParametersInputDTO
  ): OperationParameters {
    return new OperationParameters({
      modality: data.modality,
      clientRiskProfile: data.clientRiskProfile,
      debtorCreditRating: data.debtorCreditRating,
      operationVolume: this.determineOperationVolume(data.duplicataFaceValue),
      isRecurringClient: data.isRecurringClient,
      taxRegime: data.taxRegime,
      municipality: new Municipality(data.municipalityCode)
    });
  }

  private determineOperationVolume(faceValue: number): OperationVolume {
    if (faceValue < 50000) return OperationVolume.SMALL;
    if (faceValue < 500000) return OperationVolume.MEDIUM;
    return OperationVolume.LARGE;
  }

  private buildResponse(
    simulation: FactoringSimulation
  ): SimulateFactoringResponse {
    const breakdown = simulation.getBreakdown();

    return {
      simulationId: simulation.id.value,
      duplicataInfo: this.buildDuplicataInfo(breakdown.duplicata),
      rateCalculation: this.buildRateCalculationDTO(breakdown.rateCalculation),
      taxCalculations: this.buildTaxCalculationsDTO(breakdown.taxCalculations),
      netCalculation: this.buildNetCalculationDTO(breakdown.netCalculation),
      simulatedAt: simulation.simulatedAt.toISOString(),
      status: simulation.status
    };
  }

  // DTO mapping methods...
  private buildDuplicataInfo(duplicata: Duplicata): DuplicataInfoDTO {
    return {
      number: duplicata.number.value,
      faceValue: duplicata.faceValue.amount.toNumber(),
      dueDate: duplicata.dueDate.toISOString(),
      daysToMaturity: duplicata.getDaysToMaturity(),
      debtor: {
        name: duplicata.debtor.name,
        document: duplicata.debtor.document
      }
    };
  }

  private buildRateCalculationDTO(
    rateCalc: RateCalculation
  ): RateCalculationDTO {
    return {
      baseMonthlyRate: rateCalc.baseMonthlyRate.toPercentageValue().toNumber(),
      riskAdjustment: rateCalc.riskAdjustment.toPercentageValue().toNumber(),
      modalityAdjustment: rateCalc.modalityAdjustment.toPercentageValue().toNumber(),
      volumeDiscount: rateCalc.volumeDiscount.toPercentageValue().toNumber(),
      finalMonthlyRate: rateCalc.finalMonthlyRate.toPercentageValue().toNumber(),
      effectiveAnnualRate: rateCalc.effectiveAnnualRate.toPercentageValue().toNumber(),
      desagioPercentage: rateCalc.desagioPercentage.toPercentageValue().toNumber(),
      desagioAmount: rateCalc.desagioAmount.amount.toNumber()
    };
  }

  private buildTaxCalculationsDTO(
    taxCalcs: TaxCalculations
  ): TaxCalculationsDTO {
    return {
      iss: {
        taxBase: taxCalcs.issCalculation.taxBase.amount.toNumber(),
        rate: taxCalcs.issCalculation.taxRate.toPercentageValue().toNumber(),
        amount: taxCalcs.issCalculation.taxAmount.amount.toNumber()
      },
      pis: {
        taxBase: taxCalcs.pisCalculation.taxBase.amount.toNumber(),
        rate: taxCalcs.pisCalculation.taxRate.toPercentageValue().toNumber(),
        amount: taxCalcs.pisCalculation.taxAmount.amount.toNumber()
      },
      cofins: {
        taxBase: taxCalcs.cofinsCalculation.taxBase.amount.toNumber(),
        rate: taxCalcs.cofinsCalculation.taxRate.toPercentageValue().toNumber(),
        amount: taxCalcs.cofinsCalculation.taxAmount.amount.toNumber()
      },
      irpj: taxCalcs.irpjCalculation ? {
        taxBase: taxCalcs.irpjCalculation.taxBase.amount.toNumber(),
        rate: taxCalcs.irpjCalculation.taxRate.toPercentageValue().toNumber(),
        amount: taxCalcs.irpjCalculation.taxAmount.amount.toNumber()
      } : null,
      csll: taxCalcs.csllCalculation ? {
        taxBase: taxCalcs.csllCalculation.taxBase.amount.toNumber(),
        rate: taxCalcs.csllCalculation.taxRate.toPercentageValue().toNumber(),
        amount: taxCalcs.csllCalculation.taxAmount.amount.toNumber()
      } : null,
      totalTaxAmount: taxCalcs.totalTaxAmount.amount.toNumber(),
      effectiveTaxRate: taxCalcs.effectiveTaxRate.toPercentageValue().toNumber()
    };
  }

  private buildNetCalculationDTO(
    netCalc: NetCalculation
  ): NetCalculationDTO {
    return {
      duplicataFaceValue: netCalc.duplicataFaceValue.amount.toNumber(),
      totalDesagio: netCalc.totalDesagio.amount.toNumber(),
      totalTaxes: netCalc.totalTaxes.amount.toNumber(),
      netAmount: netCalc.netAmount.amount.toNumber(),
      effectiveDiscount: netCalc.effectiveDiscount.toPercentageValue().toNumber()
    };
  }
}
```

### Input/Output DTOs

```typescript
// Input DTO
interface SimulateFactoringRequest {
  clientId: string;
  duplicataData: DuplicataInputDTO;
  operationParameters: OperationParametersInputDTO;
}

interface DuplicataInputDTO {
  number: string;
  issueDate: string; // ISO date
  dueDate: string; // ISO date
  faceValue: number;
  debtor: {
    id: string;
    name: string;
    document: string; // CNPJ
    economicSector: EconomicSector;
  };
  creditor: {
    id: string;
    name: string;
    document: string; // CNPJ
  };
  documentType: DuplicataType;
  economicSector: EconomicSector;
}

interface OperationParametersInputDTO {
  modality: FactoringModality;
  clientRiskProfile: RiskProfile;
  debtorCreditRating: CreditRating;
  duplicataFaceValue: number;
  isRecurringClient: boolean;
  taxRegime: TaxRegime;
  municipalityCode: string; // IBGE code
}

// Output DTO
interface SimulateFactoringResponse {
  simulationId: string;
  duplicataInfo: DuplicataInfoDTO;
  rateCalculation: RateCalculationDTO;
  taxCalculations: TaxCalculationsDTO;
  netCalculation: NetCalculationDTO;
  simulatedAt: string;
  status: SimulationStatus;
}

interface DuplicataInfoDTO {
  number: string;
  faceValue: number;
  dueDate: string;
  daysToMaturity: number;
  debtor: {
    name: string;
    document: string;
  };
}

interface RateCalculationDTO {
  baseMonthlyRate: number; // As percentage (e.g., 2.5 = 2.5%)
  riskAdjustment: number;
  modalityAdjustment: number;
  volumeDiscount: number;
  finalMonthlyRate: number;
  effectiveAnnualRate: number;
  desagioPercentage: number;
  desagioAmount: number;
}

interface TaxCalculationsDTO {
  iss: TaxDetailDTO;
  pis: TaxDetailDTO;
  cofins: TaxDetailDTO;
  irpj: TaxDetailDTO | null;
  csll: TaxDetailDTO | null;
  totalTaxAmount: number;
  effectiveTaxRate: number;
}

interface TaxDetailDTO {
  taxBase: number;
  rate: number; // As percentage
  amount: number;
}

interface NetCalculationDTO {
  duplicataFaceValue: number;
  totalDesagio: number;
  totalTaxes: number;
  netAmount: number;
  effectiveDiscount: number; // As percentage
}
```

---

## Business Rules & Calculation Logic

### 1. Deságio Calculation Formula

**Definition**: Deságio is the discount applied to the face value of the duplicata, representing the factor's service fee and profit.

**Calculation Method**:

```
For short-term operations (≤ 3 months):
  Deságio % = Monthly Rate × Term in Months
  Deságio Amount = Face Value × Deságio %

For medium/long-term operations (> 3 months):
  Deságio % = 1 - (1 / (1 + Monthly Rate)^Term)
  Deságio Amount = Face Value × Deságio %
```

**Example**:
```
Face Value: R$ 100,000
Monthly Rate: 3% (0.03)
Term: 60 days (2 months)

Deságio % = 3% × 2 = 6%
Deságio Amount = R$ 100,000 × 0.06 = R$ 6,000
```

### 2. ISS Tax Calculation

**Legal Base**: Municipal tax on services (Lei Complementar 116/2003)

**Rate**: 2% to 5% depending on municipality (most use 2-5%)

**Tax Base**: Controversial - should be calculated only on the deságio (service fee), not on the full duplicata value

**Formula**:
```
ISS Base = Deságio Amount
ISS Rate = Municipality Rate (typically 2-5%)
ISS Amount = ISS Base × ISS Rate
```

**Example**:
```
Deságio Amount: R$ 6,000
ISS Rate: 3% (São Paulo)

ISS Amount = R$ 6,000 × 0.03 = R$ 180
```

**Compliance Note**: The base calculation is subject to legal interpretation. Some municipalities may attempt to tax the full operation value. Our system calculates on deságio, which is the legally defensible position per Lei Complementar 116/2003.

### 3. PIS Tax Calculation

**Legal Base**: Lei nº 10.637/2002 (non-cumulative) and Lei nº 9.715/1998 (cumulative)

**Tax Base**: Gross revenue (deságio)

**Rates**:
- Cumulative regime (Lucro Presumido): 0.65%
- Non-cumulative regime (Lucro Real): 1.65%
- Simples Nacional: Included in DAS payment

**Formula**:
```
PIS Base = Deságio Amount
PIS Rate = 0.65% (cumulative) or 1.65% (non-cumulative)
PIS Amount = PIS Base × PIS Rate
```

**Example** (Lucro Presumido):
```
Deságio Amount: R$ 6,000
PIS Rate: 0.65%

PIS Amount = R$ 6,000 × 0.0065 = R$ 39
```

### 4. COFINS Tax Calculation

**Legal Base**: Lei nº 10.833/2003 (non-cumulative) and Lei nº 9.718/1998 (cumulative)

**Tax Base**: Gross revenue (deságio)

**Rates**:
- Cumulative regime (Lucro Presumido): 3.0%
- Non-cumulative regime (Lucro Real): 7.6%
- Simples Nacional: Included in DAS payment

**Formula**:
```
COFINS Base = Deságio Amount
COFINS Rate = 3.0% (cumulative) or 7.6% (non-cumulative)
COFINS Amount = COFINS Base × COFINS Rate
```

**Example** (Lucro Presumido):
```
Deságio Amount: R$ 6,000
COFINS Rate: 3.0%

COFINS Amount = R$ 6,000 × 0.03 = R$ 180
```

### 5. IRPJ Tax Calculation

**Legal Base**: Lei nº 9.430/96

**Application**: Only for Lucro Presumido or Lucro Real regimes

**For Lucro Presumido**:
- Presumed profit: 32% of gross revenue
- IRPJ rate: 15% on profit (+ 10% additional on profit exceeding R$ 20,000/month)

**Formula**:
```
Taxable Profit = Deságio Amount × 32%
IRPJ Amount = Taxable Profit × 15%
(+ additional 10% if monthly profit > R$ 20,000)
```

**Example**:
```
Deságio Amount: R$ 6,000
Presumed Profit: R$ 6,000 × 0.32 = R$ 1,920
IRPJ Amount: R$ 1,920 × 0.15 = R$ 288
```

**For Lucro Real**: Calculated on actual profit, requires full P&L analysis

### 6. CSLL Tax Calculation

**Legal Base**: Lei nº 7.689/88

**Application**: Only for Lucro Presumido or Lucro Real regimes

**For Lucro Presumido**:
- Presumed profit: 32% of gross revenue
- CSLL rate: 9% on profit

**Formula**:
```
Taxable Profit = Deságio Amount × 32%
CSLL Amount = Taxable Profit × 9%
```

**Example**:
```
Deságio Amount: R$ 6,000
Presumed Profit: R$ 6,000 × 0.32 = R$ 1,920
CSLL Amount: R$ 1,920 × 0.09 = R$ 172.80
```

### 7. Net Amount Calculation

**Formula**:
```
Net Amount = Face Value - Deságio - Total Taxes

Where:
Total Taxes = ISS + PIS + COFINS + IRPJ + CSLL

Effective Discount % = (Face Value - Net Amount) / Face Value × 100
```

**Complete Example** (Lucro Presumido, São Paulo):

```
Input:
- Face Value: R$ 100,000
- Term: 60 days (2 months)
- Monthly Rate: 3%
- Tax Regime: Lucro Presumido
- Municipality: São Paulo (ISS 3%)

Calculations:
1. Deságio = R$ 100,000 × 6% = R$ 6,000

2. ISS = R$ 6,000 × 3% = R$ 180

3. PIS = R$ 6,000 × 0.65% = R$ 39

4. COFINS = R$ 6,000 × 3% = R$ 180

5. IRPJ = (R$ 6,000 × 32%) × 15% = R$ 288

6. CSLL = (R$ 6,000 × 32%) × 9% = R$ 172.80

7. Total Taxes = R$ 180 + R$ 39 + R$ 180 + R$ 288 + R$ 172.80 = R$ 859.80

8. Net Amount = R$ 100,000 - R$ 6,000 - R$ 859.80 = R$ 93,140.20

9. Effective Discount = (R$ 100,000 - R$ 93,140.20) / R$ 100,000 = 6.86%
```

### 8. Rate Adjustment Logic

**Base Rate Determination**:
- Varies by economic sector (retail: 2.5%, services: 3.0%, construction: 3.5%)
- Market conditions and SELIC rate influence

**Risk Adjustments**:

```
Client Risk Premium:
- Profile A (best): +0.0%
- Profile B: +0.3%
- Profile C: +0.7%
- Profile D: +1.2%
- Profile E (worst): +2.0%

Debtor Credit Rating Premium:
- AAA: +0.0%
- AA: +0.2%
- A: +0.4%
- BBB: +0.7%
- BB: +1.0%
- B: +1.5%
- CCC: +2.5%

Modality Premium:
- With Recourse: +0.0%
- Without Recourse: +1.0%

Volume Discount:
- Small (< R$ 50k): 0% discount
- Medium (R$ 50k - R$ 500k): 5% discount
- Large (> R$ 500k): 10% discount
```

**Final Rate Formula**:
```
Final Monthly Rate = (Base Rate + Client Risk + Debtor Risk + Modality) × (1 - Volume Discount)
```

**Example**:
```
Base Rate: 3.0% (Services sector)
Client Risk: Profile B = +0.3%
Debtor Risk: Rating A = +0.4%
Modality: Without Recourse = +1.0%
Volume: Medium = 5% discount

Intermediate Rate = 3.0% + 0.3% + 0.4% + 1.0% = 4.7%
Final Rate = 4.7% × (1 - 0.05) = 4.465%
```

---

## Clean Architecture Layers

### Layer 1: Domain Layer (Innermost)

**Location**: `/src/domain/`

**Responsibility**: Contains all business logic, entities, value objects, and domain services. Zero dependencies on external frameworks.

**Structure**:
```
src/domain/
├── entities/
│   ├── FactoringSimulation.ts
│   ├── Duplicata.ts
│   ├── Debtor.ts
│   └── Creditor.ts
├── value-objects/
│   ├── Money.ts
│   ├── Percentage.ts
│   ├── RateCalculation.ts
│   ├── TaxCalculations.ts
│   ├── NetCalculation.ts
│   ├── DuplicataNumber.ts
│   ├── SimulationId.ts
│   └── individual-taxes/
│       ├── ISSCalculation.ts
│       ├── PISCalculation.ts
│       ├── COFINSCalculation.ts
│       ├── IRPJCalculation.ts
│       └── CSLLCalculation.ts
├── services/
│   ├── IRatingEngine.ts (interface)
│   └── ITaxEngine.ts (interface)
├── enums/
│   ├── FactoringModality.ts
│   ├── RiskProfile.ts
│   ├── CreditRating.ts
│   ├── TaxRegime.ts
│   └── EconomicSector.ts
├── exceptions/
│   └── DomainException.ts
└── events/
    └── FactoringSimulationCompletedEvent.ts
```

**Key Principles**:
- All financial calculations happen here
- No framework dependencies
- Pure business logic
- Immutable value objects
- Entity invariants enforced in constructors

### Layer 2: Application Layer (Use Cases)

**Location**: `/src/application/`

**Responsibility**: Orchestrates domain objects, implements use cases, defines interfaces for external services.

**Structure**:
```
src/application/
├── use-cases/
│   ├── SimulateFactoringUseCase.ts
│   ├── GetSimulationByIdUseCase.ts
│   └── ListSimulationsUseCase.ts
├── dtos/
│   ├── requests/
│   │   ├── SimulateFactoringRequest.ts
│   │   ├── DuplicataInputDTO.ts
│   │   └── OperationParametersInputDTO.ts
│   └── responses/
│       ├── SimulateFactoringResponse.ts
│       ├── RateCalculationDTO.ts
│       ├── TaxCalculationsDTO.ts
│       └── NetCalculationDTO.ts
├── ports/
│   ├── repositories/
│   │   └── ISimulationRepository.ts
│   ├── services/
│   │   ├── IEventBus.ts
│   │   └── ILogger.ts
│   └── external/
│       ├── ICreditRatingService.ts
│       └── IMunicipalityTaxService.ts
└── exceptions/
    ├── ApplicationException.ts
    └── ValidationException.ts
```

**Key Principles**:
- Orchestrates domain objects
- Defines interfaces (ports) for infrastructure
- Converts between DTOs and domain entities
- Transaction management
- Error handling and logging

### Layer 3: Infrastructure Layer

**Location**: `/src/infrastructure/`

**Responsibility**: Implements interfaces defined by application layer. Handles persistence, external services, frameworks.

**Structure**:
```
src/infrastructure/
├── persistence/
│   ├── repositories/
│   │   ├── FirebaseSimulationRepository.ts (implements ISimulationRepository)
│   │   └── InMemorySimulationRepository.ts (for testing)
│   ├── models/
│   │   └── SimulationDocument.ts (database schema)
│   └── mappers/
│       └── SimulationMapper.ts (domain ↔ persistence)
├── services/
│   ├── rating/
│   │   ├── DefaultRatingEngine.ts (implements IRatingEngine)
│   │   └── RatingFactorsService.ts
│   ├── tax/
│   │   ├── BrazilianTaxEngine.ts (implements ITaxEngine)
│   │   └── MunicipalityTaxTableService.ts
│   ├── external/
│   │   ├── SerasaCreditRatingService.ts
│   │   └── IBGEMunicipalityService.ts
│   └── EventBusImpl.ts
├── logging/
│   └── LoggerImpl.ts
└── config/
    ├── firebase-config.ts
    └── tax-tables.ts
```

**Key Principles**:
- Implements all interfaces from application layer
- Database access
- External API calls
- Framework-specific code
- Configuration management

### Layer 4: Presentation Layer (API/UI)

**Location**: `/src/presentation/`

**Responsibility**: Exposes application functionality through REST API, GraphQL, or UI.

**Structure**:
```
src/presentation/
├── api/
│   ├── controllers/
│   │   └── FactoringSimulatorController.ts
│   ├── routes/
│   │   └── simulator-routes.ts
│   ├── middleware/
│   │   ├── authentication.ts
│   │   ├── validation.ts
│   │   └── error-handler.ts
│   └── validators/
│       └── SimulationRequestValidator.ts
└── web/ (if applicable)
    ├── components/
    │   ├── SimulatorForm.tsx
    │   └── SimulationResults.tsx
    └── pages/
        └── SimulatorPage.tsx
```

**Example API Controller**:

```typescript
// Presentation Layer: REST API Controller
class FactoringSimulatorController {
  constructor(
    private readonly simulateFactoringUseCase: SimulateFactoringUseCase
  ) {}

  async simulate(req: Request, res: Response): Promise<void> {
    try {
      // Extract and validate request
      const request: SimulateFactoringRequest = {
        clientId: req.user.id, // From authentication middleware
        duplicataData: req.body.duplicata,
        operationParameters: req.body.parameters
      };

      // Execute use case
      const response = await this.simulateFactoringUseCase.execute(request);

      // Return response
      res.status(200).json({
        success: true,
        data: response
      });

    } catch (error) {
      if (error instanceof ValidationException) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else if (error instanceof ApplicationException) {
        res.status(422).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Internal server error"
        });
      }
    }
  }
}
```

### Dependency Flow

```
┌─────────────────────────────────────────┐
│        Presentation Layer               │
│   (Controllers, Routes, UI)             │
└──────────────┬──────────────────────────┘
               │ depends on
               ▼
┌─────────────────────────────────────────┐
│       Application Layer                 │
│  (Use Cases, DTOs, Port Interfaces)     │
└──────────────┬──────────────────────────┘
               │ depends on
               ▼
┌─────────────────────────────────────────┐
│         Domain Layer                    │
│ (Entities, Value Objects, Services)     │  ◄─── ZERO dependencies
└─────────────────────────────────────────┘
               ▲
               │ implements interfaces
               │
┌──────────────┴──────────────────────────┐
│      Infrastructure Layer               │
│ (Repositories, External Services, DB)   │
└─────────────────────────────────────────┘
```

**Critical Rule**: Dependencies only point inward. Domain layer has ZERO dependencies. Infrastructure implements interfaces defined in application layer (Dependency Inversion Principle).

---

## Calculation Breakdown Structure

### User-Facing Simulation Results

The simulation results should be presented to users in a clear, hierarchical format that explains all calculations:

```json
{
  "simulationId": "sim_2025_abc123",
  "simulatedAt": "2025-10-02T14:30:00Z",
  "status": "COMPLETED",

  "duplicataInformation": {
    "number": "DUP-2025-001234",
    "faceValue": 100000.00,
    "currency": "BRL",
    "issueDate": "2025-10-02",
    "dueDate": "2025-12-01",
    "daysToMaturity": 60,
    "termInMonths": 2.0,
    "debtor": {
      "name": "Empresa Compradora Ltda",
      "document": "12.345.678/0001-90",
      "creditRating": "A"
    },
    "creditor": {
      "name": "Empresa Vendedora Ltda",
      "document": "98.765.432/0001-10"
    },
    "economicSector": "RETAIL"
  },

  "rateCalculation": {
    "breakdown": {
      "baseMonthlyRate": {
        "value": 2.50,
        "description": "Taxa base para setor de varejo"
      },
      "adjustments": {
        "clientRisk": {
          "value": 0.30,
          "description": "Ajuste para perfil de risco B"
        },
        "debtorRisk": {
          "value": 0.40,
          "description": "Ajuste para rating A do sacado"
        },
        "modality": {
          "value": 1.00,
          "description": "Operação sem regresso (maior risco)"
        }
      },
      "volumeDiscount": {
        "value": -0.21,
        "percentage": 5.0,
        "description": "Desconto para operação de porte médio"
      },
      "finalMonthlyRate": {
        "value": 3.99,
        "description": "Taxa mensal final aplicada"
      }
    },
    "effectiveAnnualRate": 59.31,
    "desagioCalculation": {
      "method": "SIMPLE_INTEREST",
      "formula": "Taxa Mensal × Prazo em Meses",
      "percentage": 7.98,
      "amount": 7980.00,
      "description": "Deságio de 7.98% sobre o valor de face"
    }
  },

  "taxCalculations": {
    "regime": "LUCRO_PRESUMIDO",
    "municipality": {
      "code": "3550308",
      "name": "São Paulo",
      "state": "SP"
    },
    "taxes": [
      {
        "type": "ISS",
        "description": "Imposto Sobre Serviços",
        "taxBase": 7980.00,
        "taxBaseDescription": "Deságio (receita de serviço)",
        "rate": 3.00,
        "amount": 239.40,
        "legalBasis": "Lei Complementar 116/2003"
      },
      {
        "type": "PIS",
        "description": "Programa de Integração Social",
        "taxBase": 7980.00,
        "taxBaseDescription": "Receita bruta (deságio)",
        "rate": 0.65,
        "regime": "CUMULATIVE",
        "amount": 51.87,
        "legalBasis": "Lei nº 9.715/1998"
      },
      {
        "type": "COFINS",
        "description": "Contribuição para Financiamento da Seguridade Social",
        "taxBase": 7980.00,
        "taxBaseDescription": "Receita bruta (deságio)",
        "rate": 3.00,
        "regime": "CUMULATIVE",
        "amount": 239.40,
        "legalBasis": "Lei nº 9.718/1998"
      },
      {
        "type": "IRPJ",
        "description": "Imposto de Renda Pessoa Jurídica",
        "taxBase": 7980.00,
        "presumedProfitPercentage": 32.00,
        "taxableProfit": 2553.60,
        "rate": 15.00,
        "amount": 383.04,
        "legalBasis": "Lei nº 9.430/96",
        "note": "Base de cálculo: 32% da receita bruta (lucro presumido)"
      },
      {
        "type": "CSLL",
        "description": "Contribuição Social sobre Lucro Líquido",
        "taxBase": 7980.00,
        "presumedProfitPercentage": 32.00,
        "taxableProfit": 2553.60,
        "rate": 9.00,
        "amount": 229.82,
        "legalBasis": "Lei nº 7.689/88",
        "note": "Base de cálculo: 32% da receita bruta (lucro presumido)"
      }
    ],
    "summary": {
      "totalTaxAmount": 1143.53,
      "effectiveTaxRate": 14.33,
      "effectiveTaxRateDescription": "Carga tributária efetiva sobre o deságio"
    }
  },

  "netCalculation": {
    "duplicataFaceValue": 100000.00,
    "deductions": {
      "desagio": {
        "amount": 7980.00,
        "percentage": 7.98,
        "description": "Taxa de desconto (juros antecipados)"
      },
      "taxes": {
        "amount": 1143.53,
        "percentage": 1.14,
        "description": "Total de tributos incidentes"
      },
      "totalDeductions": {
        "amount": 9123.53,
        "percentage": 9.12
      }
    },
    "netAmount": {
      "amount": 90876.47,
      "percentage": 90.88,
      "description": "Valor líquido a receber pelo cedente"
    },
    "effectiveDiscount": {
      "percentage": 9.12,
      "description": "Desconto efetivo total (deságio + tributos)"
    }
  },

  "summary": {
    "youReceive": 90876.47,
    "youPay": 9123.53,
    "effectiveCost": 9.12,
    "anticipationDays": 60,
    "settlementDate": "2025-10-02"
  }
}
```

### Presentation Order

When displaying to users, follow this hierarchy:

1. **Header**: Simulation ID, date, status
2. **Duplicata Summary**: Face value, debtor, maturity
3. **Rate Breakdown**: Show how the rate was calculated step-by-step
4. **Deságio Calculation**: Clear formula and result
5. **Tax Details**: Each tax with base, rate, and amount
6. **Net Calculation**: Visual breakdown of deductions
7. **Summary**: Bottom line - what client receives

### Visual Representation Recommendations

```
┌─────────────────────────────────────────────────────┐
│  SIMULAÇÃO DE FACTORING                             │
│  ID: sim_2025_abc123                                │
│  Data: 02/10/2025 14:30                             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  DUPLICATA                                          │
│  Número: DUP-2025-001234                            │
│  Valor de Face: R$ 100.000,00                       │
│  Vencimento: 01/12/2025 (60 dias)                   │
│  Sacado: Empresa Compradora Ltda (Rating: A)        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  CÁLCULO DE TAXA                                    │
│                                                     │
│  Taxa Base (Varejo)              2,50%              │
│  + Ajuste Risco Cliente (B)      0,30%              │
│  + Ajuste Risco Sacado (A)       0,40%              │
│  + Modalidade (Sem Regresso)     1,00%              │
│  ────────────────────────────────────               │
│  Subtotal                        4,20%              │
│  - Desconto Volume (5%)         -0,21%              │
│  ────────────────────────────────────               │
│  Taxa Mensal Final               3,99%              │
│  Taxa Anual Efetiva             59,31%              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  DESÁGIO                                            │
│                                                     │
│  Fórmula: Taxa × Prazo                              │
│  Cálculo: 3,99% × 2 meses = 7,98%                   │
│                                                     │
│  Valor do Deságio: R$ 7.980,00                      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  TRIBUTOS (Regime: Lucro Presumido)                 │
│                                                     │
│  ISS (3% s/ deságio)              R$    239,40      │
│  PIS (0,65% s/ deságio)           R$     51,87      │
│  COFINS (3% s/ deságio)           R$    239,40      │
│  IRPJ (15% s/ lucro presumido)    R$    383,04      │
│  CSLL (9% s/ lucro presumido)     R$    229,82      │
│  ────────────────────────────────────               │
│  Total de Tributos                R$  1.143,53      │
│  (Carga efetiva: 14,33% do deságio)                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  VALOR LÍQUIDO                                      │
│                                                     │
│  Valor de Face da Duplicata      R$ 100.000,00      │
│  (-) Deságio                     R$   7.980,00      │
│  (-) Tributos                    R$   1.143,53      │
│  ═══════════════════════════════════════════        │
│  VALOR A RECEBER                 R$  90.876,47      │
│                                                     │
│  Desconto Efetivo Total: 9,12%                      │
│  Antecipação: 60 dias                               │
└─────────────────────────────────────────────────────┘
```

---

## Implementation Roadmap

### Phase 1: Domain Core (Week 1-2)

**Deliverables**:
1. All value objects (Money, Percentage, Rate calculations)
2. Core entities (Duplicata, FactoringSimulation)
3. Tax calculation value objects
4. Domain exceptions
5. Unit tests for all domain logic (>95% coverage)

**Success Criteria**:
- All financial calculations tested with multiple scenarios
- No dependencies on external frameworks
- All business rules enforced in domain layer

### Phase 2: Application Layer (Week 3)

**Deliverables**:
1. SimulateFactoringUseCase implementation
2. Input/output DTOs
3. Port interfaces (repositories, services)
4. Application exceptions
5. Use case integration tests

**Success Criteria**:
- Use case orchestrates domain correctly
- DTOs properly map to/from domain entities
- Error handling comprehensive

### Phase 3: Infrastructure Layer (Week 4-5)

**Deliverables**:
1. Firebase repository implementation
2. RatingEngine implementation
3. TaxEngine implementation
4. Municipality tax table service
5. Event bus implementation
6. Logging implementation
7. Configuration management

**Success Criteria**:
- All ports implemented
- Firebase integration working
- External service integrations tested
- In-memory implementations for testing

### Phase 4: Presentation Layer (Week 6)

**Deliverables**:
1. REST API controllers
2. Request validation middleware
3. Error handling middleware
4. API documentation (OpenAPI/Swagger)
5. E2E tests

**Success Criteria**:
- API endpoints functional
- Proper HTTP status codes
- Comprehensive error responses
- API documentation complete

### Phase 5: Frontend Integration (Week 7-8)

**Deliverables**:
1. Simulator form component
2. Results display component
3. Integration with backend API
4. Form validation
5. Error handling

**Success Criteria**:
- User can simulate factoring operations
- Results clearly displayed
- Good UX for data entry

### Phase 6: Testing & Refinement (Week 9)

**Deliverables**:
1. Performance testing
2. Load testing
3. Security audit
4. Bug fixes
5. Documentation finalization

**Success Criteria**:
- System handles expected load
- No critical security issues
- All documentation complete

---

## Testing Strategy

### Unit Tests (Domain & Application Layers)

**Domain Layer Tests**:

```typescript
describe('Money Value Object', () => {
  it('should perform precise decimal arithmetic', () => {
    const money1 = new Money(100.50);
    const money2 = new Money(50.25);

    const result = money1.add(money2);

    expect(result.amount.toNumber()).toBe(150.75);
  });

  it('should round to tax standard (ROUND_HALF_UP)', () => {
    const money = new Money(100.555);
    const rounded = money.roundToTaxStandard();

    expect(rounded.amount.toNumber()).toBe(100.56);
  });

  it('should throw when operating different currencies', () => {
    const brl = new Money(100, Currency.BRL);
    const usd = new Money(100, Currency.USD);

    expect(() => brl.add(usd)).toThrow(DomainException);
  });
});

describe('RateCalculation', () => {
  it('should calculate deságio using simple interest for short-term', () => {
    const duplicata = createTestDuplicata({
      faceValue: 100000,
      daysToMaturity: 60
    });

    const parameters = createTestParameters({
      modality: FactoringModality.WITH_RECOURSE
    });

    const rateCalc = new RateCalculation(
      duplicata,
      parameters,
      createTestRatingFactors()
    );

    // With 3.99% monthly rate and 2 months
    expect(rateCalc.desagioPercentage.toPercentageValue().toNumber())
      .toBeCloseTo(7.98, 2);

    expect(rateCalc.desagioAmount.amount.toNumber())
      .toBeCloseTo(7980.00, 2);
  });

  it('should apply volume discount correctly', () => {
    const largeDuplicata = createTestDuplicata({
      faceValue: 600000 // Large volume
    });

    const smallDuplicata = createTestDuplicata({
      faceValue: 30000 // Small volume
    });

    const params = createTestParameters();

    const largeRate = new RateCalculation(
      largeDuplicata,
      params,
      createTestRatingFactors()
    );

    const smallRate = new RateCalculation(
      smallDuplicata,
      params,
      createTestRatingFactors()
    );

    // Large operation should have lower rate due to discount
    expect(largeRate.finalMonthlyRate.toDecimal())
      .toBeLessThan(smallRate.finalMonthlyRate.toDecimal());
  });
});

describe('TaxCalculations', () => {
  it('should calculate ISS correctly for São Paulo', () => {
    const desagioAmount = new Money(7980);
    const saoPaulo = new Municipality('3550308'); // IBGE code

    const issCalc = new ISSCalculation(desagioAmount, saoPaulo);

    expect(issCalc.taxRate.toPercentageValue().toNumber()).toBe(3.0);
    expect(issCalc.taxAmount.amount.toNumber()).toBeCloseTo(239.40, 2);
  });

  it('should not calculate IRPJ/CSLL for Simples Nacional', () => {
    const duplicata = createTestDuplicata();
    const rateCalc = createTestRateCalculation();
    const params = createTestParameters({
      taxRegime: TaxRegime.SIMPLES_NACIONAL
    });

    const taxCalcs = new TaxCalculations(
      duplicata,
      rateCalc,
      params
    );

    expect(taxCalcs.irpjCalculation).toBeUndefined();
    expect(taxCalcs.csllCalculation).toBeUndefined();
  });

  it('should calculate all taxes for Lucro Presumido', () => {
    const duplicata = createTestDuplicata({ faceValue: 100000 });
    const rateCalc = createTestRateCalculation({ desagioAmount: 7980 });
    const params = createTestParameters({
      taxRegime: TaxRegime.LUCRO_PRESUMIDO
    });

    const taxCalcs = new TaxCalculations(
      duplicata,
      rateCalc,
      params
    );

    // ISS: 7980 × 3% = 239.40
    expect(taxCalcs.issCalculation.taxAmount.amount.toNumber())
      .toBeCloseTo(239.40, 2);

    // PIS: 7980 × 0.65% = 51.87
    expect(taxCalcs.pisCalculation.taxAmount.amount.toNumber())
      .toBeCloseTo(51.87, 2);

    // COFINS: 7980 × 3% = 239.40
    expect(taxCalcs.cofinsCalculation.taxAmount.amount.toNumber())
      .toBeCloseTo(239.40, 2);

    // IRPJ: (7980 × 32%) × 15% = 383.04
    expect(taxCalcs.irpjCalculation!.taxAmount.amount.toNumber())
      .toBeCloseTo(383.04, 2);

    // CSLL: (7980 × 32%) × 9% = 229.82
    expect(taxCalcs.csllCalculation!.taxAmount.amount.toNumber())
      .toBeCloseTo(229.82, 2);

    // Total: 1143.53
    expect(taxCalcs.totalTaxAmount.amount.toNumber())
      .toBeCloseTo(1143.53, 2);
  });
});

describe('FactoringSimulation', () => {
  it('should create valid simulation with all calculations', () => {
    const duplicata = createTestDuplicata({ faceValue: 100000 });
    const params = createTestParameters();
    const ratingEngine = new TestRatingEngine();
    const taxEngine = new TestTaxEngine();

    const simulation = new FactoringSimulation(
      duplicata,
      params,
      ratingEngine,
      taxEngine
    );

    expect(simulation.status).toBe(SimulationStatus.COMPLETED);
    expect(simulation.netCalculation.netAmount.amount.toNumber())
      .toBeGreaterThan(0);
    expect(simulation.netCalculation.netAmount.amount.toNumber())
      .toBeLessThan(100000);
  });

  it('should throw when simulation results in negative net amount', () => {
    const duplicata = createTestDuplicata({ faceValue: 1000 });
    const params = createTestParameters({
      modality: FactoringModality.WITHOUT_RECOURSE,
      clientRiskProfile: RiskProfile.E, // Worst
      debtorCreditRating: CreditRating.CCC // Worst
    });

    // This should result in very high rates and potentially negative net
    expect(() => new FactoringSimulation(
      duplicata,
      params,
      new TestRatingEngine(),
      new TestTaxEngine()
    )).toThrow(DomainException);
  });
});
```

**Use Case Tests**:

```typescript
describe('SimulateFactoringUseCase', () => {
  let useCase: SimulateFactoringUseCase;
  let mockRepository: jest.Mocked<ISimulationRepository>;
  let mockEventBus: jest.Mocked<IEventBus>;
  let mockRatingEngine: jest.Mocked<IRatingEngine>;
  let mockTaxEngine: jest.Mocked<ITaxEngine>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    mockEventBus = createMockEventBus();
    mockRatingEngine = createMockRatingEngine();
    mockTaxEngine = createMockTaxEngine();

    useCase = new SimulateFactoringUseCase(
      mockRatingEngine,
      mockTaxEngine,
      mockRepository,
      mockEventBus,
      createMockLogger()
    );
  });

  it('should execute simulation successfully', async () => {
    const request = createValidSimulationRequest();

    const response = await useCase.execute(request);

    expect(response.simulationId).toBeDefined();
    expect(response.status).toBe(SimulationStatus.COMPLETED);
    expect(response.netCalculation.netAmount).toBeGreaterThan(0);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
  });

  it('should throw ValidationException for invalid request', async () => {
    const invalidRequest = {
      clientId: null,
      duplicataData: null,
      operationParameters: null
    };

    await expect(useCase.execute(invalidRequest as any))
      .rejects.toThrow(ValidationException);
  });

  it('should handle domain exceptions properly', async () => {
    const request = createValidSimulationRequest();

    mockRatingEngine.calculateRate.mockImplementation(() => {
      throw new DomainException("Invalid rate calculation");
    });

    await expect(useCase.execute(request))
      .rejects.toThrow(ApplicationException);
  });
});
```

### Integration Tests

```typescript
describe('Factoring Simulation Integration', () => {
  let testContainer: TestContainer;

  beforeAll(async () => {
    testContainer = await createTestContainer();
  });

  afterAll(async () => {
    await testContainer.cleanup();
  });

  it('should simulate complete factoring operation end-to-end', async () => {
    // Arrange
    const client = await testContainer.createTestClient({
      riskProfile: RiskProfile.B
    });

    const debtor = await testContainer.createTestDebtor({
      creditRating: CreditRating.A
    });

    const request: SimulateFactoringRequest = {
      clientId: client.id,
      duplicataData: {
        number: 'DUP-TEST-001',
        issueDate: '2025-10-02',
        dueDate: '2025-12-01',
        faceValue: 100000,
        debtor: {
          id: debtor.id,
          name: debtor.name,
          document: debtor.cnpj,
          economicSector: EconomicSector.RETAIL
        },
        creditor: {
          id: client.id,
          name: client.name,
          document: client.cnpj
        },
        documentType: DuplicataType.MERCANTILE,
        economicSector: EconomicSector.RETAIL
      },
      operationParameters: {
        modality: FactoringModality.WITH_RECOURSE,
        clientRiskProfile: RiskProfile.B,
        debtorCreditRating: CreditRating.A,
        duplicataFaceValue: 100000,
        isRecurringClient: false,
        taxRegime: TaxRegime.LUCRO_PRESUMIDO,
        municipalityCode: '3550308' // São Paulo
      }
    };

    // Act
    const useCase = testContainer.resolve<SimulateFactoringUseCase>(
      'SimulateFactoringUseCase'
    );
    const response = await useCase.execute(request);

    // Assert
    expect(response.simulationId).toBeDefined();
    expect(response.status).toBe(SimulationStatus.COMPLETED);

    // Verify calculations are reasonable
    expect(response.rateCalculation.finalMonthlyRate).toBeGreaterThan(2);
    expect(response.rateCalculation.finalMonthlyRate).toBeLessThan(10);

    expect(response.netCalculation.netAmount).toBeGreaterThan(85000);
    expect(response.netCalculation.netAmount).toBeLessThan(95000);

    // Verify simulation was persisted
    const saved = await testContainer.getRepository<ISimulationRepository>(
      'ISimulationRepository'
    ).findById(response.simulationId);

    expect(saved).toBeDefined();
  });
});
```

### E2E Tests (API)

```typescript
describe('POST /api/v1/simulator/simulate', () => {
  it('should return 200 with valid simulation response', async () => {
    const response = await request(app)
      .post('/api/v1/simulator/simulate')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        duplicata: {
          number: 'DUP-2025-001',
          issueDate: '2025-10-02',
          dueDate: '2025-12-01',
          faceValue: 100000,
          debtor: {
            id: 'debtor-123',
            name: 'Test Debtor',
            document: '12.345.678/0001-90',
            economicSector: 'RETAIL'
          },
          creditor: {
            id: 'client-456',
            name: 'Test Client',
            document: '98.765.432/0001-10'
          },
          documentType: 'MERCANTILE',
          economicSector: 'RETAIL'
        },
        parameters: {
          modality: 'WITH_RECOURSE',
          clientRiskProfile: 'B',
          debtorCreditRating: 'A',
          isRecurringClient: false,
          taxRegime: 'LUCRO_PRESUMIDO',
          municipalityCode: '3550308'
        }
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.simulationId).toBeDefined();
    expect(response.body.data.netCalculation.netAmount).toBeGreaterThan(0);
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/api/v1/simulator/simulate')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        duplicata: {
          faceValue: -100 // Invalid
        }
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should return 401 without authentication', async () => {
    const response = await request(app)
      .post('/api/v1/simulator/simulate')
      .send({});

    expect(response.status).toBe(401);
  });
});
```

### Test Coverage Requirements

- **Domain Layer**: >95% coverage (all business rules must be tested)
- **Application Layer**: >90% coverage
- **Infrastructure Layer**: >80% coverage (focus on critical paths)
- **Presentation Layer**: >70% coverage

---

## Regulatory Compliance Considerations

### 1. Lei nº 9.430/96 Compliance

**Requirement**: Factoring operations must follow legal definition

**Implementation**:
- Domain entities model legal concepts accurately
- Clear separation between factoring (purchase of receivables) and financing
- Service components (assessment, management) are intrinsic to operation

**Audit Trail**:
- Every simulation logged with timestamp and user
- All calculations stored for regulatory inspection
- Cannot modify past simulations (immutability)

### 2. Tax Law Compliance

**ISS Compliance (Lei Complementar 116/2003)**:
- Tax base correctly calculated on service fee (deságio) only
- Municipality-specific rates implemented
- Legal basis documented in simulation results

**PIS/COFINS Compliance**:
- Correct regime application (cumulative vs. non-cumulative)
- Proper tax base calculation
- Integration with company's tax regime

**IRPJ/CSLL Compliance**:
- Lucro Presumido calculations follow 32% rule
- Lucro Real flagged for manual calculation
- Simples Nacional properly excluded

### 3. Data Protection (LGPD)

**Personal Data Handling**:
- Client and debtor data encrypted at rest
- Access logging for audit
- Data retention policies implemented
- Right to erasure capability

**Implementation**:
```typescript
// Domain event for LGPD compliance
class PersonalDataAccessedEvent {
  constructor(
    public readonly userId: string,
    public readonly dataType: string,
    public readonly purpose: string,
    public readonly timestamp: DateTime
  ) {}
}
```

### 4. Anti-Money Laundering (AML)

**Required Checks**:
- Client KYC (Know Your Customer) verification
- Debtor verification
- Unusual transaction pattern detection

**Implementation**:
```typescript
interface IAMLService {
  verifyClient(clientId: ClientId): Promise<AMLVerificationResult>;
  checkTransactionPattern(
    simulation: FactoringSimulation
  ): Promise<AMLRiskScore>;
}
```

### 5. Audit Requirements

**Simulation Audit Log**:
```typescript
interface SimulationAuditLog {
  simulationId: SimulationId;
  timestamp: DateTime;
  userId: UserId;
  inputData: SimulateFactoringRequest;
  calculationSteps: CalculationStep[];
  finalResult: SimulateFactoringResponse;
  systemVersion: string;
  ipAddress: string;
}
```

**Retention Policy**:
- Simulation records: 5 years minimum
- Tax calculations: 5 years (matches Brazilian tax statute of limitations)
- User access logs: 1 year

### 6. Regulatory Reporting

**ANFAC Reporting**:
```typescript
interface IANFACReportingService {
  generateMonthlyReport(
    month: Month,
    year: Year
  ): Promise<ANFACMonthlyReport>;

  submitReport(report: ANFACMonthlyReport): Promise<SubmissionResult>;
}
```

**Report Contents**:
- Total simulations performed
- Total face value simulated
- Average rates by sector
- Tax calculations summary

---

## Conclusion

This architecture design provides a robust, compliant, and maintainable foundation for the Simulador de Factoring feature. Key strengths:

1. **Clean Architecture**: Strict layer separation ensures business rules remain independent and testable
2. **Domain-Driven Design**: Rich domain model accurately represents Brazilian factoring concepts
3. **Precision**: Decimal arithmetic throughout prevents financial calculation errors
4. **Compliance**: Built-in regulatory compliance for Brazilian tax laws
5. **Auditability**: Complete traceability of all calculations
6. **Extensibility**: New features can be added without modifying core business logic
7. **Testability**: Comprehensive test strategy ensures reliability

### Next Steps

1. Review and approve architecture design
2. Set up development environment with chosen tech stack
3. Implement Phase 1 (Domain Core)
4. Establish CI/CD pipeline with automated testing
5. Begin iterative development following the roadmap

### Key Success Factors

- **Precision First**: Never compromise on financial calculation accuracy
- **Regulatory Compliance**: Every feature must align with Brazilian regulations
- **Clean Code**: Maintain architectural boundaries strictly
- **Test Coverage**: High test coverage is non-negotiable for financial systems
- **Documentation**: Keep business rules documented and updated

This design serves as the blueprint for implementation. All code should follow these patterns and principles to ensure a high-quality, compliant factoring platform.

---

**Document Control**

- **Version**: 1.0
- **Status**: Draft for Review
- **Classification**: Internal Technical Documentation
- **Prepared by**: Claude Code (Fintech Architecture Specialist)
- **Review Required**: Technical Lead, Compliance Officer, Business Stakeholders
