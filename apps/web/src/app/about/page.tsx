import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, KeyRound, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Meet HashNomads: an ownership-first approach to Bitcoin mining, with hardware information, hosting expertise and human guidance.",
};
export default function AboutPage() {
  return (
    <div className="container page about-page">
      <section className="about-hero">
        <div>
          <span className="eyebrow">ABOUT HASHNOMADS</span>
          <h1>
            Ownership,
            <br />
            with intention.
          </h1>
          <p className="page-intro">
            We bring hardware, hosting expertise and human guidance together to
            help you make informed Bitcoin mining decisions.
          </p>
          <Link className="button primary" href="/contact">
            Get to know us <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="about-image">
          <Image
            src="/images/mining-infrastructure.webp"
            alt="Mining infrastructure from the HashNomads presentation"
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            priority
          />
        </div>
      </section>
      <section className="about-story light-panel">
        <span className="eyebrow">OUR APPROACH</span>
        <h2>
          Start with the machine.
          <br />
          Understand the whole picture.
        </h2>
        <p>
          Bitcoin mining begins with physical equipment and the infrastructure
          that supports it. We believe the hardware, energy costs and service
          responsibilities should be clear before you make a commitment.
        </p>
        <p>
          HashNomads and Sazmining share ownership. We draw on Sazmining’s
          published operating network and mining expertise while building a
          distinct HashNomads customer experience.
        </p>
      </section>
      <section className="about-values" aria-label="What guides us">
        <article className="benefit-card">
          <Cpu aria-hidden="true" />
          <h3>Equipment you understand</h3>
          <p>
            Review manufacturer specifications and choose hardware that fits
            your goals and operating assumptions.
          </p>
        </article>
        <article className="benefit-card">
          <Compass aria-hidden="true" />
          <h3>Decisions with clarity</h3>
          <p>
            Discuss locations, energy costs and maintenance. Review a written
            quote and service agreement before buying.
          </p>
        </article>
        <article className="benefit-card">
          <KeyRound aria-hidden="true" />
          <h3>Your Bitcoin. Your control.</h3>
          <p>
            Keep your wallet under your control. We never need your private keys
            or recovery phrase.
          </p>
        </article>
      </section>
      <section className="about-contact">
        <span className="eyebrow">A CONVERSATION COMES FIRST</span>
        <h2>Let’s explore your next step.</h2>
        <p>
          Tell us what you want to achieve. We’ll help you understand the
          hardware and hosting questions to consider.
        </p>
        <div className="button-row">
          <Link className="button primary" href="/contact">
            Talk to HashNomads <ArrowUpRight size={18} />
          </Link>
          <Link className="button secondary" href="/facilities">
            Explore infrastructure
          </Link>
        </div>
      </section>
    </div>
  );
}
