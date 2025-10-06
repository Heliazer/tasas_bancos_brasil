import { useState } from 'react';
import type { SimulationInputDTO } from '../../application/dtos/SimulationInputDTO';
import { EconomicSector } from '../../domain/enums/EconomicSector';
import { FactoringModality } from '../../domain/enums/FactoringModality';
import { RiskProfile } from '../../domain/enums/RiskProfile';
import { CreditRating } from '../../domain/enums/CreditRating';
import { TaxRegime } from '../../domain/enums/TaxRegime';

interface SimulatorFormProps {
  onSubmit: (input: SimulationInputDTO) => void;
  isLoading?: boolean;
}

export function SimulatorForm({ onSubmit, isLoading = false }: SimulatorFormProps) {
  const [formData, setFormData] = useState<SimulationInputDTO>({
    duplicataNumber: 'SIM-' + Date.now(),
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    faceValue: 0,
    debtorName: 'Simulación',
    debtorDocument: '',
    debtorCreditRating: CreditRating.A,
    creditorName: 'Simulación',
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

    if (!formData.dueDate) {
      newErrors.dueDate = 'Fecha de vencimiento es requerida';
    }

    if (formData.faceValue <= 0) {
      newErrors.faceValue = 'Valor nominal debe ser mayor a cero';
    }

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Parámetros de la Operación */}
      <div className="card-elevated">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="rounded-lg p-2"
            style={{
              background: 'linear-gradient(135deg, #D4A017 0%, #FFDF00 100%)',
              boxShadow: '0 4px 12px rgba(212, 160, 23, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#2C3E50' }}>Parâmetros da Simulação</h2>
            <p className="text-sm" style={{ color: '#546E7A' }}>Configure os detalhes da operação de factoring</p>
          </div>
        </div>

        {/* Valor y Plazo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
            <p className="text-xs text-slate-500 mt-1.5">
              Monto total de la duplicata a factorizar
            </p>
            {errors.faceValue && <p className="error-text">{errors.faceValue}</p>}
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
            <p className="text-xs text-slate-500 mt-1.5">
              Define el plazo de la operación (en días)
            </p>
            {errors.dueDate && <p className="error-text">{errors.dueDate}</p>}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 mb-6"></div>
        {/* Parámetros de Riesgo y Operación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <p className="text-xs text-slate-500 mt-1.5">
              Afecta la tasa base según riesgo sectorial
            </p>
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
            <p className="text-xs text-slate-500 mt-1.5">
              Define quién asume el riesgo y tipo de servicio
            </p>
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
            <p className="text-xs text-slate-500 mt-1.5">
              Evaluación crediticia que ajusta la tasa final
            </p>
          </div>

          <div>
            <label htmlFor="debtorCreditRating" className="label">
              Calificación del Deudor *
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
            <p className="text-xs text-slate-500 mt-1.5">
              Rating crediticio del sacado (pagador)
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
            <p className="text-xs text-slate-500 mt-1.5">
              Define la alícuota del ISS (2% a 5%)
            </p>
          </div>

          <div>
            <label htmlFor="taxRegime" className="label">
              Régimen Tributario
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
            <p className="text-xs text-slate-500 mt-1.5">
              Régimen obligatorio según Lei 9.718/98 Art. 14
            </p>
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
          Limpiar Formulario
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calculando...
            </span>
          ) : (
            'Simular Operación de Factoring'
          )}
        </button>
      </div>
    </form>
  );
}
