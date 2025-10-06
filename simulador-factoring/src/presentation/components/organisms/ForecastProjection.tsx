import { useState } from 'react';

interface ForecastProjectionProps {
  initialCapital: number;
  monthlyRate: number; // Tasa neta mensual después de impuestos
  effectiveTaxRate: number; // Carga tributaria efectiva
}

interface MonthlyProjection {
  month: number;
  capital: number;
  operations: number;
  gananceBruta: number;
  impuestos: number;
  gananciaNeta: number;
  capitalAcumulado: number;
}

/**
 * Componente que proyecta el crecimiento de capital a 24 meses
 * con opción de reinversión automática
 */
export function ForecastProjection({
  initialCapital,
  monthlyRate,
  effectiveTaxRate
}: ForecastProjectionProps) {
  const [reinvestment, setReinvestment] = useState(true);
  const [monthsToShow, setMonthsToShow] = useState(12);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Generar proyección mes a mes
  const generateProjection = (): MonthlyProjection[] => {
    const projection: MonthlyProjection[] = [];
    let currentCapital = initialCapital;

    for (let month = 1; month <= 24; month++) {
      // Asumimos 2 operaciones por mes (cada operación de 60 días = 2 meses)
      const operations = 2;

      // Ganancia bruta = capital × tasa mensual × operaciones
      const gananceBruta = currentCapital * (monthlyRate / 100) * operations;

      // Impuestos = ganancia bruta × tasa efectiva de impuestos
      const impuestos = gananceBruta * (effectiveTaxRate / 100);

      // Ganancia neta = ganancia bruta - impuestos
      const gananciaNet = gananceBruta - impuestos;

      // Si hay reinversión, el capital crece; si no, se mantiene
      const newCapital = reinvestment ? currentCapital + gananciaNet : currentCapital;

      projection.push({
        month,
        capital: currentCapital,
        operations,
        gananceBruta,
        impuestos,
        gananciaNeta: gananciaNet,
        capitalAcumulado: newCapital
      });

      currentCapital = newCapital;
    }

    return projection;
  };

  const projection = generateProjection();
  const displayProjection = projection.slice(0, monthsToShow);

  // Cálculos de resumen
  const finalCapital = projection[projection.length - 1].capitalAcumulado;
  const totalGananciaBruta = projection.reduce((sum, p) => sum + p.gananceBruta, 0);
  const totalImpuestos = projection.reduce((sum, p) => sum + p.impuestos, 0);
  const totalGananciaNeta = projection.reduce((sum, p) => sum + p.gananciaNeta, 0);
  const roiAnualPromedio = ((finalCapital - initialCapital) / initialCapital) * (12 / 24) * 100;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header con controles */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Proyección a 24 Meses</h2>

        <div className="flex gap-6 items-center">
          {/* Toggle Reinversión */}
          <div className="flex items-center gap-3">
            <label className="font-medium">Reinversión Automática:</label>
            <button
              onClick={() => setReinvestment(!reinvestment)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                reinvestment ? 'bg-green-400' : 'bg-gray-400'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  reinvestment ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="font-semibold">{reinvestment ? 'SÍ' : 'NO'}</span>
          </div>

          {/* Selector de meses a mostrar */}
          <div className="flex items-center gap-3 ml-auto">
            <label className="font-medium">Mostrar:</label>
            <select
              value={monthsToShow}
              onChange={(e) => setMonthsToShow(Number(e.target.value))}
              className="bg-white text-purple-800 px-3 py-1 rounded font-medium"
            >
              <option value={6}>6 meses</option>
              <option value={12}>12 meses</option>
              <option value={24}>24 meses</option>
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-purple-200">Capital Inicial</p>
            <p className="text-xl font-bold">{formatCurrency(initialCapital)}</p>
          </div>
          <div>
            <p className="text-purple-200">Tasa Neta Mensual</p>
            <p className="text-xl font-bold">{formatPercent(monthlyRate)}</p>
          </div>
          <div>
            <p className="text-purple-200">Carga Tributaria</p>
            <p className="text-xl font-bold">{formatPercent(effectiveTaxRate)}</p>
          </div>
        </div>
      </div>

      {/* Tabla de proyección */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mes
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capital
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ops
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ganancia Bruta
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impuestos
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ganancia Neta
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capital Acum.
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayProjection.map((p) => (
                <tr
                  key={p.month}
                  className={`hover:bg-gray-50 ${
                    p.month % 12 === 0 ? 'bg-purple-50 font-semibold' : ''
                  }`}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {p.month}
                    {p.month % 12 === 0 && (
                      <span className="ml-2 text-xs text-purple-600">
                        (Año {p.month / 12})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono">
                    {formatCurrency(p.capital)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-600">
                    {p.operations}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono text-blue-600">
                    {formatCurrency(p.gananceBruta)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono text-red-600">
                    {formatCurrency(p.impuestos)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono text-green-600 font-semibold">
                    {formatCurrency(p.gananciaNeta)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono font-semibold">
                    {formatCurrency(p.capitalAcumulado)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen del Forecast */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6">Resumen Proyección 24 Meses</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-green-100 text-sm mb-1">Capital Inicial</p>
            <p className="text-2xl font-bold">{formatCurrency(initialCapital)}</p>
          </div>

          <div>
            <p className="text-green-100 text-sm mb-1">Capital Final (24 meses)</p>
            <p className="text-2xl font-bold">{formatCurrency(finalCapital)}</p>
          </div>

          <div>
            <p className="text-green-100 text-sm mb-1">Crecimiento Total</p>
            <p className="text-2xl font-bold">
              {formatCurrency(finalCapital - initialCapital)}
            </p>
          </div>

          <div>
            <p className="text-green-100 text-sm mb-1">Ganancia Bruta Acumulada</p>
            <p className="text-2xl font-bold">{formatCurrency(totalGananciaBruta)}</p>
          </div>

          <div>
            <p className="text-green-100 text-sm mb-1">Impuestos Pagados</p>
            <p className="text-2xl font-bold">{formatCurrency(totalImpuestos)}</p>
          </div>

          <div>
            <p className="text-green-100 text-sm mb-1">Ganancia Neta Acumulada</p>
            <p className="text-2xl font-bold">{formatCurrency(totalGananciaNeta)}</p>
          </div>

          <div className="col-span-2 md:col-span-3 border-t-2 border-green-400 pt-4 mt-2">
            <p className="text-green-100 text-sm mb-1">ROI Anual Promedio</p>
            <p className="text-4xl font-bold">{formatPercent(roiAnualPromedio)}</p>
          </div>
        </div>

        {!reinvestment && (
          <div className="mt-6 bg-green-800 bg-opacity-50 rounded p-4">
            <p className="text-sm">
              <strong>Nota:</strong> Sin reinversión, el capital se mantiene constante en {formatCurrency(initialCapital)}.
              La ganancia neta mensual promedio es de {formatCurrency(totalGananciaNeta / 24)}.
            </p>
          </div>
        )}

        {reinvestment && (
          <div className="mt-6 bg-green-800 bg-opacity-50 rounded p-4">
            <p className="text-sm">
              <strong>Con reinversión automática:</strong> El capital crece mes a mes, generando un efecto compuesto.
              Múltiplo del capital inicial: <strong>{(finalCapital / initialCapital).toFixed(2)}x</strong>
            </p>
          </div>
        )}
      </div>

      {/* Gráfico simple de progresión (ASCII art o barras simples) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Evolución del Capital
        </h3>
        <div className="space-y-2">
          {displayProjection.filter(p => p.month % 3 === 0).map((p) => {
            const width = (p.capitalAcumulado / finalCapital) * 100;
            return (
              <div key={p.month} className="flex items-center gap-3">
                <span className="text-xs font-mono w-12 text-gray-600">Mes {p.month}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-700 h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${width}%` }}
                  >
                    <span className="text-xs font-semibold text-white">
                      {formatCurrency(p.capitalAcumulado)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
