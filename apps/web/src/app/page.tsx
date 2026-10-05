import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Cpu,
  Fingerprint,
  Wallet,
  Zap,
  Globe2,
  Wrench,
  Check,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { FAQ } from "@/components/faq";
import { Newsletter } from "@/components/site-forms";
import { commercial } from "@/lib/commercial";
export default function Home() {
  return (
    <>
      <section className="container hero commercial-hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="tiny-line" /> BITCOIN MINING. BUILT AROUND YOU.
          </div>
          <h1>
            Own the machine.
            <br />
            <span className="text-accent">
              Build your
              <br />
              Bitcoin future.
            </span>
          </h1>
          <p>
            Your hardware. Professional hosting. A clearer path to Bitcoin
            ownership, without running a mining operation at home.
          </p>
          <ul className="hero-checks">
            <li>
              <Check />
              Choose dedicated ASIC hardware
            </li>
            <li>
              <Check />
              Find the right energy and hosting location
            </li>
            <li>
              <Check />
              Keep control of your Bitcoin wallet
            </li>
          </ul>
          <div className="button-row">
            <Link className="button primary" href="/marketplace">
              Explore hardware <ArrowUpRight size={18} />
            </Link>
            <Link className="button secondary" href="/contact">
              Talk to an advisor
            </Link>
          </div>
          <div className="hero-footnote">
            <ShieldCheck size={16} /> Hardware ownership. No guaranteed returns.
          </div>
        </div>
        <figure className="hero-photograph">
          <Image
            src="/images/mining-infrastructure.webp"
            alt="Bitcoin mining infrastructure"
            fill
            preload
            sizes="(max-width: 800px) 100vw, 50vw"
          />
          <figcaption>
            <span className="eyebrow">THE INFRASTRUCTURE BEHIND OWNERSHIP</span>
            <span>Power. Hardware. Human expertise.</span>
          </figcaption>
          <div className="hero-photo-badge">
            <Zap size={18} />
            <span>
              Made for mining.<small>Managed for you.</small>
            </span>
          </div>
        </figure>
      </section>
      <section className="principle-strip">
        <div className="container three-grid">
          {[
            {
              Icon: Fingerprint,
              title: "Your hardware",
              text: "Ownership comes first.",
            },
            {
              Icon: Wrench,
              title: "Professional operations",
              text: "Leave the day-to-day to specialists.",
            },
            {
              Icon: Wallet,
              title: "Your Bitcoin",
              text: "A wallet you control.",
            },
          ].map(({ Icon, title, text }) => (
            <div key={title}>
              <Icon />
              <span>
                {title}
                <small>{text}</small>
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A BETTER WAY TO BEGIN</span>
            <h2>
              Bitcoin mining.
              <br />
              Without the spare room.
            </h2>
          </div>
          <p>
            Skip the noise, heat and hardware maintenance at home. Focus on
            selecting a machine and a hosting plan that make sense for you.
          </p>
        </div>
        <div className="benefit-grid">
          {[
            {
              Icon: Cpu,
              title: "Buy the machine",
              text: "Understand the hashrate, power draw and efficiency before deciding.",
            },
            {
              Icon: Zap,
              title: "Choose your energy",
              text: "Compare published hosting locations and review the tariff in your quote.",
            },
            {
              Icon: Wrench,
              title: "Let experts handle it",
              text: "Installation, maintenance and service coverage belong in a clear hosting agreement.",
            },
          ].map(({ Icon, title, text }) => (
            <article className="benefit-card" key={title}>
              <Icon />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container section light-panel hardware-feature">
        <figure className="hardware-photograph">
          <Image
            src="/images/asic-detail.webp"
            alt="Detail of an ASIC cooling fan and metal chassis"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
          />
        </figure>
        <div>
          <span className="eyebrow">HARDWARE WITH A PURPOSE</span>
          <h2>
            Your next chapter
            <br />
            starts with an ASIC.
          </h2>
          <p>
            Explore the Antminer S21 Pro. Review its manufacturer
            specifications, then work through the energy costs and hosting
            options.
          </p>
          <div className="hardware-numbers">
            <div>
              <strong>234</strong>
              <span>TH/s hashrate</span>
            </div>
            <div>
              <strong>15</strong>
              <span>J/TH efficiency</span>
            </div>
            <div>
              <strong>3,510</strong>
              <span>W nominal power</span>
            </div>
          </div>
          <div className="button-row">
            <Link className="button primary" href="/marketplace/s21-pro">
              Explore the S21 Pro <ArrowRight size={18} />
            </Link>
            <Link className="text-link" href="/calculator">
              Calculate your costs
            </Link>
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FROM CHOICE TO OWNERSHIP</span>
            <h2>
              A clear path.
              <br />
              At every step.
            </h2>
          </div>
          <Link className="text-link" href="/how-it-works">
            See how it works <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="journey-grid">
          {[
            {
              n: "01",
              title: "Find your machine",
              text: "Compare specifications and discuss your budget.",
              Icon: Cpu,
            },
            {
              n: "02",
              title: "Choose a location",
              text: "Confirm capacity, electricity pricing and service terms.",
              Icon: Globe2,
            },
            {
              n: "03",
              title: "Arrange deployment",
              text: "Agree installation details and commissioning milestones.",
              Icon: Wrench,
            },
            {
              n: "04",
              title: "Make it yours",
              text: "Set your payout destination and review your mining performance.",
              Icon: Wallet,
            },
          ].map(({ n, title, text, Icon }) => (
            <article className="journey-card" key={n}>
              <div className="card-top">
                <span className="mono">{n}</span>
                <Icon />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container section network-section">
        <div>
          <span className="eyebrow">REAL LOCATIONS. CLEAR CHOICES.</span>
          <h2>
            Think globally.
            <br />
            Choose deliberately.
          </h2>
          <p>
            Explore the Sazmining hosting network in the United States, Paraguay
            and Norway. Location, energy sourcing and service terms all matter
            to your decision.
          </p>
          <div className="location-tags">
            <span>Texas</span>
            <span>Paraguay</span>
            <span>Norway</span>
            <span>South Dakota</span>
          </div>
          <Link className="button primary" href="/facilities">
            Explore hosting locations <ArrowUpRight size={18} />
          </Link>
        </div>
        <figure className="network-photograph">
          <Image
            src="https://www.sazmining.com/images/texas.webp"
            alt="Sazmining Texas hosting facility"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </figure>
      </section>
      <section className="container section advisor-panel">
        <div>
          <span className="eyebrow">LET’S WORK THROUGH IT</span>
          <h2>
            A real conversation.
            <br />A clearer decision.
          </h2>
          <p>
            Questions about your first miner, scaling a fleet or choosing a
            location? Start with an advisor and work through the costs, risks
            and practical details.
          </p>
          <Link className="button primary" href="/contact">
            Talk to an advisor <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="advisor-topics">
          <div>
            <Cpu />
            <span>
              Hardware selection<small>Efficiency, power and budget</small>
            </span>
          </div>
          <div>
            <Zap />
            <span>
              Hosting economics<small>Tariffs, service fees and uptime</small>
            </span>
          </div>
          <div>
            <ShieldCheck />
            <span>
              Ownership & risk
              <small>Agreements, payouts and responsibilities</small>
            </span>
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DO THE MATH</span>
            <h2>
              Understand the cost.
              <br />
              Before you commit.
            </h2>
          </div>
          <p>
            Bitcoin mining is a business decision. Test your own revenue and
            cost assumptions with an estimator that shows its workings.
          </p>
        </div>
        <div className="economics-band">
          <div>
            <span className="eyebrow">YOUR INPUTS. YOUR DECISION.</span>
            <h3>Hashrate + energy + fees + uptime.</h3>
            <p>
              Evaluate operating surplus with exact monetary calculations.
              Include hardware, tax and other costs in your overall decision.
            </p>
          </div>
          <Link className="button primary" href="/calculator">
            Open the calculator <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="container section trust-section">
        <div>
          <span className="eyebrow">EVIDENCE OVER HYPE</span>
          <h2>
            Start with
            <br />
            better questions.
          </h2>
          <p>
            Ask about the equipment, the facility and the agreement. Explore
            customer feedback about Sazmining and discuss your own requirements
            with an advisor.
          </p>
          <a
            className="button secondary"
            href={commercial.reviews}
            target="_blank"
            rel="noreferrer"
          >
            Read Sazmining customer reviews <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="trust-principles">
          <div>
            <Fingerprint />
            <h3>Clear ownership</h3>
            <p>Know what you buy and the terms under which it is hosted.</p>
          </div>
          <div>
            <Wallet />
            <h3>Keep your keys</h3>
            <p>Never share a private key or Bitcoin recovery phrase.</p>
          </div>
          <div>
            <ShieldCheck />
            <h3>Understand the risks</h3>
            <p>Revenue varies. Equipment ages. Mining can make a loss.</p>
          </div>
        </div>
      </section>
      <section className="container section light-panel faq-section">
        <div>
          <span className="eyebrow">QUESTIONS, ANSWERED</span>
          <h2>
            Let’s make
            <br />
            mining clearer.
          </h2>
          <Link className="text-link" href="/faq">
            More answers <ArrowUpRight size={16} />
          </Link>
        </div>
        <FAQ />
      </section>
      <section className="container section newsletter-section">
        <div>
          <span className="eyebrow">STAY IN THE LOOP</span>
          <h2>
            A little more clarity.
            <br />
            In your inbox.
          </h2>
          <p>Subscribe for HashNomads news and Bitcoin mining updates.</p>
        </div>
        <Newsletter />
      </section>
      <section className="container closing-cta">
        <div>
          <span className="eyebrow">YOUR NEXT MOVE</span>
          <h2>
            Make ownership
            <br />
            part of your Bitcoin story.
          </h2>
        </div>
        <Link className="button primary" href="/contact">
          Start a conversation <ArrowUpRight size={18} />
        </Link>
      </section>
    </>
  );
}
