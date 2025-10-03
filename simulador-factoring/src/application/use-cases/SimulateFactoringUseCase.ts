import Decimal from 'decimal.js';
import { differenceInDays } from 'date-fns';
import type { SimulationInputDTO } from '../dtos/SimulationInputDTO';
import type { SimulationOutputDTO, RateCalculationDTO, TaxCalculationsDTO, NetCalculationDTO } from '../dtos/SimulationOutputDTO';
import { Money } from '../../domain/value-objects/Money';
import { RateCalculation } from '../../domain/value-objects/RateCalculation';
import { TaxCalculations } from '../../domain/value-objects/TaxCalculations';
import { NetCalculation } from '../../domain/value-objects/NetCalculation';
import type { Municipality } from '../../domain/value-objects/ISSCalculation';
import { Percentage } from '../../domain/value-objects/Percentage';
import { OperationVolume } from '../../domain/enums/OperationVolume';
import { DomainException } from '../../domain/exceptions/DomainException';

export class SimulateFactoringUseCase {
  execute(input: SimulationInputDTO): SimulationOutputDTO {
    try {
      // Validate input
      this.validateInput(input);

      // Parse dates
      const issueDate = new Date(input.issueDate);
      const dueDate = new Date(input.dueDate);
      const now = new Date();

      // Calculate days to maturity and term
      const daysToMaturity = differenceInDays(dueDate, now);
      const termInMonths = new Decimal(daysToMaturity).dividedBy(30);

      // Validate dates
      if (daysToMaturity <= 0) {
        throw new DomainException('La fecha de vencimiento debe ser posterior a hoy');
      }

      if (differenceInDays(dueDate, issueDate) <= 0) {
        throw new DomainException('La fecha de vencimiento debe ser posterior a la fecha de emisión');
      }

      // Create Money value object
      const faceValue = new Money(input.faceValue);

      // Determine operation volume
      const operationVolume = this.determineOperationVolume(input.faceValue);

      // Create municipality object
      const municipality: Municipality = {
        code: input.municipalityCode,
        name: input.municipalityName,
        issRateForFactoring: Percentage.fromPercentage(3.0), // Default 3%, could be configurable
      };

      // Calculate rates and deságio
      const rateCalculation = new RateCalculation(
        faceValue,
        termInMonths,
        input.economicSector,
        input.clientRiskProfile,
        input.debtorCreditRating,
        input.modality,
        operationVolume
      );

      // Calculate preliminary net amount (without IOF) for IOF calculation
      const preliminaryNetAmount = faceValue.subtract(rateCalculation.desagioAmount);

      // Calculate taxes (including IOF)
      const taxCalculations = new TaxCalculations(
        rateCalculation.desagioAmount,
        faceValue,
        preliminaryNetAmount,  // Net amount for IOF base
        daysToMaturity,        // Days for IOF calculation
        input.taxRegime,
        municipality
      );

      // Calculate final net amount
      const netCalculation = new NetCalculation(
        faceValue,
        rateCalculation.desagioAmount,
        taxCalculations.totalTaxAmount
      );

      // Validate business viability
      if (netCalculation.netAmount.amount.lessThanOrEqualTo(0)) {
        throw new DomainException('La simulación resulta en un monto neto cero o negativo. Por favor ajuste los parámetros.');
      }

      // Build output DTO
      return {
        duplicataNumber: input.duplicataNumber,
        faceValue: faceValue.toNumber(),
        dueDate: input.dueDate,
        daysToMaturity,
        termInMonths: termInMonths.toNumber(),
        debtorName: input.debtorName,
        debtorDocument: input.debtorDocument,
        rateCalculation: this.buildRateCalculationDTO(rateCalculation),
        taxCalculations: this.buildTaxCalculationsDTO(taxCalculations),
        netCalculation: this.buildNetCalculationDTO(netCalculation),
        simulatedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }
      throw new Error(`Error en la simulación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private validateInput(input: SimulationInputDTO): void {
    if (input.faceValue <= 0) {
      throw new DomainException('El valor nominal debe ser mayor a cero');
    }

    if (!input.dueDate) {
      throw new DomainException('La fecha de vencimiento es requerida');
    }
  }

  private determineOperationVolume(faceValue: number): OperationVolume {
    if (faceValue < 50000) return OperationVolume.SMALL;
    if (faceValue < 500000) return OperationVolume.MEDIUM;
    return OperationVolume.LARGE;
  }

  private buildRateCalculationDTO(rateCalc: RateCalculation): RateCalculationDTO {
    return {
      baseMonthlyRate: rateCalc.baseMonthlyRate.toPercentageValue().toNumber(),
      riskAdjustment: rateCalc.riskAdjustment.toPercentageValue().toNumber(),
      modalityAdjustment: rateCalc.modalityAdjustment.toPercentageValue().toNumber(),
      volumeDiscount: rateCalc.volumeDiscount.toPercentageValue().toNumber(),
      finalMonthlyRate: rateCalc.finalMonthlyRate.toPercentageValue().toNumber(),
      effectiveAnnualRate: rateCalc.effectiveAnnualRate.toPercentageValue().toNumber(),
      desagioPercentage: rateCalc.desagioPercentage.toPercentageValue().toNumber(),
      desagioAmount: rateCalc.desagioAmount.toNumber(),
    };
  }

  private buildTaxCalculationsDTO(taxCalcs: TaxCalculations): TaxCalculationsDTO {
    return {
      iss: {
        taxBase: taxCalcs.issCalculation.taxBase.toNumber(),
        rate: taxCalcs.issCalculation.taxRate.toPercentageValue().toNumber(),
        amount: taxCalcs.issCalculation.taxAmount.toNumber(),
      },
      pis: {
        taxBase: taxCalcs.pisCalculation.taxBase.toNumber(),
        rate: taxCalcs.pisCalculation.taxRate.toPercentageValue().toNumber(),
        amount: taxCalcs.pisCalculation.taxAmount.toNumber(),
      },
      cofins: {
        taxBase: taxCalcs.cofinsCalculation.taxBase.toNumber(),
        rate: taxCalcs.cofinsCalculation.taxRate.toPercentageValue().toNumber(),
        amount: taxCalcs.cofinsCalculation.taxAmount.toNumber(),
      },
      irpj: {
        taxBase: taxCalcs.irpjCalculation.taxBase.toNumber(),
        rate: taxCalcs.irpjCalculation.taxRate.toPercentageValue().toNumber(),
        amount: taxCalcs.irpjCalculation.taxAmount.toNumber(),
      },
      csll: {
        taxBase: taxCalcs.csllCalculation.taxBase.toNumber(),
        rate: taxCalcs.csllCalculation.taxRate.toPercentageValue().toNumber(),
        amount: taxCalcs.csllCalculation.taxAmount.toNumber(),
      },
      iof: {
        taxBase: taxCalcs.iofCalculation.taxBase.toNumber(),
        dailyRate: taxCalcs.iofCalculation.dailyRate.toPercentageValue().toNumber(),
        fixedRate: taxCalcs.iofCalculation.fixedRate.toPercentageValue().toNumber(),
        dailyIOF: taxCalcs.iofCalculation.dailyIOF.toNumber(),
        fixedIOF: taxCalcs.iofCalculation.fixedIOF.toNumber(),
        amount: taxCalcs.iofCalculation.totalIOFAmount.toNumber(),
        daysUntilMaturity: taxCalcs.iofCalculation.daysUntilMaturity,
      },
      totalTaxAmount: taxCalcs.totalTaxAmount.toNumber(),
      effectiveTaxRate: taxCalcs.effectiveTaxRate.toPercentageValue().toNumber(),
    };
  }

  private buildNetCalculationDTO(netCalc: NetCalculation): NetCalculationDTO {
    return {
      duplicataFaceValue: netCalc.duplicataFaceValue.toNumber(),
      totalDesagio: netCalc.totalDesagio.toNumber(),
      totalTaxes: netCalc.totalTaxes.toNumber(),
      netAmount: netCalc.netAmount.toNumber(),
      effectiveDiscount: netCalc.effectiveDiscount.toPercentageValue().toNumber(),
    };
  }
}
