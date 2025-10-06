import { HeroCalculator } from '../components/organisms/HeroCalculator';
import { ComparisonTable } from '../components/organisms/ComparisonTable';

/**
 * Landing Page principal de marketing
 * Diseñada para conversión: calculadora -> comparación -> CTA
 */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section con Calculadora */}
      <HeroCalculator />

      {/* Sección de Comparación */}
      <ComparisonTable initialAmount={100000} months={12} />

      {/* Footer Simple */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2025 Tasa Brasil. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Factoring regulado. Consulte términos y condiciones.
          </p>
        </div>
      </footer>
    </div>
  );
}
