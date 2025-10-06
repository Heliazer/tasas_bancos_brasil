import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../../context/SimulationContext';
import { formatCurrency } from '../../utils/formatters';

/**
 * Informe Formal - Página con estilo contable/oficial
 * Muestra todos los detalles de la simulación en formato profesional
 */
export function FormalReport() {
  const { simulationData } = useSimulation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!simulationData) {
      // Si no hay datos, redirigir a landing
      navigate('/');
    } else {
      // Scroll to top when component loads
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [simulationData, navigate]);

  if (!simulationData) {
    return null;
  }

  const {
    amount,
    months,
    autoReinvest,
    finalAmount,
    totalGain,
    roiPercentage,
    monthlyAverage,
    effectiveRate,
    fullOutput
  } = simulationData;

  // Cálculos adicionales para el informe
  // IMPORTANTE: 'months' en el contexto contiene DÍAS, no meses
  const daysToMaturity = months; // Renombrar para claridad
  const monthsCount = daysToMaturity / 30;
  const years = daysToMaturity / 365;
  const monthlyRate = effectiveRate * 100;
  const annualRate = ((Math.pow(1 + effectiveRate, 12) - 1) * 100);

  // Simular desglose de impuestos (basado en tasa promedio)
  const grossGain = totalGain / 0.8586; // Asumiendo ~14.14% de impuestos
  const taxes = grossGain - totalGain;
  const issAmount = grossGain * 0.03;
  const pisAmount = grossGain * 0.0065;
  const cofinsAmount = grossGain * 0.03;
  const irpjAmount = grossGain * 0.32 * 0.15;
  const csllAmount = grossGain * 0.32 * 0.09;

  const printReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl print:shadow-none">
        {/* Header Oficial */}
        <header className="border-4 border-double border-slate-800 p-8 bg-white">
          <div className="text-center">
            <div className="mb-4">
              <div className="text-xs text-slate-600 uppercase tracking-widest mb-2">
                República Federativa del Brasil
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight border-b-2 border-slate-300 pb-2 inline-block">
                SIMULACIÓN DE OPERACIÓN DE FACTORING
              </h1>
            </div>

            <div className="mt-6 text-xs text-slate-700 leading-relaxed max-w-4xl mx-auto">
              <p className="mb-2">
                Simulación de operación de fomento mercantil conforme a la legislación tributaria brasileña vigente:
              </p>
              <p className="font-mono text-[10px]">
                Lei Complementar 116/2003 (ISS) • Lei nº 9.715/1998 e 9.718/1998 (PIS/COFINS) •
                Lei nº 9.430/96 (IRPJ/CSLL) • IN RFB 1.543/2015 (IOF)
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-300">
              <p className="text-xs text-slate-600">
                Fecha de emisión: {new Date().toLocaleDateString('es-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Documento N°: SIM-{new Date().getFullYear()}-{Math.floor(Math.random() * 100000).toString().padStart(5, '0')}
              </p>
            </div>
          </div>
        </header>

        {/* Botones de acción (no se imprimen) */}
        <div className="print:hidden bg-slate-100 p-4 flex justify-between items-center border-b border-slate-300">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-slate-600 text-white hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            ← Volver al Calculador
          </button>
          <button
            onClick={printReport}
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            🖨️ Imprimir Informe
          </button>
        </div>

        {/* Cuerpo del Informe */}
        <div className="p-8 space-y-8">
          {/* I. DATOS DE LA OPERACIÓN */}
          <section className="border border-slate-300 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-400 uppercase tracking-wide">
              I. Datos de la Operación
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-b border-slate-200 pb-2">
                <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Monto de Inversión</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(amount)}</p>
              </div>
              <div className="border-b border-slate-200 pb-2">
                <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Plazo</p>
                <p className="text-xl font-bold text-slate-900">
                  {daysToMaturity} días ({monthsCount.toFixed(1)} {monthsCount === 1 ? 'mes' : 'meses'})
                </p>
              </div>
              <div className="border-b border-slate-200 pb-2">
                <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Modalidad</p>
                <p className="text-base font-semibold text-slate-800">
                  {autoReinvest ? 'Con Reinversión Automática' : 'Sin Reinversión'}
                </p>
              </div>
              <div className="border-b border-slate-200 pb-2">
                <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Tipo de Operación</p>
                <p className="text-base font-semibold text-slate-800">Fomento Mercantil</p>
              </div>
            </div>
          </section>

          {/* II. TASAS APLICADAS */}
          <section className="border border-slate-300 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-400 uppercase tracking-wide">
              II. Tasas Aplicadas
            </h2>
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr className="border-b border-slate-300">
                  <th className="text-left py-2 px-3 font-bold text-slate-700 uppercase text-xs tracking-wide">Concepto</th>
                  <th className="text-right py-2 px-3 font-bold text-slate-700 uppercase text-xs tracking-wide">Tasa</th>
                  <th className="text-left py-2 px-3 font-bold text-slate-700 uppercase text-xs tracking-wide">Base Legal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-3 px-3 font-semibold">Tasa Mensual Efectiva</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-green-700">{monthlyRate.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-xs text-slate-600">Mercado factoring 2025</td>
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <td className="py-3 px-3 font-semibold">Tasa Anual Equivalente</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-green-700">{annualRate.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-xs text-slate-600">Capitalización compuesta</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* III. PROYECCIÓN FINANCIERA */}
          <section className="border border-slate-300 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-400 uppercase tracking-wide">
              III. Proyección Financiera
            </h2>
            <div className="bg-slate-50 border border-slate-200 p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-300 pb-3">
                <span className="text-sm text-slate-700 font-semibold">Capital Inicial</span>
                <span className="text-xl font-mono font-bold">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-300 pb-3">
                <span className="text-sm text-slate-700 font-semibold">Ganancia Bruta Proyectada</span>
                <span className="text-xl font-mono font-bold text-blue-600">+ {formatCurrency(grossGain)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-300 pb-3">
                <span className="text-sm text-slate-700 font-semibold">(-) Tributos Aplicables</span>
                <span className="text-xl font-mono font-bold text-red-600">- {formatCurrency(taxes)}</span>
              </div>
              <div className="flex justify-between items-center bg-green-100 border-2 border-green-600 p-4 mt-4">
                <span className="text-base text-slate-900 font-bold uppercase">Capital Final Neto</span>
                <span className="text-3xl font-mono font-bold text-green-700">{formatCurrency(finalAmount)}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="border border-slate-300 p-4 text-center">
                <p className="text-xs text-slate-600 uppercase tracking-wide mb-2">Ganancia Neta Total</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalGain)}</p>
              </div>
              <div className="border border-slate-300 p-4 text-center">
                <p className="text-xs text-slate-600 uppercase tracking-wide mb-2">ROI</p>
                <p className="text-2xl font-bold text-blue-600">+{roiPercentage.toFixed(1)}%</p>
              </div>
              <div className="border border-slate-300 p-4 text-center">
                <p className="text-xs text-slate-600 uppercase tracking-wide mb-2">Promedio Mensual</p>
                <p className="text-2xl font-bold text-slate-700">{formatCurrency(monthlyAverage)}</p>
              </div>
            </div>
          </section>

          {/* IV. DESGLOSE TRIBUTARIO */}
          <section className="border border-slate-300 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-400 uppercase tracking-wide">
              IV. Desglose Tributario
            </h2>
            <p className="text-xs text-slate-600 mb-4 italic">
              * Valores estimados sobre ganancia bruta. Régimen: Lucro Presumido
            </p>
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr className="border-b-2 border-slate-400">
                  <th className="text-left py-2 px-3 font-bold text-slate-700 uppercase text-xs">Tributo</th>
                  <th className="text-center py-2 px-3 font-bold text-slate-700 uppercase text-xs">Alícuota</th>
                  <th className="text-right py-2 px-3 font-bold text-slate-700 uppercase text-xs">Valor Estimado</th>
                  <th className="text-left py-2 px-3 font-bold text-slate-700 uppercase text-xs">Base Legal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-3 px-3 font-semibold">ISS</td>
                  <td className="py-3 px-3 text-center font-mono">3,00%</td>
                  <td className="py-3 px-3 text-right font-mono text-red-600">{formatCurrency(issAmount)}</td>
                  <td className="py-3 px-3 text-xs">LC 116/2003</td>
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <td className="py-3 px-3 font-semibold">PIS</td>
                  <td className="py-3 px-3 text-center font-mono">0,65%</td>
                  <td className="py-3 px-3 text-right font-mono text-red-600">{formatCurrency(pisAmount)}</td>
                  <td className="py-3 px-3 text-xs">Lei 9.715/98</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-3 px-3 font-semibold">COFINS</td>
                  <td className="py-3 px-3 text-center font-mono">3,00%</td>
                  <td className="py-3 px-3 text-right font-mono text-red-600">{formatCurrency(cofinsAmount)}</td>
                  <td className="py-3 px-3 text-xs">Lei 9.718/98</td>
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <td className="py-3 px-3 font-semibold">IRPJ</td>
                  <td className="py-3 px-3 text-center font-mono">15%*</td>
                  <td className="py-3 px-3 text-right font-mono text-red-600">{formatCurrency(irpjAmount)}</td>
                  <td className="py-3 px-3 text-xs">Lei 9.430/96</td>
                </tr>
                <tr className="border-b-2 border-slate-300">
                  <td className="py-3 px-3 font-semibold">CSLL</td>
                  <td className="py-3 px-3 text-center font-mono">9%*</td>
                  <td className="py-3 px-3 text-right font-mono text-red-600">{formatCurrency(csllAmount)}</td>
                  <td className="py-3 px-3 text-xs">Lei 7.689/88</td>
                </tr>
                <tr className="bg-red-50 border-b-2 border-red-600">
                  <td className="py-3 px-3 font-bold uppercase">Total Tributos</td>
                  <td className="py-3 px-3 text-center font-mono font-bold">{((taxes / grossGain) * 100).toFixed(2)}%</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-red-700 text-lg">{formatCurrency(taxes)}</td>
                  <td className="py-3 px-3 text-xs"></td>
                </tr>
              </tbody>
            </table>
            <p className="text-[10px] text-slate-500 mt-3">
              * IRPJ y CSLL calculados sobre 32% de la ganancia bruta (lucro presumido). Valores referenciales.
            </p>
          </section>

          {/* V. OBSERVACIONES */}
          <section className="border border-slate-300 p-6 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-400 uppercase tracking-wide">
              V. Observaciones Legales y Advertencias
            </h2>
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>1. Naturaleza del Documento:</strong> Este informe constituye una simulación matemática basada en proyecciones
                y no representa una oferta vinculante ni garantía de rentabilidad. Los valores son estimativos y pueden variar según
                condiciones de mercado.
              </p>
              <p>
                <strong>2. Tributación:</strong> Los valores tributarios presentados son estimativos considerando régimen de Lucro Presumido
                conforme legislación vigente. La carga tributaria efectiva puede variar según la situación fiscal específica del contribuyente.
              </p>
              <p>
                <strong>3. Riesgos:</strong> Toda operación de factoring implica riesgos inherentes de crédito. El desempeño pasado no
                garantiza resultados futuros. Se recomienda análisis detallado de cada operación.
              </p>
              <p>
                <strong>4. Marco Regulatorio:</strong> Operación de fomento mercantil regulada por Lei nº 9.430/96 y normas complementares.
                No constituye intermediación financiera conforme Resolución CMN 2.144/95.
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t-2 border-slate-300 text-center">
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wide mb-2">
              Documento Simulado - Sin Validez Legal
            </p>
            <p className="text-[10px] text-slate-500">
              Los cálculos son referenciales y pueden variar según condiciones específicas del mercado y la institución financiera.
              Para información oficial consulte con asesor financiero certificado.
            </p>
            <p className="text-[10px] text-slate-400 mt-4">
              Generado en: {new Date().toLocaleString('es-BR')}
            </p>
          </footer>
        </div>
      </div>

      {/* Margen para impresión */}
      <div className="hidden print:block h-16"></div>
    </div>
  );
}
