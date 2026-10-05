import Link from "next/link";
import Image from "next/image";
import {
  Cpu,
  Fingerprint,
  Radio,
  ShieldCheck,
  Wallet,
  Globe2,
} from "lucide-react";
export default function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="tiny-line" /> OWNERSHIP-FIRST MINING INFRASTRUCTURE
          </div>
          <h1>
            Own the machine.
            <br />
            <span className="text-muted">Build your</span>
            <br />
            <span className="text-accent">Bitcoin future.</span>
          </h1>
          <p>
            Identifiable hardware. Transparent infrastructure. Bitcoin rewards
            directed to a wallet you control.
          </p>
          <div className="button-row">
            <Link className="button primary" href="/marketplace">
              Explore hardware
            </Link>
            <Link className="button secondary" href="/how-it-works">
              How it works
            </Link>
          </div>
          <div className="hero-footnote">
            <ShieldCheck size={16} /> No custody. No guaranteed returns.
          </div>
        </div>
        <figure className="hero-photograph">
          <Image
            src="/images/mining-infrastructure.webp"
            alt="Rows of ASIC mining equipment and copper-toned infrastructure from the HashNomads pitch deck"
            fill
            sizes="(max-width: 800px) calc(100vw - 40px), (max-width: 1440px) 48vw, 600px"
            preload
          />
          <figcaption>
            <span className="eyebrow">ENGINEERED FOR MINING</span>
            <span>Hardware. Energy. Infrastructure.</span>
          </figcaption>
        </figure>
      </section>
      <section className="principle-strip">
        <div className="container three-grid">
          <div>
            <Fingerprint />
            <span>
              Identifiable ownership
              <small>A machine with a traceable identity.</small>
            </span>
          </div>
          <div>
            <Radio />
            <span>
              Source-backed telemetry
              <small>Understand performance and freshness.</small>
            </span>
          </div>
          <div>
            <Wallet />
            <span>
              Customer-controlled Bitcoin
              <small>Pool rewards go to your payout wallet.</small>
            </span>
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE OPERATING MODEL</span>
            <h2>
              One machine.
              <br />
              Every step, visible.
            </h2>
          </div>
          <p>
            From selecting hardware to monitoring hashrate, the platform
            connects the details that matter.
          </p>
        </div>
        <div className="journey-grid">
          {[
            {
              n: "01",
              title: "Choose your ASIC",
              text: "Understand the machine, specifications, and economics.",
              Icon: Cpu,
            },
            {
              n: "02",
              title: "Select infrastructure",
              text: "Compare simulated hosting configurations and explicit fees.",
              Icon: Globe2,
            },
            {
              n: "03",
              title: "Track deployment",
              text: "Follow assignment, worker connection, and deployment states.",
              Icon: Radio,
            },
            {
              n: "04",
              title: "Control your Bitcoin",
              text: "Register your payout address. Keep your private keys.",
              Icon: Wallet,
            },
          ].map(({ n, title, text, Icon }) => (
            <div className="journey-card" key={n}>
              <div className="card-top">
                <span className="mono">{n}</span>
                <Icon size={23} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container section hardware-feature">
        <figure className="hardware-photograph">
          <Image
            src="/images/asic-detail.webp"
            alt="Close-up of an ASIC cooling fan, metal chassis, and hardware fasteners from the HashNomads pitch deck"
            fill
            sizes="(max-width: 800px) calc(100vw - 40px), 46vw"
          />
          <figcaption>Ownership starts with identifiable hardware.</figcaption>
        </figure>
        <div>
          <span className="eyebrow">PURPOSE-BUILT HARDWARE</span>
          <h2>
            A machine.
            <br />A clear starting point.
          </h2>
          <p>
            The Antminer S21 Pro pairs 234 TH/s nominal hashrate with 15 J/TH
            efficiency. Explore manufacturer specifications and model your own
            assumptions.
          </p>
          <div className="callout">
            Catalogue prices are sandbox fixtures. They are not supplier quotes
            or an offer to sell.
          </div>
          <Link className="button secondary" href="/marketplace/s21-pro">
            Explore the S21 Pro
          </Link>
        </div>
      </section>
      <section className="container section infrastructure-feature">
        <div>
          <span className="eyebrow">
            UNITED STATES + CANADA / INITIAL MARKET FOCUS
          </span>
          <h2>
            Launch local.
            <br />
            Architect global.
          </h2>
          <p>
            Designed around the hardware, energy, and operational detail that
            mining demands. Starting with the United States and Canada, with an
            architecture built for eligible markets around the world.
          </p>
          <Link className="button secondary" href="/facilities">
            Explore infrastructure
          </Link>
        </div>
        <figure className="network-photograph">
          <Image
            src="/images/north-america-network.webp"
            alt="Illustration of North America with orange network connections from the HashNomads pitch deck"
            fill
            sizes="(max-width: 800px) calc(100vw - 40px), 48vw"
          />
        </figure>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">BUILT AROUND TRUST</span>
            <h2>
              Two flows.
              <br />
              Clear boundaries.
            </h2>
          </div>
          <Link className="text-link" href="/transparency">
            Read our transparency principles
          </Link>
        </div>
        <div className="two-grid">
          <div className="flow-card">
            <span className="eyebrow">COMMERCE</span>
            <h3>Pay for infrastructure.</h3>
            <div className="flow-steps">
              <span>Customer</span>
              <i />
              <span>Payment provider</span>
              <i />
              <span>HashNomads</span>
            </div>
            <p>Hardware and hosting payments belong to the commerce ledger.</p>
          </div>
          <div className="flow-card reward">
            <span className="eyebrow">MINING REWARDS</span>
            <h3>Your Bitcoin. Your control.</h3>
            <div className="flow-steps">
              <span>Your ASIC</span>
              <i />
              <span>Mining pool</span>
              <i />
              <span>Your wallet</span>
            </div>
            <p>Pool reward reporting stays separate. No custodial balance.</p>
          </div>
        </div>
      </section>
      <section className="container closing-cta">
        <div>
          <span className="eyebrow">UNDERSTAND THE ECONOMICS</span>
          <h2>
            Start with assumptions.
            <br />
            Never with promises.
          </h2>
        </div>
        <Link className="button primary" href="/calculator">
          Model a mining scenario
        </Link>
      </section>
    </>
  );
}
