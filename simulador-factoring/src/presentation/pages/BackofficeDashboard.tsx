import { useState, useEffect } from 'react';
import { BackofficeOperationDetail } from '../components/organisms/BackofficeOperationDetail';
import { ForecastProjection } from '../components/organisms/ForecastProjection';
import { SimulateFactoringUseCase } from '../../application/use-cases/SimulateFactoringUseCase';
import type { SimulationInputDTO } from '../../application/dtos/SimulationInputDTO';
import type { SimulationOutputDTO } from '../../application/dtos/SimulationOutputDTO';
import { FactoringModality } from '../../domain/enums/FactoringModality';
import { RiskProfile } from '../../domain/enums/RiskProfile';
import { CreditRating } from '../../domain/enums/CreditRating';
import { TaxRegime } from '../../domain/enums/TaxRegime';
import { EconomicSector } from '../../domain/enums/EconomicSector';

/**
 * Dashboard Backoffice - Vista de la financiera
 * Muestra análisis detallado de operaciones y proyecciones
 */
export function BackofficeDashboard() {
  const [simulation, setSimulation] = useState<SimulationOutputDTO | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'operation' | 'forecast'>('operation');

  // Simular una operación cuando cambia el monto de inversión
  useEffect(() => {
    simulateOperation();
  }, [investmentAmount]);

  const simulateOperation = async () => {
    setLoading(true);
    try {
      const useCase = new SimulateFactoringUseCase();

      // Input de ejemplo - el usuario invierte este monto
      const input: SimulationInputDTO = {
        duplicataNumber: `DUP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
        issueDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 días
        faceValue: investmentAmount,
        debtorName: 'Empresa Compradora Ltda',
        debtorDocument: '12.345.678/0001-90',
        creditorName: 'Empresa Vendedora Ltda',
        creditorDocument: '98.765.432/0001-10',
        modality: FactoringModality.WITHOUT_RECOURSE,
        clientRiskProfile: RiskProfile.B,
        debtorCreditRating: CreditRating.A,
        economicSector: EconomicSector.RETAIL,
        taxRegime: TaxRegime.LUCRO_PRESUMIDO,
        municipalityCode: '3550308' // São Paulo
      };

      const result = await useCase.execute(input);
      setSimulation(result);
    } catch (error) {
      console.error('Error simulando operación:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular tasa neta mensual para el forecast
  const calculateNetMonthlyRate = () => {
    if (!simulation) return 3.5;

    const { rateCalculation, taxCalculations, netCalculation } = simulation;
    const desagio = netCalculation.totalDesagio;
    const impuestos = netCalculation.totalTaxes;
    const gananciaNeta = desagio - impuestos;
    const capitalInvertido = netCalculation.netAmount;

    // Retorno neto mensual
    const retornoMensual = (gananciaNeta / capitalInvertido) / simulation.termInMonths * 100;
    return retornoMensual;
  };

  const netMonthlyRate = calculateNetMonthlyRate();
  const effectiveTaxRate = simulation?.taxCalculations.effectiveTaxRate || 14.33;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Dashboard Backoffice</h1>
          <p className="text-gray-300 mt-1">Análisis de Operaciones Factoring</p>
        </div>
      </header>

      {/* Controles */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto de Inversión del Cliente
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  step={10000}
                  min={10000}
                  max={10000000}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={simulateOperation}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                >
                  {loading ? 'Calculando...' : 'Simular'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Valor nominal de la duplicata que el cliente presenta para factoring
              </p>
            </div>

            {/* Presets */}
            <div className="flex gap-2">
              <button
                onClick={() => setInvestmentAmount(50000)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
              >
                R$ 50k
              </button>
              <button
                onClick={() => setInvestmentAmount(100000)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
              >
                R$ 100k
              </button>
              <button
                onClick={() => setInvestmentAmount(500000)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
              >
                R$ 500k
              </button>
              <button
                onClick={() => setInvestmentAmount(1000000)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
              >
                R$ 1M
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('operation')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'operation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Detalle de Operación
              </button>
              <button
                onClick={() => setActiveTab('forecast')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'forecast'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Proyección 24 Meses
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && simulation && activeTab === 'operation' && (
          <BackofficeOperationDetail simulation={simulation} />
        )}

        {!loading && simulation && activeTab === 'forecast' && (
          <ForecastProjection
            initialCapital={simulation.netCalculation.netAmount}
            monthlyRate={netMonthlyRate}
            effectiveTaxRate={effectiveTaxRate}
          />
        )}

        {!loading && !simulation && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">Ingresa un monto y haz clic en "Simular" para ver el análisis</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2025 Tasa Brasil - Dashboard Backoffice
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Sistema de análisis interno. Uso exclusivo del equipo financiero.
          </p>
        </div>
      </footer>
    </div>
  );
}
