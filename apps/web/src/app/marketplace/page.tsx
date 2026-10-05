import Link from "next/link";
import { Cpu } from "lucide-react";
import { catalogue } from "@hashnomads/domain";
export const metadata = { title: "ASIC hardware" };
export default function Page() {
  return (
    <div className="container page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">HARDWARE / ASIC CATALOGUE</span>
          <h1>Own your hashrate.</h1>
          <p className="page-intro">
            Explore identifiable mining hardware and its specifications.
          </p>
        </div>
        <span className="pill">Sandbox catalogue</span>
      </div>
      <div className="market-grid">
        {catalogue.map((m) => (
          <article className="product-card" key={m.id}>
            <div className="product-art">
              <Cpu size={105} strokeWidth={0.65} />
              <span className="mono">SHA–256</span>
            </div>
            <div className="product-body">
              <span className="eyebrow">{m.manufacturer}</span>
              <h2>{m.name}</h2>
              <div className="product-specs">
                <span>
                  <b>{m.hashrateTH}</b>TH/s
                </span>
                <span>
                  <b>{m.efficiency}</b>J/TH
                </span>
                <span>
                  <b>{m.powerW.toLocaleString("en-US")}</b>W
                </span>
              </div>
              <div className="product-price">
                <div>
                  <b>$4,800</b>
                  <small>Sandbox hardware price</small>
                </div>
                <span className="pill">Simulated</span>
              </div>
              <Link
                className="button primary full"
                href={`/marketplace/${m.id}`}
              >
                Explore specifications
              </Link>
            </div>
          </article>
        ))}
        <div className="catalogue-note">
          <span className="eyebrow">AN INTENTIONAL START</span>
          <h3>Specifications before selection.</h3>
          <p>
            We begin with one documented reference ASIC. Additional models will
            be added with manufacturer specifications, compatibility checks, and
            supplier validation.
          </p>
          <p>
            No physical inventory or shipping availability is offered in this
            sandbox.
          </p>
          <Link className="text-link" href="/transparency">
            Understand what is simulated
          </Link>
        </div>
      </div>
    </div>
  );
}
