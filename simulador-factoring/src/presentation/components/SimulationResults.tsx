import type { SimulationOutputDTO } from '../../application/dtos/SimulationOutputDTO';
import { formatCurrency, formatPercentage, formatDate, formatNumber } from '../../utils/formatters';

interface SimulationResultsProps {
  results: SimulationOutputDTO;
}

export function SimulationResults({ results }: SimulationResultsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-slate-100 border-2 border-slate-400">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Cálculo de Operación</h2>
            <p className="text-xs text-slate-600 mt-1">
              Fecha de simulación: {formatDate(results.simulatedAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-600 font-mono">N° {results.duplicataNumber}</p>
          </div>
        </div>
      </div>

      {/* Información de la Duplicata */}
      <div className="card">
        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide border-b-2 border-slate-800 pb-2">Datos de la Duplicata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-wide font-bold mb-1">Número de Duplicata</p>
            <p className="text-base font-mono font-semibold text-slate-900">{results.duplicataNumber}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-wide font-bold mb-1">Valor Nominal</p>
            <p className="text-base font-mono font-semibold text-slate-900">{formatCurrency(results.faceValue)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-wide font-bold mb-1">Fecha de Vencimiento</p>
            <p className="text-base font-mono font-semibold text-slate-900">{formatDate(results.dueDate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-wide font-bold mb-1">Plazo</p>
            <p className="text-base font-mono font-semibold text-slate-900">{results.daysToMaturity} días ({formatNumber(results.termInMonths, 1)} meses)</p>
          </div>
          <div className="md:col-span-2 border-t pt-3 mt-2">
            <p className="text-xs text-slate-600 uppercase tracking-wide font-bold mb-1">Deudor (Sacado)</p>
            <p className="text-base font-semibold text-slate-900">{results.debtorName}</p>
            <p className="text-xs text-slate-500 font-mono">{results.debtorDocument}</p>
          </div>
        </div>
      </div>

      {/* Cálculo de Tasa */}
      <div className="card">
        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide border-b-2 border-slate-800 pb-2">Cálculo de Tasa de Factoring</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-700">Tasa Base Mensual</span>
            <span className="font-mono font-semibold">{formatPercentage(results.rateCalculation.baseMonthlyRate)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-700">+ Ajuste por Riesgo</span>
            <span className="font-mono font-semibold text-red-700">+{formatPercentage(results.rateCalculation.riskAdjustment)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-700">+ Ajuste por Modalidad</span>
            <span className="font-mono font-semibold text-red-700">+{formatPercentage(results.rateCalculation.modalityAdjustment)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-700">- Descuento por Volumen</span>
            <span className="font-mono font-semibold text-green-700">-{formatPercentage(results.rateCalculation.volumeDiscount)}</span>
          </div>
          <div className="flex justify-between items-center pt-3 bg-slate-100 -mx-8 px-8 py-3 mt-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Tasa Mensual Final</span>
            <span className="text-lg font-mono font-bold text-slate-900">{formatPercentage(results.rateCalculation.finalMonthlyRate)}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-600">Tasa Anual Efectiva (TEA)</span>
            <span className="text-xs font-mono font-semibold text-slate-700">{formatPercentage(results.rateCalculation.effectiveAnnualRate)}</span>
          </div>
        </div>
      </div>

      {/* Deságio */}
      <div className="card bg-slate-50 border-2 border-slate-400">
        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide border-b-2 border-slate-800 pb-2">Cálculo del Deságio</h3>
        <div className="space-y-3 text-sm">
          <div className="bg-white p-3 border border-slate-300">
            <p className="text-xs text-slate-600 mb-2 uppercase tracking-wide font-bold">Fórmula Aplicada</p>
            <p className="text-slate-700 font-mono text-xs">
              Deságio = Tasa Mensual × Plazo en Meses
            </p>
            <p className="text-slate-900 font-mono text-sm mt-2">
              {formatPercentage(results.rateCalculation.finalMonthlyRate)} × {formatNumber(results.termInMonths, 1)} = {formatPercentage(results.rateCalculation.desagioPercentage)}
            </p>
          </div>
          <div className="flex justify-between items-center pt-3 bg-slate-800 text-white -mx-8 px-8 py-4">
            <span className="text-xs font-bold uppercase tracking-wide">Valor del Deságio</span>
            <span className="text-2xl font-mono font-bold">{formatCurrency(results.rateCalculation.desagioAmount)}</span>
          </div>
        </div>
      </div>

      {/* Tributos */}
      <div className="card">
        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide border-b-2 border-slate-800 pb-2">Cálculo de Tributos</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <div>
              <p className="font-semibold text-slate-900 text-xs uppercase tracking-wide">ISS ({formatPercentage(results.taxCalculations.iss.rate)})</p>
              <p className="text-xs text-slate-600 font-mono">Base: {formatCurrency(results.taxCalculations.iss.taxBase)}</p>
            </div>
            <span className="font-mono font-semibold text-red-700">{formatCurrency(results.taxCalculations.iss.amount)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <div>
              <p className="font-semibold text-slate-900 text-xs uppercase tracking-wide">PIS ({formatPercentage(results.taxCalculations.pis.rate)})</p>
              <p className="text-xs text-slate-600 font-mono">Base: {formatCurrency(results.taxCalculations.pis.taxBase)}</p>
            </div>
            <span className="font-mono font-semibold text-red-700">{formatCurrency(results.taxCalculations.pis.amount)}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <div>
              <p className="font-semibold text-slate-900 text-xs uppercase tracking-wide">COFINS ({formatPercentage(results.taxCalculations.cofins.rate)})</p>
              <p className="text-xs text-slate-600 font-mono">Base: {formatCurrency(results.taxCalculations.cofins.taxBase)}</p>
            </div>
            <span className="font-mono font-semibold text-red-700">{formatCurrency(results.taxCalculations.cofins.amount)}</span>
          </div>

          {results.taxCalculations.irpj && (
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <div>
                <p className="font-semibold text-slate-900 text-xs uppercase tracking-wide">IRPJ ({formatPercentage(results.taxCalculations.irpj.rate)})</p>
                <p className="text-xs text-slate-600 font-mono">Base: {formatCurrency(results.taxCalculations.irpj.taxBase)}</p>
              </div>
              <span className="font-mono font-semibold text-red-700">{formatCurrency(results.taxCalculations.irpj.amount)}</span>
            </div>
          )}

          {results.taxCalculations.csll && (
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <div>
                <p className="font-semibold text-slate-900 text-xs uppercase tracking-wide">CSLL ({formatPercentage(results.taxCalculations.csll.rate)})</p>
                <p className="text-xs text-slate-600 font-mono">Base: {formatCurrency(results.taxCalculations.csll.taxBase)}</p>
              </div>
              <span className="font-mono font-semibold text-red-700">{formatCurrency(results.taxCalculations.csll.amount)}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 bg-slate-100 -mx-8 px-8 py-3 mt-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Total de Tributos</span>
            <span className="text-lg font-mono font-bold text-red-800">{formatCurrency(results.taxCalculations.totalTaxAmount)}</span>
          </div>
          <div className="text-xs text-slate-600 text-right pt-2">
            Carga Tributaria Efectiva: {formatPercentage(results.taxCalculations.effectiveTaxRate)}
          </div>
        </div>
      </div>

      {/* Valor Neto - Destacado */}
      <div className="card bg-slate-800 text-white border-4 border-double border-slate-900">
        <h3 className="text-sm font-bold mb-4 uppercase tracking-wide border-b-2 border-white pb-2">Cálculo del Valor Neto a Recibir</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center text-slate-100">
            <span>Valor Nominal de la Duplicata</span>
            <span className="font-mono font-semibold">{formatCurrency(results.netCalculation.duplicataFaceValue)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-100">
            <span>(-) Deságio</span>
            <span className="font-mono font-semibold text-red-300">{formatCurrency(results.netCalculation.totalDesagio)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-100">
            <span>(-) Tributos</span>
            <span className="font-mono font-semibold text-red-300">{formatCurrency(results.netCalculation.totalTaxes)}</span>
          </div>
          <div className="border-t-4 border-double border-white pt-4 mt-4">
            <div className="flex justify-between items-center bg-white text-slate-900 -mx-8 px-8 py-4">
              <span className="text-lg font-bold uppercase tracking-wide">Valor a Recibir</span>
              <span className="text-3xl font-mono font-bold">{formatCurrency(results.netCalculation.netAmount)}</span>
            </div>
            <p className="text-right text-slate-300 mt-3 text-xs">
              Descuento Efectivo Total: {formatPercentage(results.netCalculation.effectiveDiscount)}
            </p>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="card bg-slate-50 border-2 border-slate-300">
        <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide border-b-2 border-slate-800 pb-2">Resumen de la Operación</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white border border-slate-300">
            <p className="text-xs text-slate-600 mb-2 uppercase tracking-wide font-bold">Valor a Recibir</p>
            <p className="text-2xl font-mono font-bold text-green-700">{formatCurrency(results.netCalculation.netAmount)}</p>
          </div>
          <div className="text-center p-4 bg-white border border-slate-300">
            <p className="text-xs text-slate-600 mb-2 uppercase tracking-wide font-bold">Costo Total</p>
            <p className="text-2xl font-mono font-bold text-red-700">{formatCurrency(results.netCalculation.totalDesagio + results.netCalculation.totalTaxes)}</p>
          </div>
          <div className="text-center p-4 bg-white border border-slate-300">
            <p className="text-xs text-slate-600 mb-2 uppercase tracking-wide font-bold">Anticipación</p>
            <p className="text-2xl font-mono font-bold text-slate-800">{results.daysToMaturity} días</p>
          </div>
        </div>
      </div>
    </div>
  );
}
