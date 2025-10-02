# Simulador de Factoring - React Application

Una aplicación completa de React + TypeScript para simular operaciones de factoring siguiendo la normativa tributaria brasileña.

## Características

- **Arquitectura Limpia (Clean Architecture)**: Separación estricta entre capas de dominio, aplicación, infraestructura y presentación
- **Cálculos Financieros Precisos**: Uso de `decimal.js` para evitar errores de punto flotante
- **Normativa Brasileña**: Implementa cálculos conforme a ISS, PIS, COFINS, IRPJ y CSLL
- **Interfaz en Español**: Todo el UI está en español
- **Validación de CNPJ**: Validación completa del formato y dígitos verificadores
- **Diseño Responsivo**: Funciona en dispositivos móviles y de escritorio
- **Tailwind CSS**: Diseño moderno y profesional

## Tecnologías

- **React 18** con TypeScript
- **Vite** - Build tool rápido y moderno
- **Tailwind CSS** - Estilos utilitarios
- **decimal.js** - Aritmética decimal precisa
- **date-fns** - Manejo de fechas

## Estructura del Proyecto

```
src/
├── domain/              # Capa de dominio (lógica de negocio)
│   ├── entities/
│   ├── value-objects/   # Money, Percentage, RateCalculation, TaxCalculations
│   ├── enums/           # TaxRegime, RiskProfile, CreditRating, etc.
│   └── exceptions/
├── application/         # Capa de aplicación (casos de uso)
│   ├── use-cases/       # SimulateFactoringUseCase
│   └── dtos/            # Input/Output DTOs
├── infrastructure/      # Capa de infraestructura
│   ├── services/
│   └── config/
├── presentation/        # Capa de presentación (componentes React)
│   └── components/
│       ├── SimulatorForm.tsx
│       └── SimulationResults.tsx
└── utils/               # Utilidades (formatters)
```

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Uso

1. **Información de la Duplicata**: Ingrese el número, fechas y valor nominal
2. **Información del Deudor**: Complete los datos del sacado (quien debe pagar)
3. **Información del Acreedor**: Complete los datos del cedente (quien vende el crédito)
4. **Parámetros de la Operación**: Seleccione sector económico, modalidad, perfiles de riesgo y régimen tributario
5. **Simular**: Haga clic en "Simular Factoring" para ver los resultados

## Cálculos Implementados

### Tasa de Deságio
- Tasa base por sector económico
- Ajustes por riesgo del cliente y deudor
- Ajuste por modalidad (con/sin regreso)
- Descuentos por volumen de operación
- Fórmula: Simple para ≤3 meses, compuesta para >3 meses

### Tributos

**ISS (Imposto Sobre Serviços)**
- Base: Deságio (tarifa del servicio)
- Alícuota: 2% a 5% según municipio
- Base legal: Lei Complementar 116/2003

**PIS (Programa de Integração Social)**
- Base: Receita bruta (deságio)
- Alícuota: 0.65% (acumulativo) o 1.65% (no acumulativo)
- Base legal: Lei nº 9.715/1998

**COFINS (Contribuição para Financiamento da Seguridade Social)**
- Base: Receita bruta (deságio)
- Alícuota: 3.0% (acumulativo) o 7.6% (no acumulativo)
- Base legal: Lei nº 9.718/1998

**IRPJ (Imposto de Renda Pessoa Jurídica)**
- Base: 32% de lucro presumido sobre deságio
- Alícuota: 15% sobre lucro
- Base legal: Lei nº 9.430/96

**CSLL (Contribuição Social sobre Lucro Líquido)**
- Base: 32% de lucro presumido sobre deságio
- Alícuota: 9% sobre lucro
- Base legal: Lei nº 7.689/88

## Formato Brasileño

- **Moneda**: R$ (Real Brasileño)
- **Fechas**: DD/MM/AAAA
- **CNPJ**: XX.XXX.XXX/XXXX-XX
- **Números**: 1.234,56 (punto para miles, coma para decimales)
- **Porcentajes**: X,XX%

## Ejemplo de Simulación

**Entrada:**
- Valor nominal: R$ 100.000,00
- Plazo: 60 días (2 meses)
- Tasa mensual: 3%
- Régimen: Lucro Presumido
- Municipio: São Paulo (ISS 3%)

**Resultado:**
- Deságio: R$ 6.000,00 (6%)
- ISS: R$ 180,00
- PIS: R$ 39,00
- COFINS: R$ 180,00
- IRPJ: R$ 288,00
- CSLL: R$ 172,80
- **Valor Neto a Recibir: R$ 93.140,20**

## Arquitectura Clean

El proyecto sigue los principios de Clean Architecture:

1. **Domain Layer** (núcleo): Lógica de negocio pura, sin dependencias
2. **Application Layer**: Casos de uso que orquestan el dominio
3. **Infrastructure Layer**: Implementaciones concretas (servicios, repositorios)
4. **Presentation Layer**: Componentes React, UI

**Flujo de Dependencias**: Presentation → Application → Domain ← Infrastructure

## Despliegue

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker
```bash
docker build -t simulador-factoring .
docker run -p 3000:3000 simulador-factoring
```

## Licencia

MIT

## Autor

Claude Code - Fintech Architecture Specialist
