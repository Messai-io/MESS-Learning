'use client';

import { useState, useEffect } from 'react';
import { Card } from '@messai/ui';

interface GlobalImpactMapProps {
  level: number;
}

interface RegionData {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  deployment: number; // MW capacity
  carbonOffset: number; // tons CO2/year
  waterTreated: number; // m³/day
  status: 'operational' | 'planned' | 'research';
  projects: {
    name: string;
    type: string;
    capacity: string;
    year: number;
  }[];
}

const globalRegions: RegionData[] = [
  {
    id: 'north-america',
    name: 'North America',
    coordinates: { lat: 45, lng: -100 },
    deployment: 12.5,
    carbonOffset: 8750,
    waterTreated: 125000,
    status: 'operational',
    projects: [
      {
        name: 'Oregon State MFC Plant',
        type: 'Municipal Wastewater',
        capacity: '2.5 MW',
        year: 2019,
      },
      { name: 'Penn State Research', type: 'Pilot Scale', capacity: '150 kW', year: 2020 },
      { name: 'Foster Brewery MFC', type: 'Industrial', capacity: '800 kW', year: 2021 },
    ],
  },
  {
    id: 'europe',
    name: 'Europe',
    coordinates: { lat: 50, lng: 10 },
    deployment: 18.3,
    carbonOffset: 12810,
    waterTreated: 180000,
    status: 'operational',
    projects: [
      { name: 'Netherlands Pilot', type: 'Research', capacity: '1.2 MW', year: 2018 },
      { name: 'Germany Industrial', type: 'Brewery', capacity: '3.1 MW', year: 2020 },
      { name: 'UK Municipal Plant', type: 'Wastewater', capacity: '4.5 MW', year: 2022 },
    ],
  },
  {
    id: 'asia-pacific',
    name: 'Asia-Pacific',
    coordinates: { lat: 20, lng: 110 },
    deployment: 32.1,
    carbonOffset: 22470,
    waterTreated: 285000,
    status: 'operational',
    projects: [
      { name: 'Singapore Seawater MFC', type: 'Marine', capacity: '1.8 MW', year: 2021 },
      { name: 'China Scale-up', type: 'Municipal', capacity: '8.5 MW', year: 2023 },
      { name: 'Japan Research Hub', type: 'Multi-purpose', capacity: '2.2 MW', year: 2024 },
    ],
  },
  {
    id: 'south-america',
    name: 'South America',
    coordinates: { lat: -15, lng: -60 },
    deployment: 5.7,
    carbonOffset: 3990,
    waterTreated: 42000,
    status: 'planned',
    projects: [
      { name: 'Brazil Pilot', type: 'Sugarcane Waste', capacity: '1.1 MW', year: 2024 },
      { name: 'Argentina Research', type: 'Mining Water', capacity: '750 kW', year: 2025 },
    ],
  },
  {
    id: 'africa',
    name: 'Africa',
    coordinates: { lat: 0, lng: 20 },
    deployment: 2.8,
    carbonOffset: 1960,
    waterTreated: 18000,
    status: 'research',
    projects: [
      { name: 'South Africa Demo', type: 'Off-grid', capacity: '500 kW', year: 2025 },
      { name: 'Kenya Rural Project', type: 'Decentralized', capacity: '300 kW', year: 2026 },
    ],
  },
];

export default function GlobalImpactMap({ level }: GlobalImpactMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [view, setView] = useState<'deployment' | 'carbon' | 'water'>('deployment');
  const [animationFrame, setAnimationFrame] = useState(0);

  // Animation for data visualization
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame((prev) => (prev + 1) % 100);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const selectedRegionData = globalRegions.find((r) => r.id === selectedRegion);

  const getRegionSize = (region: RegionData) => {
    const baseSize = 20;
    switch (view) {
      case 'deployment':
        return baseSize + (region.deployment / 32.1) * 30; // Scale by max deployment
      case 'carbon':
        return baseSize + (region.carbonOffset / 22470) * 30; // Scale by max carbon offset
      case 'water':
        return baseSize + (region.waterTreated / 285000) * 30; // Scale by max water treated
      default:
        return baseSize;
    }
  };

  const getRegionColor = (region: RegionData) => {
    switch (region.status) {
      case 'operational':
        return '#10b981'; // Green
      case 'planned':
        return '#f59e0b'; // Amber
      case 'research':
        return '#3b82f6'; // Blue
      default:
        return '#6b7280'; // Gray
    }
  };

  const getMetricValue = (region: RegionData) => {
    switch (view) {
      case 'deployment':
        return `${region.deployment} MW`;
      case 'carbon':
        return `${region.carbonOffset.toLocaleString()} tons CO₂/year`;
      case 'water':
        return `${region.waterTreated.toLocaleString()} m³/day`;
      default:
        return '';
    }
  };

  // Calculate global totals
  const globalTotals = globalRegions.reduce(
    (acc, region) => ({
      deployment: acc.deployment + region.deployment,
      carbonOffset: acc.carbonOffset + region.carbonOffset,
      waterTreated: acc.waterTreated + region.waterTreated,
      projects: acc.projects + region.projects.length,
    }),
    { deployment: 0, carbonOffset: 0, waterTreated: 0, projects: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-4 border-2 border-amber-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-serif font-bold text-amber-900">Global MES Deployment Map</h3>

          <div className="flex gap-2">
            {(['deployment', 'carbon', 'water'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 text-xs transition-all ${
                  view === v
                    ? 'bg-amber-900 text-amber-50'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
              >
                {v === 'deployment'
                  ? 'Capacity'
                  : v === 'carbon'
                  ? 'Carbon Impact'
                  : 'Water Treatment'}
              </button>
            ))}
          </div>
        </div>

        {/* Global statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-green-50 border border-green-200">
            <div className="text-lg font-bold text-green-800">{globalTotals.deployment} MW</div>
            <div className="text-xs text-green-600">Total Capacity</div>
          </div>
          <div className="text-center p-3 bg-blue-50 border border-blue-200">
            <div className="text-lg font-bold text-blue-800">
              {globalTotals.carbonOffset.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600">tons CO₂ offset/year</div>
          </div>
          <div className="text-center p-3 bg-purple-50 border border-purple-200">
            <div className="text-lg font-bold text-purple-800">
              {globalTotals.waterTreated.toLocaleString()}
            </div>
            <div className="text-xs text-purple-600">m³ water treated/day</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 border border-yellow-200">
            <div className="text-lg font-bold text-yellow-800">{globalTotals.projects}</div>
            <div className="text-xs text-yellow-600">Active Projects</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map visualization */}
        <Card className="p-6 border-2 border-amber-200">
          <h4 className="text-lg font-serif font-bold text-amber-900 mb-4">
            Regional Distribution
          </h4>

          {/* Simplified world map representation */}
          <div className="relative h-80 bg-gradient-to-b from-blue-50 to-green-50 border border-amber-200 overflow-hidden">
            {/* World map background pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
              <defs>
                <pattern
                  id="worldMap"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#worldMap)" />
            </svg>

            {/* Region markers */}
            {globalRegions.map((region) => {
              const size = getRegionSize(region);
              const color = getRegionColor(region);

              return (
                <div
                  key={region.id}
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-110"
                  style={{
                    left: `${((region.coordinates.lng + 180) / 360) * 100}%`,
                    top: `${((90 - region.coordinates.lat) / 180) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
                >
                  {/* Animated pulse ring */}
                  <div
                    className="absolute animate-ping opacity-30"
                    style={{
                      width: `${size + 10}px`,
                      height: `${size + 10}px`,
                      backgroundColor: color,
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />

                  {/* Main marker */}
                  <div
                    className={`border-2 border-white shadow-lg ${
                      selectedRegion === region.id ? 'ring-4 ring-amber-400' : ''
                    }`}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: color,
                    }}
                  />

                  {/* Hover tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-900 text-amber-50 px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {region.name}
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-2 left-2 bg-amber-50/90 p-2 text-xs space-y-1">
              <div className="font-bold text-amber-900">Status:</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500"></div>
                <span>Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500"></div>
                <span>Planned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500"></div>
                <span>Research</span>
              </div>
            </div>

            {/* Current view indicator */}
            <div className="absolute top-2 right-2 bg-amber-50/90 p-2 text-xs">
              <div className="font-bold text-amber-900">
                Showing:{' '}
                {view === 'deployment'
                  ? 'Capacity'
                  : view === 'carbon'
                  ? 'Carbon Impact'
                  : 'Water Treatment'}
              </div>
            </div>
          </div>
        </Card>

        {/* Region details */}
        <Card className="p-6 border-2 border-amber-200">
          <h4 className="text-lg font-serif font-bold text-amber-900 mb-4">Regional Details</h4>

          {selectedRegionData ? (
            <div className="space-y-4">
              <div>
                <h5 className="text-xl font-serif font-bold text-amber-900">
                  {selectedRegionData.name}
                </h5>
                <div
                  className={`inline-block px-2 py-1 text-xs mt-1 ${
                    selectedRegionData.status === 'operational'
                      ? 'bg-green-100 text-green-800'
                      : selectedRegionData.status === 'planned'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {selectedRegionData.status.charAt(0).toUpperCase() +
                    selectedRegionData.status.slice(1)}
                </div>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-green-50 border border-green-200">
                  <div className="font-medium text-green-800">Capacity</div>
                  <div className="text-lg font-bold text-green-900">
                    {selectedRegionData.deployment} MW
                  </div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200">
                  <div className="font-medium text-blue-800">Carbon Offset</div>
                  <div className="text-lg font-bold text-blue-900">
                    {selectedRegionData.carbonOffset.toLocaleString()} tons/year
                  </div>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200">
                  <div className="font-medium text-purple-800">Water Treatment</div>
                  <div className="text-lg font-bold text-purple-900">
                    {selectedRegionData.waterTreated.toLocaleString()} m³/day
                  </div>
                </div>
              </div>

              {/* Projects list */}
              <div>
                <h6 className="font-medium text-amber-900 mb-2">Key Projects:</h6>
                <div className="space-y-2">
                  {selectedRegionData.projects.map((project, index) => (
                    <div key={index} className="p-2 bg-amber-50 border border-amber-200">
                      <div className="font-medium text-amber-900 text-sm">{project.name}</div>
                      <div className="text-xs text-amber-700">
                        {project.type} • {project.capacity} • {project.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {level > 1 && (
                <div className="p-3 bg-amber-50 border border-amber-200">
                  <h6 className="font-medium text-amber-900 mb-1">Regional Impact Analysis:</h6>
                  <div className="text-xs text-amber-800 space-y-1">
                    <div>• Economic investment: $15-25M per MW installed</div>
                    <div>• Job creation: 12-18 direct jobs per MW</div>
                    <div>• Technology transfer: 3-5 local partnerships</div>
                    <div>• Research collaboration: 8-12 academic institutions</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🌍</div>
              <div className="text-amber-900 font-medium">Select a region on the map</div>
              <div className="text-amber-700 text-sm opacity-70">
                Click on any region marker to view detailed information
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Growth projection */}
      <Card className="p-4 border-2 border-amber-200">
        <h4 className="text-lg font-serif font-bold text-amber-900 mb-4">
          Projected Growth (2025-2030)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-800">285 MW</div>
            <div className="text-sm text-green-600 mb-2">Expected capacity by 2030</div>
            <div className="text-xs text-green-500">4x current deployment</div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-800">199k tons</div>
            <div className="text-sm text-blue-600 mb-2">CO₂ offset by 2030</div>
            <div className="text-xs text-blue-500">Equivalent to 9.6M trees</div>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 text-center">
            <div className="text-2xl font-bold text-purple-800">1.2M m³</div>
            <div className="text-sm text-purple-600 mb-2">Daily water treatment by 2030</div>
            <div className="text-xs text-purple-500">Serving 480k people</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
