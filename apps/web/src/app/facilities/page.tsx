import Link from "next/link";
import { MapPin, Layers3 } from "lucide-react";
import { facilities } from "@hashnomads/domain";
export const metadata = { title: "Infrastructure" };
export default function Page() {
  return (
    <div className="container page">
      <span className="eyebrow">INFRASTRUCTURE / US & CANADA</span>
      <h1>
        Global by architecture.
        <br />
        <span className="text-muted">Grounded in evidence.</span>
      </h1>
      <p className="page-intro">
        Explore reference hosting configurations for the initial target markets.
        These are simulated facilities, with no contracted capacity.
      </p>
      <div className="two-grid">
        {facilities.map((f, i) => (
          <article className="facility-card" key={f.id}>
            <div className="facility-top">
              <Layers3 size={42} strokeWidth={1} />
              <span className="mono">SIM / 0{i + 1}</span>
            </div>
            <span className="pill">Simulated facility</span>
            <h2>{f.name}</h2>
            <p>
              <MapPin size={16} />
              {f.region}
            </p>
            <div className="spec-rule">
              <span>Reference electricity tariff</span>
              <b>${f.rate}/kWh</b>
            </div>
            <div className="spec-rule">
              <span>Configuration</span>
              <b>Air cooled</b>
            </div>
            <div className="callout">
              Names, tariffs, and configurations are test fixtures. They do not
              represent partners, reserved capacity, or commercial pricing.
            </div>
            <Link className="button secondary" href="/calculator">
              Model a hosting scenario
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
