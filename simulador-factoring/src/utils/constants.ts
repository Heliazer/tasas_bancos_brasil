/**
 * Constantes de marketing y configuración de la plataforma
 */

/** Tasas de retorno mensuales */
export const INVESTMENT_RATES = {
  /** Tasa mensual conservadora (3.5%) */
  CONSERVATIVE: 0.035,

  /** Tasa mensual estándar (3.8%) */
  STANDARD: 0.038,

  /** Tasa mensual agresiva (4.2%) */
  AGGRESSIVE: 0.042,
} as const;

/** Tasas de comparación con otras inversiones (anuales) */
export const COMPARISON_RATES = {
  /** Poupança tradicional brasileña (~6% anual) */
  POUPANCA: 0.06,

  /** CDI (Certificado de Depósito Interbancário ~13% anual) */
  CDI: 0.13,

  /** Nuestra plataforma (3.8% mensual = ~56% anual compuesto) */
  PLATFORM_ANNUAL: 0.56,
} as const;

/** Límites de inversión */
export const INVESTMENT_LIMITS = {
  /** Inversión mínima: R$ 10,000 */
  MIN_AMOUNT: 10000,

  /** Inversión máxima: R$ 1,000,000 */
  MAX_AMOUNT: 1000000,

  /** Plazo mínimo: 1 mes */
  MIN_MONTHS: 1,

  /** Plazo máximo: 60 meses (5 años) */
  MAX_MONTHS: 60,
} as const;

/** Textos de marketing */
export const MARKETING_COPY = {
  HERO_TITLE: 'Tu dinero trabajando mientras vos dormís',
  HERO_SUBTITLE: 'Retornos desde 3.5% mensual respaldados por operaciones reales de factoring',
  CTA_PRIMARY: 'QUIERO INVERTIR',
  CTA_SECONDARY: 'Ver cómo funciona',

  COMPARISON_TITLE: 'Si invertís R$ 100.000 por 12 meses',
  COMPARISON_POUPANCA: 'Poupança tradicional',
  COMPARISON_CDI: 'CDI',
  COMPARISON_PLATFORM: 'Tasa Brasil',

  TRUST_BADGES: {
    SAFETY: 'Operações respaldadas por duplicatas reales',
    TRANSPARENCY: '100% transparente e regulado',
    PERFORMANCE: 'Mora histórica <1%',
    LIQUIDITY: 'Liquidez en 30-60 días',
  },
} as const;

/** Configuración de animaciones */
export const ANIMATION_CONFIG = {
  /** Duración de animaciones en milisegundos */
  DURATION_FAST: 200,
  DURATION_NORMAL: 500,
  DURATION_SLOW: 1000,

  /** Duración del contador animado de números */
  COUNT_UP_DURATION: 1.5,

  /** Easing para animaciones suaves */
  EASING: [0.4, 0.0, 0.2, 1] as [number, number, number, number],
} as const;

/** Breakpoints responsive (Tailwind defaults) */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;
