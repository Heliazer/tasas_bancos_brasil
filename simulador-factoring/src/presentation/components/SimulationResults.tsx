import type { SimulationOutputDTO } from '../../application/dtos/SimulationOutputDTO';
import { formatCurrency, formatPercentage, formatDate, formatNumber } from '../../utils/formatters';

interface SimulationResultsProps {
  results: SimulationOutputDTO;
}

export function SimulationResults({ results }: SimulationResultsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-sky-600 to-sky-700 text-white">
        <h2 className="text-2xl font-bold mb-2">Resultado de la Simulación</h2>
        <p className="text-sky-100">
          Simulado el {formatDate(results.simulatedAt)}
        </p>
      </div>

      {/* Información de la Duplicata */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Información de la Duplicata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Número</p>
            <p className="text-lg font-semibold">{results.duplicataNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Valor Nominal</p>
            <p className="text-lg font-semibold">{formatCurrency(results.faceValue)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Fecha de Vencimiento</p>
            <p className="text-lg font-semibold">{formatDate(results.dueDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Días hasta Vencimiento</p>
            <p className="text-lg font-semibold">{results.daysToMaturity} días ({formatNumber(results.termInMonths, 1)} meses)</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">Deudor</p>
            <p className="text-lg font-semibold">{results.debtorName}</p>
            <p className="text-sm text-gray-500">{results.debtorDocument}</p>
          </div>
        </div>
      </div>

      {/* Cálculo de Tasa */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Cálculo de Tasa</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-gray-700">Tasa Base Mensual</span>
            <span className="font-semibold">{formatPercentage(results.rateCalculation.baseMonthlyRate)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-gray-700">+ Ajuste por Riesgo</span>
            <span className="font-semibold text-orange-600">+{formatPercentage(results.rateCalculation.riskAdjustment)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-gray-700">+ Ajuste por Modalidad</span>
            <span className="font-semibold text-orange-600">+{formatPercentage(results.rateCalculation.modalityAdjustment)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-gray-700">- Descuento por Volumen</span>
            <span className="font-semibold text-green-600">-{formatPercentage(results.rateCalculation.volumeDiscount)}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold text-gray-900">Tasa Mensual Final</span>
            <span className="text-xl font-bold text-sky-600">{formatPercentage(results.rateCalculation.finalMonthlyRate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tasa Anual Efectiva</span>
            <span className="text-sm font-semibold text-gray-700">{formatPercentage(results.rateCalculation.effectiveAnnualRate)}</span>
          </div>
        </div>
      </div>

      {/* Deságio */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Cálculo del Deságio</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Fórmula: Tasa × Plazo</p>
            <p className="text-gray-700">
              {formatPercentage(results.rateCalculation.finalMonthlyRate)} × {formatNumber(results.termInMonths, 1)} meses = {formatPercentage(results.rateCalculation.desagioPercentage)}
            </p>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-blue-300">
            <span className="text-lg font-bold text-gray-900">Valor del Deságio</span>
            <span className="text-2xl font-bold text-blue-700">{formatCurrency(results.rateCalculation.desagioAmount)}</span>
          </div>
        </div>
      </div>

      {/* Tributos */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tributos</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2">
            <div>
              <p className="font-medium text-gray-900">ISS ({formatPercentage(results.taxCalculations.iss.rate)} sobre el deságio)</p>
              <p className="text-sm text-gray-600">Base: {formatCurrency(results.taxCalculations.iss.taxBase)}</p>
            </div>
            <span className="font-semibold text-red-600">{formatCurrency(results.taxCalculations.iss.amount)}</span>
          </div>
          <div className="flex justify-between items-center pb-2">
            <div>
              <p className="font-medium text-gray-900">PIS ({formatPercentage(results.taxCalculations.pis.rate)} sobre el deságio)</p>
              <p className="text-sm text-gray-600">Base: {formatCurrency(results.taxCalculations.pis.taxBase)}</p>
            </div>
            <span className="font-semibold text-red-600">{formatCurrency(results.taxCalculations.pis.amount)}</span>
          </div>
          <div className="flex justify-between items-center pb-2">
            <div>
              <p className="font-medium text-gray-900">COFINS ({formatPercentage(results.taxCalculations.cofins.rate)} sobre el deságio)</p>
              <p className="text-sm text-gray-600">Base: {formatCurrency(results.taxCalculations.cofins.taxBase)}</p>
            </div>
            <span className="font-semibold text-red-600">{formatCurrency(results.taxCalculations.cofins.amount)}</span>
          </div>

          {results.taxCalculations.irpj && (
            <div className="flex justify-between items-center pb-2">
              <div>
                <p className="font-medium text-gray-900">IRPJ ({formatPercentage(results.taxCalculations.irpj.rate)} sobre lucro presumido)</p>
                <p className="text-sm text-gray-600">Base: {formatCurrency(results.taxCalculations.irpj.taxBase)}</p>
              </div>
              <span className="font-semibold text-red-600">{formatCurrency(results.taxCalculations.irpj.amount)}</span>
            </div>
          )}

          {results.taxCalculations.csll && (
            <div className="flex justify-between items-center pb-2">
              <div>
                <p className="font-medium text-gray-900">CSLL ({formatPercentage(results.taxCalculations.csll.rate)} sobre lucro presumido)</p>
                <p className="text-sm text-gray-600">Base: {formatCurrency(results.taxCalculations.csll.taxBase)}</p>
              </div>
              <span className="font-semibold text-red-600">{formatCurrency(results.taxCalculations.csll.amount)}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t-2">
            <span className="text-lg font-bold text-gray-900">Total de Tributos</span>
            <span className="text-xl font-bold text-red-700">{formatCurrency(results.taxCalculations.totalTaxAmount)}</span>
          </div>
          <div className="text-sm text-gray-600 text-right">
            Carga Tributaria Efectiva: {formatPercentage(results.taxCalculations.effectiveTaxRate)}
          </div>
        </div>
      </div>

      {/* Valor Neto - Destacado */}
      <div className="card bg-gradient-to-r from-green-600 to-green-700 text-white">
        <h3 className="text-xl font-bold mb-4">Valor Neto</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-green-50">
            <span>Valor Nominal de la Duplicata</span>
            <span className="font-semibold">{formatCurrency(results.netCalculation.duplicataFaceValue)}</span>
          </div>
          <div className="flex justify-between items-center text-green-50">
            <span>(-) Deságio</span>
            <span className="font-semibold">{formatCurrency(results.netCalculation.totalDesagio)}</span>
          </div>
          <div className="flex justify-between items-center text-green-50">
            <span>(-) Tributos</span>
            <span className="font-semibold">{formatCurrency(results.netCalculation.totalTaxes)}</span>
          </div>
          <div className="border-t-2 border-green-400 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">VALOR A RECIBIR</span>
              <span className="text-3xl font-bold">{formatCurrency(results.netCalculation.netAmount)}</span>
            </div>
            <p className="text-right text-green-100 mt-2">
              Descuento Efectivo Total: {formatPercentage(results.netCalculation.effectiveDiscount)}
            </p>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen de la Operación</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Usted Recibe</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(results.netCalculation.netAmount)}</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Costo Total</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(results.netCalculation.totalDesagio + results.netCalculation.totalTaxes)}</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Anticipación</p>
            <p className="text-2xl font-bold text-sky-600">{results.daysToMaturity} días</p>
          </div>
        </div>
      </div>
    </div>
  );
}
