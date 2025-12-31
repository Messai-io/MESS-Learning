'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@messai/ui';

interface EconomicCalculatorProps {
  level: number;
}

interface CalculationInputs {
  flowRate: number; // m³/day
  codConcentration: number; // mg/L
  electricityRate: number; // $/kWh
  powerDensity: number; // W/m³
  codRemoval: number; // %
  operatingCost: number; // $/m³/day
  capitalCost: number; // $/m³ capacity
  conventionalCost: number; // $/m³ treatment
}

export default function EconomicCalculator({ level }: EconomicCalculatorProps) {
  const [inputs, setInputs] = useState<CalculationInputs>({
    flowRate: 1000,
    codConcentration: 2000,
    electricityRate: 0.12,
    powerDensity: 2.5,
    codRemoval: 85,
    operatingCost: 0.15,
    capitalCost: 800,
    conventionalCost: 0.45,
  });

  const [scenario, setScenario] = useState<'optimistic' | 'realistic' | 'conservative'>(
    'realistic'
  );

  // Scenario-based adjustments
  const scenarioMultipliers = {
    optimistic: { power: 1.3, cost: 0.8, removal: 1.1 },
    realistic: { power: 1.0, cost: 1.0, removal: 1.0 },
    conservative: { power: 0.7, cost: 1.2, removal: 0.9 },
  };

  const calculations = useMemo(() => {
    const multiplier = scenarioMultipliers[scenario];

    // Adjusted values based on scenario
    const adjPowerDensity = inputs.powerDensity * multiplier.power;
    const adjOperatingCost = inputs.operatingCost * multiplier.cost;
    const adjCodRemoval = Math.min(95, inputs.codRemoval * multiplier.removal);

    // Daily calculations
    const dailyVolume = inputs.flowRate; // m³/day
    const dailyPowerGeneration = (dailyVolume * adjPowerDensity * 24) / 1000; // kWh/day
    const dailyEnergyRevenue = dailyPowerGeneration * inputs.electricityRate; // $/day
    const dailyOperatingCost = dailyVolume * adjOperatingCost; // $/day
    const dailyTreatmentSavings = dailyVolume * (inputs.conventionalCost - adjOperatingCost); // $/day
    const dailyNetBenefit = dailyEnergyRevenue + dailyTreatmentSavings; // $/day

    // Annual calculations
    const annualNetBenefit = dailyNetBenefit * 365; // $/year
    const totalCapitalCost = inputs.flowRate * inputs.capitalCost; // $
    const paybackPeriod = totalCapitalCost / annualNetBenefit; // years

    // Environmental calculations
    const annualCodRemoved =
      (((dailyVolume * inputs.codConcentration * adjCodRemoval) / 100) * 365) / 1000; // kg COD/year
    const carbonOffsetKg = annualCodRemoved * 1.5; // Approximate CO2 equivalent
    const carbonOffsetTons = carbonOffsetKg / 1000;

    // Economic metrics
    const roi = (annualNetBenefit / totalCapitalCost) * 100; // %
    const npv10 =
      Array.from({ length: 10 }, (_, i) => annualNetBenefit / Math.pow(1.08, i + 1)).reduce(
        (a, b) => a + b,
        0
      ) - totalCapitalCost;

    return {
      daily: {
        volume: dailyVolume,
        powerGeneration: dailyPowerGeneration,
        energyRevenue: dailyEnergyRevenue,
        operatingCost: dailyOperatingCost,
        treatmentSavings: dailyTreatmentSavings,
        netBenefit: dailyNetBenefit,
      },
      annual: {
        netBenefit: annualNetBenefit,
        codRemoved: annualCodRemoved,
        carbonOffset: carbonOffsetTons,
      },
      economics: {
        capitalCost: totalCapitalCost,
        paybackPeriod,
        roi,
        npv10,
      },
      performance: {
        adjustedPowerDensity: adjPowerDensity,
        adjustedCodRemoval: adjCodRemoval,
      },
    };
  }, [inputs, scenario]);

  const handleInputChange = (field: keyof CalculationInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const inputGroups = [
    {
      title: 'System Parameters',
      inputs: [
        {
          key: 'flowRate' as const,
          label: 'Flow Rate',
          unit: 'm³/day',
          min: 10,
          max: 10000,
          step: 10,
        },
        {
          key: 'codConcentration' as const,
          label: 'COD Concentration',
          unit: 'mg/L',
          min: 500,
          max: 5000,
          step: 100,
        },
        {
          key: 'powerDensity' as const,
          label: 'Power Density',
          unit: 'W/m³',
          min: 0.5,
          max: 5,
          step: 0.1,
        },
        { key: 'codRemoval' as const, label: 'COD Removal', unit: '%', min: 60, max: 95, step: 1 },
      ],
    },
    {
      title: 'Economic Parameters',
      inputs: [
        {
          key: 'electricityRate' as const,
          label: 'Electricity Rate',
          unit: '$/kWh',
          min: 0.05,
          max: 0.3,
          step: 0.01,
        },
        {
          key: 'operatingCost' as const,
          label: 'Operating Cost',
          unit: '$/m³/day',
          min: 0.05,
          max: 0.5,
          step: 0.01,
        },
        {
          key: 'capitalCost' as const,
          label: 'Capital Cost',
          unit: '$/m³ capacity',
          min: 400,
          max: 2000,
          step: 50,
        },
        {
          key: 'conventionalCost' as const,
          label: 'Conventional Treatment',
          unit: '$/m³',
          min: 0.2,
          max: 1.0,
          step: 0.05,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Scenario selector */}
      <Card className="p-4 border-2 border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif font-bold text-amber-900">
            Economic Analysis Calculator
          </h3>
          <div className="flex gap-2">
            {['optimistic', 'realistic', 'conservative'].map((s) => (
              <button
                key={s}
                onClick={() => setScenario(s as any)}
                className={`px-3 py-1 text-xs transition-all ${
                  scenario === s
                    ? 'bg-amber-900 text-amber-50'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input parameters */}
          <div className="space-y-4">
            {inputGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h4 className="text-sm font-bold text-amber-900 mb-3">{group.title}</h4>
                <div className="space-y-3">
                  {group.inputs.map((input) => (
                    <div key={input.key} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-amber-800">{input.label}</label>
                        <span className="text-xs text-amber-600">
                          {inputs[input.key]} {input.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={input.min}
                        max={input.max}
                        step={input.step}
                        value={inputs[input.key]}
                        onChange={(e) => handleInputChange(input.key, parseFloat(e.target.value))}
                        className="w-full h-2 bg-amber-200 appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-amber-600">
                        <span>{input.min}</span>
                        <span>{input.max}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-amber-900">Financial Analysis Results</h4>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 border border-green-200">
                <div className="text-lg font-bold text-green-800">
                  ${calculations.annual.netBenefit.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">Annual Net Benefit</div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200">
                <div className="text-lg font-bold text-blue-800">
                  {calculations.economics.paybackPeriod.toFixed(1)} years
                </div>
                <div className="text-xs text-blue-600">Payback Period</div>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200">
                <div className="text-lg font-bold text-purple-800">
                  {calculations.economics.roi.toFixed(1)}%
                </div>
                <div className="text-xs text-purple-600">Annual ROI</div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200">
                <div className="text-lg font-bold text-yellow-800">
                  {calculations.annual.carbonOffset.toFixed(1)} tons
                </div>
                <div className="text-xs text-yellow-600">CO₂ Offset/year</div>
              </div>
            </div>

            {/* Detailed breakdown */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-amber-900">Daily Operations</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-amber-700">Power Generation:</span>
                  <span className="font-medium">
                    {calculations.daily.powerGeneration.toFixed(1)} kWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Energy Revenue:</span>
                  <span className="font-medium text-green-600">
                    +${calculations.daily.energyRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Treatment Savings:</span>
                  <span className="font-medium text-green-600">
                    +${calculations.daily.treatmentSavings.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Operating Cost:</span>
                  <span className="font-medium text-red-600">
                    -${calculations.daily.operatingCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-amber-200 pt-1">
                  <span className="text-amber-900 font-bold">Net Daily Benefit:</span>
                  <span className="font-bold text-amber-900">
                    ${calculations.daily.netBenefit.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {level > 1 && (
              <div className="space-y-3">
                <h5 className="text-sm font-bold text-amber-900">Advanced Metrics</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-amber-700">Capital Cost:</span>
                    <span className="font-medium">
                      ${calculations.economics.capitalCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">NPV (10 years, 8%):</span>
                    <span className="font-medium">
                      ${calculations.economics.npv10.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">COD Removed:</span>
                    <span className="font-medium">
                      {calculations.annual.codRemoved.toFixed(0)} kg/year
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Adjusted Power:</span>
                    <span className="font-medium">
                      {calculations.performance.adjustedPowerDensity.toFixed(1)} W/m³
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scenario impact indicator */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200">
          <div className="text-xs text-amber-800">
            <strong>Scenario Impact:</strong> {scenario} assumptions adjust performance by{' '}
            {scenario === 'optimistic'
              ? '+30% power, -20% costs'
              : scenario === 'conservative'
              ? '-30% power, +20% costs'
              : 'baseline values'}
          </div>
        </div>
      </Card>

      {/* Sensitivity analysis visualization */}
      <Card className="p-4 border-2 border-amber-200">
        <h3 className="text-lg font-serif font-bold text-amber-900 mb-4">Sensitivity Analysis</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              param: 'Power Density',
              impact: 'High',
              description: '±50% affects payback by ±3 years',
            },
            {
              param: 'Electricity Rate',
              impact: 'Medium',
              description: '±50% affects payback by ±1.5 years',
            },
            {
              param: 'Capital Cost',
              impact: 'High',
              description: '±50% affects payback by ±4 years',
            },
            { param: 'Flow Rate', impact: 'Low', description: 'Linear scaling with volume' },
            {
              param: 'COD Concentration',
              impact: 'Medium',
              description: 'Higher COD improves economics',
            },
            {
              param: 'Operating Cost',
              impact: 'Medium',
              description: '±50% affects payback by ±2 years',
            },
          ].map((item, index) => (
            <div key={index} className="p-3 bg-white border border-amber-200">
              <div className="text-sm font-medium text-amber-900 mb-1">{item.param}</div>
              <div
                className={`text-xs px-2 py-1 mb-2 ${
                  item.impact === 'High'
                    ? 'bg-red-100 text-red-800'
                    : item.impact === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {item.impact} Impact
              </div>
              <div className="text-xs text-amber-700">{item.description}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
