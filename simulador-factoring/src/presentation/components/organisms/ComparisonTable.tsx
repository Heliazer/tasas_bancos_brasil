import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../atoms/Card';
import { calculateComparisons } from '../../../utils/marketingCalculations';
import { formatCurrency } from '../../../utils/formatters';
import { MARKETING_COPY } from '../../../utils/constants';

interface ComparisonTableProps {
  initialAmount?: number;
  months?: number;
}

/**
 * ComparisonTable - Muestra comparación brutal con otras inversiones
 * Este componente está diseñado para convertir mediante contraste visual
 */
export function ComparisonTable({ initialAmount = 100000, months = 12 }: ComparisonTableProps) {
  const [amount] = useState(initialAmount);
  const [period] = useState(months);

  const comparisons = calculateComparisons(amount, period);

  // Encontrar el mejor para highlight
  const bestComparison = comparisons.reduce((best, current) =>
    current.totalGain > best.totalGain ? current : best
  );

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20 bg-gray-50">
      <div className="text-center mb-12">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Comparación Brutal
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-gray-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {MARKETING_COPY.COMPARISON_TITLE}
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {comparisons.map((comparison, index) => {
          const isBest = comparison.name === bestComparison.name;

          return (
            <motion.div
              key={comparison.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card
                variant={isBest ? 'elevated' : 'bordered'}
                className={`relative overflow-hidden ${
                  isBest ? 'ring-2 ring-green-500 scale-105 md:scale-110' : ''
                }`}
              >
                {/* Badge para el mejor */}
                {isBest && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                    MEJOR OPCIÓN
                  </div>
                )}

                <div className="text-center space-y-4 pt-2">
                  {/* Emoji y nombre */}
                  <div>
                    <div className="text-5xl mb-2">{comparison.emoji}</div>
                    <h3 className="text-xl font-bold text-gray-900">{comparison.name}</h3>
                    <p className="text-sm text-gray-500">{comparison.annualRate}% anual</p>
                  </div>

                  {/* Separador */}
                  <div className="border-t border-gray-200 pt-4">
                    {/* Monto final */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Tendrías</p>
                      <p
                        className={`text-3xl font-bold ${
                          isBest ? 'text-green-600' : 'text-gray-700'
                        }`}
                      >
                        {formatCurrency(comparison.finalAmount)}
                      </p>
                    </div>

                    {/* Ganancia */}
                    <div
                      className={`py-3 px-4 rounded-lg ${
                        isBest ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <p className="text-xs text-gray-500 mb-1">Ganaste</p>
                      <p
                        className={`text-2xl font-bold ${
                          isBest ? 'text-green-600' : 'text-gray-600'
                        }`}
                      >
                        {formatCurrency(comparison.totalGain)}
                      </p>

                      {/* ROI Percentage */}
                      <p className="text-xs text-gray-500 mt-1">
                        +{((comparison.totalGain / comparison.initialAmount) * 100).toFixed(1)}% ROI
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Explicación de la diferencia */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full">
          <span className="text-2xl">🚀</span>
          <p className="font-semibold">
            Ganás{' '}
            {formatCurrency(
              bestComparison.totalGain - comparisons[0].totalGain
            )}{' '}
            MÁS que con Poupança
          </p>
        </div>

        <p className="text-sm text-gray-500 mt-4 max-w-2xl mx-auto">
          *Simulación basada en tasas históricas. Poupança: ~6% anual, CDI: ~13% anual, Tasa Brasil: 3.8% mensual compuesto.
          Los retornos pasados no garantizan retornos futuros.
        </p>
      </motion.div>
    </section>
  );
}
