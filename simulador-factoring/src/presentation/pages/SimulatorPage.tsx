import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../../context/SimulationContext';
import { SimulatorForm } from '../components/SimulatorForm';
import { SimulationResults } from '../components/SimulationResults';
import { SimulateFactoringUseCase } from '../../application/use-cases/SimulateFactoringUseCase';
import type { SimulationInputDTO } from '../../application/dtos/SimulationInputDTO';
import type { SimulationOutputDTO } from '../../application/dtos/SimulationOutputDTO';

export function SimulatorPage() {
  const navigate = useNavigate();
  const { setSimulationData } = useSimulation();
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

      // Save to context for reports
      const totalGain = output.netCalculation.totalDesagio - output.taxCalculations.totalTaxAmount;
      const monthsCount = output.daysToMaturity / 30;

      setSimulationData({
        amount: output.faceValue,
        months: output.daysToMaturity,
        autoReinvest: false,
        finalAmount: output.netCalculation.netAmount,
        totalGain: totalGain,
        roiPercentage: (totalGain / output.netCalculation.netAmount) * 100,
        monthlyAverage: totalGain / monthsCount,
        effectiveRate: output.rateCalculation.effectiveMonthlyRate / 100, // Convert from percentage to decimal
        fullOutput: output, // Include full simulation output for detailed reports
      });

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
    <div className="min-h-screen py-4 md:py-8 px-3 md:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Brazilian Header with 3D Effect */}
        <header className="mb-6 md:mb-8">
          <div
            className="rounded-xl md:rounded-2xl overflow-hidden relative"
            style={{
              background: 'linear-gradient(135deg, #006B3D 0%, #009C4F 50%, #00A859 100%)',
              boxShadow: '0 20px 60px rgba(0, 107, 61, 0.4), 0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Accent stripe - Brazilian flag yellow */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: 'linear-gradient(90deg, #D4A017 0%, #FFDF00 50%, #D4A017 100%)',
                boxShadow: '0 2px 8px rgba(212, 160, 23, 0.4)'
              }}
            />

            <div className="px-4 md:px-8 py-6 md:py-10 relative">
              <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between mb-4 md:mb-6 gap-4">
                <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                  <div
                    className="rounded-lg md:rounded-xl p-2 md:p-3 relative flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #002776 0%, #003893 100%)',
                      boxShadow: '0 8px 20px rgba(0, 39, 118, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl md:text-3xl font-bold text-white mb-0.5 md:mb-1 leading-tight" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
                      Simulador de Factoring Brasil
                    </h1>
                    <p className="text-xs md:text-sm font-medium" style={{ color: '#F4E4A3' }}>Plataforma Profissional de Simulação Financeira</p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-2">
                  <span className="badge badge-success">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Seguro
                  </span>
                  <span className="badge badge-info">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Certificado
                  </span>
                </div>
              </div>
              <div
                className="rounded-lg px-3 md:px-4 py-2.5 md:py-3 relative"
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
                }}
              >
                <p className="text-xs md:text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  <span className="font-semibold" style={{ color: '#FFDF00' }}>Sistema conforme a legislação brasileira:</span> Lei Complementar 116/2003 (ISS), Lei nº 9.715/1998 e 9.718/1998 (PIS/COFINS), Lei nº 9.430/96 (IRPJ/CSLL) e IN RFB 1.543/2015 (IOF)
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-lg overflow-hidden">
            <div className="p-5 flex items-start">
              <div className="flex-shrink-0">
                <div className="bg-red-500 rounded-full p-2">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-bold text-red-900">Error en la Simulación</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="mb-8 md:mb-10">
          <SimulatorForm onSubmit={handleSimulate} isLoading={isLoading} />
        </div>

        {/* Results */}
        {results && (
          <div id="results" className="scroll-mt-8">
            <div
              className="mb-4 md:mb-6 rounded-xl p-4 md:p-6 flex flex-col gap-4 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #002776 0%, #003893 100%)',
                boxShadow: '0 16px 48px rgba(0, 39, 118, 0.4), 0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 opacity-10">
                <svg fill="currentColor" viewBox="0 0 20 20" className="text-white">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="relative z-10">
                <h2 className="text-lg md:text-xl font-bold text-white mb-0.5 md:mb-1" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
                  Resultados da Simulação
                </h2>
                <p className="text-xs md:text-sm font-medium" style={{ color: '#F4E4A3' }}>Análise completa da sua operação de factoring</p>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 relative z-10">
                <button
                  onClick={() => navigate('/informe-financiera')}
                  className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #FFDF00 0%, #D4A017 100%)',
                    color: '#2C3E50',
                    border: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Informe Financiera
                </button>
                <button
                  onClick={() => navigate('/formal-report')}
                  className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #006B3D 0%, #009C4F 100%)',
                    color: 'white',
                    border: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Informe Formal
                </button>
                <button
                  onClick={handleNewSimulation}
                  className="btn-secondary w-full sm:w-auto text-sm"
                >
                  Nova Simulação
                </button>
              </div>
            </div>
            <SimulationResults results={results} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 md:mt-16 pt-6 md:pt-8" style={{ borderTop: '2px solid #B0BEC5' }}>
          <div
            className="rounded-xl p-4 md:p-6 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F7F9 100%)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-2 md:mb-3">
              <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#D4A017' }}>
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-xs md:text-sm font-bold" style={{ color: '#2C3E50' }}>
                Documento Simulado - Sem Validade Legal
              </p>
            </div>
            <p className="text-xs leading-relaxed max-w-2xl mx-auto px-2" style={{ color: '#546E7A' }}>
              Os cálculos apresentados são referenciais e podem variar conforme condições específicas do mercado, políticas da instituição financeira e análise de risco individual. Esta simulação não constitui oferta vinculante nem garantia de aprovação de crédito.
            </p>
            <div className="mt-3 md:mt-4 pt-3 md:pt-4" style={{ borderTop: '1px solid #CFD8DC' }}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div
                  className="w-6 h-4 rounded-sm"
                  style={{
                    background: 'linear-gradient(135deg, #006B3D 0%, #009C4F 100%)',
                    boxShadow: '0 2px 4px rgba(0, 107, 61, 0.3)',
                  }}
                />
                <div
                  className="w-6 h-4 rounded-sm"
                  style={{
                    background: 'linear-gradient(135deg, #D4A017 0%, #FFDF00 100%)',
                    boxShadow: '0 2px 4px rgba(212, 160, 23, 0.3)',
                  }}
                />
                <div
                  className="w-6 h-4 rounded-sm"
                  style={{
                    background: 'linear-gradient(135deg, #002776 0%, #003893 100%)',
                    boxShadow: '0 2px 4px rgba(0, 39, 118, 0.3)',
                  }}
                />
              </div>
              <p className="text-xs" style={{ color: '#78909C' }}>
                © 2025 Tasa Brasil - Plataforma Profissional de Simulação de Factoring
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

