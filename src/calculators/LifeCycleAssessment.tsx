'use client';

import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LifeCycleAssessmentProps {
  metric: string;
  level: number;
}

export default function LifeCycleAssessment({ metric, level }: LifeCycleAssessmentProps) {
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [assessmentType, setAssessmentType] = useState<'carbon' | 'energy' | 'water' | 'materials'>(
    'carbon'
  );

  const lifecyclePhases = [
    {
      id: 'raw-materials',
      name: 'Raw Materials',
      duration: '0-1 years',
      activities: [
        'Steel production',
        'Concrete manufacturing',
        'Membrane synthesis',
        'Equipment manufacturing',
      ],
      carbonImpact: 15.2,
      energyImpact: 45.8,
      waterImpact: 12.3,
    },
    {
      id: 'construction',
      name: 'Construction',
      duration: '1-2 years',
      activities: ['Site preparation', 'Civil works', 'Equipment installation', 'Commissioning'],
      carbonImpact: 8.7,
      energyImpact: 23.4,
      waterImpact: 5.6,
    },
    {
      id: 'operation',
      name: 'Operation',
      duration: '2-17 years',
      activities: ['Daily operation', 'Maintenance', 'Energy production', 'Waste processing'],
      carbonImpact: -12.3,
      energyImpact: -156.7,
      waterImpact: -89.4,
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      duration: '2-17 years',
      activities: [
        'Membrane replacement',
        'Electrode cleaning',
        'Equipment repair',
        'System upgrades',
      ],
      carbonImpact: 4.1,
      energyImpact: 12.8,
      waterImpact: 3.2,
    },
    {
      id: 'end-of-life',
      name: 'End of Life',
      duration: '17-18 years',
      activities: ['Decommissioning', 'Material recovery', 'Waste disposal', 'Site restoration'],
      carbonImpact: 2.3,
      energyImpact: 8.9,
      waterImpact: 1.8,
    },
  ];

  // Comparative LCA data
  const comparativeLCA = useMemo(() => {
    const technologies = ['MES', 'Activated Sludge', 'Membrane Bioreactor', 'Anaerobic Digestion'];
    const phases = ['Materials', 'Construction', 'Operation', 'Maintenance', 'End of Life'];

    const data = {
      carbon: {
        MES: [15.2, 8.7, -12.3, 4.1, 2.3],
        'Activated Sludge': [12.4, 6.8, 28.5, 5.2, 1.8],
        'Membrane Bioreactor': [18.9, 11.2, 35.7, 8.9, 2.4],
        'Anaerobic Digestion': [14.1, 7.9, 8.2, 4.7, 2.1],
      },
      energy: {
        MES: [45.8, 23.4, -156.7, 12.8, 8.9],
        'Activated Sludge': [38.2, 19.7, 234.8, 15.6, 7.2],
        'Membrane Bioreactor': [52.1, 28.9, 298.4, 24.7, 8.8],
        'Anaerobic Digestion': [41.3, 22.1, -45.2, 14.2, 7.6],
      },
      water: {
        MES: [12.3, 5.6, -89.4, 3.2, 1.8],
        'Activated Sludge': [9.8, 4.2, 45.7, 4.1, 1.5],
        'Membrane Bioreactor': [14.7, 6.8, 23.4, 5.9, 2.1],
        'Anaerobic Digestion': [11.2, 4.9, -12.3, 3.8, 1.7],
      },
    };

    return data[assessmentType as keyof typeof data] || data.carbon;
  }, [assessmentType]);

  // Create chart data for comparative analysis
  const chartData = {
    labels: ['Materials', 'Construction', 'Operation', 'Maintenance', 'End of Life'],
    datasets: Object.keys(comparativeLCA).map((tech, index) => ({
      label: tech,
      data: comparativeLCA[tech as keyof typeof comparativeLCA],
      borderColor: [
        '#10b981', // MES - Green
        '#ef4444', // Activated Sludge - Red
        '#f59e0b', // MBR - Orange
        '#3b82f6', // Anaerobic Digestion - Blue
      ][index],
      backgroundColor: [
        'rgba(16, 185, 129, 0.1)',
        'rgba(239, 68, 68, 0.1)',
        'rgba(245, 158, 11, 0.1)',
        'rgba(59, 130, 246, 0.1)',
      ][index],
      tension: 0.4,
      fill: index === 0, // Only fill the MES line
    })),
  };

  // Phase breakdown for selected technology
  const phaseBreakdownData = {
    labels: lifecyclePhases.map((phase) => phase.name),
    datasets: [
      {
        label: `${assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)} Impact`,
        data: lifecyclePhases.map((phase) =>
          assessmentType === 'carbon'
            ? phase.carbonImpact
            : assessmentType === 'energy'
            ? phase.energyImpact
            : phase.waterImpact
        ),
        backgroundColor: lifecyclePhases.map((phase) => {
          const impact =
            assessmentType === 'carbon'
              ? phase.carbonImpact
              : assessmentType === 'energy'
              ? phase.energyImpact
              : phase.waterImpact;
          return impact < 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)';
        }),
        borderColor: lifecyclePhases.map((phase) => {
          const impact =
            assessmentType === 'carbon'
              ? phase.carbonImpact
              : assessmentType === 'energy'
              ? phase.energyImpact
              : phase.waterImpact;
          return impact < 0 ? '#10b981' : '#ef4444';
        }),
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'serif',
            size: 10,
          },
          color: '#92400e',
        },
      },
      title: {
        display: true,
        text: 'Life Cycle Assessment Comparison',
        font: {
          family: 'serif',
          size: 14,
        },
        color: '#92400e',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text:
            assessmentType === 'carbon'
              ? 'kg CO₂ eq/m³'
              : assessmentType === 'energy'
              ? 'kWh/m³'
              : 'L water/m³',
          font: {
            family: 'serif',
            size: 11,
          },
          color: '#92400e',
        },
        ticks: {
          color: '#92400e',
          font: {
            size: 10,
          },
        },
        grid: {
          color: 'rgba(146, 64, 14, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#92400e',
          font: {
            size: 10,
          },
        },
        grid: {
          color: 'rgba(146, 64, 14, 0.1)',
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'MES System Phase Breakdown',
      },
    },
  };

  // Calculate totals
  const totalImpact = lifecyclePhases.reduce((sum, phase) => {
    const impact =
      assessmentType === 'carbon'
        ? phase.carbonImpact
        : assessmentType === 'energy'
        ? phase.energyImpact
        : phase.waterImpact;
    return sum + impact;
  }, 0);

  const selectedPhaseData =
    selectedPhase === 'all' ? null : lifecyclePhases.find((phase) => phase.id === selectedPhase);

  return (
    <div className="w-full h-full space-y-4">
      {/* Assessment type selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {['carbon', 'energy', 'water', 'materials'].map((type) => (
            <button
              key={type}
              onClick={() => setAssessmentType(type as any)}
              className={`px-3 py-1 text-xs transition-all ${
                assessmentType === type
                  ? 'bg-amber-900 text-amber-50'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="text-xs text-amber-700">
          Total impact: {totalImpact > 0 ? '+' : ''}
          {totalImpact.toFixed(1)}
          {assessmentType === 'carbon'
            ? ' kg CO₂/m³'
            : assessmentType === 'energy'
            ? ' kWh/m³'
            : ' L/m³'}
        </div>
      </div>

      {/* Main chart area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-64">
        {/* Comparative LCA */}
        <div className="bg-white border border-amber-200 p-3">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Phase breakdown */}
        <div className="bg-white border border-amber-200 p-3">
          <Bar data={phaseBreakdownData} options={barOptions} />
        </div>
      </div>

      {/* Phase selection and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Phase selector */}
        <div className="bg-amber-50 border border-amber-200 p-3">
          <h4 className="text-sm font-bold text-amber-900 mb-3">Lifecycle Phases</h4>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedPhase('all')}
              className={`w-full text-left p-2 text-xs transition-all ${
                selectedPhase === 'all'
                  ? 'bg-amber-200 text-amber-900'
                  : 'bg-white text-amber-800 hover:bg-amber-100'
              }`}
            >
              All Phases Overview
            </button>
            {lifecyclePhases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`w-full text-left p-2 text-xs transition-all ${
                  selectedPhase === phase.id
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-white text-amber-800 hover:bg-amber-100'
                }`}
              >
                <div className="font-medium">{phase.name}</div>
                <div className="text-amber-600">{phase.duration}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Phase details */}
        <div className="lg:col-span-2 bg-white border border-amber-200 p-4">
          {selectedPhaseData ? (
            <div>
              <h4 className="text-lg font-serif font-bold text-amber-900 mb-3">
                {selectedPhaseData.name} Phase
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-bold text-amber-900 mb-2">Key Activities</h5>
                  <div className="space-y-1">
                    {selectedPhaseData.activities.map((activity, index) => (
                      <div key={index} className="text-xs text-amber-800">
                        • {activity}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-amber-900 mb-2">Environmental Impact</h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-amber-700">Carbon:</span>
                      <span
                        className={`font-medium ${
                          selectedPhaseData.carbonImpact < 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {selectedPhaseData.carbonImpact > 0 ? '+' : ''}
                        {selectedPhaseData.carbonImpact} kg CO₂/m³
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">Energy:</span>
                      <span
                        className={`font-medium ${
                          selectedPhaseData.energyImpact < 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {selectedPhaseData.energyImpact > 0 ? '+' : ''}
                        {selectedPhaseData.energyImpact} kWh/m³
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">Water:</span>
                      <span
                        className={`font-medium ${
                          selectedPhaseData.waterImpact < 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {selectedPhaseData.waterImpact > 0 ? '+' : ''}
                        {selectedPhaseData.waterImpact} L/m³
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-amber-600">
                    Duration: {selectedPhaseData.duration}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-lg font-serif font-bold text-amber-900 mb-3">
                Complete Lifecycle Overview
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-green-50 border border-green-200">
                  <div className="text-sm font-bold text-green-800 mb-1">
                    Net Environmental Benefit
                  </div>
                  <div className="text-lg font-bold text-green-900">{totalImpact.toFixed(1)}</div>
                  <div className="text-xs text-green-700">
                    {assessmentType === 'carbon'
                      ? 'kg CO₂ eq/m³'
                      : assessmentType === 'energy'
                      ? 'kWh/m³'
                      : 'L water/m³'}{' '}
                    over 15 years
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200">
                  <div className="text-sm font-bold text-blue-800 mb-1">Payback Period</div>
                  <div className="text-lg font-bold text-blue-900">
                    {assessmentType === 'carbon'
                      ? '1.8'
                      : assessmentType === 'energy'
                      ? '0.4'
                      : '0.2'}{' '}
                    years
                  </div>
                  <div className="text-xs text-blue-700">Environmental break-even point</div>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200">
                  <div className="text-sm font-bold text-purple-800 mb-1">Peak Benefit Phase</div>
                  <div className="text-lg font-bold text-purple-900">Operation</div>
                  <div className="text-xs text-purple-700">Years 2-17 of system lifecycle</div>
                </div>
              </div>

              {level > 1 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200">
                  <h5 className="text-sm font-bold text-amber-900 mb-2">Advanced LCA Insights</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-800">
                    <div>
                      <div className="font-medium mb-1">Key Assumptions:</div>
                      <div>• System lifetime: 15 years</div>
                      <div>• Capacity: 1000 m³/day</div>
                      <div>• Electricity grid: Regional mix</div>
                      <div>• Discount rate: 3% annually</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Sensitivity Analysis:</div>
                      <div>• Lifetime ±5 years: ±15% impact</div>
                      <div>• Performance ±20%: ±18% impact</div>
                      <div>• Grid carbon: ±25% impact</div>
                      <div>• Material costs: ±8% impact</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
