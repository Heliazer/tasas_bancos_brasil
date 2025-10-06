# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tasa Brasil** is transitioning to a **marketing-first approach** for presenting a factoring investment opportunity to Brazilian investors. The new branch `marketinero` focuses on creating a compelling investor-facing platform that sells the investment opportunity rather than technical factoring specs.

### The Core Value Proposition

- Investors get **3.5-3.8% monthly returns** (42-56% annually) backed by real factoring operations
- Returns are **consistent and predictable** (unlike stocks/crypto)
- Operations backed by **real duplicatas** (Brazilian credit instruments)
- Historical mora rate **<1%**
- **30-60 day liquidity** cycles

### Branch Strategy

- **master**: Technical factoring simulator with full Clean Architecture implementation
- **marketinero** (current): Marketing-focused landing page and investor dashboard

## Development Commands

### Simulator (React + Vite + TypeScript + Tailwind)

Located in `simulador-factoring/`:

```bash
# Development server (accessible on network)
npm run dev

# Production build
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

The dev server runs on `http://0.0.0.0:5173` and preview on `http://0.0.0.0:4173`, making it accessible from other devices on the network.

## Marketing-First Architecture (Branch: marketinero)

### Primary Focus: Conversion Funnel

The application should prioritize these components in order:

1. **Interactive Calculator** - The hero feature that shows investment growth
2. **Comparison Table** - Brutal comparison vs Poupança, CDI, stocks
3. **Growth Visualization** - Animated charts showing money growing
4. **Social Proof** - Testimonials and real case studies
5. **Simple Dashboard** - Shows only 3 metrics: total capital, monthly earnings, current operations

### Key UI/UX Principles for This Branch

- **Simplicity Over Detail**: Investors want to see their money grow, not tax breakdowns
- **Emotion Over Logic**: Use animations, compelling numbers, and success stories
- **Mobile-First**: Most investors will check their returns on mobile daily
- **Instant Gratification**: Calculator results must update in real-time as user types

### What NOT to Show (Unless Asked)

- Complex tax calculations (ISS, PIS, COFINS details)
- Technical architecture details
- Detailed factoring operation mechanics
- Brazilian legal compliance specs

Save these for FAQ sections or "learn more" modals.

## Tech Stack (Current Implementation)

- **Frontend**: React 19.1.1 with TypeScript
- **Styling**: Tailwind CSS 4.1.14
- **Forms**: React Hook Form 7.63.0 with Zod validation
- **Build Tool**: Vite 7.1.7
- **Decimal Math**: Decimal.js 10.6.0 (for financial calculations)
- **Date Handling**: date-fns 4.1.0

## Key Features to Implement (Marketing Branch)

### Must Have (Priority 1)

1. **Landing Page with Interactive Calculator**
   - Slider for investment amount (R$ 10k - R$ 1M)
   - Time selector (1-5 years)
   - Toggle for auto-reinvestment
   - Real-time calculation showing final amount
   - Prominent "QUIERO INVERTIR" CTA

2. **Comparison Section**
   - Side-by-side: Poupança (6%) vs CDI (13%) vs Platform (3.8% monthly)
   - Show same R$ 100k investment over 12 months
   - Visual emphasis on the difference

3. **Investor Dashboard (Simplified)**
   - Hero metric: Total capital today
   - This month's earnings
   - Simple list of active operations (top 3-4)
   - No complex charts or technical details

### Nice to Have (Priority 2)

- Testimonials/case studies section
- Email capture with investment projection
- FAQ accordion
- Mobile app mockups

### Don't Implement (This Branch)

- Full tax calculation breakdowns
- Detailed factoring operation forms
- Credit risk assessment tools
- Regulatory compliance documentation UI
- Admin panels or backoffice features

## Current Domain Model (Keep for Calculations)

The existing Clean Architecture implementation in `simulador-factoring/src/` should be **preserved** for:

- Accurate return calculations
- Tax computations (used behind the scenes)
- Rate adjustments based on risk profiles

But the **presentation layer** should be completely redesigned for marketing.

### Calculation Flow (Simplified for Marketing)

```
User Input (Amount + Time)
    ↓
Domain: RateCalculation (3.5-3.8% monthly)
    ↓
Domain: Compound Interest Formula
    ↓
Domain: Tax Deductions (hidden from user)
    ↓
Present: Final Amount (BIG NUMBER)
Present: Gain vs Competition (COMPARISON)
```

## File Structure Guidance

```
simulador-factoring/
├── src/
│   ├── domain/              # Keep - handles calculations
│   ├── application/         # Keep - orchestrates logic
│   ├── presentation/        # REDESIGN - marketing focus
│   │   ├── components/
│   │   │   ├── Calculator.tsx          # NEW - Hero calculator
│   │   │   ├── ComparisonTable.tsx     # NEW - Brutal comparison
│   │   │   ├── DashboardSimple.tsx     # NEW - Simplified dashboard
│   │   │   └── GrowthChart.tsx         # NEW - Animated growth viz
│   └── utils/               # Keep - formatters, helpers
```

## Important Behavioral Notes

### For the Marketing Branch

1. **Always Show Net Returns**: Display what the investor actually receives after all taxes/fees
2. **Use Emotional Language**: "Tu dinero trabajando mientras vos dormís" not "Factoring operation simulation"
3. **Emphasize Consistency**: Show month-over-month growth, not volatility
4. **Mobile Responsive**: Every component must work perfectly on mobile
5. **Performance**: Calculator updates must be <100ms latency

### Calculation Accuracy

Even though we're hiding complexity, **calculations must remain precise**:
- Use Decimal.js for all money math
- Apply correct tax rates (even if not shown)
- Never round until final display
- Test with edge cases (small amounts, long periods)

## Key Business Rules (Hidden from User, Applied in Code)

- Monthly rate varies: 3.5-3.8% based on risk/volume
- All returns are NET of taxes (ISS, PIS, COFINS, IRPJ, CSLL)
- Minimum investment amounts may apply
- Liquidity cycles are 30-60 days (not instant)
- Compound interest applies when reinvesting

## Marketing Copy Guidelines

### Do Say:

- "3.8% mensual" or "56% anual"
- "Respaldado por facturas reales"
- "Retiros en 48 horas"
- "Más de X años operando"

### Don't Say:

- "Deságio calculation using compound interest formula"
- "ISS tax at 3% on gross revenue"
- "Clean Architecture implementation"
- "Regulatory compliance with Lei 9.430/96"

## Testing Priorities (Marketing Branch)

1. **Calculator Accuracy**: User inputs must produce correct final amounts
2. **Mobile Responsiveness**: Test on actual phones, not just browser resize
3. **Performance**: Calculator latency under load
4. **Conversion Tracking**: CTAs must work flawlessly
5. **Cross-browser**: Chrome, Safari, Firefox, Edge

## References

- Marketing strategy: [docs/modelo_marketinero.md](docs/modelo_marketinero.md)
- Technical architecture (master branch): [docs/architecture_simulador_factoring.md](docs/architecture_simulador_factoring.md)
- Factoring research: [docs/informe_genx_factoring.md](docs/informe_genx_factoring.md)

## Branch-Specific Instructions

When working on `marketinero` branch:

1. **Prioritize conversion over education** - Show results, hide complexity
2. **Design for daily engagement** - Dashboard should be addictive to check
3. **Optimize for mobile** - Most users will check returns on their phone
4. **Use animations sparingly but effectively** - Money growing should feel exciting
5. **Keep technical debt low** - This may become the main branch if conversion is high

---

**Last Updated**: 2025-10-04
**Branch**: marketinero
**Focus**: Marketing-first investor platform
