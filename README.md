# MESS-Learning

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

```bash
npm install @messai-io/mess-learning
```

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
  wastewaterVolume: 1000,  // m³/day
  currentTechnology: 'activated_sludge',
  proposedTechnology: 'mfc'
});

console.log(comparison.currentEmissions);   // kg CO2/year
console.log(comparison.proposedEmissions);  // kg CO2/year
console.log(comparison.reduction);          // %
console.log(comparison.equivalentTrees);    // Trees offset
```

### Life Cycle Assessment

```javascript
import { LCACalculator } from '@messai-io/mess-learning';

const lca = new LCACalculator();

// Full life cycle analysis
const results = lca.analyze({
  systemType: 'mfc',
  scale: 'pilot',
  lifetime: 10,  // years
  location: 'US'
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
  lifetime: 15
});

console.log(roi.paybackPeriod);      // years
console.log(roi.netPresentValue);    // $
console.log(roi.internalRateReturn); // %
```

### SDG Alignment

```javascript
import { SDGAlignment } from '@messai-io/mess-learning';

const sdg = new SDGAlignment();

// Map MES applications to UN SDGs
const alignment = sdg.analyze('wastewater_treatment_mfc');

console.log(alignment.primaryGoals);    // [6, 7, 13] (Water, Energy, Climate)
console.log(alignment.secondaryGoals);  // [9, 11, 12]
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

| Module | Description |
|--------|-------------|
| Fundamentals | Basic MES principles |
| Electrochemistry | Redox reactions, potentials |
| Microbiology | Electroactive bacteria |
| Applications | Real-world use cases |
| Economics | Cost-benefit analysis |
| Sustainability | Environmental impact |

## API Reference

See [API Documentation](docs/API.md) for complete reference.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This work is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## Links

- [MESSAI Platform](https://messai.io)
- [Documentation](https://docs.messai.io/learning)
- [Live Demo](https://learn.messai.io)
