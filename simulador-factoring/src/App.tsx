import { useState } from 'react';
import { SimulatorForm } from './presentation/components/SimulatorForm';
import { SimulationResults } from './presentation/components/SimulationResults';
import { SimulateFactoringUseCase } from './application/use-cases/SimulateFactoringUseCase';
import type { SimulationInputDTO } from './application/dtos/SimulationInputDTO';
import type { SimulationOutputDTO } from './application/dtos/SimulationOutputDTO';

function App() {
  const [results, setResults] = useState<SimulationOutputDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const useCase = new SimulateFactoringUseCase();

  const handleSimulate = (input: SimulationInputDTO) => {
    try {
      setIsLoading(true);
      setError(null);

      // Execute the use case
      const output = useCase.execute(input);
      setResults(output);

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al simular');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSimulation = () => {
    setResults(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-block px-6 py-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl mb-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Simulador de Factoring
            </h1>
            <p className="text-xs text-gray-500 font-medium">Mercado Brasileño</p>
          </div>
          <p className="text-lg text-white font-medium max-w-2xl mx-auto drop-shadow-lg">
            Simule operaciones de factoring con cálculos precisos de tasas, impuestos y valor neto conforme a la normativa brasileña
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">Error</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="mb-8">
          <SimulatorForm onSubmit={handleSimulate} isLoading={isLoading} />
        </div>

        {/* Results */}
        {results && (
          <div id="results" className="scroll-mt-8">
            <div className="mb-6 flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Resultados</h2>
              <button
                onClick={handleNewSimulation}
                className="btn-secondary"
              >
                Nueva Simulación
              </button>
            </div>
            <SimulationResults results={results} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/20 text-center text-sm text-white">
          <p className="mb-2 font-medium drop-shadow">
            Los cálculos se realizan conforme a la normativa tributaria brasileña vigente
          </p>
          <p className="text-xs text-white/80">
            ISS (Lei Complementar 116/2003) • PIS/COFINS (Lei nº 9.715/1998 e 9.718/1998) • IRPJ/CSLL (Lei nº 9.430/96) • IOF (IN RFB 1.543/2015)
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
