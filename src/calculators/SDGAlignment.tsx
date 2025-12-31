'use client';

import { useState } from 'react';
import { Card } from '@messai/ui';

interface SDGAlignmentProps {
  level: number;
}

interface SDGGoal {
  number: number;
  title: string;
  shortTitle: string;
  color: string;
  contribution: 'high' | 'medium' | 'low';
  description: string;
  mesImpacts: string[];
  quantifiableMetrics: {
    metric: string;
    value: string;
    description: string;
  }[];
  targetAlignment: string[];
}

const sdgGoals: SDGGoal[] = [
  {
    number: 6,
    title: 'Clean Water and Sanitation',
    shortTitle: 'Clean Water',
    color: '#26bde2',
    contribution: 'high',
    description: 'Ensure availability and sustainable management of water and sanitation for all',
    mesImpacts: [
      'Advanced wastewater treatment with 85-95% contaminant removal',
      'Real-time water quality monitoring through biosensors',
      'Decentralized treatment systems for underserved communities',
      'Resource recovery from wastewater streams',
    ],
    quantifiableMetrics: [
      {
        metric: 'Water Treatment Capacity',
        value: '1000+ m³/day',
        description: 'per MES facility',
      },
      {
        metric: 'Contaminant Removal',
        value: '85-95%',
        description: 'COD, BOD, nitrogen compounds',
      },
      {
        metric: 'Energy Recovery',
        value: '0.5-2.5 kWh/m³',
        description: 'energy positive treatment',
      },
    ],
    targetAlignment: ['6.1', '6.2', '6.3', '6.4', '6.a'],
  },
  {
    number: 7,
    title: 'Affordable and Clean Energy',
    shortTitle: 'Clean Energy',
    color: '#fcc30b',
    contribution: 'high',
    description: 'Ensure access to affordable, reliable, sustainable and modern energy for all',
    mesImpacts: [
      'Renewable electricity generation from organic waste',
      'Grid-independent power systems for remote areas',
      'Reduced dependency on fossil fuels',
      'Energy storage through hydrogen production',
    ],
    quantifiableMetrics: [
      {
        metric: 'Power Generation',
        value: '0.1-10 W/m²',
        description: 'continuous renewable power',
      },
      { metric: 'Hydrogen Production', value: '85-95%', description: 'efficiency in MECs' },
      { metric: 'Grid Independence', value: '24/7', description: 'continuous operation' },
    ],
    targetAlignment: ['7.1', '7.2', '7.3', '7.a', '7.b'],
  },
  {
    number: 9,
    title: 'Industry, Innovation and Infrastructure',
    shortTitle: 'Innovation',
    color: '#fd6925',
    contribution: 'medium',
    description:
      'Build resilient infrastructure, promote inclusive and sustainable industrialization',
    mesImpacts: [
      'Cutting-edge bioelectrochemical technology development',
      'Sustainable industrial process integration',
      'Green technology transfer to developing nations',
      'Innovation in materials science and biotechnology',
    ],
    quantifiableMetrics: [
      { metric: 'R&D Investment', value: '$2.1B', description: 'global annual investment' },
      { metric: 'Patent Growth', value: '23%/year', description: 'technology advancement rate' },
      {
        metric: 'Technology Transfer',
        value: '45 countries',
        description: 'with active MES research',
      },
    ],
    targetAlignment: ['9.1', '9.4', '9.5', '9.a', '9.c'],
  },
  {
    number: 11,
    title: 'Sustainable Cities and Communities',
    shortTitle: 'Sustainable Cities',
    color: '#fd9d24',
    contribution: 'high',
    description: 'Make cities and human settlements inclusive, safe, resilient and sustainable',
    mesImpacts: [
      'Urban wastewater management systems',
      'Distributed energy generation networks',
      'Reduced urban pollution and emissions',
      'Smart city integration with IoT sensors',
    ],
    quantifiableMetrics: [
      { metric: 'Urban Coverage', value: '125 cities', description: 'with MES installations' },
      { metric: 'Pollution Reduction', value: '40-60%', description: 'in treated water bodies' },
      { metric: 'Energy Self-sufficiency', value: '15-25%', description: 'of municipal needs' },
    ],
    targetAlignment: ['11.1', '11.6', '11.a', '11.b', '11.c'],
  },
  {
    number: 12,
    title: 'Responsible Consumption and Production',
    shortTitle: 'Responsible Consumption',
    color: '#cf8d2a',
    contribution: 'high',
    description: 'Ensure sustainable consumption and production patterns',
    mesImpacts: [
      'Circular economy through waste-to-energy conversion',
      'Resource recovery from industrial waste streams',
      'Reduced chemical usage in treatment processes',
      'Sustainable materials in system construction',
    ],
    quantifiableMetrics: [
      { metric: 'Waste Conversion', value: '78-92%', description: 'organic waste to energy' },
      { metric: 'Chemical Reduction', value: '65-80%', description: 'vs conventional treatment' },
      { metric: 'Material Recovery', value: '45-70%', description: 'nutrients and materials' },
    ],
    targetAlignment: ['12.2', '12.4', '12.5', '12.6', '12.a'],
  },
  {
    number: 13,
    title: 'Climate Action',
    shortTitle: 'Climate Action',
    color: '#3f7e44',
    contribution: 'high',
    description: 'Take urgent action to combat climate change and its impacts',
    mesImpacts: [
      'Direct CO₂ emission reduction through clean energy',
      'Methane capture and conversion to useful products',
      'Carbon sequestration in biofilm matrices',
      'Reduced transportation emissions through local treatment',
    ],
    quantifiableMetrics: [
      { metric: 'CO₂ Reduction', value: '0.8-2.3 kg/m³', description: 'net carbon benefit' },
      { metric: 'Methane Mitigation', value: '85-95%', description: 'capture efficiency' },
      { metric: 'Global Impact', value: '50k tons/year', description: 'current CO₂ offset' },
    ],
    targetAlignment: ['13.1', '13.2', '13.3', '13.a', '13.b'],
  },
  {
    number: 14,
    title: 'Life Below Water',
    shortTitle: 'Marine Life',
    color: '#0a97d9',
    contribution: 'medium',
    description: 'Conserve and sustainably use the oceans, seas and marine resources',
    mesImpacts: [
      'Prevention of marine pollution through improved treatment',
      'Marine sediment MFCs for underwater applications',
      'Reduced pharmaceutical and chemical discharge',
      'Protection of aquatic ecosystems',
    ],
    quantifiableMetrics: [
      { metric: 'Marine Protection', value: '95%', description: 'pollutant removal efficiency' },
      {
        metric: 'Coastal Applications',
        value: '28 installations',
        description: 'marine-based MES systems',
      },
      { metric: 'Ecosystem Recovery', value: '65-85%', description: 'biodiversity improvement' },
    ],
    targetAlignment: ['14.1', '14.2', '14.3', '14.4', '14.a'],
  },
  {
    number: 15,
    title: 'Life on Land',
    shortTitle: 'Terrestrial Life',
    color: '#56c02b',
    contribution: 'medium',
    description: 'Protect, restore and promote sustainable use of terrestrial ecosystems',
    mesImpacts: [
      'Reduced land contamination from wastewater discharge',
      'Soil health improvement through treated water irrigation',
      'Biodiversity protection in treatment facility areas',
      'Reduced landfill waste through resource recovery',
    ],
    quantifiableMetrics: [
      { metric: 'Soil Protection', value: '90%', description: 'reduction in harmful discharge' },
      {
        metric: 'Land Use Efficiency',
        value: '60%',
        description: 'smaller footprint vs conventional',
      },
      { metric: 'Biodiversity Index', value: '+25%', description: 'improvement in facility areas' },
    ],
    targetAlignment: ['15.1', '15.3', '15.4', '15.5', '15.9'],
  },
];

export default function SDGAlignment({ level }: SDGAlignmentProps) {
  const [selectedSDG, setSelectedSDG] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'impact' | 'metrics'>('grid');

  const selectedGoal = sdgGoals.find((goal) => goal.number === selectedSDG);

  const getContributionColor = (contribution: 'high' | 'medium' | 'low') => {
    switch (contribution) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getContributionScore = (contribution: 'high' | 'medium' | 'low') => {
    switch (contribution) {
      case 'high':
        return 85;
      case 'medium':
        return 60;
      case 'low':
        return 35;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and view controls */}
      <Card className="p-4 border-2 border-amber-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-amber-900">
              UN Sustainable Development Goals Alignment
            </h3>
            <p className="text-sm text-amber-700 opacity-70">
              How MES technology contributes to global sustainability targets
            </p>
          </div>

          <div className="flex gap-2">
            {(['grid', 'impact', 'metrics'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs transition-all ${
                  viewMode === mode
                    ? 'bg-amber-900 text-amber-50'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overall impact summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 border border-green-200">
            <div className="text-lg font-bold text-green-800">8</div>
            <div className="text-xs text-green-600">SDGs Addressed</div>
          </div>
          <div className="text-center p-3 bg-blue-50 border border-blue-200">
            <div className="text-lg font-bold text-blue-800">5</div>
            <div className="text-xs text-blue-600">High Impact Goals</div>
          </div>
          <div className="text-center p-3 bg-purple-50 border border-purple-200">
            <div className="text-lg font-bold text-purple-800">32</div>
            <div className="text-xs text-purple-600">Specific Targets</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 border border-yellow-200">
            <div className="text-lg font-bold text-yellow-800">78%</div>
            <div className="text-xs text-yellow-600">Average Alignment</div>
          </div>
        </div>
      </Card>

      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sdgGoals.map((goal) => (
            <button
              key={goal.number}
              onClick={() => setSelectedSDG(selectedSDG === goal.number ? null : goal.number)}
              className={`p-4 border-2 transition-all text-left ${
                selectedSDG === goal.number
                  ? 'border-amber-400 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-amber-300 hover:shadow-md'
              }`}
              style={{ backgroundColor: `${goal.color}15` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className="w-12 h-12 flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: goal.color }}
                >
                  {goal.number}
                </div>
                <div
                  className={`px-2 py-1 text-xs border ${getContributionColor(goal.contribution)}`}
                >
                  {goal.contribution}
                </div>
              </div>

              <h4 className="font-medium text-amber-900 text-sm mb-1">{goal.shortTitle}</h4>
              <p className="text-xs text-amber-700 opacity-70 line-clamp-2">{goal.description}</p>

              {/* Impact indicator */}
              <div className="mt-3 bg-gray-200 h-2">
                <div
                  className="h-2 transition-all duration-500"
                  style={{
                    width: `${getContributionScore(goal.contribution)}%`,
                    backgroundColor: goal.color,
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {viewMode === 'impact' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sdgGoals
            .filter((goal) => goal.contribution === 'high')
            .map((goal) => (
              <Card key={goal.number} className="p-4 border-2 border-amber-200">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: goal.color }}
                  >
                    {goal.number}
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900">{goal.shortTitle}</h4>
                    <div className="text-xs text-green-600 bg-green-100 px-2 py-1">High Impact</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-amber-900">Key MES Contributions:</h5>
                  {goal.mesImpacts.slice(0, level + 2).map((impact, index) => (
                    <div key={index} className="text-xs text-amber-800 flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{impact}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
        </div>
      )}

      {viewMode === 'metrics' && (
        <div className="space-y-4">
          {sdgGoals.map((goal) => (
            <Card key={goal.number} className="p-4 border-2 border-amber-200">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: goal.color }}
                >
                  {goal.number}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-amber-900">{goal.title}</h4>
                  <div
                    className={`inline-block px-2 py-1 text-xs border mt-1 ${getContributionColor(
                      goal.contribution
                    )}`}
                  >
                    {goal.contribution} contribution
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {goal.quantifiableMetrics.map((metric, index) => (
                  <div key={index} className="p-3 bg-amber-50 border border-amber-200">
                    <div className="text-lg font-bold text-amber-900">{metric.value}</div>
                    <div className="text-sm font-medium text-amber-800">{metric.metric}</div>
                    <div className="text-xs text-amber-600">{metric.description}</div>
                  </div>
                ))}
              </div>

              {level > 1 && (
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200">
                  <div className="text-sm font-medium text-gray-900 mb-1">UN Target Alignment:</div>
                  <div className="flex flex-wrap gap-1">
                    {goal.targetAlignment.map((target, index) => (
                      <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1">
                        {target}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Detailed view for selected SDG */}
      {selectedGoal && viewMode === 'grid' && (
        <Card className="p-6 border-2 border-amber-200">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-16 h-16 flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: selectedGoal.color }}
            >
              {selectedGoal.number}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-serif font-bold text-amber-900 mb-2">
                {selectedGoal.title}
              </h3>
              <p className="text-sm text-amber-800">{selectedGoal.description}</p>
              <div
                className={`inline-block px-3 py-1 text-sm border mt-2 ${getContributionColor(
                  selectedGoal.contribution
                )}`}
              >
                {selectedGoal.contribution.charAt(0).toUpperCase() +
                  selectedGoal.contribution.slice(1)}{' '}
                MES Contribution
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MES Impacts */}
            <div>
              <h4 className="font-bold text-amber-900 mb-3">How MES Technology Contributes:</h4>
              <div className="space-y-2">
                {selectedGoal.mesImpacts.map((impact, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-amber-50">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-sm text-amber-800">{impact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantifiable Metrics */}
            <div>
              <h4 className="font-bold text-amber-900 mb-3">Measurable Impact:</h4>
              <div className="space-y-3">
                {selectedGoal.quantifiableMetrics.map((metric, index) => (
                  <div key={index} className="p-3 bg-white border border-amber-200">
                    <div className="text-lg font-bold" style={{ color: selectedGoal.color }}>
                      {metric.value}
                    </div>
                    <div className="text-sm font-medium text-amber-900">{metric.metric}</div>
                    <div className="text-xs text-amber-600">{metric.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Global impact summary */}
      <Card className="p-4 border-2 border-amber-200">
        <h4 className="text-lg font-serif font-bold text-amber-900 mb-4">
          MES Contribution to 2030 Agenda
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-amber-900 mb-2">Priority SDG Areas:</h5>
            <div className="space-y-2">
              {sdgGoals
                .filter((goal) => goal.contribution === 'high')
                .map((goal) => (
                  <div key={goal.number} className="flex items-center gap-3 p-2 bg-green-50">
                    <div
                      className="w-6 h-6 flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: goal.color }}
                    >
                      {goal.number}
                    </div>
                    <span className="text-sm text-green-800">{goal.shortTitle}</span>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium text-amber-900 mb-2">
              Cumulative Global Impact (projected 2030):
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-amber-700">Water Access:</span>
                <span className="font-medium text-blue-600">+2.4M people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Clean Energy:</span>
                <span className="font-medium text-green-600">285 MW capacity</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">CO₂ Reduction:</span>
                <span className="font-medium text-purple-600">199k tons/year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Jobs Created:</span>
                <span className="font-medium text-yellow-600">~3,400 direct</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
