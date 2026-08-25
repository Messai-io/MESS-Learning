# MESS-Learning

<!-- MIRROR_DISCLOSURE_START -->

> **This repository is a downstream mirror.** Source of truth lives in the
> `messai-ai` monorepo; this mirror is updated on each release. Issues and
> Discussions are welcome here. PRs against this mirror will be redirected — see
> [CONTRIBUTING.md](./CONTRIBUTING.md).
>
> History was reset as part of the 2026 monorepo consolidation. Versions tagged
> before that (e.g. `v0.2.0`) remain accessible as historical refs.

<!-- MIRROR_DISCLOSURE_END -->

**Educational content and calculators for Microbial Electrochemical Systems**

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

## Overview

MESS-Learning provides educational tools and interactive visualizations for MES:

- **Interactive Electron Flow** - Animated MFC visualization
- **Sustainability Calculator** - Carbon footprint & LCA tools
- **Economic Calculator** - ROI and cost analysis
- **MES Type Comparisons** - System type visualizations
- **SDG Alignment** - UN Sustainable Development Goals mapping

## Installation

> **Not yet published to npm.** This package is source-available here while its
> public API stabilises. Use it by cloning the mirror:

```bash
git clone https://github.com/Messai-io/MESS-Learning.git
cd MESS-Learning && pnpm install && pnpm build
```

Track [the packaging issue](https://github.com/Messai-io/MESS-Learning/issues)
for the npm release.

## Features

### Interactive Electron Flow Visualization

```jsx
import { InteractiveElectronFlow } from '@messai-io/mess-learning';

function MFCEducation() {
  return (
    <InteractiveElectronFlow
      systemType="dual-chamber-mfc"
      showLabels={true}
      animationSpeed={1}
      interactiveMode={true}
    />
  );
}
```

### Sustainability Calculator

```javascript
import { SustainabilityCalculator } from '@messai-io/mess-learning';

const calc = new SustainabilityCalculator();

// Calculate carbon footprint comparison
const comparison = calc.carbonFootprint({
  wastewaterVolume: 1000, // m³/day
  currentTechnology: 'activated_sludge',
  proposedTechnology: 'mfc',
});

console.log(comparison.currentEmissions); // kg CO2/year
console.log(comparison.proposedEmissions); // kg CO2/year
console.log(comparison.reduction); // %
console.log(comparison.equivalentTrees); // Trees offset
```

### Life Cycle Assessment

```javascript
import { LCACalculator } from '@messai-io/mess-learning';

const lca = new LCACalculator();

// Full life cycle analysis
const results = lca.analyze({
  systemType: 'mfc',
  scale: 'pilot',
  lifetime: 10, // years
  location: 'US',
});

console.log(results.environmentalImpact);
console.log(results.energyBalance);
console.log(results.materialRequirements);
```

### Economic Analysis

```javascript
import { EconomicCalculator } from '@messai-io/mess-learning';

const econ = new EconomicCalculator();

// Calculate ROI for MFC wastewater treatment
const roi = econ.calculateROI({
  capitalCost: 50000,
  operationalCostPerYear: 5000,
  energyRecoveryPerYear: 8000,
  wastewaterSavingsPerYear: 12000,
  lifetime: 15,
});

console.log(roi.paybackPeriod); // years
console.log(roi.netPresentValue); // $
console.log(roi.internalRateReturn); // %
```

### SDG Alignment

```javascript
import { SDGAlignment } from '@messai-io/mess-learning';

const sdg = new SDGAlignment();

// Map MES applications to UN SDGs
const alignment = sdg.analyze('wastewater_treatment_mfc');

console.log(alignment.primaryGoals); // [6, 7, 13] (Water, Energy, Climate)
console.log(alignment.secondaryGoals); // [9, 11, 12]
console.log(alignment.impactMetrics);
```

### System Type Comparisons

```jsx
import { MESTypeComparison } from '@messai-io/mess-learning';

function TypesPage() {
  return (
    <MESTypeComparison
      types={['MFC', 'MEC', 'MDC', 'MES']}
      comparisonMetrics={['efficiency', 'cost', 'application']}
    />
  );
}
```

## Educational Modules

| Module           | Description                 |
| ---------------- | --------------------------- |
| Fundamentals     | Basic MES principles        |
| Electrochemistry | Redox reactions, potentials |
| Microbiology     | Electroactive bacteria      |
| Applications     | Real-world use cases        |
| Economics        | Cost-benefit analysis       |
| Sustainability   | Environmental impact        |

## Calculator assumptions and citation guidance

> **Read this before citing any number from these calculators.** The calculators
> in [`src/calculators/`](./src/calculators/) are **React presentation
> components** (default exports taking a `level` prop), not calculation classes
> with an analysis API. They are **educational / illustrative**: several impact
> numbers are hardcoded default values chosen to demonstrate the shape of an
> analysis, not measured or literature-sourced figures. Treat outputs as
> teaching aids, not as a validated LCA/TEA. The `code` is the source of truth
> for every constant below.

### Life Cycle Assessment (`LifeCycleAssessment.tsx`)

Key assumptions encoded in the component's "Advanced LCA Insights" panel:

- **System lifetime: 15 years**
- **Capacity: 1000 m³/day**
- **Electricity grid: "Regional mix"** (no specific grid-emission factor is
  applied — the grid is named as a qualitative assumption only)
- **Discount rate: 3% annually** (stated in the panel)
- Stated sensitivity bands: lifetime ±5 yr → ±15% impact; performance ±20% →
  ±18%; grid carbon → ±25%; material costs → ±8%.

The per-phase and per-technology carbon / energy / water impact values (e.g. MES
operation phase carbon `−12.3`, energy `−156.7`) are **hardcoded illustrative
arrays** in the component, compared against Activated Sludge, Membrane
Bioreactor, and Anaerobic Digestion. They are not derived from an inventory
database.

### Economic Calculator (`EconomicCalculator.tsx`)

This calculator does compute from inputs. Default inputs and encoded
assumptions:

- **Default inputs:** flow rate 1000 m³/day, COD 2000 mg/L, electricity rate
  **$0.12/kWh**, power density 2.5 (W/m² basis), COD removal 85%, operating cost
  **$0.15/m³/day**, capital cost **$800/m³ capacity**, conventional treatment
  cost **$0.45/m³**.
- **Scenario multipliers** (applied to power / cost / removal): optimistic
  `1.3 / 0.8 / 1.1`, realistic `1.0 / 1.0 / 1.0`, conservative
  `0.7 / 1.2 / 0.9`.
- **COD removal is capped at 95%** after the scenario multiplier.
- **Carbon offset factor: 1.5 kg CO₂-eq per kg COD removed** (labelled
  "Approximate" in the code).
- **NPV uses a 10-year horizon at an 8% discount rate** (`Math.pow(1.08, i)`).
  Payback period = total capital cost ÷ annual net benefit.

> **Internal inconsistency to be aware of:** the Economic Calculator's NPV uses
> an **8%** discount rate while the LCA panel states **3%**. If you quote both,
> reconcile the rate first.

### Carbon Footprint Comparison (`CarbonFootprintComparison.tsx`)

Encoded per-m³ assumptions (from the component's assumptions panel):

- Construction: material impacts **12 kg CO₂/m³ capacity**, transportation **2
  kg CO₂/m³**, installation **3 kg CO₂/m³**.
- Operational benefits: avoided electricity **−8 kg CO₂/m³/year**, reduced
  chemicals **−4 kg CO₂/m³/year**, sludge reduction **−3 kg CO₂/m³/year**.
- Comparison bars use hardcoded `kg CO₂ eq/m³` values per technology.

### Citation guidance

- **Do not cite these calculator outputs as measured results.** They are
  parameterised illustrations with the constants listed above baked in.
- For a real techno-economic or life-cycle claim, replace the hardcoded impact
  arrays and cost/emission constants with values from a sourced inventory (e.g.
  ecoinvent, a regional grid-emission factor, and site-specific
  capital/operating costs) and document those sources.
- If you reuse this package's educational figures, attribute per its
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license and make
  clear they are illustrative defaults, not primary data.

## API Reference

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This work is licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## Links

- [MESSAI Platform](https://messai.io)
- [Documentation](https://docs.messai.io/learning)
- [Live Demo](https://learn.messai.io)
