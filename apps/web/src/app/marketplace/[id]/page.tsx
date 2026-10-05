import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogue } from "@hashnomads/domain";
import { HeroVisual } from "@/components/hero-visual";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: catalogue.find((m) => m.id === id)?.name ?? "Hardware not found",
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params,
    m = catalogue.find((m) => m.id === id);
  if (!m) notFound();
  return (
    <div className="container page">
      <Link className="text-link" href="/marketplace">
        All hardware
      </Link>
      <div className="detail-grid">
        <HeroVisual />
        <div>
          <span className="eyebrow">{m.manufacturer} / SHA–256</span>
          <h1>{m.name}</h1>
          <p className="page-intro">
            {m.cooling}. Nominal manufacturer specifications. Actual performance
            varies with environment and configuration.
          </p>
          <dl className="spec-list">
            {[
              ["Hashrate", `${m.hashrateTH} TH/s`],
              ["Power", `${m.powerW.toLocaleString("en-US")} W`],
              ["Efficiency", `${m.efficiency} J/TH`],
              ["Hardware pricing", "Request a quote"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="button-row">
            <Link className="button primary" href="/contact?topic=hardware">
              Request pricing
            </Link>
            <Link className="button secondary" href="/calculator">
              Model this ASIC
            </Link>
            <Link className="button secondary" href="/facilities">
              Explore infrastructure
            </Link>
          </div>
          <div className="callout">
            Your written quote confirms the hardware price, availability,
            hosting location and commercial terms before purchase.
          </div>
          <a
            className="text-link"
            href={m.source}
            target="_blank"
            rel="noreferrer"
          >
            Manufacturer specification source
          </a>
        </div>
      </div>
    </div>
  );
}
