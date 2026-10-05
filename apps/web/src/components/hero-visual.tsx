"use client";
import dynamic from "next/dynamic";
const MinerScene = dynamic(() => import("./miner-scene"), {
  ssr: false,
  loading: () => (
    <div className="scene-fallback">
      <span className="eyebrow">ASIC HARDWARE</span>
      <strong>
        234<span> TH/s</span>
      </strong>
    </div>
  ),
});
export function HeroVisual() {
  return (
    <div className="hero-visual">
      <div className="visual-grid" />
      <div className="visual-halo" />
      <div className="visual-top">
        <span className="mono">MODEL / 001</span>
        <span className="pill">Illustrative hardware</span>
      </div>
      <MinerScene />
      <div className="visual-label">
        <span className="eyebrow">BITMAIN</span>
        <h3>Antminer S21 Pro</h3>
        <div className="visual-metrics">
          <span>
            <b>234</b> TH/s
          </span>
          <span>
            <b>15</b> J/TH
          </span>
          <span>
            <b>3,510</b> W
          </span>
        </div>
      </div>
      <div className="visual-note mono">
        SIMULATION MODE / NO PHYSICAL INVENTORY
      </div>
    </div>
  );
}
