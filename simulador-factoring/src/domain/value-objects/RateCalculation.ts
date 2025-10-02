import Decimal from 'decimal.js';
import { Money } from './Money';
import { Percentage } from './Percentage';
import { EconomicSector } from '../enums/EconomicSector';
import { RiskProfile } from '../enums/RiskProfile';
import { CreditRating } from '../enums/CreditRating';
import { FactoringModality } from '../enums/FactoringModality';
import { OperationVolume } from '../enums/OperationVolume';

export class RateCalculation {
  readonly baseMonthlyRate: Percentage;
  readonly riskAdjustment: Percentage;
  readonly modalityAdjustment: Percentage;
  readonly volumeDiscount: Percentage;
  readonly finalMonthlyRate: Percentage;
  readonly effectiveAnnualRate: Percentage;
  readonly desagioPercentage: Percentage;
  readonly desagioAmount: Money;

  constructor(
    faceValue: Money,
    termInMonths: Decimal,
    economicSector: EconomicSector,
    clientRiskProfile: RiskProfile,
    debtorCreditRating: CreditRating,
    modality: FactoringModality,
    operationVolume: OperationVolume
  ) {
    // Calculate base rate from sector
    this.baseMonthlyRate = this.calculateBaseRate(economicSector);

    // Apply risk adjustments
    this.riskAdjustment = this.calculateRiskAdjustment(
      clientRiskProfile,
      debtorCreditRating
    );

    // Modality adjustment
    const modalityData = this.calculateModalityAdjustment(modality);
    this.modalityAdjustment = modalityData.adjustment;

    // Volume discount
    this.volumeDiscount = this.calculateVolumeDiscount(operationVolume);

    // Calculate final monthly rate
    let baseWithAdjustments = this.baseMonthlyRate.add(this.riskAdjustment);

    // Apply modality adjustment (add or subtract based on flag)
    if (modalityData.isNegative) {
      baseWithAdjustments = baseWithAdjustments.subtract(this.modalityAdjustment);
    } else {
      baseWithAdjustments = baseWithAdjustments.add(this.modalityAdjustment);
    }

    const discountFactor = new Decimal(1).minus(this.volumeDiscount.toDecimal());
    this.finalMonthlyRate = baseWithAdjustments.multiply(discountFactor);

    // Convert to effective annual rate: (1 + r)^12 - 1
    const monthlyDecimal = this.finalMonthlyRate.toDecimal();
    const annualFactor = monthlyDecimal.plus(1).pow(12).minus(1);
    this.effectiveAnnualRate = Percentage.fromDecimal(annualFactor);

    // Calculate deságio
    this.desagioPercentage = this.calculateDesagio(
      this.finalMonthlyRate,
      termInMonths
    );

    this.desagioAmount = faceValue
      .multiply(this.desagioPercentage)
      .roundToTaxStandard();
  }

  private calculateBaseRate(sector: EconomicSector): Percentage {
    // Base rates aligned with ANFAC Fator de Compra (4.0-4.8% Q1 2025, Selic 15%)
    // Using 4.3% as mid-point, adjusted by sector risk
    const sectorRates: Record<EconomicSector, Percentage> = {
      [EconomicSector.RETAIL]: Percentage.fromPercentage(4.0), // Lower risk, stable
      [EconomicSector.SERVICES]: Percentage.fromPercentage(4.3), // Standard
      [EconomicSector.INDUSTRY]: Percentage.fromPercentage(4.1), // Good creditworthiness
      [EconomicSector.CONSTRUCTION]: Percentage.fromPercentage(4.8), // Higher risk
      [EconomicSector.HEALTHCARE]: Percentage.fromPercentage(3.8), // Very stable
      [EconomicSector.AGRICULTURE]: Percentage.fromPercentage(4.5), // Seasonal risk
      [EconomicSector.TECHNOLOGY]: Percentage.fromPercentage(4.2), // Growing sector
      [EconomicSector.OTHER]: Percentage.fromPercentage(4.5),
    };

    return sectorRates[sector];
  }

  private calculateRiskAdjustment(
    clientProfile: RiskProfile,
    debtorRating: CreditRating
  ): Percentage {
    const clientRiskPremium: Record<RiskProfile, Percentage> = {
      [RiskProfile.A]: Percentage.fromPercentage(0.0),
      [RiskProfile.B]: Percentage.fromPercentage(0.3),
      [RiskProfile.C]: Percentage.fromPercentage(0.7),
      [RiskProfile.D]: Percentage.fromPercentage(1.2),
      [RiskProfile.E]: Percentage.fromPercentage(2.0),
    };

    const debtorRiskPremium: Record<CreditRating, Percentage> = {
      [CreditRating.AAA]: Percentage.fromPercentage(0.0),
      [CreditRating.AA]: Percentage.fromPercentage(0.2),
      [CreditRating.A]: Percentage.fromPercentage(0.4),
      [CreditRating.BBB]: Percentage.fromPercentage(0.7),
      [CreditRating.BB]: Percentage.fromPercentage(1.0),
      [CreditRating.B]: Percentage.fromPercentage(1.5),
      [CreditRating.CCC]: Percentage.fromPercentage(2.5),
    };

    return clientRiskPremium[clientProfile].add(debtorRiskPremium[debtorRating]);
  }

  private calculateModalityAdjustment(modality: FactoringModality): { adjustment: Percentage; isNegative: boolean } {
    // Adjustments based on market data
    // With recourse: 4-7% total, Without recourse: 6-11% total
    // Maturity: 1-3% (service only, no advance) - lower rate
    // International: 5-10% (higher risk)
    const modalityData: Record<FactoringModality, { adjustment: Percentage; isNegative: boolean }> = {
      [FactoringModality.WITH_RECOURSE]: { adjustment: Percentage.fromPercentage(0.0), isNegative: false },
      [FactoringModality.WITHOUT_RECOURSE]: { adjustment: Percentage.fromPercentage(2.0), isNegative: false },
      [FactoringModality.MATURITY]: { adjustment: Percentage.fromPercentage(2.5), isNegative: true }, // Discount
      [FactoringModality.TRUSTEE]: { adjustment: Percentage.fromPercentage(1.0), isNegative: false },
      [FactoringModality.INTERNATIONAL]: { adjustment: Percentage.fromPercentage(3.0), isNegative: false },
      [FactoringModality.RAW_MATERIAL]: { adjustment: Percentage.fromPercentage(0.5), isNegative: false },
    };

    return modalityData[modality];
  }

  private calculateVolumeDiscount(volume: OperationVolume): Percentage {
    const discounts: Record<OperationVolume, Percentage> = {
      [OperationVolume.SMALL]: Percentage.fromPercentage(0.0),
      [OperationVolume.MEDIUM]: Percentage.fromPercentage(5.0),
      [OperationVolume.LARGE]: Percentage.fromPercentage(10.0),
    };

    return discounts[volume];
  }

  private calculateDesagio(
    monthlyRate: Percentage,
    termInMonths: Decimal
  ): Percentage {
    // For short-term operations (≤ 3 months): simple interest
    if (termInMonths.lessThanOrEqualTo(3)) {
      return Percentage.fromDecimal(
        monthlyRate.toDecimal().times(termInMonths)
      );
    } else {
      // For longer terms: compound interest formula
      // D = 1 - (1 / (1 + r)^t)
      const onePlusRate = monthlyRate.toDecimal().plus(1);
      const compoundFactor = onePlusRate.pow(termInMonths.toNumber());
      const desagioDecimal = new Decimal(1).minus(
        new Decimal(1).dividedBy(compoundFactor)
      );
      return Percentage.fromDecimal(desagioDecimal);
    }
  }
}
