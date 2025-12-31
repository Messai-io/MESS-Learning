'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@messai/ui';

interface SustainabilityCalculatorProps {
  level: number;
}

interface CalculationInputs {
  flowRate: number;
  codConcentration: number;
  powerDensity: number;
  codRemoval: number;
  electricityRate: number;
  carbonFactor: number;
  conventionalEnergy: number;
}

export default function SustainabilityCalculator({ level }: SustainabilityCalculatorProps) {
  const [inputs, setInputs] = useState<CalculationInputs>({
    flowRate: 1000,
    codConcentration: 2000,
    powerDensity: 2.0,
    codRemoval: 85,
    electricityRate: 0.12,
    carbonFactor: 0.45,
    conventionalEnergy: 2.1,
  });

  const [scenario, setScenario] = useState<'optimistic' | 'realistic' | 'conservative'>(
    'realistic'
  );

  // Scenario-based adjustments
  const scenarioMultipliers = {
    optimistic: { power: 1.4, efficiency: 1.2, carbon: 1.3 },
    realistic: { power: 1.0, efficiency: 1.0, carbon: 1.0 },
    conservative: { power: 0.7, efficiency: 0.8, carbon: 0.8 },
  };

  const calculations = useMemo(() => {
    const multiplier = scenarioMultipliers[scenario];

    // Daily calculations
    const dailyVolume = inputs.flowRate; // m³/day
    const dailyEnergyGeneration = (dailyVolume * inputs.powerDensity * 24) / 1000; // kWh/day
    const dailyEnergyGenAdjusted = dailyEnergyGeneration * multiplier.power;

    // Environmental calculations
    const dailyCODRemoved =
      (dailyVolume * inputs.codConcentration * inputs.codRemoval * multiplier.efficiency) / 100000; // kg COD/day
    const dailyConventionalEnergy = dailyVolume * inputs.conventionalEnergy; // kWh/day conventional
    const dailyEnergySavings = dailyConventionalEnergy - Math.abs(dailyEnergyGenAdjusted); // kWh/day saved

    // Carbon calculations
    const dailyCarbonFromEnergy = dailyEnergyGenAdjusted * inputs.carbonFactor * multiplier.carbon; // kg CO₂/day from energy
    const dailyCarbonAvoidance = dailyConventionalEnergy * inputs.carbonFactor; // kg CO₂/day avoided
    const dailyNetCarbon = dailyCarbonAvoidance - Math.abs(dailyCarbonFromEnergy); // kg CO₂/day net benefit

    // Annual totals
    const annualEnergyGeneration = dailyEnergyGenAdjusted * 365; // kWh/year
    const annualCODRemoved = dailyCODRemoved * 365; // kg COD/year
    const annualEnergySavings = dailyEnergySavings * 365; // kWh/year
    const annualCarbonBenefit = dailyNetCarbon * 365; // kg CO₂/year
    const annualCarbonOffset = annualCarbonBenefit / 1000; // tons CO₂/year

    // Economic calculations
    const annualEnergyValue = annualEnergyGeneration * inputs.electricityRate; // $/year
    const carbonCreditValue =
      annualCarbonOffset *
      50 *
      (scenario === 'optimistic' ? 1.5 : scenario === 'conservative' ? 0.7 : 1.0); // $/year at $50/ton

    return {
      daily: {
        volume: dailyVolume,
        energyGeneration: dailyEnergyGenAdjusted,
        codRemoved: dailyCODRemoved,
        energySavings: dailyEnergySavings,
        carbonBenefit: dailyNetCarbon,
      },
      annual: {
        energyGeneration: annualEnergyGeneration,
        codRemoved: annualCODRemoved,
        energySavings: annualEnergySavings,
        carbonBenefit: annualCarbonBenefit,
        carbonOffset: annualCarbonOffset,
        energyValue: annualEnergyValue,
        carbonCreditValue: carbonCreditValue,
        totalValue: annualEnergyValue + carbonCreditValue,
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
          min: 100,
          max: 10000,
          step: 100,
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
      title: 'Environmental Parameters',
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
          key: 'carbonFactor' as const,
          label: 'Grid Carbon Factor',
          unit: 'kg CO₂/kWh',
          min: 0.1,
          max: 0.8,
          step: 0.01,
        },
        {
          key: 'conventionalEnergy' as const,
          label: 'Conventional Energy',
          unit: 'kWh/m³',
          min: 1.0,
          max: 3.0,
          step: 0.1,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Scenario selector */}
      <Card className="p-4 border-2 border-amber-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-serif font-bold text-amber-900">
            Sustainability Impact Calculator
          </h3>

          <div className="flex gap-2">
            {(['optimistic', 'realistic', 'conservative'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScenario(s)}
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
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-amber-900">Environmental Impact Results</h4>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 border border-green-200">
                <div className="text-lg font-bold text-green-800">
                  {calculations.annual.carbonOffset.toFixed(1)} tons
                </div>
                <div className="text-xs text-green-600">CO₂ Offset/year</div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200">
                <div className="text-lg font-bold text-blue-800">
                  {calculations.annual.energySavings.toFixed(0)} kWh
                </div>
                <div className="text-xs text-blue-600">Energy Savings/year</div>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200">
                <div className="text-lg font-bold text-purple-800">
                  {calculations.annual.codRemoved.toFixed(0)} kg
                </div>
                <div className="text-xs text-purple-600">COD Removed/year</div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200">
                <div className="text-lg font-bold text-yellow-800">
                  ${calculations.annual.totalValue.toFixed(0)}
                </div>
                <div className="text-xs text-yellow-600">Annual Value</div>
              </div>
            </div>

            {/* Environmental benefits breakdown */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-amber-900">Daily Environmental Impact</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-amber-700">Energy Generation:</span>
                  <span className="font-medium text-green-600">
                    +{calculations.daily.energyGeneration.toFixed(1)} kWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">COD Removed:</span>
                  <span className="font-medium text-blue-600">
                    {calculations.daily.codRemoved.toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Energy Savings:</span>
                  <span className="font-medium text-green-600">
                    {calculations.daily.energySavings.toFixed(1)} kWh
                  </span>
                </div>
                <div className="flex justify-between border-t border-amber-200 pt-1">
                  <span className="text-amber-900 font-bold">Net Carbon Benefit:</span>
                  <span className="font-bold text-green-600">
                    {calculations.daily.carbonBenefit.toFixed(1)} kg CO₂
                  </span>
                </div>
              </div>
            </div>

            {level > 1 && (
              <div className="space-y-3">
                <h5 className="text-sm font-bold text-amber-900">Economic Value</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-amber-700">Energy Value:</span>
                    <span className="font-medium">
                      ${calculations.annual.energyValue.toFixed(0)}/year
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Carbon Credits:</span>
                    <span className="font-medium">
                      ${calculations.annual.carbonCreditValue.toFixed(0)}/year
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Scenario Impact:</span>
                    <span className="font-medium">
                      {scenario === 'optimistic'
                        ? '+40% performance'
                        : scenario === 'conservative'
                        ? '-30% performance'
                        : 'baseline'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Impact visualization */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200">
          <h4 className="text-sm font-bold text-amber-900 mb-3">Annual Environmental Equivalent</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white">
              <div className="text-2xl mb-1">🌳</div>
              <div className="text-sm font-bold text-green-800">
                {Math.round(calculations.annual.carbonOffset * 48)} trees
              </div>
              <div className="text-xs text-green-600">Carbon absorption equivalent</div>
            </div>
            <div className="p-3 bg-white">
              <div className="text-2xl mb-1">🚗</div>
              <div className="text-sm font-bold text-blue-800">
                {Math.round(calculations.annual.carbonOffset * 2174)} miles
              </div>
              <div className="text-xs text-blue-600">Car emissions avoided</div>
            </div>
            <div className="p-3 bg-white">
              <div className="text-2xl mb-1">🏠</div>
              <div className="text-sm font-bold text-purple-800">
                {Math.round(calculations.annual.energySavings / 10950)} homes
              </div>
              <div className="text-xs text-purple-600">Annual energy for homes</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
