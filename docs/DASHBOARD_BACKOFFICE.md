# Dashboard Backoffice - Tasa Brasil

## Descripción

Dashboard administrativo para análisis detallado de operaciones de factoring desde la perspectiva de la financiera.

## Características Implementadas

### 1. Detalle de Operación Individual

Muestra el desglose completo de una operación de factoring:

- **Información de la Duplicata**: Valor nominal, plazo, sacado
- **Cálculo de Tasa**: Desglose paso a paso de cómo se calcula la tasa final
- **Deságio**: Ganancia bruta de la operación
- **Impuestos Detallados**: ISS, PIS, COFINS, IRPJ, CSLL
- **Resultado Financiero**:
  - Capital adelantado al cliente
  - Ganancia neta de la financiera
  - ROI sobre capital invertido
  - Retorno neto mensual

### 2. Proyección a 24 Meses (Forecast)

Proyecta el crecimiento del capital con las siguientes features:

- **Toggle de Reinversión**: Opción de reinvertir ganancias automáticamente
- **Tabla Mes a Mes**: Muestra capital, operaciones, ganancias, impuestos y capital acumulado
- **Resumen Consolidado**:
  - Capital final proyectado
  - Ganancia bruta acumulada
  - Impuestos pagados totales
  - Ganancia neta acumulada
  - ROI anual promedio
- **Gráfico de Evolución**: Visualización del crecimiento del capital
- **Selector de Período**: Visualizar 6, 12 o 24 meses

## Rutas

- `/` - Landing page (marketing)
- `/backoffice` - Dashboard backoffice (análisis financiero)

## Uso

1. Accede a `http://localhost:5173/backoffice` (o `http://77.93.152.231:5173/backoffice` en producción)
2. Ingresa el monto de inversión del cliente
3. Haz clic en "Simular" para ver el análisis completo
4. Navega entre las pestañas "Detalle de Operación" y "Proyección 24 Meses"

## Cálculos

### Perspectiva de la Financiera

```
Capital Invertido = Valor líquido que adelantamos al cliente
Deságio Bruto = Valor nominal × Tasa de deságio
Impuestos = ISS + PIS + COFINS + IRPJ + CSLL
Ganancia Neta = Deságio Bruto - Impuestos
ROI = (Ganancia Neta / Capital Invertido) × 100
```

### Impuestos (sobre el Deságio)

- **ISS**: 3% (varía según municipio)
- **PIS**: 0.65% (Lucro Presumido) / 1.65% (Lucro Real)
- **COFINS**: 3% (Lucro Presumido) / 7.6% (Lucro Real)
- **IRPJ**: 15% sobre lucro presumido (32% del deságio)
- **CSLL**: 9% sobre lucro presumido (32% del deságio)

### Proyección 24 Meses

- **Operaciones por mes**: 2 (cada operación 60 días)
- **Ganancia mensual**: Capital × Tasa neta × Operaciones
- **Con reinversión**: Capital crece cada mes
- **Sin reinversión**: Capital se mantiene constante

## Componentes Creados

```
simulador-factoring/src/
├── presentation/
│   ├── components/
│   │   └── organisms/
│   │       ├── BackofficeOperationDetail.tsx  # Detalle de operación
│   │       └── ForecastProjection.tsx         # Proyección 24 meses
│   └── pages/
│       └── BackofficeDashboard.tsx            # Página principal
```

## Tecnologías

- React 19
- TypeScript
- Tailwind CSS
- React Router DOM
- Domain model existente (Clean Architecture)

## Próximas Mejoras

1. Exportar forecast a Excel/PDF
2. Comparar múltiples escenarios
3. Gráficos más avanzados (Chart.js o Recharts)
4. Filtros por tipo de operación
5. Histórico de operaciones reales
6. Dashboard con métricas agregadas

---

**Fecha de Implementación**: 2025-10-05
**Branch**: marketinero
