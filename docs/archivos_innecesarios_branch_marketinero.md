# Archivos Innecesarios para la Branch Marketinero

Este documento lista los archivos que NO son necesarios para la nueva branch `marketinero` que se enfoca en el modelo de marketing para inversores.

## Fecha: 2025-10-04
## Branch: marketinero
## Propósito: Plataforma de marketing para inversores, NO simulador técnico de factoring

---

## Documentación Técnica Innecesaria

Estos archivos contienen especificaciones técnicas detalladas que NO son relevantes para una landing page/dashboard de marketing:

### Documentación de Arquitectura
- `docs/architecture_simulador_factoring.md` - Arquitectura Clean Architecture completa (2600+ líneas). **Demasiado técnico** para la branch de marketing.

### Documentación Legal/Normativa
- `docs/normativas_y_legal.md` - Detalles de normativas brasileñas. Puede guardarse para FAQs pero NO es necesario para desarrollo de UI.

### Informes de Investigación Extensos
- `docs/informe_claude_factoring.md` - Informe técnico de factoring.
- `docs/informe_genx_factoring.md` - Investigación exhaustiva del mercado de factoring brasileño. **Útil para copy** pero NO para código.

**Acción Recomendada**: Mover a una carpeta `docs/archive/` o a la branch master.

---

## Componentes de Presentación Actuales (A Reemplazar)

Los siguientes componentes están diseñados para un simulador técnico, NO para marketing:

### Componentes React a Eliminar/Reemplazar

```
simulador-factoring/src/presentation/components/
├── SimulatorForm.tsx          # Formulario técnico con muchos campos
└── SimulationResults.tsx      # Resultados con desglose completo de impuestos
```

**Por qué eliminar:**
- `SimulatorForm.tsx`: Pide datos técnicos (régimen fiscal, municipio, rating crediticio, etc.). Un inversor solo quiere poner: "¿Cuánto invierto?" y "¿Por cuánto tiempo?"
- `SimulationResults.tsx`: Muestra desglose completo de ISS, PIS, COFINS, IRPJ, CSLL. **Demasiado complejo**. El inversor solo quiere ver: "Vas a tener R$ XXX"

**Acción Recomendada**: Crear nuevos componentes:
- `Calculator.tsx` - Calculadora simple con slider de monto y selector de tiempo
- `ComparisonTable.tsx` - Comparación brutal vs otras inversiones
- `DashboardSimple.tsx` - Dashboard minimalista con 3 métricas clave

---

## Value Objects Innecesarios (Sobreingeniería)

El dominio actual tiene value objects MUY detallados que son overkill para una landing page:

### Value Objects que Pueden Simplificarse

```
simulador-factoring/src/domain/value-objects/
├── COFINSCalculation.ts       # Cálculo detallado de COFINS
├── CSLLCalculation.ts         # Cálculo detallado de CSLL
├── IOFCalculation.ts          # Cálculo de IOF (raramente aplicable)
├── IRPJCalculation.ts         # Cálculo detallado de IRPJ
├── ISSCalculation.ts          # Cálculo detallado de ISS
└── PISCalculation.ts          # Cálculo detallado de PIS
```

**Por qué simplificar:**
- Para marketing, basta con calcular el retorno NETO final
- No necesitamos mostrar cada impuesto por separado
- Un solo cálculo de "Tasa efectiva después de impuestos" es suficiente

**Acción Recomendada**:
- CONSERVAR estos archivos (los cálculos siguen siendo necesarios en backend)
- CREAR un wrapper simplificado: `NetReturnCalculation.ts` que use estos internamente pero solo retorne el número final

---

## Enums Técnicos Innecesarios para el Frontend

```
simulador-factoring/src/domain/enums/
├── CreditRating.ts            # Ratings AAA, AA, A, etc. - NO mostrar al inversor
├── EconomicSector.ts          # Sectores económicos - NO relevante para inversor
├── FactoringModality.ts       # Con/sin regreso - NO mostrar
├── OperationVolume.ts         # Pequeño/mediano/grande - AUTO-calcular
├── RiskProfile.ts             # Perfiles A-E - NO mostrar
└── TaxRegime.ts               # Regímenes fiscales - NO mostrar
```

**Por qué son innecesarios:**
- El inversor NO debe elegir su "perfil de riesgo" o "rating crediticio"
- Estos son cálculos internos que deben ocurrir en el backend
- La UI de marketing debe ser: "¿Cuánto invertís?" → "Vas a tener esto"

**Acción Recomendada**:
- CONSERVAR en `domain/enums/` (necesarios para cálculos)
- NO exponerlos en la UI
- Usar valores por defecto razonables (ej: RiskProfile.B, CreditRating.A)

---

## DTOs Complejos Innecesarios

```
simulador-factoring/src/application/dtos/
├── SimulationInputDTO.ts      # DTO con 15+ campos técnicos
└── SimulationOutputDTO.ts     # DTO con desglose completo
```

**Por qué simplificar:**
- `SimulationInputDTO`: Pide datos que el inversor no tiene (régimen fiscal, código IBGE del municipio, etc.)
- `SimulationOutputDTO`: Retorna 50+ campos cuando el inversor solo quiere 3-4

**Acción Recomendada**: Crear DTOs simplificados:

```typescript
// InvestmentInputDTO.ts - SIMPLE
interface InvestmentInputDTO {
  amount: number;           // Cuánto invertís
  months: number;           // Por cuánto tiempo
  autoReinvest: boolean;    // ¿Reinvertís?
}

// InvestmentOutputDTO.ts - SIMPLE
interface InvestmentOutputDTO {
  initialAmount: number;       // R$ 100.000
  finalAmount: number;         // R$ 142.536
  totalGain: number;           // R$ 42.536
  monthlyAverage: number;      // R$ 3.545/mes
  effectiveRate: number;       // 3.8% mensual
}
```

---

## Archivos de Configuración y Build (Conservar)

Estos archivos SON necesarios:

```
✅ package.json
✅ vite.config.ts
✅ tsconfig.json
✅ tailwind.config.js
✅ eslint.config.js
✅ postcss.config.js
```

**NO eliminar** - son esenciales para el build.

---

## Resumen de Acciones

### Eliminar/Archivar
1. `docs/architecture_simulador_factoring.md` → Mover a `docs/archive/`
2. `docs/normativas_y_legal.md` → Mover a `docs/archive/`
3. `docs/informe_claude_factoring.md` → Mover a `docs/archive/`
4. `simulador-factoring/src/presentation/components/SimulatorForm.tsx` → Eliminar
5. `simulador-factoring/src/presentation/components/SimulationResults.tsx` → Eliminar

### Conservar pero NO Usar en UI
1. Todo en `domain/value-objects/` - Necesarios para cálculos backend
2. Todo en `domain/enums/` - Necesarios para lógica interna
3. Todo en `application/use-cases/` - Lógica de negocio válida

### Crear Nuevos (Marketing)
1. `src/presentation/components/Calculator.tsx` - Calculadora sexy
2. `src/presentation/components/ComparisonTable.tsx` - Comparación brutal
3. `src/presentation/components/DashboardSimple.tsx` - Dashboard minimalista
4. `src/presentation/components/GrowthChart.tsx` - Gráfico animado
5. `src/application/dtos/InvestmentInputDTO.ts` - DTO simplificado
6. `src/application/dtos/InvestmentOutputDTO.ts` - DTO simplificado

---

## Filosofía de la Branch Marketinero

**Master Branch**: Clean Architecture, 100% técnico, completo
**Marketinero Branch**: Marketing-first, simple, conversion-focused

| Aspecto | Master | Marketinero |
|---------|--------|-------------|
| Objetivo | Simulador técnico de factoring | Vender la inversión |
| Usuario | Analista financiero, contador | Inversor común |
| Inputs | 15+ campos técnicos | 2-3 campos simples |
| Outputs | Desglose completo con impuestos | "Vas a tener R$ XXX" |
| Complejidad | Alta (Clean Architecture) | Baja (componentes simples) |
| Copy | Técnico y legal | Emocional y persuasivo |

---

## Conclusión

Para la branch `marketinero`, **menos es más**. El inversor no quiere ver:
- Cálculos de ISS, PIS, COFINS
- Arquitectura de software
- Regímenes fiscales
- Perfiles de riesgo

El inversor quiere ver:
- ✨ "Invertí R$ 100.000, tenés R$ 154.469 en 12 meses"
- 📊 Gráfico mostrando su plata creciendo
- 💰 Comparación brutal vs banco (que paga 6%)
- 🚀 Botón gigante: QUIERO INVERTIR

**Todo lo demás es ruido.**

---

**Preparado por**: Claude Code
**Fecha**: 2025-10-04
**Branch**: marketinero
