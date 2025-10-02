import { Money } from './Money';
import { Percentage } from './Percentage';
import { ISSCalculation, type Municipality } from './ISSCalculation';
import { PISCalculation } from './PISCalculation';
import { COFINSCalculation } from './COFINSCalculation';
import { IRPJCalculation } from './IRPJCalculation';
import { CSLLCalculation } from './CSLLCalculation';
import { IOFCalculation, IOFEntityType } from './IOFCalculation';
import { TaxRegime } from '../enums/TaxRegime';

export class TaxCalculations {
  readonly issCalculation: ISSCalculation;
  readonly pisCalculation: PISCalculation;
  readonly cofinsCalculation: COFINSCalculation;
  readonly irpjCalculation: IRPJCalculation;
  readonly csllCalculation: CSLLCalculation;
  readonly iofCalculation: IOFCalculation;
  readonly totalTaxAmount: Money;
  readonly effectiveTaxRate: Percentage;

  constructor(
    desagioAmount: Money,
    faceValue: Money,
    netAmount: Money,  // Amount paid to client (for IOF base)
    daysUntilMaturity: number,
    taxRegime: TaxRegime,
    municipality: Municipality
  ) {
    // ISS is calculated on the deságio (service fee)
    this.issCalculation = new ISSCalculation(desagioAmount, municipality);

    // PIS/COFINS on gross revenue (deságio) - NON-CUMULATIVE for Lucro Real
    this.pisCalculation = new PISCalculation(desagioAmount, taxRegime);
    this.cofinsCalculation = new COFINSCalculation(desagioAmount, taxRegime);

    // IRPJ/CSLL - factoring companies MUST use Lucro Real (Lei 9.718/98)
    this.irpjCalculation = new IRPJCalculation(desagioAmount, taxRegime);
    this.csllCalculation = new CSLLCalculation(desagioAmount, taxRegime);

    // IOF - applies to factoring operations (Instrução Normativa RFB 1.543/2015)
    // Default to Pessoa Jurídica (most common case)
    this.iofCalculation = new IOFCalculation(
      netAmount,
      daysUntilMaturity,
      IOFEntityType.PESSOA_JURIDICA
    );

    // Calculate totals
    this.totalTaxAmount = this.calculateTotalTax();

    this.effectiveTaxRate = Percentage.fromDecimal(
      this.totalTaxAmount.amount.dividedBy(faceValue.amount)
    );
  }

  private calculateTotalTax(): Money {
    let total = this.issCalculation.taxAmount
      .add(this.pisCalculation.taxAmount)
      .add(this.cofinsCalculation.taxAmount)
      .add(this.irpjCalculation.taxAmount)
      .add(this.csllCalculation.taxAmount)
      .add(this.iofCalculation.totalIOFAmount);

    return total.roundToTaxStandard();
  }
}
