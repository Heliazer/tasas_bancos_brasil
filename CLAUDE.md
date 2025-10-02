# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tasa Brasil** is a fintech project focused on building a factoring (fomento mercantil) system for the Brazilian market. The project aims to create an ERP/fintech platform that handles:

- Interest rate calculations and factoring discount rates
- Brazilian tax compliance (ISS, PIS, COFINS, IRPJ, CSLL, IOF)
- Credit risk management
- Payment and collection tracking
- Regulatory reporting for ANFAC and Brazilian authorities

The project is currently in early stages with research documentation completed and development planned in three phases:
1. Pitch and PDR (business requirements) - in progress
2. Prototype with VSCode - in progress
3. Firebase implementation - pending

## Brazilian Factoring Context

The system must comply with Brazilian factoring regulations:

- **Legal Framework**: Lei nº 9.430/96 defines factoring operations
- **No BACEN Authorization Required**: Factoring companies don't need Central Bank authorization (unlike financial institutions)
- **Tax Complexity**: Multiple taxes apply with specific calculation bases (ISS 2-5%, PIS/COFINS on gross revenue, IRPJ/CSLL on profits)
- **Market Size**: ~R$ 300 billion annually, serving 200,000+ companies
- **Key Difference**: Factoring involves purchase of credit rights + services, not just financing

## Key Architectural Requirements

When implementing this system, consider:

1. **Dynamic Rate Calculation Engine**: Must factor in operation term, credit risk, operation size, economic sector, and client history
2. **Multi-Tax Computation**: System must handle ISS (varies by municipality 2-5%), PIS/COFINS (federal), IRPJ/CSLL (income tax), and potentially IOF (financial operations tax)
3. **Credit Risk Integration**: Need scoring and provisioning systems
4. **Factoring Modalities**: Support both "with recourse" (lower rates, seller bears risk) and "without recourse" (higher rates, factor bears risk)
5. **Document Management**: Handle duplicatas (Brazilian credit documents) and other credit instruments
6. **Banking Integration**: Connect to Brazilian banking systems for settlements
7. **Regulatory Compliance**: Automatic reporting for ANFAC and government authorities

## Development Commands

As this is an early-stage project, specific build/test commands will be added as the technology stack is chosen. The plan indicates:
- Development environment: VSCode
- Planned backend: Firebase

## References

- Comprehensive factoring research: `docs/informe_genx_factoring.md`
- Project roadmap: `pasos_seguidos.md`
