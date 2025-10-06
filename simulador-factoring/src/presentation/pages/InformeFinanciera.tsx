import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../../context/SimulationContext';
import { formatCurrency } from '../../utils/formatters';

/**
 * Informe Contable desde el punto de vista de la Financiera
 * Muestra la operatoria completa: inversión recibida, adelanto al cedente,
 * deságio, impuestos y ganancia neta
 */
export function InformeFinanciera() {
  const { simulationData } = useSimulation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!simulationData) {
      navigate('/');
    }
  }, [simulationData, navigate]);

  if (!simulationData) {
    return null;
  }

  const { amount, months, finalAmount, totalGain, effectiveRate } = simulationData;

  // CÁLCULOS DESDE PERSPECTIVA DE LA FINANCIERA

  // 1. El cliente invierte/entrega este monto (valor nominal de la factura)
  const valorNominalFactura = amount;

  // 2. Deságio (nuestra comisión bruta)
  const tasaMensual = effectiveRate;
  const plazoMeses = months / 30; // convertir días a meses aproximadamente
  const tasaDesagio = tasaMensual * (months / 30);
  const desagioBruto = valorNominalFactura * tasaDesagio;

  // 3. Impuestos sobre el deságio
  const issRate = 0.03;
  const pisRate = 0.0065;
  const cofinsRate = 0.03;
  const irpjRate = 0.32 * 0.15; // 15% sobre 32% lucro presumido
  const csllRate = 0.32 * 0.09; // 9% sobre 32% lucro presumido

  const issAmount = desagioBruto * issRate;
  const pisAmount = desagioBruto * pisRate;
  const cofinsAmount = desagioBruto * cofinsRate;
  const irpjAmount = desagioBruto * irpjRate;
  const csllAmount = desagioBruto * csllRate;
  const totalImpuestos = issAmount + pisAmount + cofinsAmount + irpjAmount + csllAmount;

  // 4. Capital que adelantamos al cedente (empresa con la factura)
  const capitalAdelantado = valorNominalFactura - desagioBruto;

  // 5. Ganancia neta de la financiera
  const gananciaNeta = desagioBruto - totalImpuestos;

  // 6. Al vencimiento cobramos la factura
  const montoRecuperadoAlVencimiento = valorNominalFactura;

  // 7. ROI de la financiera
  const roiFinanciera = (gananciaNeta / capitalAdelantado) * 100;

  // 8. Flujo de caja
  const salidaInicial = capitalAdelantado;
  const entradaVencimiento = montoRecuperadoAlVencimiento;
  const resultadoNeto = entradaVencimiento - salidaInicial - totalImpuestos;

  const printReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 print:p-0">
      <div className="max-w-5xl mx-auto bg-white print:shadow-none">
        {/* Header Oficial */}
        <header className="border-t-4 border-b-4 border-black p-6 bg-white">
          <div className="text-center">
            <div className="mb-4">
              <div className="text-[10px] text-gray-700 uppercase tracking-widest mb-2">
                Documento Interno - Uso Exclusivo Financiera
              </div>
              <h1 className="text-2xl font-bold text-black tracking-tight uppercase">
                Informe Contable de Operación de Factoring
              </h1>
              <p className="text-xs text-gray-600 mt-2">
                Análisis desde la Perspectiva de la Financiera
              </p>
            </div>

            <div className="mt-6 border-t border-b border-gray-400 py-4">
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="text-left text-gray-600 py-1">Fecha Operación:</td>
                    <td className="text-right font-mono py-1">{new Date().toLocaleDateString('es-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}</td>
                    <td className="text-left text-gray-600 py-1 pl-8">N° Operación:</td>
                    <td className="text-right font-mono py-1">
                      FIN-{new Date().getFullYear()}-{Math.floor(Math.random() * 100000).toString().padStart(5, '0')}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left text-gray-600 py-1">Modalidad:</td>
                    <td className="text-right font-mono py-1">Sin Regreso</td>
                    <td className="text-left text-gray-600 py-1 pl-8">Plazo:</td>
                    <td className="text-right font-mono py-1">{months} días</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </header>

        {/* Botones de acción */}
        <div className="print:hidden bg-gray-100 p-3 flex justify-between items-center border-b border-gray-300">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-800 text-white hover:bg-black transition-colors text-xs font-medium uppercase tracking-wide"
          >
            ← Volver
          </button>
          <button
            onClick={printReport}
            className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-xs font-medium uppercase tracking-wide"
          >
            Imprimir
          </button>
        </div>

        {/* Cuerpo del Informe */}
        <div className="p-8 space-y-8">
          {/* RESUMEN EJECUTIVO */}
          <section className="border-t-2 border-b-2 border-black py-4">
            <h2 className="text-sm font-bold text-black mb-4 uppercase tracking-widest">
              Resumen Ejecutivo
            </h2>
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="py-2 text-gray-700">Valor Nominal Factura:</td>
                  <td className="py-2 text-right font-mono font-bold">{formatCurrency(valorNominalFactura)}</td>
                  <td className="py-2 text-right text-xs text-gray-500 pl-4">Monto a recuperar</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="py-2 text-gray-700">Capital Adelantado al Cedente:</td>
                  <td className="py-2 text-right font-mono font-bold">{formatCurrency(capitalAdelantado)}</td>
                  <td className="py-2 text-right text-xs text-gray-500 pl-4">Salida inicial</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="py-2 text-gray-700">Deságio (Comisión Bruta):</td>
                  <td className="py-2 text-right font-mono font-bold">{formatCurrency(desagioBruto)}</td>
                  <td className="py-2 text-right text-xs text-gray-500 pl-4">{((desagioBruto / valorNominalFactura) * 100).toFixed(2)}%</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="py-2 text-gray-700">Total Impuestos:</td>
                  <td className="py-2 text-right font-mono font-bold">{formatCurrency(totalImpuestos)}</td>
                  <td className="py-2 text-right text-xs text-gray-500 pl-4">{((totalImpuestos / desagioBruto) * 100).toFixed(2)}%</td>
                </tr>
                <tr className="border-t-2 border-black bg-gray-100">
                  <td className="py-3 font-bold text-black">GANANCIA NETA:</td>
                  <td className="py-3 text-right font-mono font-bold text-lg">{formatCurrency(gananciaNeta)}</td>
                  <td className="py-3 text-right text-xs text-gray-600 pl-4">ROI: +{roiFinanciera.toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* I. MOVIMIENTO DE FONDOS */}
          <section className="border-t border-b border-black py-6">
            <h2 className="text-sm font-bold text-black mb-4 uppercase tracking-widest">
              I. Movimiento de Fondos - Operatoria Completa
            </h2>

            <div className="space-y-6">
              {/* Fase 1: Adelanto */}
              <div className="border border-gray-400 p-4">
                <h3 className="font-bold text-black mb-3 text-xs uppercase tracking-wide border-b border-gray-300 pb-2">
                  Fase 1: Adelanto al Cedente
                </h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">Valor Nominal Factura (Duplicata)</td>
                      <td className="py-2 text-right font-mono">{formatCurrency(valorNominalFactura)}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700">(-) Deságio Aplicado ({(tasaDesagio * 100).toFixed(2)}%)</td>
                      <td className="py-2 text-right font-mono">({formatCurrency(desagioBruto)})</td>
                    </tr>
                    <tr className="border-t-2 border-black bg-gray-100">
                      <td className="py-3 font-bold text-black">SALIDA DE CAJA (adelanto al cedente)</td>
                      <td className="py-3 text-right font-mono font-bold">{formatCurrency(capitalAdelantado)}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-[10px] text-gray-600 mt-2 italic">
                  La financiera adelanta este monto al cedente descontando el deságio.
                </p>
              </div>

              {/* Fase 2: Al Vencimiento */}
              <div className="border border-gray-400 p-4">
                <h3 className="font-bold text-black mb-3 text-xs uppercase tracking-wide border-b border-gray-300 pb-2">
                  Fase 2: Cobro al Vencimiento ({months} días)
                </h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-t-2 border-black bg-gray-100">
                      <td className="py-3 font-bold text-black">ENTRADA DE CAJA (cobro factura)</td>
                      <td className="py-3 text-right font-mono font-bold">{formatCurrency(montoRecuperadoAlVencimiento)}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-[10px] text-gray-600 mt-2 italic">
                  Al vencimiento, se cobra el valor total de la factura al sacado (empresa deudora).
                </p>
              </div>

              {/* Resultado Neto */}
              <div className="border-2 border-black p-4">
                <h3 className="font-bold text-black mb-3 text-xs uppercase tracking-wide">Flujo de Caja Neto</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 text-gray-700">Entrada al vencimiento</td>
                      <td className="py-2 text-right font-mono">+{formatCurrency(entradaVencimiento)}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 text-gray-700">(-) Salida inicial (adelanto)</td>
                      <td className="py-2 text-right font-mono">({formatCurrency(salidaInicial)})</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 text-gray-700">(-) Impuestos a pagar</td>
                      <td className="py-2 text-right font-mono">({formatCurrency(totalImpuestos)})</td>
                    </tr>
                    <tr className="border-t-2 border-black bg-gray-200">
                      <td className="py-3 font-bold text-black uppercase">Resultado Neto</td>
                      <td className="py-3 text-right font-mono font-bold text-lg">{formatCurrency(resultadoNeto)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* II. DESÁGIO (COMISIÓN) */}
          <section className="border-t border-b border-black py-6">
            <h2 className="text-sm font-bold text-black mb-4 uppercase tracking-widest">
              II. Deságio - Comisión Bruta de la Financiera
            </h2>

            <div className="border border-gray-400 p-4 mb-4">
              <p className="text-xs text-gray-700 mb-2 font-bold uppercase">Fórmula aplicada:</p>
              <p className="font-mono text-xs bg-gray-50 p-2 border border-gray-300">
                Deságio = Valor Factura × Tasa Mensual × (Plazo Días / 30)
              </p>
              <p className="font-mono text-xs bg-gray-50 p-2 border border-gray-300 mt-2">
                Deságio = {formatCurrency(valorNominalFactura)} × {(tasaMensual * 100).toFixed(2)}% × {(months / 30).toFixed(2)}
              </p>
            </div>

            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="py-2 text-gray-700">Tasa Mensual Aplicada:</td>
                  <td className="py-2 text-right font-mono font-bold">{(tasaMensual * 100).toFixed(2)}%</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="py-2 text-gray-700">Plazo Operación:</td>
                  <td className="py-2 text-right font-mono font-bold">{months} días ({(months / 30).toFixed(2)} meses)</td>
                </tr>
                <tr className="border-t-2 border-black bg-gray-100">
                  <td className="py-3 font-bold text-black">DESÁGIO BRUTO (Comisión):</td>
                  <td className="py-3 text-right font-mono font-bold text-lg">{formatCurrency(desagioBruto)}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="py-1 text-right text-xs text-gray-600">
                    Representa {((desagioBruto / valorNominalFactura) * 100).toFixed(2)}% del valor nominal
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* III. IMPUESTOS A PAGAR */}
          <section className="border-t border-b border-black py-6">
            <h2 className="text-sm font-bold text-black mb-4 uppercase tracking-widest">
              III. Impuestos a Pagar sobre Deságio
            </h2>

            <p className="text-[10px] text-gray-600 mb-4 border-l-2 border-gray-400 pl-3 italic">
              Nota: Todos los impuestos se calculan sobre el deságio (comisión bruta) de {formatCurrency(desagioBruto)}
            </p>

            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-t-2 border-b-2 border-black">
                  <th className="text-left py-2 uppercase font-bold">Tributo</th>
                  <th className="text-center py-2 uppercase font-bold">Base Cálculo</th>
                  <th className="text-center py-2 uppercase font-bold">Alícuota</th>
                  <th className="text-right py-2 uppercase font-bold">Valor a Pagar</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="py-2">ISS (Municipal)</td>
                  <td className="py-2 text-center font-mono text-[10px]">{formatCurrency(desagioBruto)}</td>
                  <td className="py-2 text-center font-mono">{(issRate * 100).toFixed(2)}%</td>
                  <td className="py-2 text-right font-mono">{formatCurrency(issAmount)}</td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="py-2">PIS (Federal)</td>
                  <td className="py-2 text-center font-mono text-[10px]">{formatCurrency(desagioBruto)}</td>
                  <td className="py-2 text-center font-mono">{(pisRate * 100).toFixed(2)}%</td>
                  <td className="py-2 text-right font-mono">{formatCurrency(pisAmount)}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="py-2">COFINS (Federal)</td>
                  <td className="py-2 text-center font-mono text-[10px]">{formatCurrency(desagioBruto)}</td>
                  <td className="py-2 text-center font-mono">{(cofinsRate * 100).toFixed(2)}%</td>
                  <td className="py-2 text-right font-mono">{formatCurrency(cofinsAmount)}</td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="py-2">IRPJ</td>
                  <td className="py-2 text-center font-mono text-[10px]">{formatCurrency(desagioBruto * 0.32)}</td>
                  <td className="py-2 text-center font-mono">15%*</td>
                  <td className="py-2 text-right font-mono">{formatCurrency(irpjAmount)}</td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="py-2">CSLL</td>
                  <td className="py-2 text-center font-mono text-[10px]">{formatCurrency(desagioBruto * 0.32)}</td>
                  <td className="py-2 text-center font-mono">9%*</td>
                  <td className="py-2 text-right font-mono">{formatCurrency(csllAmount)}</td>
                </tr>
                <tr className="bg-gray-200 border-b-4 border-black">
                  <td className="py-3 font-bold uppercase" colSpan={3}>Total Impuestos a Pagar</td>
                  <td className="py-3 text-right font-mono font-bold text-base">
                    {formatCurrency(totalImpuestos)}
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-[10px] text-gray-600 mt-3 italic">
              * IRPJ y CSLL calculados sobre lucro presumido (32% del deságio) según Lei 9.430/96
            </p>

            <div className="mt-4 border-t border-gray-400 pt-3">
              <p className="text-xs text-gray-700">Carga Tributaria Efectiva:</p>
              <p className="text-sm font-bold text-black">
                {((totalImpuestos / desagioBruto) * 100).toFixed(2)}% del deságio
              </p>
            </div>
          </section>

          {/* IV. RESULTADO FINAL */}
          <section className="border-t-4 border-b-4 border-black py-6">
            <h2 className="text-sm font-bold text-black mb-6 uppercase tracking-widest text-center">
              IV. Resultado Final de la Operación
            </h2>

            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="py-2 text-gray-700">Deságio Bruto (Comisión):</td>
                  <td className="py-2 text-right font-mono font-bold">+{formatCurrency(desagioBruto)}</td>
                </tr>
                <tr className="border-b-2 border-gray-400">
                  <td className="py-2 text-gray-700">(-) Total Impuestos:</td>
                  <td className="py-2 text-right font-mono font-bold">({formatCurrency(totalImpuestos)})</td>
                </tr>
                <tr className="bg-black text-white">
                  <td className="py-4 font-bold uppercase text-base">Ganancia Neta Financiera</td>
                  <td className="py-4 text-right font-mono font-bold text-2xl">{formatCurrency(gananciaNeta)}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-400 pt-4">
              <div className="border border-gray-300 p-3 text-center">
                <p className="text-[10px] text-gray-600 uppercase mb-1">ROI sobre Capital</p>
                <p className="text-lg font-bold text-black">+{roiFinanciera.toFixed(2)}%</p>
              </div>
              <div className="border border-gray-300 p-3 text-center">
                <p className="text-[10px] text-gray-600 uppercase mb-1">Margen Neto</p>
                <p className="text-lg font-bold text-black">
                  {((gananciaNeta / desagioBruto) * 100).toFixed(2)}%
                </p>
              </div>
              <div className="border border-gray-300 p-3 text-center">
                <p className="text-[10px] text-gray-600 uppercase mb-1">Ganancia/Día</p>
                <p className="text-lg font-bold text-black">
                  {formatCurrency(gananciaNeta / months)}
                </p>
              </div>
            </div>
          </section>

          {/* V. NOTAS CONTABLES */}
          <section className="border-t border-b border-black py-6">
            <h2 className="text-sm font-bold text-black mb-4 uppercase tracking-widest">
              V. Notas Contables y Asientos Sugeridos
            </h2>

            <div className="space-y-4 text-xs">
              <div className="border border-gray-400 p-4">
                <p className="font-bold text-black mb-2 text-[10px] uppercase">1. En el momento del adelanto:</p>
                <div className="font-mono text-[10px] space-y-1 bg-gray-50 p-3 border-l-2 border-black">
                  <p>D - Duplicatas a Receber ........... {formatCurrency(valorNominalFactura)}</p>
                  <p className="pl-4">C - Banco .......................... {formatCurrency(capitalAdelantado)}</p>
                  <p className="pl-4">C - Receita de Deságio ............. {formatCurrency(desagioBruto)}</p>
                </div>
              </div>

              <div className="border border-gray-400 p-4">
                <p className="font-bold text-black mb-2 text-[10px] uppercase">2. Al vencimiento (cobro de factura):</p>
                <div className="font-mono text-[10px] space-y-1 bg-gray-50 p-3 border-l-2 border-black">
                  <p>D - Banco .......................... {formatCurrency(montoRecuperadoAlVencimiento)}</p>
                  <p className="pl-4">C - Duplicatas a Receber ........... {formatCurrency(valorNominalFactura)}</p>
                </div>
              </div>

              <div className="border border-gray-400 p-4">
                <p className="font-bold text-black mb-2 text-[10px] uppercase">3. Registro de impuestos a pagar:</p>
                <div className="font-mono text-[10px] space-y-1 bg-gray-50 p-3 border-l-2 border-black">
                  <p>D - Despesa com Impostos ........... {formatCurrency(totalImpuestos)}</p>
                  <p className="pl-4">C - ISS a Pagar .................... {formatCurrency(issAmount)}</p>
                  <p className="pl-4">C - PIS a Pagar .................... {formatCurrency(pisAmount)}</p>
                  <p className="pl-4">C - COFINS a Pagar ................. {formatCurrency(cofinsAmount)}</p>
                  <p className="pl-4">C - IRPJ a Pagar ................... {formatCurrency(irpjAmount)}</p>
                  <p className="pl-4">C - CSLL a Pagar ................... {formatCurrency(csllAmount)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 border border-gray-400 bg-gray-50 p-4">
              <p className="text-[10px] font-bold text-black mb-2 uppercase">Advertencias Contables:</p>
              <ul className="text-[10px] text-gray-700 space-y-1 list-disc list-inside">
                <li>Verificar provisión para créditos de liquidación duvidosa (PCLD) según histórico de mora</li>
                <li>Registrar deságio como receita de serviços conforme legislación fiscal</li>
                <li>Mantener documentación comprobatoria de la duplicata por 5 años</li>
                <li>Considerar IOF si aplicable según interpretación fiscal</li>
              </ul>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t-2 border-black text-center">
            <p className="text-[10px] text-black font-bold uppercase tracking-widest mb-2">
              Documento Interno - Confidencial
            </p>
            <p className="text-[9px] text-gray-600">
              Este informe es exclusivo para uso interno de la financiera y contiene información confidencial.
              Prohibida su reproducción o distribución sin autorización.
            </p>
            <p className="text-[9px] text-gray-500 mt-3 font-mono">
              Generado: {new Date().toLocaleString('es-BR')} | Sistema Contable Tasa Brasil v1.0
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
