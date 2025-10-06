/**
 * Servicio de Datos Macroeconómicos de Brasil
 * Fuente: Informe de inflación y política monetaria (octubre 2025)
 * Basado en IBGE, BCB, Focus/BCB
 */

export interface MacroeconomicData {
  /** Inflación IPCA interanual (%) */
  ipca: number;
  /** Inflación IPCA esperada próximos 12 meses (%) */
  ipcaExpected12m: number;
  /** Tasa Selic anual (%) */
  selic: number;
  /** Tasa real ex-ante (%) */
  realRate: number;
  /** Meta de inflación BCB (%) */
  inflationTarget: number;
  /** Banda superior de inflación (%) */
  inflationTargetUpper: number;
  /** Banda inferior de inflación (%) */
  inflationTargetLower: number;
  /** Fecha de actualización */
  lastUpdate: string;
}

export interface InflationScenario {
  name: string;
  ipca: number;
  selic: number;
  description: string;
}

export class MacroeconomicDataService {
  /**
   * Obtiene los datos macroeconómicos actuales
   * Datos actualizados según informe octubre 2025
   */
  static getCurrentData(): MacroeconomicData {
    return {
      ipca: 5.1, // IPCA agosto 2025 interanual
      ipcaExpected12m: 4.8, // Expectativa Focus para próximos 12 meses
      selic: 15.0, // Tasa Selic actual
      realRate: 9.8, // Tasa real ex-ante (≈ Selic - inflación esperada)
      inflationTarget: 3.0, // Meta oficial
      inflationTargetUpper: 4.5, // Banda superior (3.0 + 1.5)
      inflationTargetLower: 1.5, // Banda inferior (3.0 - 1.5)
      lastUpdate: '2025-10-06',
    };
  }

  /**
   * Obtiene los escenarios de inflación
   */
  static getScenarios(): InflationScenario[] {
    return [
      {
        name: 'Base (Consenso Focus)',
        ipca: 4.8,
        selic: 15.0,
        description: 'Escenario base con convergencia gradual hacia meta',
      },
      {
        name: 'Alcista (Riesgo Inflacionario)',
        ipca: 6.0,
        selic: 15.25,
        description: 'Inflación persistente, sin recortes de Selic',
      },
      {
        name: 'Bajista (Desinflación)',
        ipca: 4.0,
        selic: 13.0,
        description: 'Desinflación acelerada, inicio de recortes en 2026',
      },
    ];
  }

  /**
   * Calcula la tasa real dada una tasa nominal y la inflación esperada
   * Fórmula: r_real = (1 + r_nominal) / (1 + inflación) - 1
   */
  static calculateRealRate(nominalRate: number, expectedInflation: number): number {
    return ((1 + nominalRate / 100) / (1 + expectedInflation / 100) - 1) * 100;
  }

  /**
   * Calcula ajuste de inflación para la tasa nominal
   * Basado en el diferencial entre inflación esperada y meta
   */
  static calculateInflationAdjustment(expectedInflation: number): number {
    const data = this.getCurrentData();
    const differential = expectedInflation - data.inflationTarget;

    // Si la inflación esperada está por encima de la meta, se agrega un ajuste
    if (differential > 0) {
      // Ajuste entre 0 y 1 punto porcentual según volatilidad
      return Math.min(differential * 0.3, 1.0);
    }

    return 0;
  }

  /**
   * Calcula tasa nominal ajustada por inflación
   * Fórmula: r_nominal = Selic + Spread_crédito + Ajuste_inflación
   */
  static calculateAdjustedNominalRate(
    creditSpread: number,
    expectedInflation?: number
  ): number {
    const data = this.getCurrentData();
    const inflation = expectedInflation || data.ipcaExpected12m;
    const inflationAdjustment = this.calculateInflationAdjustment(inflation);

    return data.selic + creditSpread + inflationAdjustment;
  }
}
