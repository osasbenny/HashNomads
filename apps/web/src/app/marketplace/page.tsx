import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShieldCheck, Zap, Cpu } from "lucide-react";
import { catalogue } from "@hashnomads/domain";
export const metadata = { title: "Bitcoin mining hardware" };
export default function Page() {
  return (
    <div className="container page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">HARDWARE / ASIC MINERS</span>
          <h1>Own your hashrate.</h1>
          <p className="page-intro">
            Choose the machine behind your Bitcoin. Start with the
            specifications, then confirm pricing and hosting with your advisor.
          </p>
        </div>
        <Link className="button secondary" href="/contact">
          Talk to an advisor <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="market-grid">
        {catalogue.map((m) => (
          <article className="product-card" key={m.id}>
            <div className="product-art product-photo">
              <Image
                src="/images/asic-detail.webp"
                alt="ASIC cooling fan and chassis detail"
                fill
                sizes="(max-width: 800px) 100vw, 45vw"
              />
              <span className="mono">SHA–256 · AIR COOLED</span>
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
                  <b>Request pricing</b>
                  <small>Hardware + your hosting requirements</small>
                </div>
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
          <span className="eyebrow">FIND THE RIGHT FIT</span>
          <h3>
            One decision.
            <br />
            More than a price tag.
          </h3>
          <p>
            Choose for efficiency, energy costs and the life of the equipment.
            Your written quote confirms the model, quantity, availability and
            commercial terms.
          </p>
          <ul className="selection-list">
            <li>
              <Cpu />
              Manufacturer specifications
            </li>
            <li>
              <Zap />
              Hosting and energy options
            </li>
            <li>
              <ShieldCheck />
              Clear ownership and service terms
            </li>
          </ul>
          <Link className="button secondary" href="/contact?topic=hardware">
            Request a hardware quote <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
