import Link from "next/link";
import Image from "next/image";
import { MapPin, Globe2, ArrowUpRight } from "lucide-react";
import { facilities } from "@hashnomads/domain";
import { commercial } from "@/lib/commercial";
export const metadata = { title: "Hosting locations" };
export default function Page() {
  return (
    <div className="container page">
      <span className="eyebrow">HOSTING / THE SAZMINING NETWORK</span>
      <h1>
        Energy matters.
        <br />
        <span className="text-accent">Location does, too.</span>
      </h1>
      <p className="page-intro">
        Explore published hosting locations across three continents. Confirm
        capacity, tariffs and service terms with an advisor before selecting
        your location.
      </p>
      <div className="two-grid">
        {facilities.map((f) => (
          <article className="facility-card" key={f.id}>
            <div
              className={`facility-image ${f.image ? "" : "facility-map-art"}`}
            >
              {f.image ? (
                <Image
                  src={f.image}
                  alt={`${f.name} Sazmining facility`}
                  fill
                  sizes="(max-width: 800px) 100vw, 48vw"
                />
              ) : (
                <>
                  <Globe2 size={92} strokeWidth={0.6} />
                  <span>{f.country}</span>
                </>
              )}
            </div>
            <span className="pill">{f.status}</span>
            <h2>{f.name}</h2>
            <p>
              <MapPin size={16} />
              {f.region}
            </p>
            <div className="spec-rule">
              <span>Published electricity tariff</span>
              <b>{f.rate ? `$${f.rate}/kWh` : "Ask an advisor"}</b>
            </div>
            <div className="spec-rule">
              <span>Energy & infrastructure</span>
              <b>{f.climate}</b>
            </div>
            <Link
              className="button secondary"
              href={`/contact?topic=hosting&location=${f.id}`}
            >
              Discuss this location <ArrowUpRight size={16} />
            </Link>
          </article>
        ))}
      </div>
      <div className="source-note">
        <p>
          Source: Sazmining’s published facility directory. Checked{" "}
          {commercial.checkedAt}. These are Sazmining’s published tariffs and
          status; your HashNomads quote confirms the terms applicable to your
          purchase.
        </p>
        <a
          className="text-link"
          href={commercial.facilitiesSource}
          target="_blank"
          rel="noreferrer"
        >
          View facility information & service agreements{" "}
          <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  );
}
