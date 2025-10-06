import type { SimulationOutputDTO } from '../../application/dtos/SimulationOutputDTO';
import { formatCurrency, formatPercentage, formatDate, formatNumber } from '../../utils/formatters';
import { MacroeconomicDataService } from '../../domain/services/MacroeconomicDataService';

interface SimulationResultsProps {
  results: SimulationOutputDTO;
}

export function SimulationResults({ results }: SimulationResultsProps) {
  const macroData = MacroeconomicDataService.getCurrentData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-xl p-5"
        style={{
          background: 'linear-gradient(145deg, #E8F5E9 0%, #C8E6C9 100%)',
          border: '2px solid rgba(0, 156, 79, 0.3)',
          boxShadow: '0 8px 20px rgba(0, 156, 79, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        }}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div
              className="rounded-lg p-2"
              style={{
                background: 'linear-gradient(135deg, #006B3D 0%, #009C4F 100%)',
                boxShadow: '0 4px 12px rgba(0, 107, 61, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: '#006B3D' }}>Simulação Concluída</h2>
              <p className="text-xs mt-0.5" style={{ color: '#1A5C42' }}>
                {formatDate(results.simulatedAt)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs mb-1" style={{ color: '#546E7A' }}>N° de Operação</p>
            <p className="text-sm font-mono font-bold" style={{ color: '#2C3E50' }}>{results.duplicataNumber}</p>
          </div>
        </div>
      </div>

      {/* Información de la Duplicata */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <div
            className="rounded-lg p-1.5"
            style={{
              background: 'linear-gradient(135deg, #002776 0%, #003893 100%)',
              boxShadow: '0 3px 8px rgba(0, 39, 118, 0.3)',
            }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold" style={{ color: '#2C3E50' }}>Dados da Duplicata</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2">Número de Duplicata</p>
            <p className="text-lg font-mono font-bold text-slate-900">{results.duplicataNumber}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2">Valor Nominal</p>
            <p className="text-lg font-mono font-bold text-emerald-700">{formatCurrency(results.faceValue)}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2">Fecha de Vencimiento</p>
            <p className="text-base font-mono font-bold text-slate-900">{formatDate(results.dueDate)}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2">Plazo</p>
            <p className="text-base font-mono font-bold text-slate-900">{results.daysToMaturity} días <span className="text-sm text-slate-600">({formatNumber(results.termInMonths, 1)} meses)</span></p>
          </div>
          <div className="md:col-span-2 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs font-semibold text-slate-700 mb-2">Deudor (Sacado)</p>
            <p className="text-base font-bold text-slate-900">{results.debtorName}</p>
            <p className="text-sm text-slate-600 font-mono mt-1">{results.debtorDocument}</p>
          </div>
        </div>
      </div>

      {/* Contexto Macroeconómico */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <div
            className="rounded-lg p-1.5"
            style={{
              background: 'linear-gradient(135deg, #D4A017 0%, #FFDF00 100%)',
              boxShadow: '0 3px 8px rgba(212, 160, 23, 0.3)',
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#2C3E50' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#2C3E50' }}>Contexto Macroeconômico Brasil</h3>
            <p className="text-xs" style={{ color: '#546E7A' }}>Atualizado: {macroData.lastUpdate}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="text-xs font-bold text-orange-800 uppercase">IPCA Atual</p>
            </div>
            <p className="text-2xl font-mono font-bold text-orange-900">{formatPercentage(macroData.ipca)}</p>
            <p className="text-xs text-orange-700 mt-1">Interanual (ago 2025)</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border-2 border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-xs font-bold text-amber-800 uppercase">IPCA Esperado</p>
            </div>
            <p className="text-2xl font-mono font-bold text-amber-900">{formatPercentage(macroData.ipcaExpected12m)}</p>
            <p className="text-xs text-amber-700 mt-1">Próximos 12 meses (Focus)</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-bold text-blue-800 uppercase">Taxa Selic</p>
            </div>
            <p className="text-2xl font-mono font-bold text-blue-900">{formatPercentage(macroData.selic)}</p>
            <p className="text-xs text-blue-700 mt-1">Anual (BCB)</p>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-lg" style={{
          background: 'linear-gradient(135deg, rgba(0, 107, 61, 0.05) 0%, rgba(0, 156, 79, 0.05) 100%)',
          border: '1px solid rgba(0, 156, 79, 0.2)'
        }}>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-bold text-green-900 mb-1">Impacto no Cálculo</p>
              <p className="text-xs text-green-800 leading-relaxed">
                A inflação esperada ({formatPercentage(macroData.ipcaExpected12m)}) está acima da meta do BCB ({formatPercentage(macroData.inflationTarget)}),
                gerando um ajuste de +{formatPercentage(results.rateCalculation.inflationAdjustment)} na taxa mensal para compensar a erosão do poder de compra.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cálculo de Tasa */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-bold text-slate-900">Cálculo de Tasa de Factoring</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2.5 px-4 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium text-slate-700">Tasa Base Mensual</span>
            <span className="font-mono font-bold text-base text-slate-900">{formatPercentage(results.rateCalculation.baseMonthlyRate)}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 px-4 bg-red-50 rounded-lg border border-red-100">
            <span className="text-sm font-medium text-slate-700">+ Ajuste por Riesgo</span>
            <span className="font-mono font-bold text-base text-red-600">+{formatPercentage(results.rateCalculation.riskAdjustment)}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 px-4 bg-red-50 rounded-lg border border-red-100">
            <span className="text-sm font-medium text-slate-700">+ Ajuste por Modalidad</span>
            <span className="font-mono font-bold text-base text-red-600">+{formatPercentage(results.rateCalculation.modalityAdjustment)}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 px-4 bg-orange-50 rounded-lg border border-orange-200">
            <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
              + Ajuste por Inflación
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </span>
            <span className="font-mono font-bold text-base text-orange-600">+{formatPercentage(results.rateCalculation.inflationAdjustment)}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 px-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <span className="text-sm font-medium text-slate-700">- Descuento por Volumen</span>
            <span className="font-mono font-bold text-base text-emerald-600">-{formatPercentage(results.rateCalculation.volumeDiscount)}</span>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white">Tasa Mensual Final</span>
              <span className="text-2xl font-mono font-bold text-white">{formatPercentage(results.rateCalculation.finalMonthlyRate)}</span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-blue-500">
              <span className="text-xs text-blue-100">Tasa Anual Efectiva (TEA)</span>
              <span className="text-sm font-mono font-bold text-blue-100">{formatPercentage(results.rateCalculation.effectiveAnnualRate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deságio */}
      <div className="card-elevated bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold text-slate-900">Cálculo del Deságio</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border-2 border-amber-200 shadow-sm">
            <p className="text-xs font-bold text-amber-700 mb-3 uppercase tracking-wide">Fórmula Aplicada</p>
            <div className="bg-amber-50 rounded p-3 border border-amber-200">
              <p className="text-slate-700 font-mono text-sm">
                Deságio = Tasa Mensual × Plazo en Meses
              </p>
            </div>
            <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200">
              <p className="text-slate-900 font-mono text-base font-bold text-center">
                {formatPercentage(results.rateCalculation.finalMonthlyRate)} × {formatNumber(results.termInMonths, 1)} = {formatPercentage(results.rateCalculation.desagioPercentage)}
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-blue-300 uppercase tracking-wide mb-1">Valor del Deságio</p>
                <p className="text-xs text-slate-400">Descuento aplicado a la operación</p>
              </div>
              <span className="text-3xl font-mono font-bold text-white">{formatCurrency(results.rateCalculation.desagioAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tributos */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
          </svg>
          <h3 className="text-lg font-bold text-slate-900">Cálculo de Tributos</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-slate-900 text-sm">ISS</p>
                <p className="text-xs text-slate-600">{formatPercentage(results.taxCalculations.iss.rate)}</p>
              </div>
              <span className="font-mono font-bold text-base text-red-700">{formatCurrency(results.taxCalculations.iss.amount)}</span>
            </div>
            <p className="text-xs text-slate-500 font-mono">Base: {formatCurrency(results.taxCalculations.iss.taxBase)}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-slate-900 text-sm">PIS</p>
                <p className="text-xs text-slate-600">{formatPercentage(results.taxCalculations.pis.rate)}</p>
              </div>
              <span className="font-mono font-bold text-base text-red-700">{formatCurrency(results.taxCalculations.pis.amount)}</span>
            </div>
            <p className="text-xs text-slate-500 font-mono">Base: {formatCurrency(results.taxCalculations.pis.taxBase)}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-slate-900 text-sm">COFINS</p>
                <p className="text-xs text-slate-600">{formatPercentage(results.taxCalculations.cofins.rate)}</p>
              </div>
              <span className="font-mono font-bold text-base text-red-700">{formatCurrency(results.taxCalculations.cofins.amount)}</span>
            </div>
            <p className="text-xs text-slate-500 font-mono">Base: {formatCurrency(results.taxCalculations.cofins.taxBase)}</p>
          </div>

          {results.taxCalculations.irpj && (
            <div className="bg-red-50 rounded-lg p-4 border-2 border-red-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-slate-900 text-sm">IRPJ</p>
                  <p className="text-xs text-slate-600">{formatPercentage(results.taxCalculations.irpj.rate)}</p>
                </div>
                <span className="font-mono font-bold text-base text-red-700">{formatCurrency(results.taxCalculations.irpj.amount)}</span>
              </div>
              <p className="text-xs text-slate-500 font-mono">Base: {formatCurrency(results.taxCalculations.irpj.taxBase)}</p>
            </div>
          )}

          {results.taxCalculations.csll && (
            <div className="bg-red-50 rounded-lg p-4 border-2 border-red-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-slate-900 text-sm">CSLL</p>
                  <p className="text-xs text-slate-600">{formatPercentage(results.taxCalculations.csll.rate)}</p>
                </div>
                <span className="font-mono font-bold text-base text-red-700">{formatCurrency(results.taxCalculations.csll.amount)}</span>
              </div>
              <p className="text-xs text-slate-500 font-mono">Base: {formatCurrency(results.taxCalculations.csll.taxBase)}</p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-white mb-1">Total de Tributos</p>
              <p className="text-xs text-red-100">Carga Tributaria: {formatPercentage(results.taxCalculations.effectiveTaxRate)}</p>
            </div>
            <span className="text-2xl font-mono font-bold text-white">{formatCurrency(results.taxCalculations.totalTaxAmount)}</span>
          </div>
        </div>
      </div>

      {/* Valor Neto - Destacado con colores de Brasil */}
      <div
        className="rounded-2xl text-white border-0 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #006B3D 0%, #009C4F 50%, #00A859 100%)',
          boxShadow: '0 20px 60px rgba(0, 107, 61, 0.5), 0 8px 24px rgba(0, 0, 0, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Accent stripe top - Yellow */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background: 'linear-gradient(90deg, #D4A017 0%, #FFDF00 50%, #D4A017 100%)',
            boxShadow: '0 2px 8px rgba(212, 160, 23, 0.5)'
          }}
        />

        <div className="p-8 pt-10 relative">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="rounded-xl p-2.5 relative"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              }}
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>Valor Líquido a Receber</h3>
              <p className="text-sm font-medium" style={{ color: '#F4E4A3' }}>Cálculo final da operação</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div
              className="flex justify-between items-center py-3 px-5 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <span className="text-sm font-semibold">Valor Nominal da Duplicata</span>
              <span className="font-mono font-bold text-lg">{formatCurrency(results.netCalculation.duplicataFaceValue)}</span>
            </div>
            <div
              className="flex justify-between items-center py-3 px-5 rounded-lg"
              style={{
                background: 'rgba(198, 40, 40, 0.25)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              <span className="text-sm font-semibold">(-) Deságio</span>
              <span className="font-mono font-bold text-lg" style={{ color: '#FFE0E0' }}>-{formatCurrency(results.netCalculation.totalDesagio)}</span>
            </div>
            <div
              className="flex justify-between items-center py-3 px-5 rounded-lg"
              style={{
                background: 'rgba(198, 40, 40, 0.25)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              <span className="text-sm font-semibold">(-) Tributos</span>
              <span className="font-mono font-bold text-lg" style={{ color: '#FFE0E0' }}>-{formatCurrency(results.netCalculation.totalTaxes)}</span>
            </div>
          </div>

          <div
            className="rounded-2xl p-7 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(212, 160, 23, 0.4)',
            }}
          >
            {/* Blue accent stripe */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: 'linear-gradient(90deg, #002776 0%, #003893 50%, #002776 100%)',
              }}
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#D4A017' }}>Valor a Receber</p>
                <p className="text-xs" style={{ color: '#546E7A' }}>Desconto Total: {formatPercentage(results.netCalculation.effectiveDiscount)}</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-mono font-bold" style={{ color: '#006B3D', textShadow: '0 2px 4px rgba(0, 107, 61, 0.2)' }}>
                  {formatCurrency(results.netCalculation.netAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen - Brazilian Colors */}
      <div
        className="rounded-xl p-6"
        style={{
          background: 'linear-gradient(145deg, #F8F9FA 0%, #ECEFF1 100%)',
          border: '2px solid rgba(0, 156, 79, 0.2)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        }}
      >
        <div className="flex items-center gap-2 mb-6">
          <div
            className="rounded-lg p-1.5"
            style={{
              background: 'linear-gradient(135deg, #D4A017 0%, #FFDF00 100%)',
              boxShadow: '0 3px 8px rgba(212, 160, 23, 0.4)',
            }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold" style={{ color: '#2C3E50' }}>Resumo da Operação</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Verde - Valor a Receber */}
          <div
            className="rounded-xl p-5 text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #006B3D 0%, #009C4F 100%)',
              boxShadow: '0 8px 20px rgba(0, 107, 61, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wide">Valor a Receber</p>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-3xl font-mono font-bold" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
              {formatCurrency(results.netCalculation.netAmount)}
            </p>
          </div>

          {/* Amarelo - Custo Total */}
          <div
            className="rounded-xl p-5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #D4A017 0%, #FFDF00 100%)',
              boxShadow: '0 8px 20px rgba(212, 160, 23, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              color: '#2C3E50',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wide">Custo Total</p>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-mono font-bold" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)' }}>
              {formatCurrency(results.netCalculation.totalDesagio + results.netCalculation.totalTaxes)}
            </p>
          </div>

          {/* Azul - Antecipação */}
          <div
            className="rounded-xl p-5 text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #002776 0%, #003893 100%)',
              boxShadow: '0 8px 20px rgba(0, 39, 118, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wide">Antecipação</p>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-mono font-bold" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
              {results.daysToMaturity} dias
            </p>
            <p className="text-xs mt-1 opacity-90">{formatNumber(results.termInMonths, 1)} meses</p>
          </div>
        </div>
      </div>
    </div>
  );
}
