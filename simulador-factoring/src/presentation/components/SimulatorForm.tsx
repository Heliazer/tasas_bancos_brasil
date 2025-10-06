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
  // Calcular fecha de vencimiento a 30 días desde hoy
  const getDefaultDueDate = () => {
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 30);
    return dueDate.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState<SimulationInputDTO>({
    duplicataNumber: 'SIM-' + Date.now(),
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: getDefaultDueDate(),
    faceValue: 250000,
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
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div
            className="rounded-lg p-1.5 md:p-2 flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #D4A017 0%, #FFDF00 100%)',
              boxShadow: '0 4px 12px rgba(212, 160, 23, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            }}
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 className="text-base md:text-xl font-bold truncate" style={{ color: '#2C3E50' }}>Parâmetros da Simulação</h2>
            <p className="text-xs md:text-sm" style={{ color: '#546E7A' }}>Configure os detalhes da operação de factoring</p>
          </div>
        </div>

        {/* Valor y Plazo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          <div>
            <label htmlFor="faceValue" className="label text-xs md:text-sm">
              Valor Nominal (R$) *
            </label>
            <input
              type="number"
              id="faceValue"
              name="faceValue"
              value={formData.faceValue || ''}
              onChange={handleNumberChange}
              className="input-field text-base md:text-sm"
              placeholder="100000.00"
              step="0.01"
              min="0"
            />
            <p className="text-xs text-slate-500 mt-1">
              Monto total de la duplicata a factorizar
            </p>
            {errors.faceValue && <p className="error-text">{errors.faceValue}</p>}
          </div>

          <div>
            <label htmlFor="dueDate" className="label text-xs md:text-sm">
              Fecha de Vencimiento *
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="input-field text-base md:text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">
              Define el plazo de la operación (en días)
            </p>
            {errors.dueDate && <p className="error-text">{errors.dueDate}</p>}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 mb-6"></div>

        {/* Parámetros de Simulación - Información Estática */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm md:text-base font-bold text-blue-900">Parámetros de esta Simulación</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
            <div className="bg-white/70 rounded-lg p-3">
              <p className="text-gray-600 font-medium mb-1">Sector Económico</p>
              <p className="text-gray-900 font-semibold">Servicios</p>
            </div>

            <div className="bg-white/70 rounded-lg p-3">
              <p className="text-gray-600 font-medium mb-1">Modalidad de Factoring</p>
              <p className="text-gray-900 font-semibold">Con Regreso (Convencional)</p>
            </div>

            <div className="bg-white/70 rounded-lg p-3">
              <p className="text-gray-600 font-medium mb-1">Perfil de Riesgo del Cliente</p>
              <p className="text-gray-900 font-semibold">B - Muy Bueno</p>
            </div>

            <div className="bg-white/70 rounded-lg p-3">
              <p className="text-gray-600 font-medium mb-1">Calificación del Deudor</p>
              <p className="text-gray-900 font-semibold">A - Bueno</p>
            </div>

            <div className="bg-white/70 rounded-lg p-3">
              <p className="text-gray-600 font-medium mb-1">Municipio</p>
              <p className="text-gray-900 font-semibold">São Paulo</p>
            </div>

            <div className="bg-white/70 rounded-lg p-3">
              <p className="text-gray-600 font-medium mb-1">Régimen Tributario</p>
              <p className="text-gray-900 font-semibold">Lucro Real (Obligatorio)</p>
            </div>
          </div>

          <p className="text-xs text-blue-700 mt-4 italic">
            Estos parámetros se utilizarán para calcular la tasa de factoring aplicable a tu operación.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-secondary w-full sm:w-auto order-2 sm:order-1"
          disabled={isLoading}
        >
          Limpiar Formulario
        </button>
        <button
          type="submit"
          className="btn-primary w-full sm:w-auto order-1 sm:order-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
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
