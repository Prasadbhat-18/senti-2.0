import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function NetworkSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    meshRef.current.rotation.y += 0.002;
    meshRef.current.rotation.z += 0.001;
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1.5, 32, 32]}>
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.1} />
      </Sphere>
      <MeshDistortMaterial
        color="#3b82f6"
        attach="material"
        distort={0.4}
        speed={2}
        transparent
        opacity={0.05}
      />
    </group>
  );
}

function Particles() {
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    ref.current.rotation.y += 0.001;
  });

  return (
    <Points ref={ref} positions={points}>
      <PointMaterial
        transparent
        color="#a855f7"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

export default function GlobeBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050508]">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#050508] via-transparent to-purple-500/10 pointer-events-none" />
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <NetworkSphere />
          <Particles />
        </Float>
      </Canvas>
    </div>
  );
}
