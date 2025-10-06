import type { SimulationOutputDTO } from '../../../application/dtos/SimulationOutputDTO';

interface BackofficeOperationDetailProps {
  simulation: SimulationOutputDTO;
}

/**
 * Componente que muestra el desglose completo de una operación de factoring
 * desde el punto de vista de la financiera (backoffice)
 */
export function BackofficeOperationDetail({ simulation }: BackofficeOperationDetailProps) {
  const { rateCalculation, taxCalculations, netCalculation, faceValue, termInMonths } = simulation;

  // Cálculos para la perspectiva de la financiera
  const capitalInvestido = netCalculation.netAmount; // Lo que adelantamos al cliente
  const desagioBruto = netCalculation.totalDesagio;
  const totalImpuestos = netCalculation.totalTaxes;
  const gananciaNeta = desagioBruto - totalImpuestos;
  const roiPorcentaje = (gananciaNeta / capitalInvestido) * 100;
  const retornoMensual = roiPorcentaje / termInMonths;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Detalle de Operación</h2>
        <p className="text-blue-100">Análisis Backoffice - Vista Financiera</p>
      </div>

      {/* Información de la Duplicata */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Información de la Duplicata
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Número</p>
            <p className="font-semibold">{simulation.duplicataNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Valor Nominal</p>
            <p className="font-semibold text-lg">{formatCurrency(faceValue)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Plazo</p>
            <p className="font-semibold">{simulation.daysToMaturity} días ({termInMonths.toFixed(1)} meses)</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sacado</p>
            <p className="font-semibold text-sm">{simulation.debtorName}</p>
          </div>
        </div>
      </div>

      {/* Cálculo de Tasa */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Cálculo de Tasa Aplicada
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Taxa Base</span>
            <span className="font-mono">{formatPercent(rateCalculation.baseMonthlyRate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 pl-4">+ Ajuste Riesgo</span>
            <span className="font-mono">{formatPercent(rateCalculation.riskAdjustment)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 pl-4">+ Ajuste Modalidad</span>
            <span className="font-mono">{formatPercent(rateCalculation.modalityAdjustment)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 pl-4">- Descuento Volumen</span>
            <span className="font-mono text-green-600">-{formatPercent(rateCalculation.volumeDiscount)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span className="text-gray-800">Taxa Mensal Final</span>
            <span className="font-mono text-lg">{formatPercent(rateCalculation.finalMonthlyRate)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Taxa Anual Efectiva</span>
            <span className="font-mono">{formatPercent(rateCalculation.effectiveAnnualRate)}</span>
          </div>
        </div>
      </div>

      {/* Cálculo del Deságio */}
      <div className="bg-blue-50 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-blue-200 pb-2">
          Deságio (Ganancia Bruta)
        </h3>
        <div className="space-y-3">
          <div className="text-center bg-white rounded p-3">
            <p className="text-sm text-gray-600 mb-1">Fórmula</p>
            <p className="font-mono text-sm">
              {formatPercent(rateCalculation.finalMonthlyRate)} × {termInMonths.toFixed(1)} meses = {formatPercent(rateCalculation.desagioPercentage)}
            </p>
          </div>
          <div className="bg-white rounded p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-semibold">Deságio Bruto</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(rateCalculation.desagioAmount)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatPercent(rateCalculation.desagioPercentage)} sobre el valor de face
            </p>
          </div>
        </div>
      </div>

      {/* Impuestos Detallados */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Impuestos (sobre el Deságio)
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">ISS</p>
              <p className="text-xs text-gray-500">
                {formatPercent(taxCalculations.iss.rate)} sobre deságio
              </p>
            </div>
            <span className="font-mono text-red-600">{formatCurrency(taxCalculations.iss.amount)}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">PIS</p>
              <p className="text-xs text-gray-500">
                {formatPercent(taxCalculations.pis.rate)} sobre deságio
              </p>
            </div>
            <span className="font-mono text-red-600">{formatCurrency(taxCalculations.pis.amount)}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">COFINS</p>
              <p className="text-xs text-gray-500">
                {formatPercent(taxCalculations.cofins.rate)} sobre deságio
              </p>
            </div>
            <span className="font-mono text-red-600">{formatCurrency(taxCalculations.cofins.amount)}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">IRPJ</p>
              <p className="text-xs text-gray-500">
                {formatPercent(taxCalculations.irpj.rate)} sobre lucro presumido (32%)
              </p>
            </div>
            <span className="font-mono text-red-600">{formatCurrency(taxCalculations.irpj.amount)}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">CSLL</p>
              <p className="text-xs text-gray-500">
                {formatPercent(taxCalculations.csll.rate)} sobre lucro presumido (32%)
              </p>
            </div>
            <span className="font-mono text-red-600">{formatCurrency(taxCalculations.csll.amount)}</span>
          </div>

          {taxCalculations.iof.amount > 0 && (
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">IOF</p>
                <p className="text-xs text-gray-500">
                  Fixo: {formatPercent(taxCalculations.iof.fixedRate)} + Diário: {formatPercent(taxCalculations.iof.dailyRate)}
                </p>
              </div>
              <span className="font-mono text-red-600">{formatCurrency(taxCalculations.iof.amount)}</span>
            </div>
          )}

          <div className="flex justify-between items-center py-3 bg-red-50 rounded px-3 font-semibold">
            <span className="text-gray-800">Total Impuestos</span>
            <span className="font-mono text-lg text-red-700">
              {formatCurrency(taxCalculations.totalTaxAmount)}
            </span>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Carga tributaria efectiva: {formatPercent(taxCalculations.effectiveTaxRate)} del deságio
          </p>
        </div>
      </div>

      {/* Resultado Final */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6">Resultado Financiero</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-green-100">Capital Adelantado al Cliente</span>
            <span className="font-mono text-xl">{formatCurrency(capitalInvestido)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-green-100">Deságio Bruto</span>
            <span className="font-mono text-xl">{formatCurrency(desagioBruto)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-green-100">(-) Impuestos</span>
            <span className="font-mono text-xl">-{formatCurrency(totalImpuestos)}</span>
          </div>

          <div className="border-t-2 border-green-400 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">GANANCIA NETA</span>
              <span className="font-mono text-3xl font-bold">
                {formatCurrency(gananciaNeta)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-green-400">
            <div className="bg-green-800 bg-opacity-50 rounded p-3">
              <p className="text-xs text-green-100 mb-1">Retorno Neto Mensual</p>
              <p className="text-2xl font-bold">{formatPercent(retornoMensual)}</p>
            </div>
            <div className="bg-green-800 bg-opacity-50 rounded p-3">
              <p className="text-xs text-green-100 mb-1">ROI Total ({simulation.daysToMaturity} días)</p>
              <p className="text-2xl font-bold">{formatPercent(roiPorcentaje)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose para Cliente (información) */}
      <div className="bg-gray-50 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Valor para el Cliente (Cedente)
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Valor Nominal Duplicata</span>
            <span className="font-mono">{formatCurrency(faceValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">(-) Deságio</span>
            <span className="font-mono text-red-600">-{formatCurrency(desagioBruto)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">(-) Impuestos</span>
            <span className="font-mono text-red-600">-{formatCurrency(totalImpuestos)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold text-lg">
            <span className="text-gray-800">Valor Líquido a Recibir</span>
            <span className="font-mono text-blue-600">{formatCurrency(capitalInvestido)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Descuento efectivo total: {formatPercent(netCalculation.effectiveDiscount)}
          </p>
        </div>
      </div>
    </div>
  );
}
