import { notFound } from "next/navigation";
import Link from "next/link";
const content: Record<
  string,
  {
    title: string;
    eyebrow: string;
    intro: string;
    sections: { title: string; body: string }[];
  }
> = {
  "how-it-works": {
    title: "From identity to hashrate.",
    eyebrow: "THE CUSTOMER JOURNEY",
    intro:
      "A transparent operating model connects hardware ownership, infrastructure, and pool reporting.",
    sections: [
      {
        title: "01 / Create an account & verify",
        body: "Create a secure account, complete your profile, and follow the sandbox KYC workflow. Production onboarding will require approved jurisdiction and compliance controls.",
      },
      {
        title: "02 / Choose hardware & infrastructure",
        body: "Review manufacturer specifications, choose a compatible hosting configuration, and run a scenario using explicit assumptions.",
      },
      {
        title: "03 / Pay through crypto checkout",
        body: "Commerce payments use provider-generated invoices and server-verified events. Browser redirects never mark an order paid. Live checkout is disabled.",
      },
      {
        title: "04 / Follow assignment & deployment",
        body: "The completed sandbox workflow will connect a SIM-prefixed ASIC identity, an ownership record, a deployment, and a worker. A simulation is never physical proof.",
      },
      {
        title: "05 / Monitor & control",
        body: "Source timestamps distinguish fresh, stale, and offline telemetry. Pool-reported rewards belong to a separate ledger and reference your customer-controlled payout destination.",
      },
    ],
  },
  transparency: {
    title: "Trust starts with clarity.",
    eyebrow: "TRANSPARENCY & RISK",
    intro:
      "HashNomads V1 is a digital sandbox. No live capacity, physical miner inventory, payments, or rewards are offered.",
    sections: [
      {
        title: "What is simulated",
        body: "Catalogue prices, reference facilities, energy tariffs, inventory identities, payment invoices, and future mining telemetry are explicitly labelled sandbox fixtures. Manufacturer ASIC specifications have a linked source.",
      },
      {
        title: "No guaranteed returns",
        body: "Mining outcomes depend on Bitcoin price, network difficulty, hashprice, uptime, energy costs, pool fees, and hardware performance. The calculator shows a scenario using manual assumptions and excludes hardware cost, taxes, and other unspecified expenses.",
      },
      {
        title: "Customers control Bitcoin",
        body: "HashNomads manages public payout destinations and pool reporting. We never need a recovery phrase or private key. Commerce payments and mining reward reporting are separate.",
      },
      {
        title: "Production remains gated",
        body: "Live sales require supplier and hosting agreements, verified capacity, payment and KYC activation, legal and compliance review, operational readiness, and acceptance evidence. No facility shown here is available for paid deployment.",
      },
    ],
  },
  about: {
    title: "Infrastructure for ownership.",
    eyebrow: "ABOUT HASHNOMADS",
    intro:
      "HashNomads is building an ownership-first Bitcoin mining platform, starting with the United States and Canada.",
    sections: [
      {
        title: "Own the machine. We run the infrastructure.",
        body: "The platform is designed around identifiable ASIC hardware, transparent hosting obligations, source-backed performance, and customer-controlled Bitcoin payout destinations.",
      },
      {
        title: "Build the digital lifecycle first",
        body: "Phase 1 establishes and validates a complete sandbox operating system. Physical hosting partnerships and commercial activation belong to a separate Phase 2 readiness process.",
      },
    ],
  },
  faq: {
    title: "Clear answers. No hype.",
    eyebrow: "FREQUENTLY ASKED QUESTIONS",
    intro: "Understand the product and the current sandbox boundary.",
    sections: [
      {
        title: "Can I buy a real miner today?",
        body: "No. This is a development sandbox. Catalogue prices are fixtures and no physical capacity, inventory, or live checkout is offered.",
      },
      {
        title: "Do you hold my mined Bitcoin?",
        body: "The architecture favors direct mining-pool payments to a customer-controlled Bitcoin wallet. HashNomads records pool reporting rather than a custodial customer balance.",
      },
      {
        title: "Will you ask for my recovery phrase?",
        body: "Never. Payout destination registration uses only a public Bitcoin address. Do not send private keys, seed phrases, or recovery material.",
      },
      {
        title: "Are calculator results a forecast?",
        body: "No. They are scenarios based on your inputs. Mining economics can deteriorate, and a loss is possible.",
      },
      {
        title: "Are the facilities real partners?",
        body: "No. Facility names and tariffs are simulated reference configurations. Production partners must pass physical and commercial validation.",
      },
    ],
  },
  legal: {
    title: "A clear sandbox boundary.",
    eyebrow: "LEGAL & PRIVACY / DRAFT",
    intro:
      "These development disclosures are not final customer contracts. Production legal documents require qualified review before live use.",
    sections: [
      {
        title: "Sandbox use",
        body: "This application is for evaluation of a simulated digital platform. It does not offer investments, guaranteed returns, production mining services, or available hosting capacity.",
      },
      {
        title: "Data minimization",
        body: "Use synthetic information while testing. Account registration stores email, name, a password hash, and session metadata. Never submit financial secrets, identity documents, recovery phrases, or private keys.",
      },
      {
        title: "Production documents outstanding",
        body: "Reviewed terms of service, privacy policy, retention policy, hosting contract, risk disclosures, refund policy, and jurisdiction-specific compliance obligations remain production dependencies.",
      },
    ],
  },
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: content[slug]?.title ?? "Not found" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    c = content[slug];
  if (!c) notFound();
  return (
    <div className="container page editorial">
      <span className="eyebrow">{c.eyebrow}</span>
      <h1>{c.title}</h1>
      <p className="page-intro">{c.intro}</p>
      <div className="editorial-sections">
        {c.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </section>
        ))}
      </div>
      <Link className="button secondary" href="/marketplace">
        Explore the sandbox catalogue
      </Link>
    </div>
  );
}
