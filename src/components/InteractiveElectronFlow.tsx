'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ElectronFlowProps {
  level: number; // 0: beginner, 1: basic, 2: intermediate
}

function ElectronParticle({
  position,
  delay,
  radius = 2,
}: {
  position: number;
  delay: number;
  radius?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = (state.clock.elapsedTime + delay) * 0.5;
      const angle = t % (Math.PI * 2);
      ref.current.position.x = Math.cos(angle) * radius;
      ref.current.position.z = Math.sin(angle) * radius;
      ref.current.position.y = Math.sin(t * 2) * 0.3;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
    </mesh>
  );
}

function MicrobeCell({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#059669"
          transparent
          opacity={0.8}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Pili (electron transfer appendages) */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
    </group>
  );
}

function Electrode({ position, label }: { position: [number, number, number]; label: string }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.1, 2, 1]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
      </mesh>
      <Html position={[0, 1.5, 0]} center>
        <div className="bg-amber-900/90 text-amber-50 px-2 py-1 text-xs font-serif whitespace-nowrap">
          {label}
        </div>
      </Html>
    </group>
  );
}

function CircuitPath() {
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(-2, 1, 0),
      new THREE.Vector3(0, 1.5, 0),
      new THREE.Vector3(2, 1, 0),
      new THREE.Vector3(2, 0, 0),
    ]);
    return curve.getPoints(50);
  }, []);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#d97706" />
    </line>
  );
}

function ElectronFlowVisualization({ level }: { level: number }) {
  const complexityLabels = {
    0: ['Microbe', 'Electron', 'Wire', 'Electricity'],
    1: ['Bacteria', 'e⁻ transfer', 'External circuit', 'Current flow'],
    2: ['Exoelectrogen', 'Extracellular e⁻', 'Load resistance', 'Power generation'],
  };

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {/* Electrodes */}
      <Electrode position={[-2, 0, 0]} label="Anode" />
      <Electrode position={[2, 0, 0]} label="Cathode" />

      {/* Microbes */}
      <MicrobeCell position={[-1.5, 0, 0]} />
      <MicrobeCell position={[-1.5, 0.5, 0.3]} />
      <MicrobeCell position={[-1.5, -0.5, -0.3]} />

      {/* Circuit path */}
      <CircuitPath />

      {/* Electrons */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ElectronParticle key={i} position={i} delay={i * 0.5} />
      ))}

      {/* Labels based on knowledge level */}
      <Html position={[-1.5, -1.5, 0]} center>
        <div className="text-xs font-serif text-amber-900 bg-amber-50/90 px-2 py-1">
          {complexityLabels[level as keyof typeof complexityLabels][0]}
        </div>
      </Html>

      <Html position={[0, 2, 0]} center>
        <div className="text-xs font-serif text-amber-900 bg-amber-50/90 px-2 py-1">
          {complexityLabels[level as keyof typeof complexityLabels][1]}
        </div>
      </Html>

      {/* Vintage circuit diagram overlay */}
      <Html fullscreen>
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full opacity-10" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#92400e" strokeWidth="0.1" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </Html>
    </>
  );
}

export default function InteractiveElectronFlow({ level }: ElectronFlowProps) {
  return (
    <div className="w-full h-full relative">
      {/* Vintage frame decoration */}
      <div className="absolute inset-0 border-2 border-amber-200 pointer-events-none" />
      <div className="absolute -top-2 -left-2 w-4 h-4 border-2 border-amber-300 bg-cream" />
      <div className="absolute -top-2 -right-2 w-4 h-4 border-2 border-amber-300 bg-cream" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 border-2 border-amber-300 bg-cream" />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 border-2 border-amber-300 bg-cream" />

      <Canvas camera={{ position: [0, 2, 5], fov: 40 }} style={{ background: 'transparent' }}>
        <ElectronFlowVisualization level={level} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Hover hint */}
      <div className="absolute bottom-2 right-2 text-xs text-amber-700 opacity-60">
        Drag to rotate • Watch electrons flow
      </div>
    </div>
  );
}
