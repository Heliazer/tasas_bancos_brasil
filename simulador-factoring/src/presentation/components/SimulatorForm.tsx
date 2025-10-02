import { useState } from 'react';
import type { SimulationInputDTO } from '../../application/dtos/SimulationInputDTO';
import { EconomicSector } from '../../domain/enums/EconomicSector';
import { FactoringModality } from '../../domain/enums/FactoringModality';
import { RiskProfile } from '../../domain/enums/RiskProfile';
import { CreditRating } from '../../domain/enums/CreditRating';
import { TaxRegime } from '../../domain/enums/TaxRegime';
import { formatCNPJ } from '../../utils/formatters';

interface SimulatorFormProps {
  onSubmit: (input: SimulationInputDTO) => void;
  isLoading?: boolean;
}

export function SimulatorForm({ onSubmit, isLoading = false }: SimulatorFormProps) {
  const [formData, setFormData] = useState<SimulationInputDTO>({
    duplicataNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    faceValue: 0,
    debtorName: '',
    debtorDocument: '',
    debtorCreditRating: CreditRating.A,
    creditorName: '',
    creditorDocument: '',
    economicSector: EconomicSector.SERVICES,
    modality: FactoringModality.WITH_RECOURSE,
    clientRiskProfile: RiskProfile.B,
    taxRegime: TaxRegime.LUCRO_REAL,
    municipalityCode: '3550308',
    municipalityName: 'São Paulo',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SimulationInputDTO, string>>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof SimulationInputDTO]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = formatCNPJ(value);
    setFormData((prev) => ({ ...prev, [name]: formatted }));
    if (errors[name as keyof SimulationInputDTO]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, [name]: numValue }));
    if (errors[name as keyof SimulationInputDTO]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SimulationInputDTO, string>> = {};

    if (!formData.duplicataNumber) {
      newErrors.duplicataNumber = 'Número de duplicata es requerido';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Fecha de vencimiento es requerida';
    }

    if (formData.faceValue <= 0) {
      newErrors.faceValue = 'Valor nominal debe ser mayor a cero';
    }

    // Debtor and Creditor fields are optional (no validation)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Información de la Duplicata */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Información de la Duplicata</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="duplicataNumber" className="label">
              Número de Duplicata *
            </label>
            <input
              type="text"
              id="duplicataNumber"
              name="duplicataNumber"
              value={formData.duplicataNumber}
              onChange={handleInputChange}
              className="input-field"
              placeholder="DUP-2025-001"
            />
            {errors.duplicataNumber && <p className="error-text">{errors.duplicataNumber}</p>}
          </div>

          <div>
            <label htmlFor="faceValue" className="label">
              Valor Nominal (R$) *
            </label>
            <input
              type="number"
              id="faceValue"
              name="faceValue"
              value={formData.faceValue || ''}
              onChange={handleNumberChange}
              className="input-field"
              placeholder="100000.00"
              step="0.01"
              min="0"
            />
            {errors.faceValue && <p className="error-text">{errors.faceValue}</p>}
          </div>

          <div>
            <label htmlFor="issueDate" className="label">
              Fecha de Emisión *
            </label>
            <input
              type="date"
              id="issueDate"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleInputChange}
              className="input-field"
            />
            {errors.issueDate && <p className="error-text">{errors.issueDate}</p>}
          </div>

          <div>
            <label htmlFor="dueDate" className="label">
              Fecha de Vencimiento *
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="input-field"
            />
            {errors.dueDate && <p className="error-text">{errors.dueDate}</p>}
          </div>
        </div>
      </div>

      {/* Información del Deudor (Sacado) */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Información del Deudor (Sacado) <span className="text-sm text-gray-500 font-normal">(Opcional)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="debtorName" className="label">
              Nombre del Deudor
            </label>
            <input
              type="text"
              id="debtorName"
              name="debtorName"
              value={formData.debtorName}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Empresa Compradora Ltda"
            />
            {errors.debtorName && <p className="error-text">{errors.debtorName}</p>}
          </div>

          <div>
            <label htmlFor="debtorDocument" className="label">
              CNPJ del Deudor
            </label>
            <input
              type="text"
              id="debtorDocument"
              name="debtorDocument"
              value={formData.debtorDocument}
              onChange={handleCNPJChange}
              className="input-field"
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
            {errors.debtorDocument && <p className="error-text">{errors.debtorDocument}</p>}
          </div>

          <div>
            <label htmlFor="debtorCreditRating" className="label">
              Calificación de Crédito del Deudor
            </label>
            <select
              id="debtorCreditRating"
              name="debtorCreditRating"
              value={formData.debtorCreditRating}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value={CreditRating.AAA}>AAA - Excelente</option>
              <option value={CreditRating.AA}>AA - Muy Bueno</option>
              <option value={CreditRating.A}>A - Bueno</option>
              <option value={CreditRating.BBB}>BBB - Regular</option>
              <option value={CreditRating.BB}>BB - Moderado</option>
              <option value={CreditRating.B}>B - Alto Riesgo</option>
              <option value={CreditRating.CCC}>CCC - Muy Alto Riesgo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Información del Acreedor (Cedente) */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Información del Acreedor (Cedente) <span className="text-sm text-gray-500 font-normal">(Opcional)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="creditorName" className="label">
              Nombre del Acreedor
            </label>
            <input
              type="text"
              id="creditorName"
              name="creditorName"
              value={formData.creditorName}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Empresa Vendedora Ltda"
            />
            {errors.creditorName && <p className="error-text">{errors.creditorName}</p>}
          </div>

          <div>
            <label htmlFor="creditorDocument" className="label">
              CNPJ del Acreedor
            </label>
            <input
              type="text"
              id="creditorDocument"
              name="creditorDocument"
              value={formData.creditorDocument}
              onChange={handleCNPJChange}
              className="input-field"
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
            {errors.creditorDocument && <p className="error-text">{errors.creditorDocument}</p>}
          </div>
        </div>
      </div>

      {/* Parámetros de la Operación */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Parámetros de la Operación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="economicSector" className="label">
              Sector Económico *
            </label>
            <select
              id="economicSector"
              name="economicSector"
              value={formData.economicSector}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value={EconomicSector.RETAIL}>Comercio Minorista</option>
              <option value={EconomicSector.SERVICES}>Servicios</option>
              <option value={EconomicSector.INDUSTRY}>Industria</option>
              <option value={EconomicSector.CONSTRUCTION}>Construcción</option>
              <option value={EconomicSector.HEALTHCARE}>Salud</option>
              <option value={EconomicSector.AGRICULTURE}>Agricultura</option>
              <option value={EconomicSector.TECHNOLOGY}>Tecnología</option>
              <option value={EconomicSector.OTHER}>Otro</option>
            </select>
          </div>

          <div>
            <label htmlFor="modality" className="label">
              Modalidad de Factoring *
            </label>
            <select
              id="modality"
              name="modality"
              value={formData.modality}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value={FactoringModality.WITH_RECOURSE}>Con Regreso (Convencional)</option>
              <option value={FactoringModality.WITHOUT_RECOURSE}>Sin Regreso (Convencional)</option>
              <option value={FactoringModality.MATURITY}>Maturity (Sin Adelanto)</option>
              <option value={FactoringModality.TRUSTEE}>Trustee (Administración Integral)</option>
              <option value={FactoringModality.INTERNATIONAL}>Internacional</option>
              <option value={FactoringModality.RAW_MATERIAL}>Materia Prima</option>
            </select>
          </div>

          <div>
            <label htmlFor="clientRiskProfile" className="label">
              Perfil de Riesgo del Cliente *
            </label>
            <select
              id="clientRiskProfile"
              name="clientRiskProfile"
              value={formData.clientRiskProfile}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value={RiskProfile.A}>A - Excelente</option>
              <option value={RiskProfile.B}>B - Muy Bueno</option>
              <option value={RiskProfile.C}>C - Bueno</option>
              <option value={RiskProfile.D}>D - Regular</option>
              <option value={RiskProfile.E}>E - Alto Riesgo</option>
            </select>
          </div>

          <div>
            <label htmlFor="taxRegime" className="label">
              Régimen Tributario *
            </label>
            <select
              id="taxRegime"
              name="taxRegime"
              value={formData.taxRegime}
              onChange={handleInputChange}
              className="input-field"
              disabled
            >
              <option value={TaxRegime.LUCRO_REAL}>Lucro Real (Obligatorio)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Las empresas de factoring deben usar Lucro Real por ley (Lei 9.718/98)
            </p>
          </div>

          <div>
            <label htmlFor="municipalityName" className="label">
              Municipio *
            </label>
            <input
              type="text"
              id="municipalityName"
              name="municipalityName"
              value={formData.municipalityName}
              onChange={handleInputChange}
              className="input-field"
              placeholder="São Paulo"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-secondary"
          disabled={isLoading}
        >
          Limpiar
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Calculando...' : 'Simular Factoring'}
        </button>
      </div>
    </form>
  );
}
