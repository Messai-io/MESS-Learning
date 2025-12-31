'use client';

import { useEffect, useRef, useState } from 'react';
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
  RadialLinearScale,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
);

interface CarbonFootprintComparisonProps {
  metric: string;
  level: number;
}

export default function CarbonFootprintComparison({
  metric,
  level,
}: CarbonFootprintComparisonProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'annual' | 'lifecycle'>('annual');
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress((prev) => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Data for different metrics
  const getChartData = () => {
    const baseData = {
      carbon: {
        labels: [
          'MES System',
          'Activated Sludge',
          'Anaerobic Digestion',
          'Membrane Bioreactor',
          'Constructed Wetlands',
        ],
        datasets: [
          {
            label: 'Carbon Footprint (kg CO₂ eq/m³)',
            data: [-0.8, 2.1, 0.3, 1.8, 0.1],
            backgroundColor: [
              'rgba(16, 185, 129, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.6)',
              'rgba(34, 197, 94, 0.6)',
            ],
            borderColor: ['#10b981', '#ef4444', '#f59e0b', '#ef4444', '#22c55e'],
            borderWidth: 2,
          },
        ],
      },
      energy: {
        labels: [
          'MES System',
          'Activated Sludge',
          'Anaerobic Digestion',
          'Membrane Bioreactor',
          'Constructed Wetlands',
        ],
        datasets: [
          {
            label: 'Net Energy Balance (kWh/m³)',
            data: [0.2, -1.5, 0.8, -2.1, -0.1],
            backgroundColor: [
              'rgba(16, 185, 129, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(34, 197, 94, 0.6)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(156, 163, 175, 0.6)',
            ],
            borderColor: ['#10b981', '#ef4444', '#22c55e', '#ef4444', '#9ca3af'],
            borderWidth: 2,
          },
        ],
      },
      water: {
        labels: [
          'MES System',
          'Activated Sludge',
          'Anaerobic Digestion',
          'Membrane Bioreactor',
          'Constructed Wetlands',
        ],
        datasets: [
          {
            label: 'Water Recovery (%)',
            data: [85, 60, 45, 90, 75],
            backgroundColor: [
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.6)',
              'rgba(239, 68, 68, 0.6)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(34, 197, 94, 0.6)',
            ],
            borderColor: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#22c55e'],
            borderWidth: 2,
          },
        ],
      },
    };

    return baseData[metric as keyof typeof baseData] || baseData.carbon;
  };

  // Lifecycle analysis data
  const lifecycleData = {
    labels: [
      'Construction',
      'Operation (Year 1-5)',
      'Operation (Year 6-15)',
      'Maintenance',
      'End of Life',
    ],
    datasets: [
      {
        label: 'MES System',
        data: [12, -8, -12, 3, 2],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Conventional Treatment',
        data: [8, 15, 18, 8, 5],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Impact breakdown for doughnut chart
  const impactBreakdown = {
    labels: [
      'Energy Production',
      'Chemical Reduction',
      'Sludge Reduction',
      'Water Recovery',
      'Construction Impact',
    ],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#06b6d4', '#ef4444'],
        borderColor: ['#059669', '#2563eb', '#d97706', '#0891b2', '#dc2626'],
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
        text:
          metric === 'carbon'
            ? 'Carbon Footprint Comparison'
            : metric === 'energy'
            ? 'Energy Balance Analysis'
            : 'Water Recovery Efficiency',
        font: {
          family: 'serif',
          size: 14,
        },
        color: '#92400e',
      },
    },
    scales: {
      y: {
        beginAtZero: metric !== 'carbon' && metric !== 'energy',
        title: {
          display: true,
          text:
            metric === 'carbon'
              ? 'kg CO₂ eq/m³'
              : metric === 'energy'
              ? 'kWh/m³'
              : metric === 'water'
              ? '% Recovery'
              : 'Impact',
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
            size: 9,
          },
          maxRotation: 45,
        },
        grid: {
          color: 'rgba(146, 64, 14, 0.1)',
        },
      },
    },
  };

  const lifecycleOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Lifecycle Carbon Impact Analysis',
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
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
        text: 'Carbon Impact Breakdown',
        font: {
          family: 'serif',
          size: 12,
        },
        color: '#92400e',
      },
    },
  };

  return (
    <div className="w-full h-full space-y-4">
      {/* Timeframe selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {['daily', 'annual', 'lifecycle'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as any)}
              className={`px-3 py-1 text-xs transition-all ${
                timeframe === tf
                  ? 'bg-amber-900 text-amber-50'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>

        <div className="text-xs text-amber-700">
          Negative values indicate net environmental benefit
        </div>
      </div>

      {/* Main chart area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-80">
        {/* Primary comparison chart */}
        <div className="lg:col-span-2 bg-white border border-amber-200 p-3">
          {timeframe === 'lifecycle' ? (
            <Line data={lifecycleData} options={lifecycleOptions} />
          ) : (
            <Bar data={getChartData()} options={chartOptions} />
          )}
        </div>

        {/* Impact breakdown */}
        <div className="bg-white border border-amber-200 p-3">
          <Doughnut data={impactBreakdown} options={doughnutOptions} />
        </div>
      </div>

      {/* Key insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-green-50 p-3 border border-green-200">
          <div className="text-sm font-bold text-green-800 mb-1">Net Carbon Benefit</div>
          <div className="text-lg font-bold text-green-900">-0.8 kg CO₂/m³</div>
          <div className="text-xs text-green-700">138% reduction vs conventional treatment</div>
        </div>

        <div className="bg-blue-50 p-3 border border-blue-200">
          <div className="text-sm font-bold text-blue-800 mb-1">Energy Recovery</div>
          <div className="text-lg font-bold text-blue-900">+0.2 kWh/m³</div>
          <div className="text-xs text-blue-700">Net positive energy production</div>
        </div>

        <div className="bg-purple-50 p-3 border border-purple-200">
          <div className="text-sm font-bold text-purple-800 mb-1">Annual Impact</div>
          <div className="text-lg font-bold text-purple-900">-295 kg CO₂</div>
          <div className="text-xs text-purple-700">Per 1000 m³ treatment capacity</div>
        </div>
      </div>

      {/* Detailed analysis for higher knowledge levels */}
      {level > 1 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200">
          <h4 className="text-sm font-bold text-amber-900 mb-2">Detailed Environmental Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-800">
            <div>
              <div className="font-medium mb-1">Construction Phase:</div>
              <div>• Material impacts: 12 kg CO₂/m³ capacity</div>
              <div>• Transportation: 2 kg CO₂/m³ capacity</div>
              <div>• Installation: 3 kg CO₂/m³ capacity</div>
            </div>
            <div>
              <div className="font-medium mb-1">Operational Benefits:</div>
              <div>• Avoided electricity: -8 kg CO₂/m³/year</div>
              <div>• Reduced chemicals: -4 kg CO₂/m³/year</div>
              <div>• Sludge reduction: -3 kg CO₂/m³/year</div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time environmental savings counter */}
      <div className="flex justify-center mt-4">
        <div className="bg-white border-2 border-green-200 p-3 text-center">
          <div className="text-xs text-green-600 mb-1">
            Global MES Environmental Savings (Estimated)
          </div>
          <div className="text-lg font-bold text-green-800">
            {(animationProgress * 1247 + 156780).toLocaleString()} kg CO₂
          </div>
          <div className="text-xs text-green-600">avoided this year</div>
        </div>
      </div>
    </div>
  );
}
