import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ShieldCheck, ExternalLink, Activity, RefreshCw, AlertTriangle, Cpu } from 'lucide-react';
import { AsicMarketplace, Facilities, ProfitabilityCalculator, HowItWorks, SecuritySection } from '@v2/pages/LandingPage';

type Section = { title: string; paragraphs: string[]; href?: string; linkLabel?: string };
type Page = { label: string; title: string; intro: string; notice?: string; cards?: { title: string; detail: string }[]; sections?: Section[]; embedded?: 'marketplace'|'facilities'|'calculator'|'how-it-works'|'security'; action?: { to: string; label: string } };

export const publicPages: Record<string, Page> = {
  marketplace: {
    label: 'PLATFORM / ASIC MARKETPLACE', title: 'Own the machine. Understand the economics.',
    intro: 'Explore Bitcoin mining hardware by hashrate, power draw and efficiency. Confirm live inventory, purchase price, warranty and delivery terms with HashNomads before paying.',
    notice: 'Catalogue cards and example prices on the showcase are illustrative, not guaranteed inventory or binding offers.',
    embedded: 'marketplace',
    sections: [
      { title: 'Physical ownership', paragraphs: ['Our proposed ownership model ties an approved order to a particular ASIC and its serial number. Hardware must not be assigned until the payment is independently confirmed and physical availability is verified.'] },
      { title: 'What a written quote should cover', paragraphs: ['A quote should identify the manufacturer, model, condition, serial identification process, unit price, taxes, shipping, hosting setup charges, warranty, expected delivery and cancellation conditions.'] },
    ],
    action: { to: '/contact?topic=hardware', label: 'Request hardware information' },
  },
  facilities: {
    label: 'PLATFORM / HOSTING FACILITIES', title: 'Infrastructure that deserves scrutiny.',
    intro: 'Review what matters when choosing professional ASIC hosting: power reliability, cooling, connectivity, physical security, maintenance, and energy charges.',
    notice: 'No capacity, electricity tariff, geographic coverage or hosting partner shown here constitutes a confirmed HashNomads reservation. Availability and contracts must be independently verified.',
    embedded: 'facilities',
    sections: [
      { title: 'Before deployment', paragraphs: ['Customers should receive an identified hosting operator, location, custody arrangements, operating rules, service levels, maintenance terms, tariffs and a documented return or relocation process.'] },
      { title: 'Facility data and monitoring', paragraphs: ['Mining telemetry depends on the selected partner, the ASIC management layer, and an approved mining-pool integration. Until those integrations are live, no uptime or payout figure should be treated as verified.'] },
    ],
    action: { to: '/contact?topic=hosting', label: 'Discuss hosting requirements' },
  },
  calculator: {
    label: 'PLATFORM / MINING ECONOMICS', title: 'Model the numbers. Know the risk.',
    intro: 'Test different hashrate, power, electricity, mining-difficulty and Bitcoin-price assumptions before committing to hardware or hosting.',
    notice: 'Scenario outputs are estimates, not forecasts, investment advice or guaranteed rewards. Profitability can be negative.',
    embedded: 'calculator',
    sections: [
      { title: 'Costs beyond energy', paragraphs: ['Allow for equipment cost, hosting setup, pool charges, electricity, downtime, repairs, shipping, replacement parts, taxes and eventual resale value.'] },
      { title: 'What can change', paragraphs: ['Bitcoin price, network difficulty, block fees, halving events, uptime and cooling constraints can all change after you make a purchase. Recheck assumptions regularly.'] },
    ],
  },
  about: {
    label: 'COMPANY / ABOUT HASHNOMADS', title: 'Hardware ownership. Bitcoin control.',
    intro: 'HashNomads is being developed as an ownership-first hosted Bitcoin mining platform that connects identifiable mining equipment, professional infrastructure, and clear customer reporting.',
    cards: [
      { title: 'Understand the hardware', detail: 'Nominal performance, power demand, ownership identity and the full cost of operation should be transparent.' },
      { title: 'Know the operator', detail: 'A named hosting provider, contract and independently verified equipment assignment should underpin every live deployment.' },
      { title: 'Keep your keys', detail: 'Our intended reward path is mining pool to your own Bitcoin address. HashNomads does not need your private keys.' },
    ],
    sections: [
      { title: 'Our approach', paragraphs: ['We aim to make ASIC selection, hosting, order management and mining reporting available through one customer experience. The platform is under staged development; a polished interface does not mean physical inventory or partner capacity has already been confirmed.'] },
      { title: 'How HashNomads works', paragraphs: ['Customers review equipment and hosting terms, complete required checks, pay a verified invoice, receive a serial-linked equipment assignment and monitor an operating miner. Each step depends on actual supplier, hosting and payment approvals.'], href: '/how-it-works', linkLabel: 'Explore the process' },
      { title: 'Our operating principle', paragraphs: ['HashNomads manages miners. Customers control Bitcoin. This separation helps distinguish payments to the company from mined rewards belonging to customers.'] },
    ],
    action: { to: '/contact', label: 'Contact HashNomads' },
  },
  security: {
    label: 'COMPANY / SECURITY & COMPLIANCE', title: 'Trust requires verifiable controls.',
    intro: 'Our security architecture is designed around account protection, customer data isolation, hardware ownership evidence, payment reconciliation and customer-controlled Bitcoin destinations.',
    notice: 'Controls described as planned or required are not a certification, guarantee or claim that every production integration is active.',
    embedded: 'security',
    sections: [
      { title: 'Account and data protection', paragraphs: ['The platform uses server-managed authentication and authorization boundaries. Sensitive actions require appropriate identity checks, auditability and restricted access. Independent security testing is part of the production release requirements.'] },
      { title: 'Cryptocurrency payment integrity', paragraphs: ['A browser confirmation or redirect is never sufficient proof of payment. Final acceptance must rely on verified provider responses, signed webhooks, duplicate-event protection and settlement reconciliation.'] },
      { title: 'Wallet safety', paragraphs: ['Only public payout destinations belong in the account. Never send a private key, seed phrase, recovery code or wallet password to HashNomads. Changes to active payout destinations require additional verification before production activation.'] },
      { title: 'Regulatory checks', paragraphs: ['KYC, AML/sanctions, consumer protection, tax obligations, custody arrangements and mining-service rules must be assessed for each launch jurisdiction. Third-party identity checks are planned through Dojah, subject to onboarding and approval.'], href: '/kyc-requirements', linkLabel: 'KYC requirements' },
    ],
  },
  'how-it-works': {
    label: 'COMPANY / HOW IT WORKS', title: 'From equipment selection to verified rewards.',
    intro: 'Explore the proposed customer lifecycle, including where independent confirmations are essential.',
    notice: 'The six-step journey below is the product design. Live payment acceptance, hardware procurement, hosting and pool connections are subject to external approvals.',
    embedded: 'how-it-works',
    sections: [
      { title: 'Purchase and assignment', paragraphs: ['An order should move forward only when its price and terms are accepted, the payment provider independently confirms funds and the physical ASIC is matched to a verified serial number.'] },
      { title: 'Operation and Bitcoin rewards', paragraphs: ['A hosting operator deploys the ASIC and connects an identifiable worker to the selected pool. The preferred payout model directs mined BTC from that pool to the customer-controlled destination without a HashNomads-held customer Bitcoin balance.'] },
    ],
  },
  roadmap: {
    label: 'COMPANY / ROADMAP', title: 'Build the foundation before going live.',
    intro: 'HashNomads is following a staged engineering and commercial rollout. Milestones are plans and acceptance gates, not guarantees of specific launch dates.',
    cards: [
      { title: 'Phase 1 · Platform', detail: 'Approved V2 experience, PostgreSQL/Prisma architecture, account access, order and finance models, security boundaries and browser tests.' },
      { title: 'Phase 1 · Operational validation', detail: 'Provider adapters, signed payment events, verified wallet-change controls, pool/telemetry tests, billing reconciliation and an evidence-backed release review.' },
      { title: 'Phase 2 · Live hosting partners', detail: 'Contracted ASIC inventory, facility due diligence, availability, custody terms, insurance, support operations and jurisdictional compliance checks.' },
      { title: 'Later · Expansion', detail: 'Additional facilities, advanced fleet analytics and enterprise integrations only after actual operational demand and independent feasibility reviews.' },
    ],
    sections: [
      { title: 'How progress is assessed', paragraphs: ['An item is considered production-ready only after passing its functional, security, operational and compliance checks. A completed screen or sandbox demonstration is not confirmation of a real-world mining service.'] },
      { title: 'What comes next', paragraphs: ['The commercial launch depends on signed partner arrangements, payment merchant approval, live supplier inventory, KYC decisions and a proven incident/support process.'], href: '/status', linkLabel: 'Review current public status' },
    ],
  },
  documentation: {
    label: 'RESOURCES / DOCUMENTATION', title: 'Understand the platform before you use it.',
    intro: 'Customer-oriented documentation for accounts, equipment decisions, wallets, hosting and support. Detailed private infrastructure runbooks are not published on this page.',
    cards: [
      { title: 'Getting started', detail: 'Create your account, verify your email where prompted and review required identity checks before requesting a real-world service.' },
      { title: 'Choosing an ASIC', detail: 'Compare nominal hashrate, power, efficiency, cooling method and your total hosting/electricity assumptions.' },
      { title: 'Wallet destinations', detail: 'Use only a public Bitcoin receive address you control. Do not submit seed phrases or private keys.' },
      { title: 'Orders and payment', detail: 'Review the invoice, network, exchange-rate details and payment confirmation. Payment redirects do not prove settlement.' },
      { title: 'Telemetry and rewards', detail: 'Hashrate, uptime and pool-reported payouts become meaningful only when a physical miner and provider feed are linked.' },
      { title: 'Hosting and service', detail: 'Written hosting agreements should define costs, responsibilities, outage procedures, repair rights and equipment retrieval.' },
    ],
    sections: [
      { title: 'Customer guide', paragraphs: ['Start with hardware details, confirm a real hosting location and verify all written terms. Understand that estimated earnings and public product mockups cannot replace confirmed hardware or service contracts.'], href: '/how-it-works', linkLabel: 'Read the customer journey' },
      { title: 'Questions or account problems?', paragraphs: ['Signed-in customers can open support cases from the portal. General enquiries can use the public contact form.'], href: '/support', linkLabel: 'Visit support center' },
    ],
  },
  support: {
    label: 'RESOURCES / SUPPORT CENTER', title: 'Get help with HashNomads.',
    intro: 'Find the right route for account, billing, hosting, equipment and wallet-related questions. Never include secrets or recovery phrases in a support request.',
    cards: [
      { title: 'My account', detail: 'Sign in to review your profile, account notifications and support cases.' },
      { title: 'Orders and billing', detail: 'Include an order or invoice reference, but never payment-card details, seed phrases or private credentials.' },
      { title: 'Miner or hosting issue', detail: 'Provide the equipment or deployment reference, observed issue and time. Do not assume a demonstration miner is live inventory.' },
      { title: 'Wallet questions', detail: 'Support can explain public addresses and verification steps; no support representative needs your private keys.' },
    ],
    sections: [
      { title: 'Signed-in support cases', paragraphs: ['Customers can open a case and review submitted issues through the authenticated support portal.'], href: '/portal/support', linkLabel: 'Open customer support' },
      { title: 'General enquiries', paragraphs: ['For pre-sales questions or if you cannot sign in, use the public contact form. Avoid providing unnecessary personal or sensitive financial details.'], href: '/contact', linkLabel: 'Open contact form' },
      { title: 'Service updates', paragraphs: ['Review the technical availability endpoint and rollout disclosures. A successful web health check is not proof that any physical mining facility is online.'], href: '/status', linkLabel: 'Check platform status' },
    ],
  },
  'api-reference': {
    label: 'RESOURCES / API REFERENCE', title: 'Documented endpoints and boundaries.',
    intro: 'These endpoints describe the current website and application API surface. A public third-party mining or partner API has not been launched.',
    cards: [
      { title: 'GET /api/v1/health', detail: 'Website/database health response; 200 means application database reachable, while 503 denotes degraded database access. No mine/facility telemetry is checked.' },
      { title: 'POST /api/v1/enquiries', detail: 'Validated public contact form submission with origin, rate-limiting and anti-spam requirements.' },
      { title: 'POST /api/v1/newsletter', detail: 'Email subscription submission requiring explicit consent. An unsubscribe token is returned for the accepted submission.' },
      { title: 'DELETE /api/v1/newsletter', detail: 'Unsubscribe using the issued token. Do not share tokens publicly.' },
      { title: 'GET /api/v2/profile', detail: 'Private endpoint for the currently authenticated user. Returns 401 if unauthenticated.' },
      { title: '/api/v2/data · Internal', detail: 'Authenticated, restricted application adapter. Not a stable or supported public integration API.' },
    ],
    sections: [
      { title: 'Authentication', paragraphs: ['Protected endpoints require a valid application session. Internal endpoints are not permission to read another customer’s records or to submit payment/ownership changes.'] },
      { title: 'Commercial and mining integrations', paragraphs: ['External provider adapters for checkout, KYC, telemetry and mining pools have separate security gates and are not available as a documented public API.'], href: '/documentation', linkLabel: 'Read customer documentation' },
    ],
  },
  status: {
    label: 'RESOURCES / STATUS', title: 'Platform status and launch readiness.',
    intro: 'See a live check of the website database connection, plus the distinction between a reachable website and verified mining operations.',
    notice: 'This page does not monitor ASIC hardware, mining-pool rewards, data-center uptime, payment processors or third-party identity services. No public production uptime SLA is implied.',
    sections: [
      { title: 'Application infrastructure', paragraphs: ['The check below queries /api/v1/health and reports whether the server can reach its configured database. Authentication, payments, mining hardware and partner infrastructure have separate readiness requirements.'] },
      { title: 'Mining services and launch', paragraphs: ['Actual hosting capacity, verified pool telemetry, customer payouts and production crypto payment acceptance are not asserted live by this status page. Public launch depends on provider integrations and operational approval.'] },
    ],
  },
  terms: {
    label: 'LEGAL / TERMS OF SERVICE', title: 'Terms of Service.',
    intro: 'Important information about using this website, requesting information and the requirements for future hardware purchases and hosting services.',
    notice: 'Pre-launch legal draft for review. This page is informational and does not replace approved purchase, hosting, refund or jurisdiction-specific terms.',
    sections: [
      { title: '1. About this service', paragraphs: ['HashNomads is developing an ASIC mining marketplace and hosting-management platform. Browsing the website or creating an account does not reserve equipment, secure capacity or entitle a user to mining rewards.'] },
      { title: '2. Accounts and acceptable use', paragraphs: ['Users should provide accurate information, protect credentials and refrain from fraud, unauthorized access, harassment, scraping that disrupts service or attempts to manipulate payments and equipment ownership records.'] },
      { title: '3. Equipment and hosting', paragraphs: ['Hardware listings, performance specifications, availability estimates and tariffs are not binding offers. A written order, confirmed serial/ownership record and signed hosting agreement are required before any real purchase or deployment.'] },
      { title: '4. Payments, cancellation and refunds', paragraphs: ['Any production payment must be independently verified by an approved provider. Payment method, timing, refunds, taxes, shipping and cancellation rights will be governed by the approved quote, specific agreement and applicable law. No live checkout commitment is offered by this draft.'] },
      { title: '5. Mining outcomes and risk', paragraphs: ['Mining does not guarantee profit, Bitcoin price appreciation or equipment availability. Network difficulty, energy cost, maintenance, downtime and other conditions affect outcomes. Users should review the Risk Disclosure before proceeding.'], href: '/risk-disclosure', linkLabel: 'Read risk disclosure' },
      { title: '6. Wallet security and personal data', paragraphs: ['Customers retain responsibility for the security of private keys and recovery phrases. HashNomads does not ask for those secrets. Personal information handling is outlined separately in the Privacy Policy.'], href: '/privacy', linkLabel: 'Read privacy policy' },
      { title: '7. Final governing documents', paragraphs: ['The operating entity, eligible jurisdictions, legal effective date, dispute resolution, applicable governing law and consumer-specific rights must be confirmed by qualified counsel before formal acceptance. No placeholder terms should be interpreted as superseding mandatory consumer protections.'] },
    ],
  },
  privacy: {
    label: 'LEGAL / PRIVACY POLICY', title: 'Your data and how it is handled.',
    intro: 'A plain-language overview of the information used by the current HashNomads website and the additional processing expected if the mining platform launches.',
    notice: 'Pre-launch policy draft. Entity/controller identity, data processors, retention periods and jurisdiction-specific notices require legal and operational confirmation before production commerce.',
    sections: [
      { title: 'Information you provide', paragraphs: ['Account registration uses names, email addresses and protected password hashes. Contact and support requests can include your contact information, order references and the message you submit. Newsletter records hold an email address and consent information if you opt in.'] },
      { title: 'Technical and session information', paragraphs: ['Essential authentication cookies help maintain secure sessions. The service may process technical connection metadata to support rate limits, troubleshooting, integrity and abuse prevention.'] },
      { title: 'Identity verification', paragraphs: ['If production KYC is activated, a specialist provider such as Dojah may process identity evidence and verification results subject to its approved scope and privacy terms. Do not upload identification documents until an authorized verification flow is enabled.'], href: '/kyc-requirements', linkLabel: 'Read identity verification guidance' },
      { title: 'Payments and wallet addresses', paragraphs: ['Planned commerce records may include order status, provider transaction references and public Bitcoin payout addresses. Customer Bitcoin private keys, mnemonics or recovery phrases must never be supplied to or stored by HashNomads.'] },
      { title: 'Service providers', paragraphs: ['Website deployment uses Vercel; application data uses PostgreSQL/Prisma infrastructure. Any payment, KYC, email, support or mining partner that receives data must be disclosed and reviewed before relevant production services go live.'] },
      { title: 'Retention and safeguards', paragraphs: ['The operational policy will establish retention and deletion schedules based on service requirements, security needs and legal obligations. Access should be limited by role and privileged actions logged.'] },
      { title: 'Your choices and enquiries', paragraphs: ['You can opt out of marketing subscriptions and request information about correcting or deleting account data where applicable. Use the support route to request help with a privacy issue.'], href: '/support', linkLabel: 'Contact support' },
    ],
  },
  'risk-disclosure': {
    label: 'LEGAL / RISK DISCLOSURE', title: 'Bitcoin mining carries material risk.',
    intro: 'Understand the possibility of loss before paying for ASIC equipment, hosting, power, or related services.',
    notice: 'This is a general risk explanation, not personalized financial, investment, legal or tax advice. There is no guaranteed income or return.',
    sections: [
      { title: 'Bitcoin price and network difficulty', paragraphs: ['Mining revenue changes with Bitcoin market value, network hashrate, difficulty, transaction fees, block subsidy and halving events. Cash flow can decline significantly.'] },
      { title: 'Hardware depreciation and malfunction', paragraphs: ['ASIC miners consume energy, can fail or become uneconomical, and may lose resale value rapidly. Manufacturer specifications are not a promise of real-world results.'] },
      { title: 'Energy and hosting expenses', paragraphs: ['Electricity, facility fees, setup, service charges, maintenance, shipping, customs and taxes can outweigh mined rewards. Agreements may permit curtailment or outages.'] },
      { title: 'Operational, counterparty and legal risk', paragraphs: ['Hosting operators, pools, payment gateways, custody arrangements, internet providers and regulators can affect operations and access to funds. Supplier or facility interruption may delay deployment and equipment recovery.'] },
      { title: 'Crypto transaction and wallet risk', paragraphs: ['Bitcoin transfers may be irreversible. Incorrect network/address entry, lost keys, fraud or malicious wallet changes can cause permanent financial loss. HashNomads cannot recover a customer-controlled seed phrase.'] },
      { title: 'Scenario calculators', paragraphs: ['Calculator outputs are simplified assumptions and may exclude significant fees, downtime and taxes. They are not guarantees or approved revenue projections.'], href: '/calculator', linkLabel: 'Explore scenario estimates' },
      { title: 'Before committing', paragraphs: ['Seek independent professional advice where appropriate. Obtain a written hardware quote, clear ownership documentation, independently confirmed hosting terms and a realistic loss scenario.'] },
    ],
  },
  'kyc-requirements': {
    label: 'LEGAL / KYC REQUIREMENTS', title: 'Identity verification and eligibility.',
    intro: 'The intended onboarding process for determining whether a customer and a particular transaction are eligible for hosted ASIC mining services.',
    notice: 'Production KYC is not yet open. Dojah is the preferred verification provider, subject to approval; accepted countries, document types and review thresholds are not finalized.',
    sections: [
      { title: 'Why verification may be required', paragraphs: ['Identity and business checks may be necessary to comply with anti-fraud, anti-money-laundering, sanctions, consumer protection and crypto payment rules. The appropriate controls depend on jurisdiction and transaction type.'] },
      { title: 'Information that may be requested', paragraphs: ['Subject to legal review, verification can involve legal name, date of birth, residence, government identification, selfie/liveness checks, company details, beneficial ownership and source-of-funds information. Only submit these through an authorized, secure flow.'] },
      { title: 'Eligibility and restricted locations', paragraphs: ['An account does not guarantee permission to buy, receive hosting services or use a particular crypto network. Jurisdictions, age requirements, sanctions restrictions and onboarding criteria must be approved before live operations.'] },
      { title: 'Status and handling', paragraphs: ['Submitted checks may be pending, require additional information, be rejected or expire. Sensitive approval decisions must be made server-side and recorded rather than controlled through browser-only settings.'] },
      { title: 'Protect your information', paragraphs: ['Never send identification photos or financial documents in public comments, social media messages or unverified third-party forms. HashNomads will never require a Bitcoin wallet seed phrase as KYC evidence.'], href: '/privacy', linkLabel: 'Read privacy information' },
    ],
  },
};

function StatusPanel() {
  const [state, setState] = useState<'checking'|'available'|'degraded'|'error'>('checking');
  const [checkedAt, setCheckedAt] = useState('');
  const check = async () => {
    setState('checking');
    try {
      const response = await fetch('/api/v1/health', { cache: 'no-store' });
      const result = await response.json() as { status?: string };
      setState(response.ok && result.status === 'ok' ? 'available' : 'degraded');
    } catch { setState('error'); }
    setCheckedAt(new Date().toLocaleString());
  };
  useEffect(() => { void check(); }, []);
  const status = state === 'available' ? 'Database reachable' : state === 'checking' ? 'Checking...' : state === 'degraded' ? 'Database unavailable or degraded' : 'Check could not be completed';
  return (
    <div className="clay-lg p-6 sm:p-8 mb-12" role="status" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="clay-gold rounded-xl p-3"><Activity className="h-6 w-6 text-ink-950" /></div>
          <div><p className="text-xs uppercase tracking-widest font-mono text-gold-400">Website database health</p><h2 className="font-display text-xl sm:text-2xl font-semibold text-white mt-1">{status}</h2></div>
        </div>
        <button type="button" onClick={() => { void check(); }} className="clay-button-dark inline-flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh check
        </button>
      </div>
      {checkedAt && <p className="text-xs font-mono text-ink-400 mt-4">Checked {checkedAt}. Does not reflect mining facilities, payment processing or pool uptime.</p>}
    </div>
  );
}

const embeddedComponents = {
  marketplace: AsicMarketplace,
  facilities: Facilities,
  calculator: ProfitabilityCalculator,
  'how-it-works': HowItWorks,
  security: SecuritySection,
};

export function PublicContentPage({ slug }: { slug: string }) {
  const page = publicPages[slug];
  if (!page) return null;
  const Embedded = page.embedded ? embeddedComponents[page.embedded] : null;
  return (
    <main className="bg-ink-950 text-ink-100 min-h-screen" id="main">
      <div className="relative overflow-hidden border-b border-ink-800/50 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="absolute inset-0 bg-hero-radial opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label mb-5"><BookOpen className="w-3 h-3" />{page.label}</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white max-w-4xl leading-tight">{page.title}</h1>
          <p className="text-lg text-ink-300 mt-6 max-w-3xl leading-relaxed">{page.intro}</p>
          {page.notice && <div className="clay-sm rounded-xl max-w-3xl p-4 mt-8 flex gap-3 text-sm text-ink-200 leading-relaxed"><AlertTriangle className="h-5 w-5 shrink-0 text-gold-400" /><p>{page.notice}</p></div>}
        </div>
      </div>
      {Embedded && <Embedded />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {slug === 'status' && <StatusPanel />}
        {page.cards && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {page.cards.map((card) => (
              <article key={card.title} className="clay-lg p-6">
                <div className="h-10 w-10 rounded-xl clay-gold flex items-center justify-center mb-5"><ShieldCheck className="w-5 h-5 text-ink-950" /></div>
                <h2 className="font-display font-semibold text-xl text-white">{card.title}</h2>
                <p className="text-ink-300 text-sm leading-relaxed mt-3">{card.detail}</p>
              </article>
            ))}
          </div>
        )}
        {page.sections && (
          <div className="grid lg:grid-cols-2 gap-5">
            {page.sections.map((section) => (
              <section key={section.title} className="clay p-6 sm:p-8">
                <h2 className="font-display font-semibold text-xl sm:text-2xl text-white mb-4">{section.title}</h2>
                {section.paragraphs.map((paragraph, index) => <p key={index} className="text-sm sm:text-base leading-relaxed text-ink-300 mb-3">{paragraph}</p>)}
                {section.href && <Link to={section.href} className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 mt-3 text-sm font-medium">{section.linkLabel ?? 'Learn more'} <ArrowRight className="h-4 w-4" /></Link>}
              </section>
            ))}
          </div>
        )}
        {page.action && <div className="mt-12"><Link to={page.action.to} className="clay-button-gold inline-flex items-center gap-2">{page.action.label} <ArrowRight className="h-4 w-4" /></Link></div>}
        <div className="mt-16 flex flex-wrap gap-4 items-center border-t border-ink-800/50 pt-8">
          <Link to="/" className="text-sm text-ink-300 hover:text-gold-400 inline-flex items-center gap-2"><Cpu className="h-4 w-4" /> Home</Link>
          <Link to="/support" className="text-sm text-ink-300 hover:text-gold-400 inline-flex items-center gap-2"><ExternalLink className="h-4 w-4" /> Support Center</Link>
          <Link to="/risk-disclosure" className="text-sm text-ink-300 hover:text-gold-400 inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Risk Disclosure</Link>
        </div>
      </div>
    </main>
  );
}
