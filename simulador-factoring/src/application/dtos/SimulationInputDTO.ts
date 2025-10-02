import { EconomicSector } from '../../domain/enums/EconomicSector';
import { FactoringModality } from '../../domain/enums/FactoringModality';
import { RiskProfile } from '../../domain/enums/RiskProfile';
import { CreditRating } from '../../domain/enums/CreditRating';
import { TaxRegime } from '../../domain/enums/TaxRegime';

export interface SimulationInputDTO {
  // Duplicata information
  duplicataNumber: string;
  issueDate: string; // ISO date string
  dueDate: string; // ISO date string
  faceValue: number;

  // Debtor information
  debtorName: string;
  debtorDocument: string; // CNPJ
  debtorCreditRating: CreditRating;

  // Creditor information
  creditorName: string;
  creditorDocument: string; // CNPJ

  // Operation parameters
  economicSector: EconomicSector;
  modality: FactoringModality;
  clientRiskProfile: RiskProfile;
  taxRegime: TaxRegime;
  municipalityCode: string; // IBGE code
  municipalityName: string;
}
