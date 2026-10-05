import { notFound } from "next/navigation";
import Link from "next/link";
import { FAQ } from "@/components/faq";
import { commercial } from "@/lib/commercial";
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
    title: "Your machine. A clear path.",
    eyebrow: "HOW IT WORKS",
    intro:
      "Make informed decisions about your equipment, hosting and Bitcoin ownership.",
    sections: [
      {
        title: "01 / Choose your hardware",
        body: "Review the manufacturer specifications and request a quote. Consider the machine’s efficiency, power requirements and expected operating costs alongside its purchase price.",
      },
      {
        title: "02 / Confirm hosting and terms",
        body: "Discuss your preferred location with an advisor. Your agreement should confirm capacity, electricity pricing, service fees, maintenance responsibilities and deployment expectations.",
      },
      {
        title: "03 / Purchase and deploy",
        body: "Review the final quote and purchase terms before making payment. Confirm the equipment identity and commissioning milestones as your mining equipment is installed.",
      },
      {
        title: "04 / Manage your mining",
        body: "Use the customer platform associated with your service agreement to monitor equipment and payouts. Keep your Bitcoin recovery phrase and private keys secure.",
      },
    ],
  },
  transparency: {
    title: "Trust starts with clarity.",
    eyebrow: "TRANSPARENCY & RISK",
    intro:
      "Understand the equipment, the costs and the risks before making a commitment.",
    sections: [
      {
        title: "Know your equipment",
        body: "Hardware specifications link to the manufacturer. Published nominal performance can differ from measured operation because of configuration, temperature and operating conditions.",
      },
      {
        title: "No guaranteed returns",
        body: "Bitcoin price, mining difficulty, network fees, energy costs, equipment reliability and downtime affect results. Mining can make a loss. Calculator outputs are estimates from your inputs, not a promise of income.",
      },
      {
        title: "Know the full cost",
        body: "Review hardware, installation, electricity, hosting, repair, pool fees and taxes. Your written quote and service agreement establish the applicable commercial terms.",
      },
      {
        title: "Keep control of your keys",
        body: "Only a public address is required to receive Bitcoin. Never share a recovery phrase, private key or wallet password with an advisor or in a contact form.",
      },
      {
        title: "Sources and availability",
        body: "Our facility directory cites Sazmining’s published locations and tariffs with a review date. Confirm availability and the terms of your own purchase with an advisor; directory information can change.",
      },
    ],
  },
  about: {
    title: "Ownership, with intention.",
    eyebrow: "ABOUT HASHNOMADS",
    intro:
      "HashNomads brings hardware, hosting information and human guidance together to help you make informed Bitcoin mining decisions.",
    sections: [
      {
        title: "A practical approach to Bitcoin",
        body: "Start with the machine, understand the energy requirements, and evaluate the costs. Ownership deserves clear information and a conversation about your goals.",
      },
      {
        title: "Connected expertise",
        body: "HashNomads and Sazmining share ownership. We draw on Sazmining’s published operating network and mining expertise while building a distinct HashNomads customer experience.",
      },
      {
        title: "Your decision, supported",
        body: "Discuss your hardware and hosting requirements with an advisor. Get a written quote and review the agreement before buying. Keep your Bitcoin wallet under your control.",
      },
    ],
  },
  faq: {
    title: "Clear answers. No hype.",
    eyebrow: "FREQUENTLY ASKED QUESTIONS",
    intro:
      "Understand hardware ownership, hosting costs and the decisions involved in mining Bitcoin.",
    sections: [],
  },
  legal: {
    title: "Clear terms. Better decisions.",
    eyebrow: "LEGAL & PRIVACY",
    intro:
      "Information about using this website, your account and the information you share with us.",
    sections: [
      {
        title: "Website information",
        body: "Site content provides general information about Bitcoin mining. It is not investment, tax or legal advice. Hardware specifications and sourced facility information do not reserve equipment or capacity. A written quote and accepted service agreement govern any purchase.",
      },
      {
        title: "Accounts and security",
        body: "Provide accurate account information and keep your password secure. Do not use another person’s account or interfere with the service. Never submit private keys, wallet recovery phrases or payment credentials through enquiry forms.",
      },
      {
        title: "Personal information",
        body: "Account registration stores your name, email address and a password hash. Sessions use cookies and may record connection metadata. Enquiry forms store your submitted contact details and message so your request can be handled. Newsletter forms store your email address, consent version and subscription status.",
      },
      {
        title: "Cookies and service providers",
        body: "Authentication uses essential cookies. The site and database are hosted by Vercel and Prisma Postgres. Contact-form rate limiting uses a keyed hash of the connection address rather than storing the address in the form-submission record. This site does not install advertising or analytics cookies.",
      },
      {
        title: "Your choices",
        body: "Newsletter consent is separate from making an enquiry. You can unsubscribe using the link displayed when subscribing. Contact us to request access, correction or deletion of your personal information. We retain information for the purpose for which it was collected and applicable service or legal obligations.",
      },
      {
        title: "External services and agreements",
        body: "Booking and source links identify external services, which have their own terms and privacy policies. Review the relevant hosting agreement and purchase documents for pricing, payments, deployment, maintenance, cancellations and refunds before placing an order.",
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
  const { slug } = await params;
  const c = content[slug];
  if (!c) notFound();
  return (
    <div className="container page editorial">
      <span className="eyebrow">{c.eyebrow}</span>
      <h1>{c.title}</h1>
      <p className="page-intro">{c.intro}</p>
      {slug === "faq" ? (
        <FAQ />
      ) : (
        <div className="editorial-sections">
          {c.sections.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              <p>{s.body}</p>
            </section>
          ))}
        </div>
      )}
      {slug === "legal" && (
        <div className="button-row">
          <a
            className="button secondary"
            href={commercial.terms}
            target="_blank"
            rel="noreferrer"
          >
            Sazmining service terms ↗
          </a>
          <a
            className="button secondary"
            href={commercial.privacy}
            target="_blank"
            rel="noreferrer"
          >
            Sazmining privacy policy ↗
          </a>
        </div>
      )}
      <div className="button-row">
        <Link className="button primary" href="/contact">
          Talk to an advisor
        </Link>
        <Link className="button secondary" href="/marketplace">
          Explore hardware
        </Link>
      </div>
    </div>
  );
}
