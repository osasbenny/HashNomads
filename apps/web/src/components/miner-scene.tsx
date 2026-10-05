"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
function Fan({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.51, 0.51, 0.055, 48]} />
        <meshStandardMaterial color="#111819" roughness={0.5} metalness={0.8} />
      </mesh>
      {[0.18, 0.28, 0.38, 0.48].map((r) => (
        <mesh key={r} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.012, 6, 48]} />
          <meshStandardMaterial
            color="#5c6261"
            metalness={0.9}
            roughness={0.35}
          />
        </mesh>
      ))}
      <mesh>
        <cylinderGeometry args={[0.13, 0.13, 0.08, 24]} />
        <meshStandardMaterial color="#575d5c" metalness={0.8} roughness={0.5} />
      </mesh>
      {[0, Math.PI / 2].map((r) => (
        <mesh key={r} rotation={[0, r, 0]} position={[0, 0.06, 0]}>
          <boxGeometry args={[1.02, 0.025, 0.025]} />
          <meshStandardMaterial color="#838885" metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
function Miner() {
  return (
    <group rotation={[0.06, -0.52, -0.08]}>
      <mesh>
        <boxGeometry args={[1.35, 2.5, 1.85]} />
        <meshStandardMaterial
          color="#858c87"
          metalness={0.86}
          roughness={0.38}
        />
      </mesh>
      <mesh position={[0, 0, 0.94]}>
        <boxGeometry args={[1.3, 2.43, 0.05]} />
        <meshStandardMaterial color="#292f2e" metalness={0.8} roughness={0.5} />
      </mesh>
      <Fan position={[0, 0.6, 0.99]} />
      <Fan position={[0, -0.6, 0.99]} />
      {Array.from({ length: 22 }, (_, i) => (
        <mesh key={i} position={[0.7, 0, (i - 10.5) * 0.075]}>
          <boxGeometry args={[0.05, 2.35, 0.025]} />
          <meshStandardMaterial
            color="#a2aaa4"
            metalness={0.9}
            roughness={0.4}
          />
        </mesh>
      ))}
      <mesh position={[-0.1, 1.4, -0.2]}>
        <boxGeometry args={[1.2, 0.27, 1.1]} />
        <meshStandardMaterial color="#272e2b" metalness={0.6} roughness={0.6} />
      </mesh>
      <mesh position={[0.728, 0.15, 0]}>
        <boxGeometry args={[0.007, 0.48, 0.64]} />
        <meshStandardMaterial
          color="#ef9c43"
          metalness={0.45}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}
export default function MinerScene() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  if (!enabled)
    return (
      <div className="scene-fallback">
        <span className="fallback-chip">SHA–256</span>
        <strong>
          234<span> TH/s</span>
        </strong>
        <p>Antminer S21 Pro</p>
        <div className="fallback-specs">
          <span>15 J/TH</span>
          <span>3,510 W</span>
        </div>
      </div>
    );
  return (
    <div
      className="miner-canvas"
      aria-label="Illustrative 3D ASIC model; not evidence of physical inventory"
      role="img"
    >
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [4, 2.3, 5], fov: 36 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[3, 6, 4]} intensity={5} color="#fce4c3" />
        <directionalLight position={[-4, 1, 2]} intensity={3} color="#b6dbdf" />
        <pointLight position={[2, -2, 3]} intensity={20} color="#e8913c" />
        <Suspense fallback={null}>
          <Miner />
        </Suspense>
      </Canvas>
    </div>
  );
}
