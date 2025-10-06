import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInvestmentCalculator } from '../../hooks/useInvestmentCalculator';
import { useSimulation } from '../../../context/SimulationContext';
import { Card } from '../atoms/Card';
import { Slider } from '../atoms/Slider';
import { Toggle } from '../atoms/Toggle';
import { Button } from '../atoms/Button';
import { AnimatedNumber } from '../atoms/AnimatedNumber';
import { formatCurrency } from '../../../utils/formatters';
import { INVESTMENT_LIMITS, MARKETING_COPY } from '../../../utils/constants';

/**
 * HeroCalculator - La calculadora interactiva principal de la landing page
 * Permite al usuario simular su inversión y ver resultados en tiempo real
 */
export function HeroCalculator() {
  const { amount, months, autoReinvest, result, setAmount, setMonths, toggleAutoReinvest } =
    useInvestmentCalculator();
  const { setSimulationData } = useSimulation();
  const navigate = useNavigate();

  const handleViewReport = () => {
    // Guardar datos de simulación en el context
    setSimulationData({
      amount,
      months,
      autoReinvest,
      finalAmount: result.finalAmount,
      totalGain: result.totalGain,
      roiPercentage: result.roiPercentage,
      monthlyAverage: result.monthlyAverage,
      effectiveRate: result.effectiveRate
    });
    // Navegar a la página de informe
    navigate('/informe');
  };

  const handleViewFinancieraReport = () => {
    // Guardar datos de simulación en el context
    setSimulationData({
      amount,
      months,
      autoReinvest,
      finalAmount: result.finalAmount,
      totalGain: result.totalGain,
      roiPercentage: result.roiPercentage,
      monthlyAverage: result.monthlyAverage,
      effectiveRate: result.effectiveRate
    });
    // Navegar a la página de informe de la financiera
    navigate('/informe-financiera');
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {MARKETING_COPY.HERO_TITLE}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {MARKETING_COPY.HERO_SUBTITLE}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card variant="elevated" className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Columna Izquierda: Inputs */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ¿Cuánto querés invertir?
                </h3>
                <Slider
                  value={amount}
                  min={INVESTMENT_LIMITS.MIN_AMOUNT}
                  max={INVESTMENT_LIMITS.MAX_AMOUNT}
                  step={5000}
                  onChange={setAmount}
                  formatValue={formatCurrency}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ¿Por cuánto tiempo?
                </h3>
                <Slider
                  value={months}
                  min={INVESTMENT_LIMITS.MIN_MONTHS}
                  max={INVESTMENT_LIMITS.MAX_MONTHS}
                  step={1}
                  onChange={setMonths}
                  formatValue={(m) =>
                    m === 12 ? '1 año' : m < 12 ? `${m} meses` : `${(m / 12).toFixed(1)} años`
                  }
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Toggle
                  label="Reinvertir ganancias automáticamente (recomendado)"
                  checked={autoReinvest}
                  onChange={toggleAutoReinvest}
                />
                <p className="text-xs text-gray-500 mt-2 ml-15">
                  {autoReinvest
                    ? 'Tus ganancias se reinvierten cada mes para maximizar el crecimiento'
                    : 'Recibirás las ganancias mensuales sin reinvertir'}
                </p>
              </div>
            </div>

            {/* Columna Derecha: Resultados */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 md:p-8 flex flex-col justify-center">
              <div className="text-center space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">VAS A TENER</p>
                  <AnimatedNumber
                    value={result.finalAmount}
                    className="text-5xl md:text-6xl font-bold text-green-600"
                  />
                </div>

                <div className="pt-6 border-t border-green-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ganancia total:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(result.totalGain)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ROI:</span>
                    <span className="text-xl font-bold text-green-600">
                      +{result.roiPercentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Promedio mensual:</span>
                    <span className="text-lg font-semibold text-gray-700">
                      {formatCurrency(result.monthlyAverage)}
                    </span>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <Button size="lg" fullWidth>
                    {MARKETING_COPY.CTA_PRIMARY}
                  </Button>

                  <button
                    onClick={handleViewReport}
                    className="w-full px-4 py-2 bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 transition-colors font-semibold text-sm"
                  >
                    📄 Ver Informe Detallado
                  </button>

                  <button
                    onClick={handleViewFinancieraReport}
                    className="w-full px-4 py-2 bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-50 transition-colors font-semibold text-sm"
                  >
                    📊 Informe Contable (Financiera)
                  </button>
                </div>

                <p className="text-xs text-gray-500">
                  Basado en tasa mensual promedio de {(result.effectiveRate * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {Object.entries(MARKETING_COPY.TRUST_BADGES).map(([key, value]) => (
          <div key={key} className="text-center">
            <p className="text-sm text-gray-600">{value}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
