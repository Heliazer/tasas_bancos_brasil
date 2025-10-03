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
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Document Header */}
        <header className="mb-10 bg-white border-4 border-double border-slate-800 p-8 shadow-lg">
          <div className="document-header text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
              SIMULACIÓN DE OPERACIÓN DE FACTORING
            </h1>
            <p className="text-sm text-slate-600 font-semibold uppercase tracking-widest">República Federativa del Brasil</p>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-700 leading-relaxed max-w-3xl mx-auto">
              Simulación de operación de fomento mercantil conforme a la legislación tributaria brasileña vigente:
              Lei Complementar 116/2003 (ISS), Lei nº 9.715/1998 e 9.718/1998 (PIS/COFINS), Lei nº 9.430/96 (IRPJ/CSLL) e IN RFB 1.543/2015 (IOF)
            </p>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs text-slate-800 font-bold uppercase tracking-wide">Error en la Simulación</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="mb-10">
          <SimulatorForm onSubmit={handleSimulate} isLoading={isLoading} />
        </div>

        {/* Results */}
        {results && (
          <div id="results" className="scroll-mt-8">
            <div className="mb-6 bg-slate-800 text-white p-4 shadow-md flex justify-between items-center">
              <h2 className="text-lg font-bold uppercase tracking-wide">Resultados de la Simulación</h2>
              <button
                onClick={handleNewSimulation}
                className="bg-white text-slate-800 font-bold py-2 px-4 hover:bg-gray-100 transition-all border border-slate-300 uppercase text-xs tracking-wide"
              >
                Nueva Simulación
              </button>
            </div>
            <SimulationResults results={results} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t-2 border-slate-300 text-center">
          <p className="text-xs text-slate-600 font-semibold mb-2">
            DOCUMENTO SIMULADO - SIN VALIDEZ LEGAL
          </p>
          <p className="text-xs text-slate-500">
            Los cálculos son referenciales y pueden variar según condiciones específicas del mercado y la institución financiera
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
